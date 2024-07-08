import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect,useState } from 'react';
import io from 'socket.io-client';
import AuthPage from "./components/AuthPage";
import DashboardLayout from "./components/Dashboard-layout";
import './App.css'
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  // const [socket, setSocket] = useState(null);
  // useEffect(() => {
  //   const newsocit = io('http://localhost:3000', {transports: ['websocket', 'polling', 'flashsocket']});

  

  //   setSocket(newsocit);
  //   newsocit.on('connect', () => {
  //     console.log('Connected to server');
  //   });

  // }, []);

  return (
   <div>
     <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />}/> 
        <Route path="/dashboard" element={<DashboardLayout />} />
        
      </Routes>
    </BrowserRouter>
    <ToastContainer />
   </div>
  )
}

export default App
