const express = require('express');
const router = express.Router();

// Import all RoomController functions literally
const {
   createRoomController,
    getAllRoomsController,
    searchRoomsController,
    updateRoomController,
    deleteRoomController,
    getRoomStatsController
}
 = require('../Controllers/roomController.js');

// Import auth middleware functions literally
const { authenticate, authorize, checkUserAccess } = require('../Middleware/auth');


// Public routes - No authentication required for viewing rooms
router.get('/', getAllRoomsController);
router.get('/search', searchRoomsController);

// Protected routes - Authentication and authorization required
router.get('/stats', authenticate, authorize(['admin']), getRoomStatsController);
router.post('/', authenticate, authorize(['admin']), createRoomController);
router.put('/:id', authenticate, authorize(['admin']), updateRoomController);
router.delete('/:id', authenticate, authorize(['admin']), deleteRoomController);
module.exports = router;