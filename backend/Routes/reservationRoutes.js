const express = require('express');
const router = express.Router();

// Import controller functions
const {
  createReservation,
  getAllReservations,
  searchReservations, // ONE unified search
  updateReservation,
  updateReservationStatus,
  deleteReservation,
  checkAvailability,
  findAvailableRooms
} = require('../Controllers/reservationController');

// Import auth middleware
const { authenticate, authorize } = require('../Middleware/auth');

// RESERVATION MANAGEMENT ROUTES

//  PUBLIC ROUTES 
router.get('/check-availability/:room_id', checkAvailability);
router.get('/available-rooms', findAvailableRooms);

//  PROTECTED ROUTES 

// Create new reservation
router.post('/', authenticate, authorize(['admin', 'use']), createReservation);

// Get all reservations
router.get('/', authenticate, authorize(['admin', 'user']), getAllReservations);

// SMART UNIFIED SEARCH - ONE route for ALL searches
router.get('/search/:identifier', searchReservations);

// Update reservation
router.put('/:id', authenticate, authorize(['admin', 'user']), updateReservation);

// Update reservation status
router.patch('/:id/status', authenticate, authorize(['admin', 'user']), updateReservationStatus);

// Delete reservation
router.delete('/:id', authenticate, authorize(['admin', 'user']), deleteReservation);

module.exports = router;