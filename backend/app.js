// // 1. IMPORT DEPENDENCIES
const express = require('express');        
const cors = require('cors');            
const dotenv = require('dotenv');
const bycrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');

// // 2. ROUTE IMPORTS
const userRoutes = require('./Routes/userRoutes');
const roomRoutes = require('./Routes/roomRoutes');
// const roomOrderRoutes = require('./Routes/roomOrderRoutes');
// const foodItemRoutes = require('./Routes/foodItemRoutes');
// const foodOrderRoutes = require('./Routes/foodOrderRoutes');
// const  food_order_itemsRoutes = require('./Routes/food_order_itemsRoutes');


// // 3. INITIALIZE APP
const app = express();

// // 4. APPLY MIDDLEWARE
app.use(cors());                          // Enable CORS
app.use(express.urlencoded({ extended: true }));
app.use(express.json());                  // Parse JSON bodies
dotenv.config();                       

// // 5. MOUNT ROUTES
app.use('/api/users', userRoutes);
// app.use('/api/rooms', roomRoutes);
// app.use('/api/room-orders', roomOrderRoutes);
// app.use('/api/food-items', foodItemRoutes);
// app.use('/api/food-orders', foodOrderRoutes);
// app.use('/api/food-order-items', food_order_itemsRoutes);
// // 6. BASIC ROUTES
app.get('/', (req, res) => {
    res.json({
        message: 'Hotel Management System API',
        version: '1.0.0',
        status: 'running'
    });
});

// // 7. ERROR HANDLING
app.use((req, res) => {
    res.status(404).json({
        error: 'Route not found'
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Internal server error'
    });
});

// // create server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// // 8. EXPORT APP
module.exports = app;