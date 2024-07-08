import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect,useState } from 'react';
import io from 'socket.io-client';
import AuthPage from "./components/AuthPage";
import DashboardLayout from "./components/Dashboard-layout";
import './App.css'
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  
    // return () => {
    //   newsocit.disconnect();
    // };
  }, []);

  return (
   <div>
     <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />}/> 
        <Route path="/dashboard" element={<DashboardLayout socket={socket} />} />
        
      </Routes>
    </BrowserRouter>
    <ToastContainer />
   </div>
  )
}

export default App
