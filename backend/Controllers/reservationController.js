// Import from Models
const {
  createReservation,
  findAllReservations,
  findReservationById,
  findReservationsByGuestId,
  findReservationsByRoomId,
  updateReservation,
  updateReservationStatus,
  deleteReservation,
  checkRoomAvailability,
  findAvailableRooms
} = require('../Models/reservation');

const { generateId } = require('../Utils/generateId');
const { findGuestById } = require('../Models/guest');
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

//  CREATE RESERVATION 
const createReservationHandler = async (req, res) => {
  try {
    const { guest_id, room_id, check_in, check_out, status } = req.body;
    
    // Validation
    if (!guest_id || !room_id || !check_in || !check_out) {
      return sendError(res, 'guest_id, room_id, check_in, and check_out are required', 400);
    }
    
    // Validate dates
    const checkInDate = new Date(check_in);
    const checkOutDate = new Date(check_out);
    const today = new Date();
    
    if (checkInDate >= checkOutDate) {
      return sendError(res, 'check_out must be after check_in', 400);
    }
    
    if (checkInDate < today.setHours(0, 0, 0, 0)) {
      return sendError(res, 'check_in cannot be in the past', 400);
    }
    
    // Check if guest exists
    const guest = await findGuestById(guest_id);
    if (!guest) {
      return sendError(res, 'Guest not found', 404);
    }
    
    // Check if room exists
    const room = await findRoomById(room_id);
    if (!room) {
      return sendError(res, 'Room not found', 404);
    }
    
    // Check room availability
    const availability = await checkRoomAvailability(room_id, check_in, check_out);
    if (!availability.available) {
      return sendError(res, `Room is not available for selected dates. Overlapping reservations: ${availability.overlapping_count}`, 409);
    }
    
    // Create reservation
    const reservation_id = generateId('RES');
    const reservationData = {
      reservation_id,
      guest_id,
      room_id,
      check_in,
      check_out,
      status: status || 'confirmed',
      created_at: new Date()
    };
    
    const result = await createReservation(reservationData);
    
    // Get full reservation details
    const newReservation = await findReservationById(reservation_id);
    
    return sendSuccess(res, 'Reservation created successfully', newReservation, 201);
    
  } catch (error) {
    console.error('Create reservation error:', error);
    return sendError(res, 'Failed to create reservation: ' + error.message, 500);
  }
};

//  GET ALL RESERVATIONS 
const getAllReservations = async (req, res) => {
  try {
    const filters = {
      guest_id: req.query.guest_id,
      room_id: req.query.room_id,
      status: req.query.status,
      check_in: req.query.check_in,
      check_out: req.query.check_out
    };
    
    // Remove undefined filters
    Object.keys(filters).forEach(key => {
      if (filters[key] === undefined) delete filters[key];
    });
    
    const reservations = await findAllReservations(filters);
    
    return sendSuccess(res, 'Reservations retrieved successfully', {
      count: reservations.length,
      reservations
    });
  } catch (error) {
    console.error('Get all reservations error:', error);
    return sendError(res, 'Failed to retrieve reservations', 500);
  }
};

//  GET RESERVATION BY ID 
const getReservationById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const reservation = await findReservationById(id);
    
    if (!reservation) {
      return sendError(res, 'Reservation not found', 404);
    }
    
    return sendSuccess(res, 'Reservation retrieved successfully', reservation);
  } catch (error) {
    console.error('Get reservation by ID error:', error);
    return sendError(res, 'Failed to retrieve reservation', 500);
  }
};

//  GET RESERVATIONS BY GUEST 
const getReservationsByGuest = async (req, res) => {
  try {
    const { guestId } = req.params;
    
    // Check if guest exists
    const guest = await findGuestById(guestId);
    if (!guest) {
      return sendError(res, 'Guest not found', 404);
    }
    
    const reservations = await findReservationsByGuestId(guestId);
    
    return sendSuccess(res, 'Guest reservations retrieved successfully', {
      guest: {
        guest_id: guest.guest_id,
        name: `${guest.first_name} ${guest.last_name}`
      },
      count: reservations.length,
      reservations
    });
  } catch (error) {
    console.error('Get reservations by guest error:', error);
    return sendError(res, 'Failed to retrieve guest reservations', 500);
  }
};

//  GET RESERVATIONS BY ROOM 
const getReservationsByRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    
    // Check if room exists
    const room = await findRoomById(roomId);
    if (!room) {
      return sendError(res, 'Room not found', 404);
    }
    
    const reservations = await findReservationsByRoomId(roomId);
    
    return sendSuccess(res, 'Room reservations retrieved successfully', {
      room: {
        room_id: room.room_id,
        room_number: room.room_number,
        room_type: room.room_type
      },
      count: reservations.length,
      reservations
    });
  } catch (error) {
    console.error('Get reservations by room error:', error);
    return sendError(res, 'Failed to retrieve room reservations', 500);
  }
};

