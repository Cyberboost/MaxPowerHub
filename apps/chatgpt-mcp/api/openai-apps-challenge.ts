import type {VercelRequest, VercelResponse} from '@vercel/node';

const OPENAI_APPS_CHALLENGE = 'HmpiHDwbvzXySF3t2hJtp8VQlM61g5US_-01OjW4Zo4';

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'public, max-age=300');
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  return res.status(200).send(OPENAI_APPS_CHALLENGE);
}
