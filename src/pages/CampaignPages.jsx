import React, { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Bookmark, Check, Eye, Heart, Play, Sparkles } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { SiteNav } from '../components/ExperienceKit';

const audiences = [
  { id: 'food', label: 'Food & everyday rituals', hook: 'A familiar afternoon. One curious question.', creative: '3 PM Mystery', route: '/signal' },
  { id: 'puzzles', label: 'Puzzles & mysteries', hook: 'Can you spot the missing detail?', creative: 'Missing Clue', route: '/games/missing-clue?challenge=fresh' },
  { id: 'stories', label: 'Stories & reflection', hook: 'One moment. Several possible stories.', creative: 'Predict the Twist', route: '/games/predict?challenge=fresh' },
  { id: 'patterns', label: 'Patterns & challenges', hook: 'Follow the signal at your own pace.', creative: 'Signal Rush', route: '/games/signal-rush?challenge=fresh' },
  { id: 'curiosity', label: 'Everyday curiosity', hook: 'Three clues. No instant conclusions.', creative: 'Case File', route: '/games/case-file?challenge=fresh' },
  { id: 'science', label: 'Science & learning', hook: 'Meet the systems working within you.', creative: 'Metabolism', route: '/learn/metabolism?challenge=basics' },
  { id: 'health', label: 'Metabolic-health education', hook: 'A question before a recommendation.', creative: 'Signal + context', route: '/signal' },
];

const concepts = [
  { id: 'hook', label: 'The five-second question', body: 'A short, sound-off invitation that leads to a real local experience.', route: '/signal' },
  { id: 'observe', label: 'The observation game', body: 'A simple visual challenge with a useful non-clinical takeaway.', route: '/games/missing-clue?challenge=fresh' },
  { id: 'learn', label: 'The learning bridge', body: 'A playful start that opens into careful education and an optional handoff.', route: '/learn/metabolism?challenge=basics' },
];

export function CampaignStudio() {
  const [params, setParams] = useSearchParams();
  const profile = audiences.find(item => item.id === params.get('audience')) ?? audiences[0];
  const [selected, setSelected] = useState(profile.id);
  const choose = (id) => { setSelected(id); setParams({ audience: id }); };
  const active = audiences.find(item => item.id === selected) ?? audiences[0];
  return <><SiteNav /><main id="main-content" className="campaign-page view-enter"><div className="campaign-crumb"><Link className="text-btn" to="/demo"><ArrowLeft size={16} /> Guided demo</Link><span>FICTIONAL CAMPAIGN STUDIO</span></div><section className="campaign-hero"><span className="eyebrow">CAMPAIGN OVERVIEW · SIMULATION</span><h1>Many ways in.<br /><em>One careful discovery.</em></h1><p>Explore how a fictional audience choice changes the invitation and destination. This is not live advertising, targeting, analytics, or access to personal data.</p><div className="simulation-banner"><Eye size={18} /><span>All profiles, hooks, and activity below are invented demonstration data.</span></div></section><section className="audience-section" aria-labelledby="audience-heading"><div className="section-heading"><span className="card-index">01 / AUDIENCE EXAMPLES</span><h2 id="audience-heading">Choose a fictional starting point.</h2></div><div className="audience-tabs" role="group" aria-label="Fictional audience profiles">{audiences.map(item => <button key={item.id} className={active.id === item.id ? 'active' : ''} aria-pressed={active.id === item.id} onClick={() => choose(item.id)}>{item.label}</button>)}</div><div className="campaign-preview"><div className="preview-art"><Sparkles size={28} /><span>SIMULATED PREVIEW</span><strong>{active.creative}</strong></div><div><span className="eyebrow">{active.label}</span><h3>{active.hook}</h3><p>The profile only changes this fictional creative framing. It does not infer anything about a real person.</p><Link className="primary-btn" to={active.route}>Open the real experience <ArrowRight size={17} /></Link></div></div></section><section className="concepts-section" aria-labelledby="concept-heading"><div className="section-heading"><span className="card-index">02 / CREATIVE CONCEPTS</span><h2 id="concept-heading">Playable previews, not ad claims.</h2></div><div className="concept-grid">{concepts.map(concept => <article className="concept-card" key={concept.id}><span className="concept-number">0{concepts.indexOf(concept) + 1}</span><h3>{concept.label}</h3><p>{concept.body}</p><Link className="text-btn" to={concept.route}>Preview <ArrowRight size={15} /></Link></article>)}</div></section><section className="campaign-next"><div><span className="card-index">03 / FICTIONAL FEED</span><h2>See the ideas in context.</h2><p>Scroll through a local-only, sound-off feed with real links to these experiences.</p></div><Link className="primary-btn" to={`/demo/reels?audience=${active.id}`}>Open simulated Reels <Play size={17} /></Link></section></main></>;
}

