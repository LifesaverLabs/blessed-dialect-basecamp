import { describe, it, expect } from 'vitest';
import {
  validateWords,
  validatePhrases,
  validateDictionaryData,
  checkDuplicateIds,
  validateLetterMatches,
  needsMigration,
  migrateEntry,
  type DictionaryEntry,
} from './schema';

describe('Dictionary Schema Validation', () => {
  describe('validateWords', () => {
    it('should validate a valid words structure', () => {
      const validData = {
        words: [
          {
            id: 1,
            term: 'test',
            letter: 'T',
            definitionStandard: 'A test word',
            definitionDialect: 'A test word in dialect',
          },
        ],
      };

      const result = validateWords(validData);
      expect(result.words).toHaveLength(1);
      expect(result.words[0].term).toBe('test');
    });

    it('should reject invalid words structure', () => {
      const invalidData = {
        words: [
          {
            id: 'not-a-number', // Invalid: should be number
            term: 'test',
            letter: 'T',
          },
        ],
      };

      expect(() => validateWords(invalidData)).toThrow();
    });

    it('should accept old schema format during migration', () => {
      const oldFormatData = {
        words: [
          {
            id: 1,
            term: 'test',
            letter: 'T',
            definition: 'Old format definition',
          },
        ],
      };

      const result = validateWords(oldFormatData);
      expect(result.words).toHaveLength(1);
    });
  });

  describe('validatePhrases', () => {
    it('should validate a valid phrases structure', () => {
      const validData = {
        phrases: [
          {
            id: 100,
            term: 'test phrase',
            letter: 'T',
            definitionStandard: 'A test phrase',
            definitionDialect: 'A test phrase in dialect',
          },
        ],
      };

      const result = validatePhrases(validData);
      expect(result.phrases).toHaveLength(1);
      expect(result.phrases[0].term).toBe('test phrase');
    });
  });

  describe('checkDuplicateIds', () => {
    it('should not throw for unique IDs', () => {
      const words: DictionaryEntry[] = [
        { id: 1, term: 'word1', letter: 'W', definitionStandard: 'def1', definitionDialect: 'def1' },
        { id: 2, term: 'word2', letter: 'W', definitionStandard: 'def2', definitionDialect: 'def2' },
      ];
      const phrases: DictionaryEntry[] = [
        { id: 3, term: 'phrase1', letter: 'P', definitionStandard: 'def3', definitionDialect: 'def3' },
      ];

      expect(() => checkDuplicateIds(words, phrases)).not.toThrow();
    });

    it('should throw for duplicate IDs', () => {
      const words: DictionaryEntry[] = [
        { id: 1, term: 'word1', letter: 'W', definitionStandard: 'def1', definitionDialect: 'def1' },
        { id: 2, term: 'word2', letter: 'W', definitionStandard: 'def2', definitionDialect: 'def2' },
      ];
      const phrases: DictionaryEntry[] = [
        { id: 2, term: 'phrase1', letter: 'P', definitionStandard: 'def3', definitionDialect: 'def3' }, // Duplicate ID
      ];

      expect(() => checkDuplicateIds(words, phrases)).toThrow(/Duplicate IDs found/);
    });
  });

  describe('validateLetterMatches', () => {
    it('should return true for matching letter', () => {
      const entry: DictionaryEntry = {
        id: 1,
        term: 'test',
        letter: 'T',
        definitionStandard: 'A test',
        definitionDialect: 'A test',
      };

      expect(validateLetterMatches(entry)).toBe(true);
    });

    it('should return false for non-matching letter', () => {
      const entry: DictionaryEntry = {
        id: 1,
        term: 'test',
        letter: 'X', // Wrong letter
        definitionStandard: 'A test',
        definitionDialect: 'A test',
      };

      expect(validateLetterMatches(entry)).toBe(false);
    });

    it('should handle superscripts in term correctly', () => {
      const entry: DictionaryEntry = {
        id: 1,
        term: '⁵test',
        letter: 'T', // Should match 't' after removing superscript
        definitionStandard: 'A test',
        definitionDialect: 'A test',
      };

      expect(validateLetterMatches(entry)).toBe(true);
    });
  });

  describe('needsMigration', () => {
    it('should return true for entries with old schema', () => {
      const oldEntry: DictionaryEntry = {
        id: 1,
        term: 'test',
        letter: 'T',
        definition: 'Old format',
      };

      expect(needsMigration(oldEntry)).toBe(true);
    });

    it('should return false for entries with new schema', () => {
      const newEntry: DictionaryEntry = {
        id: 1,
        term: 'test',
        letter: 'T',
        definitionStandard: 'Standard def',
        definitionDialect: 'Dialect def',
      };

      expect(needsMigration(newEntry)).toBe(false);
    });
  });

  describe('migrateEntry', () => {
    it('should migrate old format to new format', () => {
      const oldEntry: DictionaryEntry = {
        id: 1,
        term: 'test',
        letter: 'T',
        definition: 'Old definition',
      };

      const migrated = migrateEntry(oldEntry);

      expect(migrated.definitionStandard).toBe('Old definition');
      expect(migrated.definitionDialect).toBe('Old definition');
      expect(migrated.definition).toBeUndefined();
    });

    it('should not change already migrated entries', () => {
      const newEntry: DictionaryEntry = {
        id: 1,
        term: 'test',
        letter: 'T',
        definitionStandard: 'Standard',
        definitionDialect: 'Dialect',
      };

      const migrated = migrateEntry(newEntry);

      expect(migrated).toEqual(newEntry);
    });
  });

  describe('validateDictionaryData', () => {
    it('should validate complete dictionary data', () => {
      const wordsData = {
        words: [
          { id: 1, term: 'apple', letter: 'A', definitionStandard: 'A fruit', definitionDialect: 'A fruit' },
        ],
      };

      const phrasesData = {
        phrases: [
          { id: 2, term: 'break ice', letter: 'B', definitionStandard: 'Start conversation', definitionDialect: 'Start conversation' },
        ],
      };

      const result = validateDictionaryData(wordsData, phrasesData);

      expect(result.words).toHaveLength(1);
      expect(result.phrases).toHaveLength(1);
    });

    it('should throw on duplicate IDs across collections', () => {
      const wordsData = {
        words: [
          { id: 1, term: 'apple', letter: 'A', definitionStandard: 'A fruit', definitionDialect: 'A fruit' },
        ],
      };

      const phrasesData = {
        phrases: [
          { id: 1, term: 'break ice', letter: 'B', definitionStandard: 'Start', definitionDialect: 'Start' }, // Duplicate ID
        ],
      };

      expect(() => validateDictionaryData(wordsData, phrasesData)).toThrow(/Duplicate IDs/);
    });

    it('should throw on incorrect letter assignment', () => {
      const wordsData = {
        words: [
          { id: 1, term: 'apple', letter: 'Z', definitionStandard: 'A fruit', definitionDialect: 'A fruit' }, // Wrong letter
        ],
      };

      const phrasesData = {
        phrases: [],
      };

      expect(() => validateDictionaryData(wordsData, phrasesData)).toThrow(/Letter validation errors/);
    });
  });
});
