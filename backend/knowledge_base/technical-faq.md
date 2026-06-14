# Technical & API FAQ

## Why am I getting 429 errors?
429 means you have exceeded your API rate limit. Starter plan allows 100 requests/minute. Upgrade to Professional for 1000 requests/minute or implement exponential backoff.

## How do I integrate with Slack?
Go to Settings > Integrations > Slack. Click Connect, authorize the app, and select the channel for notifications. Tickets will post automatically.

## The Slack integration stopped working. How do I fix it?
Go to Settings > Integrations > Slack > Reconnect. This refreshes the OAuth token. If it still fails, disconnect and reconnect from scratch.

## What is your API rate limit?
Starter: 100 requests/minute. Professional: 1000 requests/minute. Enterprise: unlimited with dedicated infrastructure.

## How do I get my API key?
Go to Settings > API > Generate Key. Keep it secret — never expose it in frontend code. Rotate it immediately if compromised.
