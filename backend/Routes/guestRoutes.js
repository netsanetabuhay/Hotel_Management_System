const express = require('express');
const router = express.Router();


// Import all GuestController functions
const {
  createGuest,
  getAllGuests,
  getGuestById,
  getGuestByEmail,
  getGuestByPhone,
  updateGuest,
  deleteGuest,
  searchGuests,
  getGuestStatistics
} = require('../Controllers/guestController');

// Import auth middleware functions
const { authenticate, authorize } = require('../Middleware/auth');

// ===============================
// GUEST MANAGEMENT ROUTES
// ===============================

// ---------- PUBLIC ROUTES ----------
// No authentication required

// Get all guests
router.get('/', getAllGuests);

// Search guests by name, email, or phone
// router.get('/search/:query', smartGuestSearch);

router.get('/search', searchGuests);

// Get guest by email
router.get('/email/:email', getGuestByEmail);

// Get guest by phone
router.get('/phone/:phone', getGuestByPhone);

// Create new guest
router.post('/', createGuest);

// ---------- PROTECTED ROUTES ----------
// Authentication required

// Update guest details
// (Guest can update own info, Staff/Admin/Manager/Receptionist can update any)
router.put(
  '/update/:identifier',
  authenticate,
  authorize(['admin', 'staff', 'manager', 'receptionist']),
  updateGuest
);

// Get guest statistics (Admin/Manager only)
router.get(
  '/stats/statistics',
  authenticate,
  authorize(['admin', 'manager']),
  getGuestStatistics
);

// Delete guest (Admin/Manager only)
router.delete(
  '/:id',
  authenticate,
  authorize(['admin', 'manager']),
  deleteGuest
);

// ⚠️ MUST BE LAST — catch-all route
// Get guest by ID
router.get('/:id', getGuestById);

module.exports = router;
