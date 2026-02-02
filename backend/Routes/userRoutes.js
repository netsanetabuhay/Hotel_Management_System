const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    getAllUsers,
    searchUsersController,
    updateUser,
    deleteUser,
    getUserStats,
    resetPassword
} = require('../Controllers/userController');
const { authenticate, authorize, checkUserAccess } = require('../Middleware/auth');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/reset-password', resetPassword);

// Protected routes (require authentication)
router.use(authenticate);
//get all users (admin only)
router.get('/', authorize(['admin']), getAllUsers);
// Search users (admin only)
router.get('/search', authenticate, authorize(['admin']), searchUsersController);
//
router.post('/', authorize(['admin']), registerUser);
// Update user
router.patch('/:id', checkUserAccess, updateUser);
// Delete user 
router.delete('/:id', authorize(['admin','user']), deleteUser);

// Get user statistics (admin only)
router.get('/stats/overview', authorize(['admin']), getUserStats);

module.exports = router;