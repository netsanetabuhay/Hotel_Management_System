// Models/activity.js
const { pool } = require('../Config/database');

// READ - Get all activity logs with filters
const findAllActivities = async (filters = {}) => {
    const {
        userId,
        activity,
        startDate,
        endDate,
        page = 1,
        limit = 50
    } = filters;
    
    let query = `
        SELECT 
            al.log_id,
            al.user_id,
            al.activity,
            al.timestamp,
            u.username,
            u.first_name,
            u.last_name,
            u.role,
            u.email,
            u.phone,
            u.status as user_status
        FROM activity_logs al
        LEFT JOIN users u ON al.user_id = u.user_id
        WHERE 1=1
    `;
    
    const params = [];
    
    // Apply filters
    if (userId) {
        query += ' AND al.user_id = ?';
        params.push(userId);
    }
    
    if (activity) {
        query += ' AND al.activity LIKE ?';
        params.push(`%${activity}%`);
    }
    
    if (startDate) {
        query += ' AND DATE(al.timestamp) >= ?';
        params.push(startDate);
    }
    
    if (endDate) {
        query += ' AND DATE(al.timestamp) <= ?';
        params.push(endDate);
    }
    
    // Add sorting (newest first by default)
    query += ' ORDER BY al.timestamp DESC';
    
    // Add pagination
    const offset = (page - 1) * limit;
    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    try {
        const [rows] = await pool.query(query, params);
        return rows;
    } catch (error) {
        console.error('Error in findAllActivities:', error);
        throw new Error(`Database error: ${error.message}`);
    }
};

// READ - Get single activity by ID
const findActivityById = async (id) => {
    const query = `
        SELECT 
            al.log_id,
            al.user_id,
            al.activity,
            al.timestamp,
            u.username,
            u.first_name,
            u.last_name,
            u.role,
            u.email,
            u.phone,
            u.status as user_status
        FROM activity_logs al
        LEFT JOIN users u ON al.user_id = u.user_id
        WHERE al.log_id = ?
    `;
    
    try {
        const [rows] = await pool.query(query, [id]);
        
        if (rows.length === 0) {
            return null;
        }
        
        return rows[0];
    } catch (error) {
        console.error('Error in findActivityById:', error);
        throw new Error(`Database error: ${error.message}`);
    }
};

// READ - Get activities by user ID
const findActivitiesByUserId = async (filters) => {
    const { userId, page = 1, limit = 30 } = filters;
    const offset = (page - 1) * limit;
    
    // First check if user exists
    const userCheckQuery = `
        SELECT user_id, username, first_name, last_name, role 
        FROM users 
        WHERE user_id = ?
    `;
    const [userCheck] = await pool.query(userCheckQuery, [userId]);
    
    if (userCheck.length === 0) {
        return {
            user: null,
            activities: []
        };
    }
    
    const query = `
        SELECT 
            al.log_id,
            al.user_id,
            al.activity,
            al.timestamp,
            u.username,
            u.first_name,
            u.last_name,
            u.role,
            u.email
        FROM activity_logs al
        LEFT JOIN users u ON al.user_id = u.user_id
        WHERE al.user_id = ?
        ORDER BY al.timestamp DESC
        LIMIT ? OFFSET ?
    `;
    
    try {
        const [rows] = await pool.query(query, [userId, parseInt(limit), offset]);
        
        return {
            user: userCheck[0],
            activities: rows
        };
    } catch (error) {
        console.error('Error in findActivitiesByUserId:', error);
        throw new Error(`Database error: ${error.message}`);
    }
};

