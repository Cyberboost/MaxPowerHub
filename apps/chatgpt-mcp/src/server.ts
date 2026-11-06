import {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js';
import {StdioServerTransport} from '@modelcontextprotocol/sdk/server/stdio.js';
import {z} from 'zod';
import {assessCenterOfExcellence,createPowerPlatformProjectBrief,designPowerPlatformExpression,generateSolutionBlueprint,getResource,recommendImplementationPattern,reviewPowerPlatformExpression,searchPowerPlatformResources,troubleshootPowerPlatform} from './tools.js';

export function createPowerHubServer(){
const server=new McpServer({name:'maxpowerhub-by-cyberboost',version:'0.4.0'});
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

server.tool('generate_solution_blueprint','Create a draft Power Platform architecture, security, environment, delivery, and risk blueprint with sources',{
  objective:z.string().min(1).max(1000),users:z.string().min(1).max(500),data:z.string().min(1).max(700),process:z.string().min(1).max(1000),
  integrations:z.string().max(700).optional(),security:z.string().max(700).optional(),scale:z.string().max(500).optional(),constraints:z.string().max(700).optional(),
  businessCriticality:z.enum(['Low','Moderate','High','Mission critical']).optional(),availability:z.string().max(300).optional(),recovery:z.string().max(300).optional(),compliance:z.string().max(700).optional()
},async input=>respond(generateSolutionBlueprint(input)));

server.tool('review_power_platform_expression','Perform a safe static review of a Power Fx or Power Automate expression and return test guidance',{
  language:z.enum(['Power Fx','Power Automate']),expression:z.string().min(1).max(8000),intent:z.string().max(700).optional()
},async input=>respond(reviewPowerPlatformExpression(input)));

server.tool('design_power_platform_expression','Create a documented draft Power Fx or Power Automate expression pattern with assumptions, safety checks, and official sources',{
  language:z.enum(['Power Fx','Power Automate']),scenario:z.string().min(1).max(300),requirements:z.string().min(1).max(1500),dataSource:z.string().max(300).optional(),fieldNames:z.string().max(700).optional()
},async input=>respond(designPowerPlatformExpression(input)));

server.tool('create_power_platform_project_brief','Turn discovery notes into a structured Power Platform project brief, backlog, questions, and governance gates',{
  name:z.string().min(1).max(160),objective:z.string().min(1).max(1000),users:z.string().min(1).max(700),scope:z.string().min(1).max(1200),
  data:z.string().max(700).optional(),integrations:z.string().max(700).optional(),success:z.string().max(700).optional(),constraints:z.string().max(700).optional()
},async input=>respond(createPowerPlatformProjectBrief(input)));

server.tool('assess_power_platform_coe','Create a native-first Power Platform Center of Excellence readiness, governance, operating-model, and 90-day management plan',{
  organization:z.string().min(1).max(300),maturity:z.enum(['Initial','Repeatable','Defined','Capable','Efficient']),
  makers:z.string().max(700).optional(),environments:z.string().max(700).optional(),governance:z.string().max(1000).optional(),support:z.string().max(700).optional(),goals:z.string().max(1000).optional()
},async input=>respond(assessCenterOfExcellence(input)));

return server;
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  await createPowerHubServer().connect(new StdioServerTransport());
}
