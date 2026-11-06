import {createServer} from 'node:http';
import {StreamableHTTPServerTransport} from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import {createPowerHubServer} from './server.ts';

const port=Number(process.env.PORT || 3001);
const host=process.env.HOST || '127.0.0.1';
const maxBytes=32_768;

const httpServer=createServer(async (req,res)=>{
  res.setHeader('Cache-Control','no-store');
  if(req.url==='/health' && req.method==='GET'){
    res.writeHead(200,{'Content-Type':'application/json'});
    res.end(JSON.stringify({status:'ok',service:'maxpowerhub-mcp'}));return;
  }
  if(req.url!=='/mcp'){res.writeHead(404);res.end('Not found');return;}
  if(req.method!=='POST'){
    res.writeHead(405,{'Allow':'POST'});res.end('Method not allowed');return;
  }
  const origin=req.headers.origin;
  const allowedOrigins=(process.env.ALLOWED_ORIGINS || '').split(',').map(x=>x.trim()).filter(Boolean);
  if(origin && (!allowedOrigins.length || !allowedOrigins.includes(origin))){
    res.writeHead(403);res.end('Origin not allowed');return;
  }
  if(Number(req.headers['content-length']||0)>maxBytes){
    res.writeHead(413);res.end('Request too large');return;
  }
  let bytes=0;
  const chunks:Buffer[]=[];
  try {
    for await (const chunk of req){
      bytes+=chunk.length;
      if(bytes>maxBytes){res.writeHead(413);res.end('Request too large');return;}
      chunks.push(chunk);
    }
    const body=JSON.parse(Buffer.concat(chunks).toString('utf8'));
    const mcp=createPowerHubServer();
    const transport=new StreamableHTTPServerTransport({sessionIdGenerator:undefined});
    res.on('close',()=>{void transport.close();void mcp.close();});
    await mcp.connect(transport);
    await transport.handleRequest(req,res,body);
  } catch(err) {
    if(!res.headersSent){res.writeHead(400,{'Content-Type':'application/json'});res.end(JSON.stringify({error:'Invalid MCP request'}));}
  }
});
httpServer.requestTimeout=15_000;
httpServer.listen(port,host,()=>console.log(`MaxPowerHub MCP listening at http://${host}:${port}/mcp`));
