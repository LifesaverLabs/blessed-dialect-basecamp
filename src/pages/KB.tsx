import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Keyboard as KeyboardIcon, Download, AlertTriangle, ExternalLink, Info, Github } from "lucide-react";
import { getKeyboardLayouts } from "@/data/loader";
import { MarkdownText } from "@/components/MarkdownText";

const KB = () => {
  const layouts = getKeyboardLayouts();

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "major":
        return "text-red-500 bg-red-500/10";
      case "moderate":
        return "text-yellow-500 bg-yellow-500/10";
      case "minor":
        return "text-blue-500 bg-blue-500/10";
      default:
        return "text-muted-foreground bg-muted";
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <KeyboardIcon className="w-10 h-10 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold">KB: Keyboard ⇌ Knowledge Base</h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Custom keyboard layouts for typing Blesséd Dialekt with full symbolic expressiveness
          </p>
        </div>

        {/* KB Philosophy Section */}
        <section className="bg-primary/5 p-6 rounded-lg border border-primary/20">
          <h2 className="text-xl font-semibold mb-3">The KB Connection: Keyboard ⇌ Knowledge Base</h2>
          <p className="text-muted-foreground mb-4">
            In Blesséd Dialekt, <strong>KB</strong> intentionally references both <strong>Keyboard</strong> and <strong>Knowledge Base</strong>. This is not a coincidence—your keyboard deeply⁵ affects and influences your readily available and expressible knowledge base.
          </p>
          <p className="text-muted-foreground mb-4">
            When certain symbols, characters, and expressions are easy to type, they become part of your active vocabulary. When they're buried behind modifier keys or unavailable entirely, they fade from use. <strong>Your KB shapes your KB.</strong>
          </p>
          <p className="text-muted-foreground">
            The CALM KB is designed to make Blesséd Dialekt's symbolic vocabulary—superscripts (⁵), special characters (æ, é, ñ), mathematical symbols, and expressive punctuation—immediately accessible, expanding what you can readily think and communicate.
          </p>
        </section>

        <section className="bg-accent/20 p-6 rounded-lg border-l-4 border-accent">
          <p className="text-lg font-semibold mb-2">About KB (Keyboard) Layouts</p>
          <p className="text-muted-foreground mb-4">
            The CALM KB is a <strong>Ukelele keyboard layout</strong> originally built for macOS. Ukelele is a Unicode keyboard layout editor that creates .keylayout files for macOS. The layout may need to be converted for Windows (.klc), Linux (.xkb), and other platforms.
          </p>
          <p className="text-muted-foreground">
            <strong>Want to help?</strong> If you can convert the macOS .keylayout file to other platforms, please contribute via our GitHub repository. We welcome ports to Windows, Linux, ChromeOS, iOS, and Android.
          </p>
        </section>

        {layouts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No keyboard layouts available yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {layouts.map((layout) => (
              <Card key={layout.id} className="overflow-hidden">
                <CardHeader className="bg-secondary/30">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <CardTitle className="text-2xl">{layout.name}</CardTitle>
                      <CardDescription className="mt-1">
                        Version {layout.version} • {layout.license} License
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <a href="/keyboard-layouts/Calm_KB_PathFinderv005rc1.keylayout" download>
                        <Button className="gap-2">
                          <Download className="w-4 h-4" />
                          Download .keylayout
                        </Button>
                      </a>
                      <a href={layout.repoUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" className="gap-2">
                          <Github className="w-4 h-4" />
                          Contribute
                        </Button>
                      </a>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  <p className="text-muted-foreground">{layout.description}</p>

                  {/* Platform Support */}
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-yellow-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium text-yellow-600 dark:text-yellow-400">macOS Only (Currently)</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          This is a Ukelele .keylayout file for macOS. Contributions to convert this layout for Windows (.klc via Microsoft Keyboard Layout Creator), Linux (.xkb), and mobile platforms are welcome.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Expressiveness Ratings */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-card border rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-1">Symbolic Expressiveness</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-secondary rounded-full h-2">
                          <div
                            className="bg-primary rounded-full h-2"
                            style={{ width: `${(layout.symbolicExpressiveness / 10) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{layout.symbolicExpressiveness}/10</span>
                      </div>
                    </div>
                    <div className="bg-card border rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-1">Core Functionality Retained</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-secondary rounded-full h-2">
                          <div
                            className="bg-primary rounded-full h-2"
                            style={{ width: `${(layout.coreFunctionalityRetained / 10) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{layout.coreFunctionalityRetained}/10</span>
                      </div>
                    </div>
                  </div>

                  {/* Installation Instructions */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">Installation Instructions</h3>
                    <div className="bg-card border rounded-lg p-4 prose prose-sm max-w-none dark:prose-invert">
                      <MarkdownText>{layout.installInstructions}</MarkdownText>
                    </div>
                  </div>

                  {/* Known Issues */}
                  {layout.knownIssues && layout.knownIssues.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-500" />
                        Known Issues
                      </h3>
                      <div className="space-y-3">
                        {layout.knownIssues.map((issue, index) => (
                          <div key={index} className="bg-card border rounded-lg p-4">
                            <div className="flex items-start gap-3">
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getSeverityColor(issue.severity)}`}>
                                {issue.severity}
                              </span>
                              <div className="flex-1">
                                <p className="text-sm">{issue.description}</p>
                                {issue.workaround && (
                                  <p className="text-sm text-muted-foreground mt-2">
                                    <strong>Workaround:</strong> {issue.workaround}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tradeoffs */}
                  {layout.tradeoffs && layout.tradeoffs.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold">Tradeoffs</h3>
                      <ul className="space-y-2">
                        {layout.tradeoffs.map((tradeoff, index) => (
                          <li key={index} className="flex items-start gap-2 text-muted-foreground">
                            <span className="text-primary mt-1">•</span>
                            {tradeoff}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Tags */}
                  {layout.tags && layout.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-4 border-t">
                      {layout.tags.map((tag) => (
                        <span key={tag} className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Metadata */}
                  <div className="text-xs text-muted-foreground pt-4 border-t space-y-1">
                    <p>Created: {layout.dateCreated} • Last Updated: {layout.dateUpdated}</p>
                    <p>Maintained by: {layout.maintainers?.join(", ")}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Contributing Section */}
        <section className="bg-secondary/30 p-8 rounded-lg border border-border">
          <h2 className="text-2xl font-bold mb-4">Contribute to KB Development</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            The CALM KB is an evolving project. We need help with:
          </p>
          <ul className="space-y-2 text-muted-foreground mb-6">
            <li>✓ <strong className="text-foreground">Windows conversion</strong> — Create .klc file using Microsoft Keyboard Layout Creator</li>
            <li>✓ <strong className="text-foreground">Linux conversion</strong> — Create .xkb configuration files</li>
            <li>✓ <strong className="text-foreground">Mobile layouts</strong> — iOS and Android custom keyboards</li>
            <li>✓ <strong className="text-foreground">Symbol optimization</strong> — Suggest better key placements for common Blesséd symbols</li>
            <li>✓ <strong className="text-foreground">Documentation</strong> — Visual key maps and cheat sheets</li>
          </ul>
          <a href="https://github.com/LifesaverLabs/blessed-dialect-basecamp" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="gap-2">
              <ExternalLink className="w-4 h-4" />
              View on GitHub
            </Button>
          </a>
        </section>

        {/* Ukelele Info */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">About Ukelele</h2>
          <p className="text-muted-foreground leading-relaxed">
            <a href="https://software.sil.org/ukelele/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Ukelele</a> is a Unicode keyboard layout editor for macOS. It allows you to create custom keyboard layouts with full Unicode support, including dead keys and multiple modifier states. The CALM KB was created with Ukelele to provide rich symbolic access for typing Blesséd Dialekt.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            The .keylayout file format is specific to macOS. To use this layout on other platforms, the key mappings need to be converted to platform-specific formats. This is a non-trivial task that requires understanding both the source format and the target platform's keyboard layout system.
          </p>
        </section>
      </div>
    </div>
  );
};

export default KB;
