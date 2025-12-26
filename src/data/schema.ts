import { z } from "zod";

/**
 * Dictionary Entry Schema
 *
 * ⚠️ THIS SCHEMA IS MEANT TO EVOLVE
 *
 * We are actively fighting schema lock. Like Jaron Lanier warns about MIDI's
 * technical lock-in (128 fixed notes forever), we don't want this schema to
 * become a cage that limits langauge evolution.
 *
 * If you need additional fields (etymology, usage examples, pronunciation,
 * cross-references, harm reduction notes, etc.), PLEASE propose changes!
 *
 * See CONTRIBUTING.md section "Fighting Schema Lock" for how to evolve this.
 *
 * Current fields are minimal starting point. Your best ideas might not fit
 * this form—that's the schema's problem, not yours. Help us fix it.
 */

// Usage example schema - provides context for how term is used
const UsageExampleSchema = z.object({
  context: z.string().min(1), // Description of the situation
  example: z.string().min(1), // The actual usage example
  translation: z.string().optional(), // Optional American Standard English equivalent
});

// Harm reduction notes - critical safety and context information
// Can have multiple categories per note (1:N relationship between definition and notes)
const HarmReductionNoteSchema = z.object({
  categories: z
    .array(
      z.enum([
        "life_at_stake", // Physical safety, survival concerns
        "tissue_at_stake", // Bodily harm, health concerns
        "essential_liberty_at_stake", // Fundamental freedoms, autonomy
        "social_kontrakt_at_stake", // Community bonds, trust, relationships
        "property_at_stake", // Material resources, belongings
        "trigger_warning", // Psychological safety
        "context_required", // Needs situational understanding
        "potential_misinterpretation", // Easily misunderstood
        "power_dynamics", // Hierarchical or coercive implications
        "cultural_sensitivity", // Cultural context matters
        "reclaimed_term", // Term with complex history of reclamation
        "other", // Other considerations
      ])
    )
    .min(1), // At least one category required per note
  note: z.string().min(1),
  severity: z.enum(["info", "caution", "warning", "critical"]).optional(),
});

// Base entry schema for both words and phrases
const DictionaryEntrySchema = z.object({
  id: z.number().int().positive(),
  term: z.string().min(1),
  letter: z.string().length(1).regex(/[A-Z]/),

  // Dual definition system - Rosetta Stone approach
  // TODO: Make these REQUIRED (remove .optional()) once all existing entries are migrated
  // See TODO.md for migration tracking
  definitionStandard: z.string().min(1).optional(), // American Standard English definition
  definitionDialect: z.string().min(1).optional(), // Blesséd Dialekt definition (may be same as standard, or reveal deeper meaning)

  // Usage examples - show the word in action
  usageExamples: z.array(UsageExampleSchema).optional(),

  // Harm reduction and safety notes (1:N relationship - one definition can have many notes)
  harmReductionNotes: z.array(HarmReductionNoteSchema).optional(),

  // Optional enrichment fields
  etymology: z.string().optional(), // Word origin and evolution
  pronunciation: z.string().optional(), // How to pronounce (IPA or description)
  crossReferences: z.array(z.number()).optional(), // IDs of related entries
  intentionalityRating: z.number().int().min(1).max(5).nullable().optional(), // How intentional/deliberate is usage (1=casual, 5=highly intentional, null=not applicable)
  dateAdded: z.string().optional(), // ISO date string
  contributors: z.array(z.string()).optional(), // GitHub usernames or names
  notes: z.string().optional(), // Any additional notes

  // BACKWARD COMPATIBILITY: Keep old definition field as optional for migration period
  definition: z.string().optional(), // DEPRECATED: Use definitionStandard and definitionDialect instead
});

// Keyboard Layout (KB) Schema
// Manages symbolic keyboard layouts for expressing Blesséd Dialekt
const KeyboardLayoutIssueSchema = z.object({
  category: z.enum([
    "terminal_function_keys", // Problems with F1-F12, etc.
    "modifier_conflicts", // Issues with Ctrl, Alt, Cmd combinations
    "unicode_support", // Character rendering issues
    "application_compatibility", // Specific app conflicts
    "accessibility", // Screen reader or accessibility tool issues
    "performance", // Lag or responsiveness problems
    "other",
  ]),
  description: z.string().min(1),
  severity: z.enum(["minor", "moderate", "major", "blocking"]),
  affectedSystems: z.array(z.string()).optional(), // e.g., ["macOS", "Linux", "Windows"]
  workaround: z.string().optional(),
});

