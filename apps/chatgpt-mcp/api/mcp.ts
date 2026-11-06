import type {VercelRequest,VercelResponse} from '@vercel/node';
import {StreamableHTTPServerTransport} from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import {createPowerHubServer} from '../src/server.js';
import {getOAuthConfig,oauthEnabled,oauthFailureCategory,verifyAccessToken} from '../src/auth.js';

export default async function handler(req:VercelRequest,res:VercelResponse){
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='POST'){res.setHeader('Allow','POST');return res.status(405).end();}
  const isToolCall=req.body?.method==='tools/call';
  if(oauthEnabled() && req.headers.authorization?.startsWith('Bearer ')){
    try{
      const payload=await verifyAccessToken(req.headers.authorization);
      const token=req.headers.authorization.slice(7).trim();
      const scopes=typeof payload.scp==='string'?payload.scp.split(/\s+/).filter(Boolean):[getOAuthConfig().scope];
      const clientId=typeof payload.azp==='string'?payload.azp:typeof payload.appid==='string'?payload.appid:'maxpowerhub-chatgpt';
      (req as VercelRequest & {auth?:unknown}).auth={token,clientId,scopes,expiresAt:payload.exp,resource:new URL('https://maxpowerhub-mcp.vercel.app'),extra:{subject:payload.sub,tenantId:payload.tid}};
      if(isToolCall)console.info(JSON.stringify({event:'mcp_oauth_token_accepted'}));
    }catch(error){
      if(isToolCall)console.warn(JSON.stringify({event:'mcp_oauth_token_rejected',category:oauthFailureCategory(error)}));
      // Keep discovery available. Authenticated tool handlers return the MCP OAuth challenge.
    }
  }else if(oauthEnabled() && isToolCall){
    console.warn(JSON.stringify({event:'mcp_oauth_missing_bearer'}));
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
