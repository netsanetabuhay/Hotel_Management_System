const {
    createReservation,
    getReservations,
    getReservationById,
    updateReservation,
    deleteReservation,
    checkReservationOwnership,
    getReservationStats,
    checkRoomAvailabilityForDates
} = require('../Models/reservation.js');

const { checkRoomAvailability } = require('../Models/room.js');

// 1. Create new reservation
const createReservationController = async (req, res) => {
    try {
        const userId = req.user.id;
        const { room_id, check_in, check_out } = req.body;

        // Validation
        if (!room_id || !check_in || !check_out) {
            return res.status(400).json({
                success: false,
                message: 'Room ID, check-in date, and check-out date are required'
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
                message: 'Check-in date cannot be in the past'
            });
        }

        if (checkOutDate <= checkInDate) {
            return res.status(400).json({
                success: false,
                message: 'Check-out date must be after check-in date'
            });
        }

        // Check room availability
        const isAvailable = await checkRoomAvailability(room_id, check_in, check_out);
        if (!isAvailable) {
            return res.status(400).json({
                success: false,
                message: 'Room is not available for the selected dates'
            });
        }

        // Generate reservation ID
        const reservationId = 'RES' + Date.now();

        // Create reservation
        const reservationData = {
            room_order_id: reservationId,
            user_id: userId,
            room_id,
            check_in,
            check_out,
            status: 'booked',
            payment_status: 'paid' // Default to paid since no payment integration
        };

        await createReservation(reservationData);

        // Get created reservation with details
        const createdReservations = await getReservationById(reservationId);
        const reservation = createdReservations[0];

        res.status(201).json({
            success: true,
            message: 'Room booked successfully',
            data: reservation
        });

    } catch (error) {
        console.error('Create reservation error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error creating reservation',
            error: error.message
        });
    }
};

// 2. Get reservations (smart: admin gets all, user gets own)
const getReservationsController = async (req, res) => {
    try {
        const userId = req.user.id;
        const isAdmin = req.user.role === 'admin';
        
        // Extract filters from query
        const filters = {};
        
        // Common filters (for both admin and user)
        if (req.query.status) filters.status = req.query.status;
        if (req.query.payment_status) filters.payment_status = req.query.payment_status;
        if (req.query.check_in_from) filters.check_in_from = req.query.check_in_from;
        if (req.query.check_in_to) filters.check_in_to = req.query.check_in_to;
        if (req.query.check_out_from) filters.check_out_from = req.query.check_out_from;
        if (req.query.check_out_to) filters.check_out_to = req.query.check_out_to;
        
        // Admin-only filters
        if (isAdmin) {
            if (req.query.room_id) filters.room_id = req.query.room_id;
            if (req.query.user_id) filters.user_id = req.query.user_id;
        }

        // Get reservations
        const reservations = await getReservations(filters, userId, isAdmin);

        const message = isAdmin 
            ? 'All reservations retrieved' 
            : 'Your reservations retrieved';

        res.json({
            success: true,
            message,
            data: reservations
        });

    } catch (error) {
        console.error('Get reservations error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error retrieving reservations',
            error: error.message
        });
    }
};

