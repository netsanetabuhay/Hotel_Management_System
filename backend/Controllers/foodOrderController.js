const {
    createFoodOrder,
    getFoodOrders,
    getFoodOrderByIdWithItems,
    checkFoodOrderOwnership,
    getFoodOrderStatus,
    updateFoodOrder,
    updateFoodOrderItems,
    deleteFoodOrder,
    getFoodOrderStats,
    getFoodPrice
} = require('../Models/foodOrder.js');

// 1. Create food order
const createFoodOrderController = async (req, res) => {
    try {
        const userId = req.user.id;
        const { order_place, items } = req.body;

        // Validation
        if (!order_place || !items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Order place and at least one food item are required'
            });
        }

        // Validate items
        const validatedItems = [];
        for (const item of items) {
            if (!item.food_id || !item.quantity || item.quantity <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Each item must have valid food_id and quantity > 0'
                });
            }
            
            // Get current price
            const price = await getFoodPrice(item.food_id);
            if (price === 0) {
                return res.status(400).json({
                    success: false,
                    message: `Food item ${item.food_id} not found or has invalid price`
                });
            }
            
            validatedItems.push({
                food_id: item.food_id,
                quantity: item.quantity,
                price: price
            });
        }

        // Generate order ID
        const orderId = 'FOOD' + Date.now();

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

        res.status(201).json({
            success: true,
            message: 'Food order created successfully',
            data: orderWithItems
        });

    } catch (error) {
        console.error('Create food order error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error creating food order',
            error: error.message
        });
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
            return res.json({
                success: true,
                message: 'Order retrieved with items',
                data: orderWithItems
            });
        }

        const message = isAdmin 
            ? 'All food orders retrieved' 
            : 'Your food orders retrieved';

        res.json({
            success: true,
            message,
            data: orders
        });

    } catch (error) {
        console.error('Get food orders error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error retrieving food orders',
            error: error.message
        });
    }
};

// 3. Update food order
// const updateFoodOrderController = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const userId = req.user.id;
//         const isAdmin = req.user.role === 'admin';
        
//         // Check if order exists
//         const orderWithItems = await getFoodOrderByIdWithItems(id);
//         if (!orderWithItems.order) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Food order not found'
//             });
//         }

//         const currentOrder = orderWithItems.order;
//         const currentStatus = currentOrder.order_status;
        
//         // Authorization check
//         if (!isAdmin) {
//             const ownsOrder = await checkFoodOrderOwnership(id, userId);
//             if (!ownsOrder) {
//                 return res.status(403).json({
//                     success: false,
//                     message: 'You can only update your own orders'
//                 });
//             }
//         }

//         const { order_status, payment_status, items, order_place } = req.body;
//         const updateData = {};
        
//         // Regular user updates (only allowed when pending)
//         if (!isAdmin) {
//             if (currentStatus !== 'pending') {
//                 return res.status(400).json({
//                     success: false,
//                     message: 'You can only update orders with "pending" status'
//                 });
//             }
            
//             // Users can only update items or order place
//             if (items && Array.isArray(items) && items.length > 0) {
//                 // Validate new items
//                 const validatedItems = [];
//                 for (const item of items) {
//                     if (!item.food_id || !item.quantity || item.quantity <= 0) {
//                         return res.status(400).json({
//                             success: false,
//                             message: 'Each item must have valid food_id and quantity > 0'
//                         });
//                     }
                    
//                     const price = await getFoodPrice(item.food_id);
//                     if (price === 0) {
//                         return res.status(400).json({
//                             success: false,
//                             message: `Food item ${item.food_id} not found`
//                         });
//                     }
                    
//                     validatedItems.push({
//                         food_id: item.food_id,
//                         quantity: item.quantity,
//                         price: price
//                     });
//                 }
                
//                 await updateFoodOrderItems(id, validatedItems);
//             }
            
//             if (order_place !== undefined) {
//                 updateData.order_place = order_place;
//             }
            
//             // Users can cancel order by setting status to 'cancelled'
//             if (order_status === 'cancelled') {
//                 updateData.order_status = 'cancelled';
//             } else if (order_status && order_status !== 'pending') {
//                 return res.status(403).json({
//                     success: false,
//                     message: 'You can only cancel orders, not change status'
//                 });
//             }
//         }
        
//         // Admin updates
//         if (isAdmin) {
//             if (order_status !== undefined) {
//                 if (!['pending', 'preparing', 'delivered', 'cancelled'].includes(order_status)) {
//                     return res.status(400).json({
//                         success: false,
//                         message: 'Invalid order status'
//                     });
//                 }
//                 updateData.order_status = order_status;
//             }
            
//             if (payment_status !== undefined) {
//                 if (!['paid', 'unpaid'].includes(payment_status)) {
//                     return res.status(400).json({
//                         success: false,
//                         message: 'Invalid payment status'
//                     });
//                 }
//                 updateData.payment_status = payment_status;
//             }
            
//             if (order_place !== undefined) {
//                 updateData.order_place = order_place;
//             }
            
//             // Admin can also update items
//             if (items && Array.isArray(items) && items.length > 0) {
//                 const validatedItems = [];
//                 for (const item of items) {
//                     if (!item.food_id || !item.quantity || item.quantity <= 0) {
//                         return res.status(400).json({
//                             success: false,
//                             message: 'Each item must have valid food_id and quantity > 0'
//                         });
//                     }
                    
//                     const price = await getFoodPrice(item.food_id);
//                     if (price === 0) {
//                         return res.status(400).json({
//                             success: false,
//                             message: `Food item ${item.food_id} not found`
//                         });
//                     }
                    
