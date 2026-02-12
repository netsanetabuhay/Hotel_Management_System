const express = require('express');
const router = express.Router();
const {
    getAllRoomsController,
    searchRoomsController,
    createRoomController,
    updateRoomController,
    deleteRoomController,
    getRoomStatsController
} = require('../Controllers/roomController');
const { authenticate, authorize } = require('../Middleware/auth');

// All room routes require authentication
router.use(authenticate);

// 1. Get rooms (smart: admin sees all, user sees available)
router.get('/available', getAllRoomsController);

// 2. Search available rooms by parameter
router.get('/search/:param', searchRoomsController);

// Admin only routes
router.post('/', authorize(['admin']), createRoomController);
router.patch('/:id', authorize(['admin']), updateRoomController);
router.delete('/:id', authorize(['admin']), deleteRoomController);
router.get('/stats/overview', authorize(['admin']), getRoomStatsController);

module.exports = router;