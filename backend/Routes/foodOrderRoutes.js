const express = require('express');
const router = express.Router();

// Import controller functions
const {
  createFoodOrder,
  getAllFoodOrders,
  updateFoodOrder,
  deleteFoodOrder,
  updateFoodOrderStatus,
  searchFoodOrders
} = require('../Controllers/foodOrderController');

// Import auth middleware
const { authenticate, authorize } = require('../Middleware/auth');

//  PUBLIC ROUTES 
// Guest can create food order
router.post('/', createFoodOrder);

//  PROTECTED ROUTES 
// Get all food orders (Staff only)
router.get('/', authenticate, authorize(['admin', 'manager', 'chef', 'waiter', 'receptionist']), getAllFoodOrders);

// UNIFIED SEARCH for food orders
router.get('/search/:identifier', authenticate, authorize(['admin', 'manager', 'chef', 'waiter', 'receptionist']), searchFoodOrders);

// Update food order (Staff only)
router.put('/:id', authenticate, authorize(['admin', 'manager', 'chef', 'waiter']), updateFoodOrder);

// Update food order status (Kitchen staff)
router.patch('/:id/status', authenticate, authorize(['admin', 'manager', 'chef', 'waiter']), updateFoodOrderStatus);

// Delete food order (Admin/Manager only)
router.delete('/:id', authenticate, authorize(['admin', 'manager']), deleteFoodOrder);

module.exports = router;