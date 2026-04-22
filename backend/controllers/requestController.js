const pool = require("../models/db");

// Student request илгээх
exports.createRequest = async (req, res) => {
  const { course_id } = req.body;
  const student_id = req.user.id;

  try {
    // duplicate request шалгах
    const existingRequest = await pool.query(
      "SELECT * FROM requests WHERE student_id = $1 AND course_id = $2",
      [student_id, course_id]
    );

    if (existingRequest.rows.length > 0) {
      return res.status(400).json({ error: "You already requested this course" });
    }

    const newRequest = await pool.query(
      `INSERT INTO requests (student_id, course_id)
       VALUES ($1, $2)
       RETURNING *`,
      [student_id, course_id]
    );

    res.json(newRequest.rows[0]);
  } catch (err) {
    console.log(" CREATE REQUEST ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Student өөрийн request-үүдээ харах
exports.getMyRequests = async (req, res) => {
  const student_id = req.user.id;

  try {
    const requests = await pool.query(
      `SELECT 
          requests.id,
          requests.status,
          courses.id AS course_id,
          courses.title,
          courses.description,
          courses.type,
          courses.schedule,
          courses.grade,
          courses.proof_image,
          CASE
            WHEN requests.status = 'accepted' THEN courses.meeting_link
            ELSE NULL
          END AS meeting_link,
          users.name AS tutor_name
       FROM requests
       JOIN courses ON requests.course_id = courses.id
       JOIN users ON courses.tutor_id = users.id
       WHERE requests.student_id = $1
       ORDER BY requests.id DESC`,
      [student_id]
    );

    res.json(requests.rows);
  } catch (err) {
    console.log(" GET MY REQUESTS ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Tutor өөрийн course-ууд дээр ирсэн request-үүдийг харах
exports.getRequestsForTutor = async (req, res) => {
  const tutor_id = req.user.id;

  try {
    const requests = await pool.query(
      `SELECT requests.*, courses.title, student.name AS student_name, student.email AS student_email
       FROM requests
       JOIN courses ON requests.course_id = courses.id
       JOIN users AS student ON requests.student_id = student.id
       WHERE courses.tutor_id = $1
       ORDER BY requests.id DESC`,
      [tutor_id]
    );

    res.json(requests.rows);
  } catch (err) {
    console.log(" GET TUTOR REQUESTS ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Tutor request status update хийнэ
exports.updateRequestStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const tutor_id = req.user.id;

  try {
    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    // request тухайн tutor-ийн course мөн эсэхийг шалгах
    const requestCheck = await pool.query(
      `SELECT requests.id
       FROM requests
       JOIN courses ON requests.course_id = courses.id
       WHERE requests.id = $1 AND courses.tutor_id = $2`,
      [id, tutor_id]
    );

    if (requestCheck.rows.length === 0) {
      return res.status(403).json({ error: "Not allowed" });
    }

    const updatedRequest = await pool.query(
      `UPDATE requests
       SET status = $1
       WHERE id = $2
       RETURNING *`,
      [status, id]
    );

    res.json(updatedRequest.rows[0]);
  } catch (err) {
    console.log(" UPDATE REQUEST STATUS ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
};