const { pool } = require('../Config/database');

// 1. Search food items with filters
const searchFoodItems = async (filters) => {
    let query = 'SELECT * FROM food_items WHERE 1=1';
    const params = [];
    
    // Apply filters
    if (filters.category) {
        query += ' AND category = ?';
        params.push(filters.category);
    }
    
    if (filters.search) {
        query += ' AND (name LIKE ? OR description LIKE ?)';
        const searchTerm = `%${filters.search}%`;
        params.push(searchTerm, searchTerm);
    }
    
    if (filters.food_id) {
        query += ' AND food_id = ?';
        params.push(filters.food_id);
    }
    
    if (filters.price_min) {
        query += ' AND price >= ?';
        params.push(parseFloat(filters.price_min));
    }
    
    if (filters.price_max) {
        query += ' AND price <= ?';
        params.push(parseFloat(filters.price_max));
    }
    
    query += ' ORDER BY category, name';
    
    const [rows] = await pool.execute(query, params);
    return rows;
};

// 2. Get all food items (admin only)
const getAllFoodItems = async () => {
    const query = 'SELECT * FROM food_items ORDER BY category, name';
    const [rows] = await pool.execute(query);
    return rows;
};

// 3. Get food item by ID
const getFoodItemById = async (foodId) => {
    const query = 'SELECT * FROM food_items WHERE food_id = ?';
    const [rows] = await pool.execute(query, [foodId]);
    return rows;
};

// 4. Check if food name exists
const checkFoodNameExists = async (name) => {
    const query = 'SELECT food_id FROM food_items WHERE name = ?';
    const [rows] = await pool.execute(query, [name]);
    return rows;
};

// 5. Check if food name exists excluding current item
const checkFoodNameExistsExcluding = async (name, excludeFoodId) => {
    const query = 'SELECT food_id FROM food_items WHERE name = ? AND food_id != ?';
    const [rows] = await pool.execute(query, [name, excludeFoodId]);
    return rows;
};

// 6. Create new food item
const createFoodItem = async (foodData) => {
    const query = `
        INSERT INTO food_items (food_id, name, category, price, description)
        VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await pool.execute(query, [
        foodData.food_id,
        foodData.name,
        foodData.category,
        foodData.price,
        foodData.description || null
    ]);
    return result;
};

// 7. Update food item
const updateFoodItem = async (foodId, updateData) => {
    const fields = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updateData);
    values.push(foodId);
    
    const query = `UPDATE food_items SET ${fields} WHERE food_id = ?`;
    const [result] = await pool.execute(query, values);
    return result;
};

// 8. Delete food item
const deleteFoodItem = async (foodId) => {
    const query = 'DELETE FROM food_items WHERE food_id = ?';
    const [result] = await pool.execute(query, [foodId]);
    return result;
};

// 9. Check if food item has orders
const checkFoodItemOrders = async (foodId) => {
    const query = `
        SELECT foi.id 
        FROM food_order_items foi
        WHERE foi.food_id = ?
        LIMIT 1
    `;
    const [rows] = await pool.execute(query, [foodId]);
    return rows;
};

// 10. Get all unique categories
const getAllCategories = async () => {
    const query = 'SELECT DISTINCT category FROM food_items ORDER BY category';
    const [rows] = await pool.execute(query);
    return rows.map(row => row.category);
};

module.exports = {
    searchFoodItems,
    getAllFoodItems,
    getFoodItemById,
    checkFoodNameExists,
    checkFoodNameExistsExcluding,
    createFoodItem,
    updateFoodItem,
    deleteFoodItem,
    checkFoodItemOrders,
    getAllCategories
};