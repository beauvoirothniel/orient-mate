//src/pages/Login.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, Brain, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Sauvegarder le token
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        
        // Rediriger vers la page d'accueil
        window.location.href = "/";
      } else {
        setError(data.error || "Erreur de connexion");
      }
    } catch (error) {
      setError("Erreur de connexion au serveur");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail("demo@orientmate.ai");
    setPassword("demo123");
    
    // Auto-submit après un délai pour montrer les champs remplis
    setTimeout(() => {
      const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
      handleLogin(fakeEvent);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-blue-50/30 to-purple-50/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8 pt-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center shadow-lg">
              <Brain className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              OrientMate AI
            </h1>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Plateforme d'Orientation Intelligente</span>
          </div>
          <p className="text-muted-foreground max-w-md mx-auto">
            Connectez-vous pour découvrir votre voie professionnelle idéale
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-2xl font-bold">Connexion</CardTitle>
              <CardDescription>
                Accédez à votre espace personnel d'orientation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Formulaire de connexion */}
              <form onSubmit={handleLogin} className="space-y-4">
                {error && (
                  <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <p className="text-destructive text-sm text-center">{error}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="votre@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Votre mot de passe"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-9 w-9"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md"
                  disabled={isLoading}
                >
                  {isLoading ? "Connexion..." : "Se connecter"}
                </Button>
              </form>

              {/* Séparateur */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    ou
                  </span>
                </div>
              </div>

              {/* Compte démo */}
              <Button 
                variant="outline" 
                className="w-full gap-2"
                onClick={handleDemoLogin}
                disabled={isLoading}
              >
                <Sparkles className="w-4 h-4" />
                Essayer la version démo
              </Button>

              {/* Lien d'inscription */}
              <div className="text-center pt-4">
                <p className="text-sm text-muted-foreground">
                  Pas encore de compte ?{" "}
                  <Link 
                    to="/register" 
                    className="text-primary hover:underline font-medium"
                  >
                    S'inscrire gratuitement
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Features rapides */}
          <div className="grid grid-cols-3 gap-4 mt-8 text-center">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                <Brain className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-xs text-muted-foreground">Analyse IA</p>
            </div>
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mx-auto">
                <Sparkles className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-xs text-muted-foreground">Recommandations</p>
            </div>
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mx-auto">
                <Eye className="w-4 h-4 text-purple-600" />
              </div>
              <p className="text-xs text-muted-foreground">Profil Évolutif</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}