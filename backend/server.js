const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 1. Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',      // YOUR MySQL username (usually root)
    password: 'NewStrong@123',      // YOUR MySQL password
    database: 'library_db'
});

db.connect(err => {
    if (err) { console.error('DB Connection Failed:', err); }
    else { console.log('Connected to MySQL Database'); }
});

// 2. Login API (Checks username/password & returns role)
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const sql = "SELECT * FROM users WHERE username = ? AND password = ?";
    db.query(sql, [username, password], (err, result) => {
        if (err) return res.json({ error: err });
        if (result.length > 0) {
            return res.json({ success: true, role: result[0].role });
        } else {
            return res.json({ success: false, message: "Invalid Credentials" });
        }
    });
});

// 3. Books API (For Master List)
app.get('/books', (req, res) => {
    db.query("SELECT * FROM books", (err, result) => {
        if (err) return res.json(err);
        return res.json(result);
    });
});

// 4. Add Book API
app.post('/add-book', (req, res) => {
    const { title, category, stock } = req.body;
    const sql = "INSERT INTO books (title, category, total_stock, available_stock) VALUES (?, ?, ?, ?)";
    db.query(sql, [title, category, stock, stock], (err, result) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true, message: "Book added successfully" });
    });
});

// 5. Issue Book API
app.post('/issue-book', (req, res) => {
    const { bookId, memberName, dueDate } = req.body;
    
    // First, check if book is available
    const checkStockSql = "SELECT available_stock FROM books WHERE id = ?";
    db.query(checkStockSql, [bookId], (err, result) => {
        if (err) return res.json({ success: false, error: err });
        if (result.length === 0) return res.json({ success: false, message: "Book not found" });
        if (result[0].available_stock <= 0) return res.json({ success: false, message: "Book not available" });
        
        // Insert transaction
        const insertTxSql = "INSERT INTO transactions (book_id, user_name, due_date) VALUES (?, ?, ?)";
        db.query(insertTxSql, [bookId, memberName, dueDate], (err, result) => {
            if (err) return res.json({ success: false, error: err });
            
            // Decrease stock
            const updateStockSql = "UPDATE books SET available_stock = available_stock - 1 WHERE id = ?";
            db.query(updateStockSql, [bookId], (err, result) => {
                if (err) return res.json({ success: false, error: err });
                return res.json({ success: true, message: "Book issued successfully" });
            });
        });
    });
});

//--book return feature------------------------------------------------------------------------------------------------------------
// ==========================================
// FEATURE: RETURN BOOK & FINE CALCULATION
// ==========================================
app.post('/return-book', (req, res) => {
    const { bookId, memberName } = req.body;

    // STEP 1: Find the active transaction for this book and user
    // We look for a record where 'return_date' is NULL (meaning it hasn't been returned yet)
    const findTxSql = "SELECT * FROM transactions WHERE book_id = ? AND user_name = ? AND return_date IS NULL";

    db.query(findTxSql, [bookId, memberName], (err, results) => {
        if (err) return res.json({ success: false, error: err });
        
        // If no active transaction is found, stop here
        if (results.length === 0) {
            return res.json({ success: false, message: "No active record found. Is the Book ID correct?" });
        }

        const transaction = results[0];
        const dueDate = new Date(transaction.due_date);
        const today = new Date();
        
        // STEP 2: Calculate Fine Logic
        // We compare Today vs Due Date. 
        // Logic: 1 day late = $5 fine (You can change this amount)
        let fine = 0;
        const diffTime = today - dueDate; // Difference in milliseconds
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

        if (diffDays > 0) {
            fine = diffDays * 5; // $5 per day penalty
        }

        // STEP 3: Update the Transaction Record in Database
        // We set the return_date to NOW() and save the fine amount
        const updateTxSql = "UPDATE transactions SET return_date = CURDATE(), fine_amount = ? WHERE id = ?";
        
        db.query(updateTxSql, [fine, transaction.id], (err, result) => {
            if (err) return res.json({ success: false, error: err });

            // STEP 4: Increase Book Stock (Put the book back on the shelf)
            const updateStockSql = "UPDATE books SET available_stock = available_stock + 1 WHERE id = ?";
            
            db.query(updateStockSql, [bookId], (err, result) => {
                if (err) return res.json({ success: false, error: err });

                // STEP 5: Send response to Frontend
                // We send the fine amount so the frontend can show a specific alert
                res.json({ 
                    success: true, 
                    message: "Book Returned Successfully", 
                    fineAmount: fine 
                });
            });
        });
    });
});
//---------book return feature end-------------------------------------------------------------------------------------------------------


// 4. Start Server
app.listen(3000, () => {
    console.log("Server running on port 3000");
});