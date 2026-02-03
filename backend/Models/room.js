const { pool } = require('../Config/database');

// 1. Create new room (Admin only)
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

// 2. Get all rooms FOR ADMIN (shows all rooms with booking status)
const getAllRoomsForAdmin = async () => {
    const query = `
        SELECT 
            r.room_id,
            r.room_number,
            r.room_type,
            r.price,
            r.status,
            GROUP_CONCAT(
                CASE 
                    WHEN ro.status IN ('booked', 'active') 
                    THEN CONCAT(ro.check_in, ' to ', ro.check_out)
                    ELSE NULL
                END
            ) as booked_periods
        FROM rooms r
        LEFT JOIN room_orders ro ON r.room_id = ro.room_id 
            AND ro.status IN ('booked', 'active')
            AND ro.check_out >= CURDATE()
        WHERE r.status = 'available'
        GROUP BY r.room_id, r.room_number, r.room_type, r.price, r.status
        ORDER BY r.room_number
    `;
    const [rows] = await pool.execute(query);
    return rows;
};

// 3. Get available rooms FOR USERS (excludes booked rooms for given dates)
const getAvailableRoomsForUsers = async (checkIn, checkOut) => {
    const query = `
        SELECT 
            r.room_id,
            r.room_number,
            r.room_type,
            r.price,
            r.status
        FROM rooms r
        WHERE r.status = 'available'
        AND r.room_id NOT IN (
            SELECT DISTINCT room_id
            FROM room_orders
            WHERE status IN ('booked', 'active')
            AND (
                (check_in <= ? AND check_out >= ?) OR
                (check_in <= ? AND check_out >= ?) OR
                (check_in >= ? AND check_out <= ?)
            )
        )
        ORDER BY r.price
    `;
    const [rows] = await pool.execute(query, [
        checkOut, checkIn,
        checkIn, checkOut,
        checkIn, checkOut
    ]);
    return rows;
};

// 4. Get room by ID
const getRoomById = async (roomId) => {
    const query = 'SELECT * FROM rooms WHERE room_id = ?';
    const [rows] = await pool.execute(query, [roomId]);
    return rows;
};

// 5. Check if room number exists
const checkRoomNumberExists = async (roomNumber) => {
    const query = 'SELECT room_id FROM rooms WHERE room_number = ?';
    const [rows] = await pool.execute(query, [roomNumber]);
    return rows;
};

// 6. Check if room number exists excluding current room
const checkRoomNumberExistsExcluding = async (roomNumber, excludeRoomId) => {
    const query = 'SELECT room_id FROM rooms WHERE room_number = ? AND room_id != ?';
    const [rows] = await pool.execute(query, [roomNumber, excludeRoomId]);
    return rows;
};

// 7. Search available rooms FOR USERS with filters
const searchAvailableRooms = async (filters, checkIn, checkOut) => {
    let query = `
        SELECT 
            r.room_id,
            r.room_number,
            r.room_type,
            r.price,
            r.status
        FROM rooms r
        WHERE r.status = 'available'
        AND r.room_id NOT IN (
            SELECT DISTINCT room_id
            FROM room_orders
            WHERE status IN ('booked', 'active')
            AND (
                (check_in <= ? AND check_out >= ?) OR
                (check_in <= ? AND check_out >= ?) OR
                (check_in >= ? AND check_out <= ?)
            )
        )
    `;
    
    const params = [checkOut, checkIn, checkIn, checkOut, checkIn, checkOut];
    
    if (filters.room_number) {
        query += ' AND r.room_number LIKE ?';
        params.push(`%${filters.room_number}%`);
    }
    
    if (filters.room_type) {
        query += ' AND r.room_type = ?';
        params.push(filters.room_type);
    }
    
    if (filters.price_min) {
        query += ' AND r.price >= ?';
        params.push(filters.price_min);
    }
    
    if (filters.price_max) {
        query += ' AND r.price <= ?';
        params.push(filters.price_max);
    }
    
    query += ' ORDER BY r.price';
    
    const [rows] = await pool.execute(query, params);
    return rows;
};

// 8. Check specific room availability for dates
const checkRoomAvailability = async (roomId, checkIn, checkOut) => {
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
    return conflicts.length === 0; // true if available
};


// 9. Update room
const updateRoom = async (roomId, updateData) => {
    const fields = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updateData);
    values.push(roomId);
    
    const query = `UPDATE rooms SET ${fields} WHERE room_id = ?`;
    const [result] = await pool.execute(query, values);
    return result;
};

// 10. Delete room
const deleteRoom = async (roomId) => {
    const query = 'DELETE FROM rooms WHERE room_id = ?';
    const [result] = await pool.execute(query, [roomId]);
    return result;
};

// 11. Check if room has active reservations
const checkRoomReservations = async (roomId) => {
    const query = `
        SELECT room_order_id 
        FROM room_orders 
        WHERE room_id = ? 
        AND (status = 'booked' OR status = 'active')
        AND check_out >= CURDATE()
        LIMIT 1
    `;
    const [rows] = await pool.execute(query, [roomId]);
    return rows;
};

// 12. Get room statistics
const getRoomStats = async () => {
    const totalQuery = "SELECT COUNT(*) as total FROM rooms WHERE status = 'available'";
    const [totalResult] = await pool.execute(totalQuery);
    
    const typeQuery = `
        SELECT room_type, COUNT(*) as count 
        FROM rooms 
        WHERE status = 'available'
        GROUP BY room_type
        ORDER BY count DESC
    `;
    const [typeResult] = await pool.execute(typeQuery);
    
    const avgPriceQuery = "SELECT AVG(price) as avg_price FROM rooms WHERE status = 'available'";
    const [avgPriceResult] = await pool.execute(avgPriceQuery);
    
    const priceRangeQuery = "SELECT MIN(price) as min_price, MAX(price) as max_price FROM rooms WHERE status = 'available'";
    const [priceRangeResult] = await pool.execute(priceRangeQuery);
    
    // Currently booked rooms count
    const bookedQuery = `
        SELECT COUNT(DISTINCT room_id) as currently_booked
        FROM room_orders 
        WHERE status IN ('booked', 'active')
        AND check_out >= CURDATE()
    `;
    const [bookedResult] = await pool.execute(bookedQuery);
    
    return {
        total: totalResult[0]?.total || 0,
        currentlyBooked: bookedResult[0]?.currently_booked || 0,
        available: (totalResult[0]?.total || 0) - (bookedResult[0]?.currently_booked || 0),
        byType: typeResult,
        averagePrice: avgPriceResult[0]?.avg_price || 0,
        priceRange: {
            min: priceRangeResult[0]?.min_price || 0,
            max: priceRangeResult[0]?.max_price || 0
        }
    };
};

// 13. Get revenue statistics
const getRevenueStats = async () => {
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
    getAllRoomsForAdmin,
    getAvailableRoomsForUsers,
    getRoomById,
    checkRoomNumberExists,
    checkRoomNumberExistsExcluding,
    searchAvailableRooms,
    checkRoomAvailability,
    updateRoom,
    deleteRoom,
    checkRoomReservations,
    getRoomStats,
    getRevenueStats
};