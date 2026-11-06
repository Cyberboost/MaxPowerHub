import assert from 'node:assert/strict';
import test from 'node:test';
import {
  accessTokenAudiences,
  bearerChallenge,
  getOAuthConfig,
  oauthFailureCategory,
  oauthEnabled,
  protectedResourceMetadata
} from '../src/auth.js';

const env={
  OAUTH_ENABLED:'true',
  ENTRA_AUTHORITY:'common',
  ENTRA_AUDIENCE:'api://maxpowerhub',
  ENTRA_SCOPE:'mcp.access'
};

test('OAuth is enabled only by an explicit feature flag',()=>{
  assert.equal(oauthEnabled(env),true);
  assert.equal(oauthEnabled({...env,OAUTH_ENABLED:'false'}),false);
  assert.equal(oauthEnabled({}),false);
});

test('OAuth diagnostics classify failures without retaining sensitive values',()=>{
  assert.equal(oauthFailureCategory({code:'ERR_JWT_EXPIRED'}),'expired');
  assert.equal(oauthFailureCategory({code:'ERR_JWT_CLAIM_VALIDATION_FAILED',claim:'aud'}),'audience');
  assert.equal(oauthFailureCategory({message:'Token issuer is invalid'}),'issuer');
  assert.equal(oauthFailureCategory({message:'Required scope is missing'}),'scope');
  assert.equal(oauthFailureCategory(new Error('a secret-bearing upstream detail')),'other');
});

test('Entra configuration uses the multi-tenant v2 endpoints',()=>{
  const config=getOAuthConfig(env);
  assert.equal(config.authorizationServer,'https://maxpowerhub-mcp.vercel.app');
  assert.equal(config.jwksUrl.href,'https://login.microsoftonline.com/common/discovery/v2.0/keys');
  assert.equal(config.audience,'api://maxpowerhub');
  assert.equal(config.scope,'mcp.access');
  assert.equal(config.authorizationScope,'api://maxpowerhub/mcp.access');
});

test('OAuth configuration rejects missing required values',()=>{
  assert.throws(()=>getOAuthConfig({ENTRA_AUTHORITY:'common'}),/incomplete/);
  assert.throws(()=>getOAuthConfig({ENTRA_AUDIENCE:'api:\/\/maxpowerhub'}),/incomplete/);
  assert.throws(()=>getOAuthConfig({ENTRA_AUTHORITY:'not-a-tenant',ENTRA_AUDIENCE:'api:\/\/maxpowerhub'}),/incomplete/);
});

test('Entra v2 token validation accepts only both identifiers for the registered API',()=>{
  assert.deepEqual(accessTokenAudiences('api://67fbdd50-800a-4bff-9001-081100f8485a'),[
    'api://67fbdd50-800a-4bff-9001-081100f8485a',
    '67fbdd50-800a-4bff-9001-081100f8485a'
  ]);
  assert.deepEqual(accessTokenAudiences('67fbdd50-800a-4bff-9001-081100f8485a'),[
    '67fbdd50-800a-4bff-9001-081100f8485a'
  ]);
});

test('protected resource metadata advertises Entra and the required scope',()=>{
  assert.deepEqual(protectedResourceMetadata(env),{
    resource:'https://maxpowerhub-mcp.vercel.app',
    authorization_servers:['https://maxpowerhub-mcp.vercel.app'],
    scopes_supported:['api://maxpowerhub/mcp.access'],
    bearer_methods_supported:['header'],
    resource_documentation:'https://maxpowerhub.netlify.app/support/',
    resource_policy_uri:'https://maxpowerhub.netlify.app/privacy/',
    resource_tos_uri:'https://maxpowerhub.netlify.app/terms/'
  });
});

test('bearer challenge points clients to protected resource metadata',()=>{
  assert.equal(
    bearerChallenge('mcp.access'),
    'Bearer resource_metadata="https://maxpowerhub-mcp.vercel.app/.well-known/oauth-protected-resource", scope="mcp.access"'
  );
});
