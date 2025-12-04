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

// Base entry schema for both words and phrases
const DictionaryEntrySchema = z.object({
  id: z.number().int().positive(),
  term: z.string().min(1),
  letter: z.string().length(1).regex(/[A-Z]/),
  definition: z.string().min(1),
  // TODO: Consider adding optional fields like:
  // etymology?: string
  // usage?: string
  // pronunciation?: string
  // crossReferences?: string[]
  // harmReductionNotes?: string
  // intentionalityRating?: 1 | 2 | 3 | 4 | 5
  // dateAdded?: string
  // contributors?: string[]
});

// Schema for words collection
export const WordsSchema = z.object({
  words: z.array(DictionaryEntrySchema),
});

// Schema for phrases collection
export const PhrasesSchema = z.object({
  phrases: z.array(DictionaryEntrySchema),
});

// TypeScript types derived from schemas
export type DictionaryEntry = z.infer<typeof DictionaryEntrySchema>;
export type WordsData = z.infer<typeof WordsSchema>;
export type PhrasesData = z.infer<typeof PhrasesSchema>;

// Validation function for words
export function validateWords(data: unknown): WordsData {
  return WordsSchema.parse(data);
}

// Validation function for phrases
export function validatePhrases(data: unknown): PhrasesData {
  return PhrasesSchema.parse(data);
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
    .charAt(0)
    .toUpperCase();

  return firstLetter === entry.letter;
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
