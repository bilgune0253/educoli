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

// Бүх Learning Requests
exports.getAllLearningRequests = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        lr.*,
        u.name AS student_name,
        u.email AS student_email,
        (
          SELECT COUNT(*)::int
          FROM learning_offers lo
          WHERE lo.learning_request_id = lr.id
        ) AS offer_count,
        (
          SELECT tu.name
          FROM learning_offers lo
          JOIN users tu ON tu.id = lo.tutor_id
          WHERE lo.learning_request_id = lr.id
            AND lo.status = 'accepted'
          LIMIT 1
        ) AS selected_tutor
      FROM learning_requests lr
      JOIN users u ON u.id = lr.student_id
      ORDER BY lr.created_at DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("ADMIN LEARNING REQUESTS:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Нээлттэй хүсэлтийг админ хаах
exports.closeLearningRequest = async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE learning_requests
       SET status = 'closed'
       WHERE id = $1 AND status = 'open'
       RETURNING *`,
      [req.params.id]
    );

    if (!result.rowCount) {
      return res.status(409).json({
        error: "Request not found or cannot be closed",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("ADMIN CLOSE REQUEST:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Зөвхөн хаагдсан, чатгүй хүсэлтийг устгах
exports.deleteLearningRequest = async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const result = await client.query(
      `SELECT id
       FROM learning_requests
       WHERE id = $1 AND status = 'closed'
       FOR UPDATE`,
      [req.params.id]
    );

    if (!result.rowCount) {
      await client.query("ROLLBACK");
      return res.status(409).json({
        error: "Close the request before deleting it",
      });
    }

    const chat = await client.query(
      `SELECT id FROM conversations
       WHERE learning_request_id = $1`,
      [req.params.id]
    );

    if (chat.rowCount) {
      await client.query("ROLLBACK");
      return res.status(409).json({
        error: "Cannot delete a request with chat history",
      });
    }

    await client.query(
      `DELETE FROM learning_requests
       WHERE id = $1`,
      [req.params.id]
    );

    await client.query("COMMIT");

    res.json({ message: "Learning request deleted" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("ADMIN DELETE REQUEST:", error);
    res.status(500).json({ error: "Server error" });
  } finally {
    client.release();
  }
};
