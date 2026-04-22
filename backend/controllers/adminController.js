const pool = require("../models/db");

// бүх хэрэглэгч
exports.getAllUsers = async (req, res) => {
  try {
    const users = await pool.query(
      "SELECT id, name, email, role FROM users ORDER BY id DESC"
    );
    res.json(users.rows);
  } catch (err) {
    console.log("ADMIN USERS ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// бүх course
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await pool.query(`
      SELECT courses.*, users.name AS tutor_name
      FROM courses
      LEFT JOIN users ON courses.tutor_id = users.id
      ORDER BY courses.id DESC
    `);
    res.json(courses.rows);
  } catch (err) {
    console.log("ADMIN COURSES ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// user устгах
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM users WHERE id = $1", [id]);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.log("DELETE USER ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// course устгах
exports.deleteCourse = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM courses WHERE id = $1", [id]);
    res.json({ message: "Course deleted successfully" });
  } catch (err) {
    console.log("DELETE COURSE ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// role солих
exports.updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  try {
    if (!["student", "tutor", "admin"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const updatedUser = await pool.query(
      "UPDATE users SET role = $1 WHERE id = $2 RETURNING id, name, email, role",
      [role, id]
    );

    if (updatedUser.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(updatedUser.rows[0]);
  } catch (err) {
    console.log("UPDATE ROLE ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
};