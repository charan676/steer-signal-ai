import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Copy, ExternalLink, RotateCcw, Share2, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { trackEvent } from '../utils/events';

export function SkipLink() {
  return <a className="skip-link" href="#main-content">Skip to content</a>;
}

export function SiteNav() {
  return <nav className="site-nav" aria-label="Primary navigation">
    <Link to="/" className="nav-brand">steer<span>.</span> <small>signal</small></Link>
    <div><Link to="/">Discover</Link><Link to="/signal">3 PM mystery</Link><Link to="/learn/metabolism">Learn</Link><Link to="/demo">Demo</Link></div>
  </nav>;
}

export function ExperienceShell({ title, eyebrow = 'A SMALL DISCOVERY', step, total, children }) {
  const panel = useRef(null);
  useEffect(() => { panel.current?.focus({ preventScroll: true }); }, [step, title]);
  return <><SiteNav /><main id="main-content" className="experience-page"><div className="experience-topline"><Link to="/" className="text-btn"><ArrowLeft size={16} /> Discover</Link><span>{eyebrow}</span></div><div className="experience-heading"><h1>{title}</h1>{typeof step === 'number' && <Progress step={step} total={total} />}</div><section className="experience-panel view-enter" ref={panel} tabIndex="-1">{children}</section></main></>;
}

export function Progress({ step, total = 4 }) {
  return <div className="game-progress" role="progressbar" aria-label="Experience progress" aria-valuemin="1" aria-valuemax={total} aria-valuenow={Math.min(step + 1, total)}>{Array.from({ length: total }, (_, index) => <span key={index} className={index <= step ? 'done' : ''}>{index + 1}</span>)}</div>;
}

export function Feedback({ title, children, onContinue, label = 'Continue' }) {
  return <div className="game-feedback" role="status" aria-live="polite"><Sparkles size={18} className="rust" /><div><strong>{title}</strong><p>{children}</p>{onContinue && <button className="primary-btn" onClick={onContinue}>{label} <ArrowRight size={16} /></button>}</div></div>;
}

export function ScienceReveal({ title = 'A useful distinction', children, onContinue }) {
  return <section className="science-reveal-card"><span className="card-index">EDUCATIONAL NOTE</span><h2>{title}</h2><p>{children}</p><p className="science-caveat">This is general education, not a diagnosis, measurement, or medical assessment.</p><button className="primary-btn" onClick={onContinue}>Keep this idea <ArrowRight size={16} /></button></section>;
}

export function ShareChallenge({ path, experience, label = 'Challenge a friend' }) {
  const [status, setStatus] = useState('');
  const url = new URL(path, window.location.origin).href;
  async function share() {
    trackEvent('challenge_share_clicked', experience);
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Steer Signal challenge', text: 'Try this fresh curiosity challenge.', url });
        setStatus('Shared a fresh-start link.');
        return;
      }
    } catch (error) {
      if (error?.name === 'AbortError') { setStatus('Sharing cancelled. Your fresh link is still here.'); return; }
    }
    try { await navigator.clipboard.writeText(url); setStatus('Fresh-start link copied.'); }
    catch { setStatus('Copy this fresh-start link:'); }
  }
  return <div className="share-challenge"><p>Sharing starts a new playthrough. It never includes your choices.</p><button className="secondary-btn" onClick={share}><Share2 size={16} /> {label}</button>{status && <p role="status">{status}</p>}{status.startsWith('Copy') && <label className="manual-share"><Copy size={15} /><span className="sr-only">Fresh challenge URL</span><input readOnly value={url} onFocus={event => event.currentTarget.select()} /></label>}</div>;
}

export function Completion({ experience, title, takeaway, onReplay, sharePath, children }) {
  useEffect(() => { trackEvent('experience_completed', experience); }, [experience]);
  return <section className="game-completion"><span className="completion-star">✳</span><span className="card-index">COMPLETE</span><h2>{title}</h2><p>{takeaway}</p>{children}<div className="completion-actions"><button className="text-btn" onClick={() => { trackEvent('replay_clicked', experience); onReplay(); }}><RotateCcw size={16} /> Play again</button><Link className="text-btn" to="/"><ArrowLeft size={16} /> More discoveries</Link></div><ShareChallenge path={sharePath} experience={experience} /><a className="conversion-link" href="https://steerclub.com" target="_blank" rel="noreferrer" onClick={() => trackEvent('steer_cta_clicked', experience)}>Explore Steer <ExternalLink size={16} /></a></section>;
}

export function ChoiceGrid({ choices, selected, onChoose, label }) {
  return <div className="mini-choice-grid" role="group" aria-label={label}>{choices.map((choice, index) => <button key={choice.label} className={`option-card ${selected === index ? 'selected' : ''}`} onClick={() => onChoose(index)} disabled={selected !== null}><span className="key-shortcut">{index + 1}</span><span className="option-text"><strong>{choice.label}</strong><small>{choice.detail}</small></span>{selected === index && <Check className="rust" size={18} />}</button>)}</div>;
}
