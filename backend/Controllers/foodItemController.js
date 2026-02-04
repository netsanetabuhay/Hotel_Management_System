const {
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
} = require('../Models/foodItem.js');

const { sendSuccess, sendError } = require('../Utils/response');
const { generateId } = require('../Utils/generateId');

// 1. Search food items (normal website search - NO search required)
const searchFoodItemsController = async (req, res) => {
    try {
        const { category, search, food_id, price_min, price_max } = req.query;
        
        const filters = {};
        if (category) filters.category = category;
        if (search) filters.search = search;
        if (food_id) filters.food_id = food_id;
        if (price_min) filters.price_min = price_min;
        if (price_max) filters.price_max = price_max;
        
        let foodItems;
        let message;
        
        // Normal search: if no filters, show all items
        if (Object.keys(filters).length === 0) {
            foodItems = await getAllFoodItems();
            message = 'All food items retrieved';
        } else {
            // If filters exist, apply them
            foodItems = await searchFoodItems(filters);
            message = 'Food items retrieved with filters';
        }
        
        // If searching by food_id and found, return single object
        if (food_id && foodItems.length === 1) {
            return sendSuccess(res, 'Food item found', foodItems[0]);
        }
        
        return sendSuccess(res, message, foodItems);

    } catch (error) {
        console.error('Search food items error:', error);
        return sendError(res, 'Server error searching food items');
    }
};

// 2. Create food item (admin only)
const createFoodItemController = async (req, res) => {
    try {
        const { name, category, price, description } = req.body;

        if (!name || !category || !price) {
            return sendError(res, 'Name, category, and price are required', 400);
        }

        const existingFood = await checkFoodNameExists(name);
        if (existingFood.length > 0) {
            return sendError(res, 'Food item with this name already exists', 400);
        }

        if (price <= 0) {
            return sendError(res, 'Price must be greater than 0', 400);
        }

        const foodId = generateId('FOD');
        const foodData = {
            food_id: foodId,
            name,
            category,
            price: parseFloat(price),
            description: description || null
        };

        await createFoodItem(foodData);
        const createdFood = await getFoodItemById(foodId);
        const foodItem = createdFood[0];

        return sendSuccess(res, 'Food item created successfully', foodItem, 201);

    } catch (error) {
        console.error('Create food item error:', error);
        return sendError(res, 'Server error creating food item');
    }
};

// 3. Update food item (admin only)
const updateFoodItemController = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, category, price, description } = req.body;
        
        const foodItems = await getFoodItemById(id);
        if (foodItems.length === 0) {
            return sendError(res, 'Food item not found', 404);
        }

        const updateData = {};
        
        if (name !== undefined) {
            const existingName = await checkFoodNameExistsExcluding(name, id);
            if (existingName.length > 0) {
                return sendError(res, 'Food item with this name already exists', 400);
            }
            updateData.name = name;
        }
        
        if (category !== undefined) {
            updateData.category = category;
        }
        
        if (price !== undefined) {
            if (price <= 0) {
                return sendError(res, 'Price must be greater than 0', 400);
            }
            updateData.price = parseFloat(price);
        }
        
        if (description !== undefined) {
            updateData.description = description || null;
        }

        if (Object.keys(updateData).length === 0) {
            return sendError(res, 'No fields to update', 400);
        }

        await updateFoodItem(id, updateData);
        const updatedFood = await getFoodItemById(id);
        const foodItem = updatedFood[0];

        return sendSuccess(res, 'Food item updated successfully', foodItem);

    } catch (error) {
        console.error('Update food item error:', error);
        return sendError(res, 'Server error updating food item');
    }
};

// 4. Delete food item (admin only)
const deleteFoodItemController = async (req, res) => {
    try {
        const { id } = req.params;
        
        const foodItems = await getFoodItemById(id);
        if (foodItems.length === 0) {
            return sendError(res, 'Food item not found', 404);
        }

        const hasOrders = await checkFoodItemOrders(id);
        if (hasOrders.length > 0) {
            return sendError(res, 'Cannot delete food item with existing orders', 400);
        }

        await deleteFoodItem(id);

        return sendSuccess(res, 'Food item deleted successfully');

    } catch (error) {
        console.error('Delete food item error:', error);
        return sendError(res, 'Server error deleting food item');
    }
};

// 5. Get all categories
const getAllCategoriesController = async (req, res) => {
    try {
        const categories = await getAllCategories();
        return sendSuccess(res, 'Food categories retrieved', categories);

    } catch (error) {
        console.error('Get categories error:', error);
        return sendError(res, 'Server error retrieving categories');
    }
};

module.exports = {
    searchFoodItemsController,
    createFoodItemController,
    updateFoodItemController,
    deleteFoodItemController,
    getAllCategoriesController
};