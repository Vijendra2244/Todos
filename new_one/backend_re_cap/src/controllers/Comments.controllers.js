const { Comments } = require("../modals/Comments.modals");
const { Todos } = require("../modals/Todo.modals");

const AddComments = async (req, res) => {
  try {
    const { text } = req.body; // Include todoId in the request body
    const { id } = req.user;
    const todoId = req.params.todoId;


    const comment = new Comments({ text, user: id });
    await comment.save();

    // Update the Todo document by adding the comment ID to its comments array
    await Todos.findByIdAndUpdate(todoId, { $push: { comments: comment._id } });

    return res.status(200).send({
      status: "success",
      msg: "Comment added successfully",
    });
  } catch (error) {
    return res.status(400).send({
      status: "fail",
      msg: "There was an issue adding the comment",
    });
  }
};

const getTodoWithComments = async (req, res) => {
  try {
    const { todoId } = req.params;
    const todo = await Todos.findById(todoId).populate("comments");

    if (!todo) {
      return res.status(404).send({ status: "fail", msg: "Todo not found" });
    }

    return res
      .status(200)
      .send({ status: "success", msg: "Get the todo", task: todo });
  } catch (error) {
    return res
      .status(400)
      .send({ status: "fail", msg: "Error fetching todo with comments" });
  }
};

module.exports = {
  AddComments,
  getTodoWithComments,
};
