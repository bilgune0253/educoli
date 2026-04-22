const jwt = require("jsonwebtoken");
const pool = require("../models/db");
const transporter = require("../config/mailer");

// verification email явуулах
exports.sendVerificationEmail = async (req, res) => {
  const user_id = req.user.id;
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Хүсвэл энд зөвхөн сургуулийн domain шалгаж болно
    // жишээ:
    // if (!email.endsWith("@stud.num.edu.mn") && !email.endsWith("@num.edu.mn")) {
    //   return res.status(400).json({ error: "Use your university email" });
    // }

    const token = jwt.sign(
      { user_id, email, type: "email_verification" },
      process.env.VERIFY_EMAIL_SECRET,
      { expiresIn: "1h" }
    );

    const verifyLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

    await pool.query(
      `UPDATE users
       SET verification_email = $1
       WHERE id = $2`,
      [email, user_id]
    );

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify your university email",
      html: `
        <h2>Email Verification</h2>
        <p>Click the button below to verify your account.</p>
        <a href="${verifyLink}" style="display:inline-block;padding:12px 20px;background:#111827;color:white;text-decoration:none;border-radius:10px;">
          Verify Email
        </a>
        <p>This link expires in 1 hour.</p>
      `,
    });

    res.json({ message: "Verification email sent" });
  } catch (err) {
    console.log("SEND VERIFICATION EMAIL ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// link дээр дарсны дараах verify
exports.verifyEmail = async (req, res) => {
  const { token } = req.body;

  try {
    if (!token) {
      return res.status(400).json({ error: "Token is required" });
    }

    const decoded = jwt.verify(token, process.env.VERIFY_EMAIL_SECRET);

    if (decoded.type !== "email_verification") {
      return res.status(400).json({ error: "Invalid token type" });
    }

    await pool.query(
      `UPDATE users
       SET is_verified = TRUE,
           verification_email = $1
       WHERE id = $2`,
      [decoded.email, decoded.user_id]
    );

    res.json({ message: "Account verified successfully" });
  } catch (err) {
    console.log("VERIFY EMAIL ERROR:", err.message);
    res.status(400).json({ error: "Invalid or expired token" });
  }
};