// Controllers/activityController.js
const {
    findAllActivities,
    findActivityById,
    findActivitiesByUserId,
    createActivityLog,
    deleteActivityLog,
    countActivities,
    getActivitySummary
} = require('../Models/activityLog')

// Helper function to log activity (for use in other controllers)
const logActivity = async (userId, activity) => {
    try {
        await createActivityLog({ user_id: userId, activity });
        return true;
    } catch (error) {
        console.error('Error logging activity:', error);
        return false;
    }
};

// GET all activities
const getAllActivities = async (req, res) => {
    try {
        const {
            userId,
            activity,
            startDate,
            endDate,
            page = 1,
            limit = 50
        } = req.query;

        const filters = {
            userId,
            activity,
            startDate,
            endDate,
            page: parseInt(page),
            limit: parseInt(limit)
        };

        const activities = await findAllActivities(filters);
        
        // Get total count for pagination
        const total = await countActivities(filters);
        const totalPages = Math.ceil(total / filters.limit);

        res.json({
            success: true,
            data: activities,
            pagination: {
                page: filters.page,
                limit: filters.limit,
                total,
                totalPages
            }
        });
    } catch (error) {
        console.error('Error fetching activities:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching activities'
        });
    }
};

// UNIFIED FUNCTION: GET activity by ID OR activities by user ID
const getActivity = async (req, res) => {
    try {
        const { id, userId } = req.params;
        const { page = 1, limit = 30 } = req.query;
        
        // Determine which endpoint was called
        const isActivityById = req.originalUrl.includes('/id/');
        const isUserActivities = req.originalUrl.includes('/user/');
        
        if (isActivityById) {
            // CASE 1: Get single activity by ID
            const activity = await findActivityById(id);
            
            if (!activity) {
                return res.status(404).json({
                    success: false,
                    message: 'Activity log not found'
                });
            }
            
            // Check if user is allowed to view this activity
            const isAdminOrManager = ['admin', 'manager'].includes(req.user.role);
            const isOwnActivity = req.user.id === activity.user_id;
            
            if (!isAdminOrManager && !isOwnActivity) {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied. You can only view your own activities'
                });
            }
            
            return res.json({
                success: true,
                data: activity
            });
            
        } else if (isUserActivities) {
            // CASE 2: Get activities by user ID
            const targetUserId = userId || id;
            
            // Check if user is allowed to view these activities
            const isAdminOrManager = ['admin', 'manager'].includes(req.user.role);
            const isOwnRequest = req.user.id === targetUserId;
            
            if (!isAdminOrManager && !isOwnRequest) {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied. You can only view your own activities'
                });
            }
            
            const filters = {
                userId: targetUserId,
                page: parseInt(page),
                limit: parseInt(limit)
            };
            
            const activities = await findActivitiesByUserId(filters);
            const total = await countActivities(filters);
            const totalPages = Math.ceil(total / filters.limit);
            
            return res.json({
                success: true,
                data: activities,
                pagination: {
                    page: filters.page,
                    limit: filters.limit,
                    total,
                    totalPages
                }
            });
        } else {
            // This shouldn't happen if routes are configured correctly
            return res.status(400).json({
                success: false,
                message: 'Invalid endpoint'
            });
        }
        
    } catch (error) {
        console.error('Error in getActivity function:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching activity data'
        });
    }
};

// Alternative version with cleaner parameter handling:
const getActivityV2 = async (req, res) => {
    try {
        // Check route pattern to determine what we're fetching
        const path = req.path;
        
        if (path.startsWith('/id/')) {
            // Fetch single activity
            const activityId = req.params.id || req.params.activityId;
            return handleGetSingleActivity(req, res, activityId);
        } else if (path.startsWith('/user/')) {
            // Fetch user activities
            const userId = req.params.userId || req.params.id;
            return handleGetUserActivities(req, res, userId);
        }
        
        // Fallback - shouldn't reach here
        return res.status(400).json({
            success: false,
            message: 'Invalid endpoint pattern'
        });
        
    } catch (error) {
        console.error('Error in getActivityV2:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching activity data'
        });
    }
};

// Helper function for single activity
const handleGetSingleActivity = async (req, res, activityId) => {
    const activity = await findActivityById(activityId);
    
    if (!activity) {
        return res.status(404).json({
            success: false,
            message: 'Activity log not found'
        });
    }
    
    // Check permissions
    const isAdminOrManager = ['admin', 'manager'].includes(req.user.role);
    const isOwnActivity = req.user.id === activity.user_id;
    
    if (!isAdminOrManager && !isOwnActivity) {
        return res.status(403).json({
            success: false,
            message: 'Access denied. You can only view your own activities'
        });
    }
    
    res.json({
        success: true,
        data: activity
    });
};

