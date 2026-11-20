
const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const chat = require("../controllers/chatController");

// Бүх чат API-д нэвтрэлт шаардлагатай
router.use(auth);

// Миний чатууд
router.get("/", chat.getMyChats);

// Нэг чат
router.get("/:id", chat.getChat);

// Мессежүүд
router.get("/:id/messages", chat.getMessages);

// Мессеж илгээх
router.post("/:id/messages", chat.sendMessage);

// Уншсан гэж тэмдэглэх
router.patch("/:id/read", chat.markAsRead);

module.exports = router;
