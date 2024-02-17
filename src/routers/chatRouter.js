const express = require("express");
const { gogginsChat, antiGogginsChat } = require("../controllers/chatController");
const { isLoggedIn } = require("../middlewares/auth");

const chatRouter = express.Router();

chatRouter.post("/goggins", gogginsChat);
chatRouter.post("/anti-goggins", antiGogginsChat);

module.exports = chatRouter;
