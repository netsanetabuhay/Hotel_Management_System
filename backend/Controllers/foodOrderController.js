const {
    createFoodOrder,
    getFoodOrders,
    getFoodOrderByIdWithItems,
    checkFoodOrderOwnership,
    updateFoodOrder,
    deleteFoodOrder,
    getFoodOrderStats,
    getFoodPrice
} = require('../Models/foodOrder.js');

const { sendSuccess, sendError } = require('../Utils/response');
const { generateId } = require('../Utils/generateId');

// 1. Create food order
const createFoodOrderController = async (req, res) => {
    try {
        const userId = req.user.id;
        const { order_place, items } = req.body;

        // Validation
        if (!order_place || !items || !Array.isArray(items) || items.length === 0) {
            return sendError(res, 'Order place and at least one food item are required', 400);
        }

        // Validate items
        const validatedItems = [];
        for (const item of items) {
            if (!item.food_id || !item.quantity || item.quantity <= 0) {
                return sendError(res, 'Each item must have valid food_id and quantity > 0', 400);
            }
            
            // Get current price
            const price = await getFoodPrice(item.food_id);
            if (price === 0) {
                return sendError(res, `Food item ${item.food_id} not found or has invalid price`, 400);
            }
            
            validatedItems.push({
                food_id: item.food_id,
                quantity: item.quantity,
                price: price
            });
        }

        // Generate order ID
        const orderId = generateId('FOOD');

        // Prepare order data
        const orderData = {
            food_order_id: orderId,
            user_id: userId,
            order_status: 'pending',
            payment_status: 'paid', // Default since no payment integration
            order_place: order_place
        };

        // Create order with items
        await createFoodOrder(orderData, validatedItems);

        // Get created order with items
        const orderWithItems = await getFoodOrderByIdWithItems(orderId);

        return sendSuccess(res, 'Food order created successfully', orderWithItems, 201);

    } catch (error) {
        console.error('Create food order error:', error);
        return sendError(res, 'Server error creating food order', 500);
    }
};

// 2. Get food orders (smart: user sees own, admin sees all)
const getFoodOrdersController = async (req, res) => {
    try {
        const userId = req.user.id;
        const isAdmin = req.user.role === 'admin';
        
        // Extract filters
        const filters = {};
        
        if (req.query.order_status) filters.order_status = req.query.order_status;
        if (req.query.payment_status) filters.payment_status = req.query.payment_status;
        if (req.query.order_id) filters.order_id = req.query.order_id;
        if (req.query.created_from) filters.created_from = req.query.created_from;
        if (req.query.created_to) filters.created_to = req.query.created_to;
        
        if (isAdmin && req.query.user_id) {
            filters.user_id = req.query.user_id;
        }

        // Get orders
        const orders = await getFoodOrders(filters, userId, isAdmin);

        // If specific order requested, get with items
        if (filters.order_id && orders.length === 1) {
            const orderWithItems = await getFoodOrderByIdWithItems(filters.order_id);
            return sendSuccess(res, 'Order retrieved with items', orderWithItems);
        }

        const message = isAdmin 
            ? 'All food orders retrieved' 
            : 'Your food orders retrieved';

        return sendSuccess(res, message, orders);

    } catch (error) {
        console.error('Get food orders error:', error);
        return sendError(res, 'Server error retrieving food orders', 500);
    }
};

// 3. Update food order (admin only - status and payment)
const updateFoodOrderController = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Check if order exists
        const orderWithItems = await getFoodOrderByIdWithItems(id);
        if (!orderWithItems.order) {
            return sendError(res, 'Food order not found', 404);
        }

        // Only admin can update
        if (req.user.role !== 'admin') {
            return sendError(res, 'Only admin can update food orders', 403);
        }

        const { order_status, payment_status } = req.body;
        const updateData = {};
        
        // Validate and prepare update data
        if (order_status !== undefined) {
            if (!['pending', 'preparing', 'delivered'].includes(order_status)) {
                return sendError(res, 'Invalid order status. Must be: pending, preparing, or delivered', 400);
            }
            updateData.order_status = order_status;
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

        // Update order
        await updateFoodOrder(id, updateData);

        // Get updated order
        const updatedOrder = await getFoodOrderByIdWithItems(id);

        return sendSuccess(res, 'Food order updated successfully', updatedOrder);

    } catch (error) {
        console.error('Update food order error:', error);
        return sendError(res, 'Server error updating food order', 500);
    }
};

// 4. Delete food order (admin only)
const deleteFoodOrderController = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Check if order exists
        const orderWithItems = await getFoodOrderByIdWithItems(id);
        if (!orderWithItems.order) {
            return sendError(res, 'Food order not found', 404);
        }

        // Only admin can delete
        if (req.user.role !== 'admin') {
            return sendError(res, 'Only admin can delete food orders', 403);
        }

        // Delete order
        await deleteFoodOrder(id);

        return sendSuccess(res, 'Food order deleted successfully');

    } catch (error) {
        console.error('Delete food order error:', error);
        return sendError(res, 'Server error deleting food order', 500);
    }
};

// 5. Get food order statistics (admin only)
const getFoodOrderStatsController = async (req, res) => {
    try {
        // Only admin can view statistics
        if (req.user.role !== 'admin') {
            return sendError(res, 'Only admin can view statistics', 403);
        }

        const stats = await getFoodOrderStats();

        return sendSuccess(res, 'Food order statistics retrieved', stats);

    } catch (error) {
        console.error('Get food order stats error:', error);
        return sendError(res, 'Server error retrieving food order statistics', 500);
    }
};

module.exports = {
    createFoodOrderController,
    getFoodOrdersController,
    updateFoodOrderController,
    deleteFoodOrderController,
    getFoodOrderStatsController
};