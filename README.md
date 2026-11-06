# MaxPowerHub by CyberBoost

Initial standalone public-beta application for a Microsoft Power Platform resource library and citation-first assistant.

## What is included

- Responsive, accessible product homepage
- Searchable and filterable directory of curated Microsoft and community sources
- Server-side AI assistant route with structured citations
- Library-only fallback when no AI key is configured
- Input length controls and an illustrative in-memory hourly limit
- CyberBoost attribution and consulting call to action

## Run locally

1. Install Node.js 20 or newer.
2. Run `npm install`.
3. Optionally copy `.env.example` to `.env.local` and add an AI key for local testing only.
4. Run `npm run dev` and open `http://localhost:3000`.

Validate a release candidate with:

```text
npm run typecheck
npm run build
npm audit
```

## Public-launch gates

- Complete formal domain and trademark clearance. A preliminary exact-name search found no obvious software product conflict, but did identify an Australian marketplace seller using the `maxpowerhub` handle.
- Replace the in-memory limiter with a persistent, distributed limiter before enabling public AI requests.
- Configure provider spending caps, monitoring, abuse protection, and incident handling.
- Verify every curated URL and establish a review cadence for product changes and stale links.
- Add privacy/terms language appropriate to the final data flow and analytics choices.
- Remove `robots: { index: false }` only after the name and launch are approved.

Do not commit API keys. Configure secrets only in the approved hosting provider’s secret settings.

## Status

The application builds locally. It has not been deployed, and the AI service should remain disabled for public visitors until the launch gates above are complete.

Created by [CyberBoost](https://www.mycyberboost.tech). Independent resource; not affiliated with or endorsed by Microsoft.
