# Dictionary Data System

This document explains the dictionary data management system for Blesséd Dialect.

## Overview

The dictionary uses **JSON files with schema validation** to provide:
- ✅ Version control via Git
- ✅ Human-readable, inspectable data
- ✅ ACID-like guarantees through atomic commits
- ✅ Referential integrity protection
- ✅ Fork-friendly⁵ contribution workflow
- ✅ Zero backend infrastructure required

## File Structure

```
src/data/
├── schema.ts                 # TypeScript types + Zod validation schemas
├── loader.ts                 # Data loading and caching utilities
└── dictionary/
    ├── words.json           # All word entries
    └── phrases.json         # All phrase/idiom entries

scripts/
├── add-word.js              # Interactive CLI for adding words
├── add-phrase.js            # Interactive CLI for adding phrases
└── validate-dictionary.js   # Validation script for data integrity
```

## Data Schema

⚠️ **This schema is meant to evolve!** See [CONTRIBUTING.md](CONTRIBUTING.md#️-fighting-schema-lock-evolve-the-structure-itself) for how to propose schema changes. We're fighting schema lock—if you need additional fields, speak up or just add them.

### Current Schema (Minimal Starting Point)

Each entry (word or phrase) has this structure:

```typescript
{
  id: number;        // Unique across ALL entries (words + phrases)
  term: string;      // The word or phrase
  letter: string;    // Single uppercase letter A-Z for alphabetical grouping
  definition: string; // Clear explanation with usage examples
}
```

**Future considerations**: etymology, pronunciation, cross-references, harm reduction notes, intentionality⁵ ratings, usage examples as separate field, etc. Don't let the current schema limit your contributions.

### Validation Rules

1. **ID must be unique** - No duplicates across words and phrases combined
2. **Letter must match term** - First letter of term (ignoring superscripts)
3. **All fields required** - No empty or missing fields
4. **Letter must be A-Z** - Single uppercase character only

## Adding Entries

### Method 1: CLI Scripts (Recommended)

```bash
# Add a word
npm run add-word

# Add a phrase/idiom
npm run add-phrase
```

The scripts handle:
- Auto-generating unique IDs
- Suggesting the correct letter
- Validating input
- Sorting entries alphabetically
- Formatting JSON consistently

### Method 2: Manual JSON Editing

Edit `src/data/dictionary/words.json` or `phrases.json` directly.

**Always validate after editing:**
```bash
npm run validate-dict
```

## Data Integrity Protection

### Git-based ACID Properties

- **Atomicity**: All changes in a commit happen together or not at all
- **Consistency**: Validation ensures data meets schema requirements
- **Isolation**: Git branches isolate changes until merged
- **Durability**: Committed changes are permanently recorded in Git history

### Validation Layers

1. **TypeScript types** - Compile-time type checking
2. **Zod schemas** - Runtime validation when data loads
3. **Validation script** - Pre-commit integrity checks
4. **Build process** - Fails if data is invalid

### Best Practices

```bash
# Before committing changes:
npm run validate-dict  # Check data integrity
npm run dev           # Test in browser
npm run build         # Ensure build succeeds
git diff              # Review your changes
git add .
git commit -m "Add new term: XYZ"
```

## Preventing Data Loss

### Version Control Benefits

- Every change is tracked with author and timestamp
- Full history available via `git log`
- Revert mistakes with `git revert`
- Compare versions with `git diff`
- Branch and experiment safely

### Backup Strategy

Since data is in Git:
- Remote repository (GitHub) is automatic backup
- Fork creates another backup
- Clone to local machine creates another backup
- Git history preserves all previous versions

## Querying Data

### In Application Code

```typescript
import { getWords, getPhrases, getAllEntries } from "@/data/loader";

const words = getWords();           // Get all words
const phrases = getPhrases();       // Get all phrases
const all = getAllEntries();        // Get everything
const nextId = getNextAvailableId(); // For manual entry creation
```

### From Command Line

```bash
# View words
cat src/data/dictionary/words.json | jq .

# Count entries
cat src/data/dictionary/words.json | jq '.words | length'

# Find specific term
cat src/data/dictionary/words.json | jq '.words[] | select(.term == "Borlaug")'

# Get all terms starting with B
cat src/data/dictionary/words.json | jq '.words[] | select(.letter == "B") | .term'
```

## Performance Considerations

### Current Scale
- Small dataset (< 100 entries) loads instantly
- Client-side filtering/search is fast
- No database queries or network requests

### Future Scaling
If the dictionary grows to thousands of entries:
- Consider lazy loading by letter
- Add search indexing
- Implement virtual scrolling
- Split JSON files by letter

For now, the simple approach works perfectly.

## Migration Path

If you later need a database:

1. Export JSON to database format
2. Keep JSON as backup/seed data
3. Add API endpoints
4. Update loader.ts to fetch from API
5. Keep validation scripts for data quality

The current system makes migration easy because data is already structured and validated.

## Why This Approach?

**Advantages over alternatives:**

| Feature | JSON + Git | Database | Markdown Files |
|---------|-----------|----------|----------------|
| Version control | ✅ Perfect | ⚠️ Complex | ✅ Good |
| Human-readable | ✅ Yes | ❌ No | ✅ Yes |
| Easy to fork | ✅ Yes | ❌ No | ✅ Yes |
| Referential integrity | ✅ Validated | ✅ Native | ⚠️ Manual |
| Zero infrastructure | ✅ Yes | ❌ Needs server | ✅ Yes |
| Querying | ⚠️ Client-side | ✅ Powerful | ❌ Limited |
| PR-friendly | ✅ Very | ❌ Not really | ✅ Yes |

For an open-source, community-driven language project, JSON + Git is the sweet spot.

---

**Questions?** See [CONTRIBUTING.md](CONTRIBUTING.md) or open an issue.
