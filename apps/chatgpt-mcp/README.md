# MaxPowerHub MCP

Read-only, source-aware Microsoft Power Platform tools for MaxPowerHub AI. The service supports local stdio testing and a production Streamable HTTP endpoint hosted on Vercel.

From repository root:

```sh
cd apps/chatgpt-mcp
npm install
npm test
npm run dev
```

The service exposes nine tools covering resource discovery, implementation patterns, troubleshooting, enterprise solution blueprints, Power Fx and Power Automate expression design and review, project briefs, and Center of Excellence assessments.

Production requests are protected by Vercel Authentication and the configured automation-bypass credential. Never commit or print that credential. The endpoint is stateless, read-only, request-size limited, and does not connect to or modify a customer's Power Platform tenant.
