import express from "express";
import { body, validationResult } from "express-validator"; // Input validation
import bcrypt from "bcrypt";
import pool from "../db.js"; // Database connection

const router = express.Router();
// For login
router.post(
  "/login",
  [
    // Validate input fields
    body("email").trim().isEmail().withMessage("Invalid email format"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Check if the user exists
      const user = await pool.query("SELECT * FROM users WHERE email = $1", [
        email,
      ]);

      if (user.rows.length === 0) {
        return res.status(401).json({ error: "Invalid email or password" }); // 401 Unauthorized
      }

      // Compare hashed password
      const validPassword = await bcrypt.compare(
        password,
        user.rows[0].password
      );

      if (!validPassword) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // Success response (No JWT for now, we'll add it later)
      res.status(200).json({
        message: "Login successful",
        user: {
          id: user.rows[0].id,
          username: user.rows[0].username,
          email: user.rows[0].email,
          created_at: user.rows[0].created_at,
        },
      });
    } catch (error) {
      console.error("Login Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// For Signup
router.post(
  "/signup",
  [
    // Validation rules
    body("username").trim().notEmpty().withMessage("Username is required"),
    body("email").trim().isEmail().withMessage("Invalid email format"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  async (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    try {
      // Check if the email is already registered
      const existingEmail= await pool.query(
        "SELECT id FROM users WHERE email = $1",
        [email]
      );

      if (existingEmail.rows.length > 0) {
        return res.status(409).json({ error: "Email already exists." }); // 409 Conflict
      }

      const existingUser = await pool.query(
        "SELECT id FROM users WHERE username = $1",
        [username]
      );

      if (existingUser.rows.length > 0) {
        return res.status(409).json({ error: "User already exists." }); // 409 Conflict
      }



      // Hash the password securely
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Insert user into database
      const newUser = await pool.query(
        "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, created_at",
        [username, email, hashedPassword]
      );

      res.status(201).json({
        message: "User registered successfully",
        user: newUser.rows[0], // Returns only id, username, email, created_at
      });
    } catch (error) {
      console.error("Signup Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

//for leaderboards
router.get("/getleaderboard", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        RANK() OVER (ORDER BY elo DESC) AS rank,
        username, 
        elo, 
        wins, 
        losses 
      FROM leaderboard;
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

export default router;