const KeyboardLayoutSchema = z.object({
  id: z.string().min(1), // Unique identifier (e.g., "calm-kb-v1")
  name: z.string().min(1), // Human-readable name
  version: z.string().regex(/^\d+\.\d+\.\d+$/), // Semantic versioning
  description: z.string().min(1),
  repoUrl: z.string().url(), // GitHub or other repo for debate and evolution
  downloadUrl: z.string().url().optional(), // Direct download link if available
  installInstructions: z.string().optional(),

  // Expressiveness and functionality ratings
  symbolicExpressiveness: z.number().int().min(1).max(10), // How expressive vs standard KB
  coreFunctionalityRetained: z.number().int().min(1).max(10), // How much standard functionality is preserved

  // Known issues and tradeoffs
  knownIssues: z.array(KeyboardLayoutIssueSchema).optional(),
  tradeoffs: z.array(z.string()).optional(), // General tradeoff descriptions

  // Metadata
  maintainers: z.array(z.string()).optional(),
  dateCreated: z.string().optional(),
  dateUpdated: z.string().optional(),
  license: z.string().optional(),
  tags: z.array(z.string()).optional(), // e.g., ["symbolic", "terminal-friendly", "beginner"]
});

// Schema for words collection
export const WordsSchema = z.object({
  words: z.array(DictionaryEntrySchema),
});

// Schema for phrases collection
export const PhrasesSchema = z.object({
  phrases: z.array(DictionaryEntrySchema),
});

// Schema for keyboard layouts collection
export const KeyboardLayoutsSchema = z.object({
  layouts: z.array(KeyboardLayoutSchema),
});

// TypeScript types derived from schemas
export type UsageExample = z.infer<typeof UsageExampleSchema>;
export type HarmReductionNote = z.infer<typeof HarmReductionNoteSchema>;
export type DictionaryEntry = z.infer<typeof DictionaryEntrySchema>;
export type WordsData = z.infer<typeof WordsSchema>;
export type PhrasesData = z.infer<typeof PhrasesSchema>;
export type KeyboardLayout = z.infer<typeof KeyboardLayoutSchema>;
export type KeyboardLayoutIssue = z.infer<typeof KeyboardLayoutIssueSchema>;
export type KeyboardLayoutsData = z.infer<typeof KeyboardLayoutsSchema>;

// Validation function for words
export function validateWords(data: unknown): WordsData {
  return WordsSchema.parse(data);
}

// Validation function for phrases
export function validatePhrases(data: unknown): PhrasesData {
  return PhrasesSchema.parse(data);
}

// Validation function for keyboard layouts
export function validateKeyboardLayouts(data: unknown): KeyboardLayoutsData {
  return KeyboardLayoutsSchema.parse(data);
}

// Check for duplicate IDs across both collections
export function checkDuplicateIds(
  words: DictionaryEntry[],
  phrases: DictionaryEntry[]
): void {
  const allIds = [...words.map((w) => w.id), ...phrases.map((p) => p.id)];
  const duplicates = allIds.filter((id, index) => allIds.indexOf(id) !== index);

  if (duplicates.length > 0) {
    throw new Error(
      `Duplicate IDs found: ${[...new Set(duplicates)].join(", ")}`
    );
  }
}

// Validate that letter matches first letter of term (accounting for special characters)
export function validateLetterMatches(entry: DictionaryEntry): boolean {
  const firstLetter = entry.term
    .replace(/^[⁰¹²³⁴⁵⁶⁷⁸⁹]+/, "") // Remove leading superscripts
    .replace(/^[µμ]/, "") // Remove leading micro/mu prefix (Greek µ and μ)
    .charAt(0)
    .toUpperCase();

  return firstLetter === entry.letter;
}

// Migration helper: Check if entry uses old schema format
export function needsMigration(entry: DictionaryEntry): boolean {
  return (
    entry.definition !== undefined &&
    (entry.definitionStandard === undefined ||
      entry.definitionDialect === undefined)
  );
}

// Migration helper: Convert old format to new format
export function migrateEntry(entry: DictionaryEntry): DictionaryEntry {
  if (needsMigration(entry)) {
    const { definition, ...rest } = entry;
    return {
      ...rest,
      definitionStandard: definition || "",
      definitionDialect: definition || "",
    };
  }
  return entry;
}

// Full validation of dictionary data
export function validateDictionaryData(
  wordsData: unknown,
  phrasesData: unknown
): { words: DictionaryEntry[]; phrases: DictionaryEntry[] } {
  const validatedWords = validateWords(wordsData);
  const validatedPhrases = validatePhrases(phrasesData);

  // Check for duplicate IDs
  checkDuplicateIds(validatedWords.words, validatedPhrases.phrases);

  // Validate letter matches for all entries
  const invalidWords = validatedWords.words.filter(
    (entry) => !validateLetterMatches(entry)
  );
  const invalidPhrases = validatedPhrases.phrases.filter(
    (entry) => !validateLetterMatches(entry)
  );

  if (invalidWords.length > 0 || invalidPhrases.length > 0) {
    const errors: string[] = [];
    invalidWords.forEach((entry) =>
      errors.push(`Word "${entry.term}" has incorrect letter "${entry.letter}"`)
    );
    invalidPhrases.forEach((entry) =>
      errors.push(`Phrase "${entry.term}" has incorrect letter "${entry.letter}"`)
    );
    throw new Error(`Letter validation errors:\n${errors.join("\n")}`);
  }

  return {
    words: validatedWords.words,
    phrases: validatedPhrases.phrases,
  };
}