// 3. Update reservation
const updateReservationController = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const isAdmin = req.user.role === 'admin';
        
        // Check if reservation exists
        const reservations = await getReservationById(id);
        if (reservations.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Reservation not found'
            });
        }

        const reservation = reservations[0];
        
        // Authorization check
        if (!isAdmin) {
            // Regular users can only update their own reservations
            const ownsReservation = await checkReservationOwnership(id, userId);
            if (!ownsReservation) {
                return res.status(403).json({
                    success: false,
                    message: 'You can only update your own reservations'
                });
            }
        }

        const { check_in, check_out, status, payment_status } = req.body;
        const updateData = {};
        
        // Date updates (allowed for both admin and users)
        if (check_in !== undefined || check_out !== undefined) {
            const newCheckIn = check_in || reservation.check_in;
            const newCheckOut = check_out || reservation.check_out;
            
            // Validate new dates
            const checkInDate = new Date(newCheckIn);
            const checkOutDate = new Date(newCheckOut);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (checkInDate < today) {
                return res.status(400).json({
                    success: false,
                    message: 'Check-in date cannot be in the past'
                });
            }

            if (checkOutDate <= checkInDate) {
                return res.status(400).json({
                    success: false,
                    message: 'Check-out date must be after check-in date'
                });
            }

            // Check room availability for new dates (if dates changed)
            if (check_in || check_out) {
                const isAvailable = await checkRoomAvailabilityForDates(
                    reservation.room_id, 
                    newCheckIn, 
                    newCheckOut
                );
                
                // Exclude current reservation from availability check
                const query = `
                    SELECT room_order_id 
                    FROM room_orders 
                    WHERE room_id = ? 
                    AND status IN ('booked', 'active')
                    AND room_order_id != ?
                    AND (
                        (check_in <= ? AND check_out >= ?) OR
                        (check_in <= ? AND check_out >= ?) OR
                        (check_in >= ? AND check_out <= ?)
                    )
                    LIMIT 1
                `;
                
                const { pool } = require('../Config/database');
                const [conflicts] = await pool.execute(query, [
                    reservation.room_id,
                    id,
                    newCheckOut, newCheckIn,
                    newCheckIn, newCheckOut,
                    newCheckIn, newCheckOut
                ]);
                
                if (conflicts.length > 0) {
                    return res.status(400).json({
                        success: false,
                        message: 'Room is not available for the new dates'
                    });
                }
            }
            
            if (check_in !== undefined) updateData.check_in = check_in;
            if (check_out !== undefined) updateData.check_out = check_out;
        }
        
        // Status and payment updates (admin only)
        if (isAdmin) {
            if (status !== undefined) {
                if (!['booked', 'active', 'completed'].includes(status)) {
                    return res.status(400).json({
                        success: false,
                        message: 'Invalid status. Must be: booked, active, or completed'
                    });
                }
                updateData.status = status;
            }
            
            if (payment_status !== undefined) {
                if (!['paid', 'unpaid'].includes(payment_status)) {
                    return res.status(400).json({
                        success: false,
                        message: 'Invalid payment status. Must be: paid or unpaid'
                    });
                }
                updateData.payment_status = payment_status;
            }
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No valid fields to update'
            });
        }

        // Update reservation
        await updateReservation(id, updateData);

        // Get updated reservation
        const updatedReservations = await getReservationById(id);
        const updatedReservation = updatedReservations[0];

        res.json({
            success: true,
            message: 'Reservation updated successfully',
            data: updatedReservation
        });

    } catch (error) {
        console.error('Update reservation error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error updating reservation',
            error: error.message
        });
    }
};

// 4. Delete reservation
const deleteReservationController = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const isAdmin = req.user.role === 'admin';
        
        // Check if reservation exists
        const reservations = await getReservationById(id);
        if (reservations.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Reservation not found'
            });
        }

        // Authorization check
        if (!isAdmin) {
            // Regular users can only delete their own reservations
            const ownsReservation = await checkReservationOwnership(id, userId);
            if (!ownsReservation) {
                return res.status(403).json({
                    success: false,
                    message: 'You can only delete your own reservations'
                });
            }
        }

        // Delete reservation
        await deleteReservation(id);

        res.json({
            success: true,
            message: 'Reservation deleted successfully'
        });

    } catch (error) {
        console.error('Delete reservation error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error deleting reservation',
            error: error.message
        });
    }
};

// 5. Get reservation statistics (admin only)
const getReservationStatsController = async (req, res) => {
    try {
        const stats = await getReservationStats();

        res.json({
            success: true,
            message: 'Reservation statistics retrieved',
            data: stats
        });

    } catch (error) {
        console.error('Get reservation stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error retrieving reservation statistics',
            error: error.message
        });
    }
};

module.exports = {
    createReservationController,
    getReservationsController,
    updateReservationController,
    deleteReservationController,
    getReservationStatsController
};