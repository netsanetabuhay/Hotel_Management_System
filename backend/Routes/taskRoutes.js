const express = require('express');
const router = express.Router();

// Import controller functions
const {
  createTask,
  getAllTasks,
  updateTask,
  deleteTask,
  updateTaskStatus,
  searchTasks
} = require('../Controllers/taskController');

// Import auth middleware
const { authenticate, authorize } = require('../Middleware/auth');

//  PROTECTED ROUTES 
router.use(authenticate);

// Get all tasks
router.get('/', authorize(['admin', 'manager', 'housekeeping']), getAllTasks);

// UNIFIED SEARCH - ONE route for ALL searches
router.get('/search/:identifier', authorize(['admin', 'manager', 'housekeeping']), searchTasks);

// Create task
router.post('/', authorize(['admin', 'manager', 'housekeeping']), createTask);

// Update task
router.put('/:id', authorize(['admin', 'manager', 'housekeeping']), updateTask);

// Update task status
router.patch('/:id/status', authorize(['admin', 'manager', 'housekeeping']), updateTaskStatus);

// Delete task
router.delete('/:id', authorize(['admin', 'manager']), deleteTask);

module.exports = router;