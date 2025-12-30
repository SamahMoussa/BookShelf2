const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
const Port = 5000;

// Serve images
app.use("/images", express.static("images"));

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname + "_" + Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "bookshelf",
});

db.connect((err) => {
  if (err) console.error("MySQL connection failed:", err);
  else console.log("MySQL connected successfully");
});

app.get("/books", (req, res) => {
  const sql = `
    SELECT 
      b.id,
      b.title,
      a.name AS author,
      g.name AS genre,
      b.image,
      b.description
    FROM books b
    JOIN authors a ON b.author_id = a.id
    JOIN genres g ON b.genre_id = g.id
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Signup
app.post("/users/signup", (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password)
    return res.status(400).json({ message: "All fields are required" });

  db.query("SELECT * FROM users WHERE username = ?", [username], (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length > 0)
      return res.status(400).json({ message: "Username already exists" });

    const sql = "INSERT INTO users (username, email, password, created_at) VALUES (?, ?, ?, NOW())";
    db.query(sql, [username, email, password], (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ id: result.insertId, username, email });
    });
  });
});

// Login
app.post("/users/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ message: "Username and password required" });

  const sql = "SELECT * FROM users WHERE username = ? AND password = ?";
  db.query(sql, [username, password], (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0) return res.status(400).json({ message: "Invalid credentials" });

    const user = results[0];
    res.json({ id: user.id, username: user.username, email: user.email });
  });
});


// Get reviews for a book
app.get("/reviews/:bookId", (req, res) => {
  const sql = `
    SELECT r.id, r.rating, r.review_text, r.created_at, r.user_id, u.username
    FROM reviews r
    JOIN users u ON r.user_id = u.id
    WHERE r.book_id = ?
    ORDER BY r.created_at DESC
  `;
  db.query(sql, [req.params.bookId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Add review
app.post("/reviews", (req, res) => {
  const { user_id, book_id, rating, review_text } = req.body;
  const sql = `
    INSERT INTO reviews (user_id, book_id, rating, review_text, created_at)
    VALUES (?, ?, ?, ?, NOW())
  `;
  db.query(sql, [user_id, book_id, rating, review_text], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Review added", insertId: result.insertId });
  });
});

// Delete review 
app.delete("/reviews", (req, res) => {
  const { review_id, user_id } = req.body;
  if (!review_id || !user_id)
    return res.status(400).json({ message: "Missing review_id or user_id" });

  const sqlCheck = "SELECT * FROM reviews WHERE id = ? AND user_id = ?";
  db.query(sqlCheck, [review_id, user_id], (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0)
      return res.status(403).json({ message: "You can only delete your own review" });

    const sqlDelete = "DELETE FROM reviews WHERE id = ?";
    db.query(sqlDelete, [review_id], (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Review deleted" });
    });
  });
});

app.get("/wishlist/:userId", (req, res) => {
  const sql = `
    SELECT b.*
    FROM wishlist w
    JOIN books b ON w.book_id = b.id
    WHERE w.user_id = ?
  `;
  db.query(sql, [req.params.userId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.post("/api/wishlist", (req, res) => {
  const { user_id, book_id } = req.body;
  const sql = `INSERT IGNORE INTO wishlist (user_id, book_id, added_at) VALUES (?, ?, NOW())`;
  db.query(sql, [user_id, book_id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Added to wishlist" });
  });
});

app.delete("/api/wishlist", (req, res) => {
  const { user_id, book_id } = req.body;
  const sql = `DELETE FROM wishlist WHERE user_id = ? AND book_id = ?`;
  db.query(sql, [user_id, book_id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Removed from wishlist" });
  });
});

app.listen(Port, () => {
  console.log(`Server running on http://localhost:${Port}`);
});
