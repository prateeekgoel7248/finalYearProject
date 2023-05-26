const http = require('http');
const express = require("express");
const cors = require("cors");

const router = require("./routes/operations");

const app = express();
app.use(express.json());

//
app.use(cors({ origin: "http://localhost:3100"}));

// To make the server use speific end-points for a specific URL,
app.use("/data", router);

// Default URL to API
app.use('/', (req, res) => {
    res.send("API works");
});

const server = http.createServer(app);
const PORT = 3100;

server.listen(PORT);

console.log(`Server is listening on PORT: ${PORT}`);