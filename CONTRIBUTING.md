# Contributing to Blesséd Dialect

**Everyone is welcome here.** This calmunity⁵ thrives on diverse perspectives and collaborative evolution. Whether you're adding words, fixing bugs, or proposing new features, your contribution helps shape langauge that serves life itself.

## Ways to Contribute

- **Add dictionary entries** - New words, phrases, or idioms
- **Refine definitions** - Improve clarity and accuracy
- **Improve UI/UX** - Make the site more accessible and beautiful
- **Fix bugs** - Help keep things working smoothly
- **Propose features** - Share ideas in issues
- **Documentation** - Help others understand and use the dialect
- **Challenge the schema** - See limitations? Propose changes to the data structure itself!

## Adding Dictionary Entries

We have **two easy⁵ ways** to add words and phrases to the dictionary:

### Method 1: Interactive CLI Scripts (Easiest)

```bash
# Add a new word
npm run add-word

# Add a new phrase/idiom
npm run add-phrase
```

The scripts will prompt you for:
- **Term**: The word or phrase
- **Definition**: Clear explanation of meaning and usage
- **Letter**: First letter for alphabetical organization (auto-suggested)

The script automatically:
- Assigns a unique ID
- Validates your entry
- Sorts entries alphabetically
- Formats JSON consistently
- Protects against duplicate IDs

### Method 2: Manual JSON Editing

If you prefer direct editing:

1. **For words**: Edit [`src/data/dictionary/words.json`](src/data/dictionary/words.json)
2. **For phrases**: Edit [`src/data/dictionary/phrases.json`](src/data/dictionary/phrases.json)

**Entry format:**
```json
{
  "id": 10,
  "term": "your-term",
  "letter": "Y",
  "definition": "Clear, concise definition with usage examples."
}
```

**Requirements:**
- `id` must be unique across ALL entries (words + phrases)
- `term` cannot be empty
- `letter` must be single uppercase A-Z
- `letter` should match first letter of `term` (ignoring superscripts)
- `definition` cannot be empty

### Validation

Before committing, validate your changes:

```bash
npm run validate-dict
```

This checks for:
- Required fields present
- Unique IDs across all entries
- Letter matches term's first letter
- Valid data types and formats

## Development Workflow

1. **Fork** this repository
2. **Clone** your fork locally
3. **Create a branch**: `git checkout -b feature/your-idea`
4. **Make changes**: Add entries, fix bugs, improve features
5. **Validate**: Run `npm run validate-dict`
6. **Test**: Run `npm run dev` to preview changes
7. **Commit**: Use clear commit messages
8. **Push**: Push to your fork
9. **Pull Request**: Open a PR to the main repo

## Code Style

- Use TypeScript for type safety
- Follow existing formatting patterns
- Run `npm run lint` before committing
- Keep code readable and well-commented

## Dictionary Content Guidelines

When adding terms to the Blesséd Dialect:

### Core Principles
- **Serves life**: Does this term help us Borlaug more?
- **Reduces harm**: Does it promote harmlessness and wellbeing?
- **Legibility**: Can other English/American speakers understand it?
- **Intentionality⁵**: Is the linguistic change thoughtful⁵ and purposeful?

### Definition Quality
- **Clear and concise** - Explain meaning in accessible langauge
- **Usage examples** - Show how the term is used in context
- **Etymology** - Explain origin or reasoning behind the term (when relevant)
- **Connection to mission** - How does this support longevity/harmlessness goals?

### What to Include
✅ Terms that reduce miscalmunication
✅ Words that promote calm collaboration
✅ Phrases that support human flourishing
✅ Respellings with clear purpose (like "langauge" = LAN + gauge)
✅ Superscript notation for thoughtfulness levels (y¹²³⁴⁵)

### What to Question
⚠️ Terms that might confuse more than clarify
⚠️ Changes without clear benefit to human wellbeing
⚠️ Words that reduce legibility unnecessarily

## ⚠️ Fighting Schema Lock: Evolve the Structure Itself

