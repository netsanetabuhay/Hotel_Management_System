const { pool } = require('../Config/database');

// CREATE - Create new payment
const createPayment = async (paymentData) => {
  const sql = `
    INSERT INTO payments 
      (payment_id, reservation_id, order_id, amount, payment_method, status, created_at) 
    VALUES 
      (?, ?, ?, ?, ?, ?, ?)
  `;
  
  const values = [
    paymentData.payment_id,
    paymentData.reservation_id || null,
    paymentData.order_id || null,
    paymentData.amount,
    paymentData.payment_method,
    paymentData.status || 'completed',
    paymentData.created_at || new Date()
  ];

  try {
    const [result] = await pool.query(sql, values);
    return { 
      success: true, 
      message: 'Payment created successfully',
      paymentId: paymentData.payment_id 
    };
  } catch (error) {
    throw error;
  }
};

// READ - Get all payments with filters
const findAllPayments = async (filters = {}) => {
  let sql = `
    SELECT p.*, 
           r.reservation_id as res_id,
           fo.order_id as food_order_id,
           g.first_name as guest_first_name,
           g.last_name as guest_last_name,
           rm.room_number,
           rm.room_type
    FROM payments p
    LEFT JOIN reservations r ON p.reservation_id = r.reservation_id
    LEFT JOIN food_orders fo ON p.order_id = fo.order_id
    LEFT JOIN guests g ON r.guest_id = g.guest_id OR fo.guest_id = g.guest_id
    LEFT JOIN rooms rm ON r.room_id = rm.room_id OR fo.room_id = rm.room_id
    WHERE 1 = 1
  `;
  
  const values = [];

  if (filters.reservation_id) {
    sql += ' AND p.reservation_id = ?';
    values.push(filters.reservation_id);
  }
  
  if (filters.order_id) {
    sql += ' AND p.order_id = ?';
    values.push(filters.order_id);
  }
  
  if (filters.status) {
    sql += ' AND p.status = ?';
    values.push(filters.status);
  }
  
  if (filters.payment_method) {
    sql += ' AND p.payment_method = ?';
    values.push(filters.payment_method);
  }
  
  if (filters.start_date) {
    sql += ' AND DATE(p.created_at) >= ?';
    values.push(filters.start_date);
  }
  
  if (filters.end_date) {
    sql += ' AND DATE(p.created_at) <= ?';
    values.push(filters.end_date);
  }

  sql += ' ORDER BY p.created_at DESC';

  try {
    const [rows] = await pool.query(sql, values);
    return rows;
  } catch (error) {
    throw error;
  }
};

// READ - Get single payment by ID
const findPaymentById = async (payment_id) => {
  const sql = `
    SELECT p.*, 
           r.reservation_id as res_id,
           fo.order_id as food_order_id,
           g.first_name as guest_first_name,
           g.last_name as guest_last_name,
           rm.room_number,
           rm.room_type
    FROM payments p
    LEFT JOIN reservations r ON p.reservation_id = r.reservation_id
    LEFT JOIN food_orders fo ON p.order_id = fo.order_id
    LEFT JOIN guests g ON r.guest_id = g.guest_id OR fo.guest_id = g.guest_id
    LEFT JOIN rooms rm ON r.room_id = rm.room_id OR fo.room_id = rm.room_id
    WHERE p.payment_id = ?
  `;
  
  try {
    const [rows] = await pool.query(sql, [payment_id]);
    
    if (rows.length === 0) {
      return null;
    }
    
    return rows[0];
  } catch (error) {
    throw error;
  }
};

