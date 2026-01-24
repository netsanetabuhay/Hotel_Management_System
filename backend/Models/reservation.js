const { pool } = require('../Config/database');
const { generateId } = require('../Utils/generateId');

// CREATE - Create new reservation
const createReservation = async (reservationData) => {
  const sql = `
    INSERT INTO reservations 
      (reservation_id, guest_id, room_id, check_in, check_out, status, created_at) 
    VALUES 
      (?, ?, ?, ?, ?, ?, ?)
  `;
  
  const values = [
    reservationData.reservation_id,
    reservationData.guest_id,
    reservationData.room_id,
    reservationData.check_in,
    reservationData.check_out,
    reservationData.status || 'confirmed',
    reservationData.created_at || new Date()
  ];

  try {
    const [result] = await pool.query(sql, values);
    return { 
      success: true, 
      message: 'Reservation created successfully',
      reservationId: reservationData.reservation_id 
    };
  } catch (error) {
    console.error('Create reservation error:', error);
    throw error;
  }
};

// READ - Get all reservations with filters
const findAllReservations = async (filters = {}) => {
  let sql = `
    SELECT r.*, g.first_name, g.last_name, g.email, g.phone, 
           rm.room_number, rm.room_type, rm.price
    FROM reservations r
    LEFT JOIN guests g ON r.guest_id = g.guest_id
    LEFT JOIN rooms rm ON r.room_id = rm.room_id
    WHERE 1 = 1
  `;
  
  const values = [];

  if (filters.guest_id) {
    sql += ' AND r.guest_id = ?';
    values.push(filters.guest_id);
  }
  
  if (filters.room_id) {
    sql += ' AND r.room_id = ?';
    values.push(filters.room_id);
  }
  
  if (filters.status) {
    sql += ' AND r.status = ?';
    values.push(filters.status);
  }
  
  if (filters.check_in) {
    sql += ' AND r.check_in >= ?';
    values.push(filters.check_in);
  }
  
  if (filters.check_out) {
    sql += ' AND r.check_out <= ?';
    values.push(filters.check_out);
  }

  sql += ' ORDER BY r.created_at DESC';

  try {
    const [rows] = await pool.query(sql, values);
    return rows;
  } catch (error) {
    console.error('Find all reservations error:', error);
    throw error;
  }
};

// READ - Get single reservation by ID
const findReservationById = async (reservation_id) => {
  const sql = `
    SELECT r.*, g.first_name, g.last_name, g.email, g.phone, 
           rm.room_number, rm.room_type, rm.price
    FROM reservations r
    LEFT JOIN guests g ON r.guest_id = g.guest_id
    LEFT JOIN rooms rm ON r.room_id = rm.room_id
    WHERE r.reservation_id = ?
  `;
  
  try {
    const [rows] = await pool.query(sql, [reservation_id]);
    
    if (rows.length === 0) {
      return null;
    }
    
    return rows[0];
  } catch (error) {
    console.error('Find reservation by ID error:', error);
    throw error;
  }
};

// READ - Get reservations by guest ID
const findReservationsByGuestId = async (guest_id) => {
  const sql = `
    SELECT r.*, rm.room_number, rm.room_type, rm.price
    FROM reservations r
    LEFT JOIN rooms rm ON r.room_id = rm.room_id
    WHERE r.guest_id = ?
    ORDER BY r.created_at DESC
  `;
  
  try {
    const [rows] = await pool.query(sql, [guest_id]);
    return rows;
  } catch (error) {
    console.error('Find reservations by guest error:', error);
    throw error;
  }
};

// READ - Get reservations by room ID
const findReservationsByRoomId = async (room_id) => {
  const sql = `
    SELECT r.*, g.first_name, g.last_name, g.email, g.phone
    FROM reservations r
    LEFT JOIN guests g ON r.guest_id = g.guest_id
    WHERE r.room_id = ?
    ORDER BY r.check_in DESC
  `;
  
  try {
    const [rows] = await pool.query(sql, [room_id]);
    return rows;
  } catch (error) {
    console.error('Find reservations by room error:', error);
    throw error;
  }
};

