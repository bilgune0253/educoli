const pool = require("../models/db");

// CREATE COURSE
exports.createCourse = async (req, res) => {
  const { title, description, price, type, tutor_id } = req.body;

  try {
    const newCourse = await pool.query(
      `INSERT INTO courses (title, description, price, type, tutor_id)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [title, description, price, type, tutor_id]
    );

    res.json(newCourse.rows[0]);
  } catch (err) {
    console.log("❌ CREATE COURSE ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// GET ALL COURSES
exports.getCourses = async (req, res) => {
  try {
    const courses = await pool.query("SELECT * FROM courses");
    res.json(courses.rows);
  } catch (err) {
    console.log("❌ GET COURSES ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
};