 Hotel Management System
📋 Project Overview
A comprehensive full-stack Hotel Management System built with Next.js frontend and MySQL database. This system streamlines hotel operations including room bookings, food services, customer management, and administrative controls.

✨ Key Features
👥 User Management
User authentication and authorization

Role-based access control (Admin/User)

Profile management with image upload

Secure password hashing

🛏️ Room Management
Room inventory tracking

Multiple room types (Deluxe, Executive, Suite, Presidential)

Real-time availability status

Room images and pricing

Maintenance mode support

🍽️ Food Service
Comprehensive menu management

Food categories with images

Real-time order tracking

Order status (Pending/Preparing/Delivered)

Multiple delivery options (Take away/In hotel/Room service)

📦 Order Processing
Room booking system with date selection

Food ordering system

Payment status tracking

Order history for users

Admin dashboard for managing all orders

🏗️ System Architecture
Frontend (Next.js)
Framework: Next.js 16.1.6

Styling: CSS/Tailwind

HTTP Client: Axios for API calls

State Management: React hooks

Backend/Database (MySQL)
Database: MySQL

Tables: 6 interconnected tables

Relationships: Foreign key constraints

Data Integrity: ACID compliant

🗄️ Database Schema
Tables Structure
Table	Description	Key Columns
users	User information	user_id, username, email, role, profile_image
rooms	Room details	room_id, room_number, room_type, price, status, image_url
room_orders	Room bookings	room_order_id, user_id, room_id, check_in, check_out
food_items	Menu items	food_id, name, category, price, description, image_url
food_orders	Food orders	food_order_id, user_id, order_status, payment_status
food_order_items	Order line items	id, food_order_id, food_id, quantity, price
🔧 Technologies Used
Frontend: Next.js, React, Axios

Database: MySQL, phpMyAdmin

Languages: JavaScript, SQL

Tools: Git, npm/yarn

📊 Database Relationships
text
users ───┬─── room_orders ─── rooms
         └─── food_orders ───┬─── food_order_items ─── food_items
🚀 Getting Started
Prerequisites
Node.js (v14 or higher)

MySQL Server

npm or yarn package manager

Installation Steps
Clone the repository

bash
git clone https://github.com/yourusername/hotel-management-system.git
cd hotel-management-system
Set up the database

Import database/hotel_system.sql to phpMyAdmin or MySQL CLI

Update database configuration in backend

Install frontend dependencies

bash
cd frontend
npm install
# or
yarn install
Configure environment variables
Create .env.local file:

env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
Run the application

bash
npm run dev
# or
yarn dev
Access the application

Frontend: http://localhost:3000

phpMyAdmin: http://localhost/phpmyadmin

👥 User Roles
Admin
Full system access

Manage rooms and food items

View all orders

Update order status

User management

Customer/User
Browse rooms and menu

Make room bookings

Place food orders

View order history

Manage profile

📱 Features in Detail
Admin Dashboard
Overview of total bookings

Recent orders

Room occupancy status

Revenue summary

Quick actions menu

Room Booking System
Check availability

Date selection

Room type filtering

Instant booking confirmation

Booking history

Food Ordering
Browse menu by category

Add to cart

Customize order

Choose delivery location

Track order status

🔒 Security Features
Password hashing for user authentication

SQL injection prevention

Input validation

Role-based access control

Secure API endpoints

🤝 Contributing
Fork the repository

Create your feature branch (git checkout -b feature/AmazingFeature)

Commit changes (git commit -m 'Add AmazingFeature')

Push to branch (git push origin feature/AmazingFeature)

Open a Pull Request

📝 License
This project is for educational purposes.

👨‍💻 Author
Netsanet Abuhay

📧 Contact
email : netsanetabuhay@gmail.com
telegram : @NetsanetA

🙏 Acknowledgments
WabiSkill bootcamp
Next.js documentation
MySQL community
Open source contributors

