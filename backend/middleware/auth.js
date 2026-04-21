const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("Authorization");

  // token байхгүй
  if (!token) {
    return res.status(401).json({ error: "No token, access denied" });
  }

  try {
    const verified = jwt.verify(token, "SECRET_KEY");
    req.user = verified; // { id: ... }
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid token" });
  }
};