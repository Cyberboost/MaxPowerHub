import type {VercelRequest,VercelResponse} from '@vercel/node';
import {verifyBridgeState} from '../src/oauth-bridge.js';

export default function handler(req:VercelRequest,res:VercelResponse){
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='GET'){res.setHeader('Allow','GET');return res.status(405).end();}
  try{
    const state=verifyBridgeState(typeof req.query.state==='string'?req.query.state:'');
    const target=new URL(state.redirectUri);
    for(const key of ['code','error','error_description','error_uri']){
      const value=req.query[key]; if(typeof value==='string')target.searchParams.set(key,value);
    }
    target.searchParams.set('state',state.clientState);
    return res.redirect(302,target.toString());
  }catch{return res.status(400).json({error:'invalid_request',error_description:'The OAuth response could not be verified.'});}
}
