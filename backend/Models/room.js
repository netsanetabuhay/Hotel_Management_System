const { pool } = require('../Config/database.js');

// Create new room
const createRoom = async (roomData) => {
    const query = `
        INSERT INTO rooms (room_id, room_number, room_type, price)
        VALUES (?, ?, ?, ?)
    `;
    const [result] = await pool.execute(query, [
        roomData.room_id,
        roomData.room_number,
        roomData.room_type,
        roomData.price
    ]);
    return result;
};

// Get all available rooms
const getAllRooms = async () => {
    const query = `
        SELECT room_id, room_number, room_type, price, status
        FROM rooms 
        WHERE status = 'available'
        ORDER BY room_number
    `;
    const [rows] = await pool.execute(query);
    return rows;
};

// Get room by ID
const getRoomById = async (roomId) => {
    const query = 'SELECT * FROM rooms WHERE room_id = ?';
    const [rows] = await pool.execute(query, [roomId]);
    return rows;
};

// Check if room number exists
const checkRoomNumberExists = async (roomNumber) => {
    const query = 'SELECT room_id FROM rooms WHERE room_number = ?';
    const [rows] = await pool.execute(query, [roomNumber]);
    return rows;
};

// Check if room number exists excluding current room
const checkRoomNumberExistsExcluding = async (roomNumber, excludeRoomId) => {
    const query = 'SELECT room_id FROM rooms WHERE room_number = ? AND room_id != ?';
    const [rows] = await pool.execute(query, [roomNumber, excludeRoomId]);
    return rows;
};

// Search rooms with filters
const searchRooms = async (filters) => {
    let query = `
        SELECT room_id, room_number, room_type, price, status
        FROM rooms 
        WHERE status = 'available'
    `;
    
    const params = [];
    
    if (filters.room_number) {
        query += ' AND room_number LIKE ?';
        params.push(`%${filters.room_number}%`);
    }
    
    if (filters.room_type) {
        query += ' AND room_type = ?';
        params.push(filters.room_type);
    }
    
    if (filters.price_min) {
        query += ' AND price >= ?';
        params.push(filters.price_min);
    }
    
    if (filters.price_max) {
        query += ' AND price <= ?';
        params.push(filters.price_max);
    }
    
    query += ' ORDER BY price';
    
    const [rows] = await pool.execute(query, params);
    return rows;
};

// Update room
const updateRoom = async (roomId, updateData) => {
    const fields = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updateData);
    values.push(roomId);
    
    const query = `UPDATE rooms SET ${fields} WHERE room_id = ?`;
    const [result] = await pool.execute(query, values);
    return result;
};

// Delete room
const deleteRoom = async (roomId) => {
    const query = 'DELETE FROM rooms WHERE room_id = ?';
    const [result] = await pool.execute(query, [roomId]);
    return result;
};

// Check if room has active reservations
const checkRoomReservations = async (roomId) => {
    const query = `
        SELECT room_order_id 
        FROM room_orders 
        WHERE room_id = ? 
        AND (status = 'booked' OR status = 'active')
        LIMIT 1
    `;
    const [rows] = await pool.execute(query, [roomId]);
    return rows;
};

// Get room statistics
const getRoomStats = async () => {
    // Total available rooms
    const totalQuery = "SELECT COUNT(*) as total FROM rooms WHERE status = 'available'";
    const [totalResult] = await pool.execute(totalQuery);
    
    // Rooms by type
    const typeQuery = `
        SELECT room_type, COUNT(*) as count 
        FROM rooms 
        WHERE status = 'available'
        GROUP BY room_type
        ORDER BY count DESC
    `;
    const [typeResult] = await pool.execute(typeQuery);
    
    // Average price
    const avgPriceQuery = "SELECT AVG(price) as avg_price FROM rooms WHERE status = 'available'";
    const [avgPriceResult] = await pool.execute(avgPriceQuery);
    
    // Price range
    const priceRangeQuery = "SELECT MIN(price) as min_price, MAX(price) as max_price FROM rooms WHERE status = 'available'";
    const [priceRangeResult] = await pool.execute(priceRangeQuery);
    
    return {
        total: totalResult[0]?.total || 0,
        byType: typeResult,
        averagePrice: avgPriceResult[0]?.avg_price || 0,
        priceRange: {
            min: priceRangeResult[0]?.min_price || 0,
            max: priceRangeResult[0]?.max_price || 0
        }
    };
};

// Get revenue statistics from room orders
const getRevenueStats = async () => {
    // Total revenue from completed bookings
    const revenueQuery = `
        SELECT 
            SUM(r.price) as total_revenue,
            COUNT(*) as total_bookings,
            AVG(r.price) as avg_booking_value
        FROM room_orders ro
        JOIN rooms r ON ro.room_id = r.room_id
        WHERE ro.status = 'completed' AND ro.payment_status = 'paid'
    `;
    const [revenueResult] = await pool.execute(revenueQuery);
    
    // Most booked room type
    const popularTypeQuery = `
        SELECT 
            r.room_type,
            COUNT(*) as booking_count,
            SUM(r.price) as revenue
        FROM room_orders ro
        JOIN rooms r ON ro.room_id = r.room_id
        WHERE ro.status = 'completed'
        GROUP BY r.room_type
        ORDER BY booking_count DESC
        LIMIT 5
    `;
    const [popularTypeResult] = await pool.execute(popularTypeQuery);
    
    return {
        totalRevenue: revenueResult[0]?.total_revenue || 0,
        totalBookings: revenueResult[0]?.total_bookings || 0,
        averageBookingValue: revenueResult[0]?.avg_booking_value || 0,
        popularRoomTypes: popularTypeResult
    };
};

module.exports = {
    createRoom,
    getAllRooms,
    getRoomById,
    checkRoomNumberExists,
    checkRoomNumberExistsExcluding,
    searchRooms,
    updateRoom,
    deleteRoom,
    checkRoomReservations,
    getRoomStats,
    getRevenueStats
};