
import { useState, useEffect } from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
}

export function Logo({ size = "md" }: LogoProps) {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Default logo image (fictitious)
  const defaultLogoUrl = "/logo-default.svg"; 

  useEffect(() => {
    // Load custom logo if available
    const storedLogoUrl = localStorage.getItem("customLogoUrl");
    if (storedLogoUrl) {
      setLogoUrl(storedLogoUrl);
    }
    
    // Check user role
    const userRole = localStorage.getItem("userRole");
    setIsAdmin(userRole === "admin");
  }, []);

  const handleLogoClick = () => {
    if (!isAdmin) return;
    
    const newLogoUrl = prompt("Entrez l'URL de votre logo personnalisé:", logoUrl || "");
    if (newLogoUrl === null) return; // User cancelled
    
    if (newLogoUrl.trim() === "") {
      localStorage.removeItem("customLogoUrl");
      setLogoUrl(null);
    } else {
      localStorage.setItem("customLogoUrl", newLogoUrl);
      setLogoUrl(newLogoUrl);
    }
  };

  const sizeClasses = {
    sm: "h-6",
    md: "h-8",
    lg: "h-10"
  };

  return (
    <div 
      className={`flex items-center ${isAdmin ? 'cursor-pointer' : ''}`} 
      onClick={handleLogoClick}
      title={isAdmin ? "Cliquez pour modifier le logo" : ""}
    >
      <img 
        src={logoUrl || defaultLogoUrl} 
        alt="Logo" 
        className={`${sizeClasses[size]} max-w-full`} 
        onError={(e) => {
          // If custom logo fails to load, fall back to default logo
          const target = e.target as HTMLImageElement;
          if (target.src !== defaultLogoUrl) {
            target.src = defaultLogoUrl;
            // Also clear the stored URL since it's invalid
            if (logoUrl) {
              localStorage.removeItem("customLogoUrl");
              setLogoUrl(null);
            }
          }
        }} 
      />
      {isAdmin && (
        <span className="text-xs text-sidebar-foreground/50 ml-1">(Modifiable)</span>
      )}
    </div>
  );
}

export default Logo;