const feedItems = [
  { kind: 'organic', title: 'A fictional creator notices an afternoon ritual.', tag: 'FICTIONAL CREATOR' },
  { kind: 'organic', title: 'A small question can change how a moment feels.', tag: 'ORIGINAL ILLUSTRATION' },
  { kind: 'sponsored', concept: 0 },
  { kind: 'organic', title: 'No real likes, followers, or activity live here.', tag: 'SIMULATED FEED' },
  { kind: 'sponsored', concept: 1 },
];

export function ReelsSimulator() {
  const [params] = useSearchParams();
  const audience = audiences.find(item => item.id === params.get('audience')) ?? audiences[0];
  const [active, setActive] = useState(0); const [liked, setLiked] = useState([]); const [saved, setSaved] = useState([]);
  const item = feedItems[active]; const concept = item.kind === 'sponsored' ? concepts[item.concept] : null;
  return <main id="main-content" className="reels-page"><header className="reels-header"><div><Link className="text-btn" to="/demo/campaign"><ArrowLeft size={16} /> Campaign studio</Link><span className="nav-brand">steer<span>.</span> <small>signal</small></span></div><span className="simulation-pill"><Eye size={13} /> SIMULATED REELS · LOCAL ONLY</span></header><div className="reels-controls"><span>Audience example: <strong>{audience.label}</strong></span><span>Sound off · no Meta connection</span></div><section className="reels-rail" aria-label="Fictional scrollable Reels feed" tabIndex="0" onKeyDown={event => { if (event.key === 'ArrowDown') setActive(value => Math.min(feedItems.length - 1, value + 1)); if (event.key === 'ArrowUp') setActive(value => Math.max(0, value - 1)); }}><article className="reel-frame"><div className="reel-inner"><span className="eyebrow">{item.tag ?? 'SPONSORED CHALLENGE'}</span>{concept ? <><h1>{concept.label}</h1><p>{audience.hook}</p><div className="reel-art"><Sparkles size={50} /><span>PLAYABLE PREVIEW</span></div><Link className="primary-btn" to={concept.route}>Play this experience <ArrowRight size={17} /></Link></> : <><h1>{item.title}</h1><div className="organic-art" aria-hidden="true">✳</div><p>Illustrated for this prototype. Any likes or saves below exist only in this browser session.</p></>}<div className="reel-actions"><button aria-label={liked.includes(active) ? 'Unlike this fictional Reel' : 'Like this fictional Reel'} aria-pressed={liked.includes(active)} onClick={() => setLiked(values => values.includes(active) ? values.filter(value => value !== active) : [...values, active])}><Heart fill={liked.includes(active) ? 'currentColor' : 'none'} /></button><button aria-label={saved.includes(active) ? 'Unsave this fictional Reel' : 'Save this fictional Reel'} aria-pressed={saved.includes(active)} onClick={() => setSaved(values => values.includes(active) ? values.filter(value => value !== active) : [...values, active])}><Bookmark fill={saved.includes(active) ? 'currentColor' : 'none'} /></button><span>{liked.includes(active) || saved.includes(active) ? 'Saved or liked in this demo only.' : 'No real engagement is recorded.'}</span></div></div></article></section><nav className="reel-nav" aria-label="Reel navigation"><button disabled={active === 0} onClick={() => setActive(value => Math.max(0, value - 1))} aria-label="Previous Reel">↑</button><span role="status">{active + 1} / {feedItems.length}</span><button disabled={active === feedItems.length - 1} onClick={() => setActive(value => Math.min(feedItems.length - 1, value + 1))} aria-label="Next Reel">↓</button></nav></main>;
}
