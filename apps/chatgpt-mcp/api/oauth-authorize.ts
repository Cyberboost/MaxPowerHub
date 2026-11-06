import type {VercelRequest,VercelResponse} from '@vercel/node';
import {entraAuthorizeUrl} from '../src/oauth-bridge.js';

export default function handler(req:VercelRequest,res:VercelResponse){
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='GET'){res.setHeader('Allow','GET');return res.status(405).end();}
  try{
    const params=new URLSearchParams();
    for(const [key,value] of Object.entries(req.query))if(typeof value==='string')params.set(key,value);
    return res.redirect(302,entraAuthorizeUrl(params).toString());
  }catch(error){return res.status(400).json({error:'invalid_request',error_description:error instanceof Error?error.message:'Invalid OAuth request'});}
}
