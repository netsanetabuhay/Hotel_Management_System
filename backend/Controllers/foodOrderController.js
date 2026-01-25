// Import from Models
const {
  createFoodOrder,
  findAllFoodOrders,
  findFoodOrderById,
  findFoodOrdersByGuestId,
  findFoodOrdersByRoomId,
  searchFoodOrders,
  updateFoodOrder,
  updateFoodOrderStatus,
  deleteFoodOrder,
  getFoodOrderStats
} = require('../Models/foodOrder');

const { generateId } = require('../Utils/generateId');
const { findGuestById } = require('../Models/guest');
const { findRoomById } = require('../Models/room');
const { findFoodItemById } = require('../Models/foodItem');

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

//  CREATE FOOD ORDER 
const createFoodOrderHandler = async (req, res) => {
  try {
    const { guest_id, room_id, items, order_type, special_instructions } = req.body;
    
    if (!guest_id || !room_id || !items || !Array.isArray(items) || items.length === 0) {
      return sendError(res, 'guest_id, room_id, and at least one food item are required', 400);
    }
    
    // Verify guest exists
    const guest = await findGuestById(guest_id);
    if (!guest) {
      return sendError(res, 'Guest not found', 404);
    }
    
    // Verify room exists
    const room = await findRoomById(room_id);
    if (!room) {
      return sendError(res, 'Room not found', 404);
    }
    
    // Verify all food items exist and calculate total
    let total_amount = 0;
    for (const item of items) {
      const foodItem = await findFoodItemById(item.food_id);
      if (!foodItem) {
        return sendError(res, `Food item ${item.food_id} not found`, 404);
      }
      if (!item.quantity || item.quantity <= 0) {
        return sendError(res, 'Quantity must be greater than 0 for all items', 400);
      }
      item.price = foodItem.price;
      total_amount += foodItem.price * item.quantity;
    }
    
    const order_id = generateId('ORD');
    const orderData = {
      order_id,
      guest_id,
      room_id,
      order_type: order_type || 'room_service',
      status: 'pending',
      total_amount: total_amount.toFixed(2),
      created_at: new Date(),
      items: items
    };
    
    await createFoodOrder(orderData);
    
    const newOrder = await findFoodOrderById(order_id);
    
    return sendSuccess(res, 'Food order created successfully', newOrder, 201);
  } catch (error) {
    console.error('Create food order error:', error);
    return sendError(res, 'Failed to create food order: ' + error.message, 500);
  }
};

//  GET ALL FOOD ORDERS 
const getAllFoodOrderHandler = async (req, res) => {
  try {
    const filters = {
      guest_id: req.query.guest_id,
      room_id: req.query.room_id,
      status: req.query.status,
      order_type: req.query.order_type,
      start_date: req.query.start_date,
      end_date: req.query.end_date
    };
    
    Object.keys(filters).forEach(key => {
      if (filters[key] === undefined || filters[key] === '') delete filters[key];
    });
    
    const foodOrders = await findAllFoodOrders(filters);
    
    return sendSuccess(res, 'Food orders retrieved successfully', {
      count: foodOrders.length,
      orders: foodOrders
    });
  } catch (error) {
    console.error('Get all food orders error:', error);
    return sendError(res, 'Failed to retrieve food orders', 500);
  }
};

