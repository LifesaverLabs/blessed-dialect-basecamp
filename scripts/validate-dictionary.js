#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getFirstLetter(term) {
  // Remove leading superscripts
  const cleaned = term.replace(/^[⁰¹²³⁴⁵⁶⁷⁸⁹]+/, '');
  return cleaned.charAt(0).toUpperCase();
}

function validateEntry(entry, type) {
  const errors = [];

  // Check required fields
  if (!entry.id || typeof entry.id !== 'number') {
    errors.push(`${type} missing or invalid id: ${JSON.stringify(entry)}`);
  }
  if (!entry.term || typeof entry.term !== 'string') {
    errors.push(`${type} missing or invalid term: ${JSON.stringify(entry)}`);
  }
  if (!entry.letter || typeof entry.letter !== 'string') {
    errors.push(`${type} missing or invalid letter: ${JSON.stringify(entry)}`);
  }
  if (!entry.definition || typeof entry.definition !== 'string') {
    errors.push(`${type} missing or invalid definition: ${JSON.stringify(entry)}`);
  }

  // Check letter is single uppercase character
  if (entry.letter && !/^[A-Z]$/.test(entry.letter)) {
    errors.push(
      `${type} "${entry.term}" has invalid letter "${entry.letter}" (must be single uppercase A-Z)`
    );
  }

  // Check letter matches first letter of term
  if (entry.term && entry.letter) {
    const expectedLetter = getFirstLetter(entry.term);
    if (entry.letter !== expectedLetter) {
      errors.push(
        `${type} "${entry.term}" has letter "${entry.letter}" but should be "${expectedLetter}"`
      );
    }
  }

  return errors;
}

function main() {
  console.log('\n🔍 Validating Blesséd Dialect Dictionary...\n');

  const wordsPath = path.join(__dirname, '../src/data/dictionary/words.json');
  const phrasesPath = path.join(__dirname, '../src/data/dictionary/phrases.json');

  let hasErrors = false;

  try {
    // Load and parse words
    const wordsData = JSON.parse(fs.readFileSync(wordsPath, 'utf8'));
    if (!wordsData.words || !Array.isArray(wordsData.words)) {
      console.error('❌ words.json must have a "words" array');
      process.exit(1);
    }

    // Load and parse phrases
    const phrasesData = JSON.parse(fs.readFileSync(phrasesPath, 'utf8'));
    if (!phrasesData.phrases || !Array.isArray(phrasesData.phrases)) {
      console.error('❌ phrases.json must have a "phrases" array');
      process.exit(1);
    }

    // Validate each word
    const wordErrors = [];
    wordsData.words.forEach((word) => {
      const errors = validateEntry(word, 'Word');
      wordErrors.push(...errors);
    });

    // Validate each phrase
    const phraseErrors = [];
    phrasesData.phrases.forEach((phrase) => {
      const errors = validateEntry(phrase, 'Phrase');
      phraseErrors.push(...errors);
    });

    // Check for duplicate IDs
    const allIds = [
      ...wordsData.words.map((w) => w.id),
      ...phrasesData.phrases.map((p) => p.id),
    ];
    const duplicateIds = allIds.filter((id, index) => allIds.indexOf(id) !== index);
    const uniqueDuplicates = [...new Set(duplicateIds)];

    // Report errors
    if (wordErrors.length > 0) {
      console.error('❌ Word validation errors:');
      wordErrors.forEach((err) => console.error(`   - ${err}`));
      console.error('');
      hasErrors = true;
    }

    if (phraseErrors.length > 0) {
      console.error('❌ Phrase validation errors:');
      phraseErrors.forEach((err) => console.error(`   - ${err}`));
      console.error('');
      hasErrors = true;
    }

    if (uniqueDuplicates.length > 0) {
      console.error(`❌ Duplicate IDs found: ${uniqueDuplicates.join(', ')}\n`);
      hasErrors = true;
    }

    // Report success or failure
    if (hasErrors) {
      console.error('❌ Dictionary validation failed\n');
      process.exit(1);
    } else {
      console.log('✅ Dictionary validation passed!');
      console.log(`   Words: ${wordsData.words.length}`);
      console.log(`   Phrases: ${phrasesData.phrases.length}`);
      console.log(`   Total entries: ${allIds.length}\n`);
    }
  } catch (error) {
    console.error('❌ Error during validation:', error.message);
    process.exit(1);
  }
}

main();
