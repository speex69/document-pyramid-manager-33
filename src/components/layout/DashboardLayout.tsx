
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const DashboardLayout = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated") === "true";
    setIsAuthenticated(authStatus);
    
    if (!authStatus) {
      toast({
        variant: "destructive",
        title: "Accès refusé",
        description: "Veuillez vous connecter pour accéder à cette page.",
      });
    }
  }, [toast]);

  // Show loading or redirect if authentication status is still being determined
  if (isAuthenticated === null) {
    return <div className="flex items-center justify-center h-screen">Chargement...</div>;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden md:flex h-full w-64 flex-col fixed inset-y-0">
        <Sidebar />
      </div>
      <div className="md:pl-64 flex-1 overflow-y-auto">
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
