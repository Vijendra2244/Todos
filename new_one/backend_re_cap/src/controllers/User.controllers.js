const { Black } = require("../modals/BlackList.modals");
const { User } = require("../modals/User.modals");
const validator = require("validator");

// user registration success fully with checked
const UserRegistration = async (req, res) => {
  const { firstName, lastName, password, age, email } = req.body;

  const UserExists = await User.findOne({ email: email });

  if (UserExists) {
    return res
      .status(400)
      .send({ status: "fail", msg: "With this email user is already exists" });
  }
  const emailChecked = validator.isEmail(email);
  const passwordChecked = validator.isStrongPassword(password);
  if (!emailChecked) {
    return res.status(400).send({
      status: "fail",
      msg: "Invalid email",
    });
  }

  if (!passwordChecked) {
    return res.status(400).send({
      status: "fail",
      msg: " Password contains minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1",
    });
  }
  const userCreation = new User({
    firstName,
    lastName,
    password,
    age,
    email,
  });

  userCreation.save();
  return res.status(200).send({
    status: "success",
    msg: "User registered successfully",
    user: userCreation,
  });
};

const UserLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);
    if (!email || !password) {
      return res.status(400).send({
        status: "fail",
        msg: "Email or password is required to login",
      });
    }
    const UserAccess = await User.findOne({ email });
    const passwordChecking = await UserAccess.VerifyPassword(password);
    if (!passwordChecking) {
      return res.status(400).send({
        status: "fail",
        msg: "User is not found with this credentials",
      });
    }
    if (!UserAccess) {
      return res.status(400).send({
        status: "fail",
        msg: "User is not found with this credentials",
      });
    }
    const access_token = await UserAccess.generateAccessToken();
    const refresh_token = await UserAccess.generateRefreshToken();
    UserAccess.access_token = access_token;
    await UserAccess.save();
    res.cookie("access_token", access_token, {
      httpOnly: true,
      secure: true,
    });
    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: true,
    });

    return res.status(200).send({
      status: "success",
      msg: "User logged in successfully",
    });
  } catch (error) {
    return res.status(400).send({ status: "fail", msg: "Invalid Credentials" });
  }
};

const UserLogout = async (req, res) => {
  try {
    const access_token = req.cookies["access_token"];
    const accessTokenInblackList = await Black.findOne(access_token);
    if (accessTokenInblackList) {
      return res.status(400).send({
        status: "fail",
        msg: "User is already logout",
      });
    }
    const accessTokenSaved = new Black(access_token);
    accessTokenSaved.save();
    return res.status(200).send({
      status: "success",
      msg: "User logout successfully",
    });
  } catch (error) {
    return res.status(400).send({
      status: "fail",
      msg: "Some problem is occuring for logout user",
    });
  }
};

const UserInfo = async (req, res) => {
  try {
    const access_token = req.cookies["access_token"];
    const getTheuserInfo = await User.findOne({ access_token });
    if (!getTheuserInfo) {
      return res.status(400).send({
        status: "fail",
        msg: "User is not found",
      });
    }

    return res.status(200).send({
      status: "success",
      msg: "User info is found",
      user: getTheuserInfo,
    });
  } catch (error) {
    return res.status(400).send({
      status: "fail",
      msg: "Some problem is occuring for get user info",
    });
  }
};

module.exports = { UserRegistration, UserLogin, UserLogout, UserInfo };
