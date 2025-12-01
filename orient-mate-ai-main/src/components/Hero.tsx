import { Button } from "@/components/ui/button";
import { MessageSquare, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-orientation.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background image with overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-[image:var(--gradient-hero)] opacity-90" />
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 text-primary-foreground">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Intelligence Artificielle pour votre avenir</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground leading-tight">
            Votre Orientation Réinventée
            <span className="block mt-2 text-accent">avec l'IA OrientIA</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-2xl mx-auto leading-relaxed">
            Analyse de compétences, orientation personnalisée, et accès aux meilleures 
            formations - universités, instituts, centres, fablabs. Pour étudiants et reconversion professionnelle.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/chat">
              <Button variant="hero" size="lg" className="gap-2 group shadow-glow">
                <MessageSquare className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                Commencer l'orientation
              </Button>
            </Link>
            <Link to="/analysis">
              <Button size="lg" className="gap-2 bg-white/95 text-primary hover:bg-white hover:shadow-elegant border-2 border-white/20 font-semibold dark:bg-background/95 dark:text-primary dark:hover:bg-background">
                <Sparkles className="w-5 h-5" />
                Analyser mes compétences
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
};
