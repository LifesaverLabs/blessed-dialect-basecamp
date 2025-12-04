import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import { ArrowRight, BookOpen, MessageSquare, Sprout } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 text-sm text-secondary-foreground mb-4">
            <Sprout className="w-4 h-4" />
            <span>An experimental branch of American language</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Blesséd Dialect
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Evolving language toward increased harmlessness—helping us <strong className="text-foreground">Borlaug more</strong> together until everyone reaches the 100 and 120 year mark, so we can eventually <strong className="text-foreground">Borlaug Less Ed</strong>.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <NavLink to="/dictionary">
              <Button size="lg" className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
                <BookOpen className="w-5 h-5" />
                Explore Dictionary
                <ArrowRight className="w-4 h-4" />
              </Button>
            </NavLink>
            
            <NavLink to="/forum">
              <Button size="lg" variant="outline" className="gap-2">
                <MessageSquare className="w-5 h-5" />
                Join Forum
              </Button>
            </NavLink>
          </div>
        </div>
      </section>

      {/* Key Concepts */}
      <section className="bg-secondary/30 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Core Concepts</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-card p-8 rounded-lg border border-border shadow-sm">
                <h3 className="text-2xl font-semibold mb-4">Borlaug More</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To preserve and extend life. Named in honor of Norman Borlaug, whose work saved billions. Through language evolution, we aim to help everyone reach the 100 and 120 year milestones.
                </p>
              </div>
              
              <div className="bg-card p-8 rounded-lg border border-border shadow-sm">
                <h3 className="text-2xl font-semibold mb-4">Borlaug Less Ed (Blesséd)</h3>
                <p className="text-muted-foreground leading-relaxed">
                  The aspirational finish line—when everyone has reached longevity goals, we can focus less on preservation. We're still far from this stage, but it's the guiding vision.
                </p>
              </div>
              
              <div className="bg-card p-8 rounded-lg border border-border shadow-sm">
                <h3 className="text-2xl font-semibold mb-4">Calmunity⁵</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Community with emphasis on calm collaboration. The superscript 5 reminds us of the exponential power of collective, peaceful effort toward shared human goals.
                </p>
              </div>
              
              <div className="bg-card p-8 rounded-lg border border-border shadow-sm">
                <h3 className="text-2xl font-semibold mb-4">Bleeding B⁵leading Edge</h3>
                <p className="text-muted-foreground leading-relaxed">
                  This is experimental language evolution—unstable, rapid, consensus-driven. Changes happen when needs appear. Not all language is well-tested; it just needs to show promise.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">Our Mission</h2>
          
          <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
            <p>
              Blesséd Dialect is an <strong className="text-foreground">experimental, unstable branch</strong> of American language, designed to evolve rapidly as human needs emerge. We're building a linguistic framework that prioritizes harmlessness and life extension.
            </p>
            
            <p>
              Through community collaboration—your <strong className="text-foreground">affirms and dissents</strong> in our forum—we shape language that helps us reach deep human wellbeing. Our goal: help everyone reach 100 and 120 years by the end of this century.
            </p>
            
            <p>
              Currently, editorial rights rest with the original Blesséd author. As our calmunity⁵ grows and diversifies, governance will shift to <strong className="text-foreground">consensus and quorum management</strong>, guided by those willing to morph language radically for human needs.
            </p>
            
            <p className="text-sm italic border-l-4 border-primary pl-4 py-2">
              We aim to keep Blesséd dialect legible to other English and American speakers whenever possible. This is an extension of English for Humans and American for Humans—language that serves people first.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
