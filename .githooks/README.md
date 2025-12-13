# Git Hooks

This directory contains Git hooks that automatically run during Git operations.

## Pre-commit Hook

The `pre-commit` hook validates the dictionary before every commit to ensure data integrity.

### What it does

- Runs `node scripts/validate-dictionary.js` automatically
- Checks for required fields, unique IDs, proper letter assignments, etc.
- Blocks commits if validation fails
- Shows helpful error messages to guide fixes

### Setup

Git hooks are automatically configured when you run:

```bash
npm install
```

This runs the `postinstall` script which executes `npm run setup-hooks`.

### Manual Setup

If you need to set up hooks manually:

```bash
npm run setup-hooks
```

This command:
1. Configures Git to use `.githooks` directory: `git config core.hooksPath .githooks`
2. Makes the pre-commit hook executable: `chmod +x .githooks/pre-commit`

### Bypassing Hooks (Not Recommended)

In rare cases where you need to commit without validation:

```bash
git commit --no-verify
```

**Warning:** Only use `--no-verify` if you're absolutely sure your changes are correct, as it bypasses the safety checks that protect data integrity.

## Why Git Hooks?

Git hooks ensure that:
- All contributors follow the same validation rules
- Invalid data never enters the repository
- Dictionary integrity is maintained automatically
- Contributors don't need to remember to validate manually

This portable approach works on all contributors' machines without requiring additional tools or CI/CD setup.
