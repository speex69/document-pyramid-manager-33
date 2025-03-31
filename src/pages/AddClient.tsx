
// Convert AddContact.tsx to AddClient.tsx
// Make sure to rename all "contact" references to "client"

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, User, Mail, Phone, MapPin, Building } from "lucide-react";

interface Client {
  id: string;
  name: string;
  role: string;
  company: string;
  email: string;
  phone: string;
  address: string;
}

const AddClient = () => {
  const [newClient, setNewClient] = useState<Omit<Client, "id">>({
    name: "",
    role: "",
    company: "",
    email: "",
    phone: "",
    address: ""
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewClient(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newClient.name || !newClient.email) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Le nom et l'email sont obligatoires.",
      });
      return;
    }

    // Create a new client with a unique ID
    const client: Client = {
      id: `client-${Date.now()}`,
      ...newClient
    };

    // Get existing clients from localStorage
    const existingClientsString = localStorage.getItem("clients");
    let existingClients: Client[] = [];

    if (existingClientsString) {
      try {
        existingClients = JSON.parse(existingClientsString);
      } catch (e) {
        console.error("Error parsing clients from localStorage", e);
      }
    }

    // Add the new client to the list
    existingClients.push(client);

    // Save back to localStorage
    localStorage.setItem("clients", JSON.stringify(existingClients));

    toast({
      title: "Client ajouté",
      description: `${client.name} a été ajouté avec succès.`,
    });

    // Navigate back to the clients list
    navigate("/clients");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate("/clients")}
          className="mr-2"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Ajouter un client</h2>
          <p className="text-muted-foreground">Créer un nouveau client dans le système.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations du client</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
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
                    value={newClient.name}
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
                    value={newClient.role}
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
                  value={newClient.company}
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
                  value={newClient.email}
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
                  value={newClient.phone}
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
                  value={newClient.address}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" type="button" onClick={() => navigate("/clients")}>
                Annuler
              </Button>
              <Button type="submit">
                Ajouter le client
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddClient;
