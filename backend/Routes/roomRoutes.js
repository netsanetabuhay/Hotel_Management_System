const express = require('express');
const router = express.Router();

// Import all RoomController functions literally
const {
  getAllRooms,
  getAvailableRooms,
  getRoomStatistics,
  searchRooms,
  getRoomById,
  getRoomByNumber,
  createRoom,
  updateRoom,
  updateRoomStatus,
  deleteRoom
} = require('../Controllers/roomController');

// Import auth middleware functions literally
const { authenticate, authorize, checkUserAccess } = require('../Middleware/auth');

// ROOM MANAGEMENT ROUTES - WITH ROLE-BASED AUTHENTICATION

// Public routes - No authentication required for viewing rooms
router.get('/', getAllRooms);
router.get('/search', searchRooms);
router.get('/status/available', getAvailableRooms);  //  getAvailableRooms,
router.get('/id/:id', getRoomById);
router.get('/number/:room_number', getRoomByNumber);


// Protected routes - Authentication and authorization required
router.get('/stats', authenticate, authorize(['admin', 'manager']), getRoomStatistics);
router.post('/', authenticate, authorize(['admin', 'manager']), createRoom);
router.put('/:id', authenticate, authorize(['admin', 'manager']), updateRoom);
router.patch('/statusupdate/:id', authenticate, authorize(['admin', 'manager', 'receptionist', 'housekeeping']), updateRoomStatus);
router.delete('/:id', authenticate, authorize(['admin']), deleteRoom);
module.exports = router;