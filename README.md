#  Library Management System

A full-stack web application to manage library operations, including book inventory, member transactions, and overdue fine calculations.  
The system features **Role-Based Access Control (Admin vs. User).**

---

##  Tech Stack

### Frontend
- HTML5
- CSS3
- JavaScript (Vanilla)

### Backend
- Node.js
- Express.js

### Database
- MySQL
---

##  Features

- **Admin Dashboard**
   Add new books
   Manage inventory

- **User Dashboard**
   View book catalog
   Check availability

- **Transactions**
   Issue books
   Return books

- **Automated Fines**
  Calculates overdue fines automatically at **$5/day** or anything as per rule upon return

- **Role-Based Login**
   Different interfaces for **Admins** and **Staff/User**

---

##  Installation & Setup

### 1. Database Setup (MySQL)

Create a database named `library_db` and run the following SQL commands:

```sql
CREATE DATABASE library_db;
USE library_db;

-- Users Table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50),
    password VARCHAR(255),
    role ENUM('admin', 'user')
);

-- Books Table
CREATE TABLE books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100),
    category VARCHAR(50),
    total_stock INT,
    available_stock INT
);

-- Transactions Table
CREATE TABLE transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    book_id INT,
    user_name VARCHAR(100),
    issue_date DATE,
    due_date DATE,
    return_date DATE,
    fine_amount DECIMAL(10,2) DEFAULT 0
);

-- Insert Default Users
INSERT INTO users (username, password, role) VALUES ('admin', 'admin123', 'admin');
INSERT INTO users (username, password, role) VALUES ('staff', 'staff123', 'user');


```
### Navigate to the backend folder and install dependencies:
cd backend

npm init -y

npm install express mysql2 cors body-parser

node server.js // start the server

// after this you will see Server running on port 3000

//then simply open the frontend/index.html file in any web browser.

               LibrarySystem/             (libraray_mgmt_sys)

               ├── backend/
               │   ├── server.js         # API Logic & Database Connection
               │   └── package.json      # Dependencies
               │
               ├── frontend/
               │   ├── index.html        # Login Page
               │   ├── dashboard.html    # Main Application Dashboard
               │   └── app.js            # (Optional) External JS file
               │
               └── README.md             # Project Documentation

## Submission Note

The initial version of this project was submitted on **9th December 2025** as per the assigned deadline.

Post-submission updates include:
- Bug fixes
- Code refactoring
- UI/UX improvements
- Backend feature enhancements

These changes were made to demonstrate a more polished and production-ready version during the technical discussion.



