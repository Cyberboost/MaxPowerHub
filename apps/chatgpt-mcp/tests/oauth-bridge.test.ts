import assert from 'node:assert/strict';
import test from 'node:test';
import {entraAuthorizeUrl,isAllowedChatGptRedirect,isAllowedOAuthClient,isAllowedOAuthRedirect,oauthAuthorizationMetadata,signBridgeState,verifyBridgeState} from '../src/oauth-bridge.js';

const env={OAUTH_ENABLED:'true',ENTRA_AUTHORITY:'9e1e0ee5-54f2-4e97-99b9-72bbe6eda2ea',ENTRA_AUDIENCE:'api://67fbdd50-800a-4bff-9001-081100f8485a',ENTRA_SCOPE:'mcp.access',OAUTH_BRIDGE_SECRET:'x'.repeat(32)};

test('metadata advertises the OAuth features ChatGPT requires',()=>{
  const metadata=oauthAuthorizationMetadata(env);
  assert.equal(metadata.issuer,'https://maxpowerhub-mcp.vercel.app');
  assert.deepEqual(metadata.token_endpoint_auth_methods_supported,['none']);
  assert.deepEqual(metadata.code_challenge_methods_supported,['S256']);
  assert.equal(metadata.client_id_metadata_document_supported,true);
});

test('accepts only the configured client or official ChatGPT CIMD identities',()=>{
  assert.equal(isAllowedOAuthClient('67fbdd50-800a-4bff-9001-081100f8485a',env),true);
  assert.equal(isAllowedOAuthClient('https://chatgpt.com/oauth/client.json',env),true);
  assert.equal(isAllowedOAuthClient('https://chatgpt.com/oauth/vEy6ryJTnVxW/client.json',env),true);
  assert.equal(isAllowedOAuthClient('https://chatgpt.com/oauth/codex/yN81iPXW6lQC/client.json',env),true);
  assert.equal(isAllowedOAuthClient('https://evil.example/oauth/client.json',env),false);
  assert.equal(isAllowedOAuthClient('https://chatgpt.com/oauth/client.json?redirect=evil',env),false);
});

test('allows only a Codex loopback callback bound to the same connection ID',()=>{
  const client='https://chatgpt.com/oauth/codex/yN81iPXW6lQC/client.json';
  assert.equal(isAllowedOAuthRedirect('http://127.0.0.1:54344/callback/yN81iPXW6lQC',client),true);
  assert.equal(isAllowedOAuthRedirect('http://127.0.0.1:54344/callback/other',client),false);
  assert.equal(isAllowedOAuthRedirect('http://localhost:54344/callback/yN81iPXW6lQC',client),false);
  assert.equal(isAllowedOAuthRedirect('https://127.0.0.1:54344/callback/yN81iPXW6lQC',client),false);
});

test('bridge state is signed, short-lived, and limited to ChatGPT callbacks',()=>{
  const value=signBridgeState({redirectUri:'https://chatgpt.com/connector/oauth/vEy6ryJTnVxW',clientId:'67fbdd50-800a-4bff-9001-081100f8485a',clientState:'abc',expiresAt:Date.now()+60_000},env);
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

test('authorize relay maps ChatGPT CIMD identity to the Entra application',()=>{
  const params=new URLSearchParams({client_id:'https://chatgpt.com/oauth/client.json',redirect_uri:'https://chatgpt.com/connector_platform_oauth_redirect',response_type:'code',scope:'api://67fbdd50-800a-4bff-9001-081100f8485a/mcp.access offline_access',state:'client-state',code_challenge:'challenge',code_challenge_method:'S256'});
  const url=entraAuthorizeUrl(params,env);
  assert.equal(url.searchParams.get('client_id'),'67fbdd50-800a-4bff-9001-081100f8485a');
});

test('authorize relay accepts the bound Codex loopback callback',()=>{
  const params=new URLSearchParams({client_id:'https://chatgpt.com/oauth/codex/yN81iPXW6lQC/client.json',redirect_uri:'http://127.0.0.1:54344/callback/yN81iPXW6lQC',response_type:'code',scope:'api://67fbdd50-800a-4bff-9001-081100f8485a/mcp.access offline_access',state:'client-state',code_challenge:'challenge',code_challenge_method:'S256'});
  const url=entraAuthorizeUrl(params,env);
  assert.equal(url.searchParams.get('client_id'),'67fbdd50-800a-4bff-9001-081100f8485a');
  assert.equal(url.searchParams.get('redirect_uri'),'https://maxpowerhub-mcp.vercel.app/oauth/callback');
});
