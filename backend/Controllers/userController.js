const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { 
    findUserByEmail, 
    createUser, 
    findUserById, 
    getAllUsersFromDB, 
    searchUsersByCriteria,
    updateUserInDB, 
    deleteUserFromDB,
    findUserByUsername,
    countUsersFromDB 
} = require('../Models/user');

dotenv.config();

// JWT token creation
const createToken = (user) => {
    return jwt.sign(
        { 
            id: user.user_id, 
            role: user.role,
            email: user.email 
        }, 
        process.env.JWT_SECRET, 
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );
};

// Register new user
const registerUser = async (req, res) => {
    try {
        const { username, email, password, first_name, last_name, phone, role } = req.body;
        
        if (!username || !email || !password || !first_name || !last_name || !phone) {
            return res.status(400).json({ 
                success: false, 
                message: 'All fields are required' 
            });
        }

        if (!email.includes('@')) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid email format' 
            });
        }

        // Check if email already exists
        const existingEmail = await findUserByEmail(email);
        if (existingEmail) {
            return res.status(409).json({ 
                success: false, 
                message: 'Email already registered' 
            });
        }

        // Check if username already exists
        const existingUsername = await findUserByUsername(username);
        if (existingUsername) {
            return res.status(409).json({ 
                success: false, 
                message: 'Username already taken' 
            });
        }

        // Hash password
        const hashedPassword = bcrypt.hashSync(password, 10);

        // Create user
        const userData = {
            username,
            email,
            password_hash: hashedPassword,
            first_name,
            last_name,
            phone,
            role: role || 'staff',
            status: 'active'
        };

        const userId = await createUser(userData);
        
        const token = createToken({ user_id: userId, email, role: role || 'staff' });

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: {
                user_id: userId,
                username,
                email,
                first_name,
                last_name,
                phone,
                role: role || 'staff'
            }
        });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ 
            success: false, 
            message: 'Server error during registration' 
        });
    }
};

// Login user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email and password required' 
            });
        }

        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        const isMatch = bcrypt.compareSync(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid password' 
            });
        }

        const token = createToken(user);
        
        // Remove password from response
        const { password_hash, ...userWithoutPassword } = user;

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: userWithoutPassword
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ 
            success: false, 
            message: 'Server error during login' 
        });
    }
};

// Get all users (admin only)
const getAllUsers = async (req, res) => {
    try {
        const users = await getAllUsersFromDB();
        res.json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (err) {
        console.error('Get all users error:', err);
        res.status(500).json({ 
            success: false, 
            message: 'Server error fetching users' 
        });
    }
};

// // Get single user by ID
const getUserByIdController = async (req, res) => {
    try {
        const user = await findUserById(req.params.id);
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }
        
        // Remove password from response
        const { password_hash, ...userWithoutPassword } = user;
        
        res.json({
            success: true,
            data: userWithoutPassword
        });
    } catch (err) {
        console.error('Get user by ID error:', err);
        res.status(500).json({ 
            success: false, 
            message: 'Server error fetching user' 
        });
    }
};
// Replace getUserByIdController with this search function
const searchUsersController = async (req, res) => {
    try {
        const searchParams = {
            user_id: req.query.user_id,
            username: req.query.username,
            email: req.query.email,
            first_name: req.query.first_name,
            last_name: req.query.last_name,
            phone: req.query.phone,
            role: req.query.role
        };
        
        // Remove empty/undefined params
        Object.keys(searchParams).forEach(key => {
            if (!searchParams[key]) {
                delete searchParams[key];
            }
        });
        
        // If no search parameters, return error
        if (Object.keys(searchParams).length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide at least one search parameter' 
            });
        }
        
        const users = await searchUsersByCriteria(searchParams);
        
        if (users.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'No users found matching your criteria' 
            });
        }
        
        res.json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (err) {
        console.error('Search users error:', err);
        res.status(500).json({ 
            success: false, 
            message: 'Server error searching users' 
        });
    }
};

// Update user details
const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const { username, email, first_name, last_name, phone, role, status } = req.body;
        
        // Don't allow password update via this route
        if (req.body.password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Use change password route for password updates' 
            });
        }

        const updateData = {
            username,
            email,
            first_name,
            last_name,
            phone,
            role,
            status
        };

        // Remove undefined fields
        Object.keys(updateData).forEach(key => {
            if (updateData[key] === undefined) {
                delete updateData[key];
            }
        });

        const updatedUser = await updateUserInDB(userId, updateData);
        
        if (!updatedUser) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        // Remove password from response
        const { password_hash, ...userWithoutPassword } = updatedUser;

        res.json({
            success: true,
            message: 'User updated successfully',
            data: userWithoutPassword
        });
    } catch (err) {
        console.error('Update user error:', err);
        res.status(500).json({ 
            success: false, 
            message: 'Server error updating user' 
        });
    }
};

// Delete user
const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        
        const deleted = await deleteUserFromDB(userId);
        
        if (!deleted) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (err) {
        console.error('Delete user error:', err);
        res.status(500).json({ 
            success: false, 
            message: 'Server error deleting user' 
        });
    }
};

// Get user statistics
const getUserStats = async (req, res) => {
    try {
        const totalUsers = await countUsersFromDB();
        
        res.json({
            success: true,
            data: {
                total_users: totalUsers,
                // Add more statistics as needed
            }
        });
    } catch (err) {
        console.error('Get user stats error:', err);
        res.status(500).json({ 
            success: false, 
            message: 'Server error fetching user statistics' 
        });
    }
};

// Export all functions
module.exports = {
    registerUser,
    loginUser,
    getAllUsers,
  getUserByIdController,
    searchUsersController,
    updateUser,
    deleteUser,
    getUserStats
};