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
  const {toUsername,fromUsername} = req.body;
  try{
    const isFriend = await pool.query(
      "SELECT user1_id,user2_id,status FROM friends WHERE (user1_id =$1 OR user2_id = $1) AND (user1_id =$2 OR user2_id = $2)",[toUsername,fromUsername]
    );
    
    if(isFriend.rows.length>0){
      return res.status(409).json({ error: "Request already sent or already friends" });
    }
    else{
      const status = "pending"
      const friendReq = await pool.query(
        "INSERT INTO friends (user1_id, user2_id, status) VALUES ($1, $2, $3) ",
        [toUsername, fromUsername, status]
      );
      res.status(201).json({
        message: "Freind req sent",
        
      });
    }

  }
  catch (err){
    console.log(err);
  }
})

router.get("/requests/:username",async(req,res)=>{
  const { username } = req.params;
  try {
    const result = await pool.query(`SELECT user1_id  FROM friends  WHERE user2_id = $1 AND status = 'pending'`,
      [username]
    );
    const result2 = await pool.query(`SELECT 
                                  CASE 
                                    WHEN user1_id = $1 THEN user2_id
                                    WHEN user2_id = $1 THEN user1_id
                                  END AS friend
                                FROM friends
                                WHERE status = 'accepted' AND (user1_id = $1 OR user2_id = $1);
                                `,
                                      [username]
                                    );

    res.json({ requests: result.rows, friends : result2.rows});
  } catch (err) {
    console.error("Error fetching friend requests:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }

})

router.post("/reject", async (req, res) => {
  const { user1_id, user2_id } = req.body;

  try {
    const result = await pool.query(
      `DELETE FROM friends 
       WHERE (user1_id = $1 AND user2_id) = $2 OR (user1_id = $2 AND user2_id = $1)`,
      [user1_id, user2_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "No pending request to reject." });
    }

    return res.status(200).json({ message: "Friend request rejected." });
  } catch (err) {
    console.error("Error rejecting request:", err.message);
    if (!res.headersSent) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }
});


router.post("/accept", async (req, res) => {
  const { user1_id, user2_id } = req.body; // e.g. test1 and test2

  try {
    const result = await pool.query(
      `UPDATE friends SET status = 'accepted' 
       WHERE user1_id = $1 AND user2_id = $2 AND status = 'pending'`,
      [user1_id, user2_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "No pending request found." });
    }

    return res.status(200).json({ message: "Friend request accepted." });
  } catch (err) {
    console.error("Error accepting request:", err.message);
    if (!res.headersSent) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }
});

  



export default router;