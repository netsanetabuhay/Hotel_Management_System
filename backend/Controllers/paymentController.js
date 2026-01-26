// Import from Models
const {
  createPayment,
  findAllPayments,
  findPaymentById,
  searchPayments,
  updatePayment,
  updatePaymentStatus,
  deletePayment,
  getPaymentStats
} = require('../Models/payment');

const { generateId } = require('../Utils/generateId');
const { findReservationById } = require('../Models/reservation');
const { findFoodOrderById } = require('../Models/foodOrder');

// Helper response functions
const sendSuccess = (res, message, data = null, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

const sendError = (res, message, statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    message
  });
};

// ========== CREATE PAYMENT ==========
const createPaymentHandler = async (req, res) => {
  try {
    const { reservation_id, order_id, amount, payment_method, notes } = req.body;
    
    if (!amount || !payment_method) {
      return sendError(res, 'Amount and payment method are required', 400);
    }
    
    if (isNaN(amount) || parseFloat(amount) <= 0) {
      return sendError(res, 'Amount must be a positive number', 400);
    }
    
    // Validate at least one reference exists
    if (!reservation_id && !order_id) {
      return sendError(res, 'Either reservation_id or order_id is required', 400);
    }
    
    // Verify reservation exists if provided
    if (reservation_id) {
      const reservation = await findReservationById(reservation_id);
      if (!reservation) {
        return sendError(res, 'Reservation not found', 404);
      }
    }
    
    // Verify food order exists if provided
    if (order_id) {
      const order = await findFoodOrderById(order_id);
      if (!order) {
        return sendError(res, 'Food order not found', 404);
      }
    }
    
    const payment_id = generateId('PAY');
    const paymentData = {
      payment_id,
      reservation_id: reservation_id || null,
      order_id: order_id || null,
      amount: parseFloat(amount).toFixed(2),
      payment_method,
      status: 'completed',
      notes: notes || null,
      created_at: new Date()
    };
    
    await createPayment(paymentData);
    
    const newPayment = await findPaymentById(payment_id);
    
    return sendSuccess(res, 'Payment created successfully', newPayment, 201);
  } catch (error) {
    console.error('Create payment error:', error);
    return sendError(res, 'Failed to create payment: ' + error.message, 500);
  }
};

// ========== GET ALL PAYMENTS ==========
const getAllPayments = async (req, res) => {
  try {
    const filters = {
      reservation_id: req.query.reservation_id,
      order_id: req.query.order_id,
      status: req.query.status,
      payment_method: req.query.payment_method,
      start_date: req.query.start_date,
      end_date: req.query.end_date
    };
    
    Object.keys(filters).forEach(key => {
      if (filters[key] === undefined || filters[key] === '') delete filters[key];
    });
    
    const payments = await findAllPayments(filters);
    
    return sendSuccess(res, 'Payments retrieved successfully', {
      count: payments.length,
      payments
    });
  } catch (error) {
    console.error('Get all payments error:', error);
    return sendError(res, 'Failed to retrieve payments', 500);
  }
};

// ========== UNIFIED SEARCH ==========
const searchPaymentsHandler = async (req, res) => {
  try {
    const { identifier } = req.params;
    
    console.log('🔍 PAYMENT SEARCH DEBUG:');
    console.log('Identifier:', identifier);
    
    if (!identifier || identifier === 'undefined') {
      // If no identifier, return all payments
      const allPayments = await findAllPayments({});
      return sendSuccess(res, 'All payments retrieved', {
        count: allPayments.length,
        payments: allPayments
      });
    }
    
    // 1. Check if it's a payment_id (starts with PAY)
    if (identifier.toUpperCase().startsWith('PAY')) {
      console.log(' Trying payment ID search...');
      const payment = await findPaymentById(identifier);
      console.log('Payment ID search result:', payment ? 'FOUND' : 'NOT FOUND');
      
      if (payment) {
        return sendSuccess(res, 'Payment found by ID', payment);
      }
    }
    
    // 2. Try search function for everything else
    console.log(' Trying general search...');
    const searchResults = await searchPayments(identifier);
    console.log('Search result count:', searchResults.length);
    
    if (searchResults.length > 0) {
      return sendSuccess(res, 'Payments found by search', {
        search_term: identifier,
        count: searchResults.length,
        payments: searchResults
      });
    }
    
    console.log(' No results found for:', identifier);
    return sendError(res, 'No payments found matching your search', 404);
    
  } catch (error) {
    console.error(' Search payments error:', error);
    return sendError(res, 'Server error during search', 500);
  }
};

