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

async function main() {
  console.log('\n🌱 Add a new word to Blesséd Dialect Dictionary\n');

  const term = await question('Term: ');
  if (!term.trim()) {
    console.error('❌ Term cannot be empty');
    process.exit(1);
  }

  const definition = await question('Definition: ');
  if (!definition.trim()) {
    console.error('❌ Definition cannot be empty');
    process.exit(1);
  }

  const suggestedLetter = getFirstLetter(term);
  const letterInput = await question(`Letter [${suggestedLetter}]: `);
  const letter = (letterInput.trim() || suggestedLetter).toUpperCase();

  if (!/^[A-Z]$/.test(letter)) {
    console.error('❌ Letter must be a single uppercase letter A-Z');
    process.exit(1);
  }

  // Load existing words
  const wordsPath = path.join(__dirname, '../src/data/dictionary/words.json');
  const wordsData = JSON.parse(fs.readFileSync(wordsPath, 'utf8'));

  // Get next ID
  const phrasesPath = path.join(__dirname, '../src/data/dictionary/phrases.json');
  const phrasesData = JSON.parse(fs.readFileSync(phrasesPath, 'utf8'));
  const allIds = [
    ...wordsData.words.map((w) => w.id),
    ...phrasesData.phrases.map((p) => p.id),
  ];
  const nextId = allIds.length > 0 ? Math.max(...allIds) + 1 : 1;

  // Create new entry
  const newEntry = {
    id: nextId,
    term: term.trim(),
    letter: letter,
    definition: definition.trim(),
  };

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
  console.log(`   Definition: ${definition.substring(0, 60)}${definition.length > 60 ? '...' : ''}`);
  console.log('\n💡 Run `npm run dev` to see your changes\n');

  rl.close();
}

main().catch((error) => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});
