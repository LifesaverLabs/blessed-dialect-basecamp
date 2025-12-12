# Migration Guide: Updating Dictionary Entries to New Schema

**Date**: 02024-12月12

## Quick Reference

### Old Schema → New Schema

```diff
{
  "id": 1,
  "term": "example",
  "letter": "E",
- "definition": "A single definition"
+ "definitionStandard": "American Standard English definition",
+ "definitionDialekt": "Blesséd Dialekt definition (can be same or deeper)"
}
```

## Step-by-Step Migration Process

### 1. For Simple Entries (Same Definition in Both Languages)

**Before:**
```json
{
  "id": 1,
  "term": "Borlaug",
  "letter": "B",
  "definition": "High intentional living; pursuing excellence in all domains"
}
```

**After:**
```json
{
  "id": 1,
  "term": "Borlaug",
  "letter": "B",
  "definitionStandard": "High intentional living; pursuing excellence in all domains",
  "definitionDialekt": "High intentional living; pursuing excellence in all domains"
}
```

### 2. For Entries with Deeper Dialect Meaning

**Before:**
```json
{
  "id": 5,
  "term": "sovereignty⁵",
  "letter": "S",
  "definition": "Self-governance and autonomy"
}
```

**After:**
```json
{
  "id": 5,
  "term": "sovereignty⁵",
  "letter": "S",
  "definitionStandard": "Self-governance; the right and ability to make decisions about one's own life without external control.",
  "definitionDialekt": "The embodied recognition that each being holds inherent authority over their own existence, tissue, choices, and boundaries—a non-transferable property⁵ of consciousness itself."
}
```

### 3. Adding Usage Examples

```json
{
  "id": 5,
  "term": "sovereignty⁵",
  "letter": "S",
  "definitionStandard": "Self-governance; the right and ability to make decisions about one's own life.",
  "definitionDialekt": "The embodied recognition that each being holds inherent authority over their own existence.",
  "usageExamples": [
    {
      "context": "Discussing consent and bodily autonomy",
      "example": "Personal sovereignty⁵ means your body, your choice—always.",
      "translation": "You have the right to make decisions about your own body."
    },
    {
      "context": "Community organizing around mutual aid",
      "example": "We honor each person's sovereignty⁵ while building interdependence.",
      "translation": "We respect individual autonomy while working together."
    }
  ]
}
```

### 4. Adding Harm Reduction Notes

For terms that involve safety, power dynamics, or potential misuse:

```json
{
  "id": 5,
  "term": "sovereignty⁵",
  "letter": "S",
  "definitionStandard": "Self-governance; the right to make decisions about one's own life.",
  "definitionDialekt": "The embodied recognition that each being holds inherent authority over their existence.",
  "harmReductionNotes": [
    {
      "categories": ["essential_liberty_at_stake", "social_kontrakt_at_stake"],
      "note": "Individual sovereignty and collective well-being can appear to clash. Both deserve careful consideration.",
      "severity": "critical"
    },
    {
      "categories": ["power_dynamics", "potential_misinterpretation"],
      "note": "Historical misuse of 'sovereignty' rhetoric has sometimes enabled harmful behavior. Context matters.",
      "severity": "warning"
    }
  ]
}
```

### 5. Full Rich Entry with All Optional Fields

```json
{
  "id": 5,
  "term": "sovereignty⁵",
  "letter": "S",
  "definitionStandard": "Self-governance; the right and ability to make decisions about one's own life without external control.",
  "definitionDialekt": "The embodied recognition that each being holds inherent authority over their own existence, tissue, choices, and boundaries—a non-transferable property⁵ of consciousness itself.",
  "usageExamples": [
    {
      "context": "Discussing consent and bodily autonomy",
      "example": "Personal sovereignty⁵ means your body, your choice—always."
    }
  ],
  "harmReductionNotes": [
    {
      "categories": ["essential_liberty_at_stake", "social_kontrakt_at_stake"],
      "note": "Individual sovereignty and collective well-being can appear to clash. Both deserve consideration.",
      "severity": "critical"
    }
  ],
  "etymology": "From Latin 'super' (above) + 'reign' (rule). Adopted into political theory in 16th century. Reclaimed here for personal autonomy.",
  "pronunciation": "SOV-rin-tee (emphasis on first syllable)",
  "crossReferences": [3, 7, 15],
  "intentionalityRating": 5,
  "dateAdded": "02024-12月12",
  "contributors": ["lifesaverlabs", "community-member"],
  "notes": "Core concept in Blesséd Dialekt philosophy. The ⁵ indicates maximum intentionality."
}
```

## Prioritization Guide

### High Priority for Migration
1. **Terms with safety implications** → Add harm reduction notes
2. **Terms with cultural sensitivity** → Add harm reduction notes + usage examples
3. **Core concepts with deeper meanings** → Differentiate Standard vs Dialect definitions
4. **Frequently used terms** → Add usage examples

### Medium Priority
5. **Technical terms** → Add etymology, cross-references
6. **New coinages** → Add pronunciation, etymology
7. **Terms with superscripts (⁵)** → Document intentionality rating

### Lower Priority (Can Do Over Time)
8. **Simple terms** → Just migrate to dual-definition format
9. **Rarely used terms** → Migrate as needed

## Harm Reduction Note Decision Tree

Use this to decide if a term needs harm reduction notes:

```
Does the term involve:
- Physical safety? → life_at_stake
- Bodily harm/health? → tissue_at_stake
- Personal freedoms? → essential_liberty_at_stake
- Community trust? → social_kontrakt_at_stake
- Resources/property? → property_at_stake
- Trauma/triggers? → trigger_warning
- Power imbalances? → power_dynamics
- Cultural context? → cultural_sensitivity
- Reclaimed language? → reclaimed_term
- Easy to misunderstand? → potential_misinterpretation
- Needs specific context? → context_required

If YES to any → Add harm reduction note with appropriate categories
```

## Automated Migration

The schema includes helper functions:

```typescript
import { needsMigration, migrateEntry } from "@/data/schema";

// Check if entry needs migration
if (needsMigration(entry)) {
  // Automatically convert old format to new
  const updated = migrateEntry(entry);
}
```

## Batch Migration Script Example

```javascript
// scripts/migrate-to-new-schema.js
const fs = require('fs');

const wordsData = JSON.parse(fs.readFileSync('./src/data/dictionary/words.json'));

const migrated = {
  words: wordsData.words.map(word => {
    if (word.definition && !word.definitionStandard) {
      return {
        ...word,
        definitionStandard: word.definition,
        definitionDialekt: word.definition
        // Remove old definition field after migration
      };
    }
    return word;
  })
};

fs.writeFileSync('./src/data/dictionary/words.json', JSON.stringify(migrated, null, 2));
console.log('Migration complete!');
```

## Testing After Migration

1. **Validate data**: `npm run validate-dict`
2. **Build project**: `npm run build`
3. **Run in browser**: `npm run dev`
4. **Check specific entries**: Verify harm reduction notes display correctly

## Questions?

- See [SCHEMA_EXPANSION_SUMMARY.md](SCHEMA_EXPANSION_SUMMARY.md) for overview
- See [EXAMPLE_ENTRY.md](EXAMPLE_ENTRY.md) for detailed examples
- See [DICTIONARY_SYSTEM.md](DICTIONARY_SYSTEM.md) for full documentation

---

**Remember**: The schema is meant to evolve. If you need something that doesn't fit, that's the schema's problem, not yours. Propose changes!