// READ - Search payments (unified search)
const searchPayments = async (query) => {
  const sql = `
    SELECT p.*, 
           r.reservation_id as res_id,
           fo.order_id as food_order_id,
           g.first_name as guest_first_name,
           g.last_name as guest_last_name,
           rm.room_number
    FROM payments p
    LEFT JOIN reservations r ON p.reservation_id = r.reservation_id
    LEFT JOIN food_orders fo ON p.order_id = fo.order_id
    LEFT JOIN guests g ON r.guest_id = g.guest_id OR fo.guest_id = g.guest_id
    LEFT JOIN rooms rm ON r.room_id = rm.room_id OR fo.room_id = rm.room_id
    WHERE p.payment_id LIKE ? 
       OR p.reservation_id LIKE ? 
       OR p.order_id LIKE ? 
       OR g.first_name LIKE ? 
       OR g.last_name LIKE ? 
       OR g.email LIKE ? 
       OR rm.room_number LIKE ?
       OR p.payment_method LIKE ?
       OR p.status LIKE ?
    ORDER BY p.created_at DESC
  `;
  
  try {
    const searchPattern = `%${query}%`;
    const [rows] = await pool.query(sql, [
      searchPattern, searchPattern, searchPattern,
      searchPattern, searchPattern, searchPattern,
      searchPattern, searchPattern, searchPattern
    ]);
    return rows;
  } catch (error) {
    throw error;
  }
};

// UPDATE - Update payment details
const updatePayment = async (payment_id, updateData) => {
  const setClauses = [];
  const values = [];

  const { reservation_id, order_id, amount, payment_method, status } = updateData;

  if (reservation_id !== undefined) {
    setClauses.push('reservation_id = ?');
    values.push(reservation_id || null);
  }
  
  if (order_id !== undefined) {
    setClauses.push('order_id = ?');
    values.push(order_id || null);
  }

  if (amount !== undefined) {
    setClauses.push('amount = ?');
    values.push(parseFloat(amount).toFixed(2));
  }

  if (payment_method !== undefined) {
    setClauses.push('payment_method = ?');
    values.push(payment_method);
  }

  if (status !== undefined) {
    setClauses.push('status = ?');
    values.push(status);
  }

  if (setClauses.length === 0) {
    return { 
      success: false, 
      message: 'No fields provided for update' 
    };
  }

  values.push(payment_id);

  const sql = `UPDATE payments SET ${setClauses.join(', ')} WHERE payment_id = ?`;

  try {
    const [result] = await pool.query(sql, values);
    
    return { 
      success: result.affectedRows > 0,
      message: result.affectedRows > 0 ? 'Payment updated successfully' : 'Payment not found',
      affectedRows: result.affectedRows 
    };
  } catch (error) {
    console.error('Update error:', error);
    return { 
      success: false,
      message: error.message || 'Database error during update'
    };
  }
};

// UPDATE - Update payment status only
const updatePaymentStatus = async (payment_id, status) => {
  const sql = 'UPDATE payments SET status = ? WHERE payment_id = ?';
  
  try {
    const [result] = await pool.query(sql, [status, payment_id]);
    
    return { 
      success: result.affectedRows > 0,
      message: result.affectedRows > 0 ? 'Payment status updated' : 'Payment not found',
      affectedRows: result.affectedRows 
    };
  } catch (error) {
    console.error('Update status error:', error);
    throw error;
  }
};

// DELETE - Remove payment
const deletePayment = async (payment_id) => {
  const sql = 'DELETE FROM payments WHERE payment_id = ?';
  
  try {
    const [result] = await pool.query(sql, [payment_id]);
    
    return { 
      success: result.affectedRows > 0,
      message: result.affectedRows > 0 ? 'Payment deleted successfully' : 'Payment not found',
      affectedRows: result.affectedRows 
    };
  } catch (error) {
    throw error;
  }
};

// READ - Get payment statistics
const getPaymentStats = async () => {
  const sql = `
    SELECT 
      COUNT(*) as total_payments,
      payment_method,
      COUNT(*) as method_count,
      SUM(amount) as total_amount,
      status,
      COUNT(*) as status_count,
      DATE(created_at) as date,
      COUNT(*) as daily_count
    FROM payments 
    GROUP BY payment_method, status, DATE(created_at)
    ORDER BY DATE(created_at) DESC, total_amount DESC
  `;
  
  try {
    const [rows] = await pool.query(sql);
    return rows;
  } catch (error) {
    throw error;
  }
};

// Export all functions
module.exports = {
  createPayment,
  findAllPayments,
  findPaymentById,
  searchPayments,
  updatePayment,
  updatePaymentStatus,
  deletePayment,
  getPaymentStats
};