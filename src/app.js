const express = require("express");
const cors = require("cors");
const authRouter = require("./routers/authRouter");
const { errorResponse } = require("./controllers/responseController");
const userRouter = require("./routers/userRouter");
const app = express();

require("dotenv").config();

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);

app.get("/", (req, res) => {
  res.status(200).send({ message: "Server running successfully!" });
});

app.use((err, req, res, next) => {
  return errorResponse(res, {
    statusCode: 500,
    message: "JUST A BAD DAY!",
  });
});

module.exports = app;
