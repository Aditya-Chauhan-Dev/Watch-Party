require("dotenv").config();
const http = require("http");
const app = require("./src/app");
const connectDB = require("./src/config/db");
const socketHandler = require("./src/socket/socketHandler");

const { Server } = require("socket.io");

connectDB();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});
console.log("CLIENT_URL =", process.env.CLIENT_URL);

socketHandler(io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server Running On ${PORT}`);
});
