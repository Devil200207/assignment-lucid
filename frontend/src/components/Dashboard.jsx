import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskForm from './TaskForm';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true); // Add loading state

    useEffect(() => {
        fetchTasks();
    }, [tasks]);

    const fetchTasks = async () => {
        try {
            const token = localStorage.getItem('token'); // Assuming you have a token stored in localStorage
            const userId = localStorage.getItem('userId'); // Assuming you have userId stored in localStorage

            const response = await axios.get('http://localhost:3000/api/tasks', {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    userId: userId,
                    
                }
            });

            setTasks(response.data);
            setLoading(false); // Set loading to false after tasks are fetched
        } catch (error) {
            console.error('Error fetching tasks:', error);
            setLoading(false); // Set loading to false on error as well
        }
    };

    

    const handleSaveTask = (savedTask) => {
        console.log(savedTask);
        setTasks([...tasks, savedTask]);
        setShowForm(false);
        console.log(savedTask);
        toast.success('Task added successfully!');
    };

    const handleDeleteTask = async (taskId) => {
      try {
          const token = localStorage.getItem('token');
          await axios.delete(`http://localhost:3000/api/tasks/${taskId}`, {
              headers: {
                  Authorization: `Bearer ${token}`
              }
          });
          fetchTasks();
          toast.success('Task deleted successfully!');
      } catch (error) {
          console.error('Error deleting task:', error);
          toast.error('Failed to delete task.');
      }
  };

  const handleChangePriority = async (taskId, newPriority) => {
      try {
          const token = localStorage.getItem('token');
          await axios.put(`http://localhost:3000/api/tasks/${taskId}`, { priority: newPriority }, {
              headers: {
                  Authorization: `Bearer ${token}`
              }
          });
          fetchTasks();
          toast.success('Priority changed successfully!');
      } catch (error) {
          console.error('Error changing priority:', error);
          toast.error('Failed to change priority.');
      }
  };

  const handleChangeStatus = async (taskId, newStatus) => {
      try {
          const token = localStorage.getItem('token');
          await axios.put(`http://localhost:3000/api/tasks/${taskId}`, { status: newStatus }, {
              headers: {
                  Authorization: `Bearer ${token}`
              }
          });
          fetchTasks();
          toast.success('Status changed successfully!');
      } catch (error) {
          console.error('Error changing status:', error);
          toast.error('Failed to change status.');
      }
  };

 return (
        <div>
            <h1>Task Dashboard</h1>
            <button onClick={() => setShowForm(!showForm)}>Add Task</button>
            {showForm && <TaskForm onSave={handleSaveTask} />}
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    {tasks.length > 0 ? (
                        tasks.map((task, index) => (
                            task ? (
                                <div key={task._id || index} style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
                                    <h3>{task.name}</h3>
                                    <p>{task.description}</p>
                                    <div>
                                        <p>Priority: 
                                            <select value={task.priority} onChange={(e) => handleChangePriority(task._id, e.target.value)}>
                                                <option value="Low">Low</option>
                                                <option value="Medium">Medium</option>
                                                <option value="High">High</option>
                                            </select>
                                        </p>
                                        <p>Status: 
                                            <select value={task.status} onChange={(e) => handleChangeStatus(task._id, e.target.value)}>
                                                <option value="To Do">To Do</option>
                                                <option value="In Progress">In Progress</option>
                                                <option value="Done">Done</option>
                                            </select>
                                        </p>
                                    </div>
                                    <div>
                                        <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
                                    </div>
                                </div>
                            ) : (
                                <p key={index}>Task is undefined</p>
                            )
                        ))
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
