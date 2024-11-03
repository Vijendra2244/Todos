const express = require("express");
const PORT = 3000;

const app = express();

app.get("/", (req, res) => {
  res.send("Welcom to Express.js Server!");
});

app.get("/about", (req, res) => {
  res.send("This is a simple web server built using Express.js");
});

app.get("/contact", (req, res) => {
  const data = {
    email: "student@example.com",
    phone: "123-456-7890",
  };
  res.send(data);
});

app.get("/random", (req, res) => {
  const random = Math.floor(Math.random() * 100) + 1;
  res.send(`The radnom number is ${random}`);
});

app.use((req, res, next) => {
  res.status(404).send("404- Page Not Found");
});
app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
