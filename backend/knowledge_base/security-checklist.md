# Security Review Checklist

## Authentication & Authorization

- Never store passwords in plain text — always hash (bcrypt, argon2), never MD5 or SHA1 alone
- Check that new endpoints have proper auth checks, not just relying on frontend hiding
- Session tokens should have expiration

## Secrets & Config

- No API keys, passwords, or secrets committed directly in code
- Environment variables should be used for all credentials
- `.env` files should always be in `.gitignore`

## Database

- Use parameterized queries — never string-concatenate raw SQL (SQL injection risk)
- Migrations that alter sensitive tables (payments, users) need extra scrutiny
- Avoid storing sensitive data (card numbers, SSNs) in plain columns — use a payment processor or encryption

## Input Validation

- Never trust client-side validation alone — always validate on the backend too
- Sanitize any user input that gets rendered back (XSS risk)

## Dependencies

- Flag dependency updates that fix known CVEs as high priority
- Be cautious of newly added dependencies with few downloads/maintainers
