
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // In a real app, this would be an API call to validate credentials
    setTimeout(() => {
      setIsLoading(false);
      
      // Mock authentication - in production this would be a proper auth check
      if (username === "admin" && password === "admin") {
        localStorage.setItem("userRole", "admin");
        localStorage.setItem("isAuthenticated", "true");
        toast({
          title: "Connexion réussie",
          description: "Bienvenue dans votre espace administrateur.",
        });
        navigate("/dashboard");
      } else if (username === "client" && password === "client") {
        localStorage.setItem("userRole", "client");
        localStorage.setItem("isAuthenticated", "true");
        toast({
          title: "Connexion réussie",
          description: "Bienvenue dans votre espace client.",
        });
        navigate("/dashboard");
      } else {
        toast({
          variant: "destructive",
          title: "Erreur de connexion",
          description: "Identifiant ou mot de passe incorrect.",
        });
      }
    }, 1000);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center text-pyramide">Portail Client Pyramide</CardTitle>
        <CardDescription className="text-center">Connectez-vous à votre espace sécurisé</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Identifiant</Label>
            <Input
              id="username"
              placeholder="Entrez votre identifiant"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              placeholder="Entrez votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full bg-pyramide hover:bg-pyramide-dark" disabled={isLoading}>
            {isLoading ? "Connexion en cours..." : "Se connecter"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-sm text-muted-foreground">
          Demo: admin/admin ou client/client
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
