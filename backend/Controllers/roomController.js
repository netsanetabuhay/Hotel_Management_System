const {
    createRoom,
    getAllRoomsForAdmin,
    getAvailableRoomsForUsers,
    getRoomById,
    checkRoomNumberExists,
    checkRoomNumberExistsExcluding,
    searchAvailableRooms,
    checkRoomAvailability,
    updateRoom,
    deleteRoom,
    checkRoomReservations,
    getRoomStats,
    getRevenueStats
} = require('../Models/room');

// 1. Create new room (Admin only)
const createRoomController = async (req, res) => {
    try {
        const { room_number, room_type, price } = req.body;

        if (!room_number || !room_type || !price) {
            return res.status(400).json({
                success: false,
                message: 'Room number, room type, and price are required'
            });
        }

        const existingRoom = await checkRoomNumberExists(room_number);
        if (existingRoom.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Room number already exists'
            });
        }

        if (price <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Price must be greater than 0'
            });
        }

        const roomId = 'RM' + Date.now();
        const roomData = {
            room_id: roomId,
            room_number,
            room_type,
            price: parseFloat(price)
        };

        await createRoom(roomData);
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

// 2. Get rooms (different for admin vs user)
const getAllRoomsController = async (req, res) => {
    try {
        const userRole = req.user.role;
        
        if (userRole === 'admin') {
            // Admin sees all rooms with booking status
            const rooms = await getAllRoomsForAdmin();
            return res.json({
                success: true,
                message: 'All rooms retrieved (Admin view)',
                data: rooms
            });
        } else {
            // User must provide dates to see available rooms
            return res.status(400).json({
                success: false,
                message: 'For user access, please use /api/rooms/available with check_in and check_out parameters'
            });
        }

    } catch (error) {
        console.error('Get all rooms error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error retrieving rooms',
            error: error.message
        });
    }
};

// 3. Get available rooms for users (requires dates)
const getAvailableRoomsController = async (req, res) => {
    try {
        const { check_in, check_out } = req.query;

        if (!check_in || !check_out) {
            return res.status(400).json({
                success: false,
                message: 'check_in and check_out dates are required'
            });
        }

        // Validate dates
        const checkInDate = new Date(check_in);
        const checkOutDate = new Date(check_out);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (checkInDate < today) {
            return res.status(400).json({
                success: false,
                message: 'check_in date cannot be in the past'
            });
        }

        if (checkOutDate <= checkInDate) {
            return res.status(400).json({
                success: false,
                message: 'check_out date must be after check_in date'
            });
        }

        const rooms = await getAvailableRoomsForUsers(check_in, check_out);

        res.json({
            success: true,
            message: 'Available rooms retrieved',
            data: rooms
        });

    } catch (error) {
        console.error('Get available rooms error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error retrieving available rooms',
            error: error.message
        });
    }
};

// 4. Search available rooms for users
const searchAvailableRoomsController = async (req, res) => {
    try {
        const { check_in, check_out, room_number, room_type, price_min, price_max } = req.query;

        if (!check_in || !check_out) {
            return res.status(400).json({
                success: false,
                message: 'check_in and check_out dates are required'
            });
        }

        // Validate dates
        const checkInDate = new Date(check_in);
        const checkOutDate = new Date(check_out);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (checkInDate < today) {
            return res.status(400).json({
                success: false,
                message: 'check_in date cannot be in the past'
            });
        }

        if (checkOutDate <= checkInDate) {
            return res.status(400).json({
                success: false,
                message: 'check_out date must be after check_in date'
            });
        }

        const filters = {};
        if (room_number) filters.room_number = room_number;
        if (room_type) filters.room_type = room_type;
        if (price_min) filters.price_min = parseFloat(price_min);
        if (price_max) filters.price_max = parseFloat(price_max);
        
        const rooms = await searchAvailableRooms(filters, check_in, check_out);

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

// 5. Update room (Admin only)
const updateRoomController = async (req, res) => {
    try {
        const { id } = req.params;
        const { room_number, room_type, price } = req.body;
        
        const rooms = await getRoomById(id);
        if (rooms.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Room not found'
            });
        }

        const updateData = {};
        
        if (room_number !== undefined) {
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

        await updateRoom(id, updateData);
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

// 6. Delete room (Admin only)
const deleteRoomController = async (req, res) => {
    try {
        const { id } = req.params;
        
        const rooms = await getRoomById(id);
        if (rooms.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Room not found'
            });
        }

        const activeReservations = await checkRoomReservations(id);
        if (activeReservations.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete room with active reservations'
            });
        }

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

// 7. Get room statistics (Admin only)
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

// 8. Check specific room availability
const checkRoomAvailabilityController = async (req, res) => {
    try {
        const { room_id, check_in, check_out } = req.query;

        if (!room_id || !check_in || !check_out) {
            return res.status(400).json({
                success: false,
                message: 'room_id, check_in, and check_out are required'
            });
        }

        const isAvailable = await checkRoomAvailability(room_id, check_in, check_out);

        res.json({
            success: true,
            message: `Room ${room_id} availability checked`,
            data: {
                room_id,
                check_in,
                check_out,
                available: isAvailable
            }
        });

    } catch (error) {
        console.error('Check room availability error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error checking room availability',
            error: error.message
        });
    }
};

module.exports = {
    createRoomController,
    getAllRoomsController,
    getAvailableRoomsController,
    searchAvailableRoomsController,
    updateRoomController,
    deleteRoomController,
    getRoomStatsController,
    checkRoomAvailabilityController
};