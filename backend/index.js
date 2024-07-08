const express = require("express");
const cors = require("cors");
const taskRoutes = require('./routes/tasks');
const authRoutes = require('./routes/auth');
const bodyParser = require('body-parser');
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
      origin: "https://assignment-lucid-1.onrender.com/",
      methods: ["GET", "POST"],
    },
  });


app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

io.on('connection', (socket) => {
    console.log('New client connected');
    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
});

server.listen(3000, () => {
    console.log('Server running on port 3000');
});