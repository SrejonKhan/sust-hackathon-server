const express = require("express");
const { getUserById, deleteUserById } = require("../controllers/userController");
const { isLoggedIn } = require("../middlewares/auth");

const userRouter = express.Router();

// GET single user
userRouter.get("/:id", isLoggedIn, getUserById);

// DELETE single user
userRouter.delete("/:id", isLoggedIn, deleteUserById);

module.exports = userRouter;
