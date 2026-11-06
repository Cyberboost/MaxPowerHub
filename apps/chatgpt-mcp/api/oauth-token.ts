import type {VercelRequest,VercelResponse} from '@vercel/node';
import {bridgeCallback} from '../src/oauth-bridge.js';
import {entraAuthorizationServer,getOAuthConfig} from '../src/auth.js';

export default async function handler(req:VercelRequest,res:VercelResponse){
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='POST'){res.setHeader('Allow','POST');return res.status(405).end();}
  try{
    const incoming=new URLSearchParams(typeof req.body==='string'?req.body:req.body||{});
    const config=getOAuthConfig();
    const clientId=config.audience.replace(/^api:\/\//,'');
    if(incoming.get('client_id')!==clientId)return res.status(401).json({error:'invalid_client'});
    const grantType=incoming.get('grant_type');
    if(grantType==='authorization_code')incoming.set('redirect_uri',bridgeCallback);
    else if(grantType!=='refresh_token')return res.status(400).json({error:'unsupported_grant_type'});
    incoming.delete('client_secret');
    incoming.delete('resource');
    const upstream=await fetch(`${entraAuthorizationServer()}/token`,{
      method:'POST',headers:{'content-type':'application/x-www-form-urlencoded'},body:incoming.toString()
    });
    const body=await upstream.text();
    res.status(upstream.status);
    res.setHeader('Content-Type',upstream.headers.get('content-type')||'application/json');
    return res.send(body);
  }catch{return res.status(503).json({error:'temporarily_unavailable'});}
}
