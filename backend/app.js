const express = require("express");
const cors = require("cors");

const app = express();

//  Middleware
app.use(cors());
app.use(express.json());

//  Test route
app.get("/", (req, res) => {
  res.send("API working ");
});

//  DB connection шалгах
const pool = require("./models/db");

pool.query("SELECT NOW()")
  .then(res => {
    console.log("DB CONNECTED ", res.rows[0]);
  })
  .catch(err => {
    console.log("DB ERROR ", err.message);
  });

//  ROUTES
const userRoutes = require("./routes/userRoutes");
const courseRoutes = require("./routes/courseRoutes");
const requestRoutes = require("./routes/requestRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const adminRoutes = require("./routes/adminRoutes");

app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);


// 404 handler (route олдохгүй үед)
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler (optional)
app.use((err, req, res, next) => {
  console.log("GLOBAL ERROR:", err.message);
  res.status(500).json({ error: "Server error" });
});

const PORT = 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} `);
});