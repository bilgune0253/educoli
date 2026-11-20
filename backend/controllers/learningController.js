
const pool = require("../models/db");
const notify = require("../utils/createNotification");

const validText = (value, max) =>
    typeof value === "string" &&
    value.trim().length > 0 &&
    value.trim().length <= max;

const fail = (res, error) => {
    console.error("LEARNING REQUEST:", error);
    return res.status(500).json({ error: "Server error" });
};

// Бүх суралцах хүсэлт
exports.list = async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT lr.*, u.name AS student_name,
        u.is_verified AS student_is_verified,
        (
          SELECT COUNT(*)::int
          FROM learning_offers o
          WHERE o.learning_request_id = lr.id
        ) AS offer_count
      FROM learning_requests lr
      JOIN users u ON u.id = lr.student_id
      ORDER BY lr.created_at DESC
    `);

        res.json(result.rows);
    } catch (error) {
        fail(res, error);
    }
};

// Суралцагч шинэ хүсэлт нийтлэх
exports.create = async (req, res) => {
    const {
        subject,
        topic,
        description,
        preferred_format = "either",
        budget = null,
    } = req.body;

    if (
        !validText(subject, 120) ||
        !validText(topic, 200) ||
        !validText(description, 3000) ||
        !["online", "offline", "either"].includes(preferred_format) ||
        (budget !== null &&
            budget !== "" &&
            (!Number.isFinite(Number(budget)) || Number(budget) < 0))
    ) {
        return res.status(400).json({
            error: "Invalid learning request fields",
        });
    }

    try {
        const result = await pool.query(
            `INSERT INTO learning_requests
       (student_id, subject, topic, description,
        preferred_format, budget)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
            [
                req.user.id,
                subject.trim(),
                topic.trim(),
                description.trim(),
                preferred_format,
                budget === "" ? null : budget,
            ]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        fail(res, error);
    }
};

