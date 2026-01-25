const { pool } = require('../Config/database');

// CREATE - Add new food item
const createFoodItem = async (foodData) => {
  const sql = `
    INSERT INTO food_items 
      (food_id, name, category, price, description) 
    VALUES 
      (?, ?, ?, ?, ?)
  `;
  
  const values = [
    foodData.food_id,
    foodData.name,
    foodData.category,
    foodData.price,
    foodData.description || null
  ];

  try {
    const [result] = await pool.query(sql, values);
    return { 
      success: true, 
      message: 'Food item created successfully',
      foodId: foodData.food_id 
    };
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw new Error('Food item already exists');
    }
    throw error;
  }
};

// READ - Get all food items with filters
const findAllFoodItems = async (filters = {}) => {
  let sql = 'SELECT * FROM food_items WHERE 1 = 1';
  const values = [];

  if (filters.category) {
    sql += ' AND category = ?';
    values.push(filters.category);
  }
  
  if (filters.min_price) {
    sql += ' AND price >= ?';
    values.push(parseFloat(filters.min_price));
  }
  
  if (filters.max_price) {
    sql += ' AND price <= ?';
    values.push(parseFloat(filters.max_price));
  }

  sql += ' ORDER BY category, name ASC';

  try {
    const [rows] = await pool.query(sql, values);
    return rows;
  } catch (error) {
    throw error;
  }
};

// READ - Get single food item by ID
const findFoodItemById = async (food_id) => {
  const sql = 'SELECT * FROM food_items WHERE food_id = ?';
  
  try {
    const [rows] = await pool.query(sql, [food_id]);
    
    if (rows.length === 0) {
      return null;
    }
    
    return rows[0];
  } catch (error) {
    throw error;
  }
};

// READ - Get food items by category
const findFoodItemsByCategory = async (category) => {
  const sql = 'SELECT * FROM food_items WHERE category = ? ORDER BY name ASC';
  
  try {
    const [rows] = await pool.query(sql, [category]);
    return rows;
  } catch (error) {
    throw error;
  }
};

// READ - Search food items by name
const searchFoodItemsByName = async (query) => {
  const sql = 'SELECT * FROM food_items WHERE name LIKE ? ORDER BY name ASC';
  
  try {
    const [rows] = await pool.query(sql, [`%${query}%`]);
    return rows;
  } catch (error) {
    throw error;
  }
};

// UPDATE - Update food item details
const updateFoodItem = async (food_id, updateData) => {
  const setClauses = [];
  const values = [];

  const { name, category, price, description } = updateData;

  if (name !== undefined) {
    setClauses.push('name = ?');
    values.push(name);
  }
  
  if (category !== undefined) {
    setClauses.push('category = ?');
    values.push(category);
  }

  if (price !== undefined) {
    setClauses.push('price = ?');
    values.push(parseFloat(price).toFixed(2));
  }

  if (description !== undefined) {
    setClauses.push('description = ?');
    values.push(description || null);
  }

  if (setClauses.length === 0) {
    return { 
      success: false, 
      message: 'No fields provided for update' 
    };
  }

  values.push(food_id);

  const sql = `UPDATE food_items SET ${setClauses.join(', ')} WHERE food_id = ?`;

  try {
    const [result] = await pool.query(sql, values);
    
    return { 
      success: result.affectedRows > 0,
      message: result.affectedRows > 0 ? 'Food item updated successfully' : 'Food item not found',
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

// DELETE - Remove food item
const deleteFoodItem = async (food_id) => {
  const sql = 'DELETE FROM food_items WHERE food_id = ?';
  
  try {
    const [result] = await pool.query(sql, [food_id]);
    
    return { 
      success: result.affectedRows > 0,
      message: result.affectedRows > 0 ? 'Food item deleted successfully' : 'Food item not found',
      affectedRows: result.affectedRows 
    };
  } catch (error) {
    throw error;
  }
};

// READ - Get food statistics
const getFoodStats = async () => {
  const sql = `
    SELECT 
      COUNT(*) as total_items,
      category,
      COUNT(*) as category_count,
      AVG(price) as avg_price,
      MIN(price) as min_price,
      MAX(price) as max_price
    FROM food_items 
    GROUP BY category
    ORDER BY category_count DESC
  `;
  
  try {
    const [rows] = await pool.query(sql);
    return rows;
  } catch (error) {
    throw error;
  }
};

// READ - Get all categories
const getAllCategories = async () => {
  const sql = 'SELECT DISTINCT category FROM food_items ORDER BY category';
  
  try {
    const [rows] = await pool.query(sql);
    return rows.map(row => row.category);
  } catch (error) {
    throw error;
  }
};

// Export all functions
module.exports = {
  createFoodItem,
  findAllFoodItems,
  findFoodItemById,
  findFoodItemsByCategory,
  searchFoodItemsByName,
  updateFoodItem,
  deleteFoodItem,
  getFoodStats,
  getAllCategories
};