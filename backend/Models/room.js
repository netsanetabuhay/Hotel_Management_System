const { pool } = require('../Config/database');

class Room {
  // CREATE - Add new room
  static async create(roomData) {
    const sql = `
      INSERT INTO rooms 
        (room_id, room_number, room_type, price, status) 
      VALUES 
        (?, ?, ?, ?, ?)
    `;
    
    const values = [
      roomData.room_id,
      roomData.room_number,
      roomData.room_type,
      roomData.price,
      roomData.status || 'available'
    ];

    try {
      const [result] = await pool.query(sql, values);
      return { 
        success: true, 
        message: 'Room created successfully',
        roomId: roomData.room_id 
      };
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Room number already exists');
      }
      throw error;
    }
  }

  // READ - Get all rooms with filters
  static async findAll(filters = {}) {
    let sql = 'SELECT * FROM rooms WHERE 1 = 1';
    const values = [];

    // Add filters if provided
    if (filters.room_type) {
      sql += ' AND room_type = ?';
      values.push(filters.room_type);
    }
    
    if (filters.status) {
      sql += ' AND status = ?';
      values.push(filters.status);
    }
    
    if (filters.min_price) {
      sql += ' AND price >= ?';
      values.push(filters.min_price);
    }
    
    if (filters.max_price) {
      sql += ' AND price <= ?';
      values.push(filters.max_price);
    }
    
    if (filters.search) {
      sql += ' AND (room_number LIKE ? OR room_type LIKE ?)';
      values.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    // Order by room number (numeric order)
    sql += ' ORDER BY CAST(room_number AS UNSIGNED)';

    try {
      const [rows] = await pool.query(sql, values);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // READ - Get single room by ID
  static async findById(room_id) {
    const sql = 'SELECT * FROM rooms WHERE room_id = ?';
    
    try {
      const [rows] = await pool.query(sql, [room_id]);
      
      if (rows.length === 0) {
        return null;
      }
      
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // READ - Get room by room number
  static async findByNumber(room_number) {
    const sql = 'SELECT * FROM rooms WHERE room_number = ?';
    
    try {
      const [rows] = await pool.query(sql, [room_number]);
      
      if (rows.length === 0) {
        return null;
      }
      
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // UPDATE - Update room details
  static async update(room_id, updateData) {
    // Build SET clause dynamically
    const setClauses = [];
    const values = [];

    if (updateData.room_number !== undefined) {
      setClauses.push('room_number = ?');
      values.push(updateData.room_number);
    }
    
    if (updateData.room_type !== undefined) {
      setClauses.push('room_type = ?');
      values.push(updateData.room_type);
    }
    
    if (updateData.price !== undefined) {
      setClauses.push('price = ?');
      values.push(updateData.price);
    }
    
    if (updateData.status !== undefined) {
      setClauses.push('status = ?');
      values.push(updateData.status);
    }

    // If no fields to update
    if (setClauses.length === 0) {
      return { 
        success: false, 
        message: 'No fields provided for update' 
      };
    }

    // Add room_id to values for WHERE clause
    values.push(room_id);

    const sql = `
      UPDATE rooms 
      SET ${setClauses.join(', ')} 
      WHERE room_id = ?
    `;

    try {
      const [result] = await pool.query(sql, values);
      
      return { 
        success: result.affectedRows > 0,
        message: result.affectedRows > 0 ? 'Room updated successfully' : 'Room not found',
        affectedRows: result.affectedRows 
      };
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Room number already exists');
      }
      throw error;
    }
  }

  // DELETE - Remove room
  static async delete(room_id) {
    const sql = 'DELETE FROM rooms WHERE room_id = ?';
    
    try {
      const [result] = await pool.query(sql, [room_id]);
      
      return { 
        success: result.affectedRows > 0,
        message: result.affectedRows > 0 ? 'Room deleted successfully' : 'Room not found',
        affectedRows: result.affectedRows 
      };
    } catch (error) {
      throw error;
    }
  }

  // READ - Get available rooms only
  static async getAvailableRooms() {
    const sql = `
      SELECT * 
      FROM rooms 
      WHERE status = 'available' 
      ORDER BY CAST(room_number AS UNSIGNED)
    `;
    
    try {
      const [rows] = await pool.query(sql);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // READ - Get rooms by specific status
  static async findByStatus(status) {
    const sql = 'SELECT * FROM rooms WHERE status = ?';
    
    try {
      const [rows] = await pool.query(sql, [status]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // READ - Get room statistics (count by type)
  static async getRoomStats() {
    const sql = `
      SELECT 
        room_type,
        COUNT(*) as total_rooms,
        SUM(CASE WHEN status = 'available' THEN 1 ELSE 0 END) as available_rooms,
        AVG(price) as avg_price
      FROM rooms 
      GROUP BY room_type
    `;
    
    try {
      const [rows] = await pool.query(sql);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // UPDATE - Only update room status
  static async updateStatus(room_id, new_status) {
    const sql = 'UPDATE rooms SET status = ? WHERE room_id = ?';
    
    try {
      const [result] = await pool.query(sql, [new_status, room_id]);
      
      return { 
        success: result.affectedRows > 0,
        message: result.affectedRows > 0 ? 'Room status updated' : 'Room not found',
        affectedRows: result.affectedRows 
      };
    } catch (error) {
      throw error;
    }
  }

  // READ - Check if room number exists
  static async checkRoomNumberExists(room_number, exclude_room_id = null) {
    let sql = 'SELECT COUNT(*) as count FROM rooms WHERE room_number = ?';
    const values = [room_number];
    
    if (exclude_room_id) {
      sql += ' AND room_id != ?';
      values.push(exclude_room_id);
    }
    
    try {
      const [rows] = await pool.query(sql, values);
      return rows[0].count > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Room;