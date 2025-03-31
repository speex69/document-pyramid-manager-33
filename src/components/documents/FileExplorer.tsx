
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Folder, File, Plus, Search, Upload, SlidersHorizontal, ChevronDown } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

type FileType = {
  id: string;
  name: string;
  type: "folder" | "file";
  parentId: string | null;
};

type FileExplorerProps = {
  title: string;
  isEditable: boolean;
  initialFiles?: FileType[];
};

const FileExplorer = ({ title, isEditable, initialFiles = [] }: FileExplorerProps) => {
  const [files, setFiles] = useState<FileType[]>(initialFiles);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<{ id: string | null; name: string }[]>([
    { id: null, name: "Racine" },
  ]);
  const [newFolderName, setNewFolderName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<FileType[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [sortMethod, setSortMethod] = useState<"name" | "type">("name");
  const { toast } = useToast();
  const [userRole, setUserRole] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserRole(role);
  }, []);

  const filteredFiles = files.filter((file) => file.parentId === currentFolder);
  const displayedFiles = isSearching ? searchResults : filteredFiles;

  const sortedFiles = [...displayedFiles].sort((a, b) => {
    if (sortMethod === "type") {
      // Sort by type first (folders first), then by name
      if (a.type === "folder" && b.type !== "folder") return -1;
      if (a.type !== "folder" && b.type === "folder") return 1;
    }
    // Sort alphabetically
    return a.name.localeCompare(b.name);
  });

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setIsSearching(false);
      return;
    }

    const results = files.filter((file) =>
      file.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(results);
    setIsSearching(true);

    if (results.length === 0) {
      toast({
        title: "Aucun résultat",
        description: "Aucun document ou dossier ne correspond à votre recherche.",
      });
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setIsSearching(false);
  };

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Le nom du dossier ne peut pas être vide.",
      });
      return;
    }

    const newFolder: FileType = {
      id: `folder-${Date.now()}`,
      name: newFolderName,
      type: "folder",
      parentId: currentFolder,
    };

    setFiles([...files, newFolder]);
    setNewFolderName("");
    toast({
      title: "Dossier créé",
      description: `Le dossier "${newFolderName}" a été créé avec succès.`,
    });
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    
    if (!selectedFiles || selectedFiles.length === 0) {
      return;
    }

    const fileArray = Array.from(selectedFiles);
    const newFiles: FileType[] = fileArray.map(file => ({
      id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      type: "file",
      parentId: currentFolder,
    }));

    setFiles([...files, ...newFiles]);

    // Notification de succès
    if (fileArray.length === 1) {
      toast({
        title: "Fichier importé",
        description: `Le fichier "${fileArray[0].name}" a été importé avec succès.`,
      });
    } else {
      toast({
        title: "Fichiers importés",
        description: `${fileArray.length} fichiers ont été importés avec succès.`,
      });
    }

    // Réinitialiser l'input pour permettre de sélectionner à nouveau les mêmes fichiers
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const navigateToFolder = (folderId: string | null, folderName: string) => {
    setCurrentFolder(folderId);
    clearSearch();

    if (folderId === null) {
      // Going to root
      setBreadcrumbs([{ id: null, name: "Racine" }]);
    } else {
      // Find the index of the folder in breadcrumbs
      const existingIndex = breadcrumbs.findIndex((crumb) => crumb.id === folderId);
      
      if (existingIndex > -1) {
        // If folder is already in breadcrumbs, truncate to that point
        setBreadcrumbs(breadcrumbs.slice(0, existingIndex + 1));
      } else {
        // Add new folder to breadcrumbs
        setBreadcrumbs([...breadcrumbs, { id: folderId, name: folderName }]);
      }
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-pyramide">{title}</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                className="pl-8 w-[200px] md:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={handleSearch}
              title="Rechercher"
            >
              <Search className="h-4 w-4" />
            </Button>
            {isSearching && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearSearch}
              >
                Effacer
              </Button>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" title="Trier par">
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortMethod("name")}>
                  Trier par nom
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortMethod("type")}>
                  Trier par type
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {/* Breadcrumbs navigation */}
        <div className="flex items-center space-x-2 mb-6 overflow-x-auto">
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center">
              {index > 0 && <ChevronDown className="h-4 w-4 mx-1 transform rotate-90" />}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateToFolder(crumb.id, crumb.name)}
                className="text-pyramide hover:text-pyramide-dark"
              >
                {crumb.name}
              </Button>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        {(isEditable || userRole === "admin") && (
          <div className="flex flex-wrap gap-2 mb-6">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" /> Nouveau dossier
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Créer un nouveau dossier</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Input
                      id="folderName"
                      placeholder="Nom du dossier"
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleCreateFolder}>Créer</Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Input file caché */}
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              multiple
              onChange={handleFileInputChange}
            />

            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={triggerFileInput}
            >
              <Upload className="h-4 w-4" /> Importer un document
            </Button>
          </div>
        )}

        {/* Files and folders list */}
        {sortedFiles.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            {isSearching 
              ? "Aucun résultat trouvé"
              : "Ce dossier est vide"}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {sortedFiles.map((file) => (
              <Card
                key={file.id}
                className="cursor-pointer hover:bg-muted transition-colors p-2 flex flex-col items-center justify-center"
                onClick={() => file.type === "folder" ? navigateToFolder(file.id, file.name) : null}
              >
                {file.type === "folder" ? (
                  <Folder className="folder-icon mb-2" />
                ) : (
                  <File className="file-icon mb-2" />
                )}
                <p className="text-center truncate w-full text-sm">{file.name}</p>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FileExplorer;
