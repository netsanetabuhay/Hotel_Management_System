const express = require('express');
const router = express.Router();

// Import controller functions
const {
  createPayment,
  getAllPayments,
  updatePayment,
  deletePayment,
  updatePaymentStatus,
  searchPayments,
  getPaymentStatistics
} = require('../Controllers/paymentController');

// Import auth middleware
const { authenticate, authorize } = require('../Middleware/auth');

//  PROTECTED ROUTES (All payment routes protected) 
router.use(authenticate);

// Get all payments (Admin/Manager/Receptionist only)
router.get('/', authorize(['admin', 'manager', 'receptionist']), getAllPayments);

// UNIFIED SEARCH for ALL payment searches
router.get('/search/:identifier', authorize(['admin', 'manager', 'receptionist']), searchPayments);

// Create payment
router.post('/', authorize(['admin', 'manager', 'receptionist']), createPayment);

// Update payment
router.put('/:id', authorize(['admin', 'manager', 'receptionist']), updatePayment);

// Delete payment (Admin only)
router.delete('/:id', authorize(['admin']), deletePayment);

// Update payment status
router.put('/status/:id', authorize(['admin', 'manager', 'receptionist']), updatePaymentStatus);

// Get payment statistics
router.get('/stats/statistics', authorize(['admin', 'manager']), getPaymentStatistics);

module.exports = router;