import express from "express";
import pool from "../db.js";

const router = express.Router();

// 📌 Get user profile by email
router.get("/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM user_profiles WHERE email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// 📌 Update user profile
router.put("/:email", async (req, res) => {
  const { email } = req.params;
  const { username, firstName, lastName, phone, bio, country } = req.body;

  try {
    // 🔍 Check if the user exists
    const userCheck = await pool.query(
      `SELECT * FROM user_profiles WHERE email = $1`,
      [email]
    );

    if (userCheck.rows.length === 0) {
      // ❌ User does NOT exist, insert them
      const insertResult = await pool.query(
        `INSERT INTO user_profiles (email, username, first_name, last_name, phone, bio, country)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [email, username, firstName, lastName, phone, bio, country]
      );

      return res.status(201).json(insertResult.rows[0]); // ✅ 201 Created
    }

    // ✅ User exists, update the profile
    const updateResult = await pool.query(
      `UPDATE user_profiles 
       SET username = $1, first_name = $2, last_name = $3, phone = $4, bio = $5, country = $6
       WHERE email = $7 RETURNING *`,
      [username, firstName, lastName, phone, bio, country, email]
    );

    res.json(updateResult.rows[0]);
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ error: "Database error" });
  }
});

export default router;
