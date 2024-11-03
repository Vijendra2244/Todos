const express = require("express");
const {
  AddComments,
  getTodoWithComments,
} = require("../controllers/Comments.controllers");

const CommentsRouter = express.Router();

CommentsRouter.route("/create/:todoId").post(AddComments);
CommentsRouter.route("/getTodoWithCommment/:todoId").post(getTodoWithComments);

module.exports = { CommentsRouter };
