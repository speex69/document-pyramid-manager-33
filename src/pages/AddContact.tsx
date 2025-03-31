
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Mail, Phone, MapPin, Building } from "lucide-react";

const AddContact = () => {
  const [newContact, setNewContact] = useState({
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

    // Get existing contacts from localStorage, or initialize empty array
    const existingContacts = JSON.parse(localStorage.getItem("contacts") || "[]");
    
    // Create new contact with unique ID
    const contact = {
      id: `${Date.now()}`,
      ...newContact
    };
    
    // Add new contact to array and save back to localStorage
    const updatedContacts = [...existingContacts, contact];
    localStorage.setItem("contacts", JSON.stringify(updatedContacts));
    
    toast({
      title: "Contact ajouté",
      description: `${contact.name} a été ajouté avec succès.`,
    });
    
    // Navigate back to contacts page
    navigate("/contacts");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate("/contacts")}
          className="mr-2"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Ajouter un contact</h2>
          <p className="text-muted-foreground">
            Créez un nouveau contact dans votre réseau.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations du contact</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleAddContact(); }}>
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
                    value={newContact.name}
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
                    value={newContact.role}
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
                  value={newContact.company}
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
                  value={newContact.email}
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
                  value={newContact.phone}
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
                  value={newContact.address}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" type="button" onClick={() => navigate("/contacts")}>
                Annuler
              </Button>
              <Button type="submit">
                Ajouter le contact
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddContact;
