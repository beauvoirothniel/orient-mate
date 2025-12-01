import { Navigation } from "@/components/Navigation";
import { User, Mail, Phone, MapPin, Briefcase, GraduationCap, Award, Target, Calendar, TrendingUp, Brain, RefreshCw, FileText, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";

export default function Profile() {
  const [userProfile, setUserProfile] = useState(null);
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const profileResponse = await fetch('http://localhost:5001/api/auth/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        setUserProfile(profileData.user);
      }

      const historyResponse = await fetch('http://localhost:5001/api/upload/documents', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (historyResponse.ok) {
        const historyData = await historyResponse.json();
        if (historyData.success) {
          // Trier par date (plus récent en premier)
          const sortedHistory = historyData.documents.sort((a, b) => 
            new Date(b.created_at) - new Date(a.created_at)
          );
          setAnalysisHistory(sortedHistory);
        }
      }

    } catch (error) {
      console.error('Erreur chargement données:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLatestAnalysis = () => {
    return analysisHistory[0];
  };

  const handleViewDetails = (document) => {
    // Stocker l'analyse sélectionnée et rediriger vers une page de détails
    // ou afficher un modal avec les détails complets
    console.log('Voir détails:', document);
    alert(`Détails de l'analyse: ${document.filename}\nCompétences: ${document.analysis?.skills?.length}\nNiveau: ${document.analysis?.experience_level}`);
  };

  const getEvolutionStats = () => {
    if (analysisHistory.length < 2) return null;
    
    const latest = analysisHistory[0];
    const previous = analysisHistory[1];
    
    return {
      skillsGrowth: latest.analysis?.skills?.length - (previous.analysis?.skills?.length || 0),
      levelEvolution: latest.analysis?.experience_level !== previous.analysis?.experience_level 
        ? `${previous.analysis?.experience_level} → ${latest.analysis?.experience_level}`
        : null,
      newCertifications: latest.filename.includes('certificat') || latest.filename.includes('diplôme') ? 1 : 0
    };
  };

  const evolutionStats = getEvolutionStats();
  const latestAnalysis = getLatestAnalysis();

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-24 pb-20">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="flex justify-center items-center h-64">
              <RefreshCw className="w-8 h-8 animate-spin text-primary" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Mon Profil Évolutif</h1>
            <p className="text-muted-foreground">
              Votre profil s'enrichit à chaque nouvelle analyse
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Colonne gauche - Informations personnelles */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader className="text-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-primary to-primary/60 mx-auto mb-4 flex items-center justify-center shadow-elegant">
                    <User className="w-12 h-12 text-primary-foreground" />
                  </div>
                  <CardTitle>{userProfile?.name || 'Utilisateur'}</CardTitle>
                  <CardDescription className="text-center">
                    {userProfile?.bio || 'Aucune bio renseignée'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{userProfile?.email || 'Non renseigné'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{userProfile?.phone || 'Non renseigné'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{userProfile?.location || 'Non renseigné'}</span>
                  </div>
                  <Separator className="my-4" />
                  <Button className="w-full">Modifier le profil</Button>
                </CardContent>
              </Card>

              {/* Évolution du profil */}
              {evolutionStats && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-500" />
                      Évolution Récente
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {evolutionStats.skillsGrowth > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Nouvelles compétences</span>
                        <Badge variant="default">+{evolutionStats.skillsGrowth}</Badge>
                      </div>
                    )}
                    {evolutionStats.levelEvolution && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Niveau</span>
                        <Badge variant="secondary">{evolutionStats.levelEvolution}</Badge>
                      </div>
                    )}
                    {evolutionStats.newCertifications > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Nouveaux certificats</span>
                        <Badge variant="outline">+{evolutionStats.newCertifications}</Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Statistiques */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">📈 Statistiques</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Analyses complètes</span>
                    <Badge variant="default">{analysisHistory.length}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Compétences totales</span>
                    <Badge variant="secondary">
                      {latestAnalysis?.analysis?.skills?.length || 0}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Niveau actuel</span>
                    <Badge variant="outline">
                      {latestAnalysis?.analysis?.experience_level || 'N/A'}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Dernière analyse</span>
                    <span className="text-xs text-muted-foreground">
                      {latestAnalysis ? new Date(latestAnalysis.created_at).toLocaleDateString('fr-FR') : 'Jamais'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Colonne droite - Contenu principal */}
            <div className="lg:col-span-2 space-y-6">
              <Tabs defaultValue="evolution" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="evolution">Évolution</TabsTrigger>
                  <TabsTrigger value="history">Historique</TabsTrigger>
                  <TabsTrigger value="recommendations">Recommandations</TabsTrigger>
                </TabsList>

                {/* Onglet Évolution */}
                <TabsContent value="evolution" className="space-y-6 mt-6">
                  {latestAnalysis ? (
                    <>
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Brain className="w-5 h-5 text-primary" />
                            Profil Actuel - Dernière analyse
                          </CardTitle>
                          <CardDescription>
                            Analysé le {new Date(latestAnalysis.created_at).toLocaleDateString('fr-FR')}
                            {analysisHistory.length > 1 && ` (${analysisHistory.length} analyses au total)`}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          {/* Compétences actuelles */}
                          {latestAnalysis.analysis?.skills?.map((skill, index) => (
                            <div key={index} className="space-y-2">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                  <span className="font-medium">{skill.name}</span>
                                  <Badge variant="outline" className="text-xs">{skill.category}</Badge>
                                </div>
                                <span className="text-sm font-semibold text-primary">{skill.level}%</span>
                              </div>
                              <Progress value={skill.level} className="h-2" />
                            </div>
                          ))}
                        </CardContent>
                      </Card>

                      {/* Domaine et synthèse */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Domaine principal</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Badge variant="secondary" className="text-lg mb-3">
                            {latestAnalysis.analysis?.detected_field || 'Général'}
                          </Badge>
                          <p className="text-sm text-muted-foreground">
                            {latestAnalysis.analysis?.summary}
                          </p>
                        </CardContent>
                      </Card>
                    </>
                  ) : (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground mb-4">
                          Aucune analyse disponible
                        </p>
                        <Button onClick={() => window.location.href = '/analysis'}>
                          Faire ma première analyse
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                {/* Onglet Historique */}
                <TabsContent value="history" className="space-y-6 mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Historique des analyses</CardTitle>
                      <CardDescription>
                        {analysisHistory.length} analyse(s) effectuée(s) - Votre profil évolue dans le temps
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {analysisHistory.length > 0 ? (
                        <div className="space-y-4">
                          {analysisHistory.map((doc, index) => (
                            <div 
                              key={doc.id} 
                              className="p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer"
                              onClick={() => handleViewDetails(doc)}
                            >
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <FileText className="w-4 h-4 text-muted-foreground" />
                                    <h4 className="font-medium">{doc.filename}</h4>
                                    {index === 0 && (
                                      <Badge variant="default" className="text-xs">
                                        Actuel
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      {new Date(doc.created_at).toLocaleDateString('fr-FR')}
                                    </span>
                                    <span>•</span>
                                    <span>{doc.analysis?.skills?.length || 0} compétences</span>
                                    <span>•</span>
                                    <Badge variant="outline" className="text-xs">
                                      {doc.analysis?.experience_level || 'N/A'}
                                    </Badge>
                                  </div>
                                  {doc.analysis?.detected_field && (
                                    <div className="mt-2">
                                      <Badge variant="secondary" className="text-xs">
                                        {doc.analysis.detected_field}
                                      </Badge>
                                    </div>
                                  )}
                                </div>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewDetails(doc);
                                  }}
                                >
                                  Voir détails
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">Aucune analyse dans l'historique</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Onglet Recommendations */}
                <TabsContent value="recommendations" className="space-y-6 mt-6">
                  {latestAnalysis ? (
                    <Card>
                      <CardHeader>
                        <CardTitle>Recommandations personnalisées</CardTitle>
                        <CardDescription>
                          Basées sur votre profil complet et son évolution
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {latestAnalysis.analysis?.suggested_roles?.map((role, index) => (
                            <div key={index} className="p-4 rounded-lg bg-muted border border-border hover:border-primary/50 transition-colors">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <h4 className="font-medium mb-1">{role}</h4>
                                  <div className="flex items-center gap-2 mt-2">
                                    <Badge variant="secondary" className="text-xs">
                                      {index === 0 ? "Top recommandation" : "Recommandé"}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                      Correspond à votre évolution récente
                                    </span>
                                  </div>
                                </div>
                                <Button size="sm">
                                  Explorer
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <p className="text-muted-foreground">
                          Analysez votre profil pour obtenir des recommandations personnalisées
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}