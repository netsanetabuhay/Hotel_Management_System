const Room = require('../Models/room');
const { generateId } = require('../Utils/generateId');
const { sendSuccess, sendError } = require('../Utils/response');

class RoomController {
  // Create a new room
  static async createRoom(req, res) {
    try {
      const { room_number, room_type, price, status } = req.body;
      
      // Validation
      if (!room_number || !room_type || !price) {
        return sendError(res, 'Room number, type and price are required', 400);
      }
      
      // Check if room number already exists
      const existingRoom = await Room.findByNumber(room_number);
      if (existingRoom) {
        return sendError(res, 'Room number already exists', 409);
      }
      
      // Generate room ID
      const room_id = generateId('RM');
      
      // Create room data object
      const roomData = {
        room_id,
        room_number,
        room_type,
        price: parseFloat(price),
        status: status || 'available'
      };
      
      // Save to database
      const result = await Room.create(roomData);
      
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
  }

  // Get all rooms (with optional filters)
  static async getAllRooms(req, res) {
    try {
      // Extract query parameters for filtering
      const filters = {
        room_type: req.query.room_type,
        status: req.query.status,
        min_price: req.query.min_price ? parseFloat(req.query.min_price) : undefined,
        max_price: req.query.max_price ? parseFloat(req.query.max_price) : undefined,
        search: req.query.search
      };
      
      // Remove undefined filters
      Object.keys(filters).forEach(key => {
        if (filters[key] === undefined) {
          delete filters[key];
        }
      });
      
      const rooms = await Room.findAll(filters);
      
      return sendSuccess(res, 'Rooms retrieved successfully', {
        count: rooms.length,
        rooms
      });
      
    } catch (error) {
      console.error('Get all rooms error:', error);
      return sendError(res, 'Failed to retrieve rooms', 500);
    }
  }

  // Get single room by ID
  static async getRoomById(req, res) {
    try {
      const { id } = req.params;
      
      const room = await Room.findById(id);
      
      if (!room) {
        return sendError(res, 'Room not found', 404);
      }
      
      return sendSuccess(res, 'Room retrieved successfully', room);
      
    } catch (error) {
      console.error('Get room by ID error:', error);
      return sendError(res, 'Failed to retrieve room', 500);
    }
  }

  // Get room by room number
  static async getRoomByNumber(req, res) {
    try {
      const { room_number } = req.params;
      
      const room = await Room.findByNumber(room_number);
      
      if (!room) {
        return sendError(res, 'Room not found', 404);
      }
      
      return sendSuccess(res, 'Room retrieved successfully', room);
      
    } catch (error) {
      console.error('Get room by number error:', error);
      return sendError(res, 'Failed to retrieve room', 500);
    }
  }

  // Update room details
  static async updateRoom(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      // Check if room exists
      const existingRoom = await Room.findById(id);
      if (!existingRoom) {
        return sendError(res, 'Room not found', 404);
      }
      
      // If updating room_number, check if it's already taken by another room
      if (updateData.room_number && updateData.room_number !== existingRoom.room_number) {
        const roomWithNumber = await Room.findByNumber(updateData.room_number);
        if (roomWithNumber && roomWithNumber.room_id !== id) {
          return sendError(res, 'Room number already exists', 409);
        }
      }
      
      // Convert price to number if provided
      if (updateData.price !== undefined) {
        updateData.price = parseFloat(updateData.price);
      }
      
      // Update room
      const result = await Room.update(id, updateData);
      
      if (!result.success) {
        return sendError(res, result.message || 'Failed to update room', 400);
      }
      
      // Get updated room data
      const updatedRoom = await Room.findById(id);
      
      return sendSuccess(res, 'Room updated successfully', updatedRoom);
      
    } catch (error) {
      console.error('Update room error:', error);
      return sendError(res, 'Failed to update room: ' + error.message, 500);
    }
  }

  // Delete room
  static async deleteRoom(req, res) {
    try {
      const { id } = req.params;
      
      // Check if room exists
      const existingRoom = await Room.findById(id);
      if (!existingRoom) {
        return sendError(res, 'Room not found', 404);
      }
      
      // Delete room
      const result = await Room.delete(id);
      
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
  }

  // Get available rooms
  static async getAvailableRooms(req, res) {
    try {
      const availableRooms = await Room.getAvailableRooms();
      
      return sendSuccess(res, 'Available rooms retrieved successfully', {
        count: availableRooms.length,
        rooms: availableRooms
      });
      
    } catch (error) {
      console.error('Get available rooms error:', error);
      return sendError(res, 'Failed to retrieve available rooms', 500);
    }
  }

  // Get room statistics
  static async getRoomStatistics(req, res) {
    try {
      const stats = await Room.getRoomStats();
      
      // Calculate totals
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
  }

  // Update room status only
  static async updateRoomStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!status) {
        return sendError(res, 'Status is required', 400);
      }
      
      // Check if room exists
      const existingRoom = await Room.findById(id);
      if (!existingRoom) {
        return sendError(res, 'Room not found', 404);
      }
      
      // Valid statuses
      const validStatuses = ['available', 'occupied', 'maintenance', 'cleaning', 'reserved'];
      if (!validStatuses.includes(status)) {
        return sendError(res, `Invalid status. Valid statuses: ${validStatuses.join(', ')}`, 400);
      }
      
      // Update status
      const result = await Room.updateStatus(id, status);
      
      if (!result.success) {
        return sendError(res, 'Failed to update room status', 400);
      }
      
      const updatedRoom = await Room.findById(id);
      
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
  }

  // Search rooms
  static async searchRooms(req, res) {
    try {
      const { q } = req.query;
      
      if (!q) {
        return sendError(res, 'Search query is required', 400);
      }
      
      const rooms = await Room.findAll({ search: q });
      
      return sendSuccess(res, 'Search results retrieved successfully', {
        count: rooms.length,
        query: q,
        rooms
      });
      
    } catch (error) {
      console.error('Search rooms error:', error);
      return sendError(res, 'Failed to search rooms', 500);
    }
  }
}

module.exports = RoomController;