//  UNIFIED SEARCH 
const searchFoodOrderHandler = async (req, res) => {
  try {
    const { identifier } = req.params;
    
    console.log('🔍 FOOD ORDER SEARCH DEBUG:');
    console.log('Identifier:', identifier);
    
    if (!identifier || identifier === 'undefined') {
      // If no identifier, return all orders
      const allOrders = await findAllFoodOrders({});
      return sendSuccess(res, 'All food orders retrieved', {
        count: allOrders.length,
        orders: allOrders
      });
    }
    
    // 1. Check if it's an order_id (starts with ORD)
    if (identifier.toUpperCase().startsWith('ORD')) {
      console.log(' Trying order ID search...');
      const order = await findFoodOrderById(identifier);
      console.log('Order ID search result:', order ? 'FOUND' : 'NOT FOUND');
      
      if (order) {
        return sendSuccess(res, 'Food order found by ID', order);
      }
    }
    
    // 2. Check if it's a guest_id (starts with GST or GUEST)
    if (identifier.toUpperCase().startsWith('GST') || identifier.toUpperCase().startsWith('GUEST')) {
      console.log(' Trying guest ID search...');
      const ordersByGuest = await findFoodOrdersByGuestId(identifier);
      console.log('Guest search result count:', ordersByGuest.length);
      
      if (ordersByGuest.length > 0) {
        return sendSuccess(res, `Food orders found for guest ${identifier}`, {
          guest_id: identifier,
          count: ordersByGuest.length,
          orders: ordersByGuest
        });
      }
    }
    
    // 3. Check if it's a room_id (starts with RM)
    if (identifier.toUpperCase().startsWith('RM')) {
      console.log(' Trying room ID search...');
      const ordersByRoom = await findFoodOrdersByRoomId(identifier);
      console.log('Room search result count:', ordersByRoom.length);
      
      if (ordersByRoom.length > 0) {
        return sendSuccess(res, `Food orders found for room ${identifier}`, {
          room_id: identifier,
          count: ordersByRoom.length,
          orders: ordersByRoom
        });
      }
    }
    
    // 4. Try general search
    console.log(' Trying general search...');
    const searchResults = await searchFoodOrders(identifier);
    console.log('General search result count:', searchResults.length);
    
    if (searchResults.length > 0) {
      return sendSuccess(res, 'Food orders found by search', {
        search_term: identifier,
        count: searchResults.length,
        orders: searchResults
      });
    }
    
    console.log(' No results found for:', identifier);
    return sendError(res, 'No food orders found matching your search', 404);
    
  } catch (error) {
    console.error(' Search food orders error:', error);
    return sendError(res, 'Server error during search', 500);
  }
};

//  UPDATE FOOD ORDER 
const updateFoodOrderHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const existingOrder = await findFoodOrderById(id);
    if (!existingOrder) {
      return sendError(res, 'Food order not found', 404);
    }
    
    const result = await updateFoodOrder(id, updateData);
    
    if (!result.success) {
      return sendError(res, result.message, 400);
    }
    
    const updatedOrder = await findFoodOrderById(id);
    return sendSuccess(res, 'Food order updated successfully', updatedOrder);
  } catch (error) {
    console.error('Update food order error:', error);
    return sendError(res, 'Server error updating food order', 500);
  }
};

//  UPDATE FOOD ORDER STATUS 
const updateFoodOrderStatusHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return sendError(res, 'Status is required', 400);
    }
    
    const validStatuses = ['pending', 'preparing', 'ready', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return sendError(res, `Invalid status. Valid statuses: ${validStatuses.join(', ')}`, 400);
    }
    
    const existingOrder = await findFoodOrderById(id);
    if (!existingOrder) {
      return sendError(res, 'Food order not found', 404);
    }
    
    const result = await updateFoodOrderStatus(id, status);
    
    if (!result.success) {
      return sendError(res, 'Failed to update food order status', 400);
    }
    
    const updatedOrder = await findFoodOrderById(id);
    return sendSuccess(res, 'Food order status updated successfully', {
      order_id: id,
      new_status: status,
      order: updatedOrder
    });
  } catch (error) {
    console.error('Update food order status error:', error);
    return sendError(res, 'Failed to update food order status', 500);
  }
};

//  DELETE FOOD ORDER 
const deleteFoodOrderHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const existingOrder = await findFoodOrderById(id);
    
    if (!existingOrder) {
      return sendError(res, 'Food order not found', 404);
    }
    
    const result = await deleteFoodOrder(id);
    
    if (!result.success) {
      return sendError(res, 'Failed to delete food order', 400);
    }
    
    return sendSuccess(res, 'Food order deleted successfully', {
      order_id: id,
      guest_name: `${existingOrder.guest_first_name} ${existingOrder.guest_last_name}`,
      room_number: existingOrder.room_number
    });
  } catch (error) {
    console.error('Delete food order error:', error);
    return sendError(res, 'Failed to delete food order', 500);
  }
};

//  GET FOOD ORDER STATISTICS 
const getFoodOrderStatistics = async (req, res) => {
  try {
    const stats = await getFoodOrderStats();
    
    return sendSuccess(res, 'Food order statistics retrieved successfully', {
      statistics: stats
    });
  } catch (error) {
    console.error('Get food order statistics error:', error);
    return sendError(res, 'Failed to retrieve food order statistics', 500);
  }
};

//  EXPORTS 
module.exports = {
  createFoodOrder: createFoodOrderHandler,
  getAllFoodOrders: getAllFoodOrderHandler,
  updateFoodOrder: updateFoodOrderHandler,
  deleteFoodOrder: deleteFoodOrderHandler,
  updateFoodOrderStatus: updateFoodOrderStatusHandler,
  searchFoodOrders: searchFoodOrderHandler,
  getFoodOrderStatistics
};