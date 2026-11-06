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
  const normalized=input.problem.toLowerCase();
  const likelyAreas:string[]=[];
  if(/permission|unauthorized|forbidden|access|401|403/.test(normalized)) likelyAreas.push('Identity, connection ownership, sharing, or role permissions');
  if(/timeout|429|throttl|limit|quota|slow/.test(normalized)) likelyAreas.push('Service protection limits, throttling, delegation, or payload size');
  if(/null|blank|type|format|schema|invalid|parse/.test(normalized)) likelyAreas.push('Input shape, null handling, data types, or schema drift');
  if(/connector|connection|gateway|credential/.test(normalized)) likelyAreas.push('Connector health, gateway availability, or expired credentials');
  if(/solution|deploy|import|environment|dependency/.test(normalized)) likelyAreas.push('Solution dependencies, environment variables, connection references, or ALM');
  if(!likelyAreas.length) likelyAreas.push('Recent changes, input data, permissions, connector behavior, or platform limits');
  return {
    status:'unverified-guidance',
    likelyAreas,
    evidenceToCollect:['Exact error text and correlation or request ID','Environment, solution, app or flow name, and failing step','Timestamp, affected user or connection, and a redacted sample input','Recent solution imports, configuration changes, or credential rotations'],
    steps:['Preserve the failing run or error details before retrying.','Confirm whether the issue affects one user, one record, or every run.','Inspect the affected app, flow run history, connection references, and permissions.','Check input types, null values, service limits, dependencies, and recent changes.','Reproduce with redacted test data in a development environment before changing production.'],
    escalationWhen:['The error involves production data integrity, security, privacy, or financial processing.','The same failure persists after a controlled reproduction and documented checks.','A fix requires permission changes, data repair, connector replacement, or production deployment.'],
    sources:findRelevantResources(query,5).map(({id,title,url,source})=>({id,title,url,source})),
    note:'No access to customer tenants, logs, or live documentation. Redact secrets and personal data. These are starting points, not a confirmed diagnosis.'
  };
}

type BlueprintInput={
  objective:string;users:string;data:string;process:string;
  integrations?:string;security?:string;scale?:string;constraints?:string;
};

export function generateSolutionBlueprint(input:BlueprintInput) {
  const combined=Object.values(input).filter(Boolean).join(' ').toLowerCase();
  const external=/external|customer|partner|public|portal/.test(combined);
  const conversational=/conversation|chat|agent|copilot/.test(combined);
  const dataCentric=/case|record|dataverse|business process|relational/.test(combined);
  const multiSystem=/multiple|integration|api|erp|crm|legacy|azure/.test(combined);
  const primaryExperience=conversational?'Copilot Studio agent':external?'Power Pages':dataCentric?'Model-driven Power App':'Canvas Power App';
  const dataPlatform=/sharepoint/.test(combined)&&!dataCentric?'SharePoint or Microsoft Lists for low-complexity data':'Dataverse';
  const integrationLayer=multiSystem?'Power Automate with governed custom connectors or an API layer':'Power Automate cloud flows';
  const query=[primaryExperience,dataPlatform,integrationLayer,input.security,'alm governance'].filter(Boolean).join(' ');
  return {
    status:'draft-blueprint',
    executiveSummary:`Use ${primaryExperience} with ${dataPlatform} and ${integrationLayer} as the starting architecture. Validate licensing, identity, data classification, capacity, and integration constraints before implementation.`,
    architecture:{experience:primaryExperience,data:dataPlatform,automation:integrationLayer,analytics:'Power BI where operational reporting or governed analytics is required'},
    security:['Classify the data and define least-privilege roles before building.','Separate maker, tester, administrator, and end-user responsibilities.','Use managed identities, connection references, or approved service accounts where supported.','Complete privacy, DLP, external-sharing, and audit requirements before production.'],
    environments:['Development for building and maker testing','Test or UAT for controlled validation','Production with restricted maker access and monitored releases'],
    deliveryPlan:['Confirm outcomes, users, data owners, and acceptance criteria.','Prototype the highest-risk workflow with representative redacted data.','Define solutions, environment variables, connection references, and deployment ownership.','Test security roles, failure paths, accessibility, performance, and rollback.','Release through an approved change process with monitoring and support ownership.'],
    risks:['Licensing and capacity assumptions require tenant-specific validation.','Integration limits and connector policies may change the architecture.','External identity and data exposure require dedicated security review.','Generated guidance does not inspect the tenant or verify current configuration.'],
    sources:findRelevantResources(query,6).map(({id,title,url,source})=>({id,title,url,source})),
    note:'Draft architecture for planning. It is not a security assessment, licensing quote, or production approval.'
  };
}

