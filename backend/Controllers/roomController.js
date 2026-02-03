const {
    createRoom,
    getAllRooms,
    getRoomById,
    checkRoomNumberExists,
    checkRoomNumberExistsExcluding,
    searchRooms,
    updateRoom,
    deleteRoom,
    checkRoomReservations,
    getRoomStats,
    getRevenueStats
} = require('../Models/room.js');

// Create new room (Admin only)
const createRoomController = async (req, res) => {
    try {
        const { room_number, room_type, price } = req.body;

        // Validation
        if (!room_number || !room_type || !price) {
            return res.status(400).json({
                success: false,
                message: 'Room number, room type, and price are required'
            });
        }

        // Check if room number already exists
        const existingRoom = await checkRoomNumberExists(room_number);
        if (existingRoom.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Room number already exists'
            });
        }

        // Validate price
        if (price <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Price must be greater than 0'
            });
        }

        // Generate room ID
        const roomId = 'RM' + Date.now();

        // Prepare room data
        const roomData = {
            room_id: roomId,
            room_number,
            room_type,
            price: parseFloat(price)
        };

        // Create room in database
        await createRoom(roomData);

        // Get created room
        const createdRoom = await getRoomById(roomId);
        const room = createdRoom[0];

        res.status(201).json({
            success: true,
            message: 'Room created successfully',
            data: room
        });

    } catch (error) {
        console.error('Create room error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error creating room',
            error: error.message
        });
    }
};

// Get all available rooms
const getAllRoomsController = async (req, res) => {
    try {
        const rooms = await getAllRooms();

        res.json({
            success: true,
            message: 'Rooms retrieved successfully',
            data: rooms
        });

    } catch (error) {
        console.error('Get all rooms error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error retrieving rooms',
            error: error.message
        });
    }
};

// Search rooms
const searchRoomsController = async (req, res) => {
    try {
        const { room_number, room_type, price_min, price_max } = req.query;
        
        const filters = {};
        
        if (room_number) filters.room_number = room_number;
        if (room_type) filters.room_type = room_type;
        if (price_min) filters.price_min = parseFloat(price_min);
        if (price_max) filters.price_max = parseFloat(price_max);
        
        const rooms = await searchRooms(filters);

        res.json({
            success: true,
            message: 'Search results retrieved',
            data: rooms
        });

    } catch (error) {
        console.error('Search rooms error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error searching rooms',
            error: error.message
        });
    }
};

// Update room (Admin only)
const updateRoomController = async (req, res) => {
    try {
        const { id } = req.params;
        const { room_number, room_type, price } = req.body;
        
        // Check if room exists
        const rooms = await getRoomById(id);
        if (rooms.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Room not found'
            });
        }

        const existingRoom = rooms[0];
        const updateData = {};
        
        // Prepare update data
        if (room_number !== undefined) {
            // Check if new room number already exists (excluding current room)
            const existingRoomNumber = await checkRoomNumberExistsExcluding(room_number, id);
            if (existingRoomNumber.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Room number already exists'
                });
            }
            updateData.room_number = room_number;
        }
        
        if (room_type !== undefined) {
            updateData.room_type = room_type;
        }
        
        if (price !== undefined) {
            if (price <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Price must be greater than 0'
                });
            }
            updateData.price = parseFloat(price);
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No fields to update'
            });
        }

        // Update room
        await updateRoom(id, updateData);

        // Get updated room
        const updatedRooms = await getRoomById(id);
        const updatedRoom = updatedRooms[0];

        res.json({
            success: true,
            message: 'Room updated successfully',
            data: updatedRoom
        });

    } catch (error) {
        console.error('Update room error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error updating room',
            error: error.message
        });
    }
};

// Delete room (Admin only)
const deleteRoomController = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Check if room exists
        const rooms = await getRoomById(id);
        if (rooms.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Room not found'
            });
        }

        // Check if room has active reservations
        const activeReservations = await checkRoomReservations(id);
        if (activeReservations.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete room with active reservations'
            });
        }

        // Delete room
        await deleteRoom(id);

        res.json({
            success: true,
            message: 'Room deleted successfully'
        });

    } catch (error) {
        console.error('Delete room error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error deleting room',
            error: error.message
        });
    }
};

// Get room statistics (Admin only)
const getRoomStatsController = async (req, res) => {
    try {
        const roomStats = await getRoomStats();
        const revenueStats = await getRevenueStats();

        res.json({
            success: true,
            message: 'Room statistics retrieved',
            data: {
                roomStats,
                revenueStats
            }
        });

    } catch (error) {
        console.error('Get room stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error retrieving room statistics',
            error: error.message
        });
    }
};

module.exports = {
    createRoomController,
    getAllRoomsController,
    searchRoomsController,
    updateRoomController,
    deleteRoomController,
    getRoomStatsController
};