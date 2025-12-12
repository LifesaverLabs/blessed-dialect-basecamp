# Example Dictionary Entry

This document shows how to use the expanded schema with all available fields.

## Full-Featured Example Entry

```json
{
  "id": 999,
  "term": "calmunicate⁵",
  "letter": "C",
  "definitionStandard": "To communicate with intentional calmness and deliberate emotional regulation, prioritizing clarity and mutual understanding over reactive expression.",
  "definitionDialect": "To engage in kinetic, thermodynamically stable exchange where symbolic expression flows through embodied presence, creating resonance between parties without losing individual sovereignty⁵.",
  "usageExamples": [
    {
      "context": "During a high-stakes negotiation where emotions are running high",
      "example": "Instead of reacting defensively, they chose to calmunicate⁵, pausing to breathe and speak from center.",
      "translation": "They communicated calmly and deliberately rather than reacting emotionally."
    },
    {
      "context": "Teaching conflict resolution to community mediators",
      "example": "To calmunicate⁵ is not to suppress emotion, but to channel it through intentionality⁵—feeling fully while choosing your words with care.",
      "translation": "Calm communication means being emotionally aware while speaking thoughtfully."
    }
  ],
  "harmReductionNotes": [
    {
      "categories": ["power_dynamics", "potential_misinterpretation"],
      "note": "Some people may interpret 'calmunication' as tone policing or an expectation to suppress legitimate anger or distress. This term is NOT about silencing marginalized voices or demanding 'civility' from those expressing valid grievances.",
      "severity": "warning"
    },
    {
      "categories": ["context_required", "cultural_sensitivity"],
      "note": "Cultural norms around emotional expression vary widely. What reads as 'calm' in one context may be disengagement in another. Use with awareness of cultural context.",
      "severity": "info"
    },
    {
      "categories": ["social_kontrakt_at_stake"],
      "note": "Authentic calmunication requires trust. In contexts where power imbalances exist, the less powerful party may need to express intensity to be heard. Don't weaponize this concept against justified emotional expression.",
      "severity": "caution"
    }
  ],
  "etymology": "Portmanteau of 'calm' + 'communicate'. Note that 'calm' here is a multivalent polysemic particle—see the term CALM for full definition and free⁵ expansion. Emerged from conflict resolution and embodied practice communities. The ⁵ suffix indicates high intentionality in the Blesséd Dialekt system.",
  "pronunciation": "KAHM-yoo-nih-kayt (emphasis on first syllable, flowing into 'communicate')",
  "crossReferences": [42, 108, 217],
  "intentionalityRating": 5,
  "dateAdded": "02024-12月12",
  "contributors": ["lifesaverlabs", "community"],
  "notes": "This term represents a core practice in Blesséd Dialekt philosophy—the marriage of embodied presence with symbolic expression. It's about kinetic communication that maintains thermodynamic stability."
}
```

## Minimal Valid Example

The minimum required fields for backward compatibility:

```json
{
  "id": 1000,
  "term": "example",
  "letter": "E",
  "definitionStandard": "A representative form or pattern.",
  "definitionDialekt": "A representative form or pattern."
}
```

## Example with Multiple Harm Reduction Notes

Showing how one entry can have many harm reduction notes, each with multiple categories:

```json
{
  "id": 1001,
  "term": "sovereignty⁵",
  "letter": "S",
  "definitionStandard": "Self-governance; the right and ability to make decisions about one's own life without external control.",
  "definitionDialekt": "The embodied recognition that each being holds inherent authority over their own existence, tissue, choices, and boundaries—a non-transferable property⁵ of consciousness itself.",
  "harmReductionNotes": [
    {
      "categories": ["essential_liberty_at_stake", "social_kontrakt_at_stake"],
      "note": "Discussions of sovereignty can quickly become sites of conflict when individual sovereignty and collective well-being appear to clash. Neither should be sacrificed without deep consideration.",
      "severity": "critical"
    },
    {
      "categories": ["property_at_stake", "power_dynamics"],
      "note": "Historical misuse of 'sovereignty' rhetoric (e.g., 'sovereign citizen' movements) has sometimes been deployed to evade legitimate social obligations. Context matters.",
      "severity": "warning"
    },
    {
      "categories": ["context_required", "potential_misinterpretation"],
      "note": "Personal sovereignty exists in relationship to others' sovereignty. It's not license for harm, but recognition of inherent self-determination within ethical bounds.",
      "severity": "caution"
    },
    {
      "categories": ["cultural_sensitivity"],
      "note": "Western individualist frameworks may emphasize personal sovereignty differently than cultures with more collectivist orientations. Neither is wrong; both hold wisdom.",
      "severity": "info"
    }
  ],
  "intentionalityRating": 5,
  "dateAdded": "02024-12月12"
}
```

## Migration from Old Schema

Old schema entry:
```json
{
  "id": 1,
  "term": "Borlaug",
  "letter": "B",
  "definition": "High intentional living; pursuing excellence in all domains"
}
```

New schema equivalent:
```json
{
  "id": 1,
  "term": "Borlaug",
  "letter": "B",
  "definitionStandard": "High intentional living; pursuing excellence in all domains",
  "definitionDialekt": "High intentional living; pursuing excellence in all domains"
}
```

Note: The migration helper functions in `schema.ts` handle backward compatibility automatically.
