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
      origin: "*",
      methods: ["GET", "POST"],
    },
});


app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// io.on('connection', (socket) => {
//     console.log('New client connected');
//     socket.on('disconnect', () => {
//       console.log('Client disconnected');
//     });
// });

const users = [];

io.on("connection", (socket) => {
    // console.log(`User connected with ${socket.id}`);

    // socket.broadcast.emit('hi',"how are you");

    

    socket.on("join_room", (data) => {
      socket.join(data);
      console.log(`User with id ${socket.id} joined room : ${data}`);
    });

    socket.on('assignTask', ({ task, toUserId, fromUserId }) => {
      // Send task to the assigned user
      console.log(task, toUserId, fromUserId);
      // socket.join(toUserId);
      socket.to(fromUserId).emit('assignTask', task);
  
      // Re-join the sender's room
      // socket.join(fromUserId);
    });

});

server.listen(3000, () => {
    console.log('Server running on port 3000');
});