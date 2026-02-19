require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const { body, validationResult } = require("express-validator");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || "*" }));
app.use(express.json());

// MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
});

// Initialize database table
async function initDB() {
  try {
    const conn = await pool.getConnection();
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS contacts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        subject VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    conn.release();
    console.log("✅ Database initialized");
  } catch (err) {
    console.error("❌ DB init error:", err.message);
  }
}

// Validation rules
const contactValidation = [
  body("name").trim().notEmpty().withMessage("Name is required").isLength({ max: 255 }),
  body("email").trim().isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("phone").optional().trim().isLength({ max: 50 }),
  body("subject").trim().notEmpty().withMessage("Subject is required").isLength({ max: 255 }),
  body("message").trim().notEmpty().withMessage("Message is required").isLength({ max: 5000 }),
];

// Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// GET all contacts
app.get("/api/contacts", async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT * FROM contacts ORDER BY created_at DESC"
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to fetch contacts" });
  }
});

// POST create contact
app.post("/api/contacts", contactValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { name, email, phone, subject, message } = req.body;

  try {
    const [result] = await pool.execute(
      "INSERT INTO contacts (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)",
      [name, email, phone || null, subject, message]
    );
    res.status(201).json({
      success: true,
      message: "Contact submitted successfully!",
      id: result.insertId,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to save contact" });
  }
});

// DELETE contact
app.delete("/api/contacts/:id", async (req, res) => {
  try {
    await pool.execute("DELETE FROM contacts WHERE id = ?", [req.params.id]);
    res.json({ success: true, message: "Contact deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to delete contact" });
  }
});

// Start server
initDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});
