
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [greeting, setGreeting] = useState("");

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
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12 documents</div>
            <p className="text-xs text-muted-foreground">
              Dernière mise à jour: il y a 2 jours
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Mes Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8 documents</div>
            <p className="text-xs text-muted-foreground">
              Dernière mise à jour: hier
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Contacts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3 contacts</div>
            <p className="text-xs text-muted-foreground">
              Dernière mise à jour: il y a 5 jours
            </p>
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

      <Card>
        <CardHeader>
          <CardTitle>Activité récente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { date: "Aujourd'hui, 10:24", action: "Connexion au portail" },
              { date: "Hier, 16:30", action: "Document 'Rapport Q3.pdf' consulté" },
              { date: "20/10/2023, 09:15", action: "Document 'Contrat.pdf' téléchargé" },
            ].map((activity, i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="font-medium">{activity.action}</div>
                <div className="text-sm text-muted-foreground">{activity.date}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
