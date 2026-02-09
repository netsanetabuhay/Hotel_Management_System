const { pool } = require('../Config/database');
const { generateId } = require('../Utils/generateId');

// 1. Create new room
const createRoom = async (roomData) => {
    const query = `
        INSERT INTO rooms (room_id, room_number, room_type, price,image_url)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.execute(query, [
        roomData.room_id,
        roomData.room_number,
        roomData.room_type,
        roomData.price,
        roomData.image_url || null
    ]);
    return result;
};

// 2. Get all rooms for ADMIN (including booked ones)
const getAllRoomsForAdmin = async () => {
    const query = `
        SELECT 
            r.room_id,
            r.room_number,
            r.room_type,
            r.price,
            r.image_url,
            r.status,
            CASE 
                WHEN EXISTS (
                    SELECT 1 FROM room_orders ro 
                    WHERE ro.room_id = r.room_id 
                    AND ro.status IN ('booked', 'active')
                    AND ro.check_out >= CURDATE()
                ) THEN 'booked'
                ELSE 'available'
            END as current_status
        FROM rooms r
        WHERE r.status = 'available'
        ORDER BY r.room_number
    `;
    const [rows] = await pool.execute(query);
    return rows;
};

// 3. Get available rooms for USERS (today's date)
const getAvailableRoomsForUsers = async () => {
    const today = new Date().toISOString().split('T')[0];
    const query = `
        SELECT 
            r.room_id,
            r.room_number,
            r.room_type,
            r.price,
            r.image_url,
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
    const [rows] = await pool.execute(query, [today, today, today, today, today, today]);
    return rows;
};

// 4. Search available rooms by parameter
const searchAvailableRooms = async (searchParam) => {
    const today = new Date().toISOString().split('T')[0];
    
    // Try to parse the search parameter
    let query = `
        SELECT 
            r.room_id,
            r.room_number,
            r.room_type,
            r.price,
            r.image_url,
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
    
    const params = [today, today, today, today, today, today];
    
    // Check if searchParam is a price range (e.g., "100-200")
    const priceRangeMatch = searchParam.match(/^(\d+)-(\d+)$/);
    if (priceRangeMatch) {
        const minPrice = parseInt(priceRangeMatch[1]);
        const maxPrice = parseInt(priceRangeMatch[2]);
        query += ' AND r.price >= ? AND r.price <= ?';
        params.push(minPrice, maxPrice);
    } 
    // Check if searchParam is a room type (case-insensitive)
    else if (['deluxe', 'suite', 'standard', 'executive', 'presidential'].includes(searchParam.toLowerCase())) {
        query += ' AND LOWER(r.room_type) = ?';
        params.push(searchParam.toLowerCase());
    }
    // Otherwise search in room number
    else {
        query += ' AND r.room_number LIKE ?';
        params.push(`%${searchParam}%`);
    }
    
    query += ' ORDER BY r.price';
    
    const [rows] = await pool.execute(query, params);
    return rows;
};

// 5. Get room by ID
const getRoomById = async (roomId) => {
    const query = 'SELECT * FROM rooms WHERE room_id = ?';
    const [rows] = await pool.execute(query, [roomId]);
    return rows;
};

// 6. Check if room number exists
const checkRoomNumberExists = async (roomNumber) => {
    const query = 'SELECT room_id FROM rooms WHERE room_number = ?';
    const [rows] = await pool.execute(query, [roomNumber]);
    return rows;
};

// 7. Check if room number exists excluding current room
const checkRoomNumberExistsExcluding = async (roomNumber, excludeRoomId) => {
    const query = 'SELECT room_id FROM rooms WHERE room_number = ? AND room_id != ?';
    const [rows] = await pool.execute(query, [roomNumber, excludeRoomId]);
    return rows;
};

// 8. Update room
const updateRoom = async (roomId, updateData) => {
    const fields = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updateData);
    values.push(roomId);
    
    const query = `UPDATE rooms SET ${fields} WHERE room_id = ?`;
    const [result] = await pool.execute(query, values);
    return result;
};

// 9. Delete room
const deleteRoom = async (roomId) => {
    const query = 'DELETE FROM rooms WHERE room_id = ?';
    const [result] = await pool.execute(query, [roomId]);
    return result;
};

// 10. Check if room has active reservations
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

// 11. Get room statistics
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

// 12. Get revenue statistics
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
    searchAvailableRooms,
    getRoomById,
    checkRoomNumberExists,
    checkRoomNumberExistsExcluding,
    updateRoom,
    deleteRoom,
    checkRoomReservations,
    getRoomStats,
    getRevenueStats
};