const { pool } = require('../Config/database');

// CREATE - Create new task
const createTask = async (taskData) => {
  const sql = `
    INSERT INTO tasks 
      (task_id, title, assigned_to, task_type, status, room_id, due_date, created_at) 
    VALUES 
      (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  const values = [
    taskData.task_id,
    taskData.title,
    taskData.assigned_to || null,
    taskData.task_type,
    taskData.status || 'pending',
    taskData.room_id || null,
    taskData.due_date || null,
    taskData.created_at || new Date()
  ];

  try {
    const [result] = await pool.query(sql, values);
    return { 
      success: true, 
      message: 'Task created successfully',
      taskId: taskData.task_id 
    };
  } catch (error) {
    throw error;
  }
};

// READ - Get all tasks with filters
const findAllTasks = async (filters = {}) => {
  let sql = `
    SELECT t.*, 
           u.first_name as assigned_to_first_name,
           u.last_name as assigned_to_last_name,
           r.room_number
    FROM tasks t
    LEFT JOIN users u ON t.assigned_to = u.user_id
    LEFT JOIN rooms r ON t.room_id = r.room_id
    WHERE 1 = 1
  `;
  
  const values = [];

  if (filters.assigned_to) {
    sql += ' AND t.assigned_to = ?';
    values.push(filters.assigned_to);
  }
  
  if (filters.room_id) {
    sql += ' AND t.room_id = ?';
    values.push(filters.room_id);
  }
  
  if (filters.status) {
    sql += ' AND t.status = ?';
    values.push(filters.status);
  }
  
  if (filters.task_type) {
    sql += ' AND t.task_type = ?';
    values.push(filters.task_type);
  }

  sql += ' ORDER BY t.due_date ASC, t.created_at DESC';

  try {
    const [rows] = await pool.query(sql, values);
    return rows;
  } catch (error) {
    throw error;
  }
};

// READ - Get single task by ID
const findTaskById = async (task_id) => {
  const sql = `
    SELECT t.*, 
           u.first_name as assigned_to_first_name,
           u.last_name as assigned_to_last_name,
           r.room_number,
           r.room_type
    FROM tasks t
    LEFT JOIN users u ON t.assigned_to = u.user_id
    LEFT JOIN rooms r ON t.room_id = r.room_id
    WHERE t.task_id = ?
  `;
  
  try {
    const [rows] = await pool.query(sql, [task_id]);
    
    if (rows.length === 0) {
      return null;
    }
    
    return rows[0];
  } catch (error) {
    throw error;
  }
};

// READ - Search tasks (unified search)
const searchTasks = async (query) => {
  const sql = `
    SELECT t.*, 
           u.first_name as assigned_to_first_name,
           u.last_name as assigned_to_last_name,
           r.room_number
    FROM tasks t
    LEFT JOIN users u ON t.assigned_to = u.user_id
    LEFT JOIN rooms r ON t.room_id = r.room_id
    WHERE t.task_id LIKE ? 
       OR t.title LIKE ? 
       OR u.first_name LIKE ? 
       OR u.last_name LIKE ? 
       OR r.room_number LIKE ?
       OR t.task_type LIKE ?
       OR t.status LIKE ?
    ORDER BY t.due_date ASC, t.created_at DESC
  `;
  
  try {
    const searchPattern = `%${query}%`;
    const [rows] = await pool.query(sql, [
      searchPattern, searchPattern, searchPattern,
      searchPattern, searchPattern, searchPattern,
      searchPattern
    ]);
    return rows;
  } catch (error) {
    throw error;
  }
};

// UPDATE - Update task details
const updateTask = async (task_id, updateData) => {
  const setClauses = [];
  const values = [];

  const { title, assigned_to, task_type, status, room_id, due_date } = updateData;

  if (title !== undefined) {
    setClauses.push('title = ?');
    values.push(title);
  }
  
  if (assigned_to !== undefined) {
    setClauses.push('assigned_to = ?');
    values.push(assigned_to || null);
  }

  if (task_type !== undefined) {
    setClauses.push('task_type = ?');
    values.push(task_type);
  }

  if (status !== undefined) {
    setClauses.push('status = ?');
    values.push(status);
  }

  if (room_id !== undefined) {
    setClauses.push('room_id = ?');
    values.push(room_id || null);
  }

  if (due_date !== undefined) {
    setClauses.push('due_date = ?');
    values.push(due_date || null);
  }

  if (setClauses.length === 0) {
    return { 
      success: false, 
      message: 'No fields provided for update' 
    };
  }

  values.push(task_id);

  const sql = `UPDATE tasks SET ${setClauses.join(', ')} WHERE task_id = ?`;

  try {
    const [result] = await pool.query(sql, values);
    
    return { 
      success: result.affectedRows > 0,
      message: result.affectedRows > 0 ? 'Task updated successfully' : 'Task not found',
      affectedRows: result.affectedRows 
    };
  } catch (error) {
    console.error('Update error:', error);
    return { 
      success: false,
      message: error.message || 'Database error during update'
    };
  }
};

// UPDATE - Update task status only
const updateTaskStatus = async (task_id, status) => {
  const sql = 'UPDATE tasks SET status = ? WHERE task_id = ?';
  
  try {
    const [result] = await pool.query(sql, [status, task_id]);
    
    return { 
      success: result.affectedRows > 0,
      message: result.affectedRows > 0 ? 'Task status updated' : 'Task not found',
      affectedRows: result.affectedRows 
    };
  } catch (error) {
    console.error('Update status error:', error);
    throw error;
  }
};

// DELETE - Remove task
const deleteTask = async (task_id) => {
  const sql = 'DELETE FROM tasks WHERE task_id = ?';
  
  try {
    const [result] = await pool.query(sql, [task_id]);
    
    return { 
      success: result.affectedRows > 0,
      message: result.affectedRows > 0 ? 'Task deleted successfully' : 'Task not found',
      affectedRows: result.affectedRows 
    };
  } catch (error) {
    throw error;
  }
};

// Export all functions
module.exports = {
  createTask,
  findAllTasks,
  findTaskById,
  searchTasks,
  updateTask,
  updateTaskStatus,
  deleteTask
};