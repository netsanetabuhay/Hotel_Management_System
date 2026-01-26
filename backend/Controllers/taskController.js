// Import from Models
const {
  createTask,
  findAllTasks,
  findTaskById,
  searchTasks,
  updateTask,
  updateTaskStatus,
  deleteTask,
  getTaskStats
} = require('../Models/task');

const { generateId } = require('../Utils/generateId');
const { findUserById } = require('../Models/user');
const { findRoomById } = require('../Models/room');

// Helper response functions
const sendSuccess = (res, message, data = null, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

const sendError = (res, message, statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    message
  });
};

//  CREATE TASK 
const createTaskHandler = async (req, res) => {
  try {
    const { title, assigned_to, task_type, room_id, due_date, description } = req.body;
    
    if (!title || !task_type) {
      return sendError(res, 'Title and task type are required', 400);
    }
    
    // Verify assigned user exists if provided
    if (assigned_to) {
      const user = await findUserById(assigned_to);
      if (!user) {
        return sendError(res, 'Assigned user not found', 404);
      }
    }
    
    // Verify room exists if provided
    if (room_id) {
      const room = await findRoomById(room_id);
      if (!room) {
        return sendError(res, 'Room not found', 404);
      }
    }
    
    const task_id = generateId('TSK');
    const taskData = {
      task_id,
      title,
      assigned_to: assigned_to || null,
      task_type,
      status: 'pending',
      room_id: room_id || null,
      due_date: due_date || null,
      description: description || null,
      created_at: new Date()
    };
    
    await createTask(taskData);
    
    const newTask = await findTaskById(task_id);
    
    return sendSuccess(res, 'Task created successfully', newTask, 201);
  } catch (error) {
    console.error('Create task error:', error);
    return sendError(res, 'Failed to create task: ' + error.message, 500);
  }
};

//  GET ALL TASKS 
const getAllTasks = async (req, res) => {
  try {
    const filters = {
      assigned_to: req.query.assigned_to,
      room_id: req.query.room_id,
      status: req.query.status,
      task_type: req.query.task_type
    };
    
    Object.keys(filters).forEach(key => {
      if (filters[key] === undefined || filters[key] === '') delete filters[key];
    });
    
    const tasks = await findAllTasks(filters);
    
    return sendSuccess(res, 'Tasks retrieved successfully', {
      count: tasks.length,
      tasks
    });
  } catch (error) {
    console.error('Get all tasks error:', error);
    return sendError(res, 'Failed to retrieve tasks', 500);
  }
};

//  UNIFIED SEARCH 
const searchTasksHandler = async (req, res) => {
  try {
    const { identifier } = req.params;
    
    console.log('🔍 TASK SEARCH DEBUG:');
    console.log('Identifier:', identifier);
    
    if (!identifier || identifier === 'undefined') {
      // If no identifier, return all tasks
      const allTasks = await findAllTasks({});
      return sendSuccess(res, 'All tasks retrieved', {
        count: allTasks.length,
        tasks: allTasks
      });
    }
    
    // 1. Check if it's a task_id (starts with TSK)
    if (identifier.toUpperCase().startsWith('TSK')) {
      console.log(' Trying task ID search...');
      const task = await findTaskById(identifier);
      console.log('Task ID search result:', task ? 'FOUND' : 'NOT FOUND');
      
      if (task) {
        return sendSuccess(res, 'Task found by ID', task);
      }
    }
    
    // 2. Try search function for everything else
    console.log(' Trying general search...');
    const searchResults = await searchTasks(identifier);
    console.log('Search result count:', searchResults.length);
    
    if (searchResults.length > 0) {
      return sendSuccess(res, 'Tasks found by search', {
        search_term: identifier,
        count: searchResults.length,
        tasks: searchResults
      });
    }
    
    console.log(' No results found for:', identifier);
    return sendError(res, 'No tasks found matching your search', 404);
    
  } catch (error) {
    console.error(' Search tasks error:', error);
    return sendError(res, 'Server error during search', 500);
  }
};

//  UPDATE TASK 
const updateTaskHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const existingTask = await findTaskById(id);
    if (!existingTask) {
      return sendError(res, 'Task not found', 404);
    }
    
    // Verify assigned user exists if changing
    if (updateData.assigned_to !== undefined && updateData.assigned_to) {
      const user = await findUserById(updateData.assigned_to);
      if (!user) {
        return sendError(res, 'Assigned user not found', 404);
      }
    }
    
    // Verify room exists if changing
    if (updateData.room_id !== undefined && updateData.room_id) {
      const room = await findRoomById(updateData.room_id);
      if (!room) {
        return sendError(res, 'Room not found', 404);
      }
    }
    
    const result = await updateTask(id, updateData);
    
    if (!result.success) {
      return sendError(res, result.message, 400);
    }
    
    const updatedTask = await findTaskById(id);
    return sendSuccess(res, 'Task updated successfully', updatedTask);
  } catch (error) {
    console.error('Update task error:', error);
    return sendError(res, 'Server error updating task', 500);
  }
};

//  UPDATE TASK STATUS 
const updateTaskStatusHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return sendError(res, 'Status is required', 400);
    }
    
    const validStatuses = ['pending', 'in_progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return sendError(res, `Invalid status. Valid statuses: ${validStatuses.join(', ')}`, 400);
    }
    
    const existingTask = await findTaskById(id);
    if (!existingTask) {
      return sendError(res, 'Task not found', 404);
    }
    
    const result = await updateTaskStatus(id, status);
    
    if (!result.success) {
      return sendError(res, 'Failed to update task status', 400);
    }
    
    const updatedTask = await findTaskById(id);
    return sendSuccess(res, 'Task status updated successfully', {
      task_id: id,
      new_status: status,
      task: updatedTask
    });
  } catch (error) {
    console.error('Update task status error:', error);
    return sendError(res, 'Failed to update task status', 500);
  }
};

//  DELETE TASK 
const deleteTaskHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const existingTask = await findTaskById(id);
    
    if (!existingTask) {
      return sendError(res, 'Task not found', 404);
    }
    
    const result = await deleteTask(id);
    
    if (!result.success) {
      return sendError(res, 'Failed to delete task', 400);
    }
    
    return sendSuccess(res, 'Task deleted successfully', {
      task_id: id,
      title: existingTask.title,
      assigned_to: existingTask.assigned_to_name
    });
  } catch (error) {
    console.error('Delete task error:', error);
    return sendError(res, 'Failed to delete task', 500);
  }
};

//  EXPORTS 
module.exports = {
  createTask: createTaskHandler,
  getAllTasks,
  updateTask: updateTaskHandler,
  deleteTask: deleteTaskHandler,
  updateTaskStatus: updateTaskStatusHandler,
  searchTasks: searchTasksHandler
};