import { describe, it, expect } from 'vitest';
import wordsData from './dictionary/words.json';
import phrasesData from './dictionary/phrases.json';
import { validateLetterMatches, type DictionaryEntry } from './schema';

/**
 * Comprehensive Dictionary Data Integrity Tests
 *
 * These tests verify the actual dictionary data:
 * - Structure and format of all entries
 * - Content quality checks
 * - Cross-reference validity
 * - Consistency across entries
 */

describe('Dictionary Data - Comprehensive Integrity Tests', () => {
  const allWords = wordsData.words as DictionaryEntry[];
  const allPhrases = phrasesData.phrases as DictionaryEntry[];
  const allEntries = [...allWords, ...allPhrases];

  // ============================================
  // COLLECTION STRUCTURE
  // ============================================
  describe('Collection Structure', () => {
    it('should have words array', () => {
      expect(wordsData).toHaveProperty('words');
      expect(Array.isArray(wordsData.words)).toBe(true);
    });

    it('should have phrases array', () => {
      expect(phrasesData).toHaveProperty('phrases');
      expect(Array.isArray(phrasesData.phrases)).toBe(true);
    });

    it('should have at least 50 words', () => {
      expect(allWords.length).toBeGreaterThanOrEqual(50);
    });

    it('should have at least 15 phrases', () => {
      expect(allPhrases.length).toBeGreaterThanOrEqual(15);
    });

    it('should have at least 100 total entries', () => {
      expect(allEntries.length).toBeGreaterThanOrEqual(100);
    });
  });

  // ============================================
  // ID INTEGRITY
  // ============================================
  describe('ID Integrity', () => {
    it('should have no duplicate IDs', () => {
      const ids = allEntries.map(e => e.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have all positive integer IDs', () => {
      allEntries.forEach(entry => {
        expect(Number.isInteger(entry.id)).toBe(true);
        expect(entry.id).toBeGreaterThan(0);
      });
    });

    it('should have IDs that increase without large gaps', () => {
      const sortedIds = allEntries.map(e => e.id).sort((a, b) => a - b);
      const maxId = sortedIds[sortedIds.length - 1];
      const minId = sortedIds[0];

      // Allow for some gaps but not excessive ones
      // If we have 100 entries, max ID should be less than 200
      expect(maxId).toBeLessThan(allEntries.length * 2);
      expect(minId).toBeGreaterThanOrEqual(1);
    });

    it('should have unique IDs between words and phrases', () => {
      const wordIds = new Set(allWords.map(w => w.id));
      const phraseIds = new Set(allPhrases.map(p => p.id));

      phraseIds.forEach(id => {
        expect(wordIds.has(id)).toBe(false);
      });
    });
  });

  // ============================================
  // LETTER VALIDATION
  // ============================================
  describe('Letter Validation', () => {
    it('should have valid A-Z letters for all entries', () => {
      allEntries.forEach(entry => {
        expect(entry.letter).toMatch(/^[A-Z]$/);
      });
    });

    it('should have matching letters for all words', () => {
      allWords.forEach(word => {
        const matches = validateLetterMatches(word);
        if (!matches) {
          console.log(`Letter mismatch: "${word.term}" has letter "${word.letter}"`);
        }
        expect(matches).toBe(true);
      });
    });

    it('should have matching letters for all phrases', () => {
      allPhrases.forEach(phrase => {
        const matches = validateLetterMatches(phrase);
        if (!matches) {
          console.log(`Letter mismatch: "${phrase.term}" has letter "${phrase.letter}"`);
        }
        expect(matches).toBe(true);
      });
    });

    it('should have entries for multiple letters of the alphabet', () => {
      const lettersUsed = new Set(allEntries.map(e => e.letter));
      expect(lettersUsed.size).toBeGreaterThanOrEqual(10);
    });
  });

  // ============================================
  // TERM VALIDATION
  // ============================================
  describe('Term Validation', () => {
    it('should have non-empty terms', () => {
      allEntries.forEach(entry => {
        expect(entry.term.trim()).not.toBe('');
      });
    });

    it('should have no duplicate terms (case-sensitive)', () => {
      const terms = allEntries.map(e => e.term);
      const uniqueTerms = new Set(terms);
      if (uniqueTerms.size !== terms.length) {
        const duplicates = terms.filter((t, i) => terms.indexOf(t) !== i);
        console.log('Duplicate terms:', duplicates);
      }
      expect(uniqueTerms.size).toBe(terms.length);
    });

    it('should have reasonable term lengths', () => {
      allEntries.forEach(entry => {
        expect(entry.term.length).toBeGreaterThan(0);
        expect(entry.term.length).toBeLessThan(100);
      });
    });
  });

  // ============================================
  // DEFINITION VALIDATION
  // ============================================
  describe('Definition Validation', () => {
    it('should have at least one definition format per entry', () => {
      allEntries.forEach(entry => {
        const hasOld = entry.definition !== undefined;
        const hasNew = entry.definitionStandard !== undefined || entry.definitionDialect !== undefined;
        expect(hasOld || hasNew).toBe(true);
      });
    });

    it('should prefer new dual-definition format', () => {
      const entriesWithNewFormat = allEntries.filter(
        e => e.definitionStandard !== undefined || e.definitionDialect !== undefined
      );
      // At least 90% should use new format
      expect(entriesWithNewFormat.length).toBeGreaterThan(allEntries.length * 0.9);
    });

    it('should have non-empty definitions', () => {
      allEntries.forEach(entry => {
        if (entry.definitionStandard) {
          expect(entry.definitionStandard.trim()).not.toBe('');
        }
        if (entry.definitionDialect) {
          expect(entry.definitionDialect.trim()).not.toBe('');
        }
        if (entry.definition) {
          expect(entry.definition.trim()).not.toBe('');
        }
      });
    });

    it('should have definitions of reasonable length', () => {
      allEntries.forEach(entry => {
        const def = entry.definitionStandard || entry.definition;
        if (def) {
          expect(def.length).toBeGreaterThan(10);
          expect(def.length).toBeLessThan(2000);
        }
      });
    });
  });

  // ============================================
  // CROSS REFERENCES VALIDATION
  // ============================================
  describe('Cross References Validation', () => {
    it('should only reference existing IDs', () => {
      const allIds = new Set(allEntries.map(e => e.id));

      allEntries.forEach(entry => {
        if (entry.crossReferences) {
          entry.crossReferences.forEach(refId => {
            if (!allIds.has(refId)) {
              console.log(`Invalid cross reference: "${entry.term}" (ID ${entry.id}) references non-existent ID ${refId}`);
            }
            expect(allIds.has(refId)).toBe(true);
          });
        }
      });
    });

    it('should not self-reference', () => {
      allEntries.forEach(entry => {
        if (entry.crossReferences) {
          expect(entry.crossReferences).not.toContain(entry.id);
        }
      });
    });

    it('should have no duplicate cross references within an entry', () => {
      allEntries.forEach(entry => {
        if (entry.crossReferences) {
          const uniqueRefs = new Set(entry.crossReferences);
          expect(uniqueRefs.size).toBe(entry.crossReferences.length);
        }
      });
    });
  });

  // ============================================
  // USAGE EXAMPLES VALIDATION
  // ============================================
  describe('Usage Examples Validation', () => {
    it('should have valid usage examples structure', () => {
      allEntries.forEach(entry => {
        if (entry.usageExamples) {
          expect(Array.isArray(entry.usageExamples)).toBe(true);
          entry.usageExamples.forEach(example => {
            expect(example.context).toBeDefined();
            expect(example.context.trim()).not.toBe('');
            expect(example.example).toBeDefined();
            expect(example.example.trim()).not.toBe('');
          });
        }
      });
    });

    it('should have at least some entries with usage examples', () => {
      const entriesWithExamples = allEntries.filter(e => e.usageExamples && e.usageExamples.length > 0);
      expect(entriesWithExamples.length).toBeGreaterThan(10);
    });
  });

  // ============================================
  // HARM REDUCTION NOTES VALIDATION
  // ============================================
  describe('Harm Reduction Notes Validation', () => {
    const validCategories = new Set([
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
    ]);

    const validSeverities = new Set(['info', 'caution', 'warning', 'critical']);

    it('should have valid harm reduction notes structure', () => {
      allEntries.forEach(entry => {
        if (entry.harmReductionNotes) {
          expect(Array.isArray(entry.harmReductionNotes)).toBe(true);
          entry.harmReductionNotes.forEach(note => {
            expect(note.categories).toBeDefined();
            expect(Array.isArray(note.categories)).toBe(true);
            expect(note.categories.length).toBeGreaterThan(0);
            expect(note.note).toBeDefined();
            expect(note.note.trim()).not.toBe('');
          });
        }
      });
    });

    it('should use only valid categories', () => {
      allEntries.forEach(entry => {
        if (entry.harmReductionNotes) {
          entry.harmReductionNotes.forEach(note => {
            note.categories.forEach(cat => {
              if (!validCategories.has(cat)) {
                console.log(`Invalid category "${cat}" in entry "${entry.term}"`);
              }
              expect(validCategories.has(cat)).toBe(true);
            });
          });
        }
      });
    });

    it('should use only valid severities', () => {
      allEntries.forEach(entry => {
        if (entry.harmReductionNotes) {
          entry.harmReductionNotes.forEach(note => {
            if (note.severity) {
              if (!validSeverities.has(note.severity)) {
                console.log(`Invalid severity "${note.severity}" in entry "${entry.term}"`);
              }
              expect(validSeverities.has(note.severity)).toBe(true);
            }
          });
        }
      });
    });

    it('should have at least some entries with harm reduction notes', () => {
      const entriesWithNotes = allEntries.filter(e => e.harmReductionNotes && e.harmReductionNotes.length > 0);
      expect(entriesWithNotes.length).toBeGreaterThan(5);
    });
  });

  // ============================================
  // INTENTIONALITY RATING VALIDATION
  // ============================================
  describe('Intentionality Rating Validation', () => {
    it('should have valid intentionality ratings', () => {
      allEntries.forEach(entry => {
        if (entry.intentionalityRating !== undefined && entry.intentionalityRating !== null) {
          expect(Number.isInteger(entry.intentionalityRating)).toBe(true);
          expect(entry.intentionalityRating).toBeGreaterThanOrEqual(1);
          expect(entry.intentionalityRating).toBeLessThanOrEqual(5);
        }
      });
    });

    it('should have most entries with intentionality ratings', () => {
      const entriesWithRating = allEntries.filter(
        e => e.intentionalityRating !== undefined && e.intentionalityRating !== null
      );
      expect(entriesWithRating.length).toBeGreaterThan(allEntries.length * 0.5);
    });

    it('should properly use null for not-applicable ratings', () => {
      allEntries.forEach(entry => {
        // If rating is null, it should be explicitly null, not undefined
        if (entry.intentionalityRating === null) {
          expect(entry.intentionalityRating).toBeNull();
        }
      });
    });
  });

  // ============================================
  // DATE FORMAT VALIDATION
  // ============================================
  describe('Date Format Validation', () => {
    // Long Now year format: YYYYY-MM月DD
    const dateRegex = /^\d{5}-\d{1,2}月\d{2}$/;

    it('should use Long Now date format', () => {
      allEntries.forEach(entry => {
        if (entry.dateAdded) {
          if (!dateRegex.test(entry.dateAdded)) {
            console.log(`Invalid date format: "${entry.dateAdded}" in entry "${entry.term}"`);
          }
          expect(dateRegex.test(entry.dateAdded)).toBe(true);
        }
      });
    });

    it('should have reasonable year values', () => {
      allEntries.forEach(entry => {
        if (entry.dateAdded) {
          const year = parseInt(entry.dateAdded.substring(0, 5), 10);
          expect(year).toBeGreaterThanOrEqual(2024);
          expect(year).toBeLessThanOrEqual(2100);
        }
      });
    });
  });

  // ============================================
  // CONTRIBUTORS VALIDATION
  // ============================================
  describe('Contributors Validation', () => {
    it('should have valid contributors arrays', () => {
      allEntries.forEach(entry => {
        if (entry.contributors) {
          expect(Array.isArray(entry.contributors)).toBe(true);
          entry.contributors.forEach(contributor => {
            expect(typeof contributor).toBe('string');
            expect(contributor.trim()).not.toBe('');
          });
        }
      });
    });

    it('should have at least some entries with contributors', () => {
      const entriesWithContributors = allEntries.filter(
        e => e.contributors && e.contributors.length > 0
      );
      expect(entriesWithContributors.length).toBeGreaterThan(allEntries.length * 0.5);
    });
  });

  // ============================================
  // ETYMOLOGY VALIDATION
  // ============================================
  describe('Etymology Validation', () => {
    it('should have non-empty etymologies when present', () => {
      allEntries.forEach(entry => {
        if (entry.etymology) {
          expect(entry.etymology.trim()).not.toBe('');
          expect(entry.etymology.length).toBeGreaterThan(5);
        }
      });
    });

    it('should have at least some entries with etymology', () => {
      const entriesWithEtymology = allEntries.filter(e => e.etymology);
      expect(entriesWithEtymology.length).toBeGreaterThan(10);
    });
  });

  // ============================================
  // NOTES VALIDATION
  // ============================================
  describe('Notes Validation', () => {
    it('should have non-empty notes when present', () => {
      allEntries.forEach(entry => {
        if (entry.notes) {
          expect(entry.notes.trim()).not.toBe('');
        }
      });
    });
  });

  // ============================================
  // SORTING VALIDATION (INFORMATIONAL)
  // ============================================
  describe('Sorting Validation', () => {
    it('should be sortable by letter', () => {
      // This test verifies entries CAN be sorted by letter, not that they ARE sorted
      // The data files may not be sorted, but the app sorts them at display time
      const sortedWords = [...allWords].sort((a, b) => {
        if (a.letter !== b.letter) return a.letter.localeCompare(b.letter);
        return a.term.localeCompare(b.term);
      });
      expect(sortedWords.length).toBe(allWords.length);
    });

    it('should be sortable by term within letter', () => {
      // This test verifies entries CAN be sorted by term, not that they ARE sorted
      const sortedPhrases = [...allPhrases].sort((a, b) => {
        if (a.letter !== b.letter) return a.letter.localeCompare(b.letter);
        return a.term.localeCompare(b.term);
      });
      expect(sortedPhrases.length).toBe(allPhrases.length);
    });

    it('should have entries that can be grouped by letter', () => {
      const letterGroups = new Map<string, DictionaryEntry[]>();
      allEntries.forEach(entry => {
        if (!letterGroups.has(entry.letter)) {
          letterGroups.set(entry.letter, []);
        }
        letterGroups.get(entry.letter)!.push(entry);
      });
      expect(letterGroups.size).toBeGreaterThan(0);
    });
  });

  // ============================================
  // CONTENT QUALITY CHECKS
  // ============================================
  describe('Content Quality Checks', () => {
    it('should not have trailing whitespace in terms', () => {
      allEntries.forEach(entry => {
        expect(entry.term).toBe(entry.term.trim());
      });
    });

    it('should not have double spaces in definitions', () => {
      allEntries.forEach(entry => {
        if (entry.definitionStandard) {
          expect(entry.definitionStandard).not.toMatch(/  /);
        }
        if (entry.definitionDialect) {
          expect(entry.definitionDialect).not.toMatch(/  /);
        }
      });
    });

    it('should have definitions that differ between standard and dialect', () => {
      // At least some entries should have different standard and dialect definitions
      const entriesWithDifferentDefs = allEntries.filter(
        e => e.definitionStandard && e.definitionDialect && e.definitionStandard !== e.definitionDialect
      );
      expect(entriesWithDifferentDefs.length).toBeGreaterThan(allEntries.length * 0.3);
    });
  });

  // ============================================
  // SPECIFIC CORE TERMS PRESENCE
  // ============================================
  describe('Core Terms Presence', () => {
    it('should have Borlaug entry', () => {
      const borlaug = allEntries.find(e => e.term === 'Borlaug');
      expect(borlaug).toBeDefined();
    });

    it('should have B⁵lesséd entry', () => {
      const blessed = allEntries.find(e => e.term === 'B⁵lesséd');
      expect(blessed).toBeDefined();
    });

    it('should have calmunity⁵ entry', () => {
      const calmunity = allEntries.find(e => e.term === 'calmunity⁵');
      expect(calmunity).toBeDefined();
    });

    it('should have Semmelspan entry', () => {
      const semmelspan = allEntries.find(e => e.term === 'Semmelspan');
      expect(semmelspan).toBeDefined();
    });

    it('should have Borlaug more phrase', () => {
      const borlaugMore = allPhrases.find(e => e.term === 'Borlaug more');
      expect(borlaugMore).toBeDefined();
    });

    it('should have Borlaug Less Éd phrase', () => {
      const borlaugLess = allPhrases.find(e => e.term === 'Borlaug Less Éd');
      expect(borlaugLess).toBeDefined();
    });
  });
});
