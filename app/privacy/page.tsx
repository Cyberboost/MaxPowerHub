import {InfoPage} from '../components/InfoPage';

export const metadata={title:'Privacy | MaxPowerHub by CyberBoost'};
export default function Privacy(){return <InfoPage eyebrow="Privacy notice" title="Privacy across the website and ChatGPT plugin." intro="MaxPowerHub is designed to minimize data collection and does not connect to or inspect a user's Microsoft Power Platform tenant.">
  <h2>Information this preview processes</h2><p>Search terms, product filters, and source-guide questions are processed locally in your browser. MaxPowerHub does not receive or store those entries in this preview.</p>
  <h2>Hosting information</h2><p>The site is hosted by Netlify. Like most hosting providers, Netlify may process technical request information such as IP addresses, browser details, timestamps, and requested pages for delivery, reliability, and security.</p>
  <h2>External links</h2><p>Resource links open third-party websites, primarily Microsoft Learn and GitHub. Their privacy practices apply after you follow those links.</p>
  <h2>ChatGPT plugin processing</h2><p>When you use MaxPowerHub AI in ChatGPT, OpenAI processes your conversation under its applicable terms and privacy practices. Relevant tool inputs are sent to the MaxPowerHub MCP service on Vercel so it can return requested guidance. The service is stateless, does not provide user accounts, and does not intentionally store prompts or tool results in an application database. Hosting and security providers may process technical request logs for delivery, reliability, abuse prevention, and security.</p>
  <h2>Tenant access and sensitive information</h2><p>The current plugin does not authenticate to, inspect, or modify a Microsoft tenant. Do not enter credentials, secrets, access tokens, customer records, regulated data, or other sensitive information. Use generalized or synthetic examples whenever possible.</p>
  <h2>Retention and deletion</h2><p>MaxPowerHub does not maintain an application database of plugin conversations. Requests may remain in infrastructure or security logs according to the hosting providers' retention controls. Conversation history and deletion in ChatGPT are governed by the user's OpenAI account and applicable OpenAI settings.</p>
  <h2>Questions</h2><p>Privacy questions can be directed to CyberBoost through its <a href="https://www.mycyberboost.tech" target="_blank" rel="noreferrer">official website</a>.</p>
  <p className="policy-date">Effective November 6, 2026</p>
</InfoPage>}
