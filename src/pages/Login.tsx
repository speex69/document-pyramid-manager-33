
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";

const Login = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is already authenticated
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [navigate]);
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2 text-pyramide">Pyramide</h1>
        <p className="text-gray-600">Portail Client Sécurisé</p>
      </div>
      <LoginForm />
    </div>
  );
};

export default Login;
