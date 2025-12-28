import { useState } from "react";
import { NavLink } from "@/components/NavLink";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ArrowLeft, Calendar, BookOpen, ExternalLink, Video, FileText, Book, Headphones, Wrench, Users, MoreHorizontal, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getEntriesByDate, getWords, getPhrases } from "@/data/loader";
import type { DictionaryEntry, Contributor } from "@/data/schema";
import { MarkdownText } from "@/components/MarkdownText";
import { useDialect } from "@/contexts/DialectContext";

// Map reference types to icons
const referenceTypeIcons: Record<string, React.ReactNode> = {
  video: <Video className="w-4 h-4" />,
  article: <FileText className="w-4 h-4" />,
  paper: <FileText className="w-4 h-4" />,
  book: <Book className="w-4 h-4" />,
  podcast: <Headphones className="w-4 h-4" />,
  tool: <Wrench className="w-4 h-4" />,
  community: <Users className="w-4 h-4" />,
  other: <MoreHorizontal className="w-4 h-4" />,
};

// Helper to get contributor name (handles both string and object formats)
const getContributorName = (contributor: string | Contributor): string => {
  return typeof contributor === 'string' ? contributor : contributor.name;
};

// Helper to check if contributor has a story
const hasContributorStory = (contributor: string | Contributor): contributor is Contributor => {
  return typeof contributor === 'object' && !!contributor.story;
};

const Timeline = () => {
  const [selectedEntry, setSelectedEntry] = useState<DictionaryEntry | null>(null);
  const { dialectMode, toggleDialectMode } = useDialect();
  const entriesByDate = getEntriesByDate();

  // Helper to get definition based on dialect mode
  const getDefinition = (entry: DictionaryEntry) => {
    if (dialectMode === 'blessed') {
      return entry.definitionDialect || entry.definitionStandard || entry.definition || '';
    } else {
      return entry.definitionStandard || entry.definitionDialect || entry.definition || '';
    }
  };

  // Helper to get dialect label
  const getDialectLabel = () => {
    return dialectMode === 'blessed' ? 'Blesséd Dialekt' : 'American Standard';
  };
  const words = getWords();
  const phraseIds = new Set(getPhrases().map(p => p.id));

  // Group entries by date
  const entriesByDateGroup = entriesByDate.reduce((acc, entry) => {
    const date = entry.dateAdded || "Unknown";
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(entry);
    return acc;
  }, {} as Record<string, DictionaryEntry[]>);

  const isPhrase = (entry: DictionaryEntry) => phraseIds.has(entry.id);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <NavLink to="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </NavLink>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Calendar className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Dictionary⁵ Timeline</h1>
              <p className="text-muted-foreground">
                Reverse chronological list of all entries by date added
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-4 mb-8 text-sm text-muted-foreground">
            <span>{entriesByDate.length} entries with dates</span>
            <span>•</span>
            <span>{Object.keys(entriesByDateGroup).length} unique dates</span>
          </div>

          {/* Timeline */}
          <div className="space-y-8">
            {Object.entries(entriesByDateGroup).map(([date, entries]) => (
              <div key={date} className="border-l-2 border-primary/30 pl-6 relative">
                {/* Date marker */}
                <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-primary" />

                <h2 className="text-lg font-semibold mb-4 text-primary">{date}</h2>

                <div className="space-y-2">
                  {entries.map((entry) => (
                    <button
                      key={entry.id}
                      onClick={() => setSelectedEntry(entry)}
                      className="w-full text-left p-3 rounded-lg bg-card border border-border hover:border-primary/50 hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-xs px-2 py-0.5 rounded bg-secondary text-secondary-foreground">
                          {isPhrase(entry) ? "phrase" : "word"}
                        </span>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium">{entry.term}</h3>
                          <p className="text-sm text-muted-foreground truncate">
                            {entry.definitionStandard || entry.definition}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {entriesByDate.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No entries with dates found.</p>
              <p className="text-sm mt-2">Entries need a dateAdded field to appear here.</p>
            </div>
          )}
        </div>
      </div>

      {/* Entry Detail Drawer */}
      <Sheet open={!!selectedEntry} onOpenChange={(open) => !open && setSelectedEntry(null)}>
        <SheetContent side="bottom" className="h-[70vh] overflow-y-auto">
          {selectedEntry && (
            <>
              <SheetHeader>
                <SheetTitle className="text-3xl">{selectedEntry.term}</SheetTitle>
              </SheetHeader>

              <div className="space-y-6 pt-4">
                {/* Definition with Dialect Toggle */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">{getDialectLabel()}</h4>
                    {(selectedEntry.definitionStandard && selectedEntry.definitionDialect && selectedEntry.definitionStandard !== selectedEntry.definitionDialect) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleDialectMode}
                        className="gap-2 text-xs h-7"
                      >
                        <Languages className="w-3 h-3" />
                        Switch to {dialectMode === 'blessed' ? 'American' : 'Blesséd'}
                      </Button>
                    )}
                  </div>
                  <MarkdownText className="text-base leading-relaxed">{getDefinition(selectedEntry)}</MarkdownText>
                </div>

                {/* Etymology */}
                {selectedEntry.etymology && (
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-1">Etymology</h4>
                    <MarkdownText className="text-sm leading-relaxed italic">{selectedEntry.etymology}</MarkdownText>
                  </div>
                )}

                {/* Usage Examples */}
                {selectedEntry.usageExamples && selectedEntry.usageExamples.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">Usage Examples</h4>
                    <div className="space-y-3">
                      {selectedEntry.usageExamples.map((example, idx) => (
                        <div key={idx} className="pl-3 border-l-2 border-primary/30">
                          <MarkdownText className="text-xs text-muted-foreground mb-1">{example.context}</MarkdownText>
                          <p className="text-sm italic">"{example.example}"</p>
                          {example.translation && (
                            <MarkdownText className="text-xs text-muted-foreground mt-1">{`→ ${example.translation}`}</MarkdownText>
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
                          <MarkdownText>{note.note}</MarkdownText>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Additional Notes */}
                {selectedEntry.notes && (
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-1">Notes</h4>
                    <MarkdownText className="text-sm leading-relaxed">{selectedEntry.notes}</MarkdownText>
                  </div>
                )}

                {/* References */}
                {selectedEntry.references && selectedEntry.references.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">References</h4>
                    <div className="space-y-2">
                      {selectedEntry.references.map((ref, idx) => (
                        <a
                          key={idx}
                          href={ref.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-start gap-3 p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-accent/50 transition-colors"
                        >
                          <span className="text-primary mt-0.5">
                            {referenceTypeIcons[ref.type || 'other'] || <ExternalLink className="w-4 h-4" />}
                          </span>
                          <div className="flex-1 min-w-0">
                            <span className="font-medium text-sm">{ref.title}</span>
                            {ref.description && (
                              <p className="text-xs text-muted-foreground mt-0.5">{ref.description}</p>
                            )}
                          </div>
                          <ExternalLink className="w-3 h-3 text-muted-foreground shrink-0 mt-1" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contributors */}
                {selectedEntry.contributors && selectedEntry.contributors.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">Contributors</h4>
                    <div className="space-y-2">
                      {selectedEntry.contributors.map((contributor, idx) => (
                        <div key={idx} className={hasContributorStory(contributor) ? "pl-3 border-l-2 border-primary/30" : ""}>
                          <span className="font-medium text-sm">{getContributorName(contributor)}</span>
                          {hasContributorStory(contributor) && (
                            <p className="text-xs text-muted-foreground mt-0.5">{contributor.story}</p>
                          )}
                        </div>
                      ))}
                    </div>
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
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Timeline;
