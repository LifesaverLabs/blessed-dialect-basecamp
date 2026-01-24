import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import { ArrowRight, BookOpen, MessageSquare, Sprout, FileText, Calendar } from "lucide-react";
import blessedLogo from "@/assets/blessed-dialect-logo.webp";
import { getEntriesByDate, getPhrases } from "@/data/loader";
import { useDialect } from "@/contexts/DialectContext";

const Home = () => {
  const latestEntries = getEntriesByDate(10);
  const phraseIds = new Set(getPhrases().map((p) => p.id));
  const isPhrase = (id: number) => phraseIds.has(id);
  const { dialectMode } = useDialect();

  // Helper to get definition based on dialect mode
  const getDefinition = (entry: { definitionDialect?: string; definitionStandard?: string; definition?: string }) => {
    if (dialectMode === "blessed") {
      return entry.definitionDialect || entry.definitionStandard || entry.definition || "";
    } else {
      return entry.definitionStandard || entry.definitionDialect || entry.definition || "";
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 text-sm text-secondary-foreground mb-4">
            <Sprout className="w-4 h-4" />
            <span>An experimental branch of American langauge</span>
          </div>

          <img
            src={blessedLogo}
            alt="BLED⁵ - Blesséd Dialect: The Flexible Future of English"
            className="mx-auto max-w-full w-auto h-auto"
            style={{ maxWidth: "500px" }}
          />

          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Evolving langauge toward increased harmlessness—helping us{" "}
            <strong className="text-foreground">Borlaug more</strong> together until everyone reaches the 100 and 120
            year mark, so we can eventually{" "}
            <strong className="text-foreground">
              <b>B</b>orlaug <b>less éd</b>
            </strong>
            , i.e. finally be <b>Blesséd</b>. .
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

          <div className="pt-6 border-t border-border/50 mt-2">
            <a
              href="https://github.com/LifesaverLabs/blessed-dialect-basecamp/blob/develop/quick_notes/need-documenting.md"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                <FileText className="w-4 h-4" />
                Initial Authors Backlog
              </Button>
            </a>
            <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
              A large backlog of critical terms awaiting full incorporation into the Digital Dictionary⁵.
            </p>
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
                  To preserve and extend life. Named in honor of Norman Borlaug, whose work saved billions. Through
                  langauge evolution, we aim to help everyone reach the 100 and 120 year milestones.
                </p>
              </div>

              <div className="bg-card p-8 rounded-lg border border-border shadow-sm">
                <h3 className="text-2xl font-semibold mb-4">Borlaug Less Éd (Blesséd)</h3>
                <p className="text-muted-foreground leading-relaxed">
                  The aspirational finish line—when everyone has reached longevity goals, we can focus less on
                  preservation. We're still far from this stage, but it's the guiding vision.
                </p>
              </div>

              <div className="bg-card p-8 rounded-lg border border-border shadow-sm">
                <h3 className="text-2xl font-semibold mb-4">Calmunity⁵</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Community with emphasis on calm collaboration. The superscript 5 reminds us of the exponential power
                  of collective, peaceful,{" "}
                  <a href="https://en.wikipedia.org/wiki/Five_whys">
                    "<u>five why</u>"
                  </a>{" "}
                  quality⁵-questioning toward shared human goals. Reduce to calmunity² or calmunity³ when you feel
                  there's still been insufficient thought.
                </p>
              </div>

              <div className="bg-card p-8 rounded-lg border border-border shadow-sm">
                <h3 className="text-2xl font-semibold mb-4">Bleeding B⁵leading Edge</h3>
                <p className="text-muted-foreground leading-relaxed">
                  This is experimental langauge evolution—unstable, rapid, consensus-driven. Changes happen when needs
                  appear. Not all langauge is well-tested; it just needs to show promise.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Words/Phrases */}
      {latestEntries.length > 0 && (
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Calendar className="w-6 h-6 text-primary" />
                <h2 className="text-3xl md:text-4xl font-bold">Latest Additions</h2>
              </div>
              <NavLink to="/timeline">
                <Button variant="outline" size="sm" className="gap-2">
                  View Full Timeline
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </NavLink>
            </div>

            <div className="space-y-3">
              {latestEntries.map((entry) => (
                <NavLink key={entry.id} to="/dictionary">
                  <div className="p-4 rounded-lg bg-card border border-border hover:border-primary/50 hover:bg-accent/50 transition-colors cursor-pointer">
                    <div className="flex items-start gap-3">
                      <span className="text-xs px-2 py-0.5 rounded bg-secondary text-secondary-foreground shrink-0">
                        {isPhrase(entry.id) ? "phrase" : "word"}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <h3 className="font-medium">{entry.term}</h3>
                          {entry.dateAdded && <span className="text-xs text-muted-foreground">{entry.dateAdded}</span>}
                        </div>
                        <p className="text-sm text-muted-foreground truncate mt-1">{getDefinition(entry)}</p>
                      </div>
                    </div>
                  </div>
                </NavLink>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Mission Statement */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">Our Mission</h2>

          <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
            <p>
              Blesséd Dialect is an <strong className="text-foreground">experimental, unstable branch</strong> of
              American langauge, designed to evolve rapidly as human needs emerge. We're building a linguistic framework
              that prioritizes harmlessness and life extension.
            </p>

            <p>
              Through community collaboration—your <strong className="text-foreground">affirms and dissents</strong> in
              our forum—we shape langauge that helps us reach deep human wellbeing. Our goal: help everyone reach 100
              and 120 years by the end of this century.
            </p>

            <p>
              Currently, editorial rights rest with the original Blesséd author. As our calmunity⁵ grows and
              diversifies, governance will shift to{" "}
              <strong className="text-foreground">consensus and quorum management</strong>, guided by those willing to
              morph langauge radically⁵ for human needs.
            </p>

            <p className="text-sm italic border-l-4 border-primary pl-4 py-2">
              We aim to keep Blesséd dialect legible to other English and American speakers whenever possible. This is
              an extension of English for Humans and American for Humans—langauge that serves people first.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
