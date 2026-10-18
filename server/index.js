import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, '../dist');

// Load environment variables from .env if present
try {
  process.loadEnvFile?.();
} catch {
  // Gracefully continue if .env does not exist
}

const app = express();
app.use(express.json({ limit: '32kb' }));
const PORT = process.env.PORT || 8787;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN;

// Same-origin requests need no CORS. Set FRONTEND_ORIGIN only when deploying
// the web app separately, rather than allowing arbitrary origins.
app.use((req, res, next) => {
  if (FRONTEND_ORIGIN && req.headers.origin === FRONTEND_ORIGIN) {
    res.setHeader('Access-Control-Allow-Origin', FRONTEND_ORIGIN);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});


const safeFallback = (profile) => {
  const themes = profile?.themes || [];
  const primaryTheme = themes[0] || 'routine';
  const secondaryTheme = themes[1] || 'meals';

  const themeInsights = {
    sleep: {
      headline: 'Sleep Cadence & Appetite Signaling',
      summary: 'Sleep and circadian rhythm are among the factors that can influence appetite. This reflection cannot identify why you feel hungry or tired on a particular day.',
      whatScienceExplains: 'In a small controlled study of healthy young men, short sleep was associated with lower leptin, higher ghrelin, and greater reported hunger and appetite. It does not predict an individual response.',
      whatRemainsUncertain: 'A brief questionnaire cannot determine individual hormonal baseline levels, clinical sleep debt, or exact metabolic markers.',
      nextStep: 'For the next 3 days, simply note roughly how many hours you slept whenever an afternoon craving arrives.'
    },
    routine: {
      headline: 'The Rhythm of Your Daily Schedule',
      summary: 'Meal timing, work demands, and routines can shape how people experience hunger. This reflection cannot identify the cause of your afternoon appetite.',
      whatScienceExplains: 'Meal-timing and circadian research suggests that timing can matter for metabolic processes, but the cited irregular-meal claim requires further source review before making it more specific.',
      whatRemainsUncertain: 'Daily habits interact with countless individual factors that a short reflection cannot isolate or clinically verify.',
      nextStep: 'Try establishing one consistent daytime anchor—such as a dedicated 15-minute uninterrupted lunch window.'
    },
    movement: {
      headline: 'Physical Stasis & Energy Regulation',
      summary: 'Sitting and movement patterns are one part of a day. This reflection cannot establish whether they explain your energy or appetite.',
      whatScienceExplains: 'An acute laboratory study found that brief, regular light-activity breaks reduced post-meal glucose and insulin responses compared with uninterrupted sitting. It was not a study of cravings or treatment.',
      whatRemainsUncertain: 'Movement varies across days, and activity alone does not account for overall metabolic expenditure or nutritional needs.',
      nextStep: 'Experiment with a 3-minute walking break before reaching for an afternoon tea snack.'
    },
    stress: {
      headline: 'Emotional Context & Energy Demands',
      summary: 'Stress can influence eating for some people, but responses differ widely. Recognizing context can foster compassion without assuming a biological cause.',
      whatScienceExplains: 'A review discusses interactions between stress-related pathways and palatable food; it does not show that stress or cortisol is driving a particular person’s snack choice.',
      whatRemainsUncertain: 'Subjective stress is multifaceted; self-reported tension cannot reveal cortisol curves or individual neurochemistry.',
      nextStep: 'When an urge hits, pause for 3 deep breaths and ask: "Am I seeking physical fuel, or a mental pause from work?"'
    },
    meals: {
      headline: 'Meal Composition & Satiety Pacing',
      summary: 'Meal composition can be one factor in fullness after lunch, alongside timing, sleep, activity, medication, and many other factors. This reflection cannot identify your cause of hunger.',
      whatScienceExplains: 'Nutrition research describes how meal composition can affect post-meal metabolism and appetite-related signals. Individual glucose and satiety responses vary and cannot be inferred here.',
      whatRemainsUncertain: 'Personal glycemic responses to Indian staples (rice, roti, dal) vary widely based on gut microbiota and insulin sensitivity.',
      nextStep: 'Notice whether adding a handful of roasted chana, nuts, or curd to lunch changes your 3 PM satiety.'
    }
  };

  const primary = themeInsights[primaryTheme] || themeInsights.routine;
  const secondary = themeInsights[secondaryTheme] || themeInsights.meals;

  return {
    headline: primary.headline,
    summary: primary.summary,
    whatScienceExplains: primary.whatScienceExplains,
    whatRemainsUncertain: primary.whatRemainsUncertain,
    nextStep: secondary.nextStep,
    mode: 'guided insight'
  };
};

const CANDIDATE_MODELS = [GEMINI_MODEL];

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'Signal insight API', models: CANDIDATE_MODELS }));

