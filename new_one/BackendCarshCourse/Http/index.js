const http = require("http");
const fs = require("fs");
const qs = require("querystring");

const port = 8080;

const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/signup") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(`
      <html>
        <body>
          <form action="/signup" method="post">
            <label>Username:</label><br>
            <input type="text" name="username"><br>
            <label>Password:</label><br>
            <input type="password" name="password"><br>
            <input type="submit" value="Signup">
          </form>
        </body>
      </html>
    `);
  } else if (req.method === "POST" && req.url === "/signup") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      const parsedData = qs.parse(body);
      const { username, password } = parsedData;
      const userData = `Username: ${username}, Password: ${password}\n`;

      // Append user data to user.txt
      fs.appendFile("user.txt", userData, (err) => {
        if (err) throw err;
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("Thank You for Signup...!!!");
      });
    });
  } else if (req.method === "GET" && req.url === "/allusers") {
    fs.readFile("user.txt", "utf8", (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal Server Error");
        return;
      }

      // Filter out passwords before displaying
      const users = data
        .split("\n")
        .map((line) => {
          const [username] = line.split(", Password:");
          return username;
        })
        .filter(Boolean)
        .join("<br>");

      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(`<h3>All Users:</h3><p>${users}</p>`);
    });
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Not Found");
  }
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
