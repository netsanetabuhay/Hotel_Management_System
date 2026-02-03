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
} = require('../Models/foodItem');

// 1. Search food items (main function for users)
const searchFoodItemsController = async (req, res) => {
    try {
        const { category, search, food_id, price_min, price_max } = req.query;
        const isAdmin = req.user.role === 'admin';
        
        // For non-admin users: require at least one search parameter
        if (!isAdmin) {
            const hasNoParams = !category && !search && !food_id && !price_min && !price_max;
            if (hasNoParams) {
                return res.status(400).json({
                    success: false,
                    message: 'Please provide at least one search parameter: category, search, food_id, price_min, or price_max'
                });
            }
        }
        
        const filters = {};
        if (category) filters.category = category;
        if (search) filters.search = search;
        if (food_id) filters.food_id = food_id;
        if (price_min) filters.price_min = price_min;
        if (price_max) filters.price_max = price_max;
        
        let foodItems;
        let message;
        
        if (isAdmin && Object.keys(filters).length === 0) {
            // Admin with no filters: get all items
            foodItems = await getAllFoodItems();
            message = 'All food items retrieved (Admin view)';
        } else {
            // Either user with filters, or admin with filters
            foodItems = await searchFoodItems(filters);
            message = Object.keys(filters).length > 0 
                ? 'Food items retrieved with filters' 
                : 'Food items retrieved';
        }
        
        // If searching by food_id and found, return single object
        if (food_id && foodItems.length === 1) {
            return res.json({
                success: true,
                message: 'Food item found',
                data: foodItems[0]
            });
        }
        
        res.json({
            success: true,
            message,
            data: foodItems
        });

    } catch (error) {
        console.error('Search food items error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error searching food items',
            error: error.message
        });
    }
};

// 2. Create food item (admin only)
const createFoodItemController = async (req, res) => {
    try {
        const { name, category, price, description } = req.body;

        // Validation
        if (!name || !category || !price) {
            return res.status(400).json({
                success: false,
                message: 'Name, category, and price are required'
            });
        }

        // Check if food name already exists
        const existingFood = await checkFoodNameExists(name);
        if (existingFood.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Food item with this name already exists'
            });
        }

        // Validate price
        if (price <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Price must be greater than 0'
            });
        }

        // Generate food ID
        const foodId = 'FOD' + Date.now();

        // Create food item
        const foodData = {
            food_id: foodId,
            name,
            category,
            price: parseFloat(price),
            description: description || null
        };

        await createFoodItem(foodData);

        // Get created food item
        const createdFood = await getFoodItemById(foodId);
        const foodItem = createdFood[0];

        res.status(201).json({
            success: true,
            message: 'Food item created successfully',
            data: foodItem
        });

    } catch (error) {
        console.error('Create food item error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error creating food item',
            error: error.message
        });
    }
};

// 3. Update food item (admin only)
const updateFoodItemController = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, category, price, description } = req.body;
        
        // Check if food item exists
        const foodItems = await getFoodItemById(id);
        if (foodItems.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Food item not found'
            });
        }

        const existingFood = foodItems[0];
        const updateData = {};
        
        // Prepare update data
        if (name !== undefined) {
            // Check if new name already exists (excluding current item)
            const existingName = await checkFoodNameExistsExcluding(name, id);
            if (existingName.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Food item with this name already exists'
                });
            }
            updateData.name = name;
        }
        
        if (category !== undefined) {
            updateData.category = category;
        }
        
        if (price !== undefined) {
            if (price <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Price must be greater than 0'
                });
            }
            updateData.price = parseFloat(price);
        }
        
        if (description !== undefined) {
            updateData.description = description || null;
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No fields to update'
            });
        }

        // Update food item
        await updateFoodItem(id, updateData);

        // Get updated food item
        const updatedFood = await getFoodItemById(id);
        const foodItem = updatedFood[0];

        res.json({
            success: true,
            message: 'Food item updated successfully',
            data: foodItem
        });

    } catch (error) {
        console.error('Update food item error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error updating food item',
            error: error.message
        });
    }
};

// 4. Delete food item (admin only)
const deleteFoodItemController = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Check if food item exists
        const foodItems = await getFoodItemById(id);
        if (foodItems.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Food item not found'
            });
        }

        // Check if food item has existing orders
        const hasOrders = await checkFoodItemOrders(id);
        if (hasOrders.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete food item with existing orders'
            });
        }

        // Delete food item
        await deleteFoodItem(id);

        res.json({
            success: true,
            message: 'Food item deleted successfully'
        });

    } catch (error) {
        console.error('Delete food item error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error deleting food item',
            error: error.message
        });
    }
};

// 5. Get all categories
const getAllCategoriesController = async (req, res) => {
    try {
        const categories = await getAllCategories();

        res.json({
            success: true,
            message: 'Food categories retrieved',
            data: categories
        });

    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error retrieving categories',
            error: error.message
        });
    }
};

module.exports = {
    searchFoodItemsController,
    createFoodItemController,
    updateFoodItemController,
    deleteFoodItemController,
    getAllCategoriesController
};