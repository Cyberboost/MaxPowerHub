import {createHmac,timingSafeEqual} from 'node:crypto';
import {entraAuthorizationServer,getOAuthConfig,oauthResource} from './auth.js';

export const bridgeCallback=`${oauthResource}/oauth/callback`;

type BridgeState={redirectUri:string;clientId:string;clientState:string;expiresAt:number};

function secret(env:NodeJS.ProcessEnv=process.env){
  const value=env.OAUTH_BRIDGE_SECRET?.trim();
  if(!value||value.length<32)throw new Error('OAuth bridge secret is missing');
  return value;
}

function encode(value:string){return Buffer.from(value).toString('base64url');}
function signature(value:string,env:NodeJS.ProcessEnv=process.env){return createHmac('sha256',secret(env)).update(value).digest('base64url');}

export function signBridgeState(state:BridgeState,env:NodeJS.ProcessEnv=process.env){
  const payload=encode(JSON.stringify(state));
  return `${payload}.${signature(payload,env)}`;
}

export function verifyBridgeState(value:string,env:NodeJS.ProcessEnv=process.env):BridgeState{
  const [payload,sig,...rest]=value.split('.');
  if(!payload||!sig||rest.length)throw new Error('Invalid OAuth state');
  const expected=signature(payload,env);
  if(sig.length!==expected.length||!timingSafeEqual(Buffer.from(sig),Buffer.from(expected)))throw new Error('Invalid OAuth state');
  const parsed=JSON.parse(Buffer.from(payload,'base64url').toString('utf8')) as BridgeState;
  if(!isAllowedOAuthRedirect(parsed.redirectUri,parsed.clientId)||!parsed.clientState||parsed.expiresAt<Date.now())throw new Error('Expired OAuth state');
  return parsed;
}

export function isAllowedChatGptRedirect(value:string){
  try{
    const url=new URL(value);
    return url.origin==='https://chatgpt.com' && (
      url.pathname==='/connector_platform_oauth_redirect' || /^\/connector\/oauth\/[A-Za-z0-9_-]+$/.test(url.pathname)
    );
  }catch{return false;}
}

export function isAllowedOAuthClient(value:string,env:NodeJS.ProcessEnv=process.env){
  const configured=getOAuthConfig(env).audience.replace(/^api:\/\//,'');
  if(value===configured)return true;
  try{
    const url=new URL(value);
    return url.origin==='https://chatgpt.com' && (
      /^\/oauth(?:\/[A-Za-z0-9_-]+)*\/client\.json$/.test(url.pathname)
    ) && !url.search && !url.hash;
  }catch{return false;}
}

export function isAllowedOAuthRedirect(value:string,clientId:string){
  if(isAllowedChatGptRedirect(value))return true;
  const clientMatch=/^https:\/\/chatgpt\.com\/oauth\/codex\/([A-Za-z0-9_-]+)\/client\.json$/.exec(clientId);
  if(!clientMatch)return false;
  try{
    const url=new URL(value);
    return url.protocol==='http:' && url.hostname==='127.0.0.1' && /^\d+$/.test(url.port) && Number(url.port)>0 &&
      url.pathname===`/callback/${clientMatch[1]}` && !url.username && !url.password && !url.search && !url.hash;
  }catch{return false;}
}

export function oauthAuthorizationMetadata(env:NodeJS.ProcessEnv=process.env){
  const config=getOAuthConfig(env);
  return {
    issuer:oauthResource,
    authorization_endpoint:`${oauthResource}/oauth/authorize`,
    token_endpoint:`${oauthResource}/oauth/token`,
    token_endpoint_auth_methods_supported:['none'],
    client_id_metadata_document_supported:true,
    response_types_supported:['code'],
    grant_types_supported:['authorization_code','refresh_token'],
    code_challenge_methods_supported:['S256'],
    scopes_supported:[config.authorizationScope,'offline_access','openid','profile','email']
  };
}

export function entraAuthorizeUrl(params:URLSearchParams,env:NodeJS.ProcessEnv=process.env){
  const config=getOAuthConfig(env);
  const clientId=config.audience.replace(/^api:\/\//,'');
  const incomingClientId=params.get('client_id')||'';
  if(!isAllowedOAuthClient(incomingClientId,env))throw new Error('Unknown OAuth client');
  const redirectUri=params.get('redirect_uri')||'';
  const clientState=params.get('state')||'';
  if(!isAllowedOAuthRedirect(redirectUri,incomingClientId)||!clientState)throw new Error('Invalid OAuth redirect');
  if(params.get('response_type')!=='code'||params.get('code_challenge_method')!=='S256'||!params.get('code_challenge'))throw new Error('PKCE S256 is required');
  const upstream=new URL(`${entraAuthorizationServer(env)}/authorize`);
  for(const key of ['response_type','scope','code_challenge','code_challenge_method','prompt','login_hint']){
    const value=params.get(key); if(value)upstream.searchParams.set(key,value);
  }
  upstream.searchParams.set('client_id',clientId);
  upstream.searchParams.set('redirect_uri',bridgeCallback);
  upstream.searchParams.set('state',signBridgeState({redirectUri,clientId:incomingClientId,clientState,expiresAt:Date.now()+10*60_000},env));
  return upstream;
}
