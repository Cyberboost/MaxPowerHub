import {InfoPage} from '../components/InfoPage';

export const metadata={title:'Submit a resource | MaxPowerHub by CyberBoost'};
export default function Submit(){return <InfoPage eyebrow="Community pathway" title="Suggest a resource." intro="Help improve the library by proposing a trustworthy Power Platform reference, sample, or troubleshooting guide.">
  <h2>What to include</h2><ul><li>Resource title and public URL</li><li>Publisher or maintainer</li><li>Relevant Power Platform product and skill level</li><li>A short explanation of why it is useful</li><li>Any license, maintenance, or security considerations</li></ul>
  <h2>Selection standards</h2><p>Official documentation is preferred. Community resources should have clear ownership, an appropriate license, recent maintenance activity, and no requirement to disclose credentials or sensitive data.</p>
  <h2>Send your suggestion</h2><p>Use the contact pathway on the <a href="https://www.mycyberboost.tech" target="_blank" rel="noreferrer">CyberBoost website</a> and include “MaxPowerHub resource suggestion” in your message. Submission does not guarantee inclusion.</p>
</InfoPage>}
