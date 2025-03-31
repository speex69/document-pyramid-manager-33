
import FileExplorer from "@/components/documents/FileExplorer";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarRange, ArrowDownAZ, ArrowUpAZ } from "lucide-react";

// Sample initial data for the demo with colors and icons
const samplePyramideFiles = [
  { id: "folder-1", name: "Contrats", type: "folder" as const, parentId: null },
  { id: "folder-2", name: "Factures", type: "folder" as const, parentId: null },
  { id: "folder-3", name: "Rapports", type: "folder" as const, parentId: null },
  { id: "file-1", name: "Présentation Pyramide.pdf", type: "file" as const, parentId: null, date: "2023-06-01" },
  { id: "file-2", name: "Guide utilisateur.pdf", type: "file" as const, parentId: null, date: "2023-05-10" },
  { id: "file-3", name: "Contrat cadre 2023.pdf", type: "file" as const, parentId: "folder-1", date: "2023-05-05" },
  { id: "file-4", name: "Avenant 1.pdf", type: "file" as const, parentId: "folder-1", date: "2023-04-20" },
  { id: "file-5", name: "Facture Janvier 2023.pdf", type: "file" as const, parentId: "folder-2", date: "2023-01-31" },
  { id: "file-6", name: "Facture Février 2023.pdf", type: "file" as const, parentId: "folder-2", date: "2023-02-28" },
  { id: "file-7", name: "Rapport Annuel 2022.pdf", type: "file" as const, parentId: "folder-3", date: "2023-03-15" },
];

const DocumentsPyramides = () => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<string>("default");
  const [sortedFiles, setSortedFiles] = useState(samplePyramideFiles);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserRole(role);
  }, []);

  useEffect(() => {
    // Trier les fichiers selon l'option sélectionnée
    const files = [...samplePyramideFiles];
    
    switch (sortOrder) {
      case "date-desc":
        setSortedFiles(
          files.sort((a, b) => {
            if (a.type === "folder" && b.type === "file") return -1;
            if (a.type === "file" && b.type === "folder") return 1;
            if (a.type === "folder" && b.type === "folder") return a.name.localeCompare(b.name);
            return (b as any).date?.localeCompare((a as any).date || "") || 0;
          })
        );
        break;
      case "date-asc":
        setSortedFiles(
          files.sort((a, b) => {
            if (a.type === "folder" && b.type === "file") return -1;
            if (a.type === "file" && b.type === "folder") return 1;
            if (a.type === "folder" && b.type === "folder") return a.name.localeCompare(b.name);
            return (a as any).date?.localeCompare((b as any).date || "") || 0;
          })
        );
        break;
      case "name-asc":
        setSortedFiles(
          files.sort((a, b) => {
            if (a.type === "folder" && b.type === "file") return -1;
            if (a.type === "file" && b.type === "folder") return 1;
            return a.name.localeCompare(b.name);
          })
        );
        break;
      case "name-desc":
        setSortedFiles(
          files.sort((a, b) => {
            if (a.type === "folder" && b.type === "file") return -1;
            if (a.type === "file" && b.type === "folder") return 1;
            return b.name.localeCompare(a.name);
          })
        );
        break;
      default:
        // Par défaut, les dossiers d'abord, puis les fichiers par ordre alphabétique
        setSortedFiles(
          files.sort((a, b) => {
            if (a.type === "folder" && b.type === "file") return -1;
            if (a.type === "file" && b.type === "folder") return 1;
            return a.name.localeCompare(b.name);
          })
        );
    }
  }, [sortOrder]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Documents Pyramides</h2>
        <p className="text-muted-foreground">
          Consultez les documents mis à votre disposition par Pyramide.
        </p>
      </div>
      
      <div className="flex justify-end mb-4">
        <Select
          value={sortOrder}
          onValueChange={setSortOrder}
        >
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Trier par..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Par défaut</SelectItem>
            <SelectItem value="date-desc">
              <div className="flex items-center gap-2">
                <CalendarRange className="h-4 w-4" />
                Date (plus récent d'abord)
              </div>
            </SelectItem>
            <SelectItem value="date-asc">
              <div className="flex items-center gap-2">
                <CalendarRange className="h-4 w-4" />
                Date (plus ancien d'abord)
              </div>
            </SelectItem>
            <SelectItem value="name-asc">
              <div className="flex items-center gap-2">
                <ArrowDownAZ className="h-4 w-4" />
                Nom (A-Z)
              </div>
            </SelectItem>
            <SelectItem value="name-desc">
              <div className="flex items-center gap-2">
                <ArrowUpAZ className="h-4 w-4" />
                Nom (Z-A)
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <FileExplorer 
        title="Documents Pyramides" 
        isEditable={userRole === "admin"} 
        initialFiles={sortedFiles}
        enableDragAndDrop={true}
      />
    </div>
  );
};

export default DocumentsPyramides;
