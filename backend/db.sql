-- 1. USERS (Staff/Employees)
CREATE TABLE users (
    user_id VARCHAR(20) PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    email VARCHAR(100) UNIQUE,
    password_hash VARCHAR(255),
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    phone VARCHAR(20),
    role ENUM('admin', 'manager', 'receptionist', 'housekeeping', 'chef', 'waiter'),
    status ENUM('active', 'inactive'),
    created_at TIMESTAMP
);

-- 2. GUESTS (Customers)
CREATE TABLE guests (
    guest_id VARCHAR(20) PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP
);

-- 3. ROOMS
CREATE TABLE rooms (
    room_id VARCHAR(20) PRIMARY KEY,
    room_number VARCHAR(10) UNIQUE,
    room_type VARCHAR(50),
    price DECIMAL(10,2),
    status VARCHAR(30)
);

-- 4. RESERVATIONS
CREATE TABLE reservations (
    reservation_id VARCHAR(20) PRIMARY KEY,
    guest_id VARCHAR(20),
    room_id VARCHAR(20),
    check_in DATE,
    check_out DATE,
    status VARCHAR(30),
    created_at TIMESTAMP,
    FOREIGN KEY (guest_id) REFERENCES guests(guest_id),
    FOREIGN KEY (room_id) REFERENCES rooms(room_id)
);

-- 5. FOOD ITEMS (Menu)
CREATE TABLE food_items (
    food_id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100),
    category VARCHAR(50),
    price DECIMAL(10,2),
    description TEXT
);

-- 6. FOOD ORDERS
CREATE TABLE food_orders (
    order_id VARCHAR(20) PRIMARY KEY,
    guest_id VARCHAR(20),
    room_id VARCHAR(20),
    order_type VARCHAR(20),
    status VARCHAR(30),
    total_amount DECIMAL(10,2),
    created_at TIMESTAMP,
    FOREIGN KEY (guest_id) REFERENCES guests(guest_id),
    FOREIGN KEY (room_id) REFERENCES rooms(room_id)
);

-- 7. ORDER ITEMS (What was ordered)
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(20),
    food_id VARCHAR(20),
    quantity INT,
    price DECIMAL(10,2),
    FOREIGN KEY (order_id) REFERENCES food_orders(order_id),
    FOREIGN KEY (food_id) REFERENCES food_items(food_id)
);

-- 8. PAYMENTS
CREATE TABLE payments (
    payment_id VARCHAR(20) PRIMARY KEY,
    reservation_id VARCHAR(20),
    order_id VARCHAR(20),
    amount DECIMAL(10,2),
    payment_method VARCHAR(50),
    status VARCHAR(30),
    created_at TIMESTAMP,
    FOREIGN KEY (reservation_id) REFERENCES reservations(reservation_id),
    FOREIGN KEY (order_id) REFERENCES food_orders(order_id)
);

-- 9. TASKS (Staff assignments)
CREATE TABLE tasks (
    task_id VARCHAR(20) PRIMARY KEY,
    title VARCHAR(100),
    assigned_to VARCHAR(20),
    task_type VARCHAR(50),
    status VARCHAR(30),
    room_id VARCHAR(20),
    due_date DATE,
    created_at TIMESTAMP,
    FOREIGN KEY (assigned_to) REFERENCES users(user_id),
    FOREIGN KEY (room_id) REFERENCES rooms(room_id)
);

-- 10. ACTIVITY LOGS
CREATE TABLE activity_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(20),
    activity VARCHAR(200),
    timestamp TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);