// Нэг хүсэлтийн дэлгэрэнгүй
exports.detail = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT lr.*, u.name AS student_name
       FROM learning_requests lr
       JOIN users u ON u.id = lr.student_id
       WHERE lr.id = $1`,
            [req.params.id]
        );

        if (!result.rowCount) {
            return res.status(404).json({
                error: "Request not found",
            });
        }

        const offers = await pool.query(
            `SELECT o.id, o.tutor_id, o.message,
              o.proposed_price, o.status, o.created_at,
              u.name AS tutor_name,
              u.is_verified AS tutor_is_verified
       FROM learning_offers o
       JOIN users u ON u.id = o.tutor_id
       WHERE o.learning_request_id = $1
       ORDER BY o.created_at DESC`,
            [req.params.id]
        );

        res.json({
            ...result.rows[0],
            offers: offers.rows,
        });
    } catch (error) {
        fail(res, error);
    }
};

// Багш заах санал илгээх
exports.offer = async (req, res) => {
    const { message, proposed_price } = req.body;

    if (
        !validText(message, 2000) ||
        proposed_price === undefined ||
        proposed_price === null ||
        proposed_price === "" ||
        !Number.isFinite(Number(proposed_price)) ||
        Number(proposed_price) < 0
    ) {
        return res.status(400).json({
            error: "Invalid offer",
        });
    }

    try {
        const request = await pool.query(
            "SELECT * FROM learning_requests WHERE id = $1",
            [req.params.id]
        );

        if (!request.rowCount) {
            return res.status(404).json({
                error: "Request not found",
            });
        }

        if (request.rows[0].status !== "open") {
            return res.status(409).json({
                error: "Request is not open",
            });
        }

        if (String(request.rows[0].student_id) === String(req.user.id)) {
            return res.status(403).json({
                error: "Cannot offer on your own request",
            });
        }

        const result = await pool.query(
            `INSERT INTO learning_offers
       (learning_request_id, tutor_id, message, proposed_price)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (learning_request_id, tutor_id)
       DO NOTHING
       RETURNING *`,
            [
                req.params.id,
                req.user.id,
                message.trim(),
                proposed_price,
            ]
        );

        if (!result.rowCount) {
            return res.status(409).json({
                error: "You already submitted an offer",
            });
        }

        await notify({
            user_id: request.rows[0].student_id,
            title: "New tutor offer",
            message: `A tutor offered to teach ${request.rows[0].topic}`,
            type: "learning_offer",
        });

        res.status(201).json(result.rows[0]);
    } catch (error) {
        fail(res, error);
    }
};

// Суралцагч багшийн саналыг зөвшөөрөх
exports.accept = async (req, res) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const request = await client.query(
            "SELECT * FROM learning_requests WHERE id = $1 FOR UPDATE",
            [req.params.id]
        );

        if (!request.rowCount) {
            await client.query("ROLLBACK");
            return res.status(404).json({
                error: "Request not found",
            });
        }

        if (String(request.rows[0].student_id) !== String(req.user.id)) {
            await client.query("ROLLBACK");
            return res.status(403).json({
                error: "Not your request",
            });
        }

        if (request.rows[0].status !== "open") {
            await client.query("ROLLBACK");
            return res.status(409).json({
                error: "Already matched or closed",
            });
        }

        const selected = await client.query(
            `UPDATE learning_offers
       SET status = 'accepted'
       WHERE id = $1
         AND learning_request_id = $2
         AND status = 'pending'
       RETURNING *`,
            [req.params.offerId, req.params.id]
        );

        if (!selected.rowCount) {
            await client.query("ROLLBACK");
            return res.status(404).json({
                error: "Offer not available",
            });
        }

        await client.query(
            `UPDATE learning_offers
       SET status = 'rejected'
       WHERE learning_request_id = $1
         AND id <> $2
         AND status = 'pending'`,
            [req.params.id, req.params.offerId]
        );

        await client.query(
            `UPDATE learning_requests
       SET status = 'matched'
       WHERE id = $1`,
            [req.params.id]
        );

        const conversation = await client.query(
            `INSERT INTO conversations
     (learning_request_id, student_id, tutor_id)
   VALUES ($1, $2, $3)
   ON CONFLICT (learning_request_id)
   DO NOTHING
   RETURNING id`,
            [
                req.params.id,
                request.rows[0].student_id,
                selected.rows[0].tutor_id,
            ]
        );

        if (!conversation.rowCount) {
            throw new Error("Conversation creation failed");
        }

        await client.query("COMMIT");

        await notify({
            user_id: selected.rows[0].tutor_id,
            title: "Offer accepted",
            message: `Your offer for ${request.rows[0].topic} was accepted`,
            type: "learning_offer_accepted",
        });

        res.json(selected.rows[0]);
    } catch (error) {
        await client.query("ROLLBACK");
        fail(res, error);
    } finally {
        client.release();
    }
};

// Суралцагч өөрийн хүсэлтийг хаах
exports.close = async (req, res) => {
    try {
        const result = await pool.query(
            `UPDATE learning_requests
       SET status = 'closed'
       WHERE id = $1
         AND student_id = $2
         AND status = 'open'
       RETURNING *`,
            [req.params.id, req.user.id]
        );

        if (!result.rowCount) {
            return res.status(404).json({
                error: "Open request not found",
            });
        }

        res.json(result.rows[0]);
    } catch (error) {
        fail(res, error);
    }
};

exports.getMyLearningRequests = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         lr.*,
         (
           SELECT COUNT(*)::int
           FROM learning_offers lo
           WHERE lo.learning_request_id = lr.id
         ) AS offer_count,
         (
           SELECT u.name
           FROM learning_offers lo
           JOIN users u ON u.id = lo.tutor_id
           WHERE lo.learning_request_id = lr.id
             AND lo.status = 'accepted'
           LIMIT 1
         ) AS selected_tutor,
         (
           SELECT c.id
           FROM conversations c
           WHERE c.learning_request_id = lr.id
           LIMIT 1
         ) AS conversation_id
       FROM learning_requests lr
       WHERE lr.student_id = $1
       ORDER BY lr.created_at DESC`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("MY LEARNING REQUESTS:", error);
    res.status(500).json({
      error: "Failed to load learning requests",
    });
  }
};


