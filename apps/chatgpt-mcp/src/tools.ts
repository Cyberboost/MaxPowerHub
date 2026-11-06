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
  businessCriticality?:'Low'|'Moderate'|'High'|'Mission critical';availability?:string;recovery?:string;compliance?:string;
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
  const criticality=input.businessCriticality||'To be assessed';
  const needsFormalRecovery=criticality==='High'||criticality==='Mission critical';
  return {
    status:'draft-blueprint',
    executiveSummary:`Use ${primaryExperience} with ${dataPlatform} and ${integrationLayer} as the starting architecture. Validate licensing, identity, data classification, capacity, and integration constraints before implementation.`,
    architecture:{experience:primaryExperience,data:dataPlatform,automation:integrationLayer,analytics:'Power BI where operational reporting or governed analytics is required'},
    context:{businessCriticality:criticality,availabilityTarget:input.availability||'Define with the business owner',recoveryTarget:input.recovery||'Define recovery time and recovery point objectives',compliance:input.compliance||'Identify applicable privacy, records, security, and industry obligations'},
    architectureDecisions:[
      {decision:'Primary user experience',choice:primaryExperience,rationale:external?'External identity and controlled data exposure are central requirements.':conversational?'Conversation is the primary interaction model.':dataCentric?'Structured records and business processes are central to the workload.':'The workload is primarily a task-focused application experience.',validation:'Confirm accessibility, device, licensing, identity, and offline requirements.'},
      {decision:'System of record',choice:dataPlatform,rationale:dataPlatform==='Dataverse'?'Relational business data, security, auditing, and solution-aware ALM are expected.':'The described workload may fit a lower-complexity Microsoft 365 data store.',validation:'Validate data volume, relationships, retention, security, integration, and reporting needs.'},
      {decision:'Automation and integration',choice:integrationLayer,rationale:multiSystem?'Multiple systems benefit from a governed integration boundary.':'Cloud flows provide a reusable automation starting point.',validation:'Confirm connector availability, ownership, limits, retry behavior, idempotency, and secret handling.'}
    ],
    wellArchitectedReview:{
      reliability:{goal:'Meet agreed availability and recovery targets.',actions:[needsFormalRecovery?'Document tested continuity, recovery, and dependency-failure procedures.':'Define failure modes, retry behavior, ownership, and recovery expectations.','Remove single-person connection ownership from critical automation.','Test degraded and unavailable dependency scenarios.']},
      security:{goal:'Protect confidentiality, integrity, and availability.',actions:['Apply least privilege across environments, Dataverse roles, connectors, and sharing.','Classify data and complete threat, privacy, DLP, and external-access reviews.','Use approved identities and avoid secrets in apps, flows, logs, or client formulas.']},
      operationalExcellence:{goal:'Operate through standards, observability, and safe deployment.',actions:['Use solutions, source control, pipelines, deployment approvals, and runbooks.','Define health signals, dashboards, alert ownership, incident response, and postmortems.','Keep a prioritized backlog and document routine, emergency, and support procedures.']},
      performanceEfficiency:{goal:'Meet demand efficiently and predictably.',actions:['Test with realistic data volume and concurrency.','Validate delegation, API limits, pagination, payload sizes, flow concurrency, and connector throttling.','Establish performance budgets and monitor trends after release.']},
      experienceOptimization:{goal:'Deliver an accessible, useful, and efficient experience.',actions:['Validate journeys with representative users and measurable task outcomes.','Meet accessibility, responsive design, error messaging, and localization requirements.','Reduce unnecessary steps and provide clear recovery from user and system errors.']}
    },
    security:['Classify the data and define least-privilege roles before building.','Separate maker, tester, administrator, and end-user responsibilities.','Use managed identities, connection references, or approved service accounts where supported.','Complete privacy, DLP, external-sharing, and audit requirements before production.'],
    environments:[{name:'Development',purpose:'Building, component testing, and maker validation',controls:'Unmanaged solutions; representative redacted data; maker access limited to the delivery team'},{name:'Test',purpose:'Deployed-solution, integration, security, regression, and failure-path testing',controls:'Production-like policies and managed solution deployment'},{name:'UAT',purpose:'Business acceptance, accessibility, training, and release approval',controls:'Named business testers, acceptance evidence, and no uncontrolled maker changes'},{name:'Production',purpose:'Live business operation',controls:'Managed releases, restricted maker access, monitoring, support ownership, and approved emergency procedure'}],
    solutionStrategy:{recommendation:multiSystem||criticality==='Mission critical'?'Use modular managed solutions with explicit dependencies and dedicated development environments where team scale requires isolation.':'Begin with the smallest maintainable solution structure and one publisher; modularize only where release cadence, ownership, or dependencies justify it.',rules:['Use one approved solution publisher.','Use unmanaged solutions only in development and managed solutions downstream.','Store unpacked solution artifacts and configuration in source control.','Use environment variables and connection references instead of environment-specific hardcoding.','Document component ownership, dependencies, upgrade behavior, and emergency-fix flow.']},
    deliveryPlan:['Confirm outcomes, users, data owners, and acceptance criteria.','Prototype the highest-risk workflow with representative redacted data.','Define solutions, environment variables, connection references, and deployment ownership.','Test security roles, failure paths, accessibility, performance, and rollback.','Release through an approved change process with monitoring and support ownership.'],
    nonFunctionalRequirements:['Availability and business-hours expectations','Recovery time and recovery point objectives','Expected users, concurrency, transaction volume, data growth, and performance budgets','Security, privacy, data residency, retention, auditing, and compliance','Accessibility, supported devices, browsers, languages, and offline behavior','Monitoring, alerting, support hours, incident severity, and escalation','Maintainability, deployment frequency, release windows, and dependency ownership'],
    responsibilityMatrix:[{activity:'Business outcomes and acceptance',accountable:'Business owner',responsible:'Product owner',consulted:'CoE, solution architect, security',informed:'Support and users'},{activity:'Architecture and nonfunctional requirements',accountable:'Solution architect',responsible:'Delivery team',consulted:'Security, data, integration, operations',informed:'Business owner'},{activity:'Environment, DLP, platform, and release controls',accountable:'Platform owner',responsible:'Power Platform administrators',consulted:'CoE, security, delivery lead',informed:'Business owner and support'},{activity:'Production support and incident response',accountable:'Service owner',responsible:'Support team',consulted:'Delivery team, platform operations, business owner',informed:'Affected stakeholders'}],
    testPlan:['Unit and component tests for formulas, flows, plug-ins, and integrations','Security-role, table-permission, sharing, and negative-access tests','End-to-end business process and exception-path tests','Performance, delegation, throttling, concurrency, and realistic-volume tests','Accessibility, responsive design, browser, device, localization, and usability tests','Managed-solution deployment, configuration, smoke, recovery, and rollback tests','User acceptance with traceable evidence against acceptance criteria'],
    releaseGates:['Named owners and approved acceptance criteria','Security, privacy, compliance, architecture, and licensing reviews complete','Managed solution successfully deployed through the approved pipeline','No unresolved critical defects; accepted residual risks have owners and dates','Monitoring, alerting, runbooks, support routing, and operational access verified','Backup, recovery, feature-disablement, and deployment-failure procedures tested','Business owner and service owner approve production readiness'],
    rollbackPlan:['Define rollback triggers before release.','Preserve the last known-good managed solution and environment configuration.','Separate data remediation from application rollback; solution rollback does not automatically reverse data changes.','Document feature-disablement, connection, integration, and communication steps.','Assign decision authority and rehearse the procedure in a nonproduction environment.'],
    acceptanceCriteria:['Priority user journeys complete successfully with authorized roles.','Unauthorized roles cannot access restricted data or actions.','Performance meets agreed budgets at representative load and data volume.','Failures generate actionable signals and follow documented support paths.','Deployment and recovery procedures succeed in a production-like environment.','Business outcomes and operational ownership are formally accepted.'],
    riskRegister:[{risk:'Licensing or capacity assumptions are incorrect',impact:'Architecture, cost, or availability changes',mitigation:'Validate tenant licensing, entitlements, capacity, and limits before build approval'},{risk:'Identity, sharing, or data policy exposes information',impact:'Security, privacy, or compliance incident',mitigation:'Complete threat, role, DLP, external-sharing, and negative-access testing'},{risk:'Connector, API, or dependency limits disrupt processing',impact:'Failed or delayed business transactions',mitigation:'Test limits and failure modes; add idempotency, retry, monitoring, and support ownership'},{risk:'Uncontrolled changes or dependencies break production',impact:'Outage or regression',mitigation:'Use source control, managed solutions, pipelines, quality gates, and tested recovery procedures'},{risk:'Low adoption or poor usability prevents value',impact:'Expected outcomes are not achieved',mitigation:'Co-design with users, test accessibility and task completion, measure adoption and feedback'}],
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
    if(/\b(clearcollect|collect)\s*\(/i.test(expression)&&/\b(filter|search|sortbycolumns)\s*\(/i.test(expression)) findings.push({severity:'warning',message:'Collections are local and can hide delegation limitations. Confirm the source query delegates before materializing data.'});
    if(/\b(firstn|lastn|last|distinct|groupby|ungroup|concat)\s*\(/i.test(expression)) findings.push({severity:'warning',message:'The formula uses a commonly nondelegable function. Validate connector-specific delegation and correctness above the app row limit.'});
    if(/iferror\s*\(/i.test(expression)===false) findings.push({severity:'info',message:'Consider explicit error handling with IfError for operations that can fail.'});
    if(/\b(patch|collect|remove|removeif|update|updateif|submitform)\s*\(/i.test(expression)&&!/\biferror\s*\(/i.test(expression)) findings.push({severity:'warning',message:'A data-changing operation is not wrapped in explicit formula-level error handling.'});
    if(/\bconcurrent\s*\(/i.test(expression)) findings.push({severity:'info',message:'Concurrent arguments must be independent. Confirm no argument reads a value written by another argument and verify error behavior.'});
    if(/;\s*;/.test(expression)) findings.push({severity:'warning',message:'Consecutive statement separators may indicate an empty or malformed statement.'});
  } else {
    if(/items\s*\(/i.test(expression)&&!/\?\[/.test(expression)) findings.push({severity:'info',message:'Consider null-safe property access when loop items may omit fields.'});
    if(/outputs\s*\(/i.test(expression)&&!/\?\[/.test(expression)) findings.push({severity:'info',message:'Confirm the referenced action and property always exist, or add null-safe handling.'});
    if(/trigger(body|outputs)\s*\(/i.test(expression)&&!/\?\[/.test(expression)) findings.push({severity:'info',message:'Use null-safe property access for optional trigger fields.'});
    if(/\?\[/.test(expression)&&!/\bcoalesce\s*\(/i.test(expression)) findings.push({severity:'info',message:'Null-safe access prevents a missing-property failure, but downstream actions may still need a default value with coalesce.'});
    if(/concat\s*\(/i.test(expression)&&/password|secret|token|key/i.test(input.intent||'')) findings.push({severity:'warning',message:'Do not compose or expose secrets in flow expressions, inputs, outputs, or run history.'});
  }
  if(/(password|secret|token|api[_ -]?key)\s*[:=]\s*['"][^'"]+['"]/i.test(expression)) findings.push({severity:'warning',message:'The expression appears to contain a hardcoded sensitive value. Remove it and rotate the credential if it is real.'});
  if(/https?:\/\/[\w.-]+/i.test(expression)) findings.push({severity:'info',message:'A hardcoded URL was detected. Consider an environment variable or connection configuration for environment portability.'});
  if(!expression) findings.push({severity:'warning',message:'No expression was provided.'});
  if(expression.length>4000) findings.push({severity:'warning',message:'The expression is unusually long. Break it into named steps or variables for maintainability.'});
  if(!findings.length) findings.push({severity:'info',message:'No common static issues were detected. Validate syntax and behavior in a development environment with representative test cases.'});
  return {
    status:'static-review',language:input.language,intent:input.intent||null,findings,
    qualityDimensions:{correctness:'Validate expected and unexpected inputs, branch behavior, and output types.',reliability:'Handle connector, network, permission, conflict, and partial-failure conditions.',performance:'Validate delegation, data volume, call count, concurrency, throttling, and payload size.',security:'Remove secrets and unnecessary sensitive data from formulas, inputs, outputs, variables, and run history.',maintainability:'Use descriptive names, smaller named steps, comments where supported, and environment-portable configuration.'},
    testChecklist:['Test blank, null, empty collection, and unexpected-type inputs.','Test permission failures, conflicts, throttling, timeouts, and connector errors.','Confirm locale-sensitive dates and numbers.','Validate delegation with the app data row limit temporarily set to 1 and with realistic production-scale data.','Test partial failure and repeat execution so retries do not create duplicate or inconsistent results.','Run in development before copying into production.'],
    sources:findRelevantResources(`${input.language} expressions errors delegation`,4).map(({id,title,url,source})=>({id,title,url,source})),
    note:'Static review only. The expression was not executed and tenant data was not accessed.'
  };
}

const expressionSources={
  'Power Fx':[
    {id:'ms-powerfx-errors',title:'Understand errors in Power Fx',url:'https://learn.microsoft.com/power-platform/power-fx/error-handling',source:'Microsoft Learn'},
    {id:'ms-powerfx-delegation',title:'Understand delegation in a canvas app',url:'https://learn.microsoft.com/power-apps/maker/canvas-apps/delegation-overview',source:'Microsoft Learn'},
    {id:'ms-powerfx-reference',title:'Power Fx formula reference',url:'https://learn.microsoft.com/power-platform/power-fx/formula-reference-overview',source:'Microsoft Learn'}
  ],
  'Power Automate':[
    {id:'ms-flow-null',title:'Getting errors with null fields',url:'https://learn.microsoft.com/troubleshoot/power-platform/power-automate/flow-run-issues/getting-errors-null-fields',source:'Microsoft Learn'},
    {id:'ms-wdl-reference',title:'Workflow Definition Language schema reference',url:'https://learn.microsoft.com/azure/logic-apps/workflow-definition-language-schema',source:'Microsoft Learn'}
  ]
};

export function designPowerPlatformExpression(input:{language:'Power Fx'|'Power Automate';scenario:string;requirements:string;dataSource?:string;fieldNames?:string}) {
  const scenario=input.scenario.toLowerCase();
  let draft:string;
  let pattern:string;
  let assumptions:string[];
  if(input.language==='Power Fx') {
    if(/search|filter|delegat/.test(scenario)) {
      pattern='Delegation-conscious search';
      draft=`Filter(\n    DataSource,\n    IsBlank(txtSearch.Text) || StartsWith(SearchColumn, txtSearch.Text)\n)`;
      assumptions=['Replace DataSource and SearchColumn with real identifiers.','Confirm StartsWith delegates for the selected connector and column type.','Add explicit security filters; UI filtering is not authorization.'];
    } else if(/patch|save|submit|update/.test(scenario)) {
      pattern='Validated save with formula-level error handling';
      draft=`If(\n    IsBlank(txtRequired.Text),\n    Notify("Enter the required value.", NotificationType.Warning),\n    IfError(\n        Set(varSavedRecord, Patch(DataSource, Defaults(DataSource), { RequiredColumn: txtRequired.Text })),\n        Notify(FirstError.Message, NotificationType.Error),\n        Notify("Saved successfully.", NotificationType.Success)\n    )\n)`;
      assumptions=['Replace controls, data source, and columns with real identifiers.','Do not display raw sensitive error details to unauthorized users.','Confirm create permissions and required columns.'];
    } else if(/bulk|multiple|forall/.test(scenario)) {
      pattern='Controlled bulk-operation starting point';
      draft=`IfError(\n    ForAll(\n        colPending As item,\n        Patch(DataSource, LookUp(DataSource, Id = item.Id), { Status: item.Status })\n    ),\n    Notify($"Some updates failed: {FirstError.Message}", NotificationType.Error),\n    Notify("Updates completed.", NotificationType.Success)\n)`;
      assumptions=['ForAll iterations may run independently and can generate many calls.','Validate delegation of LookUp and performance at production volume.','Prefer a server-side or batch operation when atomicity or high volume is required.'];
    } else {
      pattern='Input validation and explicit result';
      draft=`With(\n    { valueToCheck: Trim(txtInput.Text) },\n    If(\n        IsBlank(valueToCheck),\n        Notify("Enter a value.", NotificationType.Warning),\n        valueToCheck\n    )\n)`;
      assumptions=['Replace placeholder controls and expected output behavior.','Add type, range, format, and authorization validation required by the use case.'];
    }
  } else {
    if(/null|optional|property|field/.test(scenario)) {
      pattern='Null-safe field with explicit default';
      draft=`coalesce(triggerBody()?['OptionalField'], 'Default value')`;
      assumptions=['Replace OptionalField and the default with values appropriate to the data contract.','A default can hide upstream data-quality problems; log or branch when absence is significant.'];
    } else if(/condition|compare|status/.test(scenario)) {
      pattern='Null-safe normalized comparison';
      draft=`equals(toLower(coalesce(triggerBody()?['Status'], '')), 'approved')`;
      assumptions=['Replace Status and approved with real contract values.','Confirm case normalization and blank behavior match the business rule.'];
    } else if(/array|filter|list/.test(scenario)) {
      pattern='Array-safe input normalization';
      draft=`coalesce(body('Get_items')?['value'], json('[]'))`;
      assumptions=['Replace Get_items with the exact action name.','Use Filter array or an OData query as appropriate; prefer source-side filtering for volume.'];
    } else {
      pattern='Null-safe value extraction';
      draft=`coalesce(outputs('Previous_action')?['body']?['Property'], '')`;
      assumptions=['Replace action and property names exactly as shown in the flow definition.','Confirm an empty string is a valid fallback for the downstream action.'];
    }
  }
  return {status:'draft-expression-pattern',language:input.language,scenario:input.scenario,requirements:input.requirements,dataSource:input.dataSource||'Not provided',fieldNames:input.fieldNames||'Not provided',pattern,draft,assumptions,
    reviewChecklist:['Replace every placeholder with validated identifiers and types.','Check connector-specific delegation or expression support.','Add explicit error, null, permission, and duplicate-processing behavior.','Keep secrets and unnecessary personal data out of expressions and run history.','Test in development with boundary, failure, and production-scale cases.'],
    sources:expressionSources[input.language],note:'Draft pattern only. It was not executed, compiled, or validated against a tenant, connector, schema, locale, or data source.'};
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

const coeSources=[
  {id:'ms-coe-establish',title:'Establish a Microsoft Power Platform Center of Excellence',url:'https://learn.microsoft.com/power-platform/guidance/adoption/coe',source:'Microsoft Learn'},
  {id:'ms-coe-governance',title:'Establish a Center of Excellence with governance patterns and practices',url:'https://learn.microsoft.com/power-platform/guidance/adoption/common-vision/establish-coe',source:'Microsoft Learn'},
  {id:'ms-adoption-maturity',title:'Power Platform adoption maturity model',url:'https://learn.microsoft.com/power-platform/guidance/adoption/maturity-model',source:'Microsoft Learn'},
  {id:'ms-managed-environments',title:'Enable Managed Environments',url:'https://learn.microsoft.com/power-platform/admin/managed-environment-enable',source:'Microsoft Learn'},
  {id:'ms-environments',title:'Power Platform environments overview',url:'https://learn.microsoft.com/power-platform/admin/environments-overview',source:'Microsoft Learn'},
  {id:'ms-guidance-whats-new',title:"What's new in Microsoft Power Platform guidance",url:'https://learn.microsoft.com/power-platform/guidance/adoption/whats-new',source:'Microsoft Learn'}
];

export function assessCenterOfExcellence(input:{
  organization:string;maturity:'Initial'|'Repeatable'|'Defined'|'Capable'|'Efficient';
  makers?:string;environments?:string;governance?:string;support?:string;goals?:string;
}) {
  const prioritiesByMaturity={
    Initial:['Name an executive sponsor and accountable Power Platform product owner.','Inventory environments, apps, flows, makers, connectors, and business-critical solutions.','Apply baseline data policies and define the purpose of the default environment.'],
    Repeatable:['Publish a common vision, measurable goals, and a demand-intake process.','Define environment, data policy, request, license, and capacity strategies.','Create maker onboarding, training, and a community of practice.'],
    Defined:['Operationalize KPIs, business-value measurement, tiered environments, and support models.','Use solutions, pipelines, environment variables, and connection references for ALM.','Review overshared, unused, orphaned, and business-critical resources on a schedule.'],
    Capable:['Automate governance actions through risk-based approvals and accountable owners.','Scale adoption through environment groups, reusable patterns, champions, and dedicated operations.','Use telemetry to prioritize remediation, support, investment, and modernization.'],
    Efficient:['Continuously optimize policy, support, automation, value measurement, and responsible AI governance.','Use risk profiles for automated routing while preserving human approval for consequential actions.','Benchmark outcomes across business units and share proven practices.']
  } as const;
  return {
    status:'coe-readiness-plan',
    organization:input.organization,
    currentMaturity:input.maturity,
    targetOperatingModel:{
      leadership:['Executive sponsor','Power Platform product owner','Business and technology steering group'],
      platformOperations:['Power Platform administrators','Security, compliance, identity, licensing, and service-management partners'],
      enablement:['CoE or Center of Enablement lead','Solution architects','Maker-success and champions community'],
      delivery:['Business owners','Professional and citizen developers','Test, release, support, and data owners']
    },
    priorities:[...prioritiesByMaturity[input.maturity]],
    governanceCadence:{weekly:['Review service health, failed critical automations, urgent security recommendations, and production incidents'],monthly:['Review inventory, sharing, orphaned assets, capacity, licenses, connector usage, exceptions, and support trends'],quarterly:['Review maturity, KPIs, business value, environment strategy, DLP policy, critical-solution portfolio, and roadmap']},
    nativeFirstControls:['Power Platform admin center analytics and recommended actions','Managed Environments and environment groups where licensing and requirements support them','Data policies, environment routing and strategy, tenant settings, security roles, and pipelines','Native inventory, usage, capacity, licensing, monitoring, and support processes'],
    starterKitPosition:'Microsoft guidance published in May 2026 states that the CoE Starter Kit is no longer actively maintained and that many capabilities are now native in the Power Platform admin center. Assess existing Starter Kit dependencies and transition deliberately; do not start a new CoE by assuming the kit is the default.',
    first90Days:[
      {phase:'Days 1–30',outcomes:['Confirm sponsor, ownership, scope, success measures, and decision rights.','Establish a tenant baseline and identify critical, overshared, unused, and orphaned assets.','Document immediate risks and baseline policies without disrupting business-critical solutions.']},
      {phase:'Days 31–60',outcomes:['Publish environment, DLP, maker, ALM, support, and exception-management standards.','Launch maker onboarding, champions, demand intake, and a risk-tiered support model.','Pilot native governance controls in a controlled environment group.']},
      {phase:'Days 61–90',outcomes:['Operationalize dashboards, review cadences, ownership communications, and remediation workflows.','Measure adoption, risk reduction, delivery speed, support demand, and business value.','Approve the next maturity roadmap based on evidence and stakeholder feedback.']}
    ],
    requiredInputs:['Tenant and environment inventory','Roles and decision rights','Data classification and regulatory obligations','Current DLP, connector, sharing, and environment policies','Licensing, capacity, support, ALM, and critical-solution portfolio','Maker population, training needs, adoption goals, and business-value measures'],
    providedContext:{makers:input.makers||'Not provided',environments:input.environments||'Not provided',governance:input.governance||'Not provided',support:input.support||'Not provided',goals:input.goals||'Not provided'},
    sources:coeSources,
    note:'Read-only planning guidance. No tenant settings were inspected or changed. Validate licensing and current Microsoft guidance before implementation.'
  };
}
