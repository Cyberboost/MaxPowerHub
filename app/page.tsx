'use client';
import {useEffect, useMemo, useState} from 'react';
import {ArrowRight, BookOpen, Bot, Check, ExternalLink, Search, ShieldCheck, Sparkles, SlidersHorizontal, Share2, Wrench} from 'lucide-react';
import {findRelevantResources, levels, libraryReviewedOn, products, resources, rolePathways, roles, searchResources, tasks} from '../lib/resources';

type Citation = {id:string; title:string; url:string; source:string};
type AssistantResult = {answer:string; citations:Citation[]; mode?:string};
type Assessment = {experience:string; data:string; logic:string; audience:string};

const assessmentQuestions = [
  {key:'experience',label:'Primary user experience',options:['Task-focused custom interface','Data-centric business process','External website','Conversational agent']},
  {key:'data',label:'Primary data need',options:['Dataverse business data','Existing Microsoft 365 data','Multiple enterprise systems','Public or customer-facing data']},
  {key:'logic',label:'Where should complex logic run?',options:['Inside the app','Automated cloud workflow','Server-side transaction','Custom API or Azure service']},
  {key:'audience',label:'Primary audience',options:['Internal employees','Specialized operational team','Partners or customers','Broad self-service audience']},
] as const;

function assessmentRecommendation(a:Assessment) {
  if(a.experience==='Conversational agent') return {pattern:'Copilot Studio agent with governed actions',why:'The conversational experience is primary. Keep business actions behind authenticated connectors or flows and define escalation paths.',query:'copilot architecture governance connectors security'};
  if(a.experience==='External website'||a.audience==='Partners or customers') return {pattern:'Power Pages with Dataverse',why:'The workload serves external identities. Design table permissions, web roles, authentication, and data exposure before implementation.',query:'power pages security dataverse authentication architecture'};
  if(a.experience==='Data-centric business process') return {pattern:'Model-driven app with Dataverse',why:'A process-centered workload benefits from Dataverse security, forms, views, business rules, and solution-aware ALM.',query:'model-driven dataverse security solutions alm'};
  if(a.logic==='Server-side transaction') return {pattern:'Power Apps with a Dataverse plug-in or custom API',why:'Transactional rules should be enforced server-side so every client and integration receives consistent behavior.',query:'power apps dataverse plugins api security'};
  if(a.logic==='Custom API or Azure service'||a.data==='Multiple enterprise systems') return {pattern:'Power Apps with a custom connector and API layer',why:'An integration boundary keeps credentials and complex orchestration out of the client while supporting reuse and monitoring.',query:'power apps custom connectors api integration architecture'};
  return {pattern:'Canvas app with Power Automate',why:'A task-focused internal experience with workflow automation is a strong low-code starting point. Validate delegation, connector limits, and ALM early.',query:'canvas power automate connectors delegation alm'};
}

