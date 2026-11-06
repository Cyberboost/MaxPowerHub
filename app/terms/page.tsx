import {InfoPage} from '../components/InfoPage';

export const metadata={title:'Terms and disclaimer | MaxPowerHub by CyberBoost'};
export default function Terms(){return <InfoPage eyebrow="Terms and disclaimer" title="Use the guide as a starting point." intro="MaxPowerHub provides educational resource discovery, not a warranty that a particular design or instruction is suitable for your environment.">
  <h2>Independent resource</h2><p>MaxPowerHub is created by CyberBoost and is not affiliated with, sponsored by, or endorsed by Microsoft. Microsoft, Power Platform, Power Apps, Power Automate, Power BI, Power Pages, Dataverse, and Copilot Studio are trademarks of their respective owners.</p>
  <h2>No professional or production assurance</h2><p>Resources and source matches are provided for general informational purposes. Verify product versions, permissions, licensing, security, compliance, backup, and recovery requirements before applying guidance—especially in production.</p>
  <h2>External content</h2><p>Linked content is controlled by its publisher and can change without notice. A link does not imply endorsement. Community samples may carry separate licenses and support expectations.</p>
  <h2>Availability</h2><p>The public beta may change, pause, or remove features as the library and safety controls are improved. No guarantee of uninterrupted availability is made.</p>
  <h2>Acceptable use</h2><p>Do not use the site to facilitate unauthorized access, credential theft, evasion of security controls, or unlawful activity.</p>
  <h2>ChatGPT plugin</h2><p>Use of MaxPowerHub AI through ChatGPT is also subject to the terms and policies that apply to the user's OpenAI account. The plugin provides generated planning and engineering guidance and may produce incomplete or incorrect results. Users remain responsible for reviewing sources and validating all recommendations in a suitable development environment before production use.</p>
  <h2>Data and tenant limitations</h2><p>The current plugin does not access or change Microsoft tenants. Do not submit credentials, access tokens, confidential business records, regulated data, or personal information that is not necessary for the request.</p>
  <p className="policy-date">Effective November 6, 2026</p>
</InfoPage>}
