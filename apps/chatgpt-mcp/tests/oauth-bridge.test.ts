import assert from 'node:assert/strict';
import test from 'node:test';
import {entraAuthorizeUrl,isAllowedChatGptRedirect,oauthAuthorizationMetadata,signBridgeState,verifyBridgeState} from '../src/oauth-bridge.js';

const env={OAUTH_ENABLED:'true',ENTRA_AUTHORITY:'9e1e0ee5-54f2-4e97-99b9-72bbe6eda2ea',ENTRA_AUDIENCE:'api://67fbdd50-800a-4bff-9001-081100f8485a',ENTRA_SCOPE:'mcp.access',OAUTH_BRIDGE_SECRET:'x'.repeat(32)};

test('metadata advertises the OAuth features ChatGPT requires',()=>{
  const metadata=oauthAuthorizationMetadata(env);
  assert.equal(metadata.issuer,'https://maxpowerhub-mcp.vercel.app');
  assert.deepEqual(metadata.token_endpoint_auth_methods_supported,['none']);
  assert.deepEqual(metadata.code_challenge_methods_supported,['S256']);
});

test('bridge state is signed, short-lived, and limited to ChatGPT callbacks',()=>{
  const value=signBridgeState({redirectUri:'https://chatgpt.com/connector/oauth/vEy6ryJTnVxW',clientState:'abc',expiresAt:Date.now()+60_000},env);
  assert.equal(verifyBridgeState(value,env).clientState,'abc');
  assert.throws(()=>verifyBridgeState(`${value}x`,env));
  assert.equal(isAllowedChatGptRedirect('https://evil.example/callback'),false);
});

test('authorize relay preserves PKCE but uses the controlled bridge callback',()=>{
  const params=new URLSearchParams({client_id:'67fbdd50-800a-4bff-9001-081100f8485a',redirect_uri:'https://chatgpt.com/connector/oauth/vEy6ryJTnVxW',response_type:'code',scope:'api://67fbdd50-800a-4bff-9001-081100f8485a/mcp.access offline_access',state:'client-state',code_challenge:'challenge',code_challenge_method:'S256'});
  const url=entraAuthorizeUrl(params,env);
  assert.equal(url.origin,'https://login.microsoftonline.com');
  assert.equal(url.searchParams.get('redirect_uri'),'https://maxpowerhub-mcp.vercel.app/oauth/callback');
  assert.equal(url.searchParams.get('code_challenge'),'challenge');
  assert.notEqual(url.searchParams.get('state'),'client-state');
});
