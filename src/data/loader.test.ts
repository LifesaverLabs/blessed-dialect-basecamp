import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  loadDictionaryData,
  loadKeyboardLayouts,
  getWords,
  getPhrases,
  getAllEntries,
  getNextAvailableId,
  getKeyboardLayouts,
  getKeyboardLayoutById,
  getKeyboardLayoutsByTag,
  getEntriesByDate,
} from './loader';

/**
 * Data Loader Tests
 *
 * Tests for the loader module that:
 * - Loads and validates dictionary data
 * - Provides convenience functions for accessing entries
 * - Handles caching
 * - Provides keyboard layout functions
 */

describe('Data Loader', () => {
  // ============================================
  // DICTIONARY LOADING
  // ============================================
  describe('loadDictionaryData', () => {
    it('should load dictionary data successfully', () => {
      const data = loadDictionaryData();
      expect(data).toBeDefined();
      expect(data.words).toBeDefined();
      expect(data.phrases).toBeDefined();
    });

    it('should return cached data on subsequent calls', () => {
      const data1 = loadDictionaryData();
      const data2 = loadDictionaryData();
      expect(data1).toBe(data2);
    });

    it('should return arrays for words and phrases', () => {
      const data = loadDictionaryData();
      expect(Array.isArray(data.words)).toBe(true);
      expect(Array.isArray(data.phrases)).toBe(true);
    });
  });

  // ============================================
  // WORDS ACCESS
  // ============================================
  describe('getWords', () => {
    it('should return array of words', () => {
      const words = getWords();
      expect(Array.isArray(words)).toBe(true);
    });

    it('should return at least 50 words', () => {
      const words = getWords();
      expect(words.length).toBeGreaterThanOrEqual(50);
    });

    it('should return words with required fields', () => {
      const words = getWords();
      words.forEach(word => {
        expect(word.id).toBeDefined();
        expect(word.term).toBeDefined();
        expect(word.letter).toBeDefined();
      });
    });

    it('should return words with migrated definitions', () => {
      const words = getWords();
      // All words should have been auto-migrated
      words.forEach(word => {
        const hasNewFormat = word.definitionStandard !== undefined || word.definitionDialect !== undefined;
        expect(hasNewFormat).toBe(true);
      });
    });
  });

  // ============================================
  // PHRASES ACCESS
  // ============================================
  describe('getPhrases', () => {
    it('should return array of phrases', () => {
      const phrases = getPhrases();
      expect(Array.isArray(phrases)).toBe(true);
    });

    it('should return at least 15 phrases', () => {
      const phrases = getPhrases();
      expect(phrases.length).toBeGreaterThanOrEqual(15);
    });

    it('should return phrases with required fields', () => {
      const phrases = getPhrases();
      phrases.forEach(phrase => {
        expect(phrase.id).toBeDefined();
        expect(phrase.term).toBeDefined();
        expect(phrase.letter).toBeDefined();
      });
    });

    it('should return phrases with migrated definitions', () => {
      const phrases = getPhrases();
      phrases.forEach(phrase => {
        const hasNewFormat = phrase.definitionStandard !== undefined || phrase.definitionDialect !== undefined;
        expect(hasNewFormat).toBe(true);
      });
    });
  });

  // ============================================
  // ALL ENTRIES ACCESS
  // ============================================
  describe('getAllEntries', () => {
    it('should return combined words and phrases', () => {
      const all = getAllEntries();
      const words = getWords();
      const phrases = getPhrases();
      expect(all.length).toBe(words.length + phrases.length);
    });

    it('should include entries from both collections', () => {
      const all = getAllEntries();
      const words = getWords();
      const phrases = getPhrases();

      // Check that some words are present
      const wordIds = new Set(words.map(w => w.id));
      const phraseIds = new Set(phrases.map(p => p.id));

      all.forEach(entry => {
        expect(wordIds.has(entry.id) || phraseIds.has(entry.id)).toBe(true);
      });
    });
  });

  // ============================================
  // NEXT AVAILABLE ID
  // ============================================
  describe('getNextAvailableId', () => {
    it('should return a positive integer', () => {
      const nextId = getNextAvailableId();
      expect(Number.isInteger(nextId)).toBe(true);
      expect(nextId).toBeGreaterThan(0);
    });

    it('should return ID greater than all existing IDs', () => {
      const all = getAllEntries();
      const maxExistingId = Math.max(...all.map(e => e.id));
      const nextId = getNextAvailableId();
      expect(nextId).toBe(maxExistingId + 1);
    });

    it('should be consistent across multiple calls', () => {
      const nextId1 = getNextAvailableId();
      const nextId2 = getNextAvailableId();
      expect(nextId1).toBe(nextId2);
    });
  });

  // ============================================
  // KEYBOARD LAYOUTS
  // ============================================
  describe('loadKeyboardLayouts', () => {
    it('should load keyboard layouts successfully', () => {
      const layouts = loadKeyboardLayouts();
      expect(layouts).toBeDefined();
      expect(Array.isArray(layouts)).toBe(true);
    });

    it('should return cached data on subsequent calls', () => {
      const layouts1 = loadKeyboardLayouts();
      const layouts2 = loadKeyboardLayouts();
      expect(layouts1).toBe(layouts2);
    });
  });

  describe('getKeyboardLayouts', () => {
    it('should return array of keyboard layouts', () => {
      const layouts = getKeyboardLayouts();
      expect(Array.isArray(layouts)).toBe(true);
    });
  });

  describe('getKeyboardLayoutById', () => {
    it('should return undefined for non-existent ID', () => {
      const layout = getKeyboardLayoutById('non-existent-id');
      expect(layout).toBeUndefined();
    });

    it('should return layout if it exists', () => {
      const layouts = getKeyboardLayouts();
      if (layouts.length > 0) {
        const firstLayout = layouts[0];
        const found = getKeyboardLayoutById(firstLayout.id);
        expect(found).toBeDefined();
        expect(found?.id).toBe(firstLayout.id);
      }
    });
  });

  describe('getKeyboardLayoutsByTag', () => {
    it('should return empty array for non-existent tag', () => {
      const layouts = getKeyboardLayoutsByTag('non-existent-tag');
      expect(layouts).toEqual([]);
    });

    it('should filter layouts by tag', () => {
      const layouts = getKeyboardLayouts();
      if (layouts.length > 0 && layouts[0].tags && layouts[0].tags.length > 0) {
        const tag = layouts[0].tags[0];
        const filtered = getKeyboardLayoutsByTag(tag);
        expect(filtered.length).toBeGreaterThan(0);
        filtered.forEach(layout => {
          expect(layout.tags).toContain(tag);
        });
      }
    });
  });

  // ============================================
  // DATA VALIDATION ON LOAD
  // ============================================
  describe('Data Validation on Load', () => {
    it('should auto-migrate entries during load', () => {
      const data = loadDictionaryData();

      // All entries should have new format after load
      data.words.forEach(word => {
        expect(word.definition).toBeUndefined();
        // Should have at least one of the new definition fields
        const hasNewDef = word.definitionStandard !== undefined || word.definitionDialect !== undefined;
        expect(hasNewDef).toBe(true);
      });

      data.phrases.forEach(phrase => {
        expect(phrase.definition).toBeUndefined();
        const hasNewDef = phrase.definitionStandard !== undefined || phrase.definitionDialect !== undefined;
        expect(hasNewDef).toBe(true);
      });
    });

    it('should have valid data structure after loading', () => {
      const data = loadDictionaryData();

      // Words should have valid structure
      data.words.forEach(word => {
        expect(typeof word.id).toBe('number');
        expect(typeof word.term).toBe('string');
        expect(typeof word.letter).toBe('string');
        expect(word.letter).toMatch(/^[A-Z]$/);
      });

      // Phrases should have valid structure
      data.phrases.forEach(phrase => {
        expect(typeof phrase.id).toBe('number');
        expect(typeof phrase.term).toBe('string');
        expect(typeof phrase.letter).toBe('string');
        expect(phrase.letter).toMatch(/^[A-Z]$/);
      });
    });
  });

  // ============================================
  // ENTRIES BY DATE
  // ============================================
  describe('getEntriesByDate', () => {
    it('should return entries sorted by date (newest first)', () => {
      const entries = getEntriesByDate();
      expect(Array.isArray(entries)).toBe(true);

      // Verify sorting (newest first)
      for (let i = 1; i < entries.length; i++) {
        const prevDate = entries[i - 1].dateAdded;
        const currDate = entries[i].dateAdded;
        if (prevDate && currDate) {
          expect(prevDate >= currDate).toBe(true);
        }
      }
    });

    it('should only return entries with dateAdded field', () => {
      const entries = getEntriesByDate();
      entries.forEach(entry => {
        expect(entry.dateAdded).toBeDefined();
      });
    });

    it('should respect limit parameter', () => {
      const limit5 = getEntriesByDate(5);
      const limit10 = getEntriesByDate(10);
      const noLimit = getEntriesByDate();

      expect(limit5.length).toBeLessThanOrEqual(5);
      expect(limit10.length).toBeLessThanOrEqual(10);
      expect(noLimit.length).toBeGreaterThanOrEqual(limit10.length);
    });

    it('should return fewer entries if limit exceeds available', () => {
      const entries = getEntriesByDate(1000);
      const all = getEntriesByDate();
      expect(entries.length).toBe(all.length);
    });
  });

  // ============================================
  // SPECIFIC ENTRY QUERIES
  // ============================================
  describe('Specific Entry Queries', () => {
    it('should be able to find Borlaug by term', () => {
      const words = getWords();
      const borlaug = words.find(w => w.term === 'Borlaug');
      expect(borlaug).toBeDefined();
      expect(borlaug?.id).toBe(1);
    });

    it('should be able to find entry by ID', () => {
      const all = getAllEntries();
      const entry1 = all.find(e => e.id === 1);
      expect(entry1).toBeDefined();
      expect(entry1?.term).toBe('Borlaug');
    });

    it('should be able to filter by letter', () => {
      const words = getWords();
      const bWords = words.filter(w => w.letter === 'B');
      expect(bWords.length).toBeGreaterThan(0);
      bWords.forEach(w => {
        expect(w.letter).toBe('B');
      });
    });

    it('should be able to search by term substring', () => {
      const all = getAllEntries();
      const calmEntries = all.filter(e => e.term.toLowerCase().includes('calm'));
      expect(calmEntries.length).toBeGreaterThan(0);
    });
  });
});
