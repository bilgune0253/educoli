const pool = require("../models/db");

const createNotification = async ({ user_id, title, message, type }) => {
  try {
    await pool.query(
      `INSERT INTO notifications (user_id, title, message, type)
       VALUES ($1, $2, $3, $4)`,
      [user_id, title, message, type]
    );
  } catch (err) {
    console.log("CREATE NOTIFICATION ERROR:", err.message);
  }
};

module.exports = createNotification;