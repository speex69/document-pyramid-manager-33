
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Home, Users, FileText, FolderOpen, LogOut, UserCircle } from "lucide-react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const [activeItem, setActiveItem] = useState("");
  const [userRole, setUserRole] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    const path = location.pathname.split("/")[1];
    setActiveItem(path === "" ? "dashboard" : path);
    
    const role = localStorage.getItem("userRole");
    setUserRole(role);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("clientId");
    navigate("/login");
  };

  // Déterminer les éléments du menu en fonction du rôle
  const getMenuItems = () => {
    const commonItems = [
      {
        name: "Accueil",
        path: "/dashboard",
        icon: <Home className="w-5 h-5" />,
        id: "dashboard"
      },
      {
        name: "Documents Pyramides",
        path: "/documents-pyramides",
        icon: <FileText className="w-5 h-5" />,
        id: "documents-pyramides"
      },
      {
        name: "Mes Documents",
        path: "/mes-documents",
        icon: <FolderOpen className="w-5 h-5" />,
        id: "mes-documents"
      },
    ];
    
    // Ajouter des éléments spécifiques en fonction du rôle
    if (userRole === "admin") {
      return [
        ...commonItems,
        {
          name: "Clients",
          path: "/clients",
          icon: <Users className="w-5 h-5" />,
          id: "clients"
        },
      ];
    } else {
      return [
        ...commonItems,
        {
          name: "Mon Profil",
          path: "/profile",
          icon: <UserCircle className="w-5 h-5" />,
          id: "profile"
        },
      ];
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className={cn("pb-12 h-full bg-sidebar", className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight text-sidebar-foreground">
            Portail Client
          </h2>
          <div className="space-y-1">
            {menuItems.map((item) => (
              <Button
                key={item.id}
                variant={activeItem === item.id ? "secondary" : "ghost"}
                size="sm"
                className={cn(
                  "w-full justify-start",
                  activeItem === item.id ? 
                  "bg-sidebar-accent text-sidebar-accent-foreground" : 
                  "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
                asChild
              >
                <Link to={item.path}>
                  {item.icon}
                  <span className="ml-2">{item.name}</span>
                </Link>
              </Button>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground mt-8"
            >
              <LogOut className="w-5 h-5" />
              <span className="ml-2">Déconnexion</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
