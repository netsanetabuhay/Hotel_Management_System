const { pool } = require('../Config/database');

// CREATE - Create new food order
const createFoodOrder = async (orderData) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    // 1. Create the main food order
    const orderSql = `
      INSERT INTO food_orders 
        (order_id, guest_id, room_id, order_type, status, total_amount, created_at) 
      VALUES 
        (?, ?, ?, ?, ?, ?, ?)
    `;
    
    const orderValues = [
      orderData.order_id,
      orderData.guest_id,
      orderData.room_id,
      orderData.order_type || 'room_service',
      orderData.status || 'pending',
      orderData.total_amount || 0.00,
      orderData.created_at || new Date()
    ];
    
    await connection.query(orderSql, orderValues);
    
    // 2. Create order items if provided
    if (orderData.items && orderData.items.length > 0) {
      const itemSql = `
        INSERT INTO order_items 
          (order_id, food_id, quantity, price) 
        VALUES 
          (?, ?, ?, ?)
      `;
      
      for (const item of orderData.items) {
        await connection.query(itemSql, [
          orderData.order_id,
          item.food_id,
          item.quantity,
          item.price
        ]);
      }
    }
    
    await connection.commit();
    
    return { 
      success: true, 
      message: 'Food order created successfully',
      orderId: orderData.order_id 
    };
    
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

// READ - Get all food orders with filters
const findAllFoodOrders = async (filters = {}) => {
  let sql = `
    SELECT fo.*, 
           g.first_name as guest_first_name,
           g.last_name as guest_last_name,
           g.email as guest_email,
           r.room_number,
           r.room_type
    FROM food_orders fo
    LEFT JOIN guests g ON fo.guest_id = g.guest_id
    LEFT JOIN rooms r ON fo.room_id = r.room_id
    WHERE 1 = 1
  `;
  
  const values = [];

  if (filters.guest_id) {
    sql += ' AND fo.guest_id = ?';
    values.push(filters.guest_id);
  }
  
  if (filters.room_id) {
    sql += ' AND fo.room_id = ?';
    values.push(filters.room_id);
  }
  
  if (filters.status) {
    sql += ' AND fo.status = ?';
    values.push(filters.status);
  }
  
  if (filters.order_type) {
    sql += ' AND fo.order_type = ?';
    values.push(filters.order_type);
  }
  
  if (filters.start_date) {
    sql += ' AND DATE(fo.created_at) >= ?';
    values.push(filters.start_date);
  }
  
  if (filters.end_date) {
    sql += ' AND DATE(fo.created_at) <= ?';
    values.push(filters.end_date);
  }

  sql += ' ORDER BY fo.created_at DESC';

  try {
    const [rows] = await pool.query(sql, values);
    
    // Get order items for each order
    for (const order of rows) {
      const [items] = await pool.query(
        'SELECT oi.*, fi.name as food_name, fi.category FROM order_items oi LEFT JOIN food_items fi ON oi.food_id = fi.food_id WHERE oi.order_id = ?',
        [order.order_id]
      );
      order.items = items;
    }
    
    return rows;
  } catch (error) {
    throw error;
  }
};

// READ - Get single food order by ID
const findFoodOrderById = async (order_id) => {
  try {
    // Get main order details
    const [orders] = await pool.query(
      `SELECT fo.*, 
              g.first_name as guest_first_name,
              g.last_name as guest_last_name,
              g.email as guest_email,
              g.phone as guest_phone,
              r.room_number,
              r.room_type
       FROM food_orders fo
       LEFT JOIN guests g ON fo.guest_id = g.guest_id
       LEFT JOIN rooms r ON fo.room_id = r.room_id
       WHERE fo.order_id = ?`,
      [order_id]
    );
    
    if (orders.length === 0) {
      return null;
    }
    
    const order = orders[0];
    
    // Get order items
    const [items] = await pool.query(
      `SELECT oi.*, 
              fi.name as food_name, 
              fi.category,
              fi.description
       FROM order_items oi 
       LEFT JOIN food_items fi ON oi.food_id = fi.food_id 
       WHERE oi.order_id = ?`,
      [order_id]
    );
    
    order.items = items;
    
    return order;
  } catch (error) {
    throw error;
  }
};

// READ - Get food orders by guest ID
const findFoodOrdersByGuestId = async (guest_id) => {
  const sql = `
    SELECT fo.*, r.room_number, r.room_type 
    FROM food_orders fo
    LEFT JOIN rooms r ON fo.room_id = r.room_id
    WHERE fo.guest_id = ? 
    ORDER BY fo.created_at DESC
  `;
  
  try {
    const [rows] = await pool.query(sql, [guest_id]);
    
    // Get order items for each order
    for (const order of rows) {
      const [items] = await pool.query(
        'SELECT oi.*, fi.name as food_name FROM order_items oi LEFT JOIN food_items fi ON oi.food_id = fi.food_id WHERE oi.order_id = ?',
        [order.order_id]
      );
      order.items = items;
    }
    
    return rows;
  } catch (error) {
    throw error;
  }
};

