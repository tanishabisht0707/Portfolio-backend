const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();

// 🔐 CORS CONFIG (IMPORTANT)
app.use(cors({
  origin: "https://tanisha-bisht.netlify.app",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
  credentials: true
}));

// 🧠 Handle preflight requests
app.options("*", cors());

// 📦 Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 📝 Logging
app.use((req, res, next) => {
  console.log(`Request from ${req.headers.origin} → ${req.method} ${req.path}`);
  next();
});

// 🟢 Health check
app.get("/", (req, res) => {
  res.send("Portfolio backend is running 🚀");
});

// 📩 Contact API
app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: email,
      to: process.env.EMAIL_USER,
      subject: `Portfolio Contact: ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`
    });

    res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ success: false, message: "Email failed" });
  }
});

// 🚀 Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