// 1. Багш сургалт дууссаныг мэдэгдэх
exports.requestCompletion = async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const result = await client.query(
      `SELECT lr.id, lr.status, lo.tutor_id
       FROM learning_requests lr
       JOIN learning_offers lo
         ON lo.learning_request_id = lr.id
        AND lo.status = 'accepted'
       WHERE lr.id = $1
       FOR UPDATE OF lr`,
      [req.params.id]
    );

    const request = result.rows[0];

    if (!request) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        error: "Accepted learning request not found",
      });
    }

    if (String(request.tutor_id) !== String(req.user.id)) {
      await client.query("ROLLBACK");
      return res.status(403).json({
        error: "Only the selected tutor can finish this lesson",
      });
    }

    if (request.status !== "matched") {
      await client.query("ROLLBACK");
      return res.status(409).json({
        error: "Lesson is not in matched status",
      });
    }

    const updated = await client.query(
      `UPDATE learning_requests
       SET status = 'completion_pending',
           completion_requested_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [request.id]
    );

    await client.query("COMMIT");
    res.json(updated.rows[0]);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("REQUEST COMPLETION:", error);
    res.status(500).json({ error: "Server error" });
  } finally {
    client.release();
  }
};

// 2. Суралцагч сургалт дууссаныг баталгаажуулах
exports.confirmCompletion = async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const result = await client.query(
      `SELECT *
       FROM learning_requests
       WHERE id = $1
       FOR UPDATE`,
      [req.params.id]
    );

    const request = result.rows[0];

    if (!request) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        error: "Learning request not found",
      });
    }

    if (String(request.student_id) !== String(req.user.id)) {
      await client.query("ROLLBACK");
      return res.status(403).json({
        error: "Only the student can confirm completion",
      });
    }

    if (request.status !== "completion_pending") {
      await client.query("ROLLBACK");
      return res.status(409).json({
        error: "No pending completion request",
      });
    }

    const updated = await client.query(
      `UPDATE learning_requests
       SET status = 'completed',
           completed_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [request.id]
    );

    // Баталгаажсаны дараа чат архивлагдана.
    await client.query(
      `UPDATE conversations
       SET status = 'archived',
           archived_at = NOW()
       WHERE learning_request_id = $1
         AND status = 'active'`,
      [request.id]
    );

    await client.query("COMMIT");
    res.json(updated.rows[0]);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("CONFIRM COMPLETION:", error);
    res.status(500).json({ error: "Server error" });
  } finally {
    client.release();
  }
};

// 3. Суралцагч дууссаныг зөвшөөрөхгүй байх
exports.disputeCompletion = async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const result = await client.query(
      `SELECT *
       FROM learning_requests
       WHERE id = $1
       FOR UPDATE`,
      [req.params.id]
    );

    const request = result.rows[0];

    if (!request) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        error: "Learning request not found",
      });
    }

    if (String(request.student_id) !== String(req.user.id)) {
      await client.query("ROLLBACK");
      return res.status(403).json({
        error: "Only the student can dispute completion",
      });
    }

    if (request.status !== "completion_pending") {
      await client.query("ROLLBACK");
      return res.status(409).json({
        error: "No pending completion request",
      });
    }

    const updated = await client.query(
      `UPDATE learning_requests
       SET status = 'disputed',
           disputed_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [request.id]
    );

    await client.query("COMMIT");
    res.json(updated.rows[0]);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("DISPUTE COMPLETION:", error);
    res.status(500).json({ error: "Server error" });
  } finally {
    client.release();
  }
};
