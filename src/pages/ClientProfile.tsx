
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { User, Mail, Phone, MapPin, Building, Save } from "lucide-react";

interface Client {
  id: string;
  name: string;
  role: string;
  company: string;
  email: string;
  phone: string;
  address: string;
}

const ClientProfile = () => {
  const [client, setClient] = useState<Client | null>(null);
  const [editedClient, setEditedClient] = useState<Client | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    // Récupérer l'ID du client actuellement connecté
    const clientId = localStorage.getItem("clientId");
    
    if (!clientId) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de récupérer votre profil.",
      });
      return;
    }
    
    // Combine initial clients with those from localStorage
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
    setEditedClient(foundClient ? { ...foundClient } : null);
  }, [toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editedClient) return;
    
    const { name, value } = e.target;
    setEditedClient(prev => {
      if (!prev) return prev;
      return { ...prev, [name]: value };
    });
  };

  const handleSave = () => {
    if (!editedClient) return;
    
    if (!editedClient.name || !editedClient.email) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Le nom et l'email sont obligatoires.",
      });
      return;
    }
    
    // Get all clients from localStorage
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
    
    const savedClientsString = localStorage.getItem("clients");
    let savedClients: Client[] = [];
    
    if (savedClientsString) {
      try {
        savedClients = JSON.parse(savedClientsString);
      } catch (e) {
        console.error("Error parsing clients from localStorage", e);
      }
    }
    
    // Check if we're editing a default client or a saved one
    const isInitialClient = initialClients.some(c => c.id === editedClient.id);
    
    if (isInitialClient) {
      // For initial clients, add the modified client to localStorage
      const exists = savedClients.some(c => c.id === editedClient.id);
      
      if (exists) {
        // Update existing override
        savedClients = savedClients.map(c => 
          c.id === editedClient.id ? editedClient : c
        );
      } else {
        // Add new override
        savedClients.push(editedClient);
      }
    } else {
      // For saved clients, update the saved client
      savedClients = savedClients.map(c => 
        c.id === editedClient.id ? editedClient : c
      );
    }
    
    // Save back to localStorage
    localStorage.setItem("clients", JSON.stringify(savedClients));
    
    // Update state
    setClient(editedClient);
    
    toast({
      title: "Profil modifié",
      description: "Les modifications ont été enregistrées.",
    });
  };

  if (!client) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-150px)]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Profil non trouvé</h2>
          <p className="text-muted-foreground mb-4">Impossible de récupérer votre profil.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Mon Profil</h2>
        <p className="text-muted-foreground">Gérez vos informations personnelles.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between">
            <span>Informations du profil</span>
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Enregistrer
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {editedClient && (
            <form className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="name">Nom *</Label>
                    </div>
                    <Input
                      id="name"
                      name="name"
                      value={editedClient.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="role">Fonction</Label>
                    </div>
                    <Input
                      id="role"
                      name="role"
                      value={editedClient.role}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                  
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="company">Société</Label>
                  </div>
                  <Input
                    id="company"
                    name="company"
                    value={editedClient.company}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="email">Email *</Label>
                  </div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={editedClient.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="phone">Téléphone</Label>
                  </div>
                  <Input
                    id="phone"
                    name="phone"
                    value={editedClient.phone}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="address">Adresse</Label>
                  </div>
                  <Input
                    id="address"
                    name="address"
                    value={editedClient.address}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientProfile;
