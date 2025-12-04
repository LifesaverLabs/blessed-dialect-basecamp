import wordsData from "./dictionary/words.json";
import phrasesData from "./dictionary/phrases.json";
import { validateDictionaryData, type DictionaryEntry } from "./schema";

// Load and validate dictionary data
let cachedData: { words: DictionaryEntry[]; phrases: DictionaryEntry[] } | null = null;

export function loadDictionaryData() {
  if (cachedData) {
    return cachedData;
  }

  try {
    cachedData = validateDictionaryData(wordsData, phrasesData);
    return cachedData;
  } catch (error) {
    console.error("Dictionary data validation failed:", error);
    throw error;
  }
}

// Convenience functions
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
