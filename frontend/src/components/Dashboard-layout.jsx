import * as React from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Dashboard from "./Dashboard";
import Register from "./Register";

export default function DashboardLayout() {
    const { userId, isLoaded } = useAuth();
    const { user } = useUser();
    const navigate = useNavigate();

    React.useEffect(() => {
        const authenticateUser = async () => {
            if (isLoaded && !userId) {
                navigate("/register");
            } 
            else if (isLoaded && userId) 
            {
                // If user is loaded and authenticated, send user info to backend
                const userData = {
                    userId: user.id,
                    username: user.username,
                    email: user.primaryEmailAddress.emailAddress,
                };
                try {
                    const response = await axios.post("http://localhost:3000/api/auth/register", userData);
                    const { token } = response.data;
                    localStorage.setItem("token", token); // Store the token in local storage
                } catch (error) {
                    console.error("Error during user authentication:", error);
                }
            }
        };

        authenticateUser();
    }, [isLoaded, userId, user, navigate]);

    if (!isLoaded) return "Loading...";

    return (
        <div>
            <Register />
            <Dashboard />
        </div>
    );
}
