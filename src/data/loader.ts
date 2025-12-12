import wordsData from "./dictionary/words.json";
import phrasesData from "./dictionary/phrases.json";
import keyboardLayoutsData from "./dictionary/keyboard-layouts.json";
import {
  validateDictionaryData,
  validateKeyboardLayouts,
  migrateEntry,
  type DictionaryEntry,
  type KeyboardLayout,
} from "./schema";

// Load and validate dictionary data
let cachedData: { words: DictionaryEntry[]; phrases: DictionaryEntry[] } | null =
  null;
let cachedKeyboardLayouts: KeyboardLayout[] | null = null;

export function loadDictionaryData() {
  if (cachedData) {
    return cachedData;
  }

  try {
    // Auto-migrate entries on load if they use old schema
    const migratedWordsData = {
      words: (wordsData as any).words.map(migrateEntry),
    };
    const migratedPhrasesData = {
      phrases: (phrasesData as any).phrases.map(migrateEntry),
    };

    cachedData = validateDictionaryData(migratedWordsData, migratedPhrasesData);
    return cachedData;
  } catch (error) {
    console.error("Dictionary data validation failed:", error);
    throw error;
  }
}

export function loadKeyboardLayouts(): KeyboardLayout[] {
  if (cachedKeyboardLayouts) {
    return cachedKeyboardLayouts;
  }

  try {
    const validated = validateKeyboardLayouts(keyboardLayoutsData);
    cachedKeyboardLayouts = validated.layouts;
    return cachedKeyboardLayouts;
  } catch (error) {
    console.error("Keyboard layouts validation failed:", error);
    throw error;
  }
}

// Dictionary convenience functions
export function getWords(): DictionaryEntry[] {
  return loadDictionaryData().words;
}

export function getPhrases(): DictionaryEntry[] {
  return loadDictionaryData().phrases;
}

export function getAllEntries(): DictionaryEntry[] {
  const data = loadDictionaryData();
  return [...data.words, ...data.phrases];
}

export function getNextAvailableId(): number {
  const allEntries = getAllEntries();
  if (allEntries.length === 0) return 1;
  return Math.max(...allEntries.map((e) => e.id)) + 1;
}

// Keyboard layout convenience functions
export function getKeyboardLayouts(): KeyboardLayout[] {
  return loadKeyboardLayouts();
}

export function getKeyboardLayoutById(id: string): KeyboardLayout | undefined {
  return loadKeyboardLayouts().find((layout) => layout.id === id);
}

export function getKeyboardLayoutsByTag(tag: string): KeyboardLayout[] {
  return loadKeyboardLayouts().filter(
    (layout) => layout.tags?.includes(tag) ?? false
  );
}
