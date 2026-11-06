import {InfoPage} from '../components/InfoPage';

export const metadata={title:'Support | MaxPowerHub AI by CyberBoost'};
export default function Support(){return <InfoPage eyebrow="Support" title="Get help with MaxPowerHub AI." intro="CyberBoost supports questions about access, expected behavior, source quality, and responsible use of MaxPowerHub AI.">
  <h2>Before contacting support</h2><p>Do not include passwords, access tokens, customer records, confidential tenant data, or other secrets. Include the prompt you used, the tool or capability involved, the result you expected, and any non-sensitive error message.</p>
  <h2>What we can help with</h2><ul><li>Plugin access and connection questions</li><li>Unexpected tool responses or missing citations</li><li>Power Platform guidance that appears outdated or unsafe</li><li>Privacy, security, accessibility, or responsible-use concerns</li></ul>
  <h2>Contact CyberBoost</h2><p>Use the contact pathway on the <a href="https://www.mycyberboost.tech" target="_blank" rel="noreferrer">official CyberBoost website</a> and include “MaxPowerHub AI support” in your message.</p>
  <h2>Service limits</h2><p>MaxPowerHub AI provides planning and engineering guidance. It does not access your Microsoft tenant, execute changes, or replace tenant-specific security, licensing, compliance, or production validation.</p>
</InfoPage>}
