'use client';
import {useMemo, useState} from 'react';
import {ArrowRight, BookOpen, Bot, Check, ExternalLink, Search, ShieldCheck, Sparkles} from 'lucide-react';
import {findRelevantResources, products, resources} from '../lib/resources';

type Citation = {id:string; title:string; url:string; source:string};
type AssistantResult = {answer:string; citations:Citation[]; mode?:string};

export default function Home() {
  const [query,setQuery] = useState('');
  const [product,setProduct] = useState('All');
  const [question,setQuestion] = useState('');
  const [result,setResult] = useState<AssistantResult|null>(null);
  const [error,setError] = useState('');
  const [loading,setLoading] = useState(false);
  const results = useMemo(() => resources.filter((resource) => {
    const matchProduct = product === 'All' || resource.product === product;
    const haystack = [resource.title,resource.description,resource.product,resource.type,resource.level,...resource.tags].join(' ').toLowerCase();
    return matchProduct && haystack.includes(query.trim().toLowerCase());
  }), [query,product]);

  async function ask(event:React.FormEvent) {
    event.preventDefault();
    if (!question.trim()) return;
    setLoading(true); setResult(null); setError('');
    try {
      const citations = findRelevantResources(question).map(({id,title,url,source})=>({id,title,url,source}));
      setResult({mode:'library-only',answer:'AI answers are intentionally off during the library-only preview. These curated sources are the best place to start, and each link opens the current publisher documentation for verification.',citations});
    } catch (caught) { setError(caught instanceof Error ? caught.message : 'The source guide is unavailable.'); }
    finally { setLoading(false); }
  }

  return <main>
    <header className="site-header"><a className="brand" href="#top" aria-label="MaxPowerHub home"><span className="brand-mark"><Sparkles size={19}/></span><span>MaxPower<b>Hub</b><small>by CyberBoost</small></span></a><nav aria-label="Primary navigation"><a href="#library">Library</a><a href="#assistant">Ask AI</a><a className="nav-cta" href="https://www.mycyberboost.tech" target="_blank" rel="noreferrer">Work with CyberBoost <ExternalLink size={14}/></a></nav></header>

    <section id="top" className="hero"><div className="hero-copy"><div className="kicker"><span></span>Independent Power Platform field guide</div><h1>Find the right path.<br/><em>Build with confidence.</em></h1><p className="hero-lede">A curated library and citation-first assistant for makers, developers, and teams working across Microsoft Power Platform.</p><div className="hero-actions"><a className="button primary" href="#library">Explore the library <ArrowRight size={17}/></a><a className="button quiet" href="#assistant"><Bot size={17}/> Ask the guide</a></div><div className="trust-row"><span><Check size={15}/> Official sources first</span><span><Check size={15}/> No account required</span><span><Check size={15}/> Human review still matters</span></div></div>
      <div className="hero-panel" aria-label="Featured learning path"><div className="panel-label">Suggested path · New solution</div><div className="path-step"><span>01</span><div><b>Frame the workload</b><small>Users, data, risk, and outcomes</small></div></div><div className="path-line"></div><div className="path-step"><span>02</span><div><b>Choose the right product</b><small>Apps, automation, analytics, or agents</small></div></div><div className="path-line"></div><div className="path-step"><span>03</span><div><b>Design for operations</b><small>Security, ALM, governance, and support</small></div></div><a href="#library">Browse architecture resources <ArrowRight size={15}/></a></div>
    </section>

    <section className="proof-strip" aria-label="Library overview"><div><strong>{resources.length}</strong><span>curated starting points</span></div><div><strong>{resources.filter(r=>r.source==='Microsoft Learn').length}</strong><span>Microsoft Learn links</span></div><div><strong>{products.length-1}</strong><span>product areas</span></div><div><strong>Free</strong><span>public beta library</span></div></section>

    <section id="library" className="section library"><div className="section-heading"><div><div className="kicker"><span></span>Curated knowledge</div><h2>Start with sources you can verify.</h2><p>Search official documentation and established community projects by product, task, or technology.</p></div><div className="source-note"><ShieldCheck size={21}/><span><b>Editorial principle</b>Official Microsoft guidance is prioritized. Community resources are clearly labeled.</span></div></div>
      <label className="search-box"><Search size={21}/><span className="sr-only">Search resources</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Try “Dataverse security”, “Power Fx”, or “ALM”"/><kbd>{results.length} results</kbd></label>
      <div className="filters" role="group" aria-label="Filter by product">{products.map(item=><button key={item} className={product===item?'active':''} onClick={()=>setProduct(item)}>{item}</button>)}</div>
      <div className="resource-grid">{results.map(resource=><article className="resource-card" key={resource.id}><div className="card-meta"><span>{resource.product}</span><span>{resource.level}</span></div><div className="card-icon"><BookOpen size={20}/></div><h3>{resource.title}</h3><p>{resource.description}</p><div className="card-footer"><small>{resource.source} · {resource.type}</small><a href={resource.url} target="_blank" rel="noreferrer" aria-label={`Open ${resource.title}`}><ArrowRight size={18}/></a></div></article>)}</div>
      {!results.length&&<div className="empty"><Search size={28}/><h3>No matches yet</h3><p>Clear the filter or try a broader phrase.</p><button onClick={()=>{setQuery('');setProduct('All')}}>Reset search</button></div>}
    </section>

    <section id="assistant" className="section assistant"><div className="assistant-intro"><div className="kicker light"><span></span>Source-aware guidance</div><h2>Ask a better first question.</h2><p>The assistant points you toward a practical next step and shows the sources it used. It is guidance—not a substitute for testing, security review, or Microsoft documentation.</p><div className="guardrails"><span><ShieldCheck size={17}/> 10 questions per hour in beta</span><span><ShieldCheck size={17}/> Prompts capped at 1,200 characters</span><span><ShieldCheck size={17}/> Never paste secrets or customer data</span></div></div>
      <div className="ask-card"><form onSubmit={ask}><label htmlFor="question">What are you trying to build or fix?</label><textarea id="question" rows={5} maxLength={1200} value={question} onChange={e=>setQuestion(e.target.value)} placeholder="Example: How should I structure environments and solutions for a small team moving a Dataverse app into production?"/><div className="form-row"><small>{question.length} / 1,200</small><button className="button primary" disabled={loading||!question.trim()}>{loading?'Finding a grounded answer…':<>Ask MaxPowerHub <ArrowRight size={17}/></>}</button></div></form>
        {error&&<div className="response error" role="alert">{error}</div>}
        {result&&<div className="response" role="status"><div className="response-label"><Bot size={18}/> {result.mode==='library-only'?'Library guidance':'AI answer'}</div><p>{result.answer}</p>{result.citations?.length>0&&<div className="citations"><b>Sources to verify</b>{result.citations.map((citation,index)=><a href={citation.url} target="_blank" rel="noreferrer" key={citation.id}><span>{index+1}</span><div>{citation.title}<small>{citation.source}</small></div><ExternalLink size={14}/></a>)}</div>}</div>}
      </div>
    </section>

    <section className="section consulting"><div><div className="kicker"><span></span>From idea to governed solution</div><h2>Need more than a link?</h2><p>CyberBoost helps teams plan, secure, automate, and improve real business workflows with practical Power Platform consulting.</p></div><a className="button primary" href="https://www.mycyberboost.tech" target="_blank" rel="noreferrer">Talk with CyberBoost <ArrowRight size={17}/></a></section>
    <footer><a className="brand" href="#top"><span className="brand-mark"><Sparkles size={17}/></span><span>MaxPower<b>Hub</b><small>by CyberBoost</small></span></a><p>Independent community resource. Not affiliated with or endorsed by Microsoft. Always validate guidance against current product documentation.</p><a href="https://www.mycyberboost.tech" target="_blank" rel="noreferrer">CyberBoost <ExternalLink size={13}/></a></footer>
  </main>;
}
