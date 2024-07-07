import React, { useState, useEffect } from 'react';
import { useUser } from "@clerk/clerk-react";
import { useParams } from 'react-router-dom';
import axios from 'axios';

function TaskDetails() {
  const { id } = useParams();
  const { user } = useUser();
  const [task, setTask] = useState(null);

  useEffect(() => {
    fetchTaskDetails();
  }, [id]);

  const fetchTaskDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/tasks/${id}`);
      setTask(response.data);
    } catch (error) {
      console.error('Error fetching task details:', error);
    }
  };

  if (!task) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{task.name}</h1>
      <p>{task.description}</p>
      <p>Due Date: {task.dueDate}</p>
      <p>Priority: {task.priority}</p>
      <p>Status: {task.status}</p>
    </div>
  );
}

export default TaskDetails;
