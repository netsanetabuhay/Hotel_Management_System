const express = require('express');
const router = express.Router();
const {
    searchFoodItemsController,
    createFoodItemController,
    updateFoodItemController,
    deleteFoodItemController,
    getAllCategoriesController
} = require('../Controllers/foodItemController');
const { authenticate, authorize } = require('../Middleware/auth');

// All routes require authentication
router.use(authenticate);

// 1. Main search route (for all users)
router.get('/', searchFoodItemsController);

// 2. Get categories (for all users)
router.get('/categories', getAllCategoriesController);

// Admin only routes
router.post('/', authorize(['admin']), createFoodItemController);
router.patch('/:id', authorize(['admin']), updateFoodItemController);
router.delete('/:id', authorize(['admin']), deleteFoodItemController);

module.exports = router;