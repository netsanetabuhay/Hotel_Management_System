const { pool } = require('../Config/database');
const { generateId } = require('../Utils/generateId');

// Find user by email
const findUserByEmail = async (email) => {
    try {
        const [rows] = await pool.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        return rows[0] || null;
    } catch (error) {
        console.error('Error finding user by email:', error);
        throw error;
    }
};

// Find user by username
const findUserByUsername = async (username) => {
    try {
        const [rows] = await pool.execute(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );
        return rows[0] || null;
    } catch (error) {
        console.error('Error finding user by username:', error);
        throw error;
    }
};

// Find user by ID
const findUserById = async (userId) => {
    try {
        const [rows] = await pool.execute(
            'SELECT user_id, username, email, first_name, last_name, phone, role, status, created_at FROM users WHERE user_id = ?',
            [userId]
        );
        return rows[0] || null;
    } catch (error) {
        console.error('Error finding user by ID:', error);
        throw error;
    }
};

// Create new user
const createUser = async (userData) => {
    try {
        const userId = generateId('USR');
        
        const sql = `INSERT INTO users (
            user_id, username, email, password_hash, 
            first_name, last_name, phone, role, status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`;
        
        const [result] = await pool.execute(sql, [
            userId,
            userData.username,
            userData.email,
            userData.password_hash,
            userData.first_name,
            userData.last_name,
            userData.phone,
            userData.role || 'staff',
            userData.status || 'active'
        ]);
        
        // Return the created user without password
        const createdUser = await findUserById(userId);
        return createdUser;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

// Get all users
const getAllUsersFromDB = async () => {
    try {
        const [rows] = await pool.execute(
            'SELECT user_id, username, email, first_name, last_name, phone, role, status, created_at FROM users ORDER BY created_at DESC'
        );
        return rows;
    } catch (error) {
        console.error('Error getting all users:', error);
        throw error;
    }
};

// Update user
const updateUserInDB = async (userId, updateData) => {
    try {
        const allowedFields = ['username', 'email', 'first_name', 'last_name', 'phone', 'role', 'status'];
        const fields = [];
        const values = [];
        
        Object.keys(updateData).forEach(key => {
            if (allowedFields.includes(key) && updateData[key] !== undefined) {
                fields.push(`${key} = ?`);
                values.push(updateData[key]);
            }
        });
        
        if (fields.length === 0) {
            return null;
        }
        
        values.push(userId);
        const sql = `UPDATE users SET ${fields.join(', ')} WHERE user_id = ?`;
        
        const [result] = await pool.execute(sql, values);
        
        if (result.affectedRows === 0) {
            return null;
        }
        
        // Return updated user
        const updatedUser = await findUserById(userId);
        return updatedUser;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};

// Delete user
const deleteUserFromDB = async (userId) => {
    try {
        const [result] = await pool.execute(
            'DELETE FROM users WHERE user_id = ?',
            [userId]
        );
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};

// Count total users
const countUsersFromDB = async () => {
    try {
        const [rows] = await pool.execute(
            'SELECT COUNT(*) as total FROM users'
        );
        return rows[0].total;
    } catch (error) {
        console.error('Error counting users:', error);
        throw error;
    }
};

// Find user with password (for login verification)
const findUserWithPassword = async (email) => {
    try {
        const [rows] = await pool.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        return rows[0] || null;
    } catch (error) {
        console.error('Error finding user with password:', error);
        throw error;
    }
};

// Update user password
const updateUserPassword = async (userId, hashedPassword) => {
    try {
        const [result] = await pool.execute(
            'UPDATE users SET password_hash = ? WHERE user_id = ?',
            [hashedPassword, userId]
        );
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error updating user password:', error);
        throw error;
    }
};

// Search users
const searchUsers = async (searchTerm, limit = 50, offset = 0) => {
    try {
        const sql = `SELECT user_id, username, email, first_name, last_name, phone, role, status, created_at 
                     FROM users 
                     WHERE username LIKE ? OR email LIKE ? OR first_name LIKE ? OR last_name LIKE ?
                     ORDER BY created_at DESC 
                     LIMIT ? OFFSET ?`;
        
        const searchPattern = `%${searchTerm}%`;
        const [rows] = await pool.execute(sql, [
            searchPattern, searchPattern, searchPattern, searchPattern,
            limit, offset
        ]);
        
        return rows;
    } catch (error) {
        console.error('Error searching users:', error);
        throw error;
    }
};

// Get users by role
const getUsersByRole = async (role) => {
    try {
        const [rows] = await pool.execute(
            'SELECT user_id, username, email, first_name, last_name, phone, role, status, created_at FROM users WHERE role = ? ORDER BY created_at DESC',
            [role]
        );
        return rows;
    } catch (error) {
        console.error('Error getting users by role:', error);
        throw error;
    }
};

// Export all functions
module.exports = {
    findUserByEmail,
    findUserByUsername,
    findUserById,
    createUser,
    getAllUsersFromDB,
    updateUserInDB,
    deleteUserFromDB,
    countUsersFromDB,
    findUserWithPassword,
    updateUserPassword,
    searchUsers,
    getUsersByRole
};