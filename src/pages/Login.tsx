
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";
import { useToast } from "@/components/ui/use-toast";

interface Credentials {
  email: string;
  password: string;
}

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = async (credentials: Credentials) => {
    setIsLoading(true);

    // Simuler une vérification d'authentification
    setTimeout(() => {
      setIsLoading(false);

      // Admin credentials
      if (credentials.email === "admin@example.com" && credentials.password === "password") {
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userRole", "admin");
        localStorage.removeItem("clientId"); // Effacer clientId si existant
        
        toast({
          title: "Connecté avec succès",
          description: "Bienvenue sur votre tableau de bord d'administrateur.",
        });
        
        navigate("/dashboard");
        return;
      }
      
      // Client credentials (pour démonstration)
      const clientLogins = [
        { email: "sophie.martin@example.com", password: "password", id: "1" },
        { email: "thomas.bernard@example.com", password: "password", id: "2" },
        { email: "julie.petit@example.com", password: "password", id: "3" }
      ];
      
      const clientMatch = clientLogins.find(
        client => client.email === credentials.email && client.password === credentials.password
      );
      
      if (clientMatch) {
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userRole", "client");
        localStorage.setItem("clientId", clientMatch.id);
        
        toast({
          title: "Connecté avec succès",
          description: "Bienvenue sur votre espace client.",
        });
        
        navigate("/dashboard");
        return;
      }

      // Échec de l'authentification
      toast({
        variant: "destructive",
        title: "Échec de connexion",
        description: "Email ou mot de passe incorrect.",
      });
    }, 1000);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-primary">
            Pyramide
          </h1>
          <p className="mt-2 text-gray-600">
            Connectez-vous à votre espace client
          </p>
        </div>
        <LoginForm onLogin={handleLogin} isLoading={isLoading} />
        <div className="mt-4 text-center text-sm text-gray-500">
          <p className="text-sm text-muted-foreground">
            Identifiants de démonstration:<br />
            <span className="font-semibold">Admin:</span> admin@example.com / password<br />
            <span className="font-semibold">Client:</span> sophie.martin@example.com / password
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
