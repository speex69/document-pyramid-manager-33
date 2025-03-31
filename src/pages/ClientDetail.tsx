
import { useState, useEffect, useLayoutEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, User, Mail, Phone, MapPin, Building, Save, Trash, ExternalLink, Edit } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Client {
  id: string;
  name: string;
  role: string;
  company: string;
  email: string;
  phone: string;
  address: string;
}

const ClientDetail = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const [client, setClient] = useState<Client | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editedClient, setEditedClient] = useState<Client | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteDocuments, setDeleteDocuments] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useLayoutEffect(() => {
    const role = localStorage.getItem("userRole");
    const loggedInClientId = localStorage.getItem("clientId");
    
    if (role !== "admin" && loggedInClientId !== clientId) {
      toast({
        variant: "destructive",
        title: "Accès refusé",
        description: "Vous n'avez pas l'autorisation d'accéder à cette page.",
      });
      navigate("/profile", { replace: true });
    }
  }, [clientId, navigate, toast]);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserRole(role);
    
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
    
    const foundClient = allClients.find(c => c.id === clientId) || null;
    setClient(foundClient);
    setEditedClient(foundClient ? { ...foundClient } : null);
    
  }, [clientId]);

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
    
    const isInitialClient = initialClients.some(c => c.id === editedClient.id);
    
    if (isInitialClient) {
      const exists = savedClients.some(c => c.id === editedClient.id);
      
      if (exists) {
        savedClients = savedClients.map(c => 
          c.id === editedClient.id ? editedClient : c
        );
      } else {
        savedClients.push(editedClient);
      }
    } else {
      savedClients = savedClients.map(c => 
        c.id === editedClient.id ? editedClient : c
      );
    }
    
    localStorage.setItem("clients", JSON.stringify(savedClients));
    
    setClient(editedClient);
    setEditMode(false);
    
    toast({
      title: "Client modifié",
      description: "Les modifications ont été enregistrées.",
    });
  };

  const handleCancelEdit = () => {
    if (client) {
      setEditedClient({ ...client });
    }
    setEditMode(false);
  };

  const handleDelete = () => {
    if (!client) return;
    
    const initialClients = [
      { id: "1" }, { id: "2" }, { id: "3" }
    ];
    
    const isInitialClient = initialClients.some(c => c.id === client.id);
    const savedClientsString = localStorage.getItem("clients");
    let savedClients: Client[] = [];
    
    if (savedClientsString) {
      try {
        savedClients = JSON.parse(savedClientsString);
      } catch (e) {
        console.error("Error parsing clients from localStorage", e);
      }
    }
    
    savedClients = savedClients.filter(c => c.id !== client.id);
    localStorage.setItem("clients", JSON.stringify(savedClients));
    
    // Supprimer les documents associés si l'option est sélectionnée
    if (deleteDocuments) {
      try {
        // Récupérer tous les documents
        const savedFilesString = localStorage.getItem("userFiles");
        if (savedFilesString) {
          const allFiles = JSON.parse(savedFilesString);
          
          // Filtrer les fichiers pour ne garder que ceux qui n'appartiennent pas au client
          const filteredFiles = allFiles.filter((file: any) => 
            file.clientId !== client.id
          );
          
          // Sauvegarder les fichiers restants
          localStorage.setItem("userFiles", JSON.stringify(filteredFiles));
        }
      } catch (e) {
        console.error("Erreur lors de la suppression des documents", e);
      }
    }
    
    setIsDeleteDialogOpen(false);
    
    toast({
      title: "Client supprimé",
      description: `${client.name} a été supprimé${deleteDocuments ? ' avec tous ses documents' : ''}.`,
    });
    
    navigate("/clients");
  };
  
  const handleAccessClientSpace = () => {
    if (!client) return;
    
    toast({
      title: "Accès à l'espace client",
      description: `Redirection vers l'espace client de ${client.name}.`,
    });
  };
  
  if (!client) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-150px)]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Client non trouvé</h2>
          <p className="text-muted-foreground mb-4">Le client demandé n'existe pas ou a été supprimé.</p>
          <Button onClick={() => navigate("/clients")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux clients
          </Button>
        </div>
      </div>
    );
  }

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
          <h2 className="text-3xl font-bold tracking-tight">{client.name}</h2>
          <p className="text-muted-foreground">{client.role} - {client.company}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between">
            <span>Informations du client</span>
            <div className="flex space-x-2">
              {userRole === "admin" && (
                <>
                  {editMode ? (
                    <>
                      <Button 
                        variant="ghost" 
                        onClick={handleCancelEdit}
                      >
                        Annuler
                      </Button>
                      <Button 
                        onClick={handleSave}
                      >
                        <Save className="mr-2 h-4 w-4" />
                        Enregistrer
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button 
                        variant="outline" 
                        onClick={() => setEditMode(true)}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Modifier
                      </Button>
                      <Button 
                        variant="destructive" 
                        onClick={() => setIsDeleteDialogOpen(true)}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Supprimer
                      </Button>
                    </>
                  )}
                </>
              )}
              <Button onClick={handleAccessClientSpace}>
                <ExternalLink className="mr-2 h-4 w-4" />
                Espace client
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {editMode && editedClient ? (
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
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-[24px_1fr] items-center gap-x-4 gap-y-6">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">{client.name}</div>
                  <div className="text-sm text-muted-foreground">Nom</div>
                </div>
                
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">{client.role || "Non spécifié"}</div>
                  <div className="text-sm text-muted-foreground">Fonction</div>
                </div>
                
                <Building className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">{client.company || "Non spécifié"}</div>
                  <div className="text-sm text-muted-foreground">Société</div>
                </div>
                
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <a href={`mailto:${client.email}`} className="font-medium text-blue-600 hover:underline">
                    {client.email}
                  </a>
                  <div className="text-sm text-muted-foreground">Email</div>
                </div>
                
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <a href={`tel:${client.phone}`} className="font-medium text-blue-600 hover:underline">
                    {client.phone || "Non spécifié"}
                  </a>
                  <div className="text-sm text-muted-foreground">Téléphone</div>
                </div>
                
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">{client.address || "Non spécifié"}</div>
                  <div className="text-sm text-muted-foreground">Adresse</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce client ? Cette action ne peut pas être annulée.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="deleteDocuments" 
                checked={deleteDocuments}
                onCheckedChange={(checked) => setDeleteDocuments(checked === true)}
              />
              <label
                htmlFor="deleteDocuments"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Supprimer également tous les documents associés à ce client
              </label>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientDetail;