// CREATE - Create new activity log
const createActivityLog = async (activityData) => {
    const { user_id, activity } = activityData;
    
    if (!user_id || !activity) {
        throw new Error('User ID and activity are required');
    }
    
    // Check if user exists and is active
    const userCheckQuery = `
        SELECT user_id, username, role 
        FROM users 
        WHERE user_id = ? AND status = 'active'
    `;
    const [userCheck] = await pool.query(userCheckQuery, [user_id]);
    
    if (userCheck.length === 0) {
        throw new Error('User not found or inactive');
    }
    
    // Generate activity ID
    const activityId = `ACT${Date.now()}${Math.floor(Math.random() * 1000)}`;
    
    const query = `
        INSERT INTO activity_logs (user_id, activity, timestamp)
        VALUES (?, ?, NOW())
    `;
    
    try {
        const [result] = await pool.query(query, [user_id, activity]);
        
        // Return the newly created activity
        const newActivity = await findActivityById(result.insertId);
        return newActivity;
    } catch (error) {
        console.error('Error in createActivityLog:', error);
        
        // Handle specific database errors
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            throw new Error('User not found');
        }
        
        throw new Error(`Database error: ${error.message}`);
    }
};

// CREATE - Batch create activity logs (for system events)
const createBatchActivityLogs = async (activities) => {
    if (!Array.isArray(activities) || activities.length === 0) {
        throw new Error('Activities array is required and cannot be empty');
    }
    
    const values = [];
    const placeholders = [];
    
    for (const activity of activities) {
        if (!activity.user_id || !activity.activity) {
            throw new Error('Each activity must have user_id and activity');
        }
        
        values.push(activity.user_id, activity.activity);
        placeholders.push('(?, ?, NOW())');
    }
    
    const query = `
        INSERT INTO activity_logs (user_id, activity, timestamp)
        VALUES ${placeholders.join(', ')}
    `;
    
    try {
        const [result] = await pool.query(query, values);
        
        return {
            success: true,
            message: `Successfully created ${result.affectedRows} activity logs`,
            affectedRows: result.affectedRows
        };
    } catch (error) {
        console.error('Error in createBatchActivityLogs:', error);
        throw new Error(`Database error: ${error.message}`);
    }
};

// DELETE - Delete activity log
const deleteActivityLog = async (id) => {
    // First check if log exists
    const checkQuery = `
        SELECT al.*, u.username, u.role 
        FROM activity_logs al
        LEFT JOIN users u ON al.user_id = u.user_id
        WHERE al.log_id = ?
    `;
    const [checkResult] = await pool.query(checkQuery, [id]);
    
    if (checkResult.length === 0) {
        return {
            success: false,
            message: 'Activity log not found',
            data: null
        };
    }
    
    const deleteQuery = 'DELETE FROM activity_logs WHERE log_id = ?';
    
    try {
        const [result] = await pool.query(deleteQuery, [id]);
        
        if (result.affectedRows > 0) {
            return {
                success: true,
                message: 'Activity log deleted successfully',
                data: checkResult[0] // Return the deleted activity info
            };
        } else {
            return {
                success: false,
                message: 'Failed to delete activity log',
                data: null
            };
        }
    } catch (error) {
        console.error('Error in deleteActivityLog:', error);
        throw new Error(`Database error: ${error.message}`);
    }
};

// DELETE - Delete multiple activity logs
const deleteMultipleActivityLogs = async (ids) => {
    if (!Array.isArray(ids) || ids.length === 0) {
        throw new Error('Array of activity IDs is required');
    }
    
    // Get the activities before deletion
    const placeholders = ids.map(() => '?').join(', ');
    const selectQuery = `
        SELECT al.*, u.username, u.role 
        FROM activity_logs al
        LEFT JOIN users u ON al.user_id = u.user_id
        WHERE al.log_id IN (${placeholders})
    `;
    
    const [activitiesToDelete] = await pool.query(selectQuery, ids);
    
    const deleteQuery = `
        DELETE FROM activity_logs 
        WHERE log_id IN (${placeholders})
    `;
    
    try {
        const [result] = await pool.query(deleteQuery, ids);
        
        return {
            success: true,
            message: `Successfully deleted ${result.affectedRows} activity logs`,
            affectedRows: result.affectedRows,
            deletedActivities: activitiesToDelete
        };
    } catch (error) {
        console.error('Error in deleteMultipleActivityLogs:', error);
        throw new Error(`Database error: ${error.message}`);
    }
};

