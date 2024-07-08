const express = require('express');
const router = express.Router();
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const {Task} = require("../batabase/db");
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST","PUT","DELETE"],
    },
  });

//Create Task
router.post('/saveTask', async (req, res) => {

    const{status,priority,dueDate,createdBy,assignedTo,description,name} = req.body;
    try
    {
        const task = await Task.create({
        createdBy,
        assignedTo,
        status,
        priority,
        dueDate,
        description,
        name
        });
        // io.emit('taskCreated', task);
        io.emit('taskCreated', task);
        
        res.status(201).json(task);
    }
    catch{
        res.status(400).send("Invalid Task data");
    }
});
  
// Get tasks
router.get('/', async (req, res) => {
    try {
        const userId = req.query.userId; // Assuming you send userId as a query parameter
        const tasks = await Task.find({
            $or: [
                { createdBy: userId },
                { assignedTo: userId }
            ]
        }).populate('assignedTo', 'username'); // Populate assignedTo with username from User model

        res.status(200).json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});
  
// Update task
router.put('/:id', async (req, res) => {
    try
    {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        io.emit('taskUpdated', task);
        res.status(200).json(task);
    }
    catch
    {
        res.status(500).json({ msg: "Server error" });
    }
});
  
// Delete task
router.delete('/:id', async (req, res) => {
    try
    {
        await Task.findByIdAndDelete(req.params.id);
        io.emit('taskDeleted', { taskId: req.params.id });
        res.status(204).send();
    }
    catch
    {
        res.status(500).json({ msg: "Server error" });
    }
});

module.exports = router;