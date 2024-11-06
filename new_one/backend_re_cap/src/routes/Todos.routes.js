const express = require("express");
const {
  CreateTodos,
  GetThePerticulerUserTodos,
  getAllTheTodosOnTheHome,
  deleteTheOwnTodos,
  updateTheOwnTodos,
  searchItem,
} = require("../controllers/Todos.controllers");

const TodosRouter = express.Router();

TodosRouter.route("/create").post(CreateTodos);
TodosRouter.route("/getByUser").get(GetThePerticulerUserTodos);
TodosRouter.route("/getAllTodos").get(getAllTheTodosOnTheHome);
TodosRouter.route("/deleteOwnTodos/:todoId").delete(deleteTheOwnTodos);
TodosRouter.route("/updateOwnTodos/:todoId").put(updateTheOwnTodos);
TodosRouter.route("/search").get(searchItem);

module.exports = { TodosRouter };