// DELETE - Delete old activity logs (auto-cleanup)
const deleteOldActivityLogs = async (days = 90) => {
    const query = `
        DELETE FROM activity_logs 
        WHERE timestamp < DATE_SUB(NOW(), INTERVAL ? DAY)
    `;
    
    try {
        const [result] = await pool.query(query, [days]);
        
        return {
            success: true,
            message: `Deleted ${result.affectedRows} activity logs older than ${days} days`,
            affectedRows: result.affectedRows
        };
    } catch (error) {
        console.error('Error in deleteOldActivityLogs:', error);
        throw new Error(`Database error: ${error.message}`);
    }
};

// READ - Count activities with filters
const countActivities = async (filters = {}) => {
    const { userId, activity, startDate, endDate } = filters;
    
    let query = `
        SELECT COUNT(*) as total 
        FROM activity_logs al
        WHERE 1=1
    `;
    const params = [];
    
    if (userId) {
        query += ' AND al.user_id = ?';
        params.push(userId);
    }
    
    if (activity) {
        query += ' AND al.activity LIKE ?';
        params.push(`%${activity}%`);
    }
    
    if (startDate) {
        query += ' AND DATE(al.timestamp) >= ?';
        params.push(startDate);
    }
    
    if (endDate) {
        query += ' AND DATE(al.timestamp) <= ?';
        params.push(endDate);
    }
    
    try {
        const [rows] = await pool.query(query, params);
        return rows[0]?.total || 0;
    } catch (error) {
        console.error('Error in countActivities:', error);
        throw new Error(`Database error: ${error.message}`);
    }
};

// READ - Get activity summary statistics
const getActivitySummary = async (timeframe = 'today') => {
    let dateCondition = '';
    
    switch (timeframe.toLowerCase()) {
        case 'today':
            dateCondition = 'DATE(timestamp) = CURDATE()';
            break;
        case 'yesterday':
            dateCondition = 'DATE(timestamp) = DATE_SUB(CURDATE(), INTERVAL 1 DAY)';
            break;
        case 'week':
            dateCondition = 'timestamp >= DATE_SUB(NOW(), INTERVAL 7 DAY)';
            break;
        case 'month':
            dateCondition = 'timestamp >= DATE_SUB(NOW(), INTERVAL 30 DAY)';
            break;
        case 'year':
            dateCondition = 'timestamp >= DATE_SUB(NOW(), INTERVAL 365 DAY)';
            break;
        default:
            dateCondition = 'DATE(timestamp) = CURDATE()';
    }
    
    const queries = {
        // Total activities in timeframe
        totalActivities: `
            SELECT COUNT(*) as count 
            FROM activity_logs 
            WHERE ${dateCondition}
        `,
        
        // Activities by user role
        activitiesByRole: `
            SELECT 
                u.role, 
                COUNT(*) as count,
                COUNT(*) * 100.0 / SUM(COUNT(*)) OVER() as percentage
            FROM activity_logs al
            JOIN users u ON al.user_id = u.user_id
            WHERE ${dateCondition}
            GROUP BY u.role
            ORDER BY count DESC
        `,
        
        // Top active users
        topActiveUsers: `
            SELECT 
                u.user_id,
                u.username,
                u.first_name,
                u.last_name,
                u.role,
                u.email,
                COUNT(*) as activity_count,
                MAX(al.timestamp) as last_activity
            FROM activity_logs al
            JOIN users u ON al.user_id = u.user_id
            WHERE ${dateCondition}
            GROUP BY al.user_id
            ORDER BY activity_count DESC
            LIMIT 10
        `,
        
        // Activities by hour of day
        activitiesByHour: `
            SELECT 
                HOUR(timestamp) as hour,
                COUNT(*) as count
            FROM activity_logs
            WHERE ${dateCondition}
            GROUP BY HOUR(timestamp)
            ORDER BY hour
        `,
        
        // Activities by day
        activitiesByDay: `
            SELECT 
                DATE(timestamp) as date,
                DAYNAME(timestamp) as day_name,
                COUNT(*) as count
            FROM activity_logs
            WHERE ${dateCondition}
            GROUP BY DATE(timestamp)
            ORDER BY date DESC
            LIMIT 15
        `,
        
        // Most common activities
        mostCommonActivities: `
            SELECT 
                activity,
                COUNT(*) as count,
                MIN(timestamp) as first_occurrence,
                MAX(timestamp) as last_occurrence
            FROM activity_logs
            WHERE ${dateCondition}
            GROUP BY activity
            ORDER BY count DESC
            LIMIT 20
        `
    };
    
    try {
        const [
            [totalResult],
            [roleResults],
            [userResults],
            [hourResults],
            [dayResults],
            [activityResults]
        ] = await Promise.all([
            pool.query(queries.totalActivities),
            pool.query(queries.activitiesByRole),
            pool.query(queries.topActiveUsers),
            pool.query(queries.activitiesByHour),
            pool.query(queries.activitiesByDay),
            pool.query(queries.mostCommonActivities)
        ]);
        
        return {
            timeframe: timeframe.toLowerCase(),
            summary: {
                totalActivities: totalResult[0]?.count || 0,
                uniqueUsers: userResults.length
            },
            byRole: roleResults,
            topUsers: userResults,
            byHour: hourResults,
            byDay: dayResults,
            commonActivities: activityResults,
            generatedAt: new Date()
        };
    } catch (error) {
        console.error('Error in getActivitySummary:', error);
        throw new Error(`Database error: ${error.message}`);
    }
};

