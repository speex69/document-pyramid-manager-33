
import FileExplorer from "@/components/documents/FileExplorer";

// Sample initial data for the demo with colors and icons
const sampleUserFiles = [
  { id: "folder-1", name: "Documents administratifs", type: "folder" as const, parentId: null },
  { id: "folder-2", name: "Projets", type: "folder" as const, parentId: null },
  { id: "file-1", name: "Note de service.pdf", type: "file" as const, parentId: null },
  { id: "file-2", name: "Planning 2023.xlsx", type: "file" as const, parentId: null },
  { id: "file-3", name: "Carte d'identité.pdf", type: "file" as const, parentId: "folder-1" },
  { id: "file-4", name: "Projet A - Budget.pdf", type: "file" as const, parentId: "folder-2" },
  { id: "file-5", name: "Projet B - Planning.pdf", type: "file" as const, parentId: "folder-2" },
];

const MesDocuments = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Mes Documents</h2>
        <p className="text-muted-foreground">
          Gérez vos documents personnels et partagez-les avec Pyramide.
        </p>
      </div>
      
      <FileExplorer 
        title="Mes Documents" 
        isEditable={true} 
        initialFiles={sampleUserFiles}
        enableDragAndDrop={true}
      />
    </div>
  );
};

export default MesDocuments;
