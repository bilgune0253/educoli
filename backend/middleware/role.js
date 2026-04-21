const pool = require("../models/db");

module.exports = function (requiredRole) {
  return async (req, res, next) => {
    try {
      const user = await pool.query(
        "SELECT role FROM users WHERE id = $1",
        [req.user.id]
      );

      if (user.rows.length === 0) {
        return res.status(401).json({ error: "User not found" });
      }

      if (user.rows[0].role !== requiredRole) {
        return res.status(403).json({ error: "Access denied" });
      }

      next();
    } catch (err) {
      console.log(" ROLE ERROR:", err.message);
      res.status(500).json({ error: err.message });
    }
  };
};