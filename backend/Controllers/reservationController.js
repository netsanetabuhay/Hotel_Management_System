const {
    createReservation,
    getReservations,
    getReservationByIdWithDetails,
    updateReservation,
    deleteReservation,
    checkRoomAvailabilityForDates,
    getReservationStats,
    getRoomPrice
} = require('../Models/reservation.js');

const { sendSuccess, sendError } = require('../Utils/response');
const { generateId } = require('../Utils/generateId');

// 1. Create new reservation
const createReservationController = async (req, res) => {
    try {
        const userId = req.user.id;
        const { room_id, check_in, check_out } = req.body;

        // Validation
        if (!room_id || !check_in || !check_out) {
            return sendError(res, 'Room ID, check-in date, and check-out date are required', 400);
        }

        // Validate dates
        const checkInDate = new Date(check_in);
        const checkOutDate = new Date(check_out);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (checkInDate < today) {
            return sendError(res, 'Check-in date cannot be in the past', 400);
        }

        if (checkOutDate <= checkInDate) {
            return sendError(res, 'Check-out date must be after check-in date', 400);
        }

        // Check room availability
        const isAvailable = await checkRoomAvailabilityForDates(room_id, check_in, check_out);
        if (!isAvailable) {
            return sendError(res, 'Room is not available for the selected dates', 400);
        }

        // Get room price
        const roomPrice = await getRoomPrice(room_id);
        if (roomPrice === 0) {
            return sendError(res, 'Room not found', 404);
        }

        // Generate reservation ID
        const reservationId = generateId('RES');

        // Create reservation
        const reservationData = {
            room_order_id: reservationId,
            user_id: userId,
            room_id,
            check_in,
            check_out,
            status: 'booked',           // Automatically set
            payment_status: 'paid'      // Automatically set
        };

        await createReservation(reservationData);

        // Get created reservation with details
        const reservation = await getReservationByIdWithDetails(reservationId);

        return sendSuccess(res, 'Room booked successfully', reservation, 201);

    } catch (error) {
        console.error('Create reservation error:', error);
        return sendError(res, 'Server error creating reservation', 500);
    }
};

// 2. Get reservations (smart: user sees own, admin sees all)
const getReservationsController = async (req, res) => {
    try {
        const userId = req.user.id;
        const isAdmin = req.user.role === 'admin';
        
        // Extract filters from query
        const filters = {};
        
        if (req.query.status) filters.status = req.query.status;
        if (req.query.payment_status) filters.payment_status = req.query.payment_status;
        if (req.query.room_id) filters.room_id = req.query.room_id;
        if (req.query.check_in_from) filters.check_in_from = req.query.check_in_from;
        if (req.query.check_in_to) filters.check_in_to = req.query.check_in_to;
        
        if (isAdmin && req.query.user_id) {
            filters.user_id = req.query.user_id;
        }

        // Get reservations
        const reservations = await getReservations(filters, userId, isAdmin);

        const message = isAdmin 
            ? 'All reservations retrieved' 
            : 'Your reservations retrieved';

        return sendSuccess(res, message, reservations);

    } catch (error) {
        console.error('Get reservations error:', error);
        return sendError(res, 'Server error retrieving reservations', 500);
    }
};

// 3. Update reservation (admin only - status and payment)
const updateReservationController = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Check if reservation exists
        const reservation = await getReservationByIdWithDetails(id);
        if (!reservation) {
            return sendError(res, 'Reservation not found', 404);
        }

        const { status, payment_status } = req.body;
        const updateData = {};
        
        // Only admin can update
        if (req.user.role !== 'admin') {
            return sendError(res, 'Only admin can update reservations', 403);
        }

        // Validate and prepare update data
        if (status !== undefined) {
            if (!['booked', 'active', 'completed', 'cancelled'].includes(status)) {
                return sendError(res, 'Invalid status. Must be: booked, active, completed, or cancelled', 400);
            }
            updateData.status = status;
        }
        
        if (payment_status !== undefined) {
            if (!['paid', 'unpaid'].includes(payment_status)) {
                return sendError(res, 'Invalid payment status. Must be: paid or unpaid', 400);
            }
            updateData.payment_status = payment_status;
        }

        if (Object.keys(updateData).length === 0) {
            return sendError(res, 'No valid fields to update', 400);
        }

        // Update reservation
        await updateReservation(id, updateData);

        // Get updated reservation
        const updatedReservation = await getReservationByIdWithDetails(id);

        return sendSuccess(res, 'Reservation updated successfully', updatedReservation);

    } catch (error) {
        console.error('Update reservation error:', error);
        return sendError(res, 'Server error updating reservation', 500);
    }
};

// 4. Delete reservation (admin only)
const deleteReservationController = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Check if reservation exists
        const reservation = await getReservationByIdWithDetails(id);
        if (!reservation) {
            return sendError(res, 'Reservation not found', 404);
        }

        // Only admin can delete
        if (req.user.role !== 'admin') {
            return sendError(res, 'Only admin can delete reservations', 403);
        }

        // Delete reservation
        await deleteReservation(id);

        return sendSuccess(res, 'Reservation deleted successfully');

    } catch (error) {
        console.error('Delete reservation error:', error);
        return sendError(res, 'Server error deleting reservation', 500);
    }
};

// 5. Get reservation statistics (admin only)
const getReservationStatsController = async (req, res) => {
    try {
        const stats = await getReservationStats();

        return sendSuccess(res, 'Reservation statistics retrieved', stats);

    } catch (error) {
        console.error('Get reservation stats error:', error);
        return sendError(res, 'Server error retrieving reservation statistics', 500);
    }
};

module.exports = {
    createReservationController,
    getReservationsController,
    updateReservationController,
    deleteReservationController,
    getReservationStatsController
};