//  UPDATE RESERVATION 
const updateReservationHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Check if reservation exists
    const existingReservation = await findReservationById(id);
    if (!existingReservation) {
      return sendError(res, 'Reservation not found', 404);
    }
    
    // If updating dates or room, check availability
    if ((updateData.check_in || updateData.check_out || updateData.room_id)) {
      const room_id = updateData.room_id || existingReservation.room_id;
      const check_in = updateData.check_in || existingReservation.check_in;
      const check_out = updateData.check_out || existingReservation.check_out;
      
      // Check availability (excluding current reservation)
      const availability = await checkRoomAvailability(room_id, check_in, check_out);
      
      // We need a more advanced check that excludes the current reservation
      // For now, we'll skip the check if it's the same room and overlapping dates
      if (room_id === existingReservation.room_id && 
          check_in === existingReservation.check_in && 
          check_out === existingReservation.check_out) {
        // Same room and dates, no need to check
      } else if (!availability.available) {
        return sendError(res, 'Room is not available for selected dates', 409);
      }
    }
    
    // Update reservation
    const result = await updateReservation(id, updateData);
    
    if (!result.success) {
      return sendError(res, result.message, 400);
    }
    
    const updatedReservation = await findReservationById(id);
    
    return sendSuccess(res, 'Reservation updated successfully', updatedReservation);
  } catch (error) {
    console.error('Update reservation error:', error);
    return sendError(res, 'Failed to update reservation', 500);
  }
};

//  UPDATE RESERVATION STATUS 
const updateReservationStatusHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return sendError(res, 'Status is required', 400);
    }
    
    // Valid statuses
    const validStatuses = ['confirmed', 'pending', 'cancelled', 'checked_in', 'checked_out'];
    if (!validStatuses.includes(status)) {
      return sendError(res, `Invalid status. Valid statuses: ${validStatuses.join(', ')}`, 400);
    }
    
    // Check if reservation exists
    const existingReservation = await findReservationById(id);
    if (!existingReservation) {
      return sendError(res, 'Reservation not found', 404);
    }
    
    // Update status
    const result = await updateReservationStatus(id, status);
    
    if (!result.success) {
      return sendError(res, 'Failed to update reservation status', 400);
    }
    
    const updatedReservation = await findReservationById(id);
    
    return sendSuccess(res, 'Reservation status updated successfully', {
      reservation_id: id,
      old_status: existingReservation.status,
      new_status: status,
      reservation: updatedReservation
    });
  } catch (error) {
    console.error('Update reservation status error:', error);
    return sendError(res, 'Failed to update reservation status', 500);
  }
};

// DELETE RESERVATION 
const deleteReservationHandler = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if reservation exists
    const existingReservation = await findReservationById(id);
    if (!existingReservation) {
      return sendError(res, 'Reservation not found', 404);
    }
    
    // Don't allow deletion of active reservations
    if (existingReservation.status === 'checked_in') {
      return sendError(res, 'Cannot delete a reservation that is currently checked in', 400);
    }
    
    const result = await deleteReservation(id);
    
    if (!result.success) {
      return sendError(res, 'Failed to cancel reservation', 400);
    }
    
    return sendSuccess(res, 'Reservation cancelled successfully', {
      reservation_id: id,
      guest_name: `${existingReservation.first_name} ${existingReservation.last_name}`,
      room_number: existingReservation.room_number,
      dates: `${existingReservation.check_in} to ${existingReservation.check_out}`
    });
  } catch (error) {
    console.error('Delete reservation error:', error);
    return sendError(res, 'Failed to cancel reservation', 500);
  }
};

// CHECK ROOM AVAILABILITY 
const checkAvailabilityHandler = async (req, res) => {
  try {
    const { room_id, check_in, check_out } = req.query;
    
    if (!room_id || !check_in || !check_out) {
      return sendError(res, 'room_id, check_in, and check_out are required as query parameters', 400);
    }
    
    // Validate dates
    const checkInDate = new Date(check_in);
    const checkOutDate = new Date(check_out);
    
    if (checkInDate >= checkOutDate) {
      return sendError(res, 'check_out must be after check_in', 400);
    }
    
    // Check if room exists
    const room = await findRoomById(room_id);
    if (!room) {
      return sendError(res, 'Room not found', 404);
    }
    
    const availability = await checkRoomAvailability(room_id, check_in, check_out);
    
    return sendSuccess(res, 'Availability check completed', {
      room: {
        room_id: room.room_id,
        room_number: room.room_number,
        room_type: room.room_type,
        price: room.price,
        status: room.status
      },
      check_in,
      check_out,
      available: availability.available,
      message: availability.available ? 'Room is available' : 'Room is not available for selected dates'
    });
  } catch (error) {
    console.error('Check availability error:', error);
    return sendError(res, 'Failed to check availability', 500);
  }
};

//  FIND AVAILABLE ROOMS 
const findAvailableRoomsHandler = async (req, res) => {
  try {
    const { check_in, check_out, room_type } = req.query;
    
    if (!check_in || !check_out) {
      return sendError(res, 'check_in and check_out are required as query parameters', 400);
    }
    
    // Validate dates
    const checkInDate = new Date(check_in);
    const checkOutDate = new Date(check_out);
    
    if (checkInDate >= checkOutDate) {
      return sendError(res, 'check_out must be after check_in', 400);
    }
    
    const availableRooms = await findAvailableRooms(check_in, check_out, room_type);
    
    return sendSuccess(res, 'Available rooms retrieved successfully', {
      check_in,
      check_out,
      room_type_filter: room_type || 'none',
      count: availableRooms.length,
      rooms: availableRooms
    });
  } catch (error) {
    console.error('Find available rooms error:', error);
    return sendError(res, 'Failed to find available rooms', 500);
  }
};

//  EXPORTS 
module.exports = {
  createReservation: createReservationHandler,
  getAllReservations,
  getReservationById,
  getReservationsByGuest,
  getReservationsByRoom,
  updateReservation: updateReservationHandler,
  updateReservationStatus: updateReservationStatusHandler,
  deleteReservation: deleteReservationHandler,
  checkAvailability: checkAvailabilityHandler,
  findAvailableRooms: findAvailableRoomsHandler
};