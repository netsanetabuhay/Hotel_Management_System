const {
    createRoom,
    getAllRoomsForAdmin,
    getAvailableRoomsForUsers,
    searchAvailableRooms,
    getRoomById,
    checkRoomNumberExists,
    checkRoomNumberExistsExcluding,
    updateRoom,
    deleteRoom,
    checkRoomReservations,
    getRoomStats,
    getRevenueStats
} = require('../Models/room');

const { sendSuccess, sendError } = require('../Utils/response');
const { generateId } = require('../Utils/generateId');

// 1. Get rooms (smart: admin sees all, user sees available)
const getAllRoomsController = async (req, res) => {
    try {
        const isAdmin = req.user.role === 'admin';
        
        let rooms;
        let message;
        
        if (isAdmin) {
            rooms = await getAllRoomsForAdmin();
            message = 'All rooms retrieved (Admin view)';
        } else {
            rooms = await getAvailableRoomsForUsers();
            message = 'Available rooms retrieved';
        }
        
        return sendSuccess(res, message, rooms);

    } catch (error) {
        console.error('Get rooms error:', error);
        return sendError(res, 'Server error retrieving rooms', 500);
    }
};

// 2. Search available rooms by parameter
const searchRoomsController = async (req, res) => {
    try {
        const { param } = req.params;
        
        if (!param || param.trim() === '') {
            return sendError(res, 'Search parameter is required', 400);
        }
        
        const rooms = await searchAvailableRooms(param);
        
        return sendSuccess(res, `Search results for "${param}"`, rooms);

    } catch (error) {
        console.error('Search rooms error:', error);
        return sendError(res, 'Server error searching rooms', 500);
    }
};

// 3. Create new room (Admin only)
const createRoomController = async (req, res) => {
    try {
        const { room_number, room_type, price } = req.body;

        if (!room_number || !room_type || !price) {
            return sendError(res, 'Room number, room type, and price are required', 400);
        }

        const existingRoom = await checkRoomNumberExists(room_number);
        if (existingRoom.length > 0) {
            return sendError(res, 'Room number already exists', 400);
        }

        if (price <= 0) {
            return sendError(res, 'Price must be greater than 0', 400);
        }

        const roomId = generateId('RM');
        const roomData = {
            room_id: roomId,
            room_number,
            room_type,
            price: parseFloat(price)
        };

        await createRoom(roomData);
        const createdRoom = await getRoomById(roomId);
        const room = createdRoom[0];

        return sendSuccess(res, 'Room created successfully', room, 201);

    } catch (error) {
        console.error('Create room error:', error);
        return sendError(res, 'Server error creating room', 500);
    }
};

// 4. Update room (Admin only)
const updateRoomController = async (req, res) => {
    try {
        const { id } = req.params;
        const { room_number, room_type, price } = req.body;
        
        const rooms = await getRoomById(id);
        if (rooms.length === 0) {
            return sendError(res, 'Room not found', 404);
        }

        const updateData = {};
        
        if (room_number !== undefined) {
            const existingRoomNumber = await checkRoomNumberExistsExcluding(room_number, id);
            if (existingRoomNumber.length > 0) {
                return sendError(res, 'Room number already exists', 400);
            }
            updateData.room_number = room_number;
        }
        
        if (room_type !== undefined) {
            updateData.room_type = room_type;
        }
        
        if (price !== undefined) {
            if (price <= 0) {
                return sendError(res, 'Price must be greater than 0', 400);
            }
            updateData.price = parseFloat(price);
        }

        if (Object.keys(updateData).length === 0) {
            return sendError(res, 'No fields to update', 400);
        }

        await updateRoom(id, updateData);
        const updatedRooms = await getRoomById(id);
        const updatedRoom = updatedRooms[0];

        return sendSuccess(res, 'Room updated successfully', updatedRoom);

    } catch (error) {
        console.error('Update room error:', error);
        return sendError(res, 'Server error updating room', 500);
    }
};

// 5. Delete room (Admin only)
const deleteRoomController = async (req, res) => {
    try {
        const { id } = req.params;
        
        const rooms = await getRoomById(id);
        if (rooms.length === 0) {
            return sendError(res, 'Room not found', 404);
        }

        const activeReservations = await checkRoomReservations(id);
        if (activeReservations.length > 0) {
            return sendError(res, 'Cannot delete room with active reservations', 400);
        }

        await deleteRoom(id);

        return sendSuccess(res, 'Room deleted successfully');

    } catch (error) {
        console.error('Delete room error:', error);
        return sendError(res, 'Server error deleting room', 500);
    }
};

// 6. Get room statistics (Admin only)
const getRoomStatsController = async (req, res) => {
    try {
        const roomStats = await getRoomStats();
        const revenueStats = await getRevenueStats();

        const data = {
            roomStats,
            revenueStats
        };

        return sendSuccess(res, 'Room statistics retrieved', data);

    } catch (error) {
        console.error('Get room stats error:', error);
        return sendError(res, 'Server error retrieving room statistics', 500);
    }
};

module.exports = {
    getAllRoomsController,
    searchRoomsController,
    createRoomController,
    updateRoomController,
    deleteRoomController,
    getRoomStatsController
};