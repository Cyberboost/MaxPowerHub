import {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js';
import {StdioServerTransport} from '@modelcontextprotocol/sdk/server/stdio.js';
import {z} from 'zod';
import {getResource,recommendImplementationPattern,searchPowerPlatformResources,troubleshootPowerPlatform} from './tools.js';

export function createPowerHubServer(){
const server=new McpServer({name:'maxpowerhub-by-cyberboost',version:'0.1.0'});
const respond=(data:unknown)=>({content:[{type:'text' as const,text:JSON.stringify(data)}]});

server.tool('search_power_platform_resources','Search curated Power Platform references with source links',{
  query:z.string().min(1).max(500),product:z.string().optional(),role:z.string().optional(),
  task:z.string().optional(),level:z.string().optional(),limit:z.number().int().min(1).max(10).optional()
},async input=>respond(searchPowerPlatformResources(input)));

server.tool('get_resource','Get a curated reference by stable resource ID',{
  id:z.string().min(1).max(120)
},async ({id})=>respond(getResource(id)));

server.tool('recommend_implementation_pattern','Suggest a Power Platform implementation pattern with references',{
  experience:z.string().max(120),data:z.string().max(120),
  logic:z.string().max(120),audience:z.string().max(120)
},async input=>respond(recommendImplementationPattern(input)));

server.tool('troubleshoot_power_platform','Return safe diagnostic steps and curated troubleshooting references',{
  problem:z.string().min(1).max(1500),product:z.string().max(120).optional()
},async input=>respond(troubleshootPowerPlatform(input)));

return server;
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  await createPowerHubServer().connect(new StdioServerTransport());
}
