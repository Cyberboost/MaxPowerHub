import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import {getResource,recommendImplementationPattern,searchPowerPlatformResources,troubleshootPowerPlatform} from '../src/tools.ts';

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
});
