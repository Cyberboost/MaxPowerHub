# PowerHub AI by CyberBoost

A standalone, public Microsoft Power Platform knowledge hub with searchable curated resources and an AI-assisted Q&A endpoint.

## Run locally

1. Install Node.js 20+.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local`.
4. Optionally set `OPENAI_API_KEY` in `.env.local` (never commit secrets).
5. Run `npm run dev` and open http://localhost:3000.

## Deploy

Connect this repository to Netlify using its Next.js support. Configure `OPENAI_API_KEY` in the hosting provider's secret environment settings, not in source control.

## Current limitations

This is an initial beta starter, not production-ready. Resource search is a curated static directory; the AI route uses directory metadata, not full-document retrieval. The in-memory IP limit is only illustrative and is not reliable across serverless instances. Before public AI access, add persistent rate limiting, abuse protection, budget caps, monitoring, and source-grounded retrieval. Review generated code and validate security, permissions, licensing, and product versions before use.

## Attribution

Created by [CyberBoost](https://www.mycyberboost.tech). Independent resource; not affiliated with or endorsed by Microsoft.
