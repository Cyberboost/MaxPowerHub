export type Resource = {
  id: string; title: string; product: string; type: string;
  level: 'Start here' | 'Intermediate' | 'Advanced';
  description: string; url: string; source: string; tags: string[];
};

export const resources: Resource[] = [
  {id:'power-platform-overview',title:'Power Platform documentation',product:'Platform',type:'Documentation',level:'Start here',description:'The official starting point for Power Apps, Power Automate, Power BI, Power Pages, and Copilot Studio.',url:'https://learn.microsoft.com/en-us/power-platform/',source:'Microsoft Learn',tags:['overview','governance','adoption']},
  {id:'power-apps-overview',title:'What is Power Apps?',product:'Power Apps',type:'Learning path',level:'Start here',description:'Understand canvas apps, model-driven apps, Dataverse, and the Power Apps development experience.',url:'https://learn.microsoft.com/en-us/power-apps/powerapps-overview',source:'Microsoft Learn',tags:['canvas','model-driven','basics']},
  {id:'power-fx-delegation',title:'Understand delegation in a canvas app',product:'Power Apps',type:'Guidance',level:'Intermediate',description:'Learn how Power Apps delegates Power Fx queries to data sources, how delegation warnings affect large datasets, and which formulas require connector-specific validation.',url:'https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/delegation-overview',source:'Microsoft Learn',tags:['power fx','delegation','canvas apps','data sources','large datasets','delegation warnings']},
  {id:'power-fx-reference',title:'Power Fx formula reference',product:'Power Apps',type:'Reference',level:'Intermediate',description:'Browse functions, operators, data types, and formula patterns for Power Apps and other Power Platform products.',url:'https://learn.microsoft.com/en-us/power-platform/power-fx/formula-reference-overview',source:'Microsoft Learn',tags:['formulas','functions','expressions']},
  {id:'power-apps-samples',title:'Power Apps code samples',product:'Power Apps',type:'Code samples',level:'Advanced',description:'Official samples for Dataverse, model-driven apps, client scripting, custom connectors, and component development.',url:'https://github.com/microsoft/PowerApps-Samples',source:'Microsoft',tags:['github','sdk','pcf','dataverse']},
  {id:'pcf-overview',title:'Power Apps component framework overview',product:'Power Apps',type:'Documentation',level:'Advanced',description:'Build reusable code components for canvas and model-driven apps with the Power Apps component framework.',url:'https://learn.microsoft.com/en-us/power-apps/developer/component-framework/overview',source:'Microsoft Learn',tags:['pcf','typescript','components']},
  {id:'power-automate-overview',title:'Power Automate documentation',product:'Power Automate',type:'Documentation',level:'Start here',description:'Create cloud flows, desktop flows, approvals, and process automation with official product guidance.',url:'https://learn.microsoft.com/en-us/power-automate/',source:'Microsoft Learn',tags:['flows','approvals','automation']},
  {id:'expressions-reference',title:'Workflow expression functions',product:'Power Automate',type:'Reference',level:'Intermediate',description:'Transform strings, arrays, dates, and objects in cloud flows with the workflow expression language.',url:'https://learn.microsoft.com/en-us/azure/logic-apps/workflow-definition-language-functions-reference',source:'Microsoft Learn',tags:['expressions','functions','logic apps']},
  {id:'approvals',title:'Get started with approvals',product:'Power Automate',type:'How-to',level:'Start here',description:'Create and manage approval workflows, including approval actions and response handling.',url:'https://learn.microsoft.com/en-us/power-automate/get-started-approvals',source:'Microsoft Learn',tags:['approvals','workflow','cloud flow']},
  {id:'dataverse-overview',title:'What is Microsoft Dataverse?',product:'Dataverse',type:'Documentation',level:'Start here',description:'Learn how Dataverse stores business data and supports tables, relationships, logic, and security.',url:'https://learn.microsoft.com/en-us/power-apps/maker/data-platform/data-platform-intro',source:'Microsoft Learn',tags:['tables','relationships','security']},
  {id:'dataverse-dev',title:'Dataverse developer guide',product:'Dataverse',type:'Developer guide',level:'Advanced',description:'Develop with Dataverse APIs, plug-ins, webhooks, events, and extensibility patterns.',url:'https://learn.microsoft.com/en-us/power-apps/developer/data-platform/',source:'Microsoft Learn',tags:['api','plugins','webhooks','sdk']},
  {id:'dataverse-security',title:'Dataverse security concepts',product:'Dataverse',type:'Documentation',level:'Intermediate',description:'Understand roles, business units, teams, column security, and record access.',url:'https://learn.microsoft.com/en-us/power-platform/admin/wp-security-cds',source:'Microsoft Learn',tags:['security','roles','permissions']},
  {id:'power-pages',title:'Power Pages documentation',product:'Power Pages',type:'Documentation',level:'Start here',description:'Plan, build, configure, and administer external-facing business websites with Power Pages.',url:'https://learn.microsoft.com/en-us/power-pages/',source:'Microsoft Learn',tags:['websites','portals','external users']},
  {id:'pages-security',title:'Power Pages security',product:'Power Pages',type:'Security guide',level:'Intermediate',description:'Review authentication, web roles, table permissions, and secure site configuration.',url:'https://learn.microsoft.com/en-us/power-pages/security/power-pages-security',source:'Microsoft Learn',tags:['authentication','table permissions','web roles']},
  {id:'power-bi',title:'Power BI documentation',product:'Power BI',type:'Documentation',level:'Start here',description:'Find official guidance for reports, semantic models, Power Query, sharing, and administration.',url:'https://learn.microsoft.com/en-us/power-bi/',source:'Microsoft Learn',tags:['analytics','reports','semantic models']},
  {id:'dax',title:'DAX overview',product:'Power BI',type:'Reference',level:'Intermediate',description:'Learn the fundamentals of Data Analysis Expressions for calculations in Power BI semantic models.',url:'https://learn.microsoft.com/en-us/dax/dax-overview',source:'Microsoft Learn',tags:['dax','measures','calculations']},
  {id:'power-query',title:'Power Query documentation',product:'Power BI',type:'Documentation',level:'Intermediate',description:'Connect, combine, and transform data with Power Query and the M language.',url:'https://learn.microsoft.com/en-us/power-query/',source:'Microsoft Learn',tags:['etl','m language','data transformation']},
  {id:'copilot-studio',title:'Microsoft Copilot Studio documentation',product:'Copilot Studio',type:'Documentation',level:'Start here',description:'Build, test, publish, and manage agents using Copilot Studio.',url:'https://learn.microsoft.com/en-us/microsoft-copilot-studio/',source:'Microsoft Learn',tags:['agents','copilot','generative ai']},
  {id:'copilot-guidance',title:'Copilot Studio guidance',product:'Copilot Studio',type:'Guidance',level:'Intermediate',description:'Plan architecture, implementation, adoption, and governance for Copilot Studio solutions.',url:'https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/',source:'Microsoft Learn',tags:['architecture','adoption','governance']},
  {id:'admin-center',title:'Power Platform admin documentation',product:'Administration',type:'Admin guide',level:'Intermediate',description:'Manage environments, capacity, analytics, security, and tenant settings.',url:'https://learn.microsoft.com/en-us/power-platform/admin/',source:'Microsoft Learn',tags:['admin center','environments','tenant']},
  {id:'well-architected',title:'Power Platform Well-Architected',product:'Architecture',type:'Framework',level:'Advanced',description:'Evaluate workloads across reliability, security, operations, performance, and experience optimization.',url:'https://learn.microsoft.com/en-us/power-platform/well-architected/',source:'Microsoft Learn',tags:['architecture','reliability','security']},
  {id:'coe-starter-kit',title:'Center of Excellence Starter Kit',product:'Governance',type:'Toolkit',level:'Advanced',description:'Components and tools designed to support adoption, administration, governance, and nurturing.',url:'https://learn.microsoft.com/en-us/power-platform/guidance/coe/starter-kit',source:'Microsoft Learn',tags:['coe','governance','adoption']},
  {id:'alm',title:'Application lifecycle management',product:'Governance',type:'Guidance',level:'Advanced',description:'Plan solution-aware development, source control, testing, and deployment across environments.',url:'https://learn.microsoft.com/en-us/power-platform/alm/',source:'Microsoft Learn',tags:['alm','solutions','deployment','pipelines']},
  {id:'pac-cli',title:'Power Platform CLI',product:'Developer tools',type:'Tooling',level:'Advanced',description:'Use the official CLI for environments, solutions, Dataverse, Power Pages, and code components.',url:'https://learn.microsoft.com/en-us/power-platform/developer/cli/introduction',source:'Microsoft Learn',tags:['pac','cli','automation']},
  {id:'pnp-samples',title:'Power Platform community samples',product:'Community',type:'Code samples',level:'Intermediate',description:'Community-maintained Power Apps, Power Automate, Power Pages, and Copilot Studio samples.',url:'https://github.com/pnp/powerplatform-samples',source:'Microsoft 365 & Power Platform Community',tags:['github','samples','community']},
  {id:'dlp-policies',title:'Data loss prevention policies',product:'Governance',type:'Security guide',level:'Advanced',description:'Classify connectors and control how business data can be shared across Power Platform environments.',url:'https://learn.microsoft.com/en-us/power-platform/admin/wp-data-loss-prevention',source:'Microsoft Learn',tags:['dlp','connectors','security','governance']},
  {id:'environment-strategy',title:'Environment strategy for ALM',product:'Governance',type:'Guidance',level:'Advanced',description:'Plan development, test, and production environments as part of an application lifecycle strategy.',url:'https://learn.microsoft.com/en-us/power-platform/alm/environment-strategy-alm',source:'Microsoft Learn',tags:['environments','alm','production','deployment']},
  {id:'connector-reference',title:'Connector reference overview',product:'Developer tools',type:'Reference',level:'Intermediate',description:'Browse available connectors, triggers, actions, authentication requirements, and known limits.',url:'https://learn.microsoft.com/en-us/connectors/',source:'Microsoft Learn',tags:['connectors','triggers','actions','limits']},
  {id:'power-apps-troubleshooting',title:'Power Apps troubleshooting',product:'Power Apps',type:'Troubleshooting',level:'Intermediate',description:'Find official fixes and diagnostic guidance for common Power Apps issues.',url:'https://learn.microsoft.com/en-us/troubleshoot/power-platform/power-apps/welcome-power-apps',source:'Microsoft Learn',tags:['errors','diagnostics','support','troubleshooting']},
  {id:'power-automate-troubleshooting',title:'Power Automate troubleshooting',product:'Power Automate',type:'Troubleshooting',level:'Intermediate',description:'Diagnose common cloud flow, connector, approval, and automation problems.',url:'https://learn.microsoft.com/en-us/troubleshoot/power-platform/power-automate/welcome-power-automate',source:'Microsoft Learn',tags:['errors','flows','diagnostics','troubleshooting']},
];

