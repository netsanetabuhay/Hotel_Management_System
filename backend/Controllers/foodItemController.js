// Import from Models
const {
  createFoodItem,
  findAllFoodItems,
  findFoodItemById,
  findFoodItemsByCategory,
  searchFoodItemsByName,
  updateFoodItem,
  deleteFoodItem,
  getFoodStats,
  getAllCategories
} = require('../Models/foodItem');

const { generateId } = require('../Utils/generateId');

// Helper response functions
const sendSuccess = (res, message, data = null, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

const sendError = (res, message, statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    message
  });
};

//  CREATE FOOD ITEM 
const createFoodItemHandler = async (req, res) => {
  try {
    const { name, category, price, description } = req.body;
    
    if (!name || !category || !price) {
      return sendError(res, 'Name, category, and price are required', 400);
    }
    
    if (isNaN(price) || parseFloat(price) <= 0) {
      return sendError(res, 'Price must be a positive number', 400);
    }
    
    const food_id = generateId('FD');
    const foodData = {
      food_id,
      name,
      category,
      price: parseFloat(price).toFixed(2),
      description: description || null,
      created_at: new Date()
    };
    
    await createFoodItem(foodData);
    
    return sendSuccess(res, 'Food item created successfully', foodData, 201);
  } catch (error) {
    console.error('Create food item error:', error);
    if (error.message.includes('already exists')) {
      return sendError(res, error.message, 409);
    }
    return sendError(res, 'Failed to create food item: ' + error.message, 500);
  }
};

//  GET ALL FOOD ITEMS 
const getAllFoodItems = async (req, res) => {
  try {
    const filters = {
      category: req.query.category,
      min_price: req.query.min_price,
      max_price: req.query.max_price
    };
    
    Object.keys(filters).forEach(key => {
      if (filters[key] === undefined || filters[key] === '') delete filters[key];
    });
    
    const foodItems = await findAllFoodItems(filters);
    
    return sendSuccess(res, 'Food items retrieved successfully', {
      count: foodItems.length,
      food_items: foodItems
    });
  } catch (error) {
    console.error('Get all food items error:', error);
    return sendError(res, 'Failed to retrieve food items', 500);
  }
};

//  UNIFIED SEARCH 
const searchFoodItems = async (req, res) => {
  try {
    const { identifier } = req.params;
    
    console.log('🔍 FOOD SEARCH DEBUG:');
    console.log('Identifier:', identifier);
    console.log('Starts with FD?:', identifier.toUpperCase().startsWith('FD'));
    
    if (!identifier || identifier === 'undefined') {
      // If no identifier, return all food items
      const allItems = await findAllFoodItems({});
      return sendSuccess(res, 'All food items retrieved', {
        count: allItems.length,
        food_items: allItems
      });
    }
    
    // 1. Check if it's a food_id (starts with FD)
    if (identifier.toUpperCase().startsWith('FD')) {
      console.log(' Trying ID search...');
      const foodItem = await findFoodItemById(identifier);
      console.log('ID search result:', foodItem ? 'FOUND' : 'NOT FOUND');
      
      if (foodItem) {
        return sendSuccess(res, 'Food item found by ID', foodItem);
      }
    }
    
    // 2. Check if it's a common category
    const commonCategories = ['breakfast', 'lunch', 'dinner', 'beverage', 'dessert', 'snack', 'appetizer'];
    if (commonCategories.includes(identifier.toLowerCase())) {
      console.log(' Trying category search...');
      const itemsByCategory = await findFoodItemsByCategory(identifier.toLowerCase());
      console.log('Category search result count:', itemsByCategory.length);
      
      if (itemsByCategory.length > 0) {
        return sendSuccess(res, `Food items found in ${identifier} category`, {
          category: identifier.toLowerCase(),
          count: itemsByCategory.length,
          food_items: itemsByCategory
        });
      }
    }
    
    // 3. Try name search (for everything else)
    console.log(' Trying name search...');
    const itemsByName = await searchFoodItemsByName(identifier);
    console.log('Name search result count:', itemsByName.length);
    
    if (itemsByName.length > 0) {
      return sendSuccess(res, 'Food items found by name', {
        search_term: identifier,
        count: itemsByName.length,
        food_items: itemsByName
      });
    }
    
    console.log(' No results found for:', identifier);
    return sendError(res, 'No food items found matching your search', 404);
    
  } catch (error) {
    console.error(' Search food items error:', error);
    return sendError(res, 'Server error during search', 500);
  }
};

//  UPDATE FOOD ITEM 
const updateFoodItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Validate price if provided
    if (updateData.price !== undefined) {
      if (isNaN(updateData.price) || parseFloat(updateData.price) <= 0) {
        return sendError(res, 'Price must be a positive number', 400);
      }
      updateData.price = parseFloat(updateData.price).toFixed(2);
    }
    
    const existingFoodItem = await findFoodItemById(id);
    if (!existingFoodItem) {
      return sendError(res, 'Food item not found', 404);
    }
    
    const result = await updateFoodItem(id, updateData);
    
    if (!result.success) {
      return sendError(res, result.message, 400);
    }
    
    const updatedItem = await findFoodItemById(id);
    return sendSuccess(res, 'Food item updated successfully', updatedItem);
  } catch (error) {
    console.error('Update food item error:', error);
    return sendError(res, 'Server error updating food item', 500);
  }
};

//  DELETE FOOD ITEM 
const deleteFoodItem = async (req, res) => {
  try {
    const { id } = req.params;
    const existingFoodItem = await findFoodItemById(id);
    
    if (!existingFoodItem) {
      return sendError(res, 'Food item not found', 404);
    }
    
    const result = await deleteFoodItem(id);
    
    if (!result.success) {
      return sendError(res, 'Failed to delete food item', 400);
    }
    
    return sendSuccess(res, 'Food item deleted successfully', {
      food_id: id,
      name: existingFoodItem.name
    });
  } catch (error) {
    console.error('Delete food item error:', error);
    return sendError(res, 'Failed to delete food item', 500);
  }
};

//  GET FOOD STATISTICS 
const getFoodStatistics = async (req, res) => {
  try {
    const stats = await getFoodStats();
    const categories = await getAllCategories();
    
    return sendSuccess(res, 'Food statistics retrieved successfully', {
      total_categories: categories.length,
      categories: categories,
      statistics: stats
    });
  } catch (error) {
    console.error('Get food statistics error:', error);
    return sendError(res, 'Failed to retrieve food statistics', 500);
  }
};

//  EXPORTS 
module.exports = {
  createFoodItem: createFoodItemHandler,
  getAllFoodItems,
  updateFoodItem,
  deleteFoodItem,
  searchFoodItems,
  getFoodStatistics
};
EOF