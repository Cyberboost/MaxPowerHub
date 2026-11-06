import {InfoPage} from '../components/InfoPage';

export const metadata={title:'Privacy | MaxPowerHub by CyberBoost'};
export default function Privacy(){return <InfoPage eyebrow="Privacy notice" title="A low-data public preview." intro="This library-only preview is designed to work without accounts, advertising profiles, or AI prompt processing.">
  <h2>Information this preview processes</h2><p>Search terms, product filters, and source-guide questions are processed locally in your browser. MaxPowerHub does not receive or store those entries in this preview.</p>
  <h2>Hosting information</h2><p>The site is hosted by Netlify. Like most hosting providers, Netlify may process technical request information such as IP addresses, browser details, timestamps, and requested pages for delivery, reliability, and security.</p>
  <h2>External links</h2><p>Resource links open third-party websites, primarily Microsoft Learn and GitHub. Their privacy practices apply after you follow those links.</p>
  <h2>AI status</h2><p>No AI provider is connected to the public preview. Do not enter credentials, secrets, customer records, or other sensitive information. This notice will be updated before any AI processing is enabled.</p>
  <h2>Questions</h2><p>Privacy questions can be directed to CyberBoost through its <a href="https://www.mycyberboost.tech" target="_blank" rel="noreferrer">official website</a>.</p>
  <p className="policy-date">Effective November 5, 2026</p>
</InfoPage>}
