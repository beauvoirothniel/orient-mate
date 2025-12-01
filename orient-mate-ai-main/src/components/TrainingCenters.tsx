import { ExternalLink, MapPin, Star, BookOpen, Wrench, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const trainingData = {
  universities: [
    {
      name: "Université Polytechnique",
      location: "Paris, France",
      type: "Université",
      icon: BookOpen,
      rating: 4.8,
      programs: "Ingénierie, Sciences, Technologie",
      description: "Excellence académique en sciences et technologies avec des programmes de renommée mondiale."
    },
    {
      name: "Institut des Sciences Avancées",
      location: "Lyon, France",
      type: "Institut",
      icon: BookOpen,
      rating: 4.9,
      programs: "Recherche, Innovation, IA",
      description: "Centre d'excellence pour la recherche scientifique et l'innovation technologique."
    }
  ],
  training: [
    {
      name: "Centre de Formation Professionnelle",
      location: "Toulouse, France",
      type: "Centre de Formation",
      icon: Wrench,
      rating: 4.7,
      programs: "Reconversion, Digital, Management",
      description: "Formations certifiantes pour adultes en reconversion professionnelle."
    },
    {
      name: "OpenClassrooms",
      location: "En ligne",
      type: "Formation en ligne",
      icon: BookOpen,
      rating: 4.6,
      programs: "Développement, Design, Marketing",
      description: "Plateforme de formation en ligne avec diplômes reconnus par l'État."
    }
  ],
  community: [
    {
      name: "FabLab Paris",
      location: "Paris, France",
      type: "FabLab",
      icon: Wrench,
      rating: 4.8,
      programs: "Fabrication, Prototypage, Électronique",
      description: "Espace de fabrication numérique ouvert à tous avec équipements professionnels."
    },
    {
      name: "Bibliothèque Nationale",
      location: "Paris, France",
      type: "Bibliothèque",
      icon: BookOpen,
      rating: 4.9,
      programs: "Ressources, Recherche, Archives",
      description: "Collections exceptionnelles et espaces d'étude pour tous."
    },
    {
      name: "Communauté Tech",
      location: "En ligne & Local",
      type: "Communauté",
      icon: Users,
      rating: 4.7,
      programs: "Networking, Événements, Mentorat",
      description: "Réseau de professionnels pour échanger et progresser ensemble."
    }
  ]
};

const TrainingCard = ({ item }: { item: any }) => {
  const Icon = item.icon;
  
  return (
    <div className="group rounded-2xl overflow-hidden bg-card border border-border hover:shadow-card transition-all duration-300 hover:scale-[1.02]">
      <div className="relative h-48 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
        <Icon className="w-20 h-20 text-primary/60" />
        <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1 rounded-full bg-background/90 backdrop-blur-sm">
          <Star className="w-4 h-4 fill-accent text-accent" />
          <span className="font-semibold text-sm">{item.rating}</span>
        </div>
      </div>
      
      <div className="p-6 space-y-4">
        <div>
          <div className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium mb-2">
            {item.type}
          </div>
          <h3 className="text-xl font-bold mb-2">
            {item.name}
          </h3>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{item.location}</span>
          </div>
        </div>
        
        <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
          {item.programs}
        </div>
        
        <p className="text-muted-foreground text-sm">
          {item.description}
        </p>
        
        <Button variant="default" className="w-full gap-2 group/btn">
          En savoir plus
          <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
};

export const TrainingCenters = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            Explorez Toutes les Opportunités
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Universités, instituts, centres de formation, formations en ligne, fablabs, 
            bibliothèques et communautés - tout pour votre évolution professionnelle.
          </p>
        </div>
        
        <Tabs defaultValue="universities" className="w-full">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 mb-12">
            <TabsTrigger value="universities">Universités & Instituts</TabsTrigger>
            <TabsTrigger value="training">Formations</TabsTrigger>
            <TabsTrigger value="community">Communauté & Ressources</TabsTrigger>
          </TabsList>
          
          <TabsContent value="universities" className="mt-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {trainingData.universities.map((item, index) => (
                <TrainingCard key={index} item={item} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="training" className="mt-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {trainingData.training.map((item, index) => (
                <TrainingCard key={index} item={item} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="community" className="mt-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {trainingData.community.map((item, index) => (
                <TrainingCard key={index} item={item} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};