// Helper function for user activities
const handleGetUserActivities = async (req, res, userId) => {
    const { page = 1, limit = 30 } = req.query;
    
    // Check permissions
    const isAdminOrManager = ['admin', 'manager'].includes(req.user.role);
    const isOwnRequest = req.user.id === userId;
    
    if (!isAdminOrManager && !isOwnRequest) {
        return res.status(403).json({
            success: false,
            message: 'Access denied. You can only view your own activities'
        });
    }
    
    const filters = {
        userId,
        page: parseInt(page),
        limit: parseInt(limit)
    };
    
    const activities = await findActivitiesByUserId(filters);
    const total = await countActivities(filters);
    const totalPages = Math.ceil(total / filters.limit);
    
    res.json({
        success: true,
        data: activities,
        pagination: {
            page: filters.page,
            limit: filters.limit,
            total,
            totalPages
        }
    });
};
// UPDATE task
const updateTaskController = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        // Validate required fields
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Task ID is required'
            });
        }
        
        // Remove any fields that shouldn't be updated
        delete updateData.task_id;
        delete updateData.created_at;
        
        // Validate status if provided
        if (updateData.status && !['pending', 'in-progress', 'completed', 'cancelled'].includes(updateData.status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Allowed values: pending, in-progress, completed, cancelled'
            });
        }
        
        // Validate task_type if provided
        const validTaskTypes = ['cleaning', 'maintenance', 'room-service', 'check-in', 'check-out', 'other'];
        if (updateData.task_type && !validTaskTypes.includes(updateData.task_type)) {
            return res.status(400).json({
                success: false,
                message: `Invalid task type. Allowed values: ${validTaskTypes.join(', ')}`
            });
        }
        
        const result = await updateTask(id, updateData);
        
        if (!result.success) {
            return res.status(404).json({
                success: false,
                message: result.message
            });
        }
        
        res.json({
            success: true,
            message: result.message,
            data: result.data
        });
    } catch (error) {
        console.error('Error updating task:', error);
        
        if (error.message.includes('not found')) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
        
        if (error.message.includes('Invalid') || error.message.includes('Required')) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Server error while updating task'
        });
    }
};

// UPDATE task status only
const updateTaskStatusController = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        if (!id || !status) {
            return res.status(400).json({
                success: false,
                message: 'Task ID and status are required'
            });
        }
        
        // Validate status
        const validStatuses = ['pending', 'in-progress', 'completed', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Invalid status. Allowed values: ${validStatuses.join(', ')}`
            });
        }
        
        const result = await updateTaskStatus(id, status);
        
        if (!result.success) {
            return res.status(404).json({
                success: false,
                message: result.message
            });
        }
        
        res.json({
            success: true,
            message: result.message,
            data: result.data
        });
    } catch (error) {
        console.error('Error updating task status:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating task status'
        });
    }
};

// POST create a new activity log
const createActivity = async (req, res) => {
    try {
        const { userId, activity } = req.body;
        
        if (!userId || !activity) {
            return res.status(400).json({
                success: false,
                message: 'User ID and activity are required'
            });
        }
        
        // Validate activity length
        if (activity.length > 200) {
            return res.status(400).json({
                success: false,
                message: 'Activity description is too long (max 200 characters)'
            });
        }
        
        const activityData = {
            user_id: userId,
            activity: activity.trim()
        };
        
        const result = await createActivityLog(activityData);
        
        res.status(201).json({
            success: true,
            message: 'Activity logged successfully',
            data: result
        });
    } catch (error) {
        console.error('Error creating activity log:', error);
        
        if (error.message.includes('User not found')) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Server error while creating activity log'
        });
    }
};

// DELETE activity log
const deleteActivity = async (req, res) => {
    try {
        const { id } = req.params;
        
        const result = await deleteActivityLog(id);
        
        if (!result.success) {
            return res.status(404).json({
                success: false,
                message: result.message
            });
        }
        
        res.json({
            success: true,
            message: result.message
        });
    } catch (error) {
        console.error('Error deleting activity:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting activity'
        });
    }
};

// GET activity statistics
const getActivityStats = async (req, res) => {
    try {
        const { timeframe = 'today' } = req.query;
        
        const stats = await getActivitySummary(timeframe);
        
        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Error fetching activity stats:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching activity statistics'
        });
    }
};

// Export all functions - NOTE: Only ONE function for both cases
module.exports = {
    getAllActivities,
    getActivity,  // Unified function handles both cases
    createActivity,
    deleteActivity,
    getActivityStats,
    updateTaskStatusController,
    updateTaskController,
    logActivity
};