export const libraryReviewedOn = 'November 5, 2026';
export const products = ['All', ...Array.from(new Set(resources.map((resource) => resource.product)))];

export const roles = ['All roles', 'Maker', 'Developer', 'Architect', 'Administrator'] as const;
export const tasks = ['All tasks', 'Learn', 'Build', 'Integrate', 'Secure', 'Deploy', 'Govern', 'Troubleshoot'] as const;
export const levels = ['All levels', 'Start here', 'Intermediate', 'Advanced'] as const;

const searchAliases: Record<string, string[]> = {
  prod: ['production', 'deployment', 'alm'], production: ['deployment', 'alm', 'environment', 'managed solution'],
  move: ['migration', 'deployment', 'alm'], ship: ['deployment', 'alm'], release: ['deployment', 'alm'],
  secure: ['security', 'permissions', 'roles', 'dlp'], auth: ['authentication', 'security'],
  slow: ['performance', 'delegation', 'optimization'], formula: ['power fx', 'formulas', 'expressions'],
  code: ['developer', 'sdk', 'api', 'pcf', 'plugin'], component: ['pcf', 'components'],
  api: ['web api', 'sdk', 'integration'], integrate: ['connectors', 'api', 'webhooks'],
  automate: ['automation', 'flows', 'power automate'], bot: ['agent', 'copilot'],
  error: ['troubleshooting', 'diagnostics'], broken: ['troubleshooting', 'diagnostics'],
  govern: ['governance', 'coe', 'dlp', 'administration'], architect: ['architecture', 'well-architected'],
};

