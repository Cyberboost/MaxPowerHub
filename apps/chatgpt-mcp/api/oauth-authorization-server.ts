import type {VercelRequest,VercelResponse} from '@vercel/node';
import {oauthEnabled} from '../src/auth.js';
import {oauthAuthorizationMetadata} from '../src/oauth-bridge.js';

export default function handler(req:VercelRequest,res:VercelResponse){
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='GET'){res.setHeader('Allow','GET');return res.status(405).end();}
  if(!oauthEnabled())return res.status(404).json({error:'OAuth is not enabled'});
  try{return res.status(200).json(oauthAuthorizationMetadata());}
  catch{return res.status(503).json({error:'OAuth configuration is incomplete'});}
}
