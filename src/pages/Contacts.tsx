
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Phone, Mail, MapPin, Building } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

interface Contact {
  id: string;
  name: string;
  role: string;
  company: string;
  email: string;
  phone: string;
  address: string;
}

const initialContacts: Contact[] = [
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

const Contacts = () => {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [newContact, setNewContact] = useState<Omit<Contact, "id">>({
    name: "",
    role: "",
    company: "",
    email: "",
    phone: "",
    address: ""
  });
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserRole(role);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewContact(prev => ({ ...prev, [name]: value }));
  };

  const handleAddContact = () => {
    if (!newContact.name || !newContact.email) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Le nom et l'email sont obligatoires.",
      });
      return;
    }

    const contact: Contact = {
      id: `${Date.now()}`,
      ...newContact
    };
    
    setContacts([...contacts, contact]);
    setNewContact({
      name: "",
      role: "",
      company: "",
      email: "",
      phone: "",
      address: ""
    });
    
    setIsDialogOpen(false);
    toast({
      title: "Contact ajouté",
      description: `${contact.name} a été ajouté avec succès.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Contacts</h2>
          <p className="text-muted-foreground">
            Vos contacts chez Pyramide Conseil.
          </p>
        </div>
        
        {userRole === "admin" && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>Ajouter un contact</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Ajouter un nouveau contact</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Nom
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={newContact.name}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">
                    Fonction
                  </Label>
                  <Input
                    id="role"
                    name="role"
                    value={newContact.role}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="company" className="text-right">
                    Société
                  </Label>
                  <Input
                    id="company"
                    name="company"
                    value={newContact.company}
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
                    value={newContact.email}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">
                    Téléphone
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={newContact.phone}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="address" className="text-right">
                    Adresse
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    value={newContact.address}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <Button onClick={handleAddContact} className="ml-auto">
                  Ajouter
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {contacts.map((contact) => (
          <Card key={contact.id}>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">{contact.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{contact.role}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2 items-center">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span>{contact.company}</span>
              </div>
              <div className="flex gap-2 items-center">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline">
                  {contact.email}
                </a>
              </div>
              <div className="flex gap-2 items-center">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a href={`tel:${contact.phone}`} className="text-blue-600 hover:underline">
                  {contact.phone}
                </a>
              </div>
              <div className="flex gap-2 items-start">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <span>{contact.address}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Contacts;
