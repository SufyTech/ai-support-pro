# Code Review Style Guide

## Naming

- Use descriptive names, not abbreviations (e.g. `userCount` not `uc`)
- Functions should be verbs (e.g. `calculateTotal`, `fetchUser`)
- Constants should be UPPER_SNAKE_CASE

## Error Handling

- Never use empty catch blocks — always log or handle the error
- Prefer specific exceptions over generic ones
- API errors should return meaningful status codes, not just 500

## Code Structure

- Functions should do one thing — if a function needs "and" to describe it, split it
- Avoid deeply nested conditionals (max 2-3 levels)
- Keep functions under ~40 lines where possible

## Comments

- Comment the "why", not the "what" — code should already show what it does
- Remove commented-out code before merging, don't leave it "just in case"

## Testing

- New features should include at least one test covering the happy path
- Bug fixes should include a test that would have caught the bug
