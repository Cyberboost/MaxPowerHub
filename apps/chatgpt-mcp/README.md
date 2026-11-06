# MaxPowerHub MCP — local prototype

Read-only MCP tools backed by the existing `lib/resources.ts` catalog. This package currently uses **stdio** for local integration tests and is **not yet a ChatGPT-connectable remote HTTPS server**.

From repository root:

```sh
cd apps/chatgpt-mcp
npm install
npm test
npm run dev
```

The four tools are `search_power_platform_resources`, `get_resource`, `recommend_implementation_pattern`, and `troubleshoot_power_platform`.

Next: add a secure Streamable HTTP transport and staging deployment, verify ChatGPT Apps SDK compatibility, add end-to-end tests, and conduct a security review. Do not expose stdio over the public internet or deploy to production yet.
