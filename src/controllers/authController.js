// user login
const handleLogin = async (req, res, next) => {
  try {
    res.send("LOGIN");
  } catch (error) {
    next(error);
  }
};

// user registration
const handleRegister = async (req, res, next) => {
  try {
    res.send("REGISTER");
  } catch (error) {
    next(error);
  }
};

module.exports = { handleLogin, handleRegister };
