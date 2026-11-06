import {InfoPage} from '../components/InfoPage';

export const metadata={title:'About | MaxPowerHub by CyberBoost'};
export default function About(){return <InfoPage eyebrow="About the project" title="A clearer path through Power Platform." intro="MaxPowerHub is an independent, curated starting point for people building, governing, and supporting Microsoft Power Platform solutions.">
  <h2>Why it exists</h2><p>Official documentation is authoritative, but finding the right page can be difficult when a problem spans products, roles, and lifecycle stages. MaxPowerHub organizes trusted starting points and helps visitors narrow a question to relevant sources.</p>
  <h2>How resources are selected</h2><p>Microsoft Learn and official Microsoft repositories are prioritized. Established community projects are included only when their ownership is clearly identified, and they are labeled separately from official documentation.</p>
  <h2>What it is not</h2><p>MaxPowerHub is not affiliated with or endorsed by Microsoft. It does not replace architecture review, security testing, licensing advice, or validation in your own environment.</p>
  <h2>Who maintains it</h2><p>MaxPowerHub is created and maintained by <a href="https://www.mycyberboost.tech" target="_blank" rel="noreferrer">CyberBoost</a>, a technology consulting company focused on practical automation, cybersecurity, and responsible AI adoption.</p>
</InfoPage>}
