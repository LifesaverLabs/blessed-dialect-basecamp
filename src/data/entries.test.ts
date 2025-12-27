import { describe, it, expect } from 'vitest';
import wordsData from './dictionary/words.json';
import phrasesData from './dictionary/phrases.json';
import { validateLetterMatches, type DictionaryEntry } from './schema';

/**
 * Per-Entry Validation Tests
 *
 * Individual test for each dictionary entry to ensure:
 * - Proper structure
 * - Letter matches term
 * - Has valid definition
 * - Required fields are present
 *
 * These tests provide granular visibility into which specific entries might have issues.
 */

const allWords = wordsData.words as DictionaryEntry[];
const allPhrases = phrasesData.phrases as DictionaryEntry[];

// Helper to validate individual entry
function validateEntry(entry: DictionaryEntry): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check ID
  if (!Number.isInteger(entry.id) || entry.id <= 0) {
    errors.push(`Invalid ID: ${entry.id}`);
  }

  // Check term
  if (!entry.term || entry.term.trim() === '') {
    errors.push('Empty or missing term');
  }

  // Check letter
  if (!entry.letter || !/^[A-Z]$/.test(entry.letter)) {
    errors.push(`Invalid letter: ${entry.letter}`);
  }

  // Check letter matches term
  if (!validateLetterMatches(entry)) {
    errors.push(`Letter "${entry.letter}" does not match term "${entry.term}"`);
  }

  // Check has definition
  const hasDefinition = entry.definitionStandard || entry.definitionDialect || entry.definition;
  if (!hasDefinition) {
    errors.push('No definition provided');
  }

  // Check definition is non-empty
  if (entry.definitionStandard && entry.definitionStandard.trim() === '') {
    errors.push('Empty definitionStandard');
  }
  if (entry.definitionDialect && entry.definitionDialect.trim() === '') {
    errors.push('Empty definitionDialect');
  }

  return { valid: errors.length === 0, errors };
}

describe('Per-Entry Validation - Words', () => {
  describe.each(allWords.map(w => [w.term, w.id, w]))('Word: "%s" (ID: %d)', (term, id, entry) => {
    const word = entry as DictionaryEntry;

    it('should have valid ID', () => {
      expect(Number.isInteger(word.id)).toBe(true);
      expect(word.id).toBeGreaterThan(0);
    });

    it('should have non-empty term', () => {
      expect(word.term).toBeDefined();
      expect(word.term.trim()).not.toBe('');
    });

    it('should have valid letter (A-Z)', () => {
      expect(word.letter).toMatch(/^[A-Z]$/);
    });

    it('should have letter matching term', () => {
      expect(validateLetterMatches(word)).toBe(true);
    });

    it('should have at least one definition', () => {
      const hasDefinition = word.definitionStandard || word.definitionDialect || word.definition;
      expect(hasDefinition).toBeTruthy();
    });
  });
});

describe('Per-Entry Validation - Phrases', () => {
  describe.each(allPhrases.map(p => [p.term, p.id, p]))('Phrase: "%s" (ID: %d)', (term, id, entry) => {
    const phrase = entry as DictionaryEntry;

    it('should have valid ID', () => {
      expect(Number.isInteger(phrase.id)).toBe(true);
      expect(phrase.id).toBeGreaterThan(0);
    });

    it('should have non-empty term', () => {
      expect(phrase.term).toBeDefined();
      expect(phrase.term.trim()).not.toBe('');
    });

    it('should have valid letter (A-Z)', () => {
      expect(phrase.letter).toMatch(/^[A-Z]$/);
    });

    it('should have letter matching term', () => {
      expect(validateLetterMatches(phrase)).toBe(true);
    });

    it('should have at least one definition', () => {
      const hasDefinition = phrase.definitionStandard || phrase.definitionDialect || phrase.definition;
      expect(hasDefinition).toBeTruthy();
    });
  });
});

describe('Entry Field Coverage Statistics', () => {
  const allEntries = [...allWords, ...allPhrases];

  it('should report field coverage', () => {
    const stats = {
      total: allEntries.length,
      withDefinitionStandard: allEntries.filter(e => e.definitionStandard).length,
      withDefinitionDialect: allEntries.filter(e => e.definitionDialect).length,
      withEtymology: allEntries.filter(e => e.etymology).length,
      withUsageExamples: allEntries.filter(e => e.usageExamples && e.usageExamples.length > 0).length,
      withHarmReductionNotes: allEntries.filter(e => e.harmReductionNotes && e.harmReductionNotes.length > 0).length,
      withIntentionalityRating: allEntries.filter(e => e.intentionalityRating !== undefined).length,
      withContributors: allEntries.filter(e => e.contributors && e.contributors.length > 0).length,
      withDateAdded: allEntries.filter(e => e.dateAdded).length,
      withNotes: allEntries.filter(e => e.notes).length,
      withCrossReferences: allEntries.filter(e => e.crossReferences && e.crossReferences.length > 0).length,
    };

    // These are statistical checks, all should pass
    expect(stats.total).toBeGreaterThan(100);
    expect(stats.withDefinitionStandard).toBeGreaterThan(50);
    expect(stats.withDefinitionDialect).toBeGreaterThan(50);
    expect(true).toBe(true); // Report passes
  });
});
