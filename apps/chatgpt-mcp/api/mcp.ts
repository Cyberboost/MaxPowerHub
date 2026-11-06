import type {VercelRequest,VercelResponse} from '@vercel/node';
import {StreamableHTTPServerTransport} from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import {createPowerHubServer} from '../src/server.js';
import {bearerChallenge,getOAuthConfig,oauthEnabled,verifyAccessToken} from '../src/auth.js';

export default async function handler(req:VercelRequest,res:VercelResponse){
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='POST'){res.setHeader('Allow','POST');return res.status(405).end();}
  if(oauthEnabled()){
    const config=getOAuthConfig();
    const challenge=bearerChallenge(config.authorizationScope);
    const authorization=req.headers.authorization;
    if(!authorization?.startsWith('Bearer ')){
      res.setHeader('WWW-Authenticate',challenge);
      return res.status(401).json({error:'authentication_required'});
    }
    try{
      const payload=await verifyAccessToken(authorization);
      const token=authorization.slice(7).trim();
      const scopes=typeof payload.scp==='string'?payload.scp.split(/\s+/).filter(Boolean):[config.scope];
      const clientId=typeof payload.azp==='string'?payload.azp:typeof payload.appid==='string'?payload.appid:'maxpowerhub-chatgpt';
      (req as VercelRequest & {auth?:unknown}).auth={token,clientId,scopes,expiresAt:payload.exp,resource:new URL('https://maxpowerhub-mcp.vercel.app'),extra:{subject:payload.sub,tenantId:payload.tid}};
    }catch{
      res.setHeader('WWW-Authenticate',`${challenge}, error="invalid_token"`);
      return res.status(401).json({error:'invalid_token'});
    }
  }
  const origin=req.headers.origin;
  const origins=(process.env.ALLOWED_ORIGINS||'').split(',').map(s=>s.trim()).filter(Boolean);
  if(origin && !origins.includes(origin))return res.status(403).json({error:'Origin not allowed'});
  const length=Number(req.headers['content-length']||0);
  if(length>32768)return res.status(413).json({error:'Request too large'});
  const server=createPowerHubServer();
  const transport=new StreamableHTTPServerTransport({sessionIdGenerator:undefined});
  try{
    await server.connect(transport);
    await transport.handleRequest(req,res,req.body);
  }catch{
    if(!res.headersSent)res.status(400).json({error:'Invalid MCP request'});
  }finally{
    res.on('close',()=>{void transport.close();void server.close();});
  }
}
