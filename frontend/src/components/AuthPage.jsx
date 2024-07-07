import {useUser ,useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Register from "./Register";

export default function AuthPage() {

  const navigate = useNavigate();
  const { isLoaded, userId } = useAuth(); // Call useAuth at the top level

  useEffect(() => {
    if (isLoaded && userId) {
      navigate("/dashboard");
    }
  }, [isLoaded, userId, navigate]); // Add navigate to the dependency array

    return (
     <Register/>

    )
  }