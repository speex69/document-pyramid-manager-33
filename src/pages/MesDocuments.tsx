
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
const sampleUserFiles = [
  { id: "folder-1", name: "Documents administratifs", type: "folder" as const, parentId: null },
  { id: "folder-2", name: "Projets", type: "folder" as const, parentId: null },
  { id: "file-1", name: "Note de service.pdf", type: "file" as const, parentId: null, date: "2023-05-28" },
  { id: "file-2", name: "Planning 2023.xlsx", type: "file" as const, parentId: null, date: "2023-05-20" },
  { id: "file-3", name: "Carte d'identité.pdf", type: "file" as const, parentId: "folder-1", date: "2023-05-05" },
  { id: "file-4", name: "Projet A - Budget.pdf", type: "file" as const, parentId: "folder-2", date: "2023-04-15" },
  { id: "file-5", name: "Projet B - Planning.pdf", type: "file" as const, parentId: "folder-2", date: "2023-03-22" },
];

const MesDocuments = () => {
  const [sortOrder, setSortOrder] = useState<string>("default");
  const [sortedFiles, setSortedFiles] = useState(sampleUserFiles);
  
  useEffect(() => {
    // Trier les fichiers selon l'option sélectionnée
    const files = [...sampleUserFiles];
    
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
        <h2 className="text-3xl font-bold tracking-tight">Mes Documents</h2>
        <p className="text-muted-foreground">
          Gérez vos documents personnels et partagez-les avec Pyramide.
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
        title="Mes Documents" 
        isEditable={true} 
        initialFiles={sortedFiles}
        enableDragAndDrop={true}
      />
    </div>
  );
};

export default MesDocuments;
