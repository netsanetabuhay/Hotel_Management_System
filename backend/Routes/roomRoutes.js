const express = require('express');
const router = express.Router();
const {
    createRoomController,
    getAllRoomsController,
    getAvailableRoomsController,
    searchAvailableRoomsController,
    updateRoomController,
    deleteRoomController,
    getRoomStatsController,
    checkRoomAvailabilityController
} = require('../Controllers/roomController');
const { authenticate, authorize } = require('../Middleware/auth');

// All room routes require authentication
router.use(authenticate);

// Public routes (for all authenticated users)
router.get('/available', getAvailableRoomsController);
router.get('/search', searchAvailableRoomsController);
router.get('/check-availability', checkRoomAvailabilityController);

// Admin only routes
router.get('/', authorize(['admin']), getAllRoomsController);
router.post('/', authorize(['admin']), createRoomController);
router.put('/:id', authorize(['admin']), updateRoomController);
router.delete('/:id', authorize(['admin']), deleteRoomController);
router.get('/stats/overview', authorize(['admin']), getRoomStatsController);

module.exports = router;