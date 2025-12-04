import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sprout, Users, BookOpen, Target } from "lucide-react";

const About = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">About Blessed Dialect</h1>
          <p className="text-xl text-muted-foreground">
            An experimental branch of American language, evolving toward increased harmlessness
          </p>
        </div>

        <section className="prose prose-lg max-w-none space-y-6">
          <div className="bg-accent/20 p-6 rounded-lg border-l-4 border-accent">
            <p className="text-lg font-semibold mb-2">⚠️ Experimental & Unstable</p>
            <p className="text-muted-foreground">
              Blessed Dialect is a <strong>b⁵leading edge</strong> language project. It can change rapidly when human
              needs appear. Not all language is well-tested when introduced—it just needs to show consensus promise of
              making a meaningful difference for longevity and harmlessness.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Our Origin Story</h2>
            <p className="text-muted-foreground leading-relaxed">
              Blessed Dialect emerged from a simple question:{" "}
              <em>Can evolving our language help us live longer, healthier lives?</em> It's an extension of the "English
              for Humans" and "American for Humans" efforts—language that serves people first.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              "Blessed" is short for <strong>Borlaug Less Ed</strong>—the state we're working toward where everyone
              reaches 100-120 years, and we can finally ease our intense focus on life preservation. Until then, we must{" "}
              <strong>Borlaug more</strong> together: evolve language, culture, and systems to reduce preventable death.
            </p>
          </div>
        </section>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Our Goal</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Help everyone reach 100 and 120 years by the end of this century through language evolution that reduces
              harm and extends life. Once achieved, we enter the Blessed (Borlaug Less Ed) stage.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Sprout className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>How We Evolve</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Through community consensus in our forum. Affirm proposals that help us Borlaug more, dissent when they
              don't align. Language changes when it shows promise of meaningful impact.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Governance Model</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Currently, editorial rights rest with the original Blessed author. As our calmunity⁵ grows and
              diversifies, governance will shift to consensus and quorum management by an editorial board willing to
              morph language for human needs.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Legibility Principle</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              We strive to keep Blessed dialect legible to other English and American speakers whenever possible.
              Radical changes must balance innovation with accessibility.
            </CardContent>
          </Card>
        </div>

        <section className="space-y-6">
          <h2 className="text-3xl font-bold">Key Terms</h2>

          <div className="space-y-4">
            <div className="bg-card p-6 rounded-lg border border-border">
              <h3 className="text-xl font-semibold mb-2">Borlaug (verb)</h3>
              <p className="text-muted-foreground">
                To preserve and extend life. Named after Norman Borlaug, whose agricultural innovations saved billions.{" "}
                <em>"We must Borlaug more until everyone reaches their potential lifespan."</em>
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg border border-border">
              <h3 className="text-xl font-semibold mb-2">Calmunity⁵ (noun)</h3>
              <p className="text-muted-foreground">
                Community with intentional emphasis on calm collaboration. The superscript 5 represents exponential
                collective power through peaceful cooperation toward shared human goals.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg border border-border">
              <h3 className="text-xl font-semibold mb-2">Borlaug Less Ed / Blessed (state)</h3>
              <p className="text-muted-foreground">
                The aspirational finish line—when humanity achieves sufficient longevity (everyone reaching 100-120
                years) that we can reduce the intensity of life-preservation efforts. The stage we're working toward.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-secondary/30 p-8 rounded-lg border border-border">
          <h2 className="text-2xl font-bold mb-4">Join the Calmunity⁵</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            We're building something unprecedented: language that evolves in real-time based on what helps humans
            thrive. Your voice matters.
          </p>
          <ul className="space-y-2 text-muted-foreground">
            <li>
              ✓ Explore the <strong className="text-foreground">Dictionary</strong> to learn existing terms
            </li>
            <li>
              ✓ Join the <strong className="text-foreground">Forum</strong> to propose new language
            </li>
            <li>
              ✓ <strong className="text-foreground">Affirm</strong> proposals that help us Borlaug more
            </li>
            <li>
              ✓ <strong className="text-foreground">Dissent</strong> when proposals don't align with our goals
            </li>
            <li>✓ Share feedback to refine our linguistic evolution</li>
          </ul>
          <p className="text-sm text-muted-foreground italic mt-6">
            Together, we're creating a language that serves life itself. Welcome to the bleeding B⁵leading edge.
          </p>
        </section>
      </div>
    </div>
  );
};

export default About;
