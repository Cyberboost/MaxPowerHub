import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import {Client} from '@modelcontextprotocol/sdk/client/index.js';
import {InMemoryTransport} from '@modelcontextprotocol/sdk/inMemory.js';
import {z} from 'zod';
import {createPowerHubServer} from '../src/server.ts';

test('MCP initializes, discovers nine tools, and invokes search', async () => {
  const server=createPowerHubServer();
  const client=new Client({name:'maxpowerhub-test-client',version:'0.1.0'});
  const [clientTransport,serverTransport]=InMemoryTransport.createLinkedPair();
  try {
    await Promise.all([server.connect(serverTransport),client.connect(clientTransport)]);
    const listed=await client.listTools();
    const names=listed.tools.map(t=>t.name).sort();
    assert.deepEqual(names,[
      'assess_power_platform_coe',
      'create_power_platform_project_brief',
      'design_power_platform_expression',
      'generate_solution_blueprint',
      'get_resource',
      'recommend_implementation_pattern',
      'review_power_platform_expression',
      'search_power_platform_resources',
      'troubleshoot_power_platform'
    ]);
    assert.ok(listed.tools.every(tool=>tool.annotations?.readOnlyHint===true));
    assert.ok(listed.tools.every(tool=>tool.annotations?.destructiveHint===false));
    assert.ok(listed.tools.every(tool=>tool.annotations?.openWorldHint===false));
    assert.ok(listed.tools.every(tool=>Array.isArray(tool._meta?.securitySchemes)));
    const raw=await client.request({method:'tools/list',params:{}},z.any());
    assert.ok(raw.tools.every((tool:any)=>Array.isArray(tool.securitySchemes)));
    const result=await client.callTool({name:'search_power_platform_resources',arguments:{query:'Power Fx',limit:3}});
    assert.equal(result.isError,undefined);
    assert.ok(Array.isArray(result.content));
    const first=result.content[0];
    assert.equal(first.type,'text');
    if(first.type!=='text') throw new Error('Unexpected response type');
    const data=JSON.parse(first.text);
    assert.ok(data.results.length>0);
    assert.ok(data.results.every((item:{url:string})=>item.url.startsWith('https://')));
  } finally {
    await client.close();
    await server.close();
  }
});

test('OAuth mode permits discovery and challenges unauthenticated tool calls', async () => {
  const previous={enabled:process.env.OAUTH_ENABLED,authority:process.env.ENTRA_AUTHORITY,audience:process.env.ENTRA_AUDIENCE,scope:process.env.ENTRA_SCOPE};
  process.env.OAUTH_ENABLED='true';
  process.env.ENTRA_AUTHORITY='common';
  process.env.ENTRA_AUDIENCE='api://67fbdd50-800a-4bff-9001-081100f8485a';
  process.env.ENTRA_SCOPE='mcp.access';
  const server=createPowerHubServer();
  const client=new Client({name:'maxpowerhub-auth-test-client',version:'0.1.0'});
  const [clientTransport,serverTransport]=InMemoryTransport.createLinkedPair();
  try {
    await Promise.all([server.connect(serverTransport),client.connect(clientTransport)]);
    const listed=await client.listTools();
    assert.equal(listed.tools.length,9);
    const raw=await client.request({method:'tools/list',params:{}},z.any());
    assert.ok(raw.tools.every((tool:any)=>{
      const canonical=tool.securitySchemes as Array<{scopes?:string[]}>|undefined;
      const compatibility=tool._meta?.securitySchemes as Array<{scopes?:string[]}>|undefined;
      return canonical?.[0]?.scopes?.includes('api://67fbdd50-800a-4bff-9001-081100f8485a/mcp.access')
        && compatibility?.[0]?.scopes?.includes('api://67fbdd50-800a-4bff-9001-081100f8485a/mcp.access');
    }));
    const result=await client.callTool({name:'search_power_platform_resources',arguments:{query:'Power Fx'}});
    assert.equal(result.isError,true);
    assert.deepEqual(result.structuredContent,{});
    assert.ok(Array.isArray(result._meta?.['mcp/www_authenticate']));
    const challenge=result._meta?.['mcp/www_authenticate']?.[0];
    assert.match(String(challenge),/error="insufficient_scope"/);
    assert.match(String(challenge),/error_description="Sign in to MaxPowerHub AI to continue"/);
  } finally {
    await client.close();
    await server.close();
    for(const [key,value] of Object.entries(previous)){
      const envKey={enabled:'OAUTH_ENABLED',authority:'ENTRA_AUTHORITY',audience:'ENTRA_AUDIENCE',scope:'ENTRA_SCOPE'}[key] as string;
      if(value===undefined)delete process.env[envKey]; else process.env[envKey]=value;
    }
  }
});
