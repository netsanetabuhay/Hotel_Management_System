const { pool } = require('../Config/database');
const { generateId } = require('../Utils/generateId');

// 1. Create new reservation
const createReservation = async (reservationData) => {
    const query = `
        INSERT INTO room_orders 
        (room_order_id, user_id, room_id, check_in, check_out, status, payment_status)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.execute(query, [
        reservationData.room_order_id,
        reservationData.user_id,
        reservationData.room_id,
        reservationData.check_in,
        reservationData.check_out,
        reservationData.status,
        reservationData.payment_status
    ]);
    return result;
};

// 2. Get reservations with filters
const getReservations = async (filters = {}, userId = null, isAdmin = false) => {
    let query = `
        SELECT 
            ro.*,
            r.room_number,
            r.room_type,
            r.price,
            u.username,
            u.email
        FROM room_orders ro
        JOIN rooms r ON ro.room_id = r.room_id
        JOIN users u ON ro.user_id = u.user_id
        WHERE 1=1
    `;
    
    const params = [];
    
    // User restriction: non-admin users only see their own reservations
    if (!isAdmin && userId) {
        query += ' AND ro.user_id = ?';
        params.push(userId);
    }
    
    // Apply filters
    if (filters.status) {
        query += ' AND ro.status = ?';
        params.push(filters.status);
    }
    
    if (filters.payment_status) {
        query += ' AND ro.payment_status = ?';
        params.push(filters.payment_status);
    }
    
    if (filters.room_id) {
        query += ' AND ro.room_id = ?';
        params.push(filters.room_id);
    }
    
    if (filters.user_id && isAdmin) {
        query += ' AND ro.user_id = ?';
        params.push(filters.user_id);
    }
    
    if (filters.check_in_from) {
        query += ' AND ro.check_in >= ?';
        params.push(filters.check_in_from);
    }
    
    if (filters.check_in_to) {
        query += ' AND ro.check_in <= ?';
        params.push(filters.check_in_to);
    }
    
    query += ' ORDER BY ro.created_at DESC';
    
    const [rows] = await pool.execute(query, params);
    return rows;
};

// 3. Get reservation by ID with details
const getReservationByIdWithDetails = async (reservationId) => {
    const query = `
        SELECT 
            ro.*,
            r.room_number,
            r.room_type,
            r.price,
            u.username,
            u.email
        FROM room_orders ro
        JOIN rooms r ON ro.room_id = r.room_id
        JOIN users u ON ro.user_id = u.user_id
        WHERE ro.room_order_id = ?
    `;
    const [rows] = await pool.execute(query, [reservationId]);
    return rows[0] || null;
};

// 4. Update reservation (admin only - status and payment)
const updateReservation = async (reservationId, updateData) => {
    const fields = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updateData);
    values.push(reservationId);
    
    const query = `UPDATE room_orders SET ${fields} WHERE room_order_id = ?`;
    const [result] = await pool.execute(query, values);
    return result;
};

// 5. Delete reservation (admin only)
const deleteReservation = async (reservationId) => {
    const query = 'DELETE FROM room_orders WHERE room_order_id = ?';
    const [result] = await pool.execute(query, [reservationId]);
    return result;
};

// 6. Check room availability for dates
const checkRoomAvailabilityForDates = async (roomId, checkIn, checkOut) => {
    const query = `
        SELECT room_order_id 
        FROM room_orders 
        WHERE room_id = ? 
        AND status IN ('booked', 'active')
        AND (
            (check_in <= ? AND check_out >= ?) OR
            (check_in <= ? AND check_out >= ?) OR
            (check_in >= ? AND check_out <= ?)
        )
        LIMIT 1
    `;
    const [conflicts] = await pool.execute(query, [
        roomId, 
        checkOut, checkIn,
        checkIn, checkOut,  
        checkIn, checkOut
    ]);
    return conflicts.length === 0;
};

// 7. Get reservation statistics
const getReservationStats = async () => {
    // Total reservations by status
    const statusQuery = `
        SELECT 
            status,
            COUNT(*) as count,
            SUM(CASE WHEN payment_status = 'paid' THEN 1 ELSE 0 END) as paid_count
        FROM room_orders 
        GROUP BY status
        ORDER BY status
    `;
    const [statusResult] = await pool.execute(statusQuery);
    
    // Revenue by month
    const monthlyQuery = `
        SELECT 
            DATE_FORMAT(ro.created_at, '%Y-%m') as month,
            COUNT(*) as bookings,
            SUM(r.price) as revenue
        FROM room_orders ro
        JOIN rooms r ON ro.room_id = r.room_id
        WHERE ro.status = 'completed' AND ro.payment_status = 'paid'
        GROUP BY DATE_FORMAT(ro.created_at, '%Y-%m')
        ORDER BY month DESC
        LIMIT 6
    `;
    const [monthlyResult] = await pool.execute(monthlyQuery);
    
    // Most booked rooms
    const popularRoomsQuery = `
        SELECT 
            r.room_id,
            r.room_number,
            r.room_type,
            COUNT(*) as booking_count,
            SUM(r.price) as total_revenue
        FROM room_orders ro
        JOIN rooms r ON ro.room_id = r.room_id
        WHERE ro.status = 'completed'
        GROUP BY r.room_id, r.room_number, r.room_type
        ORDER BY booking_count DESC
        LIMIT 10
    `;
    const [popularRoomsResult] = await pool.execute(popularRoomsQuery);
    
    // Today's arrivals and departures
    const today = new Date().toISOString().split('T')[0];
    const arrivalsQuery = `
        SELECT COUNT(*) as todays_arrivals
        FROM room_orders 
        WHERE DATE(check_in) = ?
        AND status = 'booked'
    `;
    const [arrivalsResult] = await pool.execute(arrivalsQuery, [today]);
    
    const departuresQuery = `
        SELECT COUNT(*) as todays_departures
        FROM room_orders 
        WHERE DATE(check_out) = ?
        AND status = 'active'
    `;
    const [departuresResult] = await pool.execute(departuresQuery, [today]);
    
    // Check for automatic status updates
    // Update 'booked' to 'active' if check-in date has arrived
    const updateToActiveQuery = `
        UPDATE room_orders 
        SET status = 'active'
        WHERE status = 'booked'
        AND check_in <= CURDATE()
        AND check_out >= CURDATE()
    `;
    await pool.execute(updateToActiveQuery);
    
    // Update 'active' to 'completed' if check-out date has passed
    const updateToCompletedQuery = `
        UPDATE room_orders 
        SET status = 'completed'
        WHERE status = 'active'
        AND check_out < CURDATE()
    `;
    await pool.execute(updateToCompletedQuery);
    
    return {
        byStatus: statusResult,
        monthlyRevenue: monthlyResult,
        popularRooms: popularRoomsResult,
        todaysArrivals: arrivalsResult[0]?.todays_arrivals || 0,
        todaysDepartures: departuresResult[0]?.todays_departures || 0
    };
};

// 8. Get room price
const getRoomPrice = async (roomId) => {
    const query = 'SELECT price FROM rooms WHERE room_id = ?';
    const [rows] = await pool.execute(query, [roomId]);
    return rows[0]?.price || 0;
};

module.exports = {
    createReservation,
    getReservations,
    getReservationByIdWithDetails,
    updateReservation,
    deleteReservation,
    checkRoomAvailabilityForDates,
    getReservationStats,
    getRoomPrice
};