#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

function getFirstLetter(term) {
  // Remove leading superscripts
  const cleaned = term.replace(/^[⁰¹²³⁴⁵⁶⁷⁸⁹]+/, '');
  return cleaned.charAt(0).toUpperCase();
}

function getCurrentDate() {
  const now = new Date();
  const year = String(now.getFullYear()).padStart(5, '0');
  const month = now.getMonth() + 1;
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}月${day}`;
}

// Valid harm reduction categories
const HARM_REDUCTION_CATEGORIES = [
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

const SEVERITY_LEVELS = ['info', 'caution', 'warning', 'critical'];

async function collectUsageExamples() {
  const examples = [];
  console.log('\n📝 Usage Examples (press Enter with empty context to skip/finish):');

  while (true) {
    const context = await question('  Context (situation description): ');
    if (!context.trim()) break;

    const example = await question('  Example sentence: ');
    if (!example.trim()) {
      console.log('  ⚠️  Example cannot be empty, skipping this entry');
      continue;
    }

    const translation = await question('  Translation to Standard English (optional): ');

    const entry = {
      context: context.trim(),
      example: example.trim(),
    };
    if (translation.trim()) {
      entry.translation = translation.trim();
    }
    examples.push(entry);
    console.log('  ✓ Example added\n');
  }

  return examples.length > 0 ? examples : undefined;
}

async function collectHarmReductionNotes() {
  const notes = [];
  console.log('\n⚠️  Harm Reduction Notes (press Enter with empty note to skip/finish):');
  console.log('   Categories: life_at_stake, tissue_at_stake, essential_liberty_at_stake,');
  console.log('   social_kontrakt_at_stake, property_at_stake, trigger_warning, context_required,');
  console.log('   potential_misinterpretation, power_dynamics, cultural_sensitivity, reclaimed_term, other\n');

  while (true) {
    const note = await question('  Note text: ');
    if (!note.trim()) break;

    const categoriesInput = await question('  Categories (comma-separated): ');
    const categories = categoriesInput
      .split(',')
      .map(c => c.trim().toLowerCase())
      .filter(c => HARM_REDUCTION_CATEGORIES.includes(c));

    if (categories.length === 0) {
      console.log('  ⚠️  At least one valid category required. Valid categories listed above.');
      continue;
    }

    const severityInput = await question('  Severity (info/caution/warning/critical) [info]: ');
    const severity = SEVERITY_LEVELS.includes(severityInput.trim().toLowerCase())
      ? severityInput.trim().toLowerCase()
      : 'info';

    notes.push({
      categories,
      note: note.trim(),
      severity,
    });
    console.log('  ✓ Harm reduction note added\n');
  }

  return notes.length > 0 ? notes : undefined;
}

async function collectCrossReferences(wordsData, phrasesData) {
  console.log('\n🔗 Cross References (enter IDs of related entries, comma-separated, or press Enter to skip):');

  // Show available entries for reference
  const allEntries = [
    ...wordsData.words.map(w => ({ id: w.id, term: w.term, type: 'word' })),
    ...phrasesData.phrases.map(p => ({ id: p.id, term: p.term, type: 'phrase' })),
  ].sort((a, b) => a.id - b.id);

  if (allEntries.length > 0) {
    console.log('   Available entries:');
    allEntries.slice(0, 20).forEach(e => {
      console.log(`     ${e.id}: ${e.term} (${e.type})`);
    });
    if (allEntries.length > 20) {
      console.log(`     ... and ${allEntries.length - 20} more`);
    }
  }

  const input = await question('  Related entry IDs: ');
  if (!input.trim()) return undefined;

  const ids = input
    .split(',')
    .map(s => parseInt(s.trim(), 10))
    .filter(id => !isNaN(id) && allEntries.some(e => e.id === id));

  return ids.length > 0 ? ids : undefined;
}

async function main() {
  console.log('\n🌱 Add a new word to Blesséd Dialect Dictionary\n');
  console.log('This script supports the expanded schema with optional fields.');
  console.log('Press Enter to skip any optional field.\n');

  // Required fields
  const term = await question('Term: ');
  if (!term.trim()) {
    console.error('❌ Term cannot be empty');
    process.exit(1);
  }

  console.log('\n📖 Dual Definition System (Rosetta Stone approach):');
  console.log('   - Standard: American Standard English definition');
  console.log('   - Dialect: Blesséd Dialekt definition (may reveal deeper meaning)\n');

  const definitionStandard = await question('Definition (Standard English): ');
  if (!definitionStandard.trim()) {
    console.error('❌ Standard definition cannot be empty');
    process.exit(1);
  }

  const definitionDialectInput = await question(`Definition (Blesséd Dialekt) [same as Standard]: `);
  const definitionDialect = definitionDialectInput.trim() || definitionStandard.trim();

  const suggestedLetter = getFirstLetter(term);
  const letterInput = await question(`Letter [${suggestedLetter}]: `);
  const letter = (letterInput.trim() || suggestedLetter).toUpperCase();

  if (!/^[A-Z]$/.test(letter)) {
    console.error('❌ Letter must be a single uppercase letter A-Z');
    process.exit(1);
  }

  // Load existing data for ID generation and cross-references
  const wordsPath = path.join(__dirname, '../src/data/dictionary/words.json');
  const wordsData = JSON.parse(fs.readFileSync(wordsPath, 'utf8'));
  const phrasesPath = path.join(__dirname, '../src/data/dictionary/phrases.json');
  const phrasesData = JSON.parse(fs.readFileSync(phrasesPath, 'utf8'));

  // Optional fields
  console.log('\n--- Optional Fields ---');

  const etymology = await question('\n📜 Etymology (word origin): ');
  const pronunciation = await question('🔊 Pronunciation (IPA or description): ');

  const intentionalityInput = await question('⭐ Intentionality Rating (1-5, where 5=highly intentional): ');
  const intentionalityRating = parseInt(intentionalityInput.trim(), 10);
  const validIntentionality = intentionalityRating >= 1 && intentionalityRating <= 5 ? intentionalityRating : undefined;

  const contributorsInput = await question('👥 Contributors (comma-separated names/usernames): ');
  const contributors = contributorsInput.trim()
    ? contributorsInput.split(',').map(c => c.trim()).filter(c => c)
    : undefined;

  const notes = await question('📝 Additional Notes: ');

  // Collect usage examples
  const usageExamples = await collectUsageExamples();

  // Collect harm reduction notes
  const harmReductionNotes = await collectHarmReductionNotes();

  // Collect cross-references
  const crossReferences = await collectCrossReferences(wordsData, phrasesData);

  // Get next ID
  const allIds = [
    ...wordsData.words.map((w) => w.id),
    ...phrasesData.phrases.map((p) => p.id),
  ];
  const nextId = allIds.length > 0 ? Math.max(...allIds) + 1 : 1;

  // Create new entry with all fields
  const newEntry = {
    id: nextId,
    term: term.trim(),
    letter: letter,
    definitionStandard: definitionStandard.trim(),
    definitionDialect: definitionDialect,
  };

  // Add optional fields only if they have values
  if (usageExamples) newEntry.usageExamples = usageExamples;
  if (harmReductionNotes) newEntry.harmReductionNotes = harmReductionNotes;
  if (etymology.trim()) newEntry.etymology = etymology.trim();
  if (pronunciation.trim()) newEntry.pronunciation = pronunciation.trim();
  if (crossReferences) newEntry.crossReferences = crossReferences;
  if (validIntentionality) newEntry.intentionalityRating = validIntentionality;
  newEntry.dateAdded = getCurrentDate();
  if (contributors) newEntry.contributors = contributors;
  if (notes.trim()) newEntry.notes = notes.trim();

  // Add to words array
  wordsData.words.push(newEntry);

  // Sort by letter, then by term
  wordsData.words.sort((a, b) => {
    if (a.letter !== b.letter) return a.letter.localeCompare(b.letter);
    return a.term.localeCompare(b.term);
  });

  // Write back to file with pretty formatting
  fs.writeFileSync(wordsPath, JSON.stringify(wordsData, null, 2) + '\n', 'utf8');

  console.log('\n✅ Word added successfully!');
  console.log(`   ID: ${nextId}`);
  console.log(`   Term: ${term}`);
  console.log(`   Letter: ${letter}`);
  console.log(`   Definition (Standard): ${definitionStandard.substring(0, 60)}${definitionStandard.length > 60 ? '...' : ''}`);
  console.log(`   Definition (Dialect): ${definitionDialect.substring(0, 60)}${definitionDialect.length > 60 ? '...' : ''}`);
  if (usageExamples) console.log(`   Usage Examples: ${usageExamples.length}`);
  if (harmReductionNotes) console.log(`   Harm Reduction Notes: ${harmReductionNotes.length}`);
  if (etymology.trim()) console.log(`   Etymology: ${etymology.substring(0, 40)}${etymology.length > 40 ? '...' : ''}`);
  if (pronunciation.trim()) console.log(`   Pronunciation: ${pronunciation}`);
  if (crossReferences) console.log(`   Cross References: ${crossReferences.join(', ')}`);
  if (validIntentionality) console.log(`   Intentionality Rating: ${validIntentionality}/5`);
  if (contributors) console.log(`   Contributors: ${contributors.join(', ')}`);
  console.log(`   Date Added: ${newEntry.dateAdded}`);
  console.log('\n💡 Run `npm run dev` to see your changes\n');

  rl.close();
}

main().catch((error) => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});
