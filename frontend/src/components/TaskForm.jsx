// client/src/components/TaskForm.js
import React, { useState, useEffect } from 'react';
import { useUser } from "@clerk/clerk-react";
import axios from 'axios';

function TaskForm({ onSave }) 
{
    const { user } = useUser();
    const createdBy = user.id;
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState('Low');
    const [status, setStatus] = useState('To Do');
    const [assignedTo, setAssignedTo] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        if (user) {
            localStorage.setItem("userId", user.id);
          }
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/auth/users');
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const respp = await axios.post('https://assignment-lucid.onrender.com/api/tasks/saveTask', {
                name,
                description,
                dueDate,
                priority,
                status,
                assignedTo,
                createdBy
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('Task saved successfully:', respp.data);
            onSave(respp.data);
        } catch (error) {
            console.error('Error saving task:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Task Name" />
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
            </select>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
            </select>
            <select multiple value={assignedTo} onChange={(e) => setAssignedTo([...e.target.selectedOptions].map(option => option.value))}>
                {users.map(user => (
                    <option key={user.userId} value={user.userId}>{user.username}</option>
                ))}
            </select>
            <button type="submit">Save</button>
        </form>
    );
}

export default TaskForm;
