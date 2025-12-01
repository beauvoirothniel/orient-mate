import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { TrainingCenters } from "@/components/TrainingCenters";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Upload, MessageCircle, User, ArrowRight, Sparkles, Target, GraduationCap, Briefcase, FileText, ClipboardCheck } from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: Upload,
      title: "Analyse de CV IA",
      description: "Téléchargez votre CV et obtenez une analyse détaillée de vos compétences",
      color: "text-blue-500"
    },
    {
      icon: ClipboardCheck,
      title: "Questionnaire Personnalité",
      description: "Évaluez vos traits de personnalité pour une orientation plus précise",
      color: "text-green-500"
    },
    {
      icon: FileText,
      title: "Évaluation Compétences",
      description: "Testez vos compétences techniques via des questionnaires adaptatifs",
      color: "text-purple-500"
    },
    {
      icon: MessageCircle,
      title: "Conseiller Virtuel",
      description: "Discutez avec notre IA pour des conseils d'orientation personnalisés",
      color: "text-orange-500"
    },
    {
      icon: User,
      title: "Profil Évolutif",
      description: "Suivez votre évolution et recevez des recommandations adaptées",
      color: "text-pink-500"
    },
    {
      icon: GraduationCap,
      title: "Recommandations Formations",
      description: "Trouvez les formations idéales basées sur votre profil complet",
      color: "text-indigo-500"
    }
  ];

  const stats = [
    { number: "500+", label: "Analyses effectuées" },
    { number: "95%", label: "Précision de l'IA" },
    { number: "50+", label: "Domaines couverts" },
    { number: "24/7", label: "Disponibilité" }
  ];

  const handleGetStarted = () => {
    window.location.href = '/analysis';
  };

  const handleAnalyzeSkills = () => {
    window.location.href = '/analysis';
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section améliorée */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10 text-primary mb-6 border border-primary/20">
            <Sparkles className="w-5 h-5" />
            <span className="text-sm font-medium">Plateforme d'Orientation Intelligente</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Trouvez votre
            <span className="block bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              voie idéale
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
            L'IA analyse votre CV, personnalité et compétences pour vous orienter vers 
            <span className="font-semibold text-foreground"> les métiers et formations qui vous correspondent vraiment</span>
          </p>

          {/* Boutons améliorés avec meilleure visibilité */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button 
              onClick={handleGetStarted} 
              size="lg" 
              className="gap-3 px-8 py-4 text-lg font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Brain className="w-6 h-6" />
              Commencer l'orientation
              <ArrowRight className="w-5 h-5" />
            </Button>
            
            <Button 
              onClick={handleAnalyzeSkills} 
              size="lg" 
              variant="outline"
              className="gap-3 px-8 py-4 text-lg font-semibold border-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              <ClipboardCheck className="w-6 h-6" />
              Analyser mes compétences
            </Button>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary mb-1">{stat.number}</div>
                <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Features */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Une analyse complète de votre profil
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Combinaison d'analyse documentaire, évaluation de personnalité et tests de compétences
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-border bg-card hover:shadow-card transition-all duration-300 hover:translate-y-[-5px] group">
                  <CardHeader className="pb-4">
                    <div className={`w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-7 h-7 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section Comment ça marche - CORRIGÉE */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              4 étapes pour une orientation complète et personnalisée
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto text-xl font-bold shadow-lg">
                1
              </div>
              <h3 className="text-xl font-semibold">Documents</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Uploader CV, diplômes et certificats pour analyse IA
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto text-xl font-bold shadow-lg">
                2
              </div>
              <h3 className="text-xl font-semibold">Personnalité</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Questionnaire de personnalité pour comprendre vos traits
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto text-xl font-bold shadow-lg">
                3
              </div>
              <h3 className="text-xl font-semibold">Compétences</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Tests et évaluations de vos compétences techniques
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto text-xl font-bold shadow-lg">
                4
              </div>
              <h3 className="text-xl font-semibold">Recommandations</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Analyse complète et propositions personnalisées
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button 
              onClick={handleGetStarted} 
              size="lg" 
              className="gap-3 px-8 py-4 text-lg font-semibold"
            >
              <Brain className="w-6 h-6" />
              Commencer l'analyse gratuite
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      <Features />
      <TrainingCenters />
      
      <footer className="py-16 bg-muted/50 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                OrientMate AI
              </h3>
              <p className="text-muted-foreground text-sm">
                Votre assistant intelligent pour l'orientation scolaire et professionnelle.
              </p>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold">Navigation</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <a href="/" className="block hover:text-primary transition-colors">Accueil</a>
                <a href="/analysis" className="block hover:text-primary transition-colors">Analyse Complète</a>
                <a href="/chat" className="block hover:text-primary transition-colors">Chat IA</a>
                <a href="/profile" className="block hover:text-primary transition-colors">Profil</a>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold">Analyses</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <span className="block">Analyse de CV IA</span>
                <span className="block">Test de personnalité</span>
                <span className="block">Évaluation compétences</span>
                <span className="block">Recommandations</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold">Contact</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <span className="block">support@orientmate-ai.com</span>
                <span className="block">+33 1 23 45 67 89</span>
                <span className="block">Paris, France</span>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              © 2025 OrientMate AI. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;