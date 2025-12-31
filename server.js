const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();

// 🔑 VERY IMPORTANT FOR RENDER
app.set("trust proxy", 1);

// 🛡 CORS MUST BE FIRST
app.use(cors({
  origin: "https://tanisha-bisht.netlify.app",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
  credentials: true
}));

app.options("*", cors());
// 👇 ADD THIS BLOCK HERE
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "https://tanisha-bisht.netlify.app");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});
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
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `Portfolio Contact: ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`
    });

    return res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Email error:", error.message);
    return res.status(500).json({ success: false, message: "Email service failed on server" });
  }
});

// 🚀 Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
