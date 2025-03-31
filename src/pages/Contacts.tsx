
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Phone, Mail, MapPin, Building, Trash, Edit, ExternalLink, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useNavigate } from "react-router-dom";

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
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState<Contact | null>(null);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
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

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingContact) return;
    
    const { name, value } = e.target;
    setEditingContact(prev => {
      if (!prev) return prev;
      return { ...prev, [name]: value };
    });
  };

  const handleViewContact = (contact: Contact) => {
    setCurrentContact(contact);
    setIsViewDialogOpen(true);
  };

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingContact) return;
    
    if (!editingContact.name || !editingContact.email) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Le nom et l'email sont obligatoires.",
      });
      return;
    }
    
    const updatedContacts = contacts.map(c => c.id === editingContact.id ? editingContact : c);
    setContacts(updatedContacts);
    
    // Update localStorage
    const storedContacts = updatedContacts.filter(contact => 
      !initialContacts.some(initialContact => initialContact.id === contact.id)
    );
    localStorage.setItem("contacts", JSON.stringify(storedContacts));
    
    setIsEditDialogOpen(false);
    
    toast({
      title: "Contact modifié",
      description: `${editingContact.name} a été modifié avec succès.`,
    });
  };

  const confirmDeleteContact = (contact: Contact) => {
    setCurrentContact(contact);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteContact = () => {
    if (!currentContact) return;
    
    const updatedContacts = contacts.filter(c => c.id !== currentContact.id);
    setContacts(updatedContacts);
    
    // Update localStorage
    const storedContacts = updatedContacts.filter(contact => 
      !initialContacts.some(initialContact => initialContact.id === contact.id)
    );
    localStorage.setItem("contacts", JSON.stringify(storedContacts));
    
    setIsDeleteDialogOpen(false);
    
    toast({
      title: "Contact supprimé",
      description: `${currentContact.name} a été supprimé.`,
    });
  };

  const handleAccessClientSpace = (contact: Contact) => {
    // Ici on simulerait l'accès à l'espace client de ce contact
    toast({
      title: "Accès à l'espace client",
      description: `Redirection vers l'espace client de ${contact.name}.`,
    });
    
    // Dans une vraie application, on pourrait rediriger vers une page spécifique
    // navigate(`/client/${contact.id}`);
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
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {contacts.map((contact) => (
          <ContextMenu key={contact.id}>
            <ContextMenuTrigger>
              <Card 
                className="cursor-pointer hover:shadow-md transition-shadow" 
                onClick={() => handleViewContact(contact)}
              >
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
                    <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline" onClick={(e) => e.stopPropagation()}>
                      {contact.email}
                    </a>
                  </div>
                  <div className="flex gap-2 items-center">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a href={`tel:${contact.phone}`} className="text-blue-600 hover:underline" onClick={(e) => e.stopPropagation()}>
                      {contact.phone}
                    </a>
                  </div>
                  <div className="flex gap-2 items-start">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span>{contact.address}</span>
                  </div>
                </CardContent>
              </Card>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem onClick={() => handleViewContact(contact)}>
                <User className="mr-2 h-4 w-4" /> Voir la fiche
              </ContextMenuItem>
              {userRole === "admin" && (
                <>
                  <ContextMenuItem onClick={() => handleEditContact(contact)}>
                    <Edit className="mr-2 h-4 w-4" /> Modifier
                  </ContextMenuItem>
                  <ContextMenuItem onClick={() => confirmDeleteContact(contact)} className="text-red-600">
                    <Trash className="mr-2 h-4 w-4" /> Supprimer
                  </ContextMenuItem>
                </>
              )}
              <ContextMenuItem onClick={() => handleAccessClientSpace(contact)}>
                <ExternalLink className="mr-2 h-4 w-4" /> Accéder à l'espace client
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        ))}
      </div>
      
      {/* Dialog pour voir les détails d'un contact */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Détails du contact</DialogTitle>
          </DialogHeader>
          {currentContact && (
            <div className="space-y-4 py-4">
              <div className="flex items-center">
                <User className="h-6 w-6 mr-4 text-primary" />
                <div>
                  <h3 className="font-medium text-lg">{currentContact.name}</h3>
                  <p className="text-sm text-muted-foreground">{currentContact.role}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-[24px_1fr] items-center gap-x-4 gap-y-3">
                <Building className="h-5 w-5 text-muted-foreground" />
                <span>{currentContact.company}</span>
                
                <Mail className="h-5 w-5 text-muted-foreground" />
                <a href={`mailto:${currentContact.email}`} className="text-blue-600 hover:underline">
                  {currentContact.email}
                </a>
                
                <Phone className="h-5 w-5 text-muted-foreground" />
                <a href={`tel:${currentContact.phone}`} className="text-blue-600 hover:underline">
                  {currentContact.phone}
                </a>
                
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <span>{currentContact.address}</span>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2 sm:gap-0">
            {userRole === "admin" && currentContact && (
              <>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setIsViewDialogOpen(false);
                    handleEditContact(currentContact);
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" /> Modifier
                </Button>
                <Button 
                  variant="destructive"
                  onClick={() => {
                    setIsViewDialogOpen(false);
                    confirmDeleteContact(currentContact);
                  }}
                >
                  <Trash className="h-4 w-4 mr-2" /> Supprimer
                </Button>
              </>
            )}
            <Button 
              onClick={() => currentContact && handleAccessClientSpace(currentContact)}
              variant="default"
            >
              <ExternalLink className="h-4 w-4 mr-2" /> Accéder à l'espace client
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog pour modifier un contact */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Modifier le contact</DialogTitle>
          </DialogHeader>
          {editingContact && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Nom
                </Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={editingContact.name}
                  onChange={handleEditChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-role" className="text-right">
                  Fonction
                </Label>
                <Input
                  id="edit-role"
                  name="role"
                  value={editingContact.role}
                  onChange={handleEditChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-company" className="text-right">
                  Société
                </Label>
                <Input
                  id="edit-company"
                  name="company"
                  value={editingContact.company}
                  onChange={handleEditChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-email" className="text-right">
                  Email
                </Label>
                <Input
                  id="edit-email"
                  name="email"
                  type="email"
                  value={editingContact.email}
                  onChange={handleEditChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-phone" className="text-right">
                  Téléphone
                </Label>
                <Input
                  id="edit-phone"
                  name="phone"
                  value={editingContact.phone}
                  onChange={handleEditChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-address" className="text-right">
                  Adresse
                </Label>
                <Input
                  id="edit-address"
                  name="address"
                  value={editingContact.address}
                  onChange={handleEditChange}
                  className="col-span-3"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={handleSaveEdit}>
              Enregistrer les modifications
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmation de suppression */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce contact ? Cette action ne peut pas être annulée.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeleteContact}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Contacts;
