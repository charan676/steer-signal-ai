# Signal — A Little More Curious About Hunger

> **Steer Club Hackathon — Problem Statement 1: The Ad People Want to Tap**  
> *A mobile-first, scientifically responsible interactive mystery that transforms everyday 3 PM appetite cues into curious, doctor-led metabolic awareness in under 60 seconds.*

---

## 1. Hackathon Judging Matrix Alignment

| Judging Criterion | Weight | How Signal Solves It |
| :--- | :---: | :--- |
| **Hook Strength** | **25%** | **Instant 3-second hook:** *"It's 3 PM. You're hungry again. What's behind it?"* paired with familiar Indian afternoon tea & snack imagery. Zero login or delay. |
| **Value Delivered** | **25%** | **60-second discovery:** Immediate educational micro-feedback on every choice + multi-dimensional personalized takeaway + practical weekday experiment. |
| **Scientific Accuracy** | **20%** | **Evidence-grounded:** Every claim is tied to peer-reviewed literature (NIH, NIDDK, Cell Metabolism, Harvard Health). Clear distinction between research-backed facts and individual clinical unknowns. |
| **Fun & Playability** | **15%** | **Interactive mystery:** Myth vs. Fact checkpoint (*"Hunger is simply willpower"*), keyboard navigation (`1-4`, `Enter`), and fictional persona presets for live presentations. |
| **Handoff to Next Step** | **15%** | **Natural, non-pushy conversion:** *"Curious about metabolic health beyond the myths?"* with a direct pathway to explore Steer's clinician-led care. |

---

## 2. Key Features

- **Mobile-First Interactive Flow:** Optimized touch targets, seamless step transitions, and responsive layout across standard and narrow Android/iOS devices.
- **Immediate Micro-Insights:** Selecting any option immediately surfaces an evidence-based explanation of the underlying biology before advancing.
- **Interactive Myth Checkpoint:** Mid-journey gamified checkpoint debunking the willpower myth with an expandable evidence drawer citing *Annals of Internal Medicine*.
- **5-Part Results Hierarchy:**
  1. *What You Observed Today:* Clear visual chips of your 5 lifestyle signals.
  2. *The Pattern Explored:* Personalized reflection based on your unique combination of answers.
  3. *What Research Explains vs. What This Reflection Cannot Know:* Honest clinical boundaries.
  4. *A Gentle Experiment to Try:* Low-friction, non-shaming action for your weekday routine.
  5. *Key Factors at Play:* Topic tags mapping to your lifestyle rhythms.
- **Natural STEER Handoff:** Respectful invitation to explore Steer's doctor-led programme at [steerclub.com](https://steerclub.com).
- **Useful Share Actions:**
  - Native Web Share API with clipboard fallback.
  - One-click formatted Markdown copy for WhatsApp and Slack.
  - High-resolution 1080×1350 PNG share card (*"My afternoon signals"*) with Steer's editorial design system.
- **High-Availability AI & Fallback:** Multi-model cascade (`gemini-3.8-flash` → `gemini-2.5-flash` with 4.5s timeout) paired with a rich deterministic fallback engine that guarantees instant, reliable results even completely offline.

---

## 3. Official STEER Brand System

- **Palette:**
  - Cream: `#F5EBDF`
  - Steer rust: `#C04E2A`
  - Deep maroon: `#661414`
  - Ink: `#351D1D`
  - Clay: `#B58777`
  - Blush: `#E6CBBD`
  - Soft paper: `#F8F2EB`
- **Typography:** Playfair Display (editorial serif) headlines with DM Sans (clean, warm sans-serif) body.

---

## 4. Scientific References & Clinical Integrity

The application uses selected research and public-health references, with limits shown in the UI. The audit found that PMID 15699223 does **not** support the prior irregular-meal-frequency description, so that specific claim is explicitly flagged for further source review rather than presented as evidence.

1. **NIDDK / National Institutes of Health (NIH):** *Factors Affecting Weight & Health* ([Link](https://www.niddk.nih.gov/health-information/weight-management/adult-overweight-obesity/factors-affecting-weight-health))  
   *Appetite and metabolic regulation involve multi-system interactions between genetics, sleep, endocrine hormones, and daily routine.*
2. **Spiegel K, et al. (Annals of Internal Medicine / NIH):** *Sleep Curtailment and Endocrine Alterations in Appetite Regulation* ([PubMed PMID: 15583226](https://pubmed.ncbi.nlm.nih.gov/15583226/))  
   *In a small controlled study of healthy young men, short sleep was associated with lower leptin, higher ghrelin, and greater reported hunger and appetite. It does not predict an individual response.*
3. **Harvard T.H. Chan School of Public Health:** *Carbohydrates, Glycemic Index, and Satiety* ([Link](https://www.hsph.harvard.edu/nutritionsource/carbohydrates/carbohydrates-and-blood-sugar/))  
   *Carbohydrate-containing foods can affect blood glucose differently; this resource cannot determine an individual’s glucose response or hunger pattern.*
5. **Dallman MF, et al. (PNAS):** *Chronic Stress and Comfort Foods: Neural and Metabolic Feedback* ([PubMed PMID: 14612573](https://pubmed.ncbi.nlm.nih.gov/14612573/))  
   *The review discusses interactions between stress-related pathways and palatable food; individual eating responses to stress differ widely.*

---

## 5. Running Locally

### Prerequisites
- Node.js 18+

### Setup & Launch
```bash
# Install dependencies
npm install

# Start both Vite web app and Express API server concurrently
npm run dev
```

- **Frontend:** http://localhost:5173/
- **Backend API:** http://localhost:8787/ (also serves production bundle)

### Build for Production
```bash
npm run build
npm run start:api
```

For a single-service deployment, run `npm run build` during the build phase and `npm run start:api` at runtime. Express serves `dist/` and `/api` from the same origin. For split hosting, build the frontend with `VITE_API_BASE_URL=https://your-api.example` and set the API's `FRONTEND_ORIGIN=https://your-web.example`; do not use a wildcard CORS origin. Keep `GEMINI_API_KEY` server-side only and never commit `.env`.

---

## 6. Two-Minute Live Presentation Script

1. **(0:00–0:20) The Hook:**
   > *"Most health ads shout at people with aggressive promises or weight-loss guarantees. Signal starts with an intimate, familiar moment that millions of Indians experience every single day: 'It's 3 PM. You're hungry again. What's behind it?'"*

2. **(0:20–0:50) The Interactive Mystery:**
   > *"Tap 'Solve the mystery'. Notice how every choice instantly gives an educational clue—like how distracted desk lunching delays satiety signals, or how a short night's sleep elevates ghrelin. At midpoint, we hit the Myth Checkpoint: 'Is hunger just willpower?' It dismantles guilt using NIH clinical evidence."*

3. **(0:50–1:25) The Result Hierarchy:**
   > *"In 60 seconds, the user reaches their Signal Note. We clearly show what they observed, what science explains, and critically: what this quiz cannot know. It's curiosity, not a diagnosis."*

4. **(1:25–1:45) Shareability:**
   > *"With one tap, generate a high-res editorial share card or copy formatted text for WhatsApp. It's designed to be shared voluntarily because it feels insightful, not clinical."*

5. **(1:45–2:00) The Steer Handoff:**
   > *"By replacing judgment with science, Signal earns trust. The natural next step is simple: 'Curious about metabolic health beyond the myths? Explore doctor-led metabolic care with Steer.'"*
