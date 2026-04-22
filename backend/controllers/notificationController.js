const pool = require("../models/db");

// хэрэглэгчийн notification-ууд
exports.getMyNotifications = async (req, res) => {
  const user_id = req.user.id;

  try {
    const notifications = await pool.query(
      `SELECT * 
       FROM notifications
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [user_id]
    );

    res.json(notifications.rows);
  } catch (err) {
    console.log("GET NOTIFICATIONS ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// unread тоо
exports.getUnreadCount = async (req, res) => {
  const user_id = req.user.id;

  try {
    const result = await pool.query(
      `SELECT COUNT(*) FROM notifications
       WHERE user_id = $1 AND is_read = FALSE`,
      [user_id]
    );

    res.json({ unreadCount: Number(result.rows[0].count) });
  } catch (err) {
    console.log("GET UNREAD COUNT ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// нэг notification уншсан болгох
exports.markAsRead = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;

  try {
    const result = await pool.query(
      `UPDATE notifications
       SET is_read = TRUE
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
      [id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.log("MARK AS READ ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// бүгдийг уншсан болгох
exports.markAllAsRead = async (req, res) => {
  const user_id = req.user.id;

  try {
    await pool.query(
      `UPDATE notifications
       SET is_read = TRUE
       WHERE user_id = $1`,
      [user_id]
    );

    res.json({ message: "All notifications marked as read" });
  } catch (err) {
    console.log("MARK ALL AS READ ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
};