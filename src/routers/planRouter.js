const express = require("express");
const { generatePlan, generatePlanFake } = require("../controllers/planController");
const { isLoggedIn } = require("../middlewares/auth");

const planRouter = express.Router();

planRouter.post("/", generatePlan);
planRouter.post("/fake", generatePlanFake);

module.exports = planRouter;
