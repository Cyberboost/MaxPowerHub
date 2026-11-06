import {createRemoteJWKSet,jwtVerify} from 'jose';

const resource='https://maxpowerhub-mcp.vercel.app';
const metadataUrl=`${resource}/.well-known/oauth-protected-resource`;

export type OAuthConfig={tenantId:string;audience:string;scope:string;issuer:string;jwksUrl:URL};

export function oauthEnabled(env:NodeJS.ProcessEnv=process.env){return env.OAUTH_ENABLED==='true';}

export function getOAuthConfig(env:NodeJS.ProcessEnv=process.env):OAuthConfig{
  const tenantId=env.ENTRA_TENANT_ID?.trim();
  const audience=env.ENTRA_AUDIENCE?.trim();
  const scope=env.ENTRA_SCOPE?.trim()||'mcp.access';
  if(!tenantId||!audience)throw new Error('OAuth configuration is incomplete');
  const issuer=`https://login.microsoftonline.com/${tenantId}/v2.0`;
  return {tenantId,audience,scope,issuer,jwksUrl:new URL(`https://login.microsoftonline.com/${tenantId}/discovery/v2.0/keys`)};
}

export function protectedResourceMetadata(env:NodeJS.ProcessEnv=process.env){
  const config=getOAuthConfig(env);
  return {
    resource,
    authorization_servers:[config.issuer],
    scopes_supported:[config.scope],
    bearer_methods_supported:['header'],
    resource_documentation:'https://maxpowerhub.netlify.app/support/',
    resource_policy_uri:'https://maxpowerhub.netlify.app/privacy/',
    resource_tos_uri:'https://maxpowerhub.netlify.app/terms/'
  };
}

export function bearerChallenge(scope:string){
  return `Bearer resource_metadata="${metadataUrl}", scope="${scope}"`;
}

export async function verifyAccessToken(header:string|undefined,env:NodeJS.ProcessEnv=process.env){
  const config=getOAuthConfig(env);
  if(!header?.startsWith('Bearer '))throw new Error('Missing bearer token');
  const token=header.slice(7).trim();
  if(!token)throw new Error('Missing bearer token');
  const jwks=createRemoteJWKSet(config.jwksUrl);
  const {payload}=await jwtVerify(token,jwks,{issuer:config.issuer,audience:config.audience});
  const scopes=typeof payload.scp==='string'?payload.scp.split(/\s+/).filter(Boolean):[];
  if(!scopes.includes(config.scope))throw new Error('Required scope is missing');
  return payload;
}

export const oauthResource=resource;
