
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Client {
  id: string;
  name: string;
  role?: string;
  company?: string;
  email: string;
}

export function UserProfile() {
  const [client, setClient] = useState<Client | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Récupérer l'ID du client actuellement connecté
    const clientId = localStorage.getItem("clientId");
    const userRole = localStorage.getItem("userRole");
    
    if (!clientId) return;
    
    // Combine initial clients with those from localStorage
    const initialClients: Client[] = [
      {
        id: "1",
        name: "Sophie Martin",
        role: "Responsable commercial",
        company: "Pyramide Conseil",
        email: "s.martin@pyramide-conseil.fr",
      },
      {
        id: "2",
        name: "Thomas Bernard",
        role: "Consultant senior",
        company: "Pyramide Conseil",
        email: "t.bernard@pyramide-conseil.fr",
      },
      {
        id: "3",
        name: "Julie Petit",
        role: "Support client",
        company: "Pyramide Conseil",
        email: "j.petit@pyramide-conseil.fr",
      }
    ];
    
    const savedClients = localStorage.getItem("clients");
    let allClients = [...initialClients];
    
    if (savedClients) {
      try {
        const parsedClients = JSON.parse(savedClients);
        allClients = [...initialClients, ...parsedClients];
      } catch (e) {
        console.error("Error loading clients from localStorage", e);
      }
    }
    
    // Find the client with the matching ID
    const foundClient = allClients.find(c => c.id === clientId) || null;
    setClient(foundClient);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("clientId");
    navigate("/login");
  };

  // Si aucun client n'est trouvé, n'affichez rien
  if (!client) {
    return null;
  }

  // Obtenir les initiales pour l'avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 outline-none">
        <span className="text-sm font-medium hidden sm:block">
          {client.name}
        </span>
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary text-primary-foreground">
            {getInitials(client.name)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
        <DropdownMenuItem className="flex items-center gap-2" asChild>
          <Link to="/profile">
            <User className="h-4 w-4" />
            <span>Mon profil</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex items-center gap-2 text-red-500" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          <span>Déconnexion</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
