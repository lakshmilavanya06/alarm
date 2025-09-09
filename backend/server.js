const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// 🔑 MongoDB connection (replace with your real MongoDB URI) 
const MONGODB_URI = "mongodb+srv://lakshmilavanyagorle_db_user:ujdmmGM0K9jNBlIE@cluster0.gi6oxkm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err));

// Schema & Model
const SessionSchema = new mongoose.Schema({
  userId: String,
  topic: String,
  subject: String,
  timestamp: { type: Date, default: Date.now },
  duration: Number
});

const Session = mongoose.model("Session", SessionSchema);

// Routes

// Save a session
app.post("/api/sessions", async (req, res) => {
  try {
    const newSession = new Session(req.body);
    await newSession.save();
    res.json({ success: true, session: newSession });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get sessions by userId
app.get("/api/sessions/:userId", async (req, res) => {
  try {
    const sessions = await Session.find({ userId: req.params.userId });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Delete all sessions of a user (optional reset)
app.delete("/api/sessions/:userId", async (req, res) => {
  try {
    await Session.deleteMany({ userId: req.params.userId });
    res.json({ success: true, message: "Sessions cleared" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
