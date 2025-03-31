
import FileExplorer from "@/components/documents/FileExplorer";
import { useState, useEffect } from "react";

// Sample initial data for the demo with colors and icons
const samplePyramideFiles = [
  { id: "folder-1", name: "Contrats", type: "folder" as const, parentId: null },
  { id: "folder-2", name: "Factures", type: "folder" as const, parentId: null },
  { id: "folder-3", name: "Rapports", type: "folder" as const, parentId: null },
  { id: "file-1", name: "Présentation Pyramide.pdf", type: "file" as const, parentId: null },
  { id: "file-2", name: "Guide utilisateur.pdf", type: "file" as const, parentId: null },
  { id: "file-3", name: "Contrat cadre 2023.pdf", type: "file" as const, parentId: "folder-1" },
  { id: "file-4", name: "Avenant 1.pdf", type: "file" as const, parentId: "folder-1" },
  { id: "file-5", name: "Facture Janvier 2023.pdf", type: "file" as const, parentId: "folder-2" },
  { id: "file-6", name: "Facture Février 2023.pdf", type: "file" as const, parentId: "folder-2" },
  { id: "file-7", name: "Rapport Annuel 2022.pdf", type: "file" as const, parentId: "folder-3" },
];

const DocumentsPyramides = () => {
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserRole(role);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Documents Pyramides</h2>
        <p className="text-muted-foreground">
          Consultez les documents mis à votre disposition par Pyramide.
        </p>
      </div>
      
      <FileExplorer 
        title="Documents Pyramides" 
        isEditable={userRole === "admin"} 
        initialFiles={samplePyramideFiles}
      />
    </div>
  );
};

export default DocumentsPyramides;
