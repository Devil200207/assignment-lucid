import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect,useState } from 'react';
import io from 'socket.io-client';
import AuthPage from "./components/AuthPage";
import DashboardLayout from "./components/Dashboard-layout";
import './App.css'
import { toast} from 'react-toastify';

function App() {
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    const newsocit = io('https://assignment-lucid.onrender.com', {transports: ['websocket', 'polling', 'flashsocket']});

    setSocket(newsocit);
    newsocit.on('connect', () => {
      console.log('Connected to server');
    });

    newsocit.on('taskCreated', (task) => {
      console.log('New task created:', task);
      toast.success('New task assigned to you!');
    });
  
    return () => {
      newsocit.disconnect();
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />}/> 
        <Route path="/dashboard" element={<DashboardLayout socket={socket} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
