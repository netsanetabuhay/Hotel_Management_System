// // 1. IMPORT DEPENDENCIES
const express = require('express');        
const cors = require('cors');            
const dotenv = require('dotenv');
const bycrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');

// // 2. ROUTE IMPORTS
// const authRoutes = require('./Routes/authRoutes');
const userRoutes = require('./Routes/userRoutes');
const guestRoutes = require('./Routes/guestRoutes');
const roomRoutes = require('./Routes/roomRoutes');
const reservationRoutes = require('./Routes/reservationRoutes');
// const foodItemRoutes = require('./Routes/foodItemRoutes');
// const foodOrderRoutes = require('./Routes/foodOrderRoutes');
// const paymentRoutes = require('./Routes/paymentRoutes');
// const taskRoutes = require('./Routes/taskRoutes');
// const activityRoutes = require('./Routes/activityRoutes');  


// // 3. INITIALIZE APP
const app = express();


// // 4. APPLY MIDDLEWARE

app.use(cors());                          // Enable CORS
app.use(express.urlencoded({ extended: true }));
app.use(express.json());                  // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); 
dotenv.config();                       


// // 5. MOUNT ROUTES
// app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/guests', guestRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/reservations', reservationRoutes);
// app.use('/api/food-items', foodItemRoutes);
// app.use('/api/food-orders', foodOrderRoutes);
// app.use('/api/payments', paymentRoutes);
// app.use('/api/tasks', taskRoutes);
// app.use('/api/activities', activityRoutes);

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

// app.js
// const express = require('express');
// const cors = require('cors');
// const dotenv = require('dotenv');

// dotenv.config();

// const app = express();

// // ✅ MUST be **first** before routes
// app.use(cors());
// app.use(express.json());               // Parse JSON bodies
// app.use(express.urlencoded({ extended: true })); // Parse form data

// // ROUTES
// const guestRoutes = require('./Routes/guestRoutes');
// app.use('/api/guests', guestRoutes);

// // TEST ROUTE
// app.get('/', (req, res) => res.json({ status: 'API running' }));

// // 404
// app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

// // SERVER
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
