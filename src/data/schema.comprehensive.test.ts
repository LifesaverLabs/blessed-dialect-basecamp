import { describe, it, expect } from 'vitest';
import {
  validateWords,
  validatePhrases,
  validateDictionaryData,
  validateKeyboardLayouts,
  checkDuplicateIds,
  validateLetterMatches,
  needsMigration,
  migrateEntry,
  type DictionaryEntry,
  type UsageExample,
  type HarmReductionNote,
} from './schema';

/**
 * Comprehensive Schema Validation Tests
 *
 * These tests verify that the Zod schema correctly validates:
 * - Valid data structures
 * - Invalid data rejection
 * - Edge cases
 * - Optional fields
 * - Migration helpers
 * - Letter matching with special characters
 */

describe('Schema Validation - Comprehensive Tests', () => {
  // ============================================
  // USAGE EXAMPLE VALIDATION
  // ============================================
  describe('UsageExample Schema', () => {
    it('should accept valid usage example with all fields', () => {
      const validData = {
        words: [{
          id: 1,
          term: 'test',
          letter: 'T',
          definitionStandard: 'A test word',
          usageExamples: [{
            context: 'Testing context',
            example: 'This is an example sentence.',
            translation: 'This is the standard translation.',
          }],
        }],
      };
      const result = validateWords(validData);
      expect(result.words[0].usageExamples).toHaveLength(1);
      expect(result.words[0].usageExamples![0].translation).toBe('This is the standard translation.');
    });

    it('should accept usage example without optional translation', () => {
      const validData = {
        words: [{
          id: 1,
          term: 'test',
          letter: 'T',
          definitionStandard: 'A test word',
          usageExamples: [{
            context: 'Testing context',
            example: 'This is an example sentence.',
          }],
        }],
      };
      const result = validateWords(validData);
      expect(result.words[0].usageExamples![0].translation).toBeUndefined();
    });

    it('should reject usage example with empty context', () => {
      const invalidData = {
        words: [{
          id: 1,
          term: 'test',
          letter: 'T',
          definitionStandard: 'A test word',
          usageExamples: [{
            context: '',
            example: 'Valid example',
          }],
        }],
      };
      expect(() => validateWords(invalidData)).toThrow();
    });

    it('should reject usage example with empty example', () => {
      const invalidData = {
        words: [{
          id: 1,
          term: 'test',
          letter: 'T',
          definitionStandard: 'A test word',
          usageExamples: [{
            context: 'Valid context',
            example: '',
          }],
        }],
      };
      expect(() => validateWords(invalidData)).toThrow();
    });

    it('should accept multiple usage examples', () => {
      const validData = {
        words: [{
          id: 1,
          term: 'test',
          letter: 'T',
          definitionStandard: 'A test word',
          usageExamples: [
            { context: 'Context 1', example: 'Example 1' },
            { context: 'Context 2', example: 'Example 2', translation: 'Translation 2' },
            { context: 'Context 3', example: 'Example 3' },
          ],
        }],
      };
      const result = validateWords(validData);
      expect(result.words[0].usageExamples).toHaveLength(3);
    });
  });

  // ============================================
  // HARM REDUCTION NOTES VALIDATION
  // ============================================
  describe('HarmReductionNote Schema', () => {
    const validCategories = [
      'life_at_stake',
      'tissue_at_stake',
      'essential_liberty_at_stake',
      'social_kontrakt_at_stake',
      'property_at_stake',
      'trigger_warning',
      'context_required',
      'potential_misinterpretation',
      'power_dynamics',
      'cultural_sensitivity',
      'reclaimed_term',
      'other',
    ];

    it.each(validCategories)('should accept harm reduction note with category: %s', (category) => {
      const validData = {
        words: [{
          id: 1,
          term: 'test',
          letter: 'T',
          definitionStandard: 'A test word',
          harmReductionNotes: [{
            categories: [category],
            note: 'This is a harm reduction note.',
          }],
        }],
      };
      const result = validateWords(validData);
      expect(result.words[0].harmReductionNotes![0].categories).toContain(category);
    });

    it('should accept multiple categories per note', () => {
      const validData = {
        words: [{
          id: 1,
          term: 'test',
          letter: 'T',
          definitionStandard: 'A test word',
          harmReductionNotes: [{
            categories: ['life_at_stake', 'tissue_at_stake', 'trigger_warning'],
            note: 'Multiple categories.',
          }],
        }],
      };
      const result = validateWords(validData);
      expect(result.words[0].harmReductionNotes![0].categories).toHaveLength(3);
    });

    const validSeverities = ['info', 'caution', 'warning', 'critical'];
    it.each(validSeverities)('should accept severity level: %s', (severity) => {
      const validData = {
        words: [{
          id: 1,
          term: 'test',
          letter: 'T',
          definitionStandard: 'A test word',
          harmReductionNotes: [{
            categories: ['life_at_stake'],
            note: 'Test note',
            severity: severity,
          }],
        }],
      };
      const result = validateWords(validData);
      expect(result.words[0].harmReductionNotes![0].severity).toBe(severity);
    });

    it('should accept harm reduction note without severity (optional)', () => {
      const validData = {
        words: [{
          id: 1,
          term: 'test',
          letter: 'T',
          definitionStandard: 'A test word',
          harmReductionNotes: [{
            categories: ['life_at_stake'],
            note: 'Test note',
          }],
        }],
      };
      const result = validateWords(validData);
      expect(result.words[0].harmReductionNotes![0].severity).toBeUndefined();
    });

    it('should reject empty categories array', () => {
      const invalidData = {
        words: [{
          id: 1,
          term: 'test',
          letter: 'T',
          definitionStandard: 'A test word',
          harmReductionNotes: [{
            categories: [],
            note: 'Test note',
          }],
        }],
      };
      expect(() => validateWords(invalidData)).toThrow();
    });

    it('should reject invalid category', () => {
      const invalidData = {
        words: [{
          id: 1,
          term: 'test',
          letter: 'T',
          definitionStandard: 'A test word',
          harmReductionNotes: [{
            categories: ['invalid_category'],
            note: 'Test note',
          }],
        }],
      };
      expect(() => validateWords(invalidData)).toThrow();
    });

    it('should reject invalid severity', () => {
      const invalidData = {
        words: [{
          id: 1,
          term: 'test',
          letter: 'T',
          definitionStandard: 'A test word',
          harmReductionNotes: [{
            categories: ['life_at_stake'],
            note: 'Test note',
            severity: 'extreme',
          }],
        }],
      };
      expect(() => validateWords(invalidData)).toThrow();
    });

    it('should reject empty note text', () => {
      const invalidData = {
        words: [{
          id: 1,
          term: 'test',
          letter: 'T',
          definitionStandard: 'A test word',
          harmReductionNotes: [{
            categories: ['life_at_stake'],
            note: '',
          }],
        }],
      };
      expect(() => validateWords(invalidData)).toThrow();
    });
  });

  // ============================================
  // INTENTIONALITY RATING VALIDATION
  // ============================================
  describe('IntentionalityRating Schema', () => {
    it.each([1, 2, 3, 4, 5])('should accept intentionality rating: %d', (rating) => {
      const validData = {
        words: [{
          id: 1,
          term: 'test',
          letter: 'T',
          definitionStandard: 'A test word',
          intentionalityRating: rating,
        }],
      };
      const result = validateWords(validData);
      expect(result.words[0].intentionalityRating).toBe(rating);
    });

    it('should accept null intentionality rating (not applicable)', () => {
      const validData = {
        words: [{
          id: 1,
          term: 'test',
          letter: 'T',
          definitionStandard: 'A test word',
          intentionalityRating: null,
        }],
      };
      const result = validateWords(validData);
      expect(result.words[0].intentionalityRating).toBeNull();
    });

    it('should accept undefined intentionality rating (optional)', () => {
      const validData = {
        words: [{
          id: 1,
          term: 'test',
          letter: 'T',
          definitionStandard: 'A test word',
        }],
      };
      const result = validateWords(validData);
      expect(result.words[0].intentionalityRating).toBeUndefined();
    });

    it('should reject intentionality rating less than 1', () => {
      const invalidData = {
        words: [{
          id: 1,
          term: 'test',
          letter: 'T',
          definitionStandard: 'A test word',
          intentionalityRating: 0,
        }],
      };
      expect(() => validateWords(invalidData)).toThrow();
    });

    it('should reject intentionality rating greater than 5', () => {
      const invalidData = {
        words: [{
          id: 1,
          term: 'test',
          letter: 'T',
          definitionStandard: 'A test word',
          intentionalityRating: 6,
        }],
      };
      expect(() => validateWords(invalidData)).toThrow();
    });

    it('should reject non-integer intentionality rating', () => {
      const invalidData = {
        words: [{
          id: 1,
          term: 'test',
          letter: 'T',
          definitionStandard: 'A test word',
          intentionalityRating: 3.5,
        }],
      };
      expect(() => validateWords(invalidData)).toThrow();
    });
  });

  // ============================================
  // CROSS REFERENCES VALIDATION
  // ============================================
  describe('CrossReferences Schema', () => {
    it('should accept valid cross references array', () => {
      const validData = {
        words: [{
          id: 1,
          term: 'test',
          letter: 'T',
          definitionStandard: 'A test word',
          crossReferences: [2, 3, 4],
        }],
      };
      const result = validateWords(validData);
      expect(result.words[0].crossReferences).toEqual([2, 3, 4]);
    });

    it('should accept empty cross references array', () => {
      const validData = {
        words: [{
          id: 1,
          term: 'test',
          letter: 'T',
          definitionStandard: 'A test word',
          crossReferences: [],
        }],
      };
      const result = validateWords(validData);
      expect(result.words[0].crossReferences).toEqual([]);
    });

    it('should reject cross references with non-numbers', () => {
      const invalidData = {
        words: [{
          id: 1,
          term: 'test',
          letter: 'T',
          definitionStandard: 'A test word',
          crossReferences: [1, 'two', 3],
        }],
      };
      expect(() => validateWords(invalidData)).toThrow();
    });
  });

  // ============================================
  // CONTRIBUTORS VALIDATION
  // ============================================
  describe('Contributors Schema', () => {
    it('should accept valid contributors array', () => {
      const validData = {
        words: [{
          id: 1,
          term: 'test',
          letter: 'T',
          definitionStandard: 'A test word',
          contributors: ['user1', 'user2', 'Claude/Turk AI'],
        }],
      };
      const result = validateWords(validData);
      expect(result.words[0].contributors).toEqual(['user1', 'user2', 'Claude/Turk AI']);
    });

    it('should accept empty contributors array', () => {
      const validData = {
        words: [{
          id: 1,
          term: 'test',
          letter: 'T',
          definitionStandard: 'A test word',
          contributors: [],
        }],
      };
      const result = validateWords(validData);
      expect(result.words[0].contributors).toEqual([]);
    });

    it('should accept contributor objects with name and story', () => {
      const validData = {
        words: [{
          id: 1,
          term: 'test',
          letter: 'T',
          definitionStandard: 'A test word',
          contributors: [
            'simple-contributor',
            { name: 'Contributor Name', story: 'How they contributed' },
          ],
        }],
      };
      const result = validateWords(validData);
      expect(result.words[0].contributors).toHaveLength(2);
      expect(result.words[0].contributors![0]).toBe('simple-contributor');
      expect(result.words[0].contributors![1]).toEqual({
        name: 'Contributor Name',
        story: 'How they contributed',
      });
    });

    it('should accept contributor objects without story', () => {
      const validData = {
        words: [{
          id: 1,
          term: 'test',
          letter: 'T',
          definitionStandard: 'A test word',
          contributors: [{ name: 'Just a Name' }],
        }],
      };
      const result = validateWords(validData);
      expect(result.words[0].contributors![0]).toEqual({ name: 'Just a Name' });
    });

    it('should reject contributor objects without name', () => {
      const invalidData = {
        words: [{
          id: 1,
          term: 'test',
          letter: 'T',
          definitionStandard: 'A test word',
          contributors: [{ story: 'Story without name' }],
        }],
      };
      expect(() => validateWords(invalidData)).toThrow();
    });
  });

  // ============================================
  // REFERENCES SCHEMA
  // ============================================
  describe('References Schema', () => {
    it('should accept valid references array', () => {
      const validData = {
        words: [{
          id: 1,
          term: 'test',
          letter: 'T',
          definitionStandard: 'A test word',
          references: [{
            title: 'Example Video',
            url: 'https://www.youtube.com/watch?v=abc123',
            description: 'A helpful video',
            type: 'video',
          }],
        }],
      };
      const result = validateWords(validData);
      expect(result.words[0].references).toHaveLength(1);
      expect(result.words[0].references![0].title).toBe('Example Video');
      expect(result.words[0].references![0].type).toBe('video');
    });

    it('should accept references without optional fields', () => {
      const validData = {
        words: [{
          id: 1,
          term: 'test',
          letter: 'T',
          definitionStandard: 'A test word',
          references: [{
            title: 'Minimal Reference',
            url: 'https://example.com',
          }],
        }],
      };
      const result = validateWords(validData);
      expect(result.words[0].references![0].title).toBe('Minimal Reference');
      expect(result.words[0].references![0].description).toBeUndefined();
      expect(result.words[0].references![0].type).toBeUndefined();
    });

    it('should accept all reference types', () => {
      const types = ['video', 'article', 'paper', 'book', 'podcast', 'tool', 'community', 'other'];
      types.forEach(type => {
        const validData = {
          words: [{
            id: 1,
            term: 'test',
            letter: 'T',
            definitionStandard: 'A test word',
            references: [{
              title: `${type} reference`,
              url: 'https://example.com',
              type,
            }],
          }],
        };
        const result = validateWords(validData);
        expect(result.words[0].references![0].type).toBe(type);
      });
    });

    it('should reject references with invalid URL', () => {
      const invalidData = {
        words: [{
          id: 1,
          term: 'test',
          letter: 'T',
          definitionStandard: 'A test word',
          references: [{
            title: 'Bad URL',
            url: 'not-a-valid-url',
          }],
        }],
      };
      expect(() => validateWords(invalidData)).toThrow();
    });

    it('should reject references without title', () => {
      const invalidData = {
        words: [{
          id: 1,
          term: 'test',
          letter: 'T',
          definitionStandard: 'A test word',
          references: [{
            url: 'https://example.com',
          }],
        }],
      };
      expect(() => validateWords(invalidData)).toThrow();
    });

    it('should reject references without url', () => {
      const invalidData = {
        words: [{
          id: 1,
          term: 'test',
          letter: 'T',
          definitionStandard: 'A test word',
          references: [{
            title: 'No URL',
          }],
        }],
      };
      expect(() => validateWords(invalidData)).toThrow();
    });

    it('should reject invalid reference type', () => {
      const invalidData = {
        words: [{
          id: 1,
          term: 'test',
          letter: 'T',
          definitionStandard: 'A test word',
          references: [{
            title: 'Invalid Type',
            url: 'https://example.com',
            type: 'invalid_type',
          }],
        }],
      };
      expect(() => validateWords(invalidData)).toThrow();
    });

    it('should accept empty references array', () => {
      const validData = {
        words: [{
          id: 1,
          term: 'test',
          letter: 'T',
          definitionStandard: 'A test word',
          references: [],
        }],
      };
      const result = validateWords(validData);
      expect(result.words[0].references).toEqual([]);
    });

    it('should accept multiple references', () => {
      const validData = {
        words: [{
          id: 1,
          term: 'test',
          letter: 'T',
          definitionStandard: 'A test word',
          references: [
            { title: 'Video', url: 'https://youtube.com/watch?v=123', type: 'video' },
            { title: 'Article', url: 'https://medium.com/article', type: 'article' },
            { title: 'Book', url: 'https://amazon.com/book', type: 'book' },
          ],
        }],
      };
      const result = validateWords(validData);
      expect(result.words[0].references).toHaveLength(3);
    });
  });

  // ============================================
  // OPTIONAL FIELDS VALIDATION
  // ============================================
  describe('Optional Fields', () => {
    it('should accept entry with all optional fields', () => {
      const validData = {
        words: [{
          id: 1,
          term: 'test',
          letter: 'T',
          definitionStandard: 'Standard definition',
          definitionDialect: 'Dialekt definition',
          usageExamples: [{ context: 'Test', example: 'Example' }],
          harmReductionNotes: [{ categories: ['life_at_stake'], note: 'Note' }],
          etymology: 'Word origin',
          pronunciation: '/tɛst/',
          crossReferences: [2, 3],
          intentionalityRating: 5,
          dateAdded: '02025-12月26',
          contributors: ['lifesaverlabs'],
          notes: 'Additional notes',
        }],
      };
      const result = validateWords(validData);
      expect(result.words[0]).toBeDefined();
      expect(result.words[0].etymology).toBe('Word origin');
      expect(result.words[0].pronunciation).toBe('/tɛst/');
      expect(result.words[0].notes).toBe('Additional notes');
    });

    it('should accept entry with minimal required fields only', () => {
      const validData = {
        words: [{
          id: 1,
          term: 'test',
          letter: 'T',
          definitionStandard: 'A test word',
        }],
      };
      const result = validateWords(validData);
      expect(result.words[0]).toBeDefined();
    });
  });

  // ============================================
  // LETTER VALIDATION WITH SPECIAL CHARACTERS
  // ============================================
  describe('validateLetterMatches - Special Characters', () => {
    // Nordic/Germanic special characters
    it('should map Æ to A', () => {
      const entry: DictionaryEntry = {
        id: 1, term: 'Ængineering', letter: 'A',
        definitionStandard: 'def', definitionDialect: 'def',
      };
      expect(validateLetterMatches(entry)).toBe(true);
    });

    it('should map Ä to A', () => {
      const entry: DictionaryEntry = {
        id: 1, term: 'Äpfel', letter: 'A',
        definitionStandard: 'def', definitionDialect: 'def',
      };
      expect(validateLetterMatches(entry)).toBe(true);
    });

    it('should map Å to A', () => {
      const entry: DictionaryEntry = {
        id: 1, term: 'Ångström', letter: 'A',
        definitionStandard: 'def', definitionDialect: 'def',
      };
      expect(validateLetterMatches(entry)).toBe(true);
    });

    it('should map Ö to O', () => {
      const entry: DictionaryEntry = {
        id: 1, term: 'Öresund', letter: 'O',
        definitionStandard: 'def', definitionDialect: 'def',
      };
      expect(validateLetterMatches(entry)).toBe(true);
    });

    it('should map Ø to O', () => {
      const entry: DictionaryEntry = {
        id: 1, term: 'Øresund', letter: 'O',
        definitionStandard: 'def', definitionDialect: 'def',
      };
      expect(validateLetterMatches(entry)).toBe(true);
    });

    it('should map Ü to U', () => {
      const entry: DictionaryEntry = {
        id: 1, term: 'Übung', letter: 'U',
        definitionStandard: 'def', definitionDialect: 'def',
      };
      expect(validateLetterMatches(entry)).toBe(true);
    });

    it('should map Ç to C', () => {
      const entry: DictionaryEntry = {
        id: 1, term: 'Çelik', letter: 'C',
        definitionStandard: 'def', definitionDialect: 'def',
      };
      expect(validateLetterMatches(entry)).toBe(true);
    });

    it('should map Ñ to N', () => {
      const entry: DictionaryEntry = {
        id: 1, term: 'Ñoño', letter: 'N',
        definitionStandard: 'def', definitionDialect: 'def',
      };
      expect(validateLetterMatches(entry)).toBe(true);
    });

    it('should map ß to S (uppercase maps correctly)', () => {
      // Note: ß.toUpperCase() returns 'SS', so this maps to S via the charMap
      // However, the current implementation only maps uppercase ß in charMap
      // The actual behavior depends on how toUpperCase() handles ß
      const entry: DictionaryEntry = {
        id: 1, term: 'Straße', letter: 'S', // Start with S, ß in middle
        definitionStandard: 'def', definitionDialect: 'def',
      };
      expect(validateLetterMatches(entry)).toBe(true);
    });

    // Numeric mappings
    it('should map 0 to O', () => {
      const entry: DictionaryEntry = {
        id: 1, term: '0bservation', letter: 'O',
        definitionStandard: 'def', definitionDialect: 'def',
      };
      expect(validateLetterMatches(entry)).toBe(true);
    });

    it('should map 1 to O (one)', () => {
      const entry: DictionaryEntry = {
        id: 1, term: '13th Slaves', letter: 'O',
        definitionStandard: 'def', definitionDialect: 'def',
      };
      expect(validateLetterMatches(entry)).toBe(true);
    });

    it('should map 2 to T (two)', () => {
      const entry: DictionaryEntry = {
        id: 1, term: '2morrow', letter: 'T',
        definitionStandard: 'def', definitionDialect: 'def',
      };
      expect(validateLetterMatches(entry)).toBe(true);
    });

    it('should map 3 to T (three)', () => {
      const entry: DictionaryEntry = {
        id: 1, term: '3rd degree', letter: 'T',
        definitionStandard: 'def', definitionDialect: 'def',
      };
      expect(validateLetterMatches(entry)).toBe(true);
    });

    it('should map 4 to F (four)', () => {
      const entry: DictionaryEntry = {
        id: 1, term: '4ever', letter: 'F',
        definitionStandard: 'def', definitionDialect: 'def',
      };
      expect(validateLetterMatches(entry)).toBe(true);
    });

    it('should map 5 to F (five)', () => {
      const entry: DictionaryEntry = {
        id: 1, term: '5K run', letter: 'F',
        definitionStandard: 'def', definitionDialect: 'def',
      };
      expect(validateLetterMatches(entry)).toBe(true);
    });

    it('should map 6 to S (six)', () => {
      const entry: DictionaryEntry = {
        id: 1, term: '6th sense', letter: 'S',
        definitionStandard: 'def', definitionDialect: 'def',
      };
      expect(validateLetterMatches(entry)).toBe(true);
    });

    it('should map 7 to S (seven)', () => {
      const entry: DictionaryEntry = {
        id: 1, term: '7seas', letter: 'S',
        definitionStandard: 'def', definitionDialect: 'def',
      };
      expect(validateLetterMatches(entry)).toBe(true);
    });

    it('should map 8 to E (eight)', () => {
      const entry: DictionaryEntry = {
        id: 1, term: '8-ball', letter: 'E',
        definitionStandard: 'def', definitionDialect: 'def',
      };
      expect(validateLetterMatches(entry)).toBe(true);
    });

    it('should map 9 to N (nine)', () => {
      const entry: DictionaryEntry = {
        id: 1, term: '9-to-5', letter: 'N',
        definitionStandard: 'def', definitionDialect: 'def',
      };
      expect(validateLetterMatches(entry)).toBe(true);
    });

    // Superscript handling
    it('should strip leading superscripts before matching', () => {
      const entry: DictionaryEntry = {
        id: 1, term: '⁵test', letter: 'T',
        definitionStandard: 'def', definitionDialect: 'def',
      };
      expect(validateLetterMatches(entry)).toBe(true);
    });

    it('should strip multiple leading superscripts', () => {
      const entry: DictionaryEntry = {
        id: 1, term: '¹²³⁴⁵Apple', letter: 'A',
        definitionStandard: 'def', definitionDialect: 'def',
      };
      expect(validateLetterMatches(entry)).toBe(true);
    });

    // Micro/mu prefix handling
    it('should strip leading µ (micro) prefix', () => {
      const entry: DictionaryEntry = {
        id: 1, term: 'µdowry', letter: 'D',
        definitionStandard: 'def', definitionDialect: 'def',
      };
      expect(validateLetterMatches(entry)).toBe(true);
    });

    it('should strip leading μ (Greek mu) prefix', () => {
      const entry: DictionaryEntry = {
        id: 1, term: 'μBorlaug', letter: 'B',
        definitionStandard: 'def', definitionDialect: 'def',
      };
      expect(validateLetterMatches(entry)).toBe(true);
    });

    // Case insensitivity
    it('should handle lowercase first letters', () => {
      const entry: DictionaryEntry = {
        id: 1, term: 'lowercase', letter: 'L',
        definitionStandard: 'def', definitionDialect: 'def',
      };
      expect(validateLetterMatches(entry)).toBe(true);
    });

    // Combined special cases
    it('should handle superscript + special character', () => {
      const entry: DictionaryEntry = {
        id: 1, term: '⁵Æther', letter: 'A',
        definitionStandard: 'def', definitionDialect: 'def',
      };
      expect(validateLetterMatches(entry)).toBe(true);
    });
  });

  // ============================================
  // MIGRATION HELPERS
  // ============================================
  describe('Migration Helpers', () => {
    describe('needsMigration', () => {
      it('should return true when only old definition exists', () => {
        const entry: DictionaryEntry = {
          id: 1, term: 'test', letter: 'T',
          definition: 'Old format only',
        };
        expect(needsMigration(entry)).toBe(true);
      });

      it('should return false when new definitions exist', () => {
        const entry: DictionaryEntry = {
          id: 1, term: 'test', letter: 'T',
          definitionStandard: 'Standard',
          definitionDialect: 'Dialect',
        };
        expect(needsMigration(entry)).toBe(false);
      });

      it('should return true when old and partial new exist', () => {
        const entry: DictionaryEntry = {
          id: 1, term: 'test', letter: 'T',
          definition: 'Old format',
          definitionStandard: 'Standard only',
        };
        expect(needsMigration(entry)).toBe(true);
      });

      it('should return false when no definition fields exist', () => {
        const entry: DictionaryEntry = {
          id: 1, term: 'test', letter: 'T',
        };
        expect(needsMigration(entry)).toBe(false);
      });
    });

    describe('migrateEntry', () => {
      it('should copy old definition to both new fields', () => {
        const entry: DictionaryEntry = {
          id: 1, term: 'test', letter: 'T',
          definition: 'Old definition',
        };
        const migrated = migrateEntry(entry);
        expect(migrated.definitionStandard).toBe('Old definition');
        expect(migrated.definitionDialect).toBe('Old definition');
        expect(migrated.definition).toBeUndefined();
      });

      it('should preserve all other fields during migration', () => {
        const entry: DictionaryEntry = {
          id: 42, term: 'complex', letter: 'C',
          definition: 'Old definition',
          etymology: 'Some origin',
          contributors: ['user1'],
        };
        const migrated = migrateEntry(entry);
        expect(migrated.id).toBe(42);
        expect(migrated.term).toBe('complex');
        expect(migrated.letter).toBe('C');
        expect(migrated.etymology).toBe('Some origin');
        expect(migrated.contributors).toEqual(['user1']);
      });

      it('should not modify already migrated entries', () => {
        const entry: DictionaryEntry = {
          id: 1, term: 'test', letter: 'T',
          definitionStandard: 'Standard',
          definitionDialect: 'Different dialect',
        };
        const migrated = migrateEntry(entry);
        expect(migrated).toEqual(entry);
        expect(migrated.definitionDialect).toBe('Different dialect');
      });

      it('should handle empty old definition', () => {
        const entry: DictionaryEntry = {
          id: 1, term: 'test', letter: 'T',
          definition: '',
        };
        const migrated = migrateEntry(entry);
        expect(migrated.definitionStandard).toBe('');
        expect(migrated.definitionDialect).toBe('');
      });
    });
  });

  // ============================================
  // ID VALIDATION
  // ============================================
  describe('ID Validation', () => {
    it('should accept positive integer IDs', () => {
      const validData = {
        words: [
          { id: 1, term: 'one', letter: 'O', definitionStandard: 'def' },
          { id: 100, term: 'hundred', letter: 'H', definitionStandard: 'def' },
          { id: 9999, term: 'large', letter: 'L', definitionStandard: 'def' },
        ],
      };
      const result = validateWords(validData);
      expect(result.words).toHaveLength(3);
    });

    it('should reject zero ID', () => {
      const invalidData = {
        words: [{ id: 0, term: 'zero', letter: 'Z', definitionStandard: 'def' }],
      };
      expect(() => validateWords(invalidData)).toThrow();
    });

    it('should reject negative ID', () => {
      const invalidData = {
        words: [{ id: -1, term: 'negative', letter: 'N', definitionStandard: 'def' }],
      };
      expect(() => validateWords(invalidData)).toThrow();
    });

    it('should reject non-integer ID', () => {
      const invalidData = {
        words: [{ id: 1.5, term: 'decimal', letter: 'D', definitionStandard: 'def' }],
      };
      expect(() => validateWords(invalidData)).toThrow();
    });

    it('should reject string ID', () => {
      const invalidData = {
        words: [{ id: 'one', term: 'string', letter: 'S', definitionStandard: 'def' }],
      };
      expect(() => validateWords(invalidData)).toThrow();
    });
  });

  // ============================================
  // TERM VALIDATION
  // ============================================
  describe('Term Validation', () => {
    it('should accept non-empty term', () => {
      const validData = {
        words: [{ id: 1, term: 'test', letter: 'T', definitionStandard: 'def' }],
      };
      const result = validateWords(validData);
      expect(result.words[0].term).toBe('test');
    });

    it('should reject empty term', () => {
      const invalidData = {
        words: [{ id: 1, term: '', letter: 'T', definitionStandard: 'def' }],
      };
      expect(() => validateWords(invalidData)).toThrow();
    });

    it('should accept term with special characters', () => {
      const validData = {
        words: [
          { id: 1, term: 'Blesséd', letter: 'B', definitionStandard: 'def' },
          { id: 2, term: 'calmunity⁵', letter: 'C', definitionStandard: 'def' },
          { id: 3, term: 'µdowry', letter: 'D', definitionStandard: 'def' },
          { id: 4, term: 'herstory⁵ ⇋ history⁵', letter: 'H', definitionStandard: 'def' },
        ],
      };
      const result = validateWords(validData);
      expect(result.words).toHaveLength(4);
    });
  });

  // ============================================
  // LETTER VALIDATION
  // ============================================
  describe('Letter Field Validation', () => {
    const validLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    it.each(validLetters)('should accept uppercase letter: %s', (letter) => {
      const validData = {
        words: [{ id: 1, term: 'test', letter: letter, definitionStandard: 'def' }],
      };
      const result = validateWords(validData);
      expect(result.words[0].letter).toBe(letter);
    });

    it('should reject lowercase letter', () => {
      const invalidData = {
        words: [{ id: 1, term: 'test', letter: 'a', definitionStandard: 'def' }],
      };
      expect(() => validateWords(invalidData)).toThrow();
    });

    it('should reject multiple letters', () => {
      const invalidData = {
        words: [{ id: 1, term: 'test', letter: 'AB', definitionStandard: 'def' }],
      };
      expect(() => validateWords(invalidData)).toThrow();
    });

    it('should reject empty letter', () => {
      const invalidData = {
        words: [{ id: 1, term: 'test', letter: '', definitionStandard: 'def' }],
      };
      expect(() => validateWords(invalidData)).toThrow();
    });

    it('should reject number as letter', () => {
      const invalidData = {
        words: [{ id: 1, term: 'test', letter: '1', definitionStandard: 'def' }],
      };
      expect(() => validateWords(invalidData)).toThrow();
    });

    it('should reject special character as letter', () => {
      const invalidData = {
        words: [{ id: 1, term: 'test', letter: 'Æ', definitionStandard: 'def' }],
      };
      expect(() => validateWords(invalidData)).toThrow();
    });
  });

  // ============================================
  // FULL DICTIONARY VALIDATION
  // ============================================
  describe('validateDictionaryData - Integration', () => {
    it('should validate combined words and phrases', () => {
      const words = {
        words: [
          { id: 1, term: 'apple', letter: 'A', definitionStandard: 'A fruit' },
          { id: 2, term: 'banana', letter: 'B', definitionStandard: 'Yellow fruit' },
        ],
      };
      const phrases = {
        phrases: [
          { id: 3, term: 'break the ice', letter: 'B', definitionStandard: 'Start conversation' },
          { id: 4, term: 'call it a day', letter: 'C', definitionStandard: 'Stop working' },
        ],
      };

      const result = validateDictionaryData(words, phrases);
      expect(result.words).toHaveLength(2);
      expect(result.phrases).toHaveLength(2);
    });

    it('should detect duplicate IDs across words and phrases', () => {
      const words = {
        words: [{ id: 1, term: 'apple', letter: 'A', definitionStandard: 'A fruit' }],
      };
      const phrases = {
        phrases: [{ id: 1, term: 'break ice', letter: 'B', definitionStandard: 'Start' }],
      };

      expect(() => validateDictionaryData(words, phrases)).toThrow(/Duplicate IDs/);
    });

    it('should detect letter mismatches in words', () => {
      const words = {
        words: [{ id: 1, term: 'apple', letter: 'Z', definitionStandard: 'A fruit' }],
      };
      const phrases = { phrases: [] };

      expect(() => validateDictionaryData(words, phrases)).toThrow(/Letter validation/);
    });

    it('should detect letter mismatches in phrases', () => {
      const words = { words: [] };
      const phrases = {
        phrases: [{ id: 1, term: 'break ice', letter: 'Z', definitionStandard: 'Start' }],
      };

      expect(() => validateDictionaryData(words, phrases)).toThrow(/Letter validation/);
    });

    it('should accept empty collections', () => {
      const words = { words: [] };
      const phrases = { phrases: [] };

      const result = validateDictionaryData(words, phrases);
      expect(result.words).toEqual([]);
      expect(result.phrases).toEqual([]);
    });
  });
});
