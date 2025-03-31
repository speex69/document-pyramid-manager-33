
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, User, Mail, Phone, MapPin, Building, Save, Trash, ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Contact {
  id: string;
  name: string;
  role: string;
  company: string;
  email: string;
  phone: string;
  address: string;
}

const ContactDetail = () => {
  const { contactId } = useParams<{ contactId: string }>();
  const [contact, setContact] = useState<Contact | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editedContact, setEditedContact] = useState<Contact | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserRole(role);
    
    // Combine initial contacts with those from localStorage
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
    
    const savedContacts = localStorage.getItem("contacts");
    let allContacts = [...initialContacts];
    
    if (savedContacts) {
      try {
        const parsedContacts = JSON.parse(savedContacts);
        allContacts = [...initialContacts, ...parsedContacts];
      } catch (e) {
        console.error("Error loading contacts from localStorage", e);
      }
    }
    
    // Find the contact with the matching ID
    const foundContact = allContacts.find(c => c.id === contactId) || null;
    setContact(foundContact);
    setEditedContact(foundContact ? { ...foundContact } : null);
    
  }, [contactId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editedContact) return;
    
    const { name, value } = e.target;
    setEditedContact(prev => {
      if (!prev) return prev;
      return { ...prev, [name]: value };
    });
  };

  const handleSave = () => {
    if (!editedContact) return;
    
    if (!editedContact.name || !editedContact.email) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Le nom et l'email sont obligatoires.",
      });
      return;
    }
    
    // Get all contacts from localStorage
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
    
    const savedContactsString = localStorage.getItem("contacts");
    let savedContacts: Contact[] = [];
    
    if (savedContactsString) {
      try {
        savedContacts = JSON.parse(savedContactsString);
      } catch (e) {
        console.error("Error parsing contacts from localStorage", e);
      }
    }
    
    // Check if we're editing a default contact or a saved one
    const isInitialContact = initialContacts.some(c => c.id === editedContact.id);
    
    if (isInitialContact) {
      // For initial contacts, add the modified contact to localStorage
      const exists = savedContacts.some(c => c.id === editedContact.id);
      
      if (exists) {
        // Update existing override
        savedContacts = savedContacts.map(c => 
          c.id === editedContact.id ? editedContact : c
        );
      } else {
        // Add new override
        savedContacts.push(editedContact);
      }
    } else {
      // For saved contacts, update the saved contact
      savedContacts = savedContacts.map(c => 
        c.id === editedContact.id ? editedContact : c
      );
    }
    
    // Save back to localStorage
    localStorage.setItem("contacts", JSON.stringify(savedContacts));
    
    // Update state
    setContact(editedContact);
    setEditMode(false);
    
    toast({
      title: "Contact modifié",
      description: "Les modifications ont été enregistrées.",
    });
  };

  const handleCancelEdit = () => {
    if (contact) {
      setEditedContact({ ...contact });
    }
    setEditMode(false);
  };

  const handleDelete = () => {
    if (!contact) return;
    
    // Get all contacts from localStorage
    const initialContacts = [
      { id: "1" }, { id: "2" }, { id: "3" }
    ];
    
    const isInitialContact = initialContacts.some(c => c.id === contact.id);
    const savedContactsString = localStorage.getItem("contacts");
    let savedContacts: Contact[] = [];
    
    if (savedContactsString) {
      try {
        savedContacts = JSON.parse(savedContactsString);
      } catch (e) {
        console.error("Error parsing contacts from localStorage", e);
      }
    }
    
    // Update localStorage
    savedContacts = savedContacts.filter(c => c.id !== contact.id);
    localStorage.setItem("contacts", JSON.stringify(savedContacts));
    
    setIsDeleteDialogOpen(false);
    
    toast({
      title: "Contact supprimé",
      description: `${contact.name} a été supprimé.`,
    });
    
    // Navigate back to the contacts list
    navigate("/contacts");
  };
  
  const handleAccessClientSpace = () => {
    if (!contact) return;
    
    toast({
      title: "Accès à l'espace client",
      description: `Redirection vers l'espace client de ${contact.name}.`,
    });
  };
  
  if (!contact) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-150px)]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Contact non trouvé</h2>
          <p className="text-muted-foreground mb-4">Le contact demandé n'existe pas ou a été supprimé.</p>
          <Button onClick={() => navigate("/contacts")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux contacts
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
          onClick={() => navigate("/contacts")}
          className="mr-2"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{contact.name}</h2>
          <p className="text-muted-foreground">{contact.role} - {contact.company}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between">
            <span>Informations du contact</span>
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
          {editMode && editedContact ? (
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
                      value={editedContact.name}
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
                      value={editedContact.role}
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
                    value={editedContact.company}
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
                    value={editedContact.email}
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
                    value={editedContact.phone}
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
                    value={editedContact.address}
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
                  <div className="font-medium">{contact.name}</div>
                  <div className="text-sm text-muted-foreground">Nom</div>
                </div>
                
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">{contact.role || "Non spécifié"}</div>
                  <div className="text-sm text-muted-foreground">Fonction</div>
                </div>
                
                <Building className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">{contact.company || "Non spécifié"}</div>
                  <div className="text-sm text-muted-foreground">Société</div>
                </div>
                
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <a href={`mailto:${contact.email}`} className="font-medium text-blue-600 hover:underline">
                    {contact.email}
                  </a>
                  <div className="text-sm text-muted-foreground">Email</div>
                </div>
                
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <a href={`tel:${contact.phone}`} className="font-medium text-blue-600 hover:underline">
                    {contact.phone || "Non spécifié"}
                  </a>
                  <div className="text-sm text-muted-foreground">Téléphone</div>
                </div>
                
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">{contact.address || "Non spécifié"}</div>
                  <div className="text-sm text-muted-foreground">Adresse</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
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
            <Button variant="destructive" onClick={handleDelete}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContactDetail;
