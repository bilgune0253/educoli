const pool = require("../models/db");

// Review нэмэх
exports.createReview = async (req, res) => {
  const { tutor_id, rating, comment } = req.body;
  const student_id = req.user.id;

  try {
    if (student_id === tutor_id) {
      return res.status(400).json({ error: "You cannot review yourself" });
    }

    const newReview = await pool.query(
      `INSERT INTO reviews (student_id, tutor_id, rating, comment)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [student_id, tutor_id, rating, comment]
    );

    res.json(newReview.rows[0]);
  } catch (err) {
    console.log(" CREATE REVIEW ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Tutor-ийн review-ууд
exports.getTutorReviews = async (req, res) => {
  const { tutor_id } = req.params;

  try {
    const reviews = await pool.query(
      `SELECT 
         reviews.*,
         users.name AS student_name,
         users.student_code AS student_code,
         users.is_verified AS student_is_verified
       FROM reviews
       JOIN users ON reviews.student_id = users.id
       WHERE reviews.tutor_id = $1
       ORDER BY reviews.id DESC`,
      [tutor_id]
    );

    res.json(reviews.rows);
  } catch (err) {
    console.log(" GET REVIEWS ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
};