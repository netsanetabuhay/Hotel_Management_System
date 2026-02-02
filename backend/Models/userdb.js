const { pool } = require('../Config/database');

// Check if username exists
const checkUsernameExists = async (username) => {
    const query = 'SELECT user_id FROM users WHERE username = ?';
    const [rows] = await pool.execute(query, [username]);
    return rows;
};

// Check if email exists
const checkEmailExists = async (email) => {
    const query = 'SELECT user_id FROM users WHERE email = ?';
    const [rows] = await pool.execute(query, [email]);
    return rows;
};

// Get user by email for login
const getUserByEmail = async (email) => {
    const query = 'SELECT * FROM users WHERE email = ?';
    const [rows] = await pool.execute(query, [email]);
    return rows;
};

// Create new user
const createNewUser = async (userData) => {
    const query = `
        INSERT INTO users 
        (user_id, username, email, password_hash, first_name, last_name, phone, role)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.execute(query, [
        userData.userId,
        userData.username,
        userData.email,
        userData.passwordHash,
        userData.first_name,
        userData.last_name,
        userData.phone,
        userData.role
    ]);
    return result;
};

// Get all users from DB
const getAllUsersFromDB = async () => {
    const query = `
        SELECT user_id, username, email, first_name, last_name, phone, role, status, created_at
        FROM users 
        ORDER BY created_at DESC
    `;
    const [rows] = await pool.execute(query);
    return rows;
};

// Search users in DB
const searchUsersInDB = async (searchTerm) => {
    const query = `
        SELECT user_id, username, email, first_name, last_name, phone, role, status, created_at
        FROM users 
        WHERE username LIKE ? OR email LIKE ? OR first_name LIKE ? OR last_name LIKE ? OR phone LIKE ?
        ORDER BY username
    `;
    const [rows] = await pool.execute(query, [
        `%${searchTerm}%`,
        `%${searchTerm}%`,
        `%${searchTerm}%`,
        `%${searchTerm}%`,
        `%${searchTerm}%`
    ]);
    return rows;
};

// Get user by ID from DB
const getUserByIdFromDB = async (userId) => {
    const query = 'SELECT * FROM users WHERE user_id = ?';
    const [rows] = await pool.execute(query, [userId]);
    return rows;
};

// Update user basic info in DB
const updateUserInDB = async (userId, updateData) => {
    const fields = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updateData);
    values.push(userId);
    
    const query = `UPDATE users SET ${fields} WHERE user_id = ?`;
    const [result] = await pool.execute(query, values);
    return result;
};

// Check username exists excluding current user
const checkUsernameExistsExcluding = async (username, excludeUserId) => {
    const query = 'SELECT user_id FROM users WHERE username = ? AND user_id != ?';
    const [rows] = await pool.execute(query, [username, excludeUserId]);
    return rows;
};

// Check email exists excluding current user
const checkEmailExistsExcluding = async (email, excludeUserId) => {
    const query = 'SELECT user_id FROM users WHERE email = ? AND user_id != ?';
    const [rows] = await pool.execute(query, [email, excludeUserId]);
    return rows;
};

// Delete user from DB
const deleteUserFromDB = async (userId) => {
    const query = 'DELETE FROM users WHERE user_id = ?';
    const [result] = await pool.execute(query, [userId]);
    return result;
};

// Get user statistics from DB
const getUserStatsFromDB = async () => {
    // Total users
    const totalQuery = 'SELECT COUNT(*) as total FROM users';
    const [totalResult] = await pool.execute(totalQuery);
    
    // Users by role
    const roleQuery = 'SELECT role, COUNT(*) as count FROM users GROUP BY role';
    const [roleResult] = await pool.execute(roleQuery);
    
    // Daily registrations (last 7 days)
    const dailyQuery = `
        SELECT DATE(created_at) as date, COUNT(*) as registrations
        FROM users 
        WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
        GROUP BY DATE(created_at)
        ORDER BY date DESC
    `;
    const [dailyResult] = await pool.execute(dailyQuery);
    
    // Users by status
    const statusQuery = 'SELECT status, COUNT(*) as count FROM users GROUP BY status';
    const [statusResult] = await pool.execute(statusQuery);
    
    return {
        total: totalResult[0]?.total || 0,
        byRole: roleResult,
        dailyRegistrations: dailyResult,
        byStatus: statusResult
    };
};

// Update user password in DB
const updateUserPasswordInDB = async (email, passwordHash) => {
    const query = 'UPDATE users SET password_hash = ? WHERE email = ?';
    const [result] = await pool.execute(query, [passwordHash, email]);
    return result;
};

// Check user reservations
const checkUserReservationsInDB = async (userId) => {
    const query = 'SELECT room_order_id FROM room_orders WHERE user_id = ? LIMIT 1';
    const [rows] = await pool.execute(query, [userId]);
    return rows;
};

// Check user food orders
const checkUserFoodOrdersInDB = async (userId) => {
    const query = 'SELECT food_order_id FROM food_orders WHERE user_id = ? LIMIT 1';
    const [rows] = await pool.execute(query, [userId]);
    return rows;
};

module.exports = {
    checkUsernameExists,
    checkEmailExists,
    getUserByEmail,
    createNewUser,
    getAllUsersFromDB,
    searchUsersInDB,
    getUserByIdFromDB,
    updateUserInDB,
    checkUsernameExistsExcluding,
    checkEmailExistsExcluding,
    deleteUserFromDB,
    getUserStatsFromDB,
    updateUserPasswordInDB,
    checkUserReservationsInDB,
    checkUserFoodOrdersInDB
};