function resourceTasks(resource: Resource) {
  const text = `${resource.title} ${resource.description} ${resource.type} ${resource.tags.join(' ')}`.toLowerCase();
  const matches: string[] = [];
  if (/overview|documentation|learning|reference|start/.test(text)) matches.push('Learn');
  if (/build|formula|component|sample|canvas|model-driven/.test(text)) matches.push('Build');
  if (/connector|api|webhook|integration|data transformation/.test(text)) matches.push('Integrate');
  if (/security|permission|role|authentication|dlp/.test(text)) matches.push('Secure');
  if (/alm|deploy|production|pipeline|environment|solution/.test(text)) matches.push('Deploy');
  if (/governance|admin|coe|adoption|tenant|architecture/.test(text)) matches.push('Govern');
  if (/troubleshoot|diagnostic|error|support/.test(text)) matches.push('Troubleshoot');
  return matches;
}

function resourceRoles(resource: Resource) {
  const text = `${resource.product} ${resource.title} ${resource.description} ${resource.type} ${resource.tags.join(' ')}`.toLowerCase();
  const matches = new Set<string>();
  if (/start here|power apps|power automate|formula|approval|canvas/.test(`${resource.level.toLowerCase()} ${text}`)) matches.add('Maker');
  if (/developer|api|sdk|plugin|pcf|cli|code|expression|sample|connector/.test(text)) matches.add('Developer');
  if (/architecture|security|alm|environment|governance|well-architected|integration|dataverse/.test(text)) matches.add('Architect');
  if (/admin|governance|tenant|environment|capacity|dlp|coe/.test(text)) matches.add('Administrator');
  if (!matches.size) matches.add('Maker');
  return [...matches];
}

