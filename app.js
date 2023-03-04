const express = require("express");
const http = require("http");
const path = require("path");

// Basic express setup
let app = express();

app.use(express.static(path.join(__dirname, "/build")));

const port = process.env.PORT || "8080";
app.set("port", port);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/build/index.html"));
});

const server = http.createServer(app);
server.listen(port, () => console.log(`Running on localhost:${port}`));
