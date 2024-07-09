const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://chinmay:chinmay@cluster0.dwpy7.mongodb.net/iSystem");

const UserSchem = mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique: true
    },
    username:{
        type:String,
        required:true
    },
    userId:{
        type:String,
        required:true,
        unique: true
    },
});

const TaskSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    dueDate: { type: Date },
    priority: { type: String },
    status: { type: String },
    createdBy: { type: String, required: true },
    assignedTo: [{ type: String }],
    roles: { type: String },
});

const User = mongoose.model("users",UserSchem);
const Task = mongoose.model("Task",TaskSchema);
module.exports = {
    User,Task
}