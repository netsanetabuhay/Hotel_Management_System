const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
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
} = require('../Models/userdb.js');
const { sendSuccess, sendError } = require('../Utils/response'); // ✅ ADD THIS IMPORT

// Register new user
const registerUser = async (req, res) => {
    try {
        const { username, email, password, first_name, last_name, phone } = req.body;

        // Validation
        if (!username || !email || !password) {
            return sendError(res, 'Username, email, and password are required', 400);
        }

        // Check if username already exists
        const existingUsername = await checkUsernameExists(username);
        if (existingUsername.length > 0) {
            return sendError(res, 'Username already exists', 400);
        }

        // Check if email already exists
        const existingEmail = await checkEmailExists(email);
        if (existingEmail.length > 0) {
            return sendError(res, 'Email already exists', 400);
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Generate user ID
        const userId = 'USR' + Date.now();

        // Prepare user data
        const userData = {
            userId,
            username,
            email,
            passwordHash,
            first_name: first_name || null,
            last_name: last_name || null,
            phone: phone || null,
            role: 'user'
        };

        // Create user in database
        await createNewUser(userData);

        // Get created user (without password)
        const createdUser = await getUserByIdFromDB(userId);
        const user = createdUser[0];
        
        // Remove password from response
        if (user) {
            delete user.password_hash;
        }

        return sendSuccess(res, 'User registered successfully', { user }, 201);

    } catch (error) {
        console.error('Registration error:', error);
        return sendError(res, 'Server error during registration', 500);
    }
};

// Login user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return sendError(res, 'Email and password are required', 400);
        }

        // Find user
        const users = await getUserByEmail(email);
        
        if (users.length === 0) {
            return sendError(res, 'Invalid credentials', 401);
        }

        const user = users[0];

        // Check password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return sendError(res, 'Invalid credentials', 401);
        }

        // Create JWT payload
        const payload = {
            id: user.user_id,
            username: user.username,
            email: user.email,
            role: user.role
        };

        // Generate token
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

        // Remove password from response
        delete user.password_hash;

        return sendSuccess(res, 'Login successful', {
            user,
            token
        });

    } catch (error) {
        console.error('Login error:', error);
        return sendError(res, 'Server error during login', 500);
    }
};

// Get all users (admin only)
const getAllUsers = async (req, res) => {
    try {
        const users = await getAllUsersFromDB();
        
        // Remove passwords
        const usersWithoutPasswords = users.map(user => {
            const { password_hash, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });

        return sendSuccess(res, 'Users retrieved successfully', usersWithoutPasswords);

    } catch (error) {
        console.error('Get all users error:', error);
        return sendError(res, 'Server error retrieving users', 500);
    }
};

// Search users (admin only)
const searchUsersController = async (req, res) => {
    try {
        const { search } = req.query;
        
        if (!search) {
            return sendError(res, 'Search query is required', 400);
        }

        const users = await searchUsersInDB(search);
        
        // Remove passwords from all users
        const usersWithoutPasswords = users.map(user => {
            const { password_hash, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });

        return sendSuccess(res, 'Search results retrieved', usersWithoutPasswords);

    } catch (error) {
        console.error('Search users error:', error);
        return sendError(res, 'Server error searching users', 500);
    }
};

// Update user
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { first_name, last_name, phone, username, email } = req.body;
        
        // Check if user exists
        const users = await getUserByIdFromDB(id);
        if (users.length === 0) {
            return sendError(res, 'User not found', 404);
        }

        // Prepare update data
        const updateData = {};
        
        // Basic info updates (allowed for all)
        if (first_name !== undefined) updateData.first_name = first_name;
        if (last_name !== undefined) updateData.last_name = last_name;
        if (phone !== undefined) updateData.phone = phone;
        
        // Admin-only updates
        if (req.user.role === 'admin') {
            if (username !== undefined) {
                // Check if username exists for other users
                const existingUsername = await checkUsernameExistsExcluding(username, id);
                if (existingUsername.length > 0) {
                    return sendError(res, 'Username already exists', 400);
                }
                updateData.username = username;
            }
            if (email !== undefined) {
                // Check if email exists for other users
                const existingEmail = await checkEmailExistsExcluding(email, id);
                if (existingEmail.length > 0) {
                    return sendError(res, 'Email already exists', 400);
                }
                updateData.email = email;
            }
        }

        if (Object.keys(updateData).length === 0) {
            return sendError(res, 'No fields to update', 400);
        }

        // Update user
        await updateUserInDB(id, updateData);

        // Get updated user
        const updatedUsers = await getUserByIdFromDB(id);
        const updatedUser = updatedUsers[0];
        
        // Remove password from response
        if (updatedUser) {
            delete updatedUser.password_hash;
        }

        return sendSuccess(res, 'User updated successfully', updatedUser);

    } catch (error) {
        console.error('Update user error:', error);
        return sendError(res, 'Server error updating user', 500);
    }
};

// Delete user
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const currentUserId = req.user.id;
        
        // Check if user exists
        const users = await getUserByIdFromDB(id);
        if (users.length === 0) {
            return sendError(res, 'User not found', 404);
        }

        const userToDelete = users[0];
        
        // Authorization checks
        if (req.user.role === 'user') {
            // Regular users can only delete their own account
            if (currentUserId !== id) {
                return sendError(res, 'You can only delete your own account', 403);
            }
        }
        // Admin users can delete any account

        // Check if user has related records
        const hasReservations = await checkUserReservationsInDB(id);
        const hasFoodOrders = await checkUserFoodOrdersInDB(id);

        // Delete user
        await deleteUserFromDB(id);

        return sendSuccess(res, 'User deleted successfully', {
            hadReservations: hasReservations.length > 0,
            hadFoodOrders: hasFoodOrders.length > 0
        });

    } catch (error) {
        console.error('Delete user error:', error);
        return sendError(res, 'Server error deleting user', 500);
    }
};

// Get user statistics (admin only)
const getUserStats = async (req, res) => {
    try {
        const stats = await getUserStatsFromDB();

        return sendSuccess(res, 'User statistics retrieved', stats);

    } catch (error) {
        console.error('Get user stats error:', error);
        return sendError(res, 'Server error retrieving user statistics', 500);
    }
};

// Reset password
const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        if (!email || !newPassword) {
            return sendError(res, 'Email and new password are required', 400);
        }

        // Check if user exists
        const users = await getUserByEmail(email);
        if (users.length === 0) {
            return sendError(res, 'User not found', 404);
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(newPassword, salt);

        // Update password
        await updateUserPasswordInDB(email, passwordHash);

        return sendSuccess(res, 'Password reset successfully');

    } catch (error) {
        console.error('Reset password error:', error);
        return sendError(res, 'Server error resetting password', 500);
    }
};

module.exports = {
    registerUser,
    loginUser,
    getAllUsers,
    searchUsersController,
    updateUser,
    deleteUser,
    getUserStats,
    resetPassword
};