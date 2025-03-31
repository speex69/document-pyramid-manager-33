
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { User, Edit, Trash } from "lucide-react";

interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  lastLogin: string;
  status: "active" | "inactive";
}

const initialClients: Client[] = [
  {
    id: "1",
    name: "Acme Inc.",
    email: "contact@acme.com",
    company: "Acme Inc.",
    lastLogin: "Aujourd'hui, 10:24",
    status: "active",
  },
  {
    id: "2",
    name: "Tech Solutions",
    email: "info@techsolutions.com",
    company: "Tech Solutions",
    lastLogin: "Hier, 15:42",
    status: "active",
  },
  {
    id: "3",
    name: "Global Services",
    email: "support@globalservices.com",
    company: "Global Services",
    lastLogin: "Il y a 3 jours",
    status: "inactive",
  },
];

const AdminClients = () => {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [newClient, setNewClient] = useState<Omit<Client, "id" | "lastLogin">>({
    name: "",
    email: "",
    company: "",
    status: "active",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editingClient) {
      setEditingClient({
        ...editingClient,
        [name]: value,
      });
    } else {
      setNewClient({
        ...newClient,
        [name]: value,
      });
    }
  };

  const handleAddClient = () => {
    if (!newClient.name || !newClient.email || !newClient.company) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Tous les champs sont obligatoires.",
      });
      return;
    }

    const client: Client = {
      id: `${Date.now()}`,
      ...newClient,
      lastLogin: "Jamais",
    };

    setClients([...clients, client]);
    setNewClient({
      name: "",
      email: "",
      company: "",
      status: "active",
    });
    
    setIsDialogOpen(false);
    toast({
      title: "Client ajouté",
      description: `${client.company} a été ajouté avec succès.`,
    });
  };

  const handleEditClient = () => {
    if (!editingClient) return;

    setClients(
      clients.map((client) =>
        client.id === editingClient.id ? editingClient : client
      )
    );
    
    setEditingClient(null);
    setIsDialogOpen(false);
    toast({
      title: "Client modifié",
      description: `${editingClient.company} a été modifié avec succès.`,
    });
  };

  const handleDeleteClient = (id: string) => {
    setClients(clients.filter((client) => client.id !== id));
    toast({
      title: "Client supprimé",
      description: "Le client a été supprimé avec succès.",
    });
  };

  const openEditDialog = (client: Client) => {
    setEditingClient(client);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingClient(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gestion des clients</h2>
          <p className="text-muted-foreground">
            Ajoutez, modifiez ou supprimez des clients.
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={closeDialog}>
          <DialogTrigger asChild>
            <Button>Ajouter un client</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingClient ? "Modifier un client" : "Ajouter un client"}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="company" className="text-right">
                  Société
                </Label>
                <Input
                  id="company"
                  name="company"
                  value={editingClient ? editingClient.company : newClient.company}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nom
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={editingClient ? editingClient.name : newClient.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={editingClient ? editingClient.email : newClient.email}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Statut
                </Label>
                <div className="col-span-3">
                  <select
                    id="status"
                    name="status"
                    value={editingClient ? editingClient.status : newClient.status}
                    onChange={(e) => {
                      if (editingClient) {
                        setEditingClient({
                          ...editingClient,
                          status: e.target.value as "active" | "inactive",
                        });
                      } else {
                        setNewClient({
                          ...newClient,
                          status: e.target.value as "active" | "inactive",
                        });
                      }
                    }}
                    className="w-full p-2 border border-gray-300 rounded"
                  >
                    <option value="active">Actif</option>
                    <option value="inactive">Inactif</option>
                  </select>
                </div>
              </div>
              <Button 
                onClick={editingClient ? handleEditClient : handleAddClient}
                className="ml-auto"
              >
                {editingClient ? "Modifier" : "Ajouter"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des clients</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Société</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Dernière connexion</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.company}</TableCell>
                  <TableCell>{client.name}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.lastLogin}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs ${
                      client.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                    }`}>
                      {client.status === "active" ? "Actif" : "Inactif"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openEditDialog(client)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-red-500"
                        onClick={() => handleDeleteClient(client.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminClients;
