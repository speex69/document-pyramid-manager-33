
import { 
  User, Phone, Mail, MapPin, Building, Trash, Edit, ExternalLink, Plus 
} from "lucide-react";
import { useState, useEffect } from "react";
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
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserRole(role);
    
    // Load contacts from localStorage if available
    const savedContacts = localStorage.getItem("contacts");
    if (savedContacts) {
      try {
        const parsedContacts = JSON.parse(savedContacts);
        setContacts([...initialContacts, ...parsedContacts]);
      } catch (e) {
        console.error("Error loading contacts from localStorage", e);
      }
    }
  }, []);

  const handleAccessClientSpace = (contact: Contact) => {
    toast({
      title: "Accès à l'espace client",
      description: `Redirection vers l'espace client de ${contact.name}.`,
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
          <Button onClick={() => navigate("/contacts/add")}>
            <Plus className="mr-2 h-4 w-4" /> Ajouter un contact
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
            {contacts.map((contact) => (
              <TableRow 
                key={contact.id} 
                className="cursor-pointer hover:bg-muted"
                onClick={() => navigate(`/contacts/${contact.id}`)}
              >
                <TableCell className="font-medium">{contact.name}</TableCell>
                <TableCell>{contact.role}</TableCell>
                <TableCell>{contact.company}</TableCell>
                <TableCell>
                  <a 
                    href={`mailto:${contact.email}`} 
                    className="text-blue-600 hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {contact.email}
                  </a>
                </TableCell>
                <TableCell>
                  <a 
                    href={`tel:${contact.phone}`} 
                    className="text-blue-600 hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {contact.phone}
                  </a>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/contacts/${contact.id}`);
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
                        handleAccessClientSpace(contact);
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

export default Contacts;
