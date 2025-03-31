
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { CalendarIcon, FileText, User } from "lucide-react";

// Structure des données pour les documents
interface Document {
  name: string;
  date: string;
  author: string;
}

// Structure des données pour les clients
interface Client {
  name: string;
  date: string;
}

const Dashboard = () => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [greeting, setGreeting] = useState("");
  
  // Données des documents Pyramides
  const pyramideDocuments: Document[] = [
    { name: "Présentation Pyramide.pdf", date: "01/06/2023", author: "Sophie Martin" },
    { name: "Rapport Annuel 2022.pdf", date: "15/05/2023", author: "Thomas Bernard" },
    { name: "Guide utilisateur.pdf", date: "10/05/2023", author: "Julie Petit" },
  ];
  
  // Données des documents personnels
  const userDocuments: Document[] = [
    { name: "Note de service.pdf", date: "28/05/2023", author: "Vous" },
    { name: "Planning 2023.xlsx", date: "20/05/2023", author: "Vous" },
    { name: "Carte d'identité.pdf", date: "05/05/2023", author: "Vous" },
  ];
  
  // Données des clients
  const clients: Client[] = [
    { name: "Sophie Martin", date: "02/06/2023" },
    { name: "Thomas Bernard", date: "25/05/2023" },
    { name: "Julie Petit", date: "18/05/2023" },
  ];

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserRole(role);

    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Bonjour");
    } else if (hour < 18) {
      setGreeting("Bon après-midi");
    } else {
      setGreeting("Bonsoir");
    }
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Accueil</h2>
        <p className="text-muted-foreground">
          {greeting}, bienvenue sur votre portail documentaire sécurisé.
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Documents Pyramides
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pyramideDocuments.length} documents</div>
            <p className="text-xs text-muted-foreground mb-4">
              Dernière mise à jour: il y a 2 jours
            </p>
            <div className="space-y-3">
              {pyramideDocuments.map((doc, index) => (
                <div key={index} className="flex justify-between text-sm border-b pb-2">
                  <div className="truncate max-w-[150px]">{doc.name}</div>
                  <div className="flex gap-2 items-center">
                    <span className="text-xs text-muted-foreground">{doc.date}</span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                      {doc.author}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Mes Documents
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userDocuments.length} documents</div>
            <p className="text-xs text-muted-foreground mb-4">
              Dernière mise à jour: hier
            </p>
            <div className="space-y-3">
              {userDocuments.map((doc, index) => (
                <div key={index} className="flex justify-between text-sm border-b pb-2">
                  <div className="truncate max-w-[150px]">{doc.name}</div>
                  <div className="flex gap-2 items-center">
                    <span className="text-xs text-muted-foreground">{doc.date}</span>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                      {doc.author}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Clients
            </CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clients.length} clients</div>
            <p className="text-xs text-muted-foreground mb-4">
              Dernière mise à jour: il y a 5 jours
            </p>
            <div className="space-y-3">
              {clients.map((client, index) => (
                <div key={index} className="flex justify-between text-sm border-b pb-2">
                  <div>{client.name}</div>
                  <span className="text-xs text-muted-foreground">{client.date}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {userRole === "admin" && (
        <Card>
          <CardHeader>
            <CardTitle>Administration</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              En tant qu'administrateur, vous avez accès à toutes les fonctionnalités:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Gérer les comptes clients</li>
              <li>Créer et modifier des dossiers dans Documents Pyramides</li>
              <li>Déposer des documents dans tous les espaces</li>
              <li>Ajouter et modifier les contacts</li>
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
