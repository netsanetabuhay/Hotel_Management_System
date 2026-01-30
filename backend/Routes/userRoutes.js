const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    getAllUsers,
    searchUsersController,
    updateUser,
    getUserByIdController,
    deleteUser,
    getUserStats
} = require('../Controllers/userController');
const { authenticate, authorize, checkUserAccess } = require('../Middleware/auth');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes (require authentication)
router.use(authenticate);

router.get('/', authorize(['admin']), getAllUsers);
router.get

router.get('/search', authenticate, authorize(['admin', 'manager']), searchUsersController);
router.get('/:id', checkUserAccess, getUserByIdController);

// Create new user (admin only)
router.post('/', authorize(['admin']), registerUser);

// Update user (admin or own profile)
router.put('/:id', checkUserAccess, updateUser);

// Delete user (admin only)
router.delete('/:id', authorize(['admin']), deleteUser);

// Get user statistics (admin only)
router.get('/stats/overview', authorize(['admin']), getUserStats);

module.exports = router;