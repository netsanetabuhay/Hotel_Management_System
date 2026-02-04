const express = require('express');
const router = express.Router();
const {
    createReservationController,
    getReservationsController,
    updateReservationController,
    deleteReservationController,
    getReservationStatsController
} = require('../Controllers/reservationController');
const { authenticate, authorize } = require('../Middleware/auth');

// All reservation routes require authentication
router.use(authenticate);

// 1. Create reservation (users only)
router.post('/', createReservationController);

// 2. Get reservations (smart: user sees own, admin sees all)
router.get('/', getReservationsController);

// 3. Update reservation (admin only)
router.patch('/:id', authorize(['admin']), updateReservationController);

// 4. Delete reservation (admin only)
router.delete('/:id', authorize(['admin']), deleteReservationController);

// 5. Get statistics (admin only)
router.get('/stats/overview', authorize(['admin']), getReservationStatsController);

module.exports = router;