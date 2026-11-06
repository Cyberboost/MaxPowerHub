# MaxPowerHub ChatGPT App — implementation plan

Status: design and repository audit; not deployed.

## Existing architecture
- Next.js 15 / React 19 / TypeScript, static export to Netlify.
- Curated, citation-first Microsoft Power Platform resource catalog in `lib/resources.ts`.
- Search and recommendation functions are already imported by `app/page.tsx`.
- Current assistant returns curated citations and does not invoke an AI model.
- Static export (`next.config.ts`) means a remote MCP endpoint needs separate runtime hosting.

## MVP contract
ChatGPT app name: MaxPowerHub by CyberBoost (working name: PowerHub AI).
Public, read-only tools:
1. `search_power_platform_resources` — query and optional product/role/level filters; return title, summary, source URL, and resource ID.
2. `get_resource` — fetch one curated resource by ID.
3. `recommend_implementation_pattern` — recommend a documented Power Platform implementation pattern based on four structured answers.
4. `troubleshoot_power_platform` — return likely diagnostic steps plus supporting curated sources; distinguish guidance from verified diagnosis.

## Proposed structure
```
apps/
  chatgpt-mcp/
    package.json
    src/server.ts
    src/tools/
    tests/
packages/
  knowledge/
    src/
```
Initially extract resource search logic from `lib/resources.ts` into a shared package, preserving the existing web UI imports. Do not duplicate the source catalog.

## Operational controls
- No Microsoft tenant permissions in MVP.
- Input schema validation, response size limits, request timeouts, rate limits.
- No secret keys in Git.
- Citations must retain publisher links; do not imply sources were checked live.
- Deploy MCP to HTTPS runtime separately; keep Netlify static export unchanged.
- No production deployment until local tests, security review, and explicit approval.

## Next engineering actions
1. Inventory remaining source files and exact exported search interfaces.
2. Extract shared knowledge functions without behavior changes.
3. Implement read-only MCP tools with official SDK.
4. Add unit/integration tests and GitHub Actions validation.
5. Deploy staging endpoint, connect ChatGPT developer mode, and verify end-to-end.

## Acceptance criteria
- Existing site builds and behaves as before.
- MCP tools return consistent resource IDs and canonical URLs.
- Invalid inputs fail safely; no private credentials or customer data required.
- Staging ChatGPT app can invoke tools successfully.
- Main branch remains unchanged until reviewed PR.
