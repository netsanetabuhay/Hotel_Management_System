// // 1. IMPORT DEPENDENCIES
const express = require('express');        
const cors = require('cors');            
const dotenv = require('dotenv');
const bycrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
const path = require('path');

// // 2. ROUTE IMPORTS
const userRoutes = require('./Routes/userRoutes');
const roomRoutes = require('./Routes/roomRoutes');
const reservationRoutes = require('./Routes/reservationRoutes');
const foodItemRoutes = require('./Routes/foodItemRoutes');
const foodOrderRoutes = require('./Routes/foodOrderRoutes');
const uploadRoutes = require('./Routes/uploadRoutes');



// // 3. INITIALIZE APP
const app = express();


// // 4. APPLY MIDDLEWARE
app.use(cors());                             // Enable CORS
app.use(express.urlencoded({ extended: true }));
app.use(express.json());                  // Parse JSON bodies
dotenv.config();                       


//servet static files from uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// // 5. MOUNT ROUTES
app.use('/api/users', userRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/room-orders', reservationRoutes);
app.use('/api/food-items', foodItemRoutes);
app.use('/api/food-orders', foodOrderRoutes);
app.use('/api/uploads', uploadRoutes); // Add upload routes





// // 6. BASIC ROUTES
app.get('/', (req, res) => {
    res.json({
        message: 'Hotel Management System API',
        version: '1.0.0',
        status: 'running'
    });
    app.get('/health', (req, res) => {
        res.json({ status: 'OK' });
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