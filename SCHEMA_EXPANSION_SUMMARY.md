# Schema Expansion Summary

**Date**: 02024-12月12

## Overview

The dictionary system has been significantly expanded to support richer, more expressive entries and to integrate keyboard layout management as a conjoint system to the Knowledge Base.

## Key Changes

### 1. Dictionary Entry Schema Enhancements

#### Dual Definition System (Rosetta Stone Approach)
- **Old**: Single `definition` field
- **New**: Two required fields:
  - `definitionStandard`: American Standard English definition
  - `definitionDialekt`: Blesséd Dialekt definition (may reveal deeper meaning)
- **Purpose**: Enable bidirectional learning between standard English and Blesséd Dialekt

#### Usage Examples (New)
- Array of structured examples showing terms in context
- Each example includes:
  - `context`: The situation
  - `example`: The actual usage
  - `translation`: Optional Standard English equivalent

#### Harm Reduction Notes (New)
- **1:N relationship**: One definition can have multiple harm reduction notes
- Each note can have **multiple categories** (N categories per note)
- Categories include:
  - `life_at_stake` - Physical safety concerns
  - `tissue_at_stake` - Bodily harm concerns
  - `essential_liberty_at_stake` - Fundamental freedoms
  - `social_kontrakt_at_stake` - Community/trust concerns
  - `property_at_stake` - Material resources
  - Plus standard categories: trigger warnings, power dynamics, cultural sensitivity, etc.
- Severity levels: `info`, `caution`, `warning`, `critical`

#### Additional Optional Fields
- `etymology` - Word origin and evolution
- `pronunciation` - How to pronounce
- `crossReferences` - IDs of related entries
- `intentionalityRating` - 1-5 scale of deliberate usage
- `dateAdded` - Using YYYYY-MM月DD format
- `contributors` - Array of contributor names
- `notes` - Additional context

### 2. Keyboard Layout (KB) System

#### New Schema for Keyboard Layouts
Manages symbolic keyboard layouts that enable kinetic calmunication:

**Core Fields:**
- `id`, `name`, `version` (semver)
- `description`
- `repoUrl` - GitHub or other repo for community evolution
- `downloadUrl` - Direct download link
- `installInstructions`

**Ratings (1-10 scale):**
- `symbolicExpressiveness` - How expressive vs standard KB
- `coreFunctionalityRetained` - How much standard functionality preserved

**Known Issues:**
- Structured issue tracking with categories:
  - `terminal_function_keys` - F-key conflicts
  - `modifier_conflicts` - Cmd/Ctrl/Alt issues
  - `unicode_support` - Rendering problems
  - `application_compatibility` - App-specific conflicts
  - `accessibility` - Screen reader issues
  - `performance` - Lag/responsiveness
- Each issue includes:
  - `description`, `severity` (minor/moderate/major/blocking)
  - `affectedSystems` array
  - `workaround` suggestions

**Tradeoffs:**
- Array of general tradeoff descriptions

**Metadata:**
- `maintainers`, `dateCreated`, `dateUpdated`, `license`, `tags`

#### Why KB System is Conjoint
- Without symbolic keyboards, many terms cannot be expressed
- Enables thermodynamically stable kinetic calmunication
- Bidirectional relationship: dictionary defines symbols, KBs provide access

### 3. Date Format Standardization

**New Standard**: YYYYY-MM月DD
- 5-digit years (Long Now Foundation format)
- Month followed by 月 character
- Big-endian ordering (most to least significant)
- Example: `02024-12月12` instead of `2024-12-12`

**Documented in**: [PROMPT.md](PROMPT.md)

## Files Created/Modified

### Created:
1. `src/data/dictionary/keyboard-layouts.json` - KB layout data with example CALM KB
2. `EXAMPLE_ENTRY.md` - Comprehensive examples of new schema usage
3. `PROMPT.md` - AI assistant guidelines including date format
4. `SCHEMA_EXPANSION_SUMMARY.md` - This document

### Modified:
1. `src/data/schema.ts`:
   - Added `UsageExampleSchema`
   - Added `HarmReductionNoteSchema` with N categories per note
   - Expanded `DictionaryEntrySchema` with dual definitions and optional fields
   - Added `KeyboardLayoutSchema` and `KeyboardLayoutIssueSchema`
   - Added migration helpers for backward compatibility
   - Exported new types

2. `src/data/loader.ts`:
   - Added keyboard layout loading and caching
   - Added `getKeyboardLayouts()`, `getKeyboardLayoutById()`, `getKeyboardLayoutsByTag()`

3. `DICTIONARY_SYSTEM.md`:
   - Expanded schema documentation with all new fields
   - Added comprehensive Keyboard Layouts (KB) System section
   - Documented harm reduction categories
   - Added usage examples and harm reduction note structures

## Backward Compatibility

- Old `definition` field still supported (marked optional)
- Migration helper functions provided:
  - `needsMigration(entry)` - Check if entry uses old format
  - `migrateEntry(entry)` - Convert old to new format
- Existing entries will continue to work

## Next Steps for Implementation

1. **Update existing dictionary entries** to use new dual-definition format
2. **Add usage examples** to high-priority terms
3. **Add harm reduction notes** where critical (especially for terms involving power, safety, or cultural sensitivity)
4. **Create actual CALM KB** files for download (macOS .keylayout, Windows .klc, Linux .xkb)
5. **Build UI components**:
   - KB browser and comparison tool on home page
   - Display harm reduction warnings in dictionary entries
   - Show usage examples in expandable sections
   - Rosetta Stone toggle between Standard/Dialect definitions
6. **Update CLI scripts** (add-word.js, add-phrase.js) to support new fields

## Philosophy

This expansion embodies the core Blesséd Dialekt principles:
- **Fighting schema lock** - Schema is designed to evolve
- **Harm reduction** - Safety and context built into the system
- **Bidirectional learning** - Rosetta Stone approach honors both languages
- **Kinetic expression** - KB system enables embodied calmunication
- **Community evolution** - Everything is versionable, forkable, and debatable via Git

---

**Questions or suggestions?** See [CONTRIBUTING.md](CONTRIBUTING.md) or open an issue.
