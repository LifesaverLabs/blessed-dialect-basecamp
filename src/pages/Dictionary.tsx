import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Search } from "lucide-react";
import { getWords, getPhrases } from "@/data/loader";
import type { DictionaryEntry } from "@/data/schema";

// Load dictionary data from JSON files
const dictionaryData = {
  words: getWords(),
  phrases: getPhrases(),
};

const Dictionary = () => {
  const [selectedEntry, setSelectedEntry] = useState<DictionaryEntry | null>(null);
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
