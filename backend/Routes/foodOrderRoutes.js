const express = require('express');
const router = express.Router();
const {
    createFoodOrderController,
    getFoodOrdersController,
    updateFoodOrderController,
    deleteFoodOrderController,
    getFoodOrderStatsController
} = require('../Controllers/foodOrderController');
const { authenticate, authorize } = require('../Middleware/auth');

// All routes require authentication
router.use(authenticate);

// 1. Create food order (users only)
router.post('/', createFoodOrderController);

// 2. Get food orders (smart: user sees own, admin sees all)
router.get('/', getFoodOrdersController);

// 3. Update food order (admin only)
router.patch('/:id', authorize(['admin']), updateFoodOrderController);

// 4. Delete food order (admin only)
router.delete('/:id', authorize(['admin']), deleteFoodOrderController);

// 5. Get statistics (admin only)
router.get('/stats/overview', authorize(['admin']), getFoodOrderStatsController);

module.exports = router;