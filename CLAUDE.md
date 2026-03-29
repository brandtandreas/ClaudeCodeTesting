# CLAUDE.md

This file provides guidance to AI assistants (Claude Code and others) working in this repository.

## Repository Overview

**Repository**: `brandtandreas/ClaudeCodeTesting`
**Remote**: https://github.com/brandtandreas/ClaudeCodeTesting

This is a currently empty repository used for testing and experimenting with Claude Code workflows. As content is added, this file should be updated to reflect the actual codebase structure, conventions, and tooling.

## Git Workflow

### Branch Naming
Feature branches follow the pattern: `claude/<description>-<id>`

Example: `claude/add-claude-documentation-CYDcK`

### Development Flow
1. Create or checkout the designated feature branch before making changes
2. Commit changes with clear, descriptive messages
3. Push with tracking: `git push -u origin <branch-name>`
4. Never push directly to `main` without explicit permission

### Commit Messages
- Use imperative mood: "Add feature" not "Added feature"
- Keep the first line under 72 characters
- Reference issues or context in the body when relevant

## AI Assistant Conventions

### General Principles
- Read files before editing them
- Prefer editing existing files over creating new ones
- Do not add features, refactoring, or improvements beyond what was asked
- Do not add docstrings, comments, or type annotations to code you didn't change
- Do not add error handling for scenarios that can't happen
- Three similar lines of code is better than a premature abstraction

### Security
- Never introduce command injection, XSS, SQL injection, or other OWASP top 10 vulnerabilities
- Validate input only at system boundaries (user input, external APIs)
- Never commit secrets, credentials, or `.env` files

### File Operations
- Use dedicated tools (Read, Edit, Write, Glob, Grep) rather than shell equivalents when available
- Always use absolute paths in tool calls

### Risky Actions — Ask Before Proceeding
The following require explicit user confirmation before executing:
- Deleting files or branches
- Force-pushing (`git push --force`)
- Hard resets (`git reset --hard`)
- Dropping database tables or data
- Posting to external services (GitHub comments, Slack, email)
- Creating pull requests (only when explicitly asked)

## Codebase Structure

> This section will be updated as the project grows.

Currently the repository contains only:
- `CLAUDE.md` — this file

## Development Setup

> Add setup instructions here when the project stack is established.

Typical steps to document:
1. Prerequisites (runtime versions, tools)
2. Dependency installation command
3. Environment variable setup
4. How to run the project locally
5. How to run tests

## Testing

> Add testing instructions here when a test framework is chosen.

Document:
- Test runner command
- How to run a single test file
- Where tests live relative to source files
- Any required test environment setup

## Linting and Formatting

> Add linting/formatting instructions here when tooling is configured.

Document:
- Lint command
- Format command
- Whether these run automatically (pre-commit hooks, CI)
- Any editor configuration files (`.editorconfig`, `.prettierrc`, etc.)

## CI/CD

> Add CI/CD documentation here when pipelines are configured.

Document:
- Which CI system is used (GitHub Actions, etc.)
- What checks run on pull requests
- Deployment process and environments
