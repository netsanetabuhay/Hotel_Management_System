// Literal imports from Models
const {
  createRoom: createRoomModel,
  findAllRooms,
  findRoomById,
  findRoomByNumber,
  updateRoom: updateRoomModel,
  deleteRoom: deleteRoomModel,
  findAvailableRooms,
  findRoomsByStatus,
  getRoomStats,
  updateRoomStatus: updateRoomStatusModel,
  checkRoomNumberExists
} = require('../Models/room');

const { generateId } = require('../Utils/generateId');
const { sendSuccess, sendError } = require('../Utils/response');

// Create a new room
const createRoom = async (req, res) => {
  try {
    const { room_number, room_type, price, status } = req.body;
    
    if (!room_number || !room_type || !price) {
      return sendError(res, 'Room number, type and price are required', 400);
    }
    
    const existingRoom = await findRoomByNumber(room_number);
    if (existingRoom) {
      return sendError(res, 'Room number already exists', 409);
    }
    
    const room_id = generateId('RM');
    
    const roomData = {
      room_id,
      room_number,
      room_type,
      price: parseFloat(price),
      status: status || 'available'
    };
    
    const result = await createRoomModel(roomData);
    
    return sendSuccess(res, 'Room created successfully', {
      room_id,
      room_number,
      room_type,
      price: roomData.price,
      status: roomData.status
    }, 201);
    
  } catch (error) {
    console.error('Create room error:', error);
    return sendError(res, 'Failed to create room: ' + error.message, 500);
  }
};

// Get all rooms (with optional filters)
const getAllRooms = async (req, res) => {
  try {
    const filters = {
      room_type: req.query.room_type,
      status: req.query.status,
      min_price: req.query.min_price ? parseFloat(req.query.min_price) : undefined,
      max_price: req.query.max_price ? parseFloat(req.query.max_price) : undefined,
      search: req.query.search
    };
    
    Object.keys(filters).forEach(key => {
      if (filters[key] === undefined) {
        delete filters[key];
      }
    });
    
    const rooms = await findAllRooms(filters);
    
    return sendSuccess(res, 'Rooms retrieved successfully', {
      count: rooms.length,
      rooms
    });
    
  } catch (error) {
    console.error('Get all rooms error:', error);
    return sendError(res, 'Failed to retrieve rooms', 500);
  }
};

// Get single room by ID
const getRoomById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const room = await findRoomById(id);
    
    if (!room) {
      return sendError(res, 'Room not found', 404);
    }
    
    return sendSuccess(res, 'Room retrieved successfully', room);
    
  } catch (error) {
    console.error('Get room by ID error:', error);
    return sendError(res, 'Failed to retrieve room', 500);
  }
};

// Get room by room number
const getRoomByNumber = async (req, res) => {
  try {
    const { room_number } = req.params;
    
    const room = await findRoomByNumber(room_number);
    
    if (!room) {
      return sendError(res, 'Room not found', 404);
    }
    
    return sendSuccess(res, 'Room retrieved successfully', room);
    
  } catch (error) {
    console.error('Get room by number error:', error);
    return sendError(res, 'Failed to retrieve room', 500);
  }
};

// Update room details
const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const existingRoom = await findRoomById(id);
    if (!existingRoom) {
      return sendError(res, 'Room not found', 404);
    }
    
    if (updateData.room_number && updateData.room_number !== existingRoom.room_number) {
      const roomWithNumber = await findRoomByNumber(updateData.room_number);
      if (roomWithNumber && roomWithNumber.room_id !== id) {
        return sendError(res, 'Room number already exists', 409);
      }
    }
    
    if (updateData.price !== undefined) {
      updateData.price = parseFloat(updateData.price);
    }
    
    const result = await updateRoomModel(id, updateData);
    
    if (!result.success) {
      return sendError(res, result.message || 'Failed to update room', 400);
    }
    
    const updatedRoom = await findRoomById(id);
    
    return sendSuccess(res, 'Room updated successfully', updatedRoom);
    
  } catch (error) {
    console.error('Update room error:', error);
    return sendError(res, 'Failed to update room: ' + error.message, 500);
  }
};

// Delete room
const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;
    
    const existingRoom = await findRoomById(id);
    if (!existingRoom) {
      return sendError(res, 'Room not found', 404);
    }
    
    const result = await deleteRoomModel(id);
    
    if (!result.success) {
      return sendError(res, 'Failed to delete room', 400);
    }
    
    return sendSuccess(res, 'Room deleted successfully', {
      room_id: id,
      room_number: existingRoom.room_number
    });
    
  } catch (error) {
    console.error('Delete room error:', error);
    return sendError(res, 'Failed to delete room', 500);
  }
};

// Get available rooms
const getAvailableRooms = async (req, res) => {
  try {
    const availableRooms = await findAvailableRooms();
    console.log(availableRooms);

    
    if (availableRooms.length === 0) {
      return sendSuccess(res, 'No available rooms found', {
        count: 0,
        rooms: []
      });
    }
    
    return sendSuccess(res, 'Available rooms retrieved successfully', {
      count: availableRooms.length,
      rooms: availableRooms
    });
    
  } catch (error) {
    console.error('Get available rooms error:', error);
    return sendError(res, 'Failed to retrieve available rooms: ' + error.message, 500);
  }
};

// Get room statistics
const getRoomStatistics = async (req, res) => {
  try {
    const stats = await getRoomStats();
    
    const totals = stats.reduce((acc, stat) => {
      acc.total_rooms += parseInt(stat.total_rooms);
      acc.available_rooms += parseInt(stat.available_rooms);
      return acc;
    }, { total_rooms: 0, available_rooms: 0 });
    
    return sendSuccess(res, 'Room statistics retrieved successfully', {
      totals,
      by_type: stats
    });
    
  } catch (error) {
    console.error('Get room statistics error:', error);
    return sendError(res, 'Failed to retrieve room statistics', 500);
  }
};

// Update room status only
const updateRoomStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return sendError(res, 'Status is required', 400);
    }
    
    const existingRoom = await findRoomById(id);
    if (!existingRoom) {
      return sendError(res, 'Room not found', 404);
    }
    
    const validStatuses = ['available', 'occupied', 'maintenance', 'cleaning', 'reserved'];
    if (!validStatuses.includes(status)) {
      return sendError(res, `Invalid status. Valid statuses: ${validStatuses.join(', ')}`, 400);
    }
    
    const result = await updateRoomStatusModel(id, status);
    
    if (!result.success) {
      return sendError(res, 'Failed to update room status', 400);
    }
    
    const updatedRoom = await findRoomById(id);
    
    return sendSuccess(res, 'Room status updated successfully', {
      room_id: id,
      room_number: updatedRoom.room_number,
      old_status: existingRoom.status,
      new_status: status
    });
    
  } catch (error) {
    console.error('Update room status error:', error);
    return sendError(res, 'Failed to update room status', 500);
  }
};

// Search rooms
const searchRooms = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return sendError(res, 'Search query is required', 400);
    }
    
    const rooms = await findAllRooms({ search: q });
    
    return sendSuccess(res, 'Search results retrieved successfully', {
      count: rooms.length,
      query: q,
      rooms
    });
    
  } catch (error) {
    console.error('Search rooms error:', error);
    return sendError(res, 'Failed to search rooms', 500);
  }
};

// Literal exports
module.exports = {
  createRoom,
  getAllRooms,
  getRoomById,
  getRoomByNumber,
  updateRoom,
  deleteRoom,
  getAvailableRooms,
  getRoomStatistics,
  updateRoomStatus,
  searchRooms
};