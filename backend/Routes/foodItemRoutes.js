const express = require('express');
const router = express.Router();

// Import controller functions
const {
  createFoodItem,
  getAllFoodItems,
  updateFoodItem,
  deleteFoodItem,
  searchFoodItems // ONE unified search function for all
} = require('../Controllers/foodItemController');

// Import auth middleware
const { authenticate, authorize } = require('../Middleware/auth');

//  PUBLIC ROUTES 
router.get('/', getAllFoodItems); // View menu (public)
router.get('/search/:identifier', searchFoodItems); // UNIFIED SEARCH: ID, Category, Name

//  PROTECTED ROUTES 
// Create food item (Admin/Manager/Chef only)
router.post('/', authenticate, authorize(['admin', 'manager', 'chef']), createFoodItem);

// Update food item (Admin/Manager/Chef only)
router.put('/:id', authenticate, authorize(['admin', 'manager', 'chef']), updateFoodItem);

// Delete food item (Admin/Manager only)
router.delete('/:id', authenticate, authorize(['admin', 'manager']), deleteFoodItem);

module.exports = router;