// UPDATE - Update reservation details
const updateReservation = async (reservation_id, updateData) => {
  const setClauses = [];
  const values = [];

  if (updateData.guest_id !== undefined) {
    setClauses.push('guest_id = ?');
    values.push(updateData.guest_id);
  }
  
  if (updateData.room_id !== undefined) {
    setClauses.push('room_id = ?');
    values.push(updateData.room_id);
  }
  
  if (updateData.check_in !== undefined) {
    setClauses.push('check_in = ?');
    values.push(updateData.check_in);
  }
  
  if (updateData.check_out !== undefined) {
    setClauses.push('check_out = ?');
    values.push(updateData.check_out);
  }
  
  if (updateData.status !== undefined) {
    setClauses.push('status = ?');
    values.push(updateData.status);
  }

  if (setClauses.length === 0) {
    return { 
      success: false, 
      message: 'No fields provided for update' 
    };
  }

  values.push(reservation_id);

  const sql = `
    UPDATE reservations 
    SET ${setClauses.join(', ')} 
    WHERE reservation_id = ?
  `;

  try {
    const [result] = await pool.query(sql, values);
    
    return { 
      success: result.affectedRows > 0,
      message: result.affectedRows > 0 ? 'Reservation updated successfully' : 'Reservation not found',
      affectedRows: result.affectedRows 
    };
  } catch (error) {
    console.error('Update reservation error:', error);
    throw error;
  }
};

// UPDATE - Only update reservation status
const updateReservationStatus = async (reservation_id, status) => {
  const sql = 'UPDATE reservations SET status = ? WHERE reservation_id = ?';
  
  try {
    const [result] = await pool.query(sql, [status, reservation_id]);
    
    return { 
      success: result.affectedRows > 0,
      message: result.affectedRows > 0 ? 'Reservation status updated' : 'Reservation not found',
      affectedRows: result.affectedRows 
    };
  } catch (error) {
    console.error('Update reservation status error:', error);
    throw error;
  }
};

// DELETE - Cancel/delete reservation
const deleteReservation = async (reservation_id) => {
  const sql = 'DELETE FROM reservations WHERE reservation_id = ?';
  
  try {
    const [result] = await pool.query(sql, [reservation_id]);
    
    return { 
      success: result.affectedRows > 0,
      message: result.affectedRows > 0 ? 'Reservation cancelled successfully' : 'Reservation not found',
      affectedRows: result.affectedRows 
    };
  } catch (error) {
    console.error('Delete reservation error:', error);
    throw error;
  }
};

// CHECK - Room availability
const checkRoomAvailability = async (room_id, check_in, check_out) => {
  const sql = `
    SELECT COUNT(*) as overlapping_reservations
    FROM reservations 
    WHERE room_id = ? 
    AND status IN ('confirmed', 'checked_in')
    AND (
      (check_in <= ? AND check_out >= ?) OR
      (check_in <= ? AND check_out >= ?) OR
      (check_in >= ? AND check_out <= ?)
    )
  `;
  
  try {
    const [rows] = await pool.query(sql, [
      room_id, 
      check_out, check_in,  // First overlap check
      check_in, check_out,  // Second overlap check
      check_in, check_out   // Third overlap check
    ]);
    
    return {
      available: rows[0].overlapping_reservations === 0,
      overlapping_count: rows[0].overlapping_reservations
    };
  } catch (error) {
    console.error('Check room availability error:', error);
    throw error;
  }
};

// CHECK - Available rooms for dates
const findAvailableRooms = async (check_in, check_out, room_type = null) => {
  let sql = `
    SELECT r.*
    FROM rooms r
    WHERE r.status = 'available'
    AND r.room_id NOT IN (
      SELECT res.room_id
      FROM reservations res
      WHERE res.status IN ('confirmed', 'checked_in')
      AND (
        (res.check_in <= ? AND res.check_out >= ?) OR
        (res.check_in <= ? AND res.check_out >= ?) OR
        (res.check_in >= ? AND res.check_out <= ?)
      )
    )
  `;
  
  const values = [
    check_out, check_in,
    check_in, check_out,
    check_in, check_out
  ];
  
  if (room_type) {
    sql += ' AND r.room_type = ?';
    values.push(room_type);
  }
  
  sql += ' ORDER BY r.room_number';
  
  try {
    const [rows] = await pool.query(sql, values);
    return rows;
  } catch (error) {
    console.error('Find available rooms error:', error);
    throw error;
  }
};

// Literal exports
module.exports = {
  createReservation,
  findAllReservations,
  findReservationById,
  findReservationsByGuestId,
  findReservationsByRoomId,
  updateReservation,
  updateReservationStatus,
  deleteReservation,
  checkRoomAvailability,
  findAvailableRooms
};