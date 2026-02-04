const { pool } = require('../Config/database');
const { generateId } = require('../Utils/generateId');

// 1. Create food order with items
const createFoodOrder = async (orderData, orderItems) => {
    const connection = await pool.getConnection();
    
    try {
        await connection.beginTransaction();
        
        // Create main order
        const orderQuery = `
            INSERT INTO food_orders 
            (food_order_id, user_id, order_status, payment_status, order_place)
            VALUES (?, ?, ?, ?, ?)
        `;
        await connection.execute(orderQuery, [
            orderData.food_order_id,
            orderData.user_id,
            orderData.order_status,
            orderData.payment_status,
            orderData.order_place
        ]);
        
        // Create order items
        for (const item of orderItems) {
            const itemQuery = `
                INSERT INTO food_order_items 
                (food_order_id, food_id, quantity, price)
                VALUES (?, ?, ?, ?)
            `;
            await connection.execute(itemQuery, [
                orderData.food_order_id,
                item.food_id,
                item.quantity,
                item.price
            ]);
        }
        
        await connection.commit();
        return { success: true, orderId: orderData.food_order_id };
        
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

// 2. Get orders with filters
const getFoodOrders = async (filters = {}, userId = null, isAdmin = false) => {
    let query = `
        SELECT 
            fo.*,
            u.username,
            u.email
        FROM food_orders fo
        JOIN users u ON fo.user_id = u.user_id
        WHERE 1=1
    `;
    
    const params = [];
    
    // User restriction: non-admin users only see their own orders
    if (!isAdmin && userId) {
        query += ' AND fo.user_id = ?';
        params.push(userId);
    }
    
    // Apply filters
    if (filters.order_status) {
        query += ' AND fo.order_status = ?';
        params.push(filters.order_status);
    }
    
    if (filters.payment_status) {
        query += ' AND fo.payment_status = ?';
        params.push(filters.payment_status);
    }
    
    if (filters.order_id) {
        query += ' AND fo.food_order_id = ?';
        params.push(filters.order_id);
    }
    
    if (filters.created_from) {
        query += ' AND DATE(fo.created_at) >= ?';
        params.push(filters.created_from);
    }
    
    if (filters.created_to) {
        query += ' AND DATE(fo.created_at) <= ?';
        params.push(filters.created_to);
    }
    
    // Admin-only filters
    if (isAdmin) {
        if (filters.user_id) {
            query += ' AND fo.user_id = ?';
            params.push(filters.user_id);
        }
    }
    
    query += ' ORDER BY fo.created_at DESC';
    
    const [rows] = await pool.execute(query, params);
    return rows;
};

// 3. Get order by ID with items
const getFoodOrderByIdWithItems = async (orderId) => {
    // Get order details
    const orderQuery = `
        SELECT 
            fo.*,
            u.username,
            u.email
        FROM food_orders fo
        JOIN users u ON fo.user_id = u.user_id
        WHERE fo.food_order_id = ?
    `;
    const [orderRows] = await pool.execute(orderQuery, [orderId]);
    
    if (orderRows.length === 0) {
        return { order: null, items: [] };
    }
    
    // Get order items
    const itemsQuery = `
        SELECT 
            foi.*,
            fi.name,
            fi.category,
            fi.description
        FROM food_order_items foi
        JOIN food_items fi ON foi.food_id = fi.food_id
        WHERE foi.food_order_id = ?
        ORDER BY foi.id
    `;
    const [itemRows] = await pool.execute(itemsQuery, [orderId]);
    
    // Calculate total
    const total = itemRows.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    return {
        order: { ...orderRows[0], total },
        items: itemRows
    };
};

// 4. Check if user owns the order
const checkFoodOrderOwnership = async (orderId, userId) => {
    const query = 'SELECT food_order_id FROM food_orders WHERE food_order_id = ? AND user_id = ?';
    const [rows] = await pool.execute(query, [orderId, userId]);
    return rows.length > 0;
};

// 5. Update food order (status/payment - admin only)
const updateFoodOrder = async (orderId, updateData) => {
    const fields = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updateData);
    values.push(orderId);
    
    const query = `UPDATE food_orders SET ${fields} WHERE food_order_id = ?`;
    const [result] = await pool.execute(query, values);
    return result;
};

// 6. Delete food order (admin only)
const deleteFoodOrder = async (orderId) => {
    const connection = await pool.getConnection();
    
    try {
        await connection.beginTransaction();
        
        // Delete order items first
        const deleteItemsQuery = 'DELETE FROM food_order_items WHERE food_order_id = ?';
        await connection.execute(deleteItemsQuery, [orderId]);
        
        // Delete order
        const deleteOrderQuery = 'DELETE FROM food_orders WHERE food_order_id = ?';
        await connection.execute(deleteOrderQuery, [orderId]);
        
        await connection.commit();
        return { success: true };
        
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

// 7. Get food order statistics
const getFoodOrderStats = async () => {
    // Total orders by status
    const statusQuery = `
        SELECT 
            order_status,
            COUNT(*) as count,
            SUM(CASE WHEN payment_status = 'paid' THEN 1 ELSE 0 END) as paid_count
        FROM food_orders 
        GROUP BY order_status
        ORDER BY order_status
    `;
    const [statusResult] = await pool.execute(statusQuery);
    
    // Daily orders (last 7 days)
    const dailyQuery = `
        SELECT 
            DATE(created_at) as date,
            COUNT(*) as order_count,
            SUM(
                (SELECT SUM(foi.quantity * foi.price) 
                 FROM food_order_items foi 
                 WHERE foi.food_order_id = fo.food_order_id)
            ) as daily_revenue
        FROM food_orders fo
        WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
        GROUP BY DATE(created_at)
        ORDER BY date DESC
    `;
    const [dailyResult] = await pool.execute(dailyQuery);
    
    // Most popular food items
    const popularItemsQuery = `
        SELECT 
            fi.food_id,
            fi.name,
            fi.category,
            SUM(foi.quantity) as total_quantity,
            COUNT(DISTINCT foi.food_order_id) as order_count,
            SUM(foi.quantity * foi.price) as total_revenue
        FROM food_order_items foi
        JOIN food_items fi ON foi.food_id = fi.food_id
        GROUP BY fi.food_id, fi.name, fi.category
        ORDER BY total_quantity DESC
        LIMIT 10
    `;
    const [popularItemsResult] = await pool.execute(popularItemsQuery);
    
    // Revenue by order place
    const revenueByPlaceQuery = `
        SELECT 
            order_place,
            COUNT(*) as order_count,
            SUM(
                (SELECT SUM(foi.quantity * foi.price) 
                 FROM food_order_items foi 
                 WHERE foi.food_order_id = fo.food_order_id)
            ) as total_revenue
        FROM food_orders fo
        WHERE order_place IS NOT NULL
        GROUP BY order_place
        ORDER BY total_revenue DESC
    `;
    const [revenueByPlaceResult] = await pool.execute(revenueByPlaceQuery);
    
    return {
        byStatus: statusResult,
        dailyOrders: dailyResult,
        popularItems: popularItemsResult,
        revenueByPlace: revenueByPlaceResult
    };
};

// 8. Get food price for order
const getFoodPrice = async (foodId) => {
    const query = 'SELECT price FROM food_items WHERE food_id = ?';
    const [rows] = await pool.execute(query, [foodId]);
    return rows[0]?.price || 0;
};

module.exports = {
    createFoodOrder,
    getFoodOrders,
    getFoodOrderByIdWithItems,
    checkFoodOrderOwnership,
    updateFoodOrder,
    deleteFoodOrder,
    getFoodOrderStats,
    getFoodPrice
};