// READ - Get food orders by room ID
const findFoodOrdersByRoomId = async (room_id) => {
  const sql = `
    SELECT fo.*, 
           g.first_name as guest_first_name,
           g.last_name as guest_last_name
    FROM food_orders fo
    LEFT JOIN guests g ON fo.guest_id = g.guest_id
    WHERE fo.room_id = ? 
    ORDER BY fo.created_at DESC
  `;
  
  try {
    const [rows] = await pool.query(sql, [room_id]);
    
    // Get order items for each order
    for (const order of rows) {
      const [items] = await pool.query(
        'SELECT oi.*, fi.name as food_name FROM order_items oi LEFT JOIN food_items fi ON oi.food_id = fi.food_id WHERE oi.order_id = ?',
        [order.order_id]
      );
      order.items = items;
    }
    
    return rows;
  } catch (error) {
    throw error;
  }
};

// READ - Search food orders (unified search)
const searchFoodOrders = async (query) => {
  const sql = `
    SELECT fo.*, 
           g.first_name as guest_first_name,
           g.last_name as guest_last_name,
           g.email as guest_email,
           r.room_number
    FROM food_orders fo
    LEFT JOIN guests g ON fo.guest_id = g.guest_id
    LEFT JOIN rooms r ON fo.room_id = r.room_id
    WHERE fo.order_id LIKE ? 
       OR g.first_name LIKE ? 
       OR g.last_name LIKE ? 
       OR g.email LIKE ? 
       OR r.room_number LIKE ?
       OR fo.status LIKE ?
    ORDER BY fo.created_at DESC
  `;
  
  try {
    const searchPattern = `%${query}%`;
    const [rows] = await pool.query(sql, [
      searchPattern, searchPattern, searchPattern, 
      searchPattern, searchPattern, searchPattern
    ]);
    
    // Get order items for each order
    for (const order of rows) {
      const [items] = await pool.query(
        'SELECT oi.*, fi.name as food_name FROM order_items oi LEFT JOIN food_items fi ON oi.food_id = fi.food_id WHERE oi.order_id = ?',
        [order.order_id]
      );
      order.items = items;
    }
    
    return rows;
  } catch (error) {
    throw error;
  }
};

// UPDATE - Update food order details
const updateFoodOrder = async (order_id, updateData) => {
  const setClauses = [];
  const values = [];

  const { guest_id, room_id, order_type, status, total_amount } = updateData;

  if (guest_id !== undefined) {
    setClauses.push('guest_id = ?');
    values.push(guest_id);
  }
  
  if (room_id !== undefined) {
    setClauses.push('room_id = ?');
    values.push(room_id);
  }

  if (order_type !== undefined) {
    setClauses.push('order_type = ?');
    values.push(order_type);
  }

  if (status !== undefined) {
    setClauses.push('status = ?');
    values.push(status);
  }

  if (total_amount !== undefined) {
    setClauses.push('total_amount = ?');
    values.push(parseFloat(total_amount).toFixed(2));
  }

  if (setClauses.length === 0) {
    return { 
      success: false, 
      message: 'No fields provided for update' 
    };
  }

  values.push(order_id);

  const sql = `UPDATE food_orders SET ${setClauses.join(', ')} WHERE order_id = ?`;

  try {
    const [result] = await pool.query(sql, values);
    
    return { 
      success: result.affectedRows > 0,
      message: result.affectedRows > 0 ? 'Food order updated successfully' : 'Food order not found',
      affectedRows: result.affectedRows 
    };
  } catch (error) {
    console.error('Update error:', error);
    return { 
      success: false,
      message: error.message || 'Database error during update'
    };
  }
};

// UPDATE - Update food order status only
const updateFoodOrderStatus = async (order_id, status) => {
  const sql = 'UPDATE food_orders SET status = ? WHERE order_id = ?';
  
  try {
    const [result] = await pool.query(sql, [status, order_id]);
    
    return { 
      success: result.affectedRows > 0,
      message: result.affectedRows > 0 ? 'Food order status updated' : 'Food order not found',
      affectedRows: result.affectedRows 
    };
  } catch (error) {
    console.error('Update status error:', error);
    throw error;
  }
};

// DELETE - Remove food order
const deleteFoodOrder = async (order_id) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    // First delete order items
    await connection.query('DELETE FROM order_items WHERE order_id = ?', [order_id]);
    
    // Then delete the order
    const [result] = await connection.query('DELETE FROM food_orders WHERE order_id = ?', [order_id]);
    
    await connection.commit();
    
    return { 
      success: result.affectedRows > 0,
      message: result.affectedRows > 0 ? 'Food order deleted successfully' : 'Food order not found',
      affectedRows: result.affectedRows 
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

// READ - Get food order statistics
const getFoodOrderStats = async () => {
  const sql = `
    SELECT 
      COUNT(*) as total_orders,
      status,
      COUNT(*) as status_count,
      SUM(total_amount) as total_revenue,
      DATE(created_at) as date,
      COUNT(*) as daily_count
    FROM food_orders 
    GROUP BY status, DATE(created_at)
    ORDER BY DATE(created_at) DESC, status_count DESC
  `;
  
  try {
    const [rows] = await pool.query(sql);
    return rows;
  } catch (error) {
    throw error;
  }
};

// Export all functions
module.exports = {
  createFoodOrder,
  findAllFoodOrders,
  findFoodOrderById,
  findFoodOrdersByGuestId,
  findFoodOrdersByRoomId,
  searchFoodOrders,
  updateFoodOrder,
  updateFoodOrderStatus,
  deleteFoodOrder,
  getFoodOrderStats
};