export default function Home() {
  const [query,setQuery] = useState('');
  const [product,setProduct] = useState('All');
  const [role,setRole] = useState('All roles');
  const [task,setTask] = useState('All tasks');
  const [level,setLevel] = useState('All levels');
  const [question,setQuestion] = useState('');
  const [result,setResult] = useState<AssistantResult|null>(null);
  const [error,setError] = useState('');
  const [loading,setLoading] = useState(false);
  const [assessment,setAssessment] = useState<Assessment>({experience:'',data:'',logic:'',audience:''});
  const recommendation = Object.values(assessment).every(Boolean) ? assessmentRecommendation(assessment) : null;
  const results = useMemo(() => searchResources(query,{product,role,task,level}), [query,product,role,task,level]);
  const activeFilters = [product!=='All',role!=='All roles',task!=='All tasks',level!=='All levels'].filter(Boolean).length;

  useEffect(()=>{
    const params = new URLSearchParams(window.location.search);
    if (params.get('q')) setQuery(params.get('q')!);
    if (params.get('product')) setProduct(params.get('product')!);
    if (params.get('role')) setRole(params.get('role')!);
    if (params.get('task')) setTask(params.get('task')!);
    if (params.get('level')) setLevel(params.get('level')!);
  },[]);

  function shareSearch() {
    const params = new URLSearchParams();
    if(query) params.set('q',query); if(product!=='All') params.set('product',product);
    if(role!=='All roles') params.set('role',role); if(task!=='All tasks') params.set('task',task); if(level!=='All levels') params.set('level',level);
    const url = `${window.location.origin}${window.location.pathname}${params.size?`?${params}`:''}#library`;
    navigator.clipboard?.writeText(url); window.history.replaceState({},'',url);
  }

  function resetSearch(){setQuery('');setProduct('All');setRole('All roles');setTask('All tasks');setLevel('All levels');}

  function applyPathway(pathway:{role:string;query:string}) { setRole(pathway.role);setQuery(pathway.query);setProduct('All');setTask('All tasks');setLevel('All levels');document.querySelector('#library')?.scrollIntoView(); }

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
    <header className="site-header"><a className="brand" href="#top" aria-label="MaxPowerHub home"><span className="brand-mark"><Sparkles size={19}/></span><span>MaxPower<b>Hub</b><small>by CyberBoost</small></span></a><nav aria-label="Primary navigation"><a href="#chatgpt">ChatGPT plugin</a><a href="#library">Library</a><a href="#architect">Pattern guide</a><a href="/updates/">Updates</a><a href="/about/">About</a><a className="nav-cta" href="https://www.mycyberboost.tech" target="_blank" rel="noreferrer">Work with CyberBoost <ExternalLink size={14}/></a></nav></header>

    <section id="top" className="hero"><div className="hero-copy"><div className="kicker"><span></span>Independent Power Platform field guide</div><h1>Find the right path.<br/><em>Build with confidence.</em></h1><p className="hero-lede">A curated library and source-first guide for makers, developers, and teams working across Microsoft Power Platform.</p><div className="hero-actions"><a className="button primary" href="#library">Explore the library <ArrowRight size={17}/></a><a className="button quiet" href="#assistant"><BookOpen size={17}/> Use the source guide</a></div><div className="trust-row"><span><Check size={15}/> Official sources first</span><span><Check size={15}/> No account required</span><span><Check size={15}/> Human review still matters</span></div></div>
      <div className="hero-panel" aria-label="Featured learning path"><div className="panel-label">Suggested path · New solution</div><div className="path-step"><span>01</span><div><b>Frame the workload</b><small>Users, data, risk, and outcomes</small></div></div><div className="path-line"></div><div className="path-step"><span>02</span><div><b>Choose the right product</b><small>Apps, automation, analytics, or agents</small></div></div><div className="path-line"></div><div className="path-step"><span>03</span><div><b>Design for operations</b><small>Security, ALM, governance, and support</small></div></div><a href="#library">Browse architecture resources <ArrowRight size={15}/></a></div>
    </section>

    <section id="chatgpt" className="section plugin-launch">
      <div className="plugin-launch-copy"><div className="launch-badge"><Bot size={15}/> New · MaxPowerHub AI for ChatGPT</div><div className="kicker"><span></span>Your Power Platform copilot</div><h2>Move from question to <em>clear next step.</em></h2><p className="launch-lede">Bring MaxPowerHub AI into ChatGPT and get focused, source-aware support for Microsoft Power Platform—right where ideas, architecture decisions, and troubleshooting conversations already happen.</p><div className="launch-actions"><a className="button primary" href="https://chatgpt.com/plugins/plugins_6aed8dd43d7c8191a8795e60178e16ba" target="_blank" rel="noreferrer">Open MaxPowerHub AI <ExternalLink size={16}/></a><a className="button quiet" href="#plugin-how">See how it works <ArrowRight size={16}/></a></div><small className="access-note"><ShieldCheck size={14}/> Private launch · Available to authorized plugin users</small></div>
      <div className="plugin-console" aria-label="MaxPowerHub AI example"><div className="console-top"><span><i></i><i></i><i></i></span><b>MaxPowerHub AI</b><small>Connected</small></div><div className="console-prompt"><small>You</small><p>What implementation pattern should we use for a secure external intake process?</p></div><div className="console-answer"><span className="console-icon"><Sparkles size={16}/></span><div><small>MaxPowerHub AI</small><p>Start with Power Pages and Dataverse. Define authentication, table permissions, web roles, and data exposure before implementation.</p><div><span>Pattern recommendation</span><span>Security considerations</span><span>Sources to verify</span></div></div></div></div>
      <div id="plugin-how" className="plugin-capabilities"><article><Search size={20}/><h3>Find trusted resources</h3><p>Search curated Power Platform guidance without breaking your ChatGPT workflow.</p></article><article><BookOpen size={20}/><h3>Open the right source</h3><p>Retrieve focused resource details so recommendations stay grounded and reviewable.</p></article><article><Wrench size={20}/><h3>Choose a pattern</h3><p>Turn workload requirements into a practical implementation starting point.</p></article><article><ShieldCheck size={20}/><h3>Troubleshoot with context</h3><p>Structure symptoms, likely causes, checks, and safer next actions.</p></article></div>
      <div className="prompt-starters"><b>Try asking</b><span>“Recommend a pattern for this workflow.”</span><span>“Help me troubleshoot this Power Automate failure.”</span><span>“Find the best source for Dataverse security.”</span></div>
    </section>

    <section className="proof-strip" aria-label="Library overview"><div><strong>{resources.length}</strong><span>curated starting points</span></div><div><strong>{resources.filter(r=>r.source==='Microsoft Learn').length}</strong><span>Microsoft Learn links</span></div><div><strong>{products.length-1}</strong><span>product areas</span></div><div><strong>Free</strong><span>public beta library</span></div></section>

    <section className="section pathways"><div className="section-heading"><div><div className="kicker"><span></span>Role-based pathways</div><h2>Start from the work you do.</h2><p>Open a focused collection instead of translating your job into product terminology.</p></div></div><div className="pathway-grid">{rolePathways.map(pathway=><button key={pathway.role} onClick={()=>applyPathway(pathway)}><small>{pathway.role}</small><h3>{pathway.title}</h3><p>{pathway.description}</p><span>Open pathway <ArrowRight size={15}/></span></button>)}</div></section>

    <section id="library" className="section library"><div className="section-heading"><div><div className="kicker"><span></span>Curated knowledge</div><h2>Start with sources you can verify.</h2><p>Search official documentation and established community projects by product, task, or technology.</p></div><div className="source-note"><ShieldCheck size={21}/><span><b>Reviewed {libraryReviewedOn}</b>Official Microsoft guidance is prioritized. Community resources are clearly labeled.</span></div></div>
      <label className="search-box"><Search size={21}/><span className="sr-only">Search resources</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Try “Dataverse security”, “Power Fx”, or “ALM”"/><kbd>{results.length} results</kbd></label>
      <div className="filters" role="group" aria-label="Filter by product">{products.map(item=><button key={item} className={product===item?'active':''} onClick={()=>setProduct(item)}>{item}</button>)}</div>
      <div className="advanced-filters"><div><SlidersHorizontal size={17}/><b>Refine</b><span>{activeFilters?`${activeFilters} active`:'Optional'}</span></div><label>Role<select value={role} onChange={e=>setRole(e.target.value)}>{roles.map(item=><option key={item}>{item}</option>)}</select></label><label>Task<select value={task} onChange={e=>setTask(e.target.value)}>{tasks.map(item=><option key={item}>{item}</option>)}</select></label><label>Level<select value={level} onChange={e=>setLevel(e.target.value)}>{levels.map(item=><option key={item}>{item}</option>)}</select></label><button onClick={shareSearch}><Share2 size={15}/> Copy search link</button>{(query||activeFilters>0)&&<button className="reset-link" onClick={resetSearch}>Reset</button>}</div>
      <div className="resource-grid">{results.map(resource=><article className="resource-card" key={resource.id}><div className="card-meta"><span>{resource.product}</span><span>{resource.level}</span></div><div className="card-icon"><BookOpen size={20}/></div><h3>{resource.title}</h3><p>{resource.description}</p>{query&&resource.reasons.length>0&&<div className="match-reason">Matched {resource.reasons.slice(0,3).join(', ')}</div>}<div className="card-tags">{resource.tasks.slice(0,2).map(item=><span key={item}>{item}</span>)}{resource.roles.slice(0,1).map(item=><span key={item}>{item}</span>)}</div><div className="card-footer"><small>{resource.source} · {resource.type}</small><a href={resource.url} target="_blank" rel="noreferrer" aria-label={`Open ${resource.title}`}><ArrowRight size={18}/></a></div></article>)}</div>
      {!results.length&&<div className="empty"><Search size={28}/><h3>No matches yet</h3><p>Clear a filter or try a broader description of the task.</p><button onClick={resetSearch}>Reset search</button></div>}
    </section>

    <section id="architect" className="section architect"><div className="architect-intro"><div className="kicker light"><span></span>Implementation pattern guide</div><h2>Choose a pattern before a product.</h2><p>Answer four questions to get a transparent starting recommendation. This is design guidance—not a substitute for security, licensing, capacity, or integration validation.</p></div><div className="assessment-card">{assessmentQuestions.map((item,index)=><fieldset key={item.key}><legend><span>{index+1}</span>{item.label}</legend><div>{item.options.map(option=><button type="button" className={assessment[item.key]===option?'selected':''} key={option} onClick={()=>setAssessment(current=>({...current,[item.key]:option}))}>{option}</button>)}</div></fieldset>)}{recommendation&&<div className="recommendation" role="status"><div><Wrench size={18}/> Recommended starting pattern</div><h3>{recommendation.pattern}</h3><p>{recommendation.why}</p><button className="button primary" onClick={()=>{setQuery(recommendation.query);setRole('Architect');setTask('All tasks');setProduct('All');document.querySelector('#library')?.scrollIntoView()}}>View supporting sources <ArrowRight size={16}/></button></div>}</div></section>

    <section id="assistant" className="section assistant"><div className="assistant-intro"><div className="kicker light"><span></span>Source guide</div><h2>Ask a better first question.</h2><p>Describe the problem and MaxPowerHub will match it to curated documentation. This preview does not generate AI answers or send your question to an external service.</p><div className="guardrails"><span><ShieldCheck size={17}/> Source matching runs in your browser</span><span><ShieldCheck size={17}/> No account or prompt storage</span><span><ShieldCheck size={17}/> AI guidance is coming after safety controls</span></div></div>
      <div className="ask-card"><form onSubmit={ask}><label htmlFor="question">What are you trying to build or fix?</label><textarea id="question" rows={5} maxLength={1200} value={question} onChange={e=>setQuestion(e.target.value)} placeholder="Example: How should I structure environments and solutions for a small team moving a Dataverse app into production?"/><div className="form-row"><small>{question.length} / 1,200</small><button className="button primary" disabled={loading||!question.trim()}>{loading?'Finding a grounded answer…':<>Ask MaxPowerHub <ArrowRight size={17}/></>}</button></div></form>
        {error&&<div className="response error" role="alert">{error}</div>}
        {result&&<div className="response" role="status"><div className="response-label"><Bot size={18}/> {result.mode==='library-only'?'Library guidance':'AI answer'}</div><p>{result.answer}</p>{result.citations?.length>0&&<div className="citations"><b>Sources to verify</b>{result.citations.map((citation,index)=><a href={citation.url} target="_blank" rel="noreferrer" key={citation.id}><span>{index+1}</span><div>{citation.title}<small>{citation.source}</small></div><ExternalLink size={14}/></a>)}</div>}</div>}
      </div>
    </section>

    <section className="section consulting"><div><div className="kicker"><span></span>From idea to governed solution</div><h2>Need more than a link?</h2><p>CyberBoost helps teams plan, secure, automate, and improve real business workflows with practical Power Platform consulting.</p></div><a className="button primary" href="https://www.mycyberboost.tech" target="_blank" rel="noreferrer">Talk with CyberBoost <ArrowRight size={17}/></a></section>
    <footer><a className="brand" href="#top"><span className="brand-mark"><Sparkles size={17}/></span><span>MaxPower<b>Hub</b><small>by CyberBoost</small></span></a><p>Independent community resource. Not affiliated with or endorsed by Microsoft. Always validate guidance against current product documentation.</p><div className="footer-links"><a href="/updates/">Updates</a><a href="/about/">About</a><a href="/support/">Support</a><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a><a href="/submit/">Submit a resource</a></div></footer>
  </main>;
}
