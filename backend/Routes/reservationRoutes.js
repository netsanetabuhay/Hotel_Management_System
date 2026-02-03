const express = require('express');
const router = express.Router();
const {
    createReservationController,
    getReservationsController,
    updateReservationController,
    deleteReservationController,
    getReservationStatsController
} = require('../Controllers/reservationController.js');
const { authenticate, authorize } = require('../Middleware/auth.js');

// All reservation routes require authentication
router.use(authenticate);

// 1. Create reservation (users only)
router.post('/', createReservationController);

// 2. Get reservations (smart: admin gets all, user gets own)
router.get('/', getReservationsController);

// 3. Update reservation (admin: all fields, user: dates only)
router.patch('/:id', updateReservationController);

// 4. Delete reservation (admin: any, user: own only)
router.delete('/:id', deleteReservationController);

// 5. Get statistics (admin only)
router.get('/stats/overview', authorize(['admin']), getReservationStatsController);

module.exports = router;