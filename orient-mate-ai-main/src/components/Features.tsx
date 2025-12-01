import { Brain, Target, TrendingUp, Users } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Analyse de Compétences IA",
    description: "Notre IA analyse vos compétences, expériences et documents pour créer votre profil complet et personnalisé."
  },
  {
    icon: Target,
    title: "Orientation Sur-Mesure",
    description: "Pour étudiants et reconversion professionnelle - trouvez la formation parfaitement adaptée à votre situation."
  },
  {
    icon: TrendingUp,
    title: "Suivi de Progression",
    description: "Construisez et suivez votre profil complet tout au long de votre parcours d'orientation."
  },
  {
    icon: Users,
    title: "Réseau Complet",
    description: "Universités, instituts, centres de formation, formations en ligne, fablabs, bibliothèques et communautés."
  }
];

export const Features = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            Comment ça marche ?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Notre plateforme utilise l'intelligence artificielle pour vous offrir 
            une expérience d'orientation unique et efficace.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group p-6 rounded-xl bg-card border border-border hover:shadow-card hover:scale-105 transition-all duration-300"
            >
              <div className="mb-4 p-3 rounded-lg bg-[image:var(--gradient-card)] w-fit group-hover:shadow-elegant transition-all duration-300">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
