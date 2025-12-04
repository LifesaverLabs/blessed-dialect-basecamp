import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Search } from "lucide-react";

// Sample dictionary data - this would come from a database in production
const dictionaryData = {
  words: [
    { id: 1, term: "Borlaug", letter: "B", definition: "To preserve and extend life, especially human life. Named after Norman Borlaug, whose agricultural innovations saved billions from starvation. Usage: 'We must Borlaug more until everyone reaches their longevity potential.'" },
    { id: 2, term: "B⁵lesséd", letter: "B", definition: "Short for 'Borlaug Less Éd'—the aspirational state when humanity has achieved sufficient longevity that we can focus less intensively on life preservation. The finish line for the current phase of human struggle against premature death." },
    { id: 3, term: "calmunity", letter: "C", definition: "Community with intentional emphasis on calm, peaceful collaboration. The superscript 5 (calmunity⁵) represents exponential collective power through non-anxious cooperation toward shared human wellbeing goals." },
    { id: 4, term: "langauge", letter: "L", definition: "A deliberate respelling of 'language'. Langauge is how our 'local area network' is 'gauged' or measured and understood. We're Sapir-Whorfists; by changing our langauge we can change what thots (thoughts) are regularly occurrent and recurrent. " },
    { id: 5, term: "thot", letter: "T", definition: "A deliberate simplified spelling of 'thought'. There's a slur against women in American this is also intended to overright. " },
    { id: 6, term: "y¹²³⁴⁵", letter: "Y", definition: "An incremental measure of how much thinking we self-assess or socially assess in a work of STEAM or calmunication. You can be supportive of a project by calling it a valuable calmunity⁵ contribution. You can also be self-critical or critical of a plan by saying it reflects a radically¹-limited view of the world. It's up to you how you thoughtfully⁵ label the world." },
  ],
  phrases: [
    { id: 7, term: "Borlaug more", letter: "B", definition: "The imperative to collectively work toward extending human lifespans and reducing preventable deaths. The active phase we're currently in, before reaching the Blessed stage." },
    { id: 8, term: "Borlaug Less Éd", letter: "B", definition: "Also 'Blesséd'. The future state when humanity has achieved sufficient progress in longevity (everyone reaching 100-120 years) that we can reduce the intensity of life-preservation efforts. The goal we're working toward." },
    { id: 9, term: "sugar overload", letter: "S", definition: "A condition of excessive refined sugar consumption leading to metabolic dysfunction and reduced lifespan. Part of Blesséd dialect's focus on identifying langauge around health behaviors that impact longevity." },
  ],
};

const Dictionary = () => {
  const [selectedEntry, setSelectedEntry] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("words");

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  
  const currentData = activeTab === "words" ? dictionaryData.words : dictionaryData.phrases;
  
  const filteredData = currentData.filter(entry => 
    entry.term.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const getEntriesByLetter = (letter: string) => {
    return filteredData.filter(entry => entry.letter === letter);
  };
  
  const hasEntriesForLetter = (letter: string) => {
    return filteredData.some(entry => entry.letter === letter);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">Dictionary</h1>
          <p className="text-lg text-muted-foreground">
            Explore words and phrases in Blesséd Dialect—evolving langauge for human flourishing.
          </p>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Search dictionary..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="words">Words</TabsTrigger>
            <TabsTrigger value="phrases">Phrases & Idioms</TabsTrigger>
          </TabsList>
          
          <TabsContent value="words" className="space-y-8 mt-8">
            {alphabet.map(letter => {
              const entries = getEntriesByLetter(letter);
              const hasEntries = hasEntriesForLetter(letter);
              
              return (
                <div key={letter} id={`letter-${letter}`} className="space-y-4">
                  <h2 
                    className={`text-3xl font-bold ${hasEntries ? 'text-primary cursor-pointer hover:text-primary/80' : 'text-muted-foreground/40'}`}
                    onClick={() => hasEntries && document.getElementById(`entries-${letter}`)?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    {letter}
                  </h2>
                  
                  {hasEntries && (
                    <div id={`entries-${letter}`} className="grid gap-3 pl-4">
                      {entries.map(entry => (
                        <button
                          key={entry.id}
                          onClick={() => setSelectedEntry(entry)}
                          className="text-left p-4 rounded-lg border border-border bg-card hover:bg-accent hover:border-accent transition-all"
                        >
                          <span className="font-semibold text-lg">{entry.term}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </TabsContent>
          
          <TabsContent value="phrases" className="space-y-8 mt-8">
            {alphabet.map(letter => {
              const entries = getEntriesByLetter(letter);
              const hasEntries = hasEntriesForLetter(letter);
              
              return (
                <div key={letter} id={`letter-${letter}`} className="space-y-4">
                  <h2 
                    className={`text-3xl font-bold ${hasEntries ? 'text-primary cursor-pointer hover:text-primary/80' : 'text-muted-foreground/40'}`}
                    onClick={() => hasEntries && document.getElementById(`entries-${letter}`)?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    {letter}
                  </h2>
                  
                  {hasEntries && (
                    <div id={`entries-${letter}`} className="grid gap-3 pl-4">
                      {entries.map(entry => (
                        <button
                          key={entry.id}
                          onClick={() => setSelectedEntry(entry)}
                          className="text-left p-4 rounded-lg border border-border bg-card hover:bg-accent hover:border-accent transition-all"
                        >
                          <span className="font-semibold text-lg">{entry.term}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </TabsContent>
        </Tabs>
      </div>

      <Sheet open={!!selectedEntry} onOpenChange={(open) => !open && setSelectedEntry(null)}>
        <SheetContent side="bottom" className="h-[85vh]">
          {selectedEntry && (
            <>
              <SheetHeader>
                <SheetTitle className="text-3xl">{selectedEntry.term}</SheetTitle>
                <SheetDescription className="text-base leading-relaxed pt-4">
                  {selectedEntry.definition}
                </SheetDescription>
              </SheetHeader>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Dictionary;
