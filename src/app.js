const express = require("express");
const cors = require("cors");
const authRouter = require("./routers/authRouter");
const app = express();

require("dotenv").config();

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/auth", authRouter);

app.get("/", (req, res) => {
  res.status(200).send({ message: "Server running successfully!" });
});

module.exports = app;
