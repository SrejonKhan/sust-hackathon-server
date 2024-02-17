const bcrypt = require("bcryptjs");
const User = require("../model/userModel");
const { successResponse, errorResponse } = require("./responseController");
const { createJSONWebToken } = require("../helper/jsonwebtoken");

// user login
const handleLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });
    if (!user) {
      return errorResponse(res, {
        statusCode: 404,
        message: "User not found!",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return errorResponse(res, {
        statusCode: 401,
        message: "Email/password did not match.",
      });
    }

    // create jwt token
    const accessToken = createJSONWebToken({ user }, process.env.JWT_ACCESS_KEY, "3000m");

    return successResponse(res, {
      statusCode: 200,
      message: "User logged in successfully.",
      payload: {
        user,
        token: accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

// user registration
const handleRegister = async (req, res, next) => {
  console.log(req.body);

  try {
    const { name, email, password, age, gender } = req.body;

    const userExist = await User.exists({ email: email });

    // check user exists or not. if user exists then throw error.
    if (userExist) {
      return errorResponse(res, {
        statusCode: 409,
        message: "User with this already exists. Please sign in.",
      });
    }

    const user = {
      name,
      email,
      password,
      age,
      gender,
    };

    await User.create(user);

    return successResponse(res, {
      statusCode: 200,
      message: `User is registered successfully.`,
      payload: { user },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { handleLogin, handleRegister };
