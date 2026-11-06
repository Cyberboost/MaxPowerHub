import {findRelevantResources, resources, searchResources} from '../../../lib/resources.js';

const filters = (f: {product?: string;role?: string;task?: string;level?: string}) => ({
  product: f.product || 'All', role: f.role || 'All roles',
  task: f.task || 'All tasks', level: f.level || 'All levels'
});

export function searchPowerPlatformResources(input: {query:string;product?:string;role?:string;task?:string;level?:string;limit?:number}) {
  const matches = searchResources(input.query, filters(input));
  return {results:matches.slice(0,Math.min(Math.max(input.limit ?? 5,1),10)).map(({id,title,description,url,source,product,level,reasons})=>({id,title,description,url,source,product,level,reasons})),count:matches.length};
}

export function getResource(id:string) {
  const resource=resources.find(r=>r.id===id);
  return resource ? {found:true,resource} : {found:false,error:'Resource not found'};
}

export function recommendImplementationPattern(input:{experience:string;data:string;logic:string;audience:string}) {
  const {experience,data,logic,audience}=input;
  let pattern='Canvas app with Power Automate',why='Task-focused internal workflow with reusable automation.',query='canvas power automate connectors delegation alm';
  if(experience==='Conversational agent') {pattern='Copilot Studio agent with governed actions';why='Conversational interaction is primary; protect actions with authenticated connectors.';query='copilot architecture governance connectors security';}
  else if(experience==='External website'||audience==='Partners or customers') {pattern='Power Pages with Dataverse';why='External identity and table permissions require careful design.';query='power pages security dataverse authentication architecture';}
  else if(experience==='Data-centric business process') {pattern='Model-driven app with Dataverse';why='Structured process and Dataverse role-based access are a strong fit.';query='model-driven dataverse security solutions alm';}
  else if(logic==='Server-side transaction') {pattern='Power Apps with Dataverse plug-in or custom API';why='Enforce transaction rules on the server.';query='power apps dataverse plugins api security';}
  else if(logic==='Custom API or Azure service'||data==='Multiple enterprise systems') {pattern='Power Apps with custom connector and API layer';why='Centralize integration and credentials in a governed API boundary.';query='power apps custom connectors api integration architecture';}
  return {pattern,why,sources:findRelevantResources(query,4).map(({id,title,url,source})=>({id,title,url,source})),note:'Design guidance, not a tenant-specific assessment.'};
}

export function troubleshootPowerPlatform(input:{problem:string;product?:string}) {
  const query=[input.product,input.problem].filter(Boolean).join(' ');
  return {status:'unverified-guidance',steps:['Record the exact error, operation, timestamp and environment.','Inspect the affected app or flow run history and connector configuration.','Check permissions, input types, service limits and recent changes.','Reproduce safely in a development environment before changing production.'],sources:findRelevantResources(query,5).map(({id,title,url,source})=>({id,title,url,source})),note:'No access to customer tenants, logs, or live documentation. These are starting points, not a confirmed diagnosis.'};
}
