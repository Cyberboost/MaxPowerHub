import {createRemoteJWKSet,jwtVerify} from 'jose';

const resource='https://maxpowerhub-mcp.vercel.app';
const metadataUrl=`${resource}/.well-known/oauth-protected-resource`;

export type OAuthConfig={authority:string;audience:string;scope:string;authorizationScope:string;authorizationServer:string;jwksUrl:URL};

export function oauthEnabled(env:NodeJS.ProcessEnv=process.env){return env.OAUTH_ENABLED==='true';}

export function getOAuthConfig(env:NodeJS.ProcessEnv=process.env):OAuthConfig{
  const authority=(env.ENTRA_AUTHORITY?.trim()||env.ENTRA_TENANT_ID?.trim()||'').toLowerCase();
  const audience=env.ENTRA_AUDIENCE?.trim();
  const scope=env.ENTRA_SCOPE?.trim()||'mcp.access';
  const validAuthority=/^(common|organizations|consumers|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/;
  if(!validAuthority.test(authority)||!audience)throw new Error('OAuth configuration is incomplete');
  return {
    authority,
    audience,
    scope,
    authorizationScope:env.ENTRA_AUTHORIZATION_SCOPE?.trim()||`${audience.startsWith('api://')?audience:`api://${audience}`}/${scope}`,
    authorizationServer:resource,
    jwksUrl:new URL(`https://login.microsoftonline.com/${authority}/discovery/v2.0/keys`)
  };
}

export function entraAuthorizationServer(env:NodeJS.ProcessEnv=process.env){
  const {authority}=getOAuthConfig(env);
  return `https://login.microsoftonline.com/${authority}/oauth2/v2.0`;
}

export function protectedResourceMetadata(env:NodeJS.ProcessEnv=process.env){
  const config=getOAuthConfig(env);
  return {
    resource,
    authorization_servers:[config.authorizationServer],
    scopes_supported:[config.authorizationScope],
    bearer_methods_supported:['header'],
    resource_documentation:'https://maxpowerhub.netlify.app/support/',
    resource_policy_uri:'https://maxpowerhub.netlify.app/privacy/',
    resource_tos_uri:'https://maxpowerhub.netlify.app/terms/'
  };
}

export function bearerChallenge(scope:string){
  return `Bearer resource_metadata="${metadataUrl}", scope="${scope}"`;
}

export function accessTokenAudiences(audience:string){
  const applicationId=audience.replace(/^api:\/\//,'');
  return applicationId===audience?[audience]:[audience,applicationId];
}

export type OAuthFailureCategory='expired'|'audience'|'issuer'|'scope'|'signature'|'key'|'claim_validation'|'other';

export function oauthFailureCategory(error:unknown):OAuthFailureCategory{
  const value=error as {code?:unknown;claim?:unknown;message?:unknown};
  const code=typeof value?.code==='string'?value.code:'';
  const claim=typeof value?.claim==='string'?value.claim:'';
  const message=typeof value?.message==='string'?value.message:'';
  if(code==='ERR_JWT_EXPIRED')return 'expired';
  if(code==='ERR_JWS_SIGNATURE_VERIFICATION_FAILED')return 'signature';
  if(code==='ERR_JWKS_NO_MATCHING_KEY')return 'key';
  if(code==='ERR_JWT_CLAIM_VALIDATION_FAILED'){
    if(claim==='aud')return 'audience';
    if(claim==='iss')return 'issuer';
    return 'claim_validation';
  }
  if(message==='Token issuer is invalid')return 'issuer';
  if(message==='Required scope is missing')return 'scope';
  return 'other';
}

export function toolBearerChallenge(scope:string){
  return `Bearer resource_metadata="${metadataUrl}", scope="${scope}", error="insufficient_scope", error_description="Sign in to MaxPowerHub AI to continue"`;
}

export async function verifyAccessToken(header:string|undefined,env:NodeJS.ProcessEnv=process.env){
  const config=getOAuthConfig(env);
  if(!header?.startsWith('Bearer '))throw new Error('Missing bearer token');
  const token=header.slice(7).trim();
  if(!token)throw new Error('Missing bearer token');
  const jwks=createRemoteJWKSet(config.jwksUrl);
  const {payload}=await jwtVerify(token,jwks,{audience:accessTokenAudiences(config.audience)});
  const tenantId=typeof payload.tid==='string'?payload.tid.toLowerCase():'';
  const expectedIssuer=`https://login.microsoftonline.com/${tenantId}/v2.0`;
  if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(tenantId)||payload.iss!==expectedIssuer){
    throw new Error('Token issuer is invalid');
  }
  const scopes=typeof payload.scp==='string'?payload.scp.split(/\s+/).filter(Boolean):[];
  if(!scopes.includes(config.scope))throw new Error('Required scope is missing');
  return payload;
}

export const oauthResource=resource;
