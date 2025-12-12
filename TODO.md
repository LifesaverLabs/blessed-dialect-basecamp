# TODO List for Blesséd Dialect Basecamp

## High Priority

### ⚠️ Schema Migration - Make Dual Definitions Required
**Added**: 02024-12月12
**Status**: TEMPORARY WORKAROUND IN PLACE

Currently, `definitionStandard` and `definitionDialect` are marked as **optional** in the schema to maintain backward compatibility with existing entries that only have the old `definition` field.

**Action Required:**
1. Migrate all existing dictionary entries to include both `definitionStandard` and `definitionDialect`
2. Once migration is complete, change schema back to **required** (non-optional):
   ```typescript
   definitionStandard: z.string().min(1), // Remove .optional()
   definitionDialect: z.string().min(1),  // Remove .optional()
   ```
3. Update validation to ensure both fields are always present

**Location**: `src/data/schema.ts` lines ~60-62

**Why This Matters**:
The Rosetta Stone approach only works when both definitions exist. Making them optional undermines the core feature of bidirectional learning between American Standard and Blesséd Dialekt.

**Migration Script**: See [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) for step-by-step instructions.

---

## Medium Priority

- Add usage examples to high-priority terms
- Add harm reduction notes to terms involving power, safety, or cultural sensitivity
- Create UI components for displaying new schema fields
- Build KB browser and comparison tool for home page
- Update CLI scripts (add-word.js, add-phrase.js) to prompt for new fields

## Lower Priority

- Create actual CALM KB files for download (.keylayout, .klc, .xkb)
- Add cross-references between related terms
- Implement intentionality rating display
- Add contributor attribution in UI