**We are scared of schema lock.** Like [Jaron Lanier warns about MIDI's technical lock-in](https://www.unknownarts.co/p/the-subtle-art-of-keeping-your-options), we don't want our data schema to become a cage that limits what this langauge can express.

### The Problem of Schema Lock

MIDI locked music into 128 notes and fixed velocities—forever limiting digital music's expressive range compared to acoustic instruments with infinite pitch variation. We risk the same with our dictionary schema.

**Early example**: We initially forgot to include "usage examples" as a field in our entry model—an obvious and terrible oversight! Given how experimental this langauge is, we anticipate more such oversights.

### If You See Schema Limitations

**Please speak up or just change it.** If the current schema (ID, term, letter, definition) feels restrictive for your contribution:

#### What might be missing?
- Etymology or origin stories
- Multiple definitions or senses
- Cross-references to related terms
- Audio pronunciation guides
- Historical usage evolution
- Regional variations
- Intentionality⁵ ratings
- Harm reduction notes
- Longevity impact assessments
- Community consensus scores
- Anything else we haven't thought⁵ of!

#### How to propose schema changes

1. **Open an issue** describing the limitation
2. **Propose the new fields** you need
3. **Show use cases** - Why does this help us Borlaug more?
4. **Submit a PR** that:
   - Updates `src/data/schema.ts` with new fields
   - Adds optional fields (don't break existing entries)
   - Updates CLI scripts if needed
   - Documents the change

**Don't ask for permission—propose the change.** We'd rather have 10 schema evolution attempts than miss one genuinely useful field because someone felt they couldn't suggest it.

### Design Principles for Schema Evolution

- **Additive, not destructive** - New fields should be optional
- **Backward compatible** - Existing entries still work
- **Purpose-driven** - Does this help capture infinite pitch vs. fixed tones?
- **Human-readable** - Keep JSON inspectable and editable
- **Git-friendly** - Changes should diff cleanly

### We Want Infinite Pitch, Not 128 Notes

The current schema is a **starting point, not a finish line**. If it's getting in your way of warping langauge toward health, safety⁵, and happiness—that's a bug in the schema, not in your idea.

**Your best ideas might not fit our current form.** That's not your problem—that's our schema's problem. Help us fix it.

## Proposing Major Changes

For significant changes (new features, governance, major refactors):

1. **Open an issue first** - Describe your proposal
2. **Discuss in Forum** - If it affects dialect evolution
3. **Build consensus** - Gather affirms and address dissents
4. **Implement gradually** - Start small, iterate based on feedback

**Exception**: Schema improvements can be proposed directly via PR with explanation—don't wait for consensus if you see an obvious gap.

## Data Integrity & ACID-like Guarantees

Our system provides strong data protection:

### Version Control (Git)
- **Atomic commits**: All changes commit together or not at all
- **Full history**: Every change tracked and revertable
- **Diffable**: Easy to see what changed when
- **Fork-friendly⁵**: Anyone can propose changes via PR

### Schema Validation
- **Type safety**: TypeScript + Zod catch errors before runtime
- **Referential integrity**: Validation prevents duplicate IDs
- **Consistent format**: Scripts enforce uniform structure
- **Build-time checks**: Invalid data fails the build

### Best Practices
- Validate before committing: `npm run validate-dict`
- Review diffs carefully before pushing
- Use descriptive commit messages
- Test locally first: `npm run dev`

## Testing Your Changes

```bash
# Install dependencies
npm install

# Validate dictionary data
npm run validate-dict

# Run development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint
```

## Questions or Issues?

- **Technical problems**: Open an issue on GitHub
- **Dictionary proposals**: Use the Forum page (once implemented)
- **General questions**: Open a discussion on GitHub

## License

By contributing, you agree that your contributions will be licensed under the same open source license as the project.

---

**Thank you for helping evolve langauge that serves life itself.** Your contributions, however small, help us Borlaug more together. 🌱

*Remember: Don't worry about perfection—we're all learning and evolving together.*
