import React, { useState, useEffect } from "react";
import axios from "axios";
import TaskForm from "./TaskForm";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GlareCard } from "./ui/glare-card";

function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true); // Add loading state

    useEffect(() => {
        fetchTasks();
    }, [tasks]);

    const fetchTasks = async () => {
        try {
            const token = localStorage.getItem("token"); // Assuming you have a token stored in localStorage
            const userId = localStorage.getItem("userId"); // Assuming you have userId stored in localStorage

            const response = await axios.get(
                "https://assignment-lucid.onrender.com/api/tasks",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: {
                        userId: userId,
                    },
                }
            );

            setTasks(response.data);
            setLoading(false); // Set loading to false after tasks are fetched
        } catch (error) {
            console.error("Error fetching tasks:", error);
            setLoading(false); // Set loading to false on error as well
        }
    };

    const handleSaveTask = (savedTask) => {
        console.log(savedTask);
        setTasks([...tasks, savedTask]);
        setShowForm(false);
        console.log(savedTask);
        toast.success("Task added successfully!");
    };

    const handleDeleteTask = async (taskId) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(
                `https://assignment-lucid.onrender.com/api/tasks/${taskId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            fetchTasks();
            toast.success("Task deleted successfully!");
        } catch (error) {
            console.error("Error deleting task:", error);
            toast.error("Failed to delete task.");
        }
    };

    const handleChangePriority = async (taskId, newPriority) => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(
                `https://assignment-lucid.onrender.com/api/tasks/${taskId}`,
                { priority: newPriority },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            fetchTasks();
            toast.success("Priority changed successfully!");
        } catch (error) {
            console.error("Error changing priority:", error);
            toast.error("Failed to change priority.");
        }
    };

    const handleChangeStatus = async (taskId, newStatus) => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(
                `https://assignment-lucid.onrender.com/api/tasks/${taskId}`,
                { status: newStatus },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            fetchTasks();
            toast.success("Status changed successfully!");
        } catch (error) {
            console.error("Error changing status:", error);
            toast.error("Failed to change status.");
        }
    };

    return (
        <div className="flex flex-col justify-center">
            <h1 className="text-white flex font-semibold text-5xl justify-center">
                Task Dashboard
            </h1>
            <div className="flex my-10 h-12 animate-shimmer items-center justify-center">
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
                >
                    Add Task
                </button>
            </div>
            {showForm && <TaskForm onSave={handleSaveTask} />}
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="flex justify-evenly flex-wrap">
                    <GlareCard>
                        <div className="h-full flex justify-center p-4">
                            {tasks.length > 0 ? (
                                tasks.map((task, index) =>
                                    task ? (
                                        <div key={task._id || index}>
                                            <h3 className="text-white text-center capitalize pb-2 font-bold text-xl mt-4">
                                                {task.name}
                                            </h3>
                                            <p className="text-white text-justify font-bold text-xl mt-4">
                                                {task.description}
                                            </p>
                                            <div>
                                                <p className="text-white font-bold text-xl mt-4">
                                                    Priority:
                                                    <select
                                                        value={task.priority}
                                                        onChange={(e) =>
                                                            handleChangePriority(task._id, e.target.value)
                                                        }
                                                    >
                                                        <option value="Low">Low</option>
                                                        <option value="Medium">Medium</option>
                                                        <option value="High">High</option>
                                                    </select>
                                                </p>
                                                <p className="text-white font-bold text-xl mt-4">
                                                    Status:
                                                    <select
                                                        value={task.status}
                                                        onChange={(e) =>
                                                            handleChangeStatus(task._id, e.target.value)
                                                        }
                                                    >
                                                        <option value="To Do">To Do</option>
                                                        <option value="In Progress">In Progress</option>
                                                        <option value="Done">Done</option>
                                                    </select>
                                                </p>
                                            </div>
                                            <div className="flex justify-center pt-4">
                                                <button
                                                    onClick={() => handleDeleteTask(task._id)}
                                                    className="inline-flex cursor-pointer h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <p key={index}>Task is undefined</p>
                                    )
                                )
                            ) : (
                                <p>No tasks found.</p>
                            )}
                        </div>
                    </GlareCard>
                </div>
            )}
            <ToastContainer />
        </div>
    );
}

export default Dashboard;
