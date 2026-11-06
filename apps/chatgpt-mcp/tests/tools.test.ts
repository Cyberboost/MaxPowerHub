import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import {assessCenterOfExcellence,createPowerPlatformProjectBrief,designPowerPlatformExpression,generateSolutionBlueprint,getResource,recommendImplementationPattern,reviewPowerPlatformExpression,searchPowerPlatformResources,troubleshootPowerPlatform} from '../src/tools.ts';

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
 const result=generateSolutionBlueprint({objective:'Create a secure customer intake process',users:'External customers and internal case workers',data:'Dataverse business data',process:'Customers submit requests and staff review them',integrations:'Power Automate approvals',security:'External identities and least privilege',businessCriticality:'High',availability:'Business hours with monitored after-hours processing',recovery:'Restore service within four hours',compliance:'Personal data and records retention'});
 assert.equal(result.status,'draft-blueprint');
 assert.match(result.architecture.experience,/Power Pages/);
 assert.ok(result.security.length>=3);
 assert.ok(result.deliveryPlan.length>=4);
 assert.deepEqual(Object.keys(result.wellArchitectedReview),['reliability','security','operationalExcellence','performanceEfficiency','experienceOptimization']);
 assert.ok(result.releaseGates.length>=6);
 assert.ok(result.riskRegister.length>=5);
 assert.ok(result.responsibilityMatrix.length>=4);
 assert.ok(result.rollbackPlan.some(item=>/data changes/i.test(item)));
 assert.ok(result.sources.length>0);
});
test('expression review warns about delegation patterns',()=>{
 const result=reviewPowerPlatformExpression({language:'Power Fx',expression:'Filter(Accounts, Name in SearchBox.Text)',intent:'Search accounts'});
 assert.equal(result.status,'static-review');
 assert.ok(result.findings.some(f=>/delegation/i.test(f.message)));
 assert.match(result.note,/not executed/i);
});
test('expression review flags unhandled data writes and hardcoded sensitive values',()=>{
 const result=reviewPowerPlatformExpression({language:'Power Fx',expression:'Patch(Accounts, Defaults(Accounts), { Name: txtName.Text, apiKey: "real-looking-secret" })',intent:'Create an account'});
 assert.ok(result.findings.some(f=>/not wrapped/i.test(f.message)));
 assert.ok(result.findings.some(f=>/hardcoded sensitive value/i.test(f.message)));
});
test('expression designer returns a documented Power Fx pattern and official sources',()=>{
 const result=designPowerPlatformExpression({language:'Power Fx',scenario:'delegated search',requirements:'Search Dataverse accounts by name',dataSource:'Dataverse',fieldNames:'Account Name'});
 assert.equal(result.status,'draft-expression-pattern');
 assert.match(result.draft,/StartsWith/);
 assert.match(result.note,/not executed, compiled, or validated/i);
 assert.ok(result.sources.every(source=>source.url.startsWith('https://learn.microsoft.com/')));
});
test('expression designer returns null-safe Power Automate pattern',()=>{
 const result=designPowerPlatformExpression({language:'Power Automate',scenario:'optional field',requirements:'Use a default when the trigger omits the field'});
 assert.match(result.draft,/coalesce/);
 assert.match(result.draft,/\?\['OptionalField'\]/);
});
test('project brief identifies missing discovery inputs',()=>{
 const result=createPowerPlatformProjectBrief({name:'Intake modernization',objective:'Reduce manual triage',users:'Operations team',scope:'Replace email intake with a governed application'});
 assert.equal(result.status,'draft-project-brief');
 assert.ok(result.discoveryQuestions.some(q=>/success measures/i.test(q)));
 assert.ok(result.governanceGates.length>=4);
});
test('CoE assessment is native-first and does not present the Starter Kit as the default',()=>{
 const result=assessCenterOfExcellence({organization:'Contoso',maturity:'Repeatable',goals:'Scale governed maker adoption'});
 assert.equal(result.status,'coe-readiness-plan');
 assert.equal(result.first90Days.length,3);
 assert.ok(result.nativeFirstControls.length>=3);
 assert.match(result.starterKitPosition,/no longer actively maintained/i);
 assert.match(result.note,/No tenant settings were inspected or changed/i);
 assert.ok(result.sources.every(source=>source.url.startsWith('https://learn.microsoft.com/')));
});
