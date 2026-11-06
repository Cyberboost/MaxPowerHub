import {InfoPage} from '../components/InfoPage';

export const metadata={title:'Terms and disclaimer | MaxPowerHub by CyberBoost'};
export default function Terms(){return <InfoPage eyebrow="Terms and disclaimer" title="Use the guide as a starting point." intro="MaxPowerHub provides educational resource discovery, not a warranty that a particular design or instruction is suitable for your environment.">
  <h2>Independent resource</h2><p>MaxPowerHub is created by CyberBoost and is not affiliated with, sponsored by, or endorsed by Microsoft. Microsoft, Power Platform, Power Apps, Power Automate, Power BI, Power Pages, Dataverse, and Copilot Studio are trademarks of their respective owners.</p>
  <h2>No professional or production assurance</h2><p>Resources and source matches are provided for general informational purposes. Verify product versions, permissions, licensing, security, compliance, backup, and recovery requirements before applying guidance—especially in production.</p>
  <h2>External content</h2><p>Linked content is controlled by its publisher and can change without notice. A link does not imply endorsement. Community samples may carry separate licenses and support expectations.</p>
  <h2>Availability</h2><p>The public beta may change, pause, or remove features as the library and safety controls are improved. No guarantee of uninterrupted availability is made.</p>
  <h2>Acceptable use</h2><p>Do not use the site to facilitate unauthorized access, credential theft, evasion of security controls, or unlawful activity.</p>
  <p className="policy-date">Effective November 5, 2026</p>
</InfoPage>}
