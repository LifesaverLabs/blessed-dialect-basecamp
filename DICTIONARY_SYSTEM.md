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

### Dictionary Entry Schema

Each entry (word or phrase) has this structure:

```typescript
{
  // Core identifiers
  id: number;        // Unique across ALL entries (words + phrases)
  term: string;      // The word or phrase
  letter: string;    // Single uppercase letter A-Z for alphabetical grouping

  // Dual definition system - Rosetta Stone approach
  definitionStandard: string;  // American Standard English definition
  definitionDialect: string;   // Blesséd Dialekt definition (reveals deeper meaning)

  // Optional enrichment
  usageExamples?: UsageExample[];        // Array of usage examples with context
  harmReductionNotes?: HarmReductionNote[];  // Safety and context warnings (1:N)
  etymology?: string;                    // Word origin and evolution
  pronunciation?: string;                // How to pronounce (IPA or description)
  crossReferences?: number[];            // IDs of related entries
  intentionalityRating?: 1|2|3|4|5;     // How deliberate is usage (1=casual, 5=highly intentional)
  dateAdded?: string;                    // ISO date: YYYYY-MM月DD
  contributors?: string[];               // GitHub usernames or names
  notes?: string;                        // Any additional notes
}
```

### Usage Example Structure

```typescript
{
  context: string;      // Description of the situation
  example: string;      // The actual usage example
  translation?: string; // Optional American Standard English equivalent
}
```

### Harm Reduction Note Structure

Critical for safety and context. **1:N relationship** - one definition can have multiple harm reduction notes, each with multiple categories:

```typescript
{
  categories: string[];  // Array of categories (at least one required)
  note: string;         // The harm reduction guidance
  severity?: "info" | "caution" | "warning" | "critical";
}
```

**Harm Reduction Categories:**
- `life_at_stake` - Physical safety, survival concerns
- `tissue_at_stake` - Bodily harm, health concerns
- `essential_liberty_at_stake` - Fundamental freedoms, autonomy
- `social_kontrakt_at_stake` - Community bonds, trust, relationships
- `property_at_stake` - Material resources, belongings
- `trigger_warning` - Psychological safety
- `context_required` - Needs situational understanding
- `potential_misinterpretation` - Easily misunderstood
- `power_dynamics` - Hierarchical or coercive implications
- `cultural_sensitivity` - Cultural context matters
- `reclaimed_term` - Term with complex history of reclamation
- `other` - Other considerations

### Backward Compatibility

The old `definition` field is deprecated but still supported during migration. New entries should use `definitionStandard` and `definitionDialect` instead.

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

## Keyboard Layouts (KB) System

### Overview

The Knowledge Base (KB) requires symbolic keyboards to become thermodynamically stable. Without accessible symbols, kinetic calmunication⁵ faces enormous difficulty. This system manages keyboard layouts that are more symbolic and expressive than standard keyboards without losing core functionality.

### KB Data Location

```
src/data/dictionary/
└── keyboard-layouts.json  # All keyboard layout metadata
```

### Keyboard Layout Schema

```typescript
{
  // Identification
  id: string;              // Unique identifier (e.g., "calm-kb-v1")
  name: string;            // Human-readable name
  version: string;         // Semantic versioning (e.g., "1.0.0")
  description: string;     // What this layout provides

  // Repository and downloads
  repoUrl: string;         // GitHub or other repo for debate and evolution
  downloadUrl?: string;    // Direct download link
  installInstructions?: string;

  // Expressiveness ratings (1-10 scale)
  symbolicExpressiveness: number;      // How expressive vs standard KB
  coreFunctionalityRetained: number;   // How much standard functionality preserved

  // Issues and tradeoffs
  knownIssues?: KeyboardLayoutIssue[];  // Documented problems
  tradeoffs?: string[];                 // General tradeoff descriptions

  // Metadata
  maintainers?: string[];
  dateCreated?: string;    // Format: YYYYY-MM月DD
  dateUpdated?: string;    // Format: YYYYY-MM月DD
  license?: string;
  tags?: string[];
}
```

### Known Issue Structure

Each KB can document known problems, warnings, and tradeoffs:

```typescript
{
  category: string;         // Type of issue (see categories below)
  description: string;      // Detailed explanation
  severity: "minor" | "moderate" | "major" | "blocking";
  affectedSystems?: string[];  // e.g., ["macOS", "Linux", "Windows"]
  workaround?: string;      // How to mitigate the issue
}
```

**Issue Categories:**
- `terminal_function_keys` - Problems with F1-F12, etc. in terminal apps
- `modifier_conflicts` - Issues with Ctrl, Alt, Cmd combinations
- `unicode_support` - Character rendering issues
- `application_compatibility` - Specific app conflicts
- `accessibility` - Screen reader or accessibility tool issues
- `performance` - Lag or responsiveness problems
- `other` - Other considerations

### KB Evolution and Versioning

Keyboard layouts are **versionable** and **forkable**:

1. Each KB links to a GitHub repository for community debate
2. Version numbers follow semantic versioning (MAJOR.MINOR.PATCH)
3. Contributors can fork and evolve layouts
4. Issues and improvements are tracked via Git

### Adding a New Keyboard Layout

1. Create the keyboard layout files (platform-specific)
2. Set up a Git repository for the layout
3. Add entry to `src/data/dictionary/keyboard-layouts.json`
4. Document known issues, tradeoffs, and workarounds
5. Provide installation instructions
6. Submit PR to include in the directory

### Integration with Dictionary

Keyboard layouts are **conjoint** to the Knowledge Base:
- Without symbolic access, many terms cannot be expressed
- Layouts enable the kinetic expression essential to Blesséd Dialekt
- The relationship is bidirectional: dictionary defines symbols, KBs provide access

### Home Page Features

The home page will provide:
- **KB Browser**: View all available keyboard layouts
- **Comparison Tool**: Compare expressiveness vs functionality ratings
- **Issue Warnings**: See known problems before downloading
- **Download Links**: Direct access to layout files
- **Evolution Timeline**: See how layouts develop over time

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
