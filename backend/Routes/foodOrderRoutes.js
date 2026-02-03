const express = require('express');
const router = express.Router();
const {
    createFoodOrderController,
    getFoodOrdersController,
    updateFoodOrderController,
    deleteFoodOrderController,
    getFoodOrderStatsController
} = require('../Controllers/foodOrderController.js');
const { authenticate, authorize } = require('../Middleware/auth');

// All routes require authentication
router.use(authenticate);

// 1. Create food order (users only)
router.post('/', createFoodOrderController);

// 2. Get food orders (smart: user sees own, admin sees all)
router.get('/', getFoodOrdersController);

// 3. Update food order (user: update/cancel pending, admin can update payment status and satus of the order ordered by user )
router.patch('/:id', updateFoodOrderController);

// 4. Delete food order (user: delete pending, admin: delete any)
router.delete('/:id', deleteFoodOrderController);

// 5. Get statistics (admin only)
router.get('/stats/overview', authorize(['admin']), getFoodOrderStatsController);

module.exports = router;