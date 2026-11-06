# MaxPowerHub by CyberBoost

Initial standalone public-beta application for a Microsoft Power Platform resource library and citation-first assistant.

Live library-only preview: [maxpowerhub.netlify.app](https://maxpowerhub.netlify.app)

## What is included

- Responsive, accessible product homepage
- Intent-aware weighted search with product, role, task, and skill-level filters
- Shareable search URLs and transparent match explanations
- Developer, Architect, Maker, and Administrator pathways
- Four-question implementation-pattern guide with cited supporting resources
- Library-only assistant experience with structured source cards
- Static export with no server credentials or AI usage costs
- Input length controls with no prompt transmission or storage
- CyberBoost attribution and consulting call to action

## Run locally

1. Install Node.js 20 or newer.
2. Run `npm install`.
3. Run `npm run dev` and open `http://localhost:3000`.

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

The public preview is intentionally library-only and was published from a verified static export. AI answers remain disabled until the launch gates above are complete.

Created by [CyberBoost](https://www.mycyberboost.tech). Independent resource; not affiliated with or endorsed by Microsoft.
