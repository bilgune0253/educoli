const pool = require("../models/db");

// 🟢 CREATE COURSE (JWT ашиглана)
exports.createCourse = async (req, res) => {
  const { title, description, price, type } = req.body;

  try {
    const tutor_id = req.user.id; // 🔥 login user-аас авна

    const newCourse = await pool.query(
      `INSERT INTO courses (title, description, price, type, tutor_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [title, description, price, type, tutor_id]
    );

    res.json(newCourse.rows[0]);
  } catch (err) {
    console.log("❌ CREATE COURSE ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// 🔵 GET ALL COURSES
exports.getCourses = async (req, res) => {
  try {
    const courses = await pool.query(`
      SELECT courses.*, users.name AS tutor_name
      FROM courses
      JOIN users ON courses.tutor_id = users.id
      ORDER BY courses.id DESC
    `);

    res.json(courses.rows);
  } catch (err) {
    console.log("❌ GET COURSES ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// 🟡 GET SINGLE COURSE
exports.getCourseById = async (req, res) => {
  const { id } = req.params;

  try {
    const course = await pool.query(
      `SELECT * FROM courses WHERE id=$1`,
      [id]
    );

    if (course.rows.length === 0) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.json(course.rows[0]);
  } catch (err) {
    console.log("❌ GET COURSE ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// 🔴 DELETE COURSE (optional)
exports.deleteCourse = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM courses WHERE id=$1", [id]);
    res.json({ message: "Course deleted" });
  } catch (err) {
    console.log("❌ DELETE ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
};