//                     validatedItems.push({
//                         food_id: item.food_id,
//                         quantity: item.quantity,
//                         price: price
//                     });
//                 }
                
//                 await updateFoodOrderItems(id, validatedItems);
//             }
//         }

//         // Update order if there are changes
//         if (Object.keys(updateData).length > 0) {
//             await updateFoodOrder(id, updateData);
//         }

//         // Get updated order
//         const updatedOrder = await getFoodOrderByIdWithItems(id);

//         res.json({
//             success: true,
//             message: 'Food order updated successfully',
//             data: updatedOrder
//         });

//     } catch (error) {
//         console.error('Update food order error:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Server error updating food order',
//             error: error.message
//         });
//     }
// };
// 3. Update food order
const updateFoodOrderController = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const isAdmin = req.user.role === 'admin';
        
        // Check if order exists
        const orderWithItems = await getFoodOrderByIdWithItems(id);
        if (!orderWithItems.order) {
            return res.status(404).json({
                success: false,
                message: 'Food order not found'
            });
        }

        const currentOrder = orderWithItems.order;
        const currentStatus = currentOrder.order_status;
        
        // Authorization check
        if (!isAdmin) {
            const ownsOrder = await checkFoodOrderOwnership(id, userId);
            if (!ownsOrder) {
                return res.status(403).json({
                    success: false,
                    message: 'You can only update your own orders'
                });
            }
        }

        const { order_status, payment_status, items, order_place } = req.body;
        const updateData = {};
        
        // Regular user updates (only allowed when pending)
        if (!isAdmin) {
            if (currentStatus !== 'pending') {
                return res.status(400).json({
                    success: false,
                    message: 'You can only update orders with "pending" status'
                });
            }
            
            // Users can update items
            if (items && Array.isArray(items) && items.length > 0) {
                // Validate new items
                const validatedItems = [];
                for (const item of items) {
                    if (!item.food_id || !item.quantity || item.quantity <= 0) {
                        return res.status(400).json({
                            success: false,
                            message: 'Each item must have valid food_id and quantity > 0'
                        });
                    }
                    
                    const price = await getFoodPrice(item.food_id);
                    if (price === 0) {
                        return res.status(400).json({
                            success: false,
                            message: `Food item ${item.food_id} not found`
                        });
                    }
                    
                    validatedItems.push({
                        food_id: item.food_id,
                        quantity: item.quantity,
                        price: price
                    });
                }
                
                await updateFoodOrderItems(id, validatedItems);
            }
            
            // Users can update order place
            if (order_place !== undefined) {
                updateData.order_place = order_place;
            }
            
            // Users can cancel order by setting status to 'cancelled'
            if (order_status === 'cancelled') {
                updateData.order_status = 'cancelled';
            } else if (order_status && order_status !== 'pending') {
                return res.status(403).json({
                    success: false,
                    message: 'You can only cancel orders, not change status'
                });
            }
        }
        
        // Admin updates (only status and payment)
        if (isAdmin) {
            if (order_status !== undefined) {
                if (!['pending', 'preparing', 'delivered', 'cancelled'].includes(order_status)) {
                    return res.status(400).json({
                        success: false,
                        message: 'Invalid order status'
                    });
                }
                updateData.order_status = order_status;
            }
            
            if (payment_status !== undefined) {
                if (!['paid', 'unpaid'].includes(payment_status)) {
                    return res.status(400).json({
                        success: false,
                        message: 'Invalid payment status'
                    });
                }
                updateData.payment_status = payment_status;
            }
            // Admin CANNOT update items or order_place
        }

        // Update order if there are changes
        if (Object.keys(updateData).length > 0) {
            await updateFoodOrder(id, updateData);
        }

        // Get updated order
        const updatedOrder = await getFoodOrderByIdWithItems(id);

        res.json({
            success: true,
            message: 'Food order updated successfully',
            data: updatedOrder
        });

    } catch (error) {
        console.error('Update food order error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error updating food order',
            error: error.message
        });
    }
};

// 4. Delete/cancel food order
const deleteFoodOrderController = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const isAdmin = req.user.role === 'admin';
        
        // Check if order exists
        const orderWithItems = await getFoodOrderByIdWithItems(id);
        if (!orderWithItems.order) {
            return res.status(404).json({
                success: false,
                message: 'Food order not found'
            });
        }

        const currentStatus = orderWithItems.order.order_status;
        
        // Authorization check
        if (!isAdmin) {
            const ownsOrder = await checkFoodOrderOwnership(id, userId);
            if (!ownsOrder) {
                return res.status(403).json({
                    success: false,
                    message: 'You can only delete your own orders'
                });
            }
            
            // Users can only delete pending orders
            if (currentStatus !== 'pending') {
                return res.status(400).json({
                    success: false,
                    message: 'You can only delete orders with "pending" status'
                });
            }
        }

        // Delete order
        await deleteFoodOrder(id);

        res.json({
            success: true,
            message: 'Food order deleted successfully'
        });

    } catch (error) {
        console.error('Delete food order error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error deleting food order',
            error: error.message
        });
    }
};

// 5. Get food order statistics (admin only)
const getFoodOrderStatsController = async (req, res) => {
    try {
        const stats = await getFoodOrderStats();

        res.json({
            success: true,
            message: 'Food order statistics retrieved',
            data: stats
        });

    } catch (error) {
        console.error('Get food order stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error retrieving food order statistics',
            error: error.message
        });
    }
};

module.exports = {
    createFoodOrderController,
    getFoodOrdersController,
    updateFoodOrderController,
    deleteFoodOrderController,
    getFoodOrderStatsController
};