export function reviewPowerPlatformExpression(input:{language:'Power Fx'|'Power Automate';expression:string;intent?:string}) {
  const expression=input.expression.trim();
  const findings:{severity:'info'|'warning';message:string}[]=[];
  if(input.language==='Power Fx') {
    if(/\bfor(all)?\s*\(/i.test(expression)&&/patch\s*\(/i.test(expression)) findings.push({severity:'warning',message:'ForAll with Patch can create many network calls. Validate performance and whether a set-based pattern is available.'});
    if(/\bfilter\s*\(/i.test(expression)&&(/\bin\b|search\s*\(/i.test(expression))) findings.push({severity:'warning',message:'Confirm delegation support for the data source and operators; test with data above the delegation limit.'});
    if(/iferror\s*\(/i.test(expression)===false) findings.push({severity:'info',message:'Consider explicit error handling with IfError for operations that can fail.'});
    if(/;\s*;/.test(expression)) findings.push({severity:'warning',message:'Consecutive statement separators may indicate an empty or malformed statement.'});
  } else {
    if(/items\s*\(/i.test(expression)&&!/\?\[/.test(expression)) findings.push({severity:'info',message:'Consider null-safe property access when loop items may omit fields.'});
    if(/outputs\s*\(/i.test(expression)&&!/\?\[/.test(expression)) findings.push({severity:'info',message:'Confirm the referenced action and property always exist, or add null-safe handling.'});
    if(/concat\s*\(/i.test(expression)&&/password|secret|token|key/i.test(input.intent||'')) findings.push({severity:'warning',message:'Do not compose or expose secrets in flow expressions, inputs, outputs, or run history.'});
  }
  if(!expression) findings.push({severity:'warning',message:'No expression was provided.'});
  if(expression.length>4000) findings.push({severity:'warning',message:'The expression is unusually long. Break it into named steps or variables for maintainability.'});
  if(!findings.length) findings.push({severity:'info',message:'No common static issues were detected. Validate syntax and behavior in a development environment with representative test cases.'});
  return {
    status:'static-review',language:input.language,intent:input.intent||null,findings,
    testChecklist:['Test blank, null, empty collection, and unexpected-type inputs.','Test permission failures and connector errors.','Confirm locale-sensitive dates and numbers.','Validate delegation, performance, and service limits with realistic data volume.','Run in development before copying into production.'],
    sources:findRelevantResources(`${input.language} expressions errors delegation`,4).map(({id,title,url,source})=>({id,title,url,source})),
    note:'Static review only. The expression was not executed and tenant data was not accessed.'
  };
}

export function createPowerPlatformProjectBrief(input:{name:string;objective:string;users:string;scope:string;data?:string;integrations?:string;success?:string;constraints?:string}) {
  const missing=[['data',input.data],['integrations',input.integrations],['success measures',input.success],['constraints',input.constraints]].filter(([,value])=>!value).map(([label])=>label);
  return {
    status:'draft-project-brief',
    project:{name:input.name,objective:input.objective,users:input.users,inScope:input.scope,data:input.data||'To be confirmed',integrations:input.integrations||'To be confirmed',successMeasures:input.success||'To be confirmed',constraints:input.constraints||'To be confirmed'},
    discoveryQuestions:missing.map(item=>`Confirm ${item}.`).concat(['Who owns the business process, data, security approval, and production support?','What are the acceptance criteria and rollback triggers?','Which environments, licenses, DLP policies, and connectors are available?']),
    initialBacklog:['Validate the problem statement and measurable outcome.','Document personas, roles, and access boundaries.','Confirm data sources, ownership, retention, and classification.','Map the current and target process, exceptions, and approvals.','Select the implementation pattern and validate licensing.','Define test, deployment, monitoring, support, and rollback plans.'],
    governanceGates:['Security and privacy review','Licensing and capacity validation','Architecture and integration review','User acceptance and accessibility testing','Production readiness and support handoff'],
    note:'Planning draft. Owners, dates, estimates, and approvals must be assigned by the delivery team.'
  };
}
