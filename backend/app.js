const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("API working 🚀");
});

// DB
const pool = require("./models/db");

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.log("DB ERROR", err);
  } else {
    console.log("DB CONNECTED", res.rows);
  }
});

// ROUTES
const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

app.listen(5001, () => {
  console.log("Server running on port 5001");
});

const courseRoutes = require("./routes/courseRoutes");

app.use("/api/courses", courseRoutes);