const express = require('express');
const router = express.Router();


// Import all GuestController functions
const {
  createGuest,
  getAllGuests,
  updateGuest,
  deleteGuest,
  searchGuests,
  getGuestStatistics
} = require('../Controllers/guestController');

// Import auth middleware functions
const { authenticate, authorize } = require('../Middleware/auth');


// ---------- PUBLIC ROUTES ----------
router.get('/', getAllGuests);
router.get('/search/:identifier', searchGuests);
router.post('/', createGuest);

// ---------- PROTECTED ROUTES ----------
router.put(
  '/update/:identifier',
  authenticate,
  authorize(['admin', 'staff', 'manager', 'receptionist']),
  updateGuest
);
router.get(
  '/stats/statistics',
  authenticate,
  authorize(['admin', 'manager']),
  getGuestStatistics
);
// Delete guest (Admin/Manager only)
router.delete(
  '/delet/:id',
  authenticate,
  authorize(['admin', 'manager']),
  deleteGuest
);

module.exports = router;
