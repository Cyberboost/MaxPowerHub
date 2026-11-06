import {ArrowLeft, Sparkles} from 'lucide-react';

export function InfoPage({eyebrow,title,intro,children}:{eyebrow:string;title:string;intro:string;children:React.ReactNode}) {
  return <main className="info-shell">
    <header className="site-header info-header"><a className="brand" href="/" aria-label="MaxPowerHub home"><span className="brand-mark"><Sparkles size={19}/></span><span>MaxPower<b>Hub</b><small>by CyberBoost</small></span></a><a className="back-link" href="/"><ArrowLeft size={15}/> Back to the library</a></header>
    <article className="info-page"><div className="kicker"><span></span>{eyebrow}</div><h1>{title}</h1><p className="info-intro">{intro}</p><div className="info-content">{children}</div></article>
    <footer className="info-footer"><span>MaxPowerHub by CyberBoost</span><div className="footer-links"><a href="/about/">About</a><a href="/support/">Support</a><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a><a href="/submit/">Submit a resource</a></div></footer>
  </main>;
}
