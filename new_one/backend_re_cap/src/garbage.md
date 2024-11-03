  const fs = require("fs");

 fs.readFile("./res.txt", "utf-8", (err, data) => {
   if (err) {
     throw new Error("Some problem in reading the file", err);
   }
   console.log(data);
 })
 fs.writeFile("./res.txt", "This is my new text", (err, data) => {
   if (err) {
     throw new Error("error", err);
   }
   console.log(data);
 })
 const { createHmac } = require('node:crypto')
 const secret = 'weweowiewoe';
 const hash = createHmac('sha256', secret)
                .update('I love cupcakes')
                .digest('hex');
 console.log(hash)

 // app.get("/home", (req, res) => {
//   res.status(200).send({ msg: "home page" });
// });

// app.post("/post", (req, res) => {
//   const data = req.body;
//   res.send(data);
// });

const http = require("http")


const server  = http.createServer((req,res)=>{
  res.end("Home page for http server")
})

server.listen(4000,()=>{
  console.log(" HTTP Server is listening")
})



// app.use("/contact", (req, res) => {
//   res.end("contact");
// });

// app.use("/about", (req, res) => {
//   res.end("about");
// });

// app.use("/", (req, res) => {
//   res.end("Home");
// });