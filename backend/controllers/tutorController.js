const pool = require("../models/db");

// бүх tutor-ууд
exports.getAllTutors = async (req, res) => {
    try {
        const tutors = await pool.query(`
      SELECT 
        users.id,
        users.name,
        users.email,
        users.student_code,
        COUNT(DISTINCT courses.id) AS total_courses,
        COALESCE(AVG(reviews.rating), 0) AS average_rating
      FROM users
      LEFT JOIN courses ON users.id = courses.tutor_id
      LEFT JOIN reviews ON users.id = reviews.tutor_id
      WHERE users.role = 'tutor'
      GROUP BY users.id
      ORDER BY users.id DESC
    `);

        res.json(tutors.rows);
    } catch (err) {
        console.log("GET ALL TUTORS ERROR:", err.message);
        res.status(500).json({ error: err.message });
    }
};

// нэг tutor profile
exports.getTutorProfile = async (req, res) => {
    const { id } = req.params;

    try {
        const tutorResult = await pool.query(
            `SELECT id, name, email, role, student_code
   FROM users
   WHERE id = $1 AND role = 'tutor'`,
            [id]
        );

        if (tutorResult.rows.length === 0) {
            return res.status(404).json({ error: "Tutor not found" });
        }

        const tutor = tutorResult.rows[0];

        const coursesResult = await pool.query(
            `SELECT *
       FROM courses
       WHERE tutor_id = $1
       ORDER BY created_at DESC NULLS LAST, id DESC`,
            [id]
        );

        const reviewsResult = await pool.query(
            `SELECT reviews.*, users.name AS student_name
       FROM reviews
       JOIN users ON reviews.student_id = users.id
       WHERE reviews.tutor_id = $1
       ORDER BY reviews.created_at DESC, reviews.id DESC`,
            [id]
        );

        const avgResult = await pool.query(
            `SELECT COALESCE(AVG(rating), 0) AS average_rating,
              COUNT(*) AS total_reviews
       FROM reviews
       WHERE tutor_id = $1`,
            [id]
        );

        res.json({
            tutor,
            courses: coursesResult.rows,
            reviews: reviewsResult.rows,
            stats: {
                totalCourses: coursesResult.rows.length,
                averageRating: Number(avgResult.rows[0].average_rating).toFixed(1),
                totalReviews: Number(avgResult.rows[0].total_reviews),
            },
        });
    } catch (err) {
        console.log("GET TUTOR PROFILE ERROR:", err.message);
        res.status(500).json({ error: err.message });
    }
};