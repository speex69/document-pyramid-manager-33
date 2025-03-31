
import { 
  User, Phone, Mail, MapPin, Building, Trash, Edit, ExternalLink, Plus 
} from "lucide-react";
import { useState, useEffect, useLayoutEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Client {
  id: string;
  name: string;
  role: string;
  company: string;
  email: string;
  phone: string;
  address: string;
}

const initialClients: Client[] = [
  {
    id: "1",
    name: "Sophie Martin",
    role: "Responsable commercial",
    company: "Pyramide Conseil",
    email: "s.martin@pyramide-conseil.fr",
    phone: "01 23 45 67 89",
    address: "12 rue des Pyramides, 75001 Paris"
  },
  {
    id: "2",
    name: "Thomas Bernard",
    role: "Consultant senior",
    company: "Pyramide Conseil",
    email: "t.bernard@pyramide-conseil.fr",
    phone: "01 23 45 67 90",
    address: "12 rue des Pyramides, 75001 Paris"
  },
  {
    id: "3",
    name: "Julie Petit",
    role: "Support client",
    company: "Pyramide Conseil",
    email: "j.petit@pyramide-conseil.fr",
    phone: "01 23 45 67 91",
    address: "12 rue des Pyramides, 75001 Paris"
  }
];

const Clients = () => {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [userRole, setUserRole] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Vérifier l'accès avant le rendu
  useLayoutEffect(() => {
    const role = localStorage.getItem("userRole");
    
    // Si l'utilisateur est un client, rediriger vers sa page de profil
    if (role !== "admin") {
      const clientId = localStorage.getItem("clientId");
      if (clientId) {
        navigate("/profile", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    }
  }, [navigate]);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserRole(role);
    
    // Load clients from localStorage if available
    const savedClients = localStorage.getItem("clients");
    if (savedClients) {
      try {
        const parsedClients = JSON.parse(savedClients);
        setClients([...initialClients, ...parsedClients]);
      } catch (e) {
        console.error("Error loading clients from localStorage", e);
      }
    }
  }, []);

  const handleAccessClientSpace = (client: Client) => {
    toast({
      title: "Accès à l'espace client",
      description: `Redirection vers l'espace client de ${client.name}.`,
    });
  };

  // Si l'utilisateur n'est pas un admin, ne pas afficher la liste des clients
  if (userRole !== "admin") {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Clients</h2>
          <p className="text-muted-foreground">
            Vos clients chez Pyramide Conseil.
          </p>
        </div>
        
        {userRole === "admin" && (
          <Button onClick={() => navigate("/clients/add")}>
            <Plus className="mr-2 h-4 w-4" /> Ajouter un client
          </Button>
        )}
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Fonction</TableHead>
              <TableHead>Société</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow 
                key={client.id} 
                className="cursor-pointer hover:bg-muted"
                onClick={() => navigate(`/clients/${client.id}`)}
              >
                <TableCell className="font-medium">{client.name}</TableCell>
                <TableCell>{client.role}</TableCell>
                <TableCell>{client.company}</TableCell>
                <TableCell>
                  <a 
                    href={`mailto:${client.email}`} 
                    className="text-blue-600 hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {client.email}
                  </a>
                </TableCell>
                <TableCell>
                  <a 
                    href={`tel:${client.phone}`} 
                    className="text-blue-600 hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {client.phone}
                  </a>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/clients/${client.id}`);
                      }}
                    >
                      <User className="h-4 w-4" />
                      <span className="sr-only">Voir</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAccessClientSpace(client);
                      }}
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span className="sr-only">Espace client</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Clients;
