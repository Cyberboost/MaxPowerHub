import assert from 'node:assert/strict';
import test from 'node:test';
import {
  bearerChallenge,
  getOAuthConfig,
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

test('Entra configuration uses the multi-tenant v2 endpoints',()=>{
  const config=getOAuthConfig(env);
  assert.equal(config.authorizationServer,'https://login.microsoftonline.com/common/v2.0');
  assert.equal(config.jwksUrl.href,'https://login.microsoftonline.com/common/discovery/v2.0/keys');
  assert.equal(config.audience,'api://maxpowerhub');
  assert.equal(config.scope,'mcp.access');
});

test('OAuth configuration rejects missing required values',()=>{
  assert.throws(()=>getOAuthConfig({ENTRA_AUTHORITY:'common'}),/incomplete/);
  assert.throws(()=>getOAuthConfig({ENTRA_AUDIENCE:'api:\/\/maxpowerhub'}),/incomplete/);
  assert.throws(()=>getOAuthConfig({ENTRA_AUTHORITY:'not-a-tenant',ENTRA_AUDIENCE:'api:\/\/maxpowerhub'}),/incomplete/);
});

test('protected resource metadata advertises Entra and the required scope',()=>{
  assert.deepEqual(protectedResourceMetadata(env),{
    resource:'https://maxpowerhub-mcp.vercel.app',
    authorization_servers:['https://login.microsoftonline.com/common/v2.0'],
    scopes_supported:['mcp.access'],
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
