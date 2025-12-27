import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Search, Check, Link } from "lucide-react";
import { getWords, getPhrases, getAllEntries } from "@/data/loader";
import type { DictionaryEntry } from "@/data/schema";
import { toast } from "sonner";

// Load dictionary data from JSON files
const dictionaryData = {
  words: getWords(),
  phrases: getPhrases(),
};

// Create a URL-safe slug from a term
const termToSlug = (term: string): string => {
  return encodeURIComponent(term.toLowerCase().replace(/\s+/g, '-'));
};

// Find entry by slug (case-insensitive, handles URL encoding)
const findEntryBySlug = (slug: string): DictionaryEntry | null => {
  const decodedSlug = decodeURIComponent(slug).toLowerCase().replace(/-/g, ' ');
  const allEntries = getAllEntries();

  // Try exact match first (with hyphen-to-space conversion)
  let entry = allEntries.find(e => e.term.toLowerCase() === decodedSlug);

  // If not found, try matching with original slug (hyphens preserved)
  if (!entry) {
    const slugWithHyphens = decodeURIComponent(slug).toLowerCase();
    entry = allEntries.find(e => e.term.toLowerCase() === slugWithHyphens);
  }

  // If still not found, try by ID
  if (!entry) {
    const id = parseInt(slug, 10);
    if (!isNaN(id)) {
      entry = allEntries.find(e => e.id === id);
    }
  }

  return entry || null;
};

const Dictionary = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedEntry, setSelectedEntry] = useState<DictionaryEntry | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("words");
  const [copied, setCopied] = useState(false);

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

  // Check if entry is a phrase
  const isPhrase = (entry: DictionaryEntry): boolean => {
    return dictionaryData.phrases.some(p => p.id === entry.id);
  };

  // Handle URL-based entry selection on mount and URL changes
  useEffect(() => {
    const entryParam = searchParams.get('entry');
    if (entryParam) {
      const entry = findEntryBySlug(entryParam);
      if (entry) {
        setSelectedEntry(entry);
        // Switch to correct tab if needed
        if (isPhrase(entry)) {
          setActiveTab('phrases');
        } else {
          setActiveTab('words');
        }
      }
    }
  }, [searchParams]);

  // Update URL when entry is selected
  const handleSelectEntry = (entry: DictionaryEntry) => {
    setSelectedEntry(entry);
    setSearchParams({ entry: termToSlug(entry.term) });
  };

  // Clear URL when drawer is closed
  const handleCloseDrawer = () => {
    setSelectedEntry(null);
    setSearchParams({});
  };

  // Copy shareable link to clipboard
  const copyShareableLink = async () => {
    if (!selectedEntry) return;

    const url = `${window.location.origin}/dictionary?entry=${termToSlug(selectedEntry.term)}`;

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
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
                          onClick={() => handleSelectEntry(entry)}
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
                          onClick={() => handleSelectEntry(entry)}
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

      <Sheet open={!!selectedEntry} onOpenChange={(open) => !open && handleCloseDrawer()}>
        <SheetContent side="bottom" className="h-[70vh] overflow-y-auto">
          {selectedEntry && (
            <>
              <SheetHeader>
                <div className="flex items-start justify-between gap-4">
                  <SheetTitle className="text-3xl">{selectedEntry.term}</SheetTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyShareableLink}
                    className="shrink-0 gap-2"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Link className="w-4 h-4" />
                        Share Link
                      </>
                    )}
                  </Button>
                </div>
              </SheetHeader>

              <div className="space-y-6 pt-4">
                {/* Dual Definition System */}
                {(selectedEntry.definitionStandard || selectedEntry.definitionDialect) ? (
                  <div className="space-y-4">
                    {selectedEntry.definitionStandard && (
                      <div>
                        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-1">Standard English</h4>
                        <p className="text-base leading-relaxed">{selectedEntry.definitionStandard}</p>
                      </div>
                    )}
                    {selectedEntry.definitionDialect && selectedEntry.definitionDialect !== selectedEntry.definitionStandard && (
                      <div>
                        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-1">Blesséd Dialekt</h4>
                        <p className="text-base leading-relaxed">{selectedEntry.definitionDialect}</p>
                      </div>
                    )}
                  </div>
                ) : selectedEntry.definition ? (
                  <p className="text-base leading-relaxed">{selectedEntry.definition}</p>
                ) : null}

                {/* Etymology */}
                {selectedEntry.etymology && (
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-1">Etymology</h4>
                    <p className="text-sm leading-relaxed italic">{selectedEntry.etymology}</p>
                  </div>
                )}

                {/* Usage Examples */}
                {selectedEntry.usageExamples && selectedEntry.usageExamples.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">Usage Examples</h4>
                    <div className="space-y-3">
                      {selectedEntry.usageExamples.map((example, idx) => (
                        <div key={idx} className="pl-3 border-l-2 border-primary/30">
                          <p className="text-xs text-muted-foreground mb-1">{example.context}</p>
                          <p className="text-sm italic">"{example.example}"</p>
                          {example.translation && (
                            <p className="text-xs text-muted-foreground mt-1">→ {example.translation}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Harm Reduction Notes */}
                {selectedEntry.harmReductionNotes && selectedEntry.harmReductionNotes.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">Harm Reduction Notes</h4>
                    <div className="space-y-2">
                      {selectedEntry.harmReductionNotes.map((note, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-md text-sm ${
                            note.severity === 'critical' ? 'bg-red-500/10 border border-red-500/30' :
                            note.severity === 'warning' ? 'bg-yellow-500/10 border border-yellow-500/30' :
                            note.severity === 'caution' ? 'bg-orange-500/10 border border-orange-500/30' :
                            'bg-blue-500/10 border border-blue-500/30'
                          }`}
                        >
                          <div className="flex gap-2 flex-wrap mb-1">
                            {note.categories.map((cat, catIdx) => (
                              <span key={catIdx} className="text-xs px-1.5 py-0.5 rounded bg-background/50">
                                {cat.replace(/_/g, ' ')}
                              </span>
                            ))}
                          </div>
                          <p>{note.note}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Additional Notes */}
                {selectedEntry.notes && (
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-1">Notes</h4>
                    <p className="text-sm leading-relaxed">{selectedEntry.notes}</p>
                  </div>
                )}

                {/* Metadata Footer */}
                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-4 border-t border-border">
                  {selectedEntry.intentionalityRating !== undefined && selectedEntry.intentionalityRating !== null && (
                    <span>Intentionality: {selectedEntry.intentionalityRating}/5</span>
                  )}
                  {selectedEntry.dateAdded && (
                    <span>Added: {selectedEntry.dateAdded}</span>
                  )}
                  {selectedEntry.contributors && selectedEntry.contributors.length > 0 && (
                    <span>Contributors: {selectedEntry.contributors.join(', ')}</span>
                  )}
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Dictionary;
