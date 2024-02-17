const jwt = require("jsonwebtoken");
const { errorResponse } = require("../controllers/responseController");

const isLoggedIn = (req, res, next) => {
  try {
    const token = req.header("token");
    if (!token) {
      return errorResponse(res, {
        statusCode: 401,
        message: "Access Token not found!",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_KEY);

    if (!decoded) {
      return errorResponse(res, {
        statusCode: 401,
        message: "Invalid Access Token. Please login again.",
      });
    }

    req.user = decoded.user;

    next();
  } catch (error) {
    return next(error);
  }
};

module.exports = { isLoggedIn };
