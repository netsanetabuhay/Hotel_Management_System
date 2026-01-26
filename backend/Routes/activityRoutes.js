// Routes/activityRoutes.js
const express = require('express');
const router = express.Router();
const {
    getAllActivities,
    getActivity,  // Unified function for both single activity and user activities
    createActivity,
    deleteActivity,
    updateTaskStatusController,
    updateTaskController,
    getActivityStats
} = require('../Controllers/activityController');
const { authenticate, authorize } = require('../Middleware/auth');

// All routes require authentication
router.use(authenticate);

// Get all activities (admin/manager only)
router.get('/', authorize(['admin', 'manager']), getAllActivities);

// Unified route for both activity by ID and activities by user
// Pattern: /api/activities/id/{activityId} OR /api/activities/user/{userId}
router.get('/id/:id', authorize(['admin', 'manager']), getActivity);
router.get('/user/:userId', getActivity);

// Create new activity log (admin/manager only)
router.post('/', authorize(['admin', 'manager']), createActivity);

// Update task (full update)
router.put('/:id', authenticate, authorize(['admin', 'manager', 'receptionist']), updateTaskController);

// Update task status only
router.patch('/:id/status', authenticate, authorize(['admin', 'manager', 'receptionist', 'housekeeping']), updateTaskStatusController);

// Get activity statistics (admin/manager only)
router.get('/stats/overview', authorize(['admin', 'manager']), getActivityStats);


// Delete activity log (admin only)
router.delete('/:id', authorize(['admin']), deleteActivity);

module.exports = router;