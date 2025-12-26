#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getFirstLetter(term) {
  // Remove leading superscripts and metric prefixes
  const cleaned = term
    .replace(/^[⁰¹²³⁴⁵⁶⁷⁸⁹]+/, '') // Remove leading superscripts
    .replace(/^[µμ]/, ''); // Remove leading micro/mu prefix (Greek µ and μ)
  return cleaned.charAt(0).toUpperCase();
}

function validateEntry(entry, type) {
  const errors = [];
  const warnings = [];

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

  // Check definition schema - support both old and new formats during migration
  const hasOldDefinition = entry.definition && typeof entry.definition === 'string';
  const hasNewDefinitions =
    (entry.definitionStandard && typeof entry.definitionStandard === 'string') ||
    (entry.definitionDialect && typeof entry.definitionDialect === 'string');

  if (!hasOldDefinition && !hasNewDefinitions) {
    errors.push(`${type} "${entry.term}" missing definition (needs either 'definition' or 'definitionStandard'/'definitionDialect')`);
  }

  // Warn about old schema usage
  if (hasOldDefinition && !hasNewDefinitions) {
    warnings.push(`${type} "${entry.term}" uses old schema (has 'definition' but missing 'definitionStandard'/'definitionDialect')`);
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

  // Validate optional array fields if present
  if (entry.usageExamples && !Array.isArray(entry.usageExamples)) {
    errors.push(`${type} "${entry.term}" has invalid usageExamples (must be array)`);
  }
  if (entry.harmReductionNotes && !Array.isArray(entry.harmReductionNotes)) {
    errors.push(`${type} "${entry.term}" has invalid harmReductionNotes (must be array)`);
  }
  if (entry.crossReferences && !Array.isArray(entry.crossReferences)) {
    errors.push(`${type} "${entry.term}" has invalid crossReferences (must be array)`);
  }
  if (entry.contributors && !Array.isArray(entry.contributors)) {
    errors.push(`${type} "${entry.term}" has invalid contributors (must be array)`);
  }

  return { errors, warnings };
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
    const wordWarnings = [];
    wordsData.words.forEach((word) => {
      const { errors, warnings } = validateEntry(word, 'Word');
      wordErrors.push(...errors);
      wordWarnings.push(...warnings);
    });

    // Validate each phrase
    const phraseErrors = [];
    const phraseWarnings = [];
    phrasesData.phrases.forEach((phrase) => {
      const { errors, warnings } = validateEntry(phrase, 'Phrase');
      phraseErrors.push(...errors);
      phraseWarnings.push(...warnings);
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

    // Report warnings (non-blocking)
    const allWarnings = [...wordWarnings, ...phraseWarnings];
    if (allWarnings.length > 0) {
      console.log('⚠️  Migration warnings (entries using old schema):');
      allWarnings.forEach((warn) => console.log(`   - ${warn}`));
      console.log('');
    }

    // Report success or failure
    if (hasErrors) {
      console.error('❌ Dictionary validation failed\n');
      process.exit(1);
    } else {
      console.log('✅ Dictionary validation passed!');
      console.log(`   Words: ${wordsData.words.length}`);
      console.log(`   Phrases: ${phrasesData.phrases.length}`);
      console.log(`   Total entries: ${allIds.length}`);
      if (allWarnings.length > 0) {
        console.log(`   Entries needing migration: ${allWarnings.length}`);
      }
      console.log('');
    }
  } catch (error) {
    console.error('❌ Error during validation:', error.message);
    process.exit(1);
  }
}

main();
