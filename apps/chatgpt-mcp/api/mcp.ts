import type {VercelRequest,VercelResponse} from '@vercel/node';
import {StreamableHTTPServerTransport} from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import {createPowerHubServer} from '../src/server.js';
import {bearerChallenge,getOAuthConfig,oauthEnabled,verifyAccessToken} from '../src/auth.js';

export default async function handler(req:VercelRequest,res:VercelResponse){
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='POST'){res.setHeader('Allow','POST');return res.status(405).end();}
  if(oauthEnabled()){
    try{await verifyAccessToken(req.headers.authorization);}
    catch{
      let scope='mcp.access';
      try{scope=getOAuthConfig().scope;}catch{}
      res.setHeader('WWW-Authenticate',bearerChallenge(scope));
      return res.status(401).json({error:'Unauthorized'});
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
