const User = require("../model/userModel");
const { successResponse, errorResponse } = require("./responseController");
const { findWithId } = require("../service/findItem");

// get single user find by id
const getUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (req.user?._id !== id) {
      return errorResponse(res, {
        statusCode: 400,
        message: "Unauthenticated!",
      });
    }
    const options = { password: 0 };
    const user = await findWithId(User, id, options);
    return successResponse(res, {
      statusCode: 200,
      message: "User get successfully",
      payload: { user },
    });
  } catch (error) {
    next(error);
  }
};

// get single user find by id
const deleteUserById = async (req, res, next) => {
  try {
    const id = req.params.id;

    await User.findByIdAndDelete({
      _id: id,
      isAdmin: false,
    });

    return successResponse(res, {
      statusCode: 200,
      message: "User delete successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserById,
  deleteUserById,
};
