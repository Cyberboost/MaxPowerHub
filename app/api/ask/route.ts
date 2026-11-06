import {NextResponse} from 'next/server';
import OpenAI from 'openai';
import {findRelevantResources} from '../../../lib/resources';

export const runtime = 'nodejs';
const WINDOW_MS = 60 * 60 * 1000;
const MAX_REQUESTS = 10;
const hits = new Map<string, {count: number; reset: number}>();

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const now = Date.now();
  const prior = hits.get(ip);
  const usage = !prior || prior.reset < now ? {count: 0, reset: now + WINDOW_MS} : prior;
  usage.count += 1;
  hits.set(ip, usage);
  const limitHeaders = {'X-RateLimit-Limit': String(MAX_REQUESTS),'X-RateLimit-Remaining': String(Math.max(0, MAX_REQUESTS - usage.count)),'X-RateLimit-Reset': String(Math.ceil(usage.reset / 1000))};
  if (usage.count > MAX_REQUESTS) return NextResponse.json({error: 'The free beta limit has been reached. Try again after the hourly window resets.'}, {status: 429, headers: limitHeaders});
  let question: unknown;
  try { ({question} = await request.json()); } catch { return NextResponse.json({error: 'The request could not be read.'}, {status: 400, headers: limitHeaders}); }
  if (typeof question !== 'string' || !question.trim() || question.length > 1200) return NextResponse.json({error: 'Enter a question between 1 and 1,200 characters.'}, {status: 400, headers: limitHeaders});
  const citations = findRelevantResources(question).map(({id, title, url, source}) => ({id, title, url, source}));
  if (!process.env.OPENAI_API_KEY) return NextResponse.json({mode:'library-only',answer:'The AI answer service is intentionally off until its production rate limiter, abuse controls, and spending cap are configured. These curated sources are the best place to start.',citations}, {headers: limitHeaders});
  try {
    const client = new OpenAI({apiKey: process.env.OPENAI_API_KEY});
    const completion = await client.chat.completions.create({model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',max_tokens:700,temperature:0.2,messages:[
      {role:'system',content:'You are the Power Platform Guide by CyberBoost, a concise technical assistant. The supplied records are directory metadata, not retrieved documentation. Do not claim you read a linked page. Give a practical starting point, state uncertainty, and cite sources inline as [1], [2], etc. Refuse credential theft, evasion, or destructive actions without safeguards. Flag permissions, data loss, licensing, environment, and production risks. Never ask for secrets or sensitive customer data.'},
      {role:'user',content:`Question: ${question.trim()}\n\nDirectory metadata:\n${citations.map((citation,index)=>`[${index+1}] ${citation.title} — ${citation.source} — ${citation.url}`).join('\n')}`}
    ]});
    return NextResponse.json({answer:completion.choices[0]?.message?.content||'No answer was generated.',citations,mode:'ai'}, {headers:limitHeaders});
  } catch { return NextResponse.json({error:'The assistant is temporarily unavailable. The resource library is still available.',citations},{status:503,headers:limitHeaders}); }
}
