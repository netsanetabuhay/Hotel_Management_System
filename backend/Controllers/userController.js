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

// Register new user
const registerUser = async (req, res) => {
    try {
        const { username, email, password, first_name, last_name, phone, role = 'user' } = req.body;

        // Validation
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username, email, and password are required'
            });
        }

        // Check if username already exists
        const existingUsername = await checkUsernameExists(username);
        if (existingUsername.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Username already exists'
            });
        }

        // Check if email already exists
        const existingEmail = await checkEmailExists(email);
        if (existingEmail.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Email already exists'
            });
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
            role: req.user?.role === 'admin' ? (role || 'user') : 'user'
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

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: { user }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during registration',
            error: error.message
        });
    }
};

// Login user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Find user
        const users = await getUserByEmail(email);
        
        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const user = users[0];

        // Check password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
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

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user,
                token
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login',
            error: error.message
        });
    }
};

// Get all users (admin only)
const getAllUsers = async (req, res) => {
    try {
        const users = await getAllUsersFromDB();
        
        // Remove passwords from all users
        const usersWithoutPasswords = users.map(user => {
            const { password_hash, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });

        res.json({
            success: true,
            message: 'Users retrieved successfully',
            data: usersWithoutPasswords
        });

    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error retrieving users',
            error: error.message
        });
    }
};

// Search users (admin only)
const searchUsersController = async (req, res) => {
    try {
        const { search } = req.query;
        
        if (!search) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }

        const users = await searchUsersInDB(search);
        
        // Remove passwords from all users
        const usersWithoutPasswords = users.map(user => {
            const { password_hash, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });

        res.json({
            success: true,
            message: 'Search results retrieved',
            data: usersWithoutPasswords
        });

    } catch (error) {
        console.error('Search users error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error searching users',
            error: error.message
        });
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
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
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
                    return res.status(400).json({
                        success: false,
                        message: 'Username already exists'
                    });
                }
                updateData.username = username;
            }
            if (email !== undefined) {
                // Check if email exists for other users
                const existingEmail = await checkEmailExistsExcluding(email, id);
                if (existingEmail.length > 0) {
                    return res.status(400).json({
                        success: false,
                        message: 'Email already exists'
                    });
                }
                updateData.email = email;
            }
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No fields to update'
            });
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

        res.json({
            success: true,
            message: 'User updated successfully',
            data: updatedUser
        });

    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error updating user',
            error: error.message
        });
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
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const userToDelete = users[0];
        
        // Authorization checks
        if (req.user.role === 'user') {
            // Regular users can only delete their own account
            if (currentUserId !== id) {
                return res.status(403).json({
                    success: false,
                    message: 'You can only delete your own account'
                });
            }
        }
        // Admin users can delete any account

        // Check if user has related records
        const hasReservations = await checkUserReservationsInDB(id);
        const hasFoodOrders = await checkUserFoodOrdersInDB(id);

        // Delete user
        await deleteUserFromDB(id);

        res.json({
            success: true,
            message: 'User deleted successfully',
            data: {
                hadReservations: hasReservations.length > 0,
                hadFoodOrders: hasFoodOrders.length > 0
            }
        });

    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error deleting user',
            error: error.message
        });
    }
};

// Get user statistics (admin only)
const getUserStats = async (req, res) => {
    try {
        const stats = await getUserStatsFromDB();

        res.json({
            success: true,
            message: 'User statistics retrieved',
            data: stats
        });

    } catch (error) {
        console.error('Get user stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error retrieving user statistics',
            error: error.message
        });
    }
};

// Reset password
const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        if (!email || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Email and new password are required'
            });
        }

        // Check if user exists
        const users = await getUserByEmail(email);
        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(newPassword, salt);

        // Update password
        await updateUserPasswordInDB(email, passwordHash);

        res.json({
            success: true,
            message: 'Password reset successfully'
        });

    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error resetting password',
            error: error.message
        });
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