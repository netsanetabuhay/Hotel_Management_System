// Import from Models
const {
  createReservation,
  findAllReservations,
  findReservationsByIdentifier, // Smart unified search
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

// CREATE RESERVATION
const createReservationHandler = async (req, res) => {
  try {
    const guest_id = req.body.guest_id;
    const room_id = req.body.room_id;
    const check_in = req.body.check_in;
    const check_out = req.body.check_out;
    const status = req.body.status;
    
    if (!guest_id || !room_id || !check_in || !check_out) {
      return sendError(res, 'guest_id, room_id, check_in, and check_out are required', 400);
    }
    
    const checkInDate = new Date(check_in);
    const checkOutDate = new Date(check_out);
    
    if (checkInDate >= checkOutDate) {
      return sendError(res, 'check_out must be after check_in', 400);
    }
    
    const guest = await findGuestById(guest_id);
    if (!guest) {
      return sendError(res, 'Guest not found', 404);
    }
    
    const room = await findRoomById(room_id);
    if (!room) {
      return sendError(res, 'Room not found', 404);
    }
    
    const availability = await checkRoomAvailability(room_id, check_in, check_out);
    if (!availability.available) {
      return sendError(res, `Room is not available for selected dates`, 409);
    }
    
    const reservation_id = generateId('RES');
    const reservationData = {
      reservation_id: reservation_id,
      guest_id: guest_id,
      room_id: room_id,
      check_in: check_in,
      check_out: check_out,
      status: status || 'confirmed',
      created_at: new Date()
    };
    
    await createReservation(reservationData);
    const newReservation = await findReservationsByIdentifier(reservation_id);
    
    return sendSuccess(res, 'Reservation created successfully', newReservation, 201);
  } catch (error) {
    console.error('Create reservation error:', error);
    return sendError(res, 'Failed to create reservation: ' + error.message, 500);
  }
};

// GET ALL RESERVATIONS
const getAllReservations = async (req, res) => {
  try {
    const filters = {
      guest_id: req.query.guest_id,
      room_id: req.query.room_id,
      status: req.query.status,
      check_in: req.query.check_in,
      check_out: req.query.check_out
    };
    
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

// SMART UNIFIED SEARCH - ONE function for all searches
const searchReservations = async (req, res) => {
  try {
    const identifier = req.params.identifier;
    
    if (!identifier) {
      return sendError(res, 'Search identifier is required', 400);
    }
    
    const result = await findReservationsByIdentifier(identifier);
    
    if (result.data.length === 0) {
      return sendError(res, 'No reservations found', 404);
    }
    
    let message = '';
    if (result.type === 'reservation') {
      message = 'Reservation found successfully';
    } else if (result.type === 'guest') {
      message = `Found ${result.data.length} reservation(s) for guest`;
    } else if (result.type === 'room') {
      message = `Found ${result.data.length} reservation(s) for room`;
    }
    
    return sendSuccess(res, message, {
      search_type: result.type,
      identifier: identifier,
      count: result.data.length,
      reservations: result.data
    });
  } catch (error) {
    console.error('Search reservations error:', error);
    return sendError(res, 'Failed to search reservations', 500);
  }
};

// UPDATE RESERVATION
const updateReservationHandler = async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = req.body;
    
    const result = await updateReservation(id, updateData);
    
    if (!result.success) {
      return sendError(res, result.message, 400);
    }
    
    const updatedReservation = await findReservationsByIdentifier(id);
    
    return sendSuccess(res, 'Reservation updated successfully', updatedReservation);
  } catch (error) {
    console.error('Update reservation error:', error);
    return sendError(res, 'Failed to update reservation', 500);
  }
};

// UPDATE RESERVATION STATUS
const updateReservationStatusHandler = async (req, res) => {
  try {
    const id = req.params.id;
    const status = req.body.status;
    
    if (!status) {
      return sendError(res, 'Status is required', 400);
    }
    
    const validStatuses = ['confirmed', 'pending', 'cancelled', 'checked_in', 'checked_out'];
    if (!validStatuses.includes(status)) {
      return sendError(res, `Invalid status. Valid statuses: ${validStatuses.join(', ')}`, 400);
    }
    
    const result = await updateReservationStatus(id, status);
    
    if (!result.success) {
      return sendError(res, 'Failed to update reservation status', 400);
    }
    
    const updatedReservation = await findReservationsByIdentifier(id);
    
    return sendSuccess(res, 'Reservation status updated successfully', {
      reservation_id: id,
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
    const id = req.params.id;
    
    const result = await deleteReservation(id);
    
    if (!result.success) {
      return sendError(res, 'Failed to cancel reservation', 400);
    }
    
    return sendSuccess(res, 'Reservation cancelled successfully', {
      reservation_id: id
    });
  } catch (error) {
    console.error('Delete reservation error:', error);
    return sendError(res, 'Failed to cancel reservation', 500);
  }
};

// CHECK ROOM AVAILABILITY (by room_id only)
const checkAvailabilityHandler = async (req, res) => {
  try {
    const room_id = req.query.room_id;
    
    if (!room_id) {
      return sendError(res, 'room_id is required', 400);
    }
    
    // Check if room exists
    const room = await findRoomById(room_id);
    if (!room) {
      return sendError(res, 'Room not found', 404);
    }
    
    // Check availability by room_id only
    const availability = await checkRoomAvailability(room_id);
    
    return sendSuccess(res, 'Availability check completed', {
      room: {
        room_id: room.room_id,
        room_number: room.room_number,
        room_type: room.room_type,
        price: room.price,
        status: room.status
      },
      available: availability.available,
      message: availability.message,
      room_status: availability.room_status
    });
  } catch (error) {
    console.error('Check availability error:', error);
    return sendError(res, 'Failed to check availability', 500);
  }
};

// FIND AVAILABLE ROOMS
const findAvailableRoomsHandler = async (req, res) => {
  try {
    const check_in = req.query.check_in;
    const check_out = req.query.check_out;
    const room_type = req.query.room_type;
    
    if (!check_in || !check_out) {
      return sendError(res, 'check_in and check_out are required', 400);
    }
    
    const checkInDate = new Date(check_in);
    const checkOutDate = new Date(check_out);
    
    if (checkInDate >= checkOutDate) {
      return sendError(res, 'check_out must be after check_in', 400);
    }
    
    const availableRooms = await findAvailableRooms(check_in, check_out, room_type);
    
    return sendSuccess(res, 'Available rooms retrieved successfully', {
      check_in: check_in,
      check_out: check_out,
      count: availableRooms.length,
      rooms: availableRooms
    });
  } catch (error) {
    console.error('Find available rooms error:', error);
    return sendError(res, 'Failed to find available rooms', 500);
  }
};

// Export all functions
module.exports = {
  createReservation: createReservationHandler,
  getAllReservations,
  searchReservations, // ONE unified search function
  updateReservation: updateReservationHandler,
  updateReservationStatus: updateReservationStatusHandler,
  deleteReservation: deleteReservationHandler,
  checkAvailability: checkAvailabilityHandler,
  findAvailableRooms: findAvailableRoomsHandler
};