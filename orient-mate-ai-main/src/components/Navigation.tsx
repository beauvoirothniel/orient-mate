import { GraduationCap, MessageSquare, Home, BarChart, User, Sun, Moon, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "@/components/theme-provider";
import { useEffect, useState } from "react";

export const Navigation = () => {
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border shadow-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-lg bg-[image:var(--gradient-hero)] shadow-elegant group-hover:shadow-glow transition-all duration-300">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-[image:var(--gradient-hero)] bg-clip-text text-transparent">
              OrientMate AI
            </span>
          </Link>
          
          <div className="flex items-center gap-2">
            <Link to="/">
              <Button 
                variant={location.pathname === "/" ? "default" : "ghost"} 
                size="sm"
                className="gap-2"
              >
                <Home className="w-4 h-4" />
                Accueil
              </Button>
            </Link>
            
            <Link to="/analysis">
              <Button 
                variant={location.pathname === "/analysis" ? "default" : "ghost"} 
                size="sm"
                className="gap-2"
              >
                <BarChart className="w-4 h-4" />
                Analyse
              </Button>
            </Link>
            
            <Link to="/chat">
              <Button 
                variant={location.pathname === "/chat" ? "default" : "ghost"} 
                size="sm"
                className="gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Chat IA
              </Button>
            </Link>
            
            <Link to="/profile">
              <Button 
                variant={location.pathname === "/profile" ? "default" : "ghost"} 
                size="sm"
                className="gap-2"
              >
                <User className="w-4 h-4" />
                Profil
              </Button>
            </Link>
            
            {/* Section utilisateur connecté/déconnecté */}
            <div className="flex items-center gap-2 ml-2 pl-2 border-l border-border">
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center">
                      <User className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-sm font-medium text-foreground">
                        {user.name?.split(' ')[0] || 'Utilisateur'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Connecté
                      </p>
                    </div>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={handleLogout}
                    className="gap-1 text-muted-foreground hover:text-destructive"
                    title="Déconnexion"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Déconnexion</span>
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="gap-2"
                    >
                      Connexion
                    </Button>
                  </Link>
                  
                  <Link to="/register">
                    <Button 
                      size="sm"
                      className="gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
                    >
                      S'inscrire
                    </Button>
                  </Link>
                </div>
              )}
              
              {/* Séparateur et thème */}
              <div className="h-6 w-px bg-border mx-1" />
              
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-muted-foreground" />
                <Switch 
                  checked={theme === "dark"} 
                  onCheckedChange={toggleTheme}
                  aria-label="Toggle theme"
                />
                <Moon className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};