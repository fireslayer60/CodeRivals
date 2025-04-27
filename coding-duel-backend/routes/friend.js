import express from "express";
import pool from "../db.js";

const router = express.Router();

router.get("/search-user",async (req,res)=>{
    const { username } = req.query;

  try {
    const result = await pool.query(
      "SELECT username FROM users WHERE username ILIKE $1",
      [`%${username}%`]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error searching users" });
  }
})


export default router;