// READ - Get system health/activity status
const getSystemActivityStatus = async () => {
    const queries = {
        // Recent activities (last 1 hour)
        recentActivities: `
            SELECT COUNT(*) as count
            FROM activity_logs
            WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 1 HOUR)
        `,
        
        // Active users today
        activeUsersToday: `
            SELECT COUNT(DISTINCT user_id) as count
            FROM activity_logs
            WHERE DATE(timestamp) = CURDATE()
        `,
        
        // User activity status
        userActivityStatus: `
            SELECT 
                u.role,
                COUNT(DISTINCT u.user_id) as total_users,
                COUNT(DISTINCT al.user_id) as active_users_today,
                ROUND(COUNT(DISTINCT al.user_id) * 100.0 / COUNT(DISTINCT u.user_id), 2) as activity_rate
            FROM users u
            LEFT JOIN activity_logs al ON u.user_id = al.user_id AND DATE(al.timestamp) = CURDATE()
            WHERE u.status = 'active'
            GROUP BY u.role
            ORDER BY u.role
        `,
        
        // Peak activity hours
        peakHours: `
            SELECT 
                HOUR(timestamp) as hour,
                COUNT(*) as activity_count
            FROM activity_logs
            WHERE DATE(timestamp) = CURDATE()
            GROUP BY HOUR(timestamp)
            ORDER BY activity_count DESC
            LIMIT 3
        `
    };
    
    try {
        const [
            [recentResult],
            [activeUsersResult],
            [userStatusResult],
            [peakHoursResult]
        ] = await Promise.all([
            pool.query(queries.recentActivities),
            pool.query(queries.activeUsersToday),
            pool.query(queries.userActivityStatus),
            pool.query(queries.peakHours)
        ]);
        
        return {
            status: 'active',
            recentActivity: {
                lastHour: recentResult[0]?.count || 0,
                activeUsersToday: activeUsersResult[0]?.count || 0
            },
            userActivityByRole: userStatusResult,
            peakActivityHours: peakHoursResult,
            lastUpdated: new Date()
        };
    } catch (error) {
        console.error('Error in getSystemActivityStatus:', error);
        throw new Error(`Database error: ${error.message}`);
    }
};
// UPDATE - Update activity log
const updateActivityLog = async (id, updateData) => {
    // First check if log exists
    const checkQuery = 'SELECT log_id FROM activity_logs WHERE log_id = ?';
    const [checkResult] = await pool.query(checkQuery, [id]);
    
    if (checkResult.length === 0) {
        return {
            success: false,
            message: 'Activity log not found',
            data: null
        };
    }
    
    // Only allow updating the activity field (not user_id or timestamp)
    const allowedFields = ['activity'];
    const updateFields = [];
    const params = [];
    
    // Validate update data
    if (updateData.activity !== undefined) {
        if (typeof updateData.activity !== 'string' || updateData.activity.trim() === '') {
            throw new Error('Activity must be a non-empty string');
        }
        if (updateData.activity.length > 200) {
            throw new Error('Activity description is too long (max 200 characters)');
        }
        updateFields.push('activity = ?');
        params.push(updateData.activity.trim());
    }
    
    // Add timestamp update
    updateFields.push('timestamp = NOW()');
    
    if (updateFields.length === 0) {
        return {
            success: false,
            message: 'No valid fields provided for update',
            data: null
        };
    }
    
    params.push(id);
    
    const query = `
        UPDATE activity_logs 
        SET ${updateFields.join(', ')}
        WHERE log_id = ?
    `;
    
    try {
        const [result] = await pool.query(query, params);
        
        if (result.affectedRows > 0) {
            // Get the updated activity
            const updatedActivity = await findActivityById(id);
            return {
                success: true,
                message: 'Activity log updated successfully',
                data: updatedActivity
            };
        } else {
            return {
                success: false,
                message: 'Failed to update activity log',
                data: null
            };
        }
    } catch (error) {
        console.error('Error in updateActivityLog:', error);
        throw new Error(`Database error: ${error.message}`);
    }
};

