import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            {/* Illustration/Icone */}
            <div className="mb-8">
              <div className="w-32 h-32 rounded-full bg-muted mx-auto flex items-center justify-center mb-4">
                <Search className="w-16 h-16 text-muted-foreground" />
              </div>
            </div>

            {/* Message d'erreur */}
            <Card className="border-border shadow-card">
              <CardHeader>
                <CardTitle className="text-6xl font-bold text-primary">404</CardTitle>
                <CardDescription className="text-xl">
                  Oops ! Page non trouvée
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground">
                  La page que vous recherchez n'existe pas ou a été déplacée.
                </p>
                
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>URL tentée : <code className="bg-muted px-2 py-1 rounded text-xs">{location.pathname}</code></p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                  <Button onClick={() => window.history.back()} className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Retour
                  </Button>
                  <Button onClick={() => window.location.href = '/'} className="gap-2">
                    <Home className="w-4 h-4" />
                    Page d'accueil
                  </Button>
                </div>

                {/* Navigation rapide */}
                <div className="pt-6 border-t border-border">
                  <p className="text-sm font-medium mb-3">Pages disponibles :</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Button variant="outline" size="sm" onClick={() => window.location.href = '/'}>
                      Accueil
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => window.location.href = '/analysis'}>
                      Analyse
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => window.location.href = '/chat'}>
                      Chat IA
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => window.location.href = '/profile'}>
                      Profil
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Message de support */}
            <div className="mt-8 p-4 bg-muted/30 rounded-lg border border-border">
              <p className="text-sm text-muted-foreground">
                Si vous pensez qu'il s'agit d'une erreur, contactez le support à{" "}
                <a href="mailto:support@orientmate-ai.com" className="text-primary hover:underline">
                  support@orientmate-ai.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotFound;