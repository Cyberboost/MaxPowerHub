import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import {createPowerPlatformProjectBrief,generateSolutionBlueprint,getResource,recommendImplementationPattern,reviewPowerPlatformExpression,searchPowerPlatformResources,troubleshootPowerPlatform} from '../src/tools.ts';

test('search returns canonical source links',()=>{
 const result=searchPowerPlatformResources({query:'power fx',limit:3});
 assert.ok(result.results.length>0);
 assert.ok(result.results.every(r=>r.url.startsWith('https://')));
});
test('unknown resource is handled safely',()=>assert.equal(getResource('does-not-exist').found,false));
test('pattern recommendation has citations',()=>{
 const result=recommendImplementationPattern({experience:'External website',data:'Dataverse business data',logic:'Inside the app',audience:'Partners or customers'});
 assert.match(result.pattern,/Power Pages/);
 assert.ok(result.sources.length>0);
});
test('troubleshooting never claims to inspect a tenant',()=>{
 const result=troubleshootPowerPlatform({problem:'Flow fails when updating SharePoint',product:'Power Automate'});
 assert.equal(result.status,'unverified-guidance');
 assert.ok(result.sources.length>0);
 assert.match(result.note,/No access to customer tenants/);
});
test('solution blueprint includes delivery, security, risk, and citations',()=>{
 const result=generateSolutionBlueprint({objective:'Create a secure customer intake process',users:'External customers and internal case workers',data:'Dataverse business data',process:'Customers submit requests and staff review them',integrations:'Power Automate approvals',security:'External identities and least privilege'});
 assert.equal(result.status,'draft-blueprint');
 assert.match(result.architecture.experience,/Power Pages/);
 assert.ok(result.security.length>=3);
 assert.ok(result.deliveryPlan.length>=4);
 assert.ok(result.sources.length>0);
});
test('expression review warns about delegation patterns',()=>{
 const result=reviewPowerPlatformExpression({language:'Power Fx',expression:'Filter(Accounts, Name in SearchBox.Text)',intent:'Search accounts'});
 assert.equal(result.status,'static-review');
 assert.ok(result.findings.some(f=>/delegation/i.test(f.message)));
 assert.match(result.note,/not executed/i);
});
test('project brief identifies missing discovery inputs',()=>{
 const result=createPowerPlatformProjectBrief({name:'Intake modernization',objective:'Reduce manual triage',users:'Operations team',scope:'Replace email intake with a governed application'});
 assert.equal(result.status,'draft-project-brief');
 assert.ok(result.discoveryQuestions.some(q=>/success measures/i.test(q)));
 assert.ok(result.governanceGates.length>=4);
});
