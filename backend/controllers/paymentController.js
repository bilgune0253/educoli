const pool = require("../models/db");

// fake payment
exports.payForRequest = async (req, res) => {
  const { request_id } = req.body;
  const student_id = req.user.id;

  try {
    // request өөрийнх мөн эсэх
    const request = await pool.query(
      `SELECT * FROM requests WHERE id = $1 AND student_id = $2`,
      [request_id, student_id]
    );

    if (request.rows.length === 0) {
      return res.status(403).json({ error: "Not allowed" });
    }

    if (request.rows[0].status !== "accepted") {
      return res.status(400).json({ error: "Course not accepted yet" });
    }

    // update payment
    const updated = await pool.query(
      `UPDATE requests
       SET is_paid = TRUE
       WHERE id = $1
       RETURNING *`,
      [request_id]
    );

    res.json(updated.rows[0]);
  } catch (err) {
    console.log("PAYMENT ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
};