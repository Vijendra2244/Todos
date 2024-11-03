const express = require("express");
const {
  UserRegistration,
  UserLogin,
  UserLogout,
  UserInfo,
} = require("../controllers/User.controllers");

const UseroRouter = express.Router();

UseroRouter.route("/register").post(UserRegistration);
UseroRouter.route("/login").post(UserLogin);
UseroRouter.route("/logout").post(UserLogout);
UseroRouter.route("/userinfo").get(UserInfo);

module.exports = { UseroRouter };
