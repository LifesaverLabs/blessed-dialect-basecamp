import { describe, it, expect } from 'vitest';
import { validateDictionaryData } from './schema';
import wordsData from './dictionary/words.json';
import phrasesData from './dictionary/phrases.json';

describe('Dictionary Data Integrity', () => {
  it('should have valid words.json structure', () => {
    expect(wordsData).toBeDefined();
    expect(wordsData.words).toBeInstanceOf(Array);
  });

  it('should have valid phrases.json structure', () => {
    expect(phrasesData).toBeDefined();
    expect(phrasesData.phrases).toBeInstanceOf(Array);
  });

  it('should validate entire dictionary without errors', () => {
    expect(() => {
      validateDictionaryData(wordsData, phrasesData);
    }).not.toThrow();
  });

  it('should have unique IDs across all entries', () => {
    const allIds = [
      ...wordsData.words.map((w) => w.id),
      ...phrasesData.phrases.map((p) => p.id),
    ];

    const uniqueIds = new Set(allIds);
    expect(uniqueIds.size).toBe(allIds.length);
  });

  it('should have all required fields for each word', () => {
    wordsData.words.forEach((word) => {
      expect(word.id).toBeDefined();
      expect(typeof word.id).toBe('number');
      expect(word.term).toBeDefined();
      expect(typeof word.term).toBe('string');
      expect(word.letter).toBeDefined();
      expect(typeof word.letter).toBe('string');
      expect(word.letter).toMatch(/^[A-Z]$/);

      // Should have either old or new definition format
      const hasOldFormat = word.definition !== undefined;
      const hasNewFormat = word.definitionStandard !== undefined || word.definitionDialect !== undefined;
      expect(hasOldFormat || hasNewFormat).toBe(true);
    });
  });

  it('should have all required fields for each phrase', () => {
    phrasesData.phrases.forEach((phrase) => {
      expect(phrase.id).toBeDefined();
      expect(typeof phrase.id).toBe('number');
      expect(phrase.term).toBeDefined();
      expect(typeof phrase.term).toBe('string');
      expect(phrase.letter).toBeDefined();
      expect(typeof phrase.letter).toBe('string');
      expect(phrase.letter).toMatch(/^[A-Z]$/);

      // Should have either old or new definition format
      const hasOldFormat = phrase.definition !== undefined;
      const hasNewFormat = phrase.definitionStandard !== undefined || phrase.definitionDialect !== undefined;
      expect(hasOldFormat || hasNewFormat).toBe(true);
    });
  });

  it('should have positive integer IDs', () => {
    const allEntries = [...wordsData.words, ...phrasesData.phrases];

    allEntries.forEach((entry) => {
      expect(entry.id).toBeGreaterThan(0);
      expect(Number.isInteger(entry.id)).toBe(true);
    });
  });

  it('should have non-empty terms', () => {
    const allEntries = [...wordsData.words, ...phrasesData.phrases];

    allEntries.forEach((entry) => {
      expect(entry.term.trim().length).toBeGreaterThan(0);
    });
  });
});
