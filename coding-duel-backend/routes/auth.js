import express from "express";

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  // Basic check for now (we will validate properly later)
  if (!username || !email || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }

  res.status(200).json({ message: "Signup route works!" });
});

export default router;
