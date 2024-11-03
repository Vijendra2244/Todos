const { Todos } = require("../modals/Todo.modals");

const CreateTodos = async (req, res) => {
  try {
    const { title, description } = req.body;
    const creatTodos = await Todos({
      title,
      description,
      UserId: req.user.id,
    });
    creatTodos.save();
    res.status(200).send({
      status: "success",
      msg: "Todos created successfully",
      task: creatTodos,
    });
  } catch (error) {
    return res.status(400).send({
      status: "fail",
      msg: "Some error is occuring while creating a todo",
    });
  }
};

const GetThePerticulerUserTodos = async (req, res) => {
  try {
    const getThatUserAllTodos = await Todos.find({
      UserId: req.user.id,
    }).populate("UserId", "email firstName lastName");

    return res.status(200).send({
      status: "success",
      msg: "Get the user all todos",
      data: getThatUserAllTodos,
    });
  } catch (err) {
    return res.status(400).send({
      status: "fail",
      msg: "Some error is occuring while getting a user all todos",
    });
  }
};

const getAllTheTodosOnTheHome = async (req, res) => {
  try {
    const getTheTodos = await Todos.find({});
    return res.status(200).send({
      status: "success",
      msg: "Get the all todos",
      task: getTheTodos,
    });
  } catch (error) {
    return res.status(400).send({
      status: "fail",
      msg: "Getting the some problem to get the todos",
    });
  }
};

const deleteTheOwnTodos = async (req, res) => {
  try {
    const todoId = req.params.todoId; // Assume the todo ID is passed in the request params
    const userId = req.user.id; // The authenticated user's ID

    // Find the todo by ID to check ownership
    const todo = await Todos.findById(todoId);

    if (!todo) {
      return res.status(404).send({
        status: "fail",
        msg: "Todo not found",
      });
    }

    // Check if the authenticated user is the owner of the todo
    if (todo.UserId.toString() !== userId) {
      return res.status(403).send({
        status: "fail",
        msg: "You are not authorized to delete this todo",
      });
    }

    // Delete the todo if the user is the owner
    await Todos.findByIdAndDelete(todoId);

    return res.status(200).send({
      status: "success",
      msg: "Todo deleted successfully",
    });
  } catch (error) {
    return res.status(400).send({
      status: "fail",
      msg: "An error occurred while deleting the todo",
    });
  }
};

const updateTheOwnTodos = async (req, res) => {
  try {
    const todoId = req.params.todoId; // Assume the todo ID is passed in the request params
    const userId = req.user.id; // The authenticated user's ID
    const { title, description } = req.body; // Get the updated title and description from the request body

    // Find the todo by ID to check ownership
    const todo = await Todos.findById(todoId);

    if (!todo) {
      return res.status(404).send({
        status: "fail",
        msg: "Todo not found",
      });
    }

    // Check if the authenticated user is the owner of the todo
    if (todo.UserId.toString() !== userId) {
      return res.status(403).send({
        status: "fail",
        msg: "You are not authorized to update this todo",
      });
    }

    // Update the todo if the user is the owner
    const updatedTodo = await Todos.findByIdAndUpdate(todoId, {
      title,
      description,
    });

    return res.status(200).send({
      status: "success",
      msg: "Todo updated successfully",
      data: updatedTodo,
    });
  } catch (error) {
    return res.status(400).send({
      status: "fail",
      msg: "An error occurred while updating the todo",
    });
  }
};

module.exports = {
  CreateTodos,
  GetThePerticulerUserTodos,
  getAllTheTodosOnTheHome,
  deleteTheOwnTodos,
  updateTheOwnTodos,
};