// ========== UPDATE PAYMENT ==========
const updatePaymentHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const existingPayment = await findPaymentById(id);
    if (!existingPayment) {
      return sendError(res, 'Payment not found', 404);
    }
    
    // Validate amount if provided
    if (updateData.amount !== undefined) {
      if (isNaN(updateData.amount) || parseFloat(updateData.amount) <= 0) {
        return sendError(res, 'Amount must be a positive number', 400);
      }
      updateData.amount = parseFloat(updateData.amount).toFixed(2);
    }
    
    const result = await updatePayment(id, updateData);
    
    if (!result.success) {
      return sendError(res, result.message, 400);
    }
    
    const updatedPayment = await findPaymentById(id);
    return sendSuccess(res, 'Payment updated successfully', updatedPayment);
  } catch (error) {
    console.error('Update payment error:', error);
    return sendError(res, 'Server error updating payment', 500);
  }
};

// ========== UPDATE PAYMENT STATUS ==========
const updatePaymentStatusHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return sendError(res, 'Status is required', 400);
    }
    
    const validStatuses = ['pending', 'completed', 'failed', 'refunded'];
    if (!validStatuses.includes(status)) {
      return sendError(res, `Invalid status. Valid statuses: ${validStatuses.join(', ')}`, 400);
    }
    
    const existingPayment = await findPaymentById(id);
    if (!existingPayment) {
      return sendError(res, 'Payment not found', 404);
    }
    
    const result = await updatePaymentStatus(id, status);
    
    if (!result.success) {
      return sendError(res, 'Failed to update payment status', 400);
    }
    
    const updatedPayment = await findPaymentById(id);
    return sendSuccess(res, 'Payment status updated successfully', {
      payment_id: id,
      new_status: status,
      payment: updatedPayment
    });
  } catch (error) {
    console.error('Update payment status error:', error);
    return sendError(res, 'Failed to update payment status', 500);
  }
};

// ========== DELETE PAYMENT ==========
const deletePaymentHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const existingPayment = await findPaymentById(id);
    
    if (!existingPayment) {
      return sendError(res, 'Payment not found', 404);
    }
    
    const result = await deletePayment(id);
    
    if (!result.success) {
      return sendError(res, 'Failed to delete payment', 400);
    }
    
    return sendSuccess(res, 'Payment deleted successfully', {
      payment_id: id,
      amount: existingPayment.amount,
      payment_method: existingPayment.payment_method
    });
  } catch (error) {
    console.error('Delete payment error:', error);
    return sendError(res, 'Failed to delete payment', 500);
  }
};

// ========== GET PAYMENT STATISTICS ==========
const getPaymentStatistics = async (req, res) => {
  try {
    const stats = await getPaymentStats();
    
    return sendSuccess(res, 'Payment statistics retrieved successfully', {
      statistics: stats
    });
  } catch (error) {
    console.error('Get payment statistics error:', error);
    return sendError(res, 'Failed to retrieve payment statistics', 500);
  }
};

// ========== EXPORTS ==========
module.exports = {
  createPayment: createPaymentHandler,
  getAllPayments,
  updatePayment: updatePaymentHandler,
  deletePayment: deletePaymentHandler,
  updatePaymentStatus: updatePaymentStatusHandler,
  searchPayments: searchPaymentsHandler,
  getPaymentStatistics
};