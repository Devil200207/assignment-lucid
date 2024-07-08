import React, { useState, useEffect } from "react";
import axios from "axios";
import TaskForm from "./TaskForm";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Meteors } from "./ui/meteors";
import { AnimatePresence, motion } from "framer-motion";
import io from 'socket.io-client';
const socket = io('https://assignment-lucid.onrender.com', {transports: ['websocket', 'polling', 'flashsocket']});

function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("");

    useEffect(() => {
        fetchTasks();
        setUpSocketListeners();

        return () => {
            cleanUpSocketListeners();
        };
    }, [tasks]);

    useEffect(() => {
        applyFilters();
    }, [tasks,statusFilter, priorityFilter]);

    const setUpSocketListeners = () => {
        socket.on('taskCreated', (newTask) => {
            console.log('New task created:', newTask);
            const userId = localStorage.getItem("userId");
            if (newTask.createdBy === userId || newTask.assignedTo.includes(userId)) {
                toast.success('New task assigned to you!');
                setTasks(prevTasks => sortTasksByPriority([...prevTasks, newTask]));
            }
        });

        socket.on('taskUpdated', (updatedTask) => {
            setTasks(prevTasks => prevTasks.map(task => task._id === updatedTask._id ? updatedTask : task));
            toast.success('Task updated!');
        });

        socket.on('taskDeleted', ({ taskId }) => {
            setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
            toast.success('Task deleted!');
        });
    };

    const cleanUpSocketListeners = () => {
        socket.off('taskCreated');
        socket.off('taskUpdated');
        socket.off('taskDeleted');
    };

    const fetchTasks = async () => {
        try {
            const token = localStorage.getItem("token");
            const userId = localStorage.getItem("userId");

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

            const sortedTasks = sortTasksByPriority(response.data);
            setTasks(sortedTasks);
            setUpSocketListeners();
            setLoading(false);
        } catch (error) {
            console.error("Error fetching tasks:", error);
            setLoading(false);
        }
    };

    const handleSaveTask = (savedTask) => {
        const updatedTasks = [...tasks, savedTask];
        const sortedTasks = sortTasksByPriority(updatedTasks);
        setUpSocketListeners();
        setTasks(sortedTasks);
        setShowForm(false);
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
    

    const sortTasksByPriority = (tasks) => {
        const priorityOrder = {
            High: 1,
            Medium: 2,
            Low: 3,
        };
        return tasks.slice().sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    };

    const applyFilters = () => {
        let filtered = [...tasks];

        if (statusFilter) {
            filtered = filtered.filter(task => task.status === statusFilter);
        }

        if (priorityFilter) {
            filtered = filtered.filter(task => task.priority === priorityFilter);
        }

        setFilteredTasks(filtered);
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        if (!query.trim()) {
            setFilteredTasks(tasks); // Reset filtered tasks to all tasks when search query is empty
            return;
        }

        const filtered = tasks.filter(task =>
            task.name.toLowerCase().includes(query.toLowerCase()) ||
            task.description.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredTasks(filtered);
    };

    

    return (
        <div className="flex flex-col justify-center">
            <h1 className="text-white flex font-semibold text-5xl justify-center">
                Task Dashboard
            </h1>
            <div className="flex my-10 h-12 animate-shimmer items-center justify-center">
                <button
                    onClick={() => setShowForm(true)}
                    className="inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
                >
                    Add Task
                </button>
            </div>
            <div className="flex justify-center">
                <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="px-4 py-2 mb-4 rounded-lg border bg-transparent text-white border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
            </div>
            <div className="flex justify-center space-x-4 mb-4">
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 text-white bg-transparent rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                    <option className="bg-black" value="">All Statuses</option>
                    <option className="bg-black" value="To Do">To Do</option>
                    <option className="bg-black" value="In Progress">In Progress</option>
                    <option className="bg-black" value="Done">Done</option>
                </select>
                <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="px-4 py-2 rounded-lg border text-white bg-transparent border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                    <option className="bg-black" value="">All Priorities</option>
                    <option className="bg-black" value="Low">Low</option>
                    <option className="bg-black" value="Medium">Medium</option>
                    <option className="bg-black" value="High">High</option>
                </select>
            </div>
            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                    >
                        <TaskForm onSave={handleSaveTask} onClose={() => setShowForm(false)} />
                    </motion.div>
                )}
            </AnimatePresence>
            {loading ? (
                <p>Loading...</p>
            ) : (
                
                    <div className="grid p-4 grid-cols-1 gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-5 lg:gap-6">
                        {filteredTasks.length > 0 ? (
                            filteredTasks.map((task, index) =>
                                task ? (
                                    <div
                                        key={task._id || index}
                                        className="relative mb-4"
                                    >
                                        <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-blue-500 to-teal-500 transform scale-[0.80] bg-red-500 rounded-full blur-3xl" />
                                        <div className="relative shadow-xl bg-gray-900 border border-gray-800 px-4 py-8 h-full overflow-hidden rounded-2xl flex flex-col justify-end items-start">
                                            <div className="h-5 w-5 rounded-full border flex items-center justify-center mb-4 border-gray-500">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth="1.5"
                                                    stroke="currentColor"
                                                    className="h-2 w-2 text-gray-300"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M4.5 4.5l15 15m0 0V8.25m0 11.25H8.25"
                                                    />
                                                </svg>
                                            </div>

                                            <h3 className="text-white text-center capitalize pb-2 font-bold text-xl mt-4">
                                                {task.name}
                                            </h3>
                                            <p className="text-white text-justify font-bold text-xl mt-4">
                                                {task.description}
                                            </p>
                                            <div>
                                                <p className="text-white font-bold text-xl mt-4">
                                                    Priority:
                                                    <select className="bg-gray-900 border ml-6 border-slate-700"
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
                                                    <select className="bg-gray-900 border ml-6 border-slate-700 "
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
                                            <div className="flex items-center justify-center pt-4">
                                                <button
                                                    onClick={() => handleDeleteTask(task._id)}
                                                    className="inline-flex cursor-pointer h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                            <Meteors number={20} />
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
                
            )}
            <ToastContainer />
        </div>
    );
}

export default Dashboard;