app.post('/api/insight', async (req, res) => {
  const body = req.body || {};
  const profile = {
    themes: Array.isArray(body.themes) ? body.themes.filter(value => typeof value === 'string').slice(0, 5) : [],
    answers: Array.isArray(body.answers) ? body.answers.slice(0, 5) : []
  };
  const fallback = safeFallback(profile);

  if (!process.env.GEMINI_API_KEY) {
    return res.json({ ...fallback, mode: 'guided insight · offline-safe' });
  }

  try {
    const prompt = `You are a cautious health-education writing assistant for Steer, an Indian doctor-led metabolic health company. Based ONLY on the provided non-sensitive quiz signals, write a short educational reflection. Never diagnose, infer disease, recommend medicines, promise weight loss, or claim certainty about why a person is hungry. Use warm, non-shaming language. Explain that multiple biological factors influence appetite, not a lack of willpower. Do not invent statistics. Return ONLY valid JSON with keys: headline, summary, whatScienceExplains, whatRemainsUncertain, nextStep. Each value max 45 words. Themes: ${JSON.stringify(profile.themes || [])}. Context choices: ${JSON.stringify(profile.answers || [])}.`;
    
    let response = null;
    let usedModel = CANDIDATE_MODELS[0];

    for (const model of CANDIDATE_MODELS) {
      try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(process.env.GEMINI_API_KEY)}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: AbortSignal.timeout(4500),
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: 'application/json', temperature: 0.35 }
          })
        });


        if (res.ok) {
          response = res;
          usedModel = model;
          break;
        } else {
          const errText = await res.text();
          console.warn(`[Gemini API] Model ${model} returned HTTP ${res.status}: ${errText.slice(0, 120)}... trying backup...`);
        }
      } catch (callErr) {
        console.warn(`[Gemini API] Network exception with ${model}:`, callErr.message);
      }
    }

    if (!response) {
      throw new Error('All AI model candidates unavailable');
    }

    const data = await response.json();
    const raw = data?.candidates?.[0]?.content?.parts?.map(p => p.text || '').join('') || '';
    
    let parsed;
    try {
      parsed = JSON.parse(raw.trim());
    } catch {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (jsonMatch) parsed = JSON.parse(jsonMatch[0]);
      else throw new Error('Could not parse AI response');
    }

    const clean = key => typeof parsed[key] === 'string' && parsed[key].trim() ? parsed[key].trim().slice(0, 350) : fallback[key];
    res.json({
      headline: clean('headline'),
      summary: clean('summary'),
      whatScienceExplains: clean('whatScienceExplains'),
      whatRemainsUncertain: clean('whatRemainsUncertain'),
      nextStep: clean('nextStep'),
      mode: 'AI-assisted · educational only'
    });
  } catch (err) {
    console.warn('[Insight API Fallback]', err.message);
    res.json({ ...fallback, mode: 'guided insight · safe fallback' });
  }
});

// Serve frontend static assets from dist if built, otherwise redirect to Vite dev server
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  app.get('/', (_req, res) => {
    res.redirect('http://localhost:5173/');
  });
}

const server = app.listen(PORT, () => console.log(`Signal API listening on http://localhost:${PORT} [model: ${GEMINI_MODEL}]`));


// Graceful cleanup for port release on restart/exit
const shutdown = () => {
  server.close(() => process.exit(0));
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
