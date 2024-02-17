const express = require("express");
const { generatePlan } = require("../controllers/planController");
const { isLoggedIn } = require("../middlewares/auth");

const planRouter = express.Router();

// GET single user
planRouter.post("/", generatePlan);

module.exports = planRouter;
