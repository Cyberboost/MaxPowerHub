import {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js';
import {StdioServerTransport} from '@modelcontextprotocol/sdk/server/stdio.js';
import {z} from 'zod';
import {assessCenterOfExcellence,createPowerPlatformProjectBrief,designPowerPlatformExpression,generateSolutionBlueprint,getResource,recommendImplementationPattern,reviewPowerPlatformExpression,searchPowerPlatformResources,troubleshootPowerPlatform} from './tools.js';
import {getOAuthConfig,oauthEnabled,toolBearerChallenge} from './auth.js';

export function createPowerHubServer(){
const server=new McpServer({name:'maxpowerhub-by-cyberboost',version:'0.4.8'});
const respond=(data:unknown)=>({content:[{type:'text' as const,text:JSON.stringify(data)}]});
const readOnlyAnnotations={readOnlyHint:true,destructiveHint:false,openWorldHint:false} as const;
const scope=()=>{try{return getOAuthConfig().authorizationScope;}catch{return 'api://67fbdd50-800a-4bff-9001-081100f8485a/mcp.access';}};
const authMeta={securitySchemes:[{type:'oauth2',scopes:[scope()]}]} as const;
const authError=()=>({
  content:[{type:'text' as const,text:'Authentication required: sign in to MaxPowerHub AI to use this tool.'}],
  structuredContent:{},
  _meta:{'mcp/www_authenticate':[toolBearerChallenge(scope())]},
  isError:true
});
const protectedHandler=(handler:(input:any)=>unknown)=>async(input:any,extra:any)=>{
  if(oauthEnabled()&&!extra.authInfo)return authError();
  return respond(handler(input));
};

server.registerTool('search_power_platform_resources',{description:'Search curated Power Platform references with source links',inputSchema:{
  query:z.string().min(1).max(500),product:z.string().optional(),role:z.string().optional(),
  task:z.string().optional(),level:z.string().optional(),limit:z.number().int().min(1).max(10).optional()
},annotations:readOnlyAnnotations,_meta:authMeta},protectedHandler(searchPowerPlatformResources));

server.registerTool('get_resource',{description:'Get a curated reference by stable resource ID',inputSchema:{
  id:z.string().min(1).max(120)
},annotations:readOnlyAnnotations,_meta:authMeta},protectedHandler(({id})=>getResource(id)));

server.registerTool('recommend_implementation_pattern',{description:'Suggest a Power Platform implementation pattern with references',inputSchema:{
  experience:z.string().max(120),data:z.string().max(120),
  logic:z.string().max(120),audience:z.string().max(120)
},annotations:readOnlyAnnotations,_meta:authMeta},protectedHandler(recommendImplementationPattern));

server.registerTool('troubleshoot_power_platform',{description:'Return safe diagnostic steps and curated troubleshooting references',inputSchema:{
  problem:z.string().min(1).max(1500),product:z.string().max(120).optional()
},annotations:readOnlyAnnotations,_meta:authMeta},protectedHandler(troubleshootPowerPlatform));

server.registerTool('generate_solution_blueprint',{description:'Create a draft Power Platform architecture, security, environment, delivery, and risk blueprint with sources',inputSchema:{
  objective:z.string().min(1).max(1000),users:z.string().min(1).max(500),data:z.string().min(1).max(700),process:z.string().min(1).max(1000),
  integrations:z.string().max(700).optional(),security:z.string().max(700).optional(),scale:z.string().max(500).optional(),constraints:z.string().max(700).optional(),
  businessCriticality:z.enum(['Low','Moderate','High','Mission critical']).optional(),availability:z.string().max(300).optional(),recovery:z.string().max(300).optional(),compliance:z.string().max(700).optional()
},annotations:readOnlyAnnotations,_meta:authMeta},protectedHandler(generateSolutionBlueprint));

server.registerTool('review_power_platform_expression',{description:'Perform a safe static review of a Power Fx or Power Automate expression and return test guidance',inputSchema:{
  language:z.enum(['Power Fx','Power Automate']),expression:z.string().min(1).max(8000),intent:z.string().max(700).optional()
},annotations:readOnlyAnnotations,_meta:authMeta},protectedHandler(reviewPowerPlatformExpression));

server.registerTool('design_power_platform_expression',{description:'Create a documented draft Power Fx or Power Automate expression pattern with assumptions, safety checks, and official sources',inputSchema:{
  language:z.enum(['Power Fx','Power Automate']),scenario:z.string().min(1).max(300),requirements:z.string().min(1).max(1500),dataSource:z.string().max(300).optional(),fieldNames:z.string().max(700).optional()
},annotations:readOnlyAnnotations,_meta:authMeta},protectedHandler(designPowerPlatformExpression));

server.registerTool('create_power_platform_project_brief',{description:'Turn discovery notes into a structured Power Platform project brief, backlog, questions, and governance gates',inputSchema:{
  name:z.string().min(1).max(160),objective:z.string().min(1).max(1000),users:z.string().min(1).max(700),scope:z.string().min(1).max(1200),
  data:z.string().max(700).optional(),integrations:z.string().max(700).optional(),success:z.string().max(700).optional(),constraints:z.string().max(700).optional()
},annotations:readOnlyAnnotations,_meta:authMeta},protectedHandler(createPowerPlatformProjectBrief));

server.registerTool('assess_power_platform_coe',{description:'Create a native-first Power Platform Center of Excellence readiness, governance, operating-model, and 90-day management plan',inputSchema:{
  organization:z.string().min(1).max(300),maturity:z.enum(['Initial','Repeatable','Defined','Capable','Efficient']),
  makers:z.string().max(700).optional(),environments:z.string().max(700).optional(),governance:z.string().max(1000).optional(),support:z.string().max(700).optional(),goals:z.string().max(1000).optional()
},annotations:readOnlyAnnotations,_meta:authMeta},protectedHandler(assessCenterOfExcellence));

return server;
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  await createPowerHubServer().connect(new StdioServerTransport());
}