export type SearchFilters = {product:string; role:string; task:string; level:string};
export type RankedResource = Resource & {score:number; reasons:string[]; tasks:string[]; roles:string[]};

export function searchResources(query: string, filters: SearchFilters): RankedResource[] {
  const normalized = query.toLowerCase().trim();
  const rawTerms = normalized.split(/[^a-z0-9+#.-]+/).filter(Boolean);
  const terms = Array.from(new Set(rawTerms.flatMap(term => [term, ...(searchAliases[term] || [])])));
  return resources.map(resource => {
    const title = resource.title.toLowerCase();
    const product = resource.product.toLowerCase();
    const tags = resource.tags.join(' ').toLowerCase();
    const description = resource.description.toLowerCase();
    const type = resource.type.toLowerCase();
    const matchedTasks = resourceTasks(resource);
    const matchedRoles = resourceRoles(resource);
    let score = normalized && title.includes(normalized) ? 20 : 0;
    const reasons = new Set<string>();
    for (const term of terms) {
      if (title.includes(term)) { score += 8; reasons.add('title'); }
      if (product.includes(term)) { score += 6; reasons.add('product'); }
      if (tags.includes(term)) { score += 5; reasons.add('topic'); }
      if (type.includes(term)) { score += 3; reasons.add('resource type'); }
      if (description.includes(term)) { score += 2; reasons.add('description'); }
    }
    if (filters.product !== 'All' && resource.product !== filters.product) return null;
    if (filters.role !== 'All roles' && !matchedRoles.includes(filters.role)) return null;
    if (filters.task !== 'All tasks' && !matchedTasks.includes(filters.task)) return null;
    if (filters.level !== 'All levels' && resource.level !== filters.level) return null;
    if (normalized && score === 0) return null;
    return {...resource, score, reasons:[...reasons], tasks:matchedTasks, roles:matchedRoles};
  }).filter((item): item is RankedResource => Boolean(item))
    .sort((a,b) => b.score-a.score || resources.findIndex(item=>item.id===a.id)-resources.findIndex(item=>item.id===b.id));
}

export const rolePathways = [
  {role:'Developer',title:'Build, extend, and ship',description:'Power Fx, Dataverse APIs, PCF, connectors, CLI, testing, and troubleshooting.',query:'api pcf connector deployment troubleshooting'},
  {role:'Architect',title:'Design for trust and operations',description:'Architecture, integration, security, environment strategy, ALM, and governance.',query:'architecture security environment alm governance'},
  {role:'Maker',title:'Create reliable business solutions',description:'Canvas and model-driven apps, flows, approvals, formulas, and data.',query:'canvas model-driven flows approvals formulas'},
  {role:'Administrator',title:'Operate and govern the platform',description:'Environments, DLP, tenant administration, adoption, and the CoE toolkit.',query:'admin environments dlp governance coe'},
];

export function findRelevantResources(question: string, limit = 5) {
  const stopWords = new Set(['the','and','for','with','how','should','before','into','from','that','this','what','when','where','which','would','could','build','make']);
  const aliases: Record<string,string[]> = {
    secure:['security','permissions','roles'], securing:['security','permissions','roles'],
    production:['alm','deployment','environment'], deploy:['deployment','alm','solutions'],
    automate:['automation','flows'], agent:['agents','copilot'], formula:['formulas','power fx'],
  };
  const rawTerms = question.toLowerCase().split(/[^a-z0-9]+/).filter((term) => term.length > 2 && !stopWords.has(term));
  const terms = Array.from(new Set(rawTerms.flatMap((term) => [term, ...(aliases[term] || [])])));
  return resources.map((resource) => {
    const title = resource.title.toLowerCase();
    const product = resource.product.toLowerCase();
    const tags = resource.tags.join(' ').toLowerCase();
    const description = resource.description.toLowerCase();
    const score = terms.reduce((total, term) => total +
      (title.includes(term) ? 4 : 0) + (product.includes(term) ? 3 : 0) +
      (tags.includes(term) ? 2 : 0) + (description.includes(term) ? 1 : 0), 0);
    return {resource, score};
  }).sort((a, b) => b.score - a.score || a.resource.title.localeCompare(b.resource.title))
    .filter((item, index) => item.score > 0 || index < 3).slice(0, limit).map((item) => item.resource);
}
