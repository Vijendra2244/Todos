const dotnev = require("dotenv");
dotnev.config();
const express = require("express");
const { connectDB } = require("./config/db.config");
const { UseroRouter } = require("./routes/User.routes");
const PORT = process.env.PORT || 4000;
const cookies = require("cookie-parser");
const { auth } = require("./middleware/auth.middleware");
const { TodosRouter } = require("./routes/Todos.routes");
const { CommentsRouter } = require("./routes/Comments.routes");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(cookies());

app.use("/users", UseroRouter);
app.use("/todos", auth, TodosRouter);
app.use("/todos/comments", CommentsRouter);

app.get("/", (req, res) => {
  res.send("Recap of  Node - Express - MongoDb");
});

app.listen(PORT, async () => {
  try {
    await connectDB
      .then((res) => console.log("Connected to DB...."))
      .catch((err) =>
        console.log(err, "Gettign error after connecting to DB....")
      );
    console.log(`App is running at port ${PORT}`);
  } catch (error) {
    console.log(error, "error msg after decline mongo db connection");
  }
});