// READ - Search activities with advanced filters
const searchActivities = async (searchCriteria = {}) => {
    const {
        searchText,
        userId,
        role,
        startDate,
        endDate,
        sortBy = 'timestamp',
        sortOrder = 'DESC',
        page = 1,
        limit = 50
    } = searchCriteria;
    
    let query = `
        SELECT 
            al.log_id,
            al.user_id,
            al.activity,
            al.timestamp,
            u.username,
            u.first_name,
            u.last_name,
            u.role,
            u.email
        FROM activity_logs al
        JOIN users u ON al.user_id = u.user_id
        WHERE 1=1
    `;
    
    const params = [];
    
    // Apply search criteria
    if (searchText) {
        query += ' AND (al.activity LIKE ? OR u.username LIKE ? OR u.first_name LIKE ? OR u.last_name LIKE ?)';
        const searchParam = `%${searchText}%`;
        params.push(searchParam, searchParam, searchParam, searchParam);
    }
    
    if (userId) {
        query += ' AND al.user_id = ?';
        params.push(userId);
    }
    
    if (role) {
        query += ' AND u.role = ?';
        params.push(role);
    }
    
    if (startDate) {
        query += ' AND DATE(al.timestamp) >= ?';
        params.push(startDate);
    }
    
    if (endDate) {
        query += ' AND DATE(al.timestamp) <= ?';
        params.push(endDate);
    }
    
    // Validate sort column
    const validSortColumns = ['timestamp', 'username', 'role', 'activity'];
    const sortColumn = validSortColumns.includes(sortBy) ? 
        (sortBy === 'username' ? 'u.username' : sortBy === 'role' ? 'u.role' : `al.${sortBy}`) : 
        'al.timestamp';
    
    const validSortOrders = ['ASC', 'DESC'];
    const order = validSortOrders.includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'DESC';
    
    query += ` ORDER BY ${sortColumn} ${order}`;
    
    // Add pagination
    const offset = (page - 1) * limit;
    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);
    
    // Get total count
    let countQuery = query.replace(
        /SELECT[\s\S]*?FROM/i, 
        'SELECT COUNT(*) as total FROM'
    ).split('ORDER BY')[0].split('LIMIT')[0];
    
    try {
        const [rows] = await pool.query(query, params);
        const [countResult] = await pool.query(countQuery, params.slice(0, -2)); // Remove limit/offset params
        
        return {
            activities: rows,
            total: countResult[0]?.total || 0,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil((countResult[0]?.total || 0) / limit)
        };
    } catch (error) {
        console.error('Error in searchActivities:', error);
        throw new Error(`Database error: ${error.message}`);
    }
};

// Export all functions
module.exports = {
    findAllActivities,
    findActivityById,
    findActivitiesByUserId,
    createActivityLog,
    createBatchActivityLogs,
    deleteActivityLog,
    deleteMultipleActivityLogs,
    deleteOldActivityLogs,
    countActivities,
   updateActivityLog,
    getActivitySummary,
    getSystemActivityStatus,
    searchActivities
};