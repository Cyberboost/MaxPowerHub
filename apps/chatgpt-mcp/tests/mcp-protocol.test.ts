import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import {Client} from '@modelcontextprotocol/sdk/client/index.js';
import {InMemoryTransport} from '@modelcontextprotocol/sdk/inMemory.js';
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
    const result=await client.callTool({name:'search_power_platform_resources',arguments:{query:'Power Fx',limit:3}});
    assert.equal(result.isError,undefined);
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
