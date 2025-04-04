import { useState, useEffect, useRef, DragEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { 
  Folder, 
  File, 
  Plus, 
  Search, 
  Upload, 
  SlidersHorizontal, 
  ChevronDown, 
  Trash2, 
  Eye, 
  LayoutGrid, 
  LayoutList,
  ArrowDownAZ,
  ArrowUpAZ,
  CalendarRange,
  Download
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type FileType = {
  id: string;
  name: string;
  type: "folder" | "file";
  parentId: string | null;
  color?: string;
  icon?: string;
  date?: string;
  clientId?: string;
};

type FileExplorerProps = {
  title: string;
  isEditable: boolean;
  initialFiles?: FileType[];
  enableDragAndDrop?: boolean;
};

const FileExplorer = ({ title, isEditable, initialFiles = [], enableDragAndDrop = false }: FileExplorerProps) => {
  const processedInitialFiles = initialFiles.map(file => {
    if (file.type === "folder") {
      return { ...file, color: "red" };
    }
    return file;
  });

  const [files, setFiles] = useState<FileType[]>(processedInitialFiles);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<{ id: string | null; name: string }[]>([
    { id: null, name: "Racine" },
  ]);
  const [newFolderName, setNewFolderName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<FileType[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [sortMethod, setSortMethod] = useState<"name" | "type" | "date-asc" | "date-desc" | "name-asc" | "name-desc">("name");
  const { toast } = useToast();
  const [userRole, setUserRole] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [fileToDelete, setFileToDelete] = useState<FileType | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const [previewFile, setPreviewFile] = useState<FileType | null>(null);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  
  const [draggedItem, setDraggedItem] = useState<FileType | null>(null);
  const [dragOverFolderId, setDragOverFolderId] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserRole(role);
  }, []);

  const filteredFiles = files.filter((file) => file.parentId === currentFolder);
  const displayedFiles = isSearching ? searchResults : filteredFiles;

  const sortedFiles = [...displayedFiles].sort((a, b) => {
    if (a.type === "folder" && b.type !== "folder") return -1;
    if (a.type !== "folder" && b.type === "folder") return 1;
    
    switch (sortMethod) {
      case "date-desc":
        if (a.type === "folder" && b.type === "folder") return a.name.localeCompare(b.name);
        return ((b as any).date?.localeCompare((a as any).date || "") || 0);
      
      case "date-asc":
        if (a.type === "folder" && b.type === "folder") return a.name.localeCompare(b.name);
        return ((a as any).date?.localeCompare((b as any).date || "") || 0);
      
      case "name-desc":
        return b.name.localeCompare(a.name);
      
      case "name-asc":
      case "name":
      default:
        return a.name.localeCompare(b.name);
    }
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
      color: "red",
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
      date: new Date().toISOString().split('T')[0]
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

  const handleDownload = (file: FileType) => {
    if (file.type === "file") {
      const dummyContent = `This is a simulation of the content of the file: ${file.name}`;
      const blob = new Blob([dummyContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Téléchargement démarré",
        description: `Le fichier "${file.name}" est en cours de téléchargement.`,
      });
    } else if (file.type === "folder") {
      const downloadFolderContent = (folderId: string) => {
        const folderFiles = files.filter(f => f.parentId === folderId);
        if (folderFiles.length === 0) {
          toast({
            title: "Dossier vide",
            description: `Le dossier "${file.name}" ne contient aucun fichier.`,
          });
          return;
        }
        
        toast({
          title: "Téléchargement démarré",
          description: `Le dossier "${file.name}" est en cours de téléchargement sous forme d'archive.`,
        });
      };
      
      downloadFolderContent(file.id);
    }
  };

  const handlePreview = (file: FileType) => {
    if (file.type === "file") {
      setPreviewFile(file);
      setShowPreviewDialog(true);
    }
  };

  const toggleViewMode = (value: string) => {
    if (value === "grid" || value === "list") {
      setViewMode(value);
    }
  };

  const renderFileIcon = (file: FileType) => {
    if (file.type === "file") {
      return <File className="file-icon" />;
    }
    
    return <Folder className="folder-icon text-red-500" />;
  };
  
  const handleDragStart = (e: DragEvent<HTMLDivElement>, item: FileType) => {
    if (!enableDragAndDrop || (!isEditable && userRole !== "admin")) return;
    
    e.dataTransfer.setData("text/plain", item.id);
    setDraggedItem(item);
    
    const dragPreview = document.createElement("div");
    dragPreview.className = "bg-background p-2 rounded border shadow-md";
    dragPreview.innerHTML = `
      <div class="flex items-center gap-2">
        ${item.type === "folder" ? 
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"></path></svg>' : 
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>'}
        ${item.name}
      </div>
    `;
    document.body.appendChild(dragPreview);
    
    try {
      e.dataTransfer.setDragImage(dragPreview, 20, 20);
    } catch (e) {
      console.log("Error setting drag image:", e);
    }
    
    setTimeout(() => {
      document.body.removeChild(dragPreview);
    }, 0);
  };
  
  const handleDragOver = (e: DragEvent<HTMLDivElement>, targetFolder?: FileType) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!enableDragAndDrop || !draggedItem) return;
    
    if (targetFolder?.type === "file") {
      return;
    }
    
    if (targetFolder && targetFolder.type === "folder") {
      setDragOverFolderId(targetFolder.id);
    } else if (!targetFolder) {
      setIsDraggingOver(true);
    }
  };
  
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    setDragOverFolderId(null);
    setIsDraggingOver(false);
  };
  
  const handleDrop = (e: DragEvent<HTMLDivElement>, targetFolder?: FileType) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!enableDragAndDrop || !draggedItem) return;
    
    if (targetFolder?.type === "file") {
      toast({
        variant: "destructive",
        title: "Action impossible",
        description: "Vous ne pouvez pas déplacer un élément dans un fichier, uniquement dans un dossier."
      });
      
      setDragOverFolderId(null);
      setIsDraggingOver(false);
      setDraggedItem(null);
      return;
    }
    
    let targetFolderId = targetFolder?.id;
    
    if (!targetFolderId && !targetFolder) {
      targetFolderId = currentFolder;
    }
    
    setDragOverFolderId(null);
    setIsDraggingOver(false);
    
    if (draggedItem.type === "folder" && targetFolderId === draggedItem.id) {
      toast({
        variant: "destructive",
        title: "Action impossible",
        description: "Vous ne pouvez pas déplacer un dossier dans lui-même."
      });
      setDraggedItem(null);
      return;
    }
    
    if (draggedItem.type === "folder" && targetFolder?.type === "folder") {
      let current = targetFolder;
      let found = false;
      
      const checkIfDescendant = (folderId: string, potentialParentId: string): boolean => {
        const folder = files.find(f => f.id === folderId);
        if (!folder) return false;
        if (folder.parentId === potentialParentId) return true;
        if (folder.parentId === null) return false;
        return checkIfDescendant(folder.parentId, potentialParentId);
      };
      
      if (checkIfDescendant(targetFolder.id, draggedItem.id)) {
        toast({
          variant: "destructive",
          title: "Action impossible",
          description: "Vous ne pouvez pas déplacer un dossier dans l'un de ses sous-dossiers."
        });
        setDraggedItem(null);
        return;
      }
    }
    
    const updatedFiles = files.map(file => {
      if (file.id === draggedItem.id) {
        return { ...file, parentId: targetFolderId };
      }
      return file;
    });
    
    setFiles(updatedFiles);
    
    toast({
      title: "Élément déplacé",
      description: `"${draggedItem.name}" a été déplacé avec succès.`
    });
    
    setDraggedItem(null);
  };

  const handleEmptyAreaDrop = (e: DragEvent<HTMLDivElement>) => {
    handleDrop(e);
  };

  const renderFilesContainer = () => {
    if (sortedFiles.length === 0) {
      return (
        <div 
          className={`text-center py-10 text-muted-foreground border-2 border-dashed rounded-lg transition-colors ${isDraggingOver ? 'bg-muted/50 border-primary/50' : ''}`}
          onDragOver={(e) => enableDragAndDrop ? handleDragOver(e) : undefined}
          onDragLeave={enableDragAndDrop ? handleDragLeave : undefined}
          onDrop={enableDragAndDrop ? handleEmptyAreaDrop : undefined}
        >
          {isSearching 
            ? "Aucun résultat trouvé"
            : isDraggingOver 
              ? "Déposer ici pour déplacer dans ce dossier" 
              : "Ce dossier est vide"}
        </div>
      );
    }
    
    if (viewMode === "grid") {
      return (
        <div 
          className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 ${isDraggingOver ? 'p-2 border-2 border-dashed border-primary/50 rounded-lg' : ''}`}
          onDragOver={(e) => enableDragAndDrop ? handleDragOver(e) : undefined}
          onDragLeave={enableDragAndDrop ? handleDragLeave : undefined}
          onDrop={enableDragAndDrop ? handleEmptyAreaDrop : undefined}
        >
          {sortedFiles.map((file) => (
            <ContextMenu key={file.id}>
              <ContextMenuTrigger>
                <div
                  draggable={(enableDragAndDrop && (isEditable || userRole === "admin"))}
                  onDragStart={(e) => enableDragAndDrop ? handleDragStart(e, file) : undefined}
                  onDragOver={(e) => enableDragAndDrop ? handleDragOver(e, file) : undefined}
                  onDragLeave={enableDragAndDrop ? handleDragLeave : undefined}
                  onDrop={(e) => enableDragAndDrop ? handleDrop(e, file) : undefined}
                  onClick={() => 
                    file.type === "folder" 
                      ? navigateToFolder(file.id, file.name) 
                      : handlePreview(file)
                  }
                  className={`cursor-pointer hover:bg-muted transition-colors p-2 flex flex-col items-center justify-center rounded-md ${
                    dragOverFolderId === file.id && file.type === "folder" 
                      ? 'ring-2 ring-primary bg-muted/50' 
                      : ''
                  } ${draggedItem?.id === file.id ? 'opacity-50' : ''}`}
                >
                  {renderFileIcon(file)}
                  <p className="text-center truncate w-full text-sm">{file.name}</p>
                </div>
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
                <ContextMenuItem 
                  onClick={() => handleDownload(file)}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" /> Télécharger
                </ContextMenuItem>
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
      );
    } else {
      return (
        <div
          className={`${isDraggingOver ? 'p-2 border-2 border-dashed border-primary/50 rounded-lg' : ''}`}
          onDragOver={(e) => enableDragAndDrop ? handleDragOver(e) : undefined}
          onDragLeave={enableDragAndDrop ? handleDragLeave : undefined}
          onDrop={enableDragAndDrop ? handleEmptyAreaDrop : undefined}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-36 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedFiles.map((file) => (
                <TableRow 
                  key={file.id}
                  draggable={(enableDragAndDrop && (isEditable || userRole === "admin"))}
                  onDragStart={(e) => enableDragAndDrop ? handleDragStart(e, file) : undefined}
                  onDragOver={(e) => enableDragAndDrop ? handleDragOver(e, file) : undefined}
                  onDragLeave={enableDragAndDrop ? handleDragLeave : undefined}
                  onDrop={(e) => enableDragAndDrop ? handleDrop(e, file) : undefined}
                  className={`${
                    dragOverFolderId === file.id && file.type === "folder" 
                      ? 'ring-1 ring-primary bg-muted/50' 
                      : ''
                  } ${draggedItem?.id === file.id ? 'opacity-50' : ''}`}
                >
                  <TableCell>
                    {renderFileIcon(file)}
                  </TableCell>
                  <TableCell
                    className="font-medium cursor-pointer"
                    onClick={() => 
                      file.type === "folder" 
                        ? navigateToFolder(file.id, file.name) 
                        : handlePreview(file)
                    }
                  >
                    {file.name}
                  </TableCell>
                  <TableCell>{file.type === "folder" ? "Dossier" : "Fichier"}</TableCell>
                  <TableCell>{file.date || "-"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {file.type === "folder" ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigateToFolder(file.id, file.name)}
                        >
                          <Folder className="h-4 w-4 text-red-500" />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handlePreview(file)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDownload(file)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      {(isEditable || userRole === "admin") && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(file)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      );
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
                <DropdownMenuItem 
                  onClick={() => setSortMethod("name-asc")}
                  className="flex items-center gap-2"
                >
                  <ArrowDownAZ className="h-4 w-4" />
                  Trier par nom (A-Z)
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setSortMethod("name-desc")}
                  className="flex items-center gap-2"
                >
                  <ArrowUpAZ className="h-4 w-4" />
                  Trier par nom (Z-A)
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setSortMethod("date-desc")}
                  className="flex items-center gap-2"
                >
                  <CalendarRange className="h-4 w-4" />
                  Trier par date (récent)
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setSortMethod("date-asc")}
                  className="flex items-center gap-2"
                >
                  <CalendarRange className="h-4 w-4" />
                  Trier par date (ancien)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortMethod("type")}>
                  Trier par type
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <ToggleGroup type="single" value={viewMode} onValueChange={toggleViewMode}>
              <ToggleGroupItem value="grid" aria-label="Affichage en grille" title="Affichage en grille">
                <LayoutGrid className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="list" aria-label="Affichage en liste" title="Affichage en liste">
                <LayoutList className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
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

        {renderFilesContainer()}
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
