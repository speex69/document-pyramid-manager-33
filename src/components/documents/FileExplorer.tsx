import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Folder, File, Plus, Search, Upload, SlidersHorizontal, ChevronDown, Trash2, Eye } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";

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
  
  const [fileToDelete, setFileToDelete] = useState<FileType | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const [previewFile, setPreviewFile] = useState<FileType | null>(null);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserRole(role);
  }, []);

  const filteredFiles = files.filter((file) => file.parentId === currentFolder);
  const displayedFiles = isSearching ? searchResults : filteredFiles;

  const sortedFiles = [...displayedFiles].sort((a, b) => {
    if (sortMethod === "type") {
      if (a.type === "folder" && b.type !== "folder") return -1;
      if (a.type !== "folder" && b.type === "folder") return 1;
    }
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
      setBreadcrumbs([{ id: null, name: "Racine" }]);
    } else {
      const existingIndex = breadcrumbs.findIndex((crumb) => crumb.id === folderId);
      
      if (existingIndex > -1) {
        setBreadcrumbs(breadcrumbs.slice(0, existingIndex + 1));
      } else {
        setBreadcrumbs([...breadcrumbs, { id: folderId, name: folderName }]);
      }
    }
  };

  const handleDelete = (file: FileType) => {
    setFileToDelete(file);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (!fileToDelete) return;
    
    if (fileToDelete.type === "folder") {
      const deleteFolder = (folderId: string) => {
        const children = files.filter(f => f.parentId === folderId);
        
        children.forEach(child => {
          if (child.type === "folder") {
            deleteFolder(child.id);
          }
        });
        
        setFiles(prevFiles => prevFiles.filter(f => f.parentId !== folderId && f.id !== folderId));
      };
      
      deleteFolder(fileToDelete.id);
      
      toast({
        title: "Dossier supprimé",
        description: `Le dossier "${fileToDelete.name}" et son contenu ont été supprimés avec succès.`,
      });
    } else {
      setFiles(prevFiles => prevFiles.filter(f => f.id !== fileToDelete.id));
      
      toast({
        title: "Fichier supprimé",
        description: `Le fichier "${fileToDelete.name}" a été supprimé avec succès.`,
      });
    }
    
    setShowDeleteDialog(false);
    setFileToDelete(null);
  };

  const handlePreview = (file: FileType) => {
    if (file.type === "file") {
      setPreviewFile(file);
      setShowPreviewDialog(true);
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

        {sortedFiles.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            {isSearching 
              ? "Aucun résultat trouvé"
              : "Ce dossier est vide"}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {sortedFiles.map((file) => (
              <ContextMenu key={file.id}>
                <ContextMenuTrigger>
                  <Card
                    className="cursor-pointer hover:bg-muted transition-colors p-2 flex flex-col items-center justify-center"
                    onClick={() => 
                      file.type === "folder" 
                        ? navigateToFolder(file.id, file.name) 
                        : handlePreview(file)
                    }
                  >
                    {file.type === "folder" ? (
                      <Folder className="folder-icon mb-2" />
                    ) : (
                      <File className="file-icon mb-2" />
                    )}
                    <p className="text-center truncate w-full text-sm">{file.name}</p>
                  </Card>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  {file.type === "folder" && (
                    <ContextMenuItem 
                      onClick={() => navigateToFolder(file.id, file.name)}
                      className="flex items-center gap-2"
                    >
                      <Folder className="h-4 w-4" /> Ouvrir
                    </ContextMenuItem>
                  )}
                  {file.type === "file" && (
                    <ContextMenuItem 
                      onClick={() => handlePreview(file)}
                      className="flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" /> Aperçu
                    </ContextMenuItem>
                  )}
                  {(isEditable || userRole === "admin") && (
                    <ContextMenuItem 
                      onClick={() => handleDelete(file)}
                      className="flex items-center gap-2 text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" /> Supprimer
                    </ContextMenuItem>
                  )}
                </ContextMenuContent>
              </ContextMenu>
            ))}
          </div>
        )}
      </CardContent>
      
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              {fileToDelete?.type === "folder"
                ? `Êtes-vous sûr de vouloir supprimer le dossier "${fileToDelete?.name}" et tout son contenu ? Cette action est irréversible.`
                : `Êtes-vous sûr de vouloir supprimer le fichier "${fileToDelete?.name}" ? Cette action est irréversible.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="sm:max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>{previewFile?.name}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-full h-full flex flex-col items-center justify-center border rounded-md p-8 overflow-auto">
              <File className="h-32 w-32 mb-4 text-muted-foreground" />
              <p className="text-center text-muted-foreground">
                Aperçu du document: <strong>{previewFile?.name}</strong>
              </p>
              <p className="text-center text-muted-foreground mt-4">
                Dans une application réelle, le contenu du document serait affiché ici.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default FileExplorer;
