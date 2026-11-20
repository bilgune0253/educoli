
const pool = require("../models/db");

// Зөвхөн тухайн хоёр оюутан чатад хандах эрхтэй
async function findConversation(client, id, userId) {
  const result = await client.query(
    `SELECT *
     FROM conversations
     WHERE id = $1
       AND (student_id = $2 OR tutor_id = $2)`,
    [id, userId]
  );

  return result.rows[0] || null;
}

// 1. Миний бүх чат
exports.getMyChats = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         c.*,
         s.name AS student_name,
         t.name AS tutor_name,
         lr.subject,
         lr.topic,
         (
           SELECT m.content
           FROM messages m
           WHERE m.conversation_id = c.id
           ORDER BY m.created_at DESC, m.id DESC
           LIMIT 1
         ) AS last_message,
         (
           SELECT COUNT(*)::int
           FROM messages m
           WHERE m.conversation_id = c.id
             AND m.sender_id <> $1
             AND m.is_read = FALSE
         ) AS unread_count
       FROM conversations c
       JOIN users s ON s.id = c.student_id
       JOIN users t ON t.id = c.tutor_id
       JOIN learning_requests lr
         ON lr.id = c.learning_request_id
       WHERE c.student_id = $1
          OR c.tutor_id = $1
       ORDER BY c.created_at DESC`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("GET CHATS:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// 2. Нэг чатын мэдээлэл
exports.getChat = async (req, res) => {
  try {
    const chat = await findConversation(
      pool,
      req.params.id,
      req.user.id
    );

    if (!chat) {
      return res.status(404).json({
        error: "Chat not found",
      });
    }

    res.json(chat);
  } catch (error) {
    console.error("GET CHAT:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// 3. Мессежүүдийг унших
exports.getMessages = async (req, res) => {
  try {
    const chat = await findConversation(
      pool,
      req.params.id,
      req.user.id
    );

    if (!chat) {
      return res.status(404).json({
        error: "Chat not found",
      });
    }

    const result = await pool.query(
      `SELECT
         m.id,
         m.conversation_id,
         m.sender_id,
         m.content,
         m.is_read,
         m.created_at,
         u.name AS sender_name
       FROM messages m
       JOIN users u ON u.id = m.sender_id
       WHERE m.conversation_id = $1
       ORDER BY m.created_at ASC, m.id ASC
       LIMIT 200`,
      [chat.id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("GET MESSAGES:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// 4. Шинэ мессеж илгээх
exports.sendMessage = async (req, res) => {
  const { content } = req.body;

  if (
    typeof content !== "string" ||
    !content.trim() ||
    content.trim().length > 2000
  ) {
    return res.status(400).json({
      error: "Message must contain 1-2000 characters",
    });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const result = await client.query(
      `SELECT *
       FROM conversations
       WHERE id = $1
         AND (student_id = $2 OR tutor_id = $2)
       FOR UPDATE`,
      [req.params.id, req.user.id]
    );

    const chat = result.rows[0];

    if (!chat) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        error: "Chat not found",
      });
    }

    if (chat.status !== "active") {
      await client.query("ROLLBACK");
      return res.status(403).json({
        error: "This chat is archived",
      });
    }

    const message = await client.query(
      `INSERT INTO messages
         (conversation_id, sender_id, content)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [chat.id, req.user.id, content.trim()]
    );

    await client.query("COMMIT");

    res.status(201).json(message.rows[0]);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("SEND MESSAGE:", error);
    res.status(500).json({ error: "Server error" });
  } finally {
    client.release();
  }
};

// 5. Мессеж уншсан гэж тэмдэглэх
exports.markAsRead = async (req, res) => {
  try {
    const chat = await findConversation(
      pool,
      req.params.id,
      req.user.id
    );

    if (!chat) {
      return res.status(404).json({
        error: "Chat not found",
      });
    }

    await pool.query(
      `UPDATE messages
       SET is_read = TRUE
       WHERE conversation_id = $1
         AND sender_id <> $2
         AND is_read = FALSE`,
      [chat.id, req.user.id]
    );

    res.json({ success: true });
  } catch (error) {
    console.error("MARK READ:", error);
    res.status(500).json({ error: "Server error" });
  }
};
