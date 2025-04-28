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

router.post("/send-friend-request", async (req,res)=>{
  const {toUserName,fromUserName} = req.body;
  try{
    const isFriend = await pool.query(
      "SELECT user1_id,user2_id,status WHERE (user1_id =$1 OR user2_id = $1) AND (user1_id =$2 OR user2_id = $2)",[toUserName,fromUserName]
    );
    console.log(isFriend);
  }
  catch (err){
    console.log(err);
  }
})


export default router;