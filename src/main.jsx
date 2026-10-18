import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronRight, Clock3,
  Heart, Info, Leaf, RotateCcw, Share2, Sparkles, Sun, Moon,
  Coffee, Brain, Footprints, Utensils, Download, Copy, Zap,
  Compass, ShieldCheck, HelpCircle, CheckCircle2, XCircle,
  BookOpen, ExternalLink, AlertCircle
} from 'lucide-react';
import './styles.css';
import { AppErrorBoundary, CaseFile, DemoPage, DiscoveryHub, MetabolismLearning, MissingClue, NotFound, PredictTwist, SignalRush } from './pages/PlatformPages';
import { CampaignStudio, ReelsSimulator } from './pages/CampaignPages';
import { SkipLink } from './components/ExperienceKit';

// Selected research and public-health references. Each claim is deliberately
// limited to the scope of the linked source; not every source has been
// independently re-checked in this prototype.
export const verifiedEvidence = {
  postLunchDip: {
    source: 'Monk TH (2005)',
    journal: 'Sleep Medicine Reviews',
    title: 'The post-lunch dip in performance and alertness',
    url: 'https://pubmed.ncbi.nlm.nih.gov/15797769/',
    pmid: '15797769',
    keyFinding: 'Human alertness exhibits a natural midday drop driven by intrinsic circadian rhythms and homeostatic sleep pressure, occurring independently of whether food is consumed.',
    limitation: 'Observational chronobiology study; magnitude of afternoon alertness dip varies among chronotypes (early vs late sleep schedules).'
  },
  satietyHormones: {
    source: 'Batterham RL, et al. (2002)',
    journal: 'Nature',
    title: 'Gut hormone PYY3-36 physiologically inhibits food intake',
    url: 'https://pubmed.ncbi.nlm.nih.gov/12167864/',
    pmid: '12167864',
    keyFinding: 'This study found that PYY3-36 reduced food intake in a controlled setting. It does not establish why any one person feels hungry in the afternoon.',
    limitation: 'Controlled endocrine study; it does not measure individual appetite patterns or establish a universal timing for hunger hormones.'
  },
  chaiSweetHabit: {
    source: 'Dallman MF, et al. (2003)',
    journal: 'PNAS (Proceedings of the National Academy of Sciences)',
    title: 'Chronic stress and comfort foods: Neural and metabolic feedback',
    url: 'https://pubmed.ncbi.nlm.nih.gov/14612573/',
    pmid: '14612573',
    keyFinding: 'This review discusses how stress-related pathways and palatable food can interact. People’s eating responses to stress differ substantially.',
    limitation: 'Neuroendocrine synthesis model; individual stress eating responses vary, with some individuals experiencing reduced rather than heightened appetite.'
  },
  distractedEating: {
    source: 'Robinson E, et al. (2013)',
    journal: 'American Journal of Clinical Nutrition',
    title: 'Eating attentively: A systematic review and meta-analysis of food intake memory',
    url: 'https://pubmed.ncbi.nlm.nih.gov/23446890/',
    pmid: '23446890',
    keyFinding: 'This systematic review found experimental evidence that distraction can affect memory for eating and later intake. It does not predict an individual’s hunger.',
    limitation: 'Laboratory and crossover protocols; effect sizes differ across real-world office routines and specific meal types.'
  },
  delayedLunch: {
    source: 'Verification required — citation mismatch',
    journal: 'Citation mismatch identified during audit',
    title: 'PMID 15699223: Ghrelin response to carbohydrate-enriched breakfast is related to insulin',
    url: 'https://pubmed.ncbi.nlm.nih.gov/15699223/',
    pmid: '15699223',
    needsVerification: true,
    keyFinding: 'Do not use this citation to support claims about irregular meal frequency or delayed meals. The linked study concerns carbohydrate breakfasts in a small controlled trial.',
    limitation: 'The intended irregular-meal-frequency source must be located and reviewed before any specific biological claim is displayed.'
  },
  carbohydratePacing: {
    source: 'Harvard T.H. Chan School of Public Health',
    journal: 'The Nutrition Source',
    title: 'Carbohydrates and Blood Sugar: Satiety & Glycemic Pacing',
    url: 'https://www.hsph.harvard.edu/nutritionsource/carbohydrates/carbohydrates-and-blood-sugar/',
    pmid: null,
    keyFinding: 'This public-health resource explains that carbohydrate-containing foods can affect blood glucose differently. It cannot determine an individual’s glucose response or hunger pattern.',
    limitation: 'Population-level nutritional guidance; individual postprandial glucose curves vary based on baseline insulin sensitivity and gut flora.'
  },
  sleepHormones: {
    source: 'Spiegel K, et al. (2004)',
    journal: 'Annals of Internal Medicine (NIH)',
    title: 'Sleep Curtailment Is Associated with Decreased Leptin, Elevated Ghrelin, and Increased Appetite',
    url: 'https://pubmed.ncbi.nlm.nih.gov/15583226/',
    pmid: '15583226',
    keyFinding: 'In a small controlled study of healthy young men, short sleep was associated with lower leptin, higher ghrelin, and greater reported hunger and appetite.',
    limitation: 'Conducted in a small laboratory cohort under acute sleep restriction; individual chronic free-living responses involve wider environmental variables.'
  },
  sedentaryGlucose: {
    source: 'Dunstan DW, et al. (2012)',
    journal: 'Diabetes Care',
    title: 'Breaking Up Prolonged Sitting Reduces Postprandial Glucose and Insulin Responses',
    url: 'https://pubmed.ncbi.nlm.nih.gov/22374636/',
    pmid: '22374636',
    keyFinding: 'In an acute laboratory study, brief light-intensity activity breaks reduced post-meal glucose and insulin responses compared with uninterrupted sitting.',
    limitation: 'Evaluates acute, single-day laboratory postprandial responses; does not represent a standalone treatment for metabolic conditions.'
  },
  willpowerMyth: {
    source: 'NIDDK / National Institutes of Health (NIH)',
    journal: 'NIH Health Information',
    title: 'Factors Affecting Weight & Health',
    url: 'https://www.niddk.nih.gov/health-information/weight-management/adult-overweight-obesity/factors-affecting-weight-health',
    pmid: null,
    keyFinding: 'Appetite and metabolic regulation are governed by complex biological, endocrine, genetic, and circadian mechanisms rather than simple voluntary willpower.',
    limitation: 'General public-health education; it is not evidence that willpower has no role, nor a diagnosis of an individual’s appetite.'
  }
};

// 5 Everyday Indian-routine aware questions with immediate educational micro-feedback and evidence links
const questions = [
  {
    id: 'moment',
    eyebrow: '01 / THE MOMENT',
    title: 'What do you notice around 3 PM?',
    subtitle: 'No right answer. We’re just noticing everyday patterns.',
    options: [
      {
        label: 'I feel hungry even after lunch.',
        detail: 'Even when I had a full meal earlier',
        icon: Sun,
        themes: ['meals', 'routine'],
        microFeedback: 'Appetite can change in the hours after a meal. Meal composition, timing, sleep, routine, and many personal factors can all matter; this quiz cannot identify the reason for your hunger.',
        evidenceKey: 'satietyHormones'
      },
      {
        label: 'I often want something sweet with my tea.',
        detail: 'A biscuit, sweet snack, or chai craving',
        icon: Coffee,
        themes: ['meals', 'stress'],
        microFeedback: 'Wanting something sweet with afternoon chai can reflect habit, enjoyment, context, or hunger. Research on stress and reward offers possible explanations, but it cannot tell what is driving your urge today.',
        evidenceKey: 'chaiSweetHabit'
      },
      {
        label: 'I feel tired and reach for a snack.',
        detail: 'Looking for an energy boost or pick-me-up',
        icon: Clock3,
        themes: ['sleep', 'routine'],
        microFeedback: 'Human alertness naturally dips in the mid-afternoon as part of our internal circadian rhythm. During this post-lunch lull, many people reach for snacks as a convenient way to stimulate alertness or take a mental break.',
        evidenceKey: 'postLunchDip'
      },
      {
        label: 'It varies from day to day.',
        detail: 'No single fixed pattern yet',
        icon: Sparkles,
        themes: ['routine'],
        microFeedback: 'Fluctuating sleep schedules, meal timing, and daily workloads naturally create shifting appetite cues. Spotting day-to-day variation without judgment is the first step toward body awareness.',
        evidenceKey: 'delayedLunch'
      }
    ]
  },
  {
    id: 'lunch',
    eyebrow: '02 / YOUR ROUTINE',
    title: 'What does lunch usually look like?',
    subtitle: 'Think about a typical weekday in India.',
    options: [
      {
        label: 'Rice or roti with a balanced meal',
        detail: 'Usually a proper sit-down lunch break',
        icon: Utensils,
        themes: ['meals'],
        microFeedback: 'A meal that includes foods such as dal, vegetables, or curd can add protein or fibre. Blood-glucose and fullness responses vary from person to person, so notice what helps you feel satisfied.',
        evidenceKey: 'carbohydratePacing'
      },
      {
        label: 'Something quick at my desk',
        detail: 'Work often takes first priority',
        icon: Coffee,
        themes: ['routine', 'stress'],
        microFeedback: 'Experiments suggest that distraction while eating can affect memory for a meal and later intake. This does not mean a desk lunch will necessarily make you hungry sooner.',
        evidenceKey: 'distractedEating'
      },
      {
        label: 'I sometimes miss it or eat late',
        detail: 'The schedule gets away from me',
        icon: Clock3,
        themes: ['routine', 'meals'],
        microFeedback: 'A delayed or missed meal may leave some people feeling hungry later. The reference for a specific ghrelin or blood-glucose explanation is under review, so this reflection does not make that claim.',
        evidenceKey: 'delayedLunch'
      },
      {
        label: 'It depends on the day',
        detail: 'My daily schedule fluctuates',
        icon: Sparkles,
        themes: ['routine'],
        microFeedback: 'When routines vary, appetite cues may feel different from day to day. Research on meal timing is evolving, and this quiz cannot determine how your schedule affects your body.',
        evidenceKey: 'delayedLunch'
      }
    ]
  },
  {
    id: 'sleep',
    eyebrow: '03 / LAST NIGHT',
    title: 'How has sleep been lately?',
    subtitle: 'Your best guess is enough—no tracking needed.',
    options: [
      {
        label: 'Pretty consistent & restful',
        detail: 'I usually wake up feeling refreshed',
        icon: Moon,
        themes: [],
        microFeedback: 'Sleep is one factor that can influence appetite regulation. A short quiz cannot measure sleep quality, hormone levels, or the cause of a particular craving.',
        evidenceKey: 'sleepHormones'
      },
      {
        label: 'A bit short or broken',
        detail: 'Some nights are a genuine struggle',
        icon: Clock3,
        themes: ['sleep'],
        microFeedback: 'In a small controlled study of healthy young men, short sleep was associated with changes in leptin, ghrelin, hunger, and appetite. Individual responses outside a laboratory vary.',
        evidenceKey: 'sleepHormones'
      },
      {
        label: 'My bedtime shifts constantly',
        detail: 'Late screen time or irregular hours',
        icon: Sun,
        themes: ['sleep', 'routine'],
        microFeedback: 'Shifting bedtimes can affect how rested you feel and may affect appetite for some people. This quiz cannot assess circadian alignment, insulin sensitivity, or the cause of an urge to eat.',
        evidenceKey: 'sleepHormones'
      },
      {
        label: 'I haven’t really noticed',
        detail: 'Haven’t tuned into sleep quality lately',
        icon: Sparkles,
        themes: ['sleep'],
        microFeedback: 'If your sleep has felt different lately, it may be useful to notice whether that changes your energy or appetite. Fatigue and cravings have many possible causes.',
        evidenceKey: 'sleepHormones'
      }
    ]
  },
  {
    id: 'day',
    eyebrow: '04 / YOUR DAY',
    title: 'How much do you move during the day?',
    subtitle: 'Movement looks different for every body and routine.',
    options: [
      {
        label: 'I get up and move often',
        detail: 'Walking, stairs, errands, or workout',
        icon: Footprints,
        themes: [],
        microFeedback: 'Light movement has many benefits. Acute studies show activity breaks can change post-meal glucose and insulin responses, but they do not establish why someone feels energetic or hungry.',
        evidenceKey: 'sedentaryGlucose'
      },
      {
        label: 'Mostly sitting at a desk',
        detail: 'Screen work, classes, or sedentary commutes',
        icon: Clock3,
        themes: ['movement'],
        microFeedback: 'Long periods of sitting are common. In laboratory research, interrupting sitting changed post-meal glucose and insulin responses; it does not show that sitting causes your sluggishness or snacking.',
        evidenceKey: 'sedentaryGlucose'
      },
      {
        label: 'A balanced mix of both',
        detail: 'Sitting stretches broken up by errands',
        icon: Footprints,
        themes: ['movement'],
        microFeedback: 'An acute laboratory study found that brief, regular light-activity breaks reduced post-meal glucose and insulin responses versus uninterrupted sitting. It is not a treatment recommendation.',
        evidenceKey: 'sedentaryGlucose'
      },
      {
        label: 'It varies wildly',
        detail: 'Some days active, some completely still',
        icon: Sparkles,
        themes: ['movement', 'routine'],
        microFeedback: 'Activity can vary across days, as can appetite. This quiz cannot calculate energy needs or explain a specific change in hunger.',
        evidenceKey: 'sedentaryGlucose'
      }
    ]
  },
  {
    id: 'feeling',
    eyebrow: '05 / THE CONTEXT',
    title: 'When the urge to snack shows up, what else is happening?',
    subtitle: 'Pick the closest fit. This is about curiosity, not self-judgment.',
    options: [
      {
        label: 'I feel physically hungry',
        detail: 'My stomach or body signals for real food',
        icon: Heart,
        themes: ['meals'],
        microFeedback: 'People experience hunger differently. Paying attention to body and context cues can be useful, but no single sensation can reliably distinguish “true” hunger from other influences.',
        evidenceKey: 'satietyHormones'
      },
      {
        label: 'I’m tired or mentally drained',
        detail: 'I need a pause or gentle dopamine boost',
        icon: Moon,
        themes: ['sleep', 'routine'],
        microFeedback: 'When you are mentally tired, a snack or pause may feel appealing. This is a common experience, but the quiz cannot determine whether fatigue, hunger, habit, or another factor is involved.',
        evidenceKey: 'postLunchDip'
      },
      {
        label: 'I’m stressed or restless',
        detail: 'A lot is on my mind or feeling rushed',
        icon: Brain,
        themes: ['stress'],
        microFeedback: 'Stress can change eating for some people, while others eat less or experience no change. A quiz response cannot measure cortisol or identify the cause of an urge to snack.',
        evidenceKey: 'chaiSweetHabit'
      },
      {
        label: 'I’m not entirely sure yet',
        detail: 'Looking forward to understanding it better',
        icon: Sparkles,
        themes: ['routine'],
        microFeedback: 'Building awareness between somatic hunger and emotional context is a practiced skill. Simply observing without judgment is the foundation of metabolic curiosity.',
        evidenceKey: 'willpowerMyth'
      }
    ]
  }
];

// Fictional sample presets for hackathon judging demonstration
const demoPersonas = [
  {
    id: 'desk-crasher',
    name: 'Afternoon desk routine',
    desc: 'Quick desk lunch, sitting long stretches, 3 PM energy drop',
    answers: { moment: 2, lunch: 1, sleep: 1, day: 1, feeling: 1 }
  },
  {
    id: 'poor-sleep',
    name: "Poor night's sleep",
    desc: 'Fragmented sleep, shifting bedtimes, sweet tea cravings',
    answers: { moment: 1, lunch: 2, sleep: 1, day: 2, feeling: 2 }
  },
  {
    id: 'busy-commute',
    name: 'Busy commute',
    desc: 'Hectic schedule, physical movement, true hunger peaks',
    answers: { moment: 0, lunch: 0, sleep: 0, day: 0, feeling: 0 }
  }
];

// Reference summaries keep their scope visible to avoid implying diagnosis.
const sourceNotes = [
  {
    label: 'Verification required — not used to support a biological claim',
    title: 'PMID 15699223: Ghrelin response to carbohydrate-enriched breakfast is related to insulin',
    url: 'https://pubmed.ncbi.nlm.nih.gov/15699223/',
    note: 'This link was previously associated with delayed or irregular meals, but it concerns carbohydrate breakfasts in a small controlled trial instead.',
    limitation: 'The intended meal-timing reference has not yet been located and reviewed. It should not be cited for a specific ghrelin, glucose, or appetite claim in this experience.'
  },
  {
    label: 'NIDDK / National Institutes of Health (NIH)',
    title: 'Factors Affecting Weight & Health',
    url: 'https://www.niddk.nih.gov/health-information/weight-management/adult-overweight-obesity/factors-affecting-weight-health',
    note: 'Appetite, metabolic weight regulation, and eating behaviors involve multi-system interactions between genetics, endocrine hormones, sleep duration, and daily routines.',
    limitation: 'Public health educational resource; individual metabolic evaluations require personalized medical consultation.'
  },
  {
    label: 'Spiegel K, et al. · Annals of Internal Medicine (NIH)',
    title: 'Sleep Curtailment and Endocrine Alterations in Appetite Regulation',
    url: 'https://pubmed.ncbi.nlm.nih.gov/15583226/',
    note: 'A small controlled study of healthy young men found that short sleep was associated with lower leptin, higher ghrelin, and greater reported hunger and appetite.',
    limitation: 'Laboratory cohort of young adults under acute sleep restriction; free-living chronic sleep patterns involve additional environmental variables.'
  },
  {
    label: 'Dunstan DW, et al. · Diabetes Care',
    title: 'Breaking Up Prolonged Sitting Reduces Postprandial Glucose and Insulin Responses',
    url: 'https://pubmed.ncbi.nlm.nih.gov/22374636/',
    note: 'An acute laboratory study found that brief, regular light-activity breaks reduced post-meal glucose and insulin responses compared with uninterrupted sitting.',
    limitation: 'Acute single-day crossover trial; does not constitute a standalone clinical treatment for metabolic conditions.'
  },
  {
    label: 'Robinson E, et al. · American Journal of Clinical Nutrition',
    title: 'Eating Attentively: A Systematic Review and Meta-Analysis of Food Intake Memory',
    url: 'https://pubmed.ncbi.nlm.nih.gov/23446890/',
    note: 'A systematic review found experimental evidence that distraction can affect memory for eating and later intake; it does not predict an individual’s hunger.',
    limitation: 'Includes varied experimental protocols; effect sizes differ across real-world office routines.'
  },
  {
    label: 'Harvard T.H. Chan School of Public Health',
    title: 'The Nutrition Source: Carbohydrates and Blood Sugar',
    url: 'https://www.hsph.harvard.edu/nutritionsource/carbohydrates/carbohydrates-and-blood-sugar/',
    note: 'This public-health resource explains that carbohydrate-containing foods can affect blood glucose differently; it cannot determine an individual’s glucose response or hunger pattern.',
    limitation: 'Individual postprandial glycemic responses vary based on microbiome composition and baseline insulin sensitivity.'
  },
  {
    label: 'Dallman MF, et al. · PNAS (Proceedings of the National Academy of Sciences)',
    title: 'Chronic Stress and Obesity: A New View of "Comfort Food"',
    url: 'https://pubmed.ncbi.nlm.nih.gov/14612573/',
    note: 'This review discusses interactions between stress-related pathways and palatable food; individual eating responses to stress differ widely.',
    limitation: 'Synthesizes neuroendocrine models; individual human eating responses to stress differ widely.'
  }
];

// Rich, evidence-grounded deterministic reflection mapping adhering to Concepts B & C
const themeCopy = {
  sleep: {
    title: 'Sleep Cadence & Appetite Signaling',
    body: 'Sleep and circadian rhythm are among the factors that can influence appetite. This reflection cannot identify why you feel hungry or tired on a particular day.',
    whatScienceExplains: 'In a small controlled study of healthy young men, short sleep was associated with lower leptin, higher ghrelin, and greater reported hunger and appetite. It does not predict an individual response.',
    whatRemainsUncertain: 'A brief questionnaire cannot measure your personal hormonal baseline levels, clinical sleep debt, or individual metabolic markers.',
    action: 'For the next 3 days, simply observe roughly how many hours you slept whenever afternoon fatigue or hunger appears. Notice whether your sleep hours correlate with your cravings, without trying to force immediate changes.'
  },
  routine: {
    title: 'The Rhythm of Your Daily Schedule',
    body: 'Meal timing, work demands, and routines can shape how people experience hunger. This reflection cannot identify the cause of your afternoon appetite.',
    whatScienceExplains: 'Meal-timing and circadian research suggests that timing can matter for metabolic processes, but the cited irregular-meal claim requires further source review before making it more specific.',
    whatRemainsUncertain: 'Daily habits interact with countless individual lifestyle factors that a short reflection cannot isolate or clinically verify.',
    action: 'Try establishing one consistent daytime anchor—such as a dedicated 15-minute uninterrupted lunch window away from work screens. Observe if this changes how satisfied you feel at 3 PM.'
  },
  movement: {
    title: 'Physical Stasis & Energy Regulation',
    body: 'Sitting and movement patterns are one part of a day. This reflection cannot establish whether they explain your energy or appetite.',
    whatScienceExplains: 'An acute laboratory study found that brief, regular light-activity breaks reduced post-meal glucose and insulin responses compared with uninterrupted sitting. It was not a study of cravings or treatment.',
    whatRemainsUncertain: 'Movement varies across days, and activity alone does not account for overall metabolic expenditure or nutritional needs.',
    action: 'If comfortable for your body, experiment with a 3-minute walking break before reaching for an afternoon tea snack. Observe how your alertness shifts—and if you still feel physically hungry, enjoy your snack mindfully.'
  },
  stress: {
    title: 'Emotional Context & Energy Demands',
    body: 'Stress can influence eating for some people, but responses differ widely. Recognizing context can foster compassion without assuming a biological cause.',
    whatScienceExplains: 'A review discusses interactions between stress-related pathways and palatable food; it does not show that stress or cortisol is driving a particular person’s snack choice.',
    whatRemainsUncertain: 'Subjective stress is multifaceted; self-reported tension cannot reveal cortisol curves or individual neurochemistry.',
    action: 'When an urge hits around 3 PM, take three slow breaths and gently ask: "Am I seeking physical fuel, mental stimulation, or a pause from work?" Listen to the answer without self-judgment.'
  },
  meals: {
    title: 'Meal Composition & Satiety Pacing',
    body: 'Meal composition can be one factor in fullness after lunch, alongside timing, sleep, activity, medication, and many other factors. This reflection cannot identify your cause of hunger.',
    whatScienceExplains: 'Nutrition research describes how meal composition can affect post-meal metabolism and appetite-related signals. Individual glucose and satiety responses vary and cannot be inferred here.',
    whatRemainsUncertain: 'Personal glycemic responses to Indian staples (rice, roti, dal) vary widely based on gut microbiota and individual insulin sensitivity.',
    action: 'Notice whether adding a handful of roasted chana, nuts, or curd to lunch changes your 3 PM satiety. Do not restrict your food; simply observe your body’s response.'
  }
};

// Empty in the bundled deployment, so the API remains same-origin. Set this
// build-time value only when the frontend is deployed separately.
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

function SignalExperience() {
  const [stage, setStage] = useState('intro'); // 'intro', 'quiz', 'myth', 'result'
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [insight, setInsight] = useState(null);
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [toast, setToast] = useState('');
  const [selectedMythAnswer, setSelectedMythAnswer] = useState(null);
  const [showMythExplanation, setShowMythExplanation] = useState(false);
  const [expandedEvidenceKey, setExpandedEvidenceKey] = useState(null);
  const [demoBanner, setDemoBanner] = useState('');
  const resultCardRef = useRef(null);

  const current = questions[index];
  const chosen = answers[current?.id];
  const answeredCount = Object.keys(answers).length;
  // Clues unlock in order. The midpoint checkpoint gates the final two clues,
  // while already answered clues remain available for review.
  const furthestUnlocked = selectedMythAnswer
    ? Math.min(answeredCount, questions.length - 1)
    : Math.min(answeredCount, 2);

  const profile = useMemo(() => {
    const counts = {};
    Object.entries(answers).forEach(([qid, optionIndex]) => {
      const q = questions.find(item => item.id === qid);
      const option = q?.options[optionIndex];
      (option?.themes || []).forEach(theme => counts[theme] = (counts[theme] || 0) + 1);
    });
    const themes = Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([theme]) => theme);
    return { themes: themes.length ? themes : ['routine'], counts };
  }, [answers]);

  // Loading animation message cycling
  useEffect(() => {
    if (!loadingInsight) return;
    const steps = [
      'Reading your 5 lifestyle signals...',
      'Synthesizing sleep, meals & routine rhythms...',
      'Formulating doctor-led educational reflection...'
    ];
    const timer = setInterval(() => {
      setLoadingStep(s => (s + 1) % steps.length);
    }, 850);
    return () => clearInterval(timer);
  }, [loadingInsight]);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(''), 2800);
      return () => clearTimeout(t);
    }
  }, [toast]);

  // Reset evidence drawer when changing questions
  useEffect(() => {
    setExpandedEvidenceKey(null);
  }, [index, stage]);

  // Keyboard navigation for presentations
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (stage === 'intro') {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          startQuiz();
        }
      } else if (stage === 'quiz') {
        if (['1', '2', '3', '4'].includes(e.key)) {
          const optIdx = parseInt(e.key, 10) - 1;
          if (current?.options[optIdx]) {
            selectOption(optIdx);
          }
        } else if (e.key === 'Enter' || e.key === 'ArrowRight') {
          if (chosen !== undefined) {
            next();
          }
        } else if (e.key === 'ArrowLeft' || e.key === 'Backspace') {
          back();
        } else if (e.key === 'Escape') {
          restart();
        }
      } else if (stage === 'myth') {
        if (e.key === '1' || e.key === 't' || e.key === 'T') {
          handleMythAnswer('true');
        } else if (e.key === '2' || e.key === 'f' || e.key === 'F') {
          handleMythAnswer('false');
        } else if (e.key === 'Enter' && selectedMythAnswer) {
          proceedFromMyth();
        }
      } else if (stage === 'result') {
        if (e.key === 'r' || e.key === 'R') {
          restart();
        } else if (e.key === 'c' || e.key === 'C') {
          copyReflectionText();
        } else if (e.key === 'd' || e.key === 'D') {
          downloadCard();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [stage, index, chosen, current, answers, selectedMythAnswer]);

  function startQuiz() {
    setAnswers({});
    setInsight(null);
    setSelectedMythAnswer(null);
    setShowMythExplanation(false);
    setStage('quiz');
    setIndex(0);
  }

  function selectOption(optionIndex) {
    setAnswers(prev => ({ ...prev, [current.id]: optionIndex }));
    setExpandedEvidenceKey(null);
  }

  function next() {
    // Insert Myth Checkpoint right after Question 3 (index 2)
    if (index === 2 && !selectedMythAnswer) {
      setStage('myth');
      return;
    }

    if (index < questions.length - 1) {
      setIndex(index + 1);
    } else {
      finish(answers);
    }
  }

  function back() {
    if (index > 0) {
      setIndex(index - 1);
    } else {
      setStage('intro');
    }
  }

  function handleMythAnswer(val) {
    setSelectedMythAnswer(val);
  }

  function proceedFromMyth() {
    setStage('quiz');
    setIndex(3); // proceed to question 4
  }

  async function finish(completedAnswers) {
    setStage('result');
    setLoadingInsight(true);
    setInsight(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const ansMap = completedAnswers || answers;
    const counts = {};
    Object.entries(ansMap).forEach(([qid, optionIndex]) => {
      const q = questions.find(item => item.id === qid);
      const option = q?.options[optionIndex];
      (option?.themes || []).forEach(theme => counts[theme] = (counts[theme] || 0) + 1);
    });
    const calculatedThemes = Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([theme]) => theme);
    const finalThemes = calculatedThemes.length ? calculatedThemes : ['routine'];

    const first = themeCopy[finalThemes[0]] || themeCopy.routine;
    const second = themeCopy[finalThemes[1]] || themeCopy.meals;

    try {
      const selectedAnswers = questions.map(q => ({
        question: q.title,
        answer: q.options[ansMap[q.id]]?.label || 'Not answered'
      }));

      const res = await fetch(`${API_BASE_URL}/api/insight`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ themes: finalThemes, answers: selectedAnswers })
      });

      if (!res.ok) throw new Error('API unavailable');
      const data = await res.json();
      setInsight(data);
    } catch {
      // Deterministic evidence-backed fallback
      setInsight({
        headline: first.title,
        summary: first.body,
        whatScienceExplains: first.whatScienceExplains,
        whatRemainsUncertain: first.whatRemainsUncertain,
        nextStep: second.action,
        mode: 'guided insight · deterministic fallback'
      });
    } finally {
      setLoadingInsight(false);
    }
  }

  function loadDemoPersona(persona) {
    setDemoBanner(`Sample journey: ${persona.name} (Fictional illustration)`);
    setAnswers(persona.answers);
    finish(persona.answers);
  }

  function restart() {
    setStage('intro');
    setIndex(0);
    setAnswers({});
    setInsight(null);
    setSelectedMythAnswer(null);
    setShowMythExplanation(false);
    setExpandedEvidenceKey(null);
    setDemoBanner('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function challengeFriend() {
    // A challenge is always a fresh case: never carry another person's clues.
    setAnswers({});
    setInsight(null);
    setSelectedMythAnswer(null);
    setShowMythExplanation(false);
    setExpandedEvidenceKey(null);
    setDemoBanner('');
    setIndex(0);
    setStage('quiz');
    setToast('A fresh case file is open — their answers stay their own.');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function shareResult() {
    const title = 'My afternoon signals';
    const text = `I explored my everyday appetite signals with Steer Signal. Takeaway: "${insight?.headline || 'Curiosity over Judgement'}". Explore your signals:`;
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url: window.location.href });
        return;
      } catch (e) {
        if (e.name === 'AbortError') return;
      }
    }
    copyReflectionText();
  }

  async function copyReflectionText() {
    const firstTheme = themeCopy[profile.themes[0]] || themeCopy.routine;
    const secondTheme = themeCopy[profile.themes[1]] || themeCopy.meals;
    const headline = insight?.headline || firstTheme.title;
    const summary = insight?.summary || firstTheme.body;
    const nextStep = insight?.nextStep || secondTheme.action;

    const textToCopy = `*My afternoon signals — Steer Signal Note*

✦ What Research Suggests:
${headline}
${summary}

✦ A Gentle Experiment:
${nextStep}

✦ Key Factors: ${profile.themes.slice(0, 3).join(', ')}

Explore your everyday signals: ${window.location.href}
(Educational reflection by Steer — Doctor-led metabolic care · Not a medical assessment)`;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setToast('Summary copied to clipboard!');
    } catch {
      setToast('Press Ctrl+C to copy your summary');
    }
  }

  async function downloadCard() {
    const firstTheme = themeCopy[profile.themes[0]] || themeCopy.routine;
    const secondTheme = themeCopy[profile.themes[1]] || themeCopy.meals;
    const headline = insight?.headline || firstTheme.title;
    const summary = insight?.summary || firstTheme.body;
    const nextStep = insight?.nextStep || secondTheme.action;

    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1350;
    const ctx = canvas.getContext('2d');

    // Canvas Background
    ctx.fillStyle = '#F5EBDF';
    ctx.fillRect(0, 0, 1080, 1350);

    // Decorative Outer Border
    ctx.strokeStyle = '#E2C9BA';
    ctx.lineWidth = 14;
    ctx.strokeRect(20, 20, 1040, 1310);

    // Maroon Top Accent Bar
    ctx.fillStyle = '#661414';
    ctx.fillRect(20, 20, 1040, 16);

    // Header: Steer brandmark
    ctx.fillStyle = '#C04E2A';
    ctx.beginPath();
    ctx.arc(88, 92, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#351D1D';
    ctx.font = '700 32px Georgia, serif';
    ctx.fillText('steer.', 108, 99);

    ctx.fillStyle = '#B58777';
    ctx.font = '600 20px "DM Sans", sans-serif';
    ctx.fillText('/  SIGNAL NOTES  ·  METABOLIC HEALTH', 222, 98);

    ctx.fillStyle = '#B58777';
    ctx.font = '500 18px "DM Sans", sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('EVERYDAY REFLECTION', 980, 98);
    ctx.textAlign = 'left';

    // Neutral, nonjudgmental card title (Section 10 requirement)
    ctx.fillStyle = '#351D1D';
    ctx.font = 'italic 54px Georgia, serif';
    let curY = 190;
    curY = wrapText(ctx, 'My afternoon signals', 88, curY, 904, 68, 2);

    ctx.fillStyle = '#7A5F56';
    ctx.font = '400 22px "DM Sans", sans-serif';
    curY = wrapText(ctx, 'A curious look at everyday appetite & metabolic rhythms.', 88, curY + 6, 904, 34, 2);

    // Divider with Diamond Asterisk
    curY += 18;
    ctx.fillStyle = '#E2C9BA';
    ctx.fillRect(88, curY, 904, 2);
    ctx.fillStyle = '#C04E2A';
    ctx.font = '22px serif';
    ctx.fillText('✳', 530, curY + 8);
    curY += 44;

    // Concept B: The Pattern Explored
    ctx.fillStyle = '#C04E2A';
    ctx.font = '700 20px "DM Sans", sans-serif';
    ctx.fillText('01 / WHAT RESEARCH SUGGESTS', 88, curY);
    curY += 42;

    ctx.fillStyle = '#351D1D';
    ctx.font = '600 34px Georgia, serif';
    curY = wrapText(ctx, headline, 88, curY, 904, 46, 2);
    curY += 14;

    ctx.fillStyle = '#4A2A2A';
    ctx.font = '400 23px "DM Sans", sans-serif';
    curY = wrapText(ctx, summary, 88, curY, 904, 36, 4);
    curY += 34;

    // Gentle Experiment Box
    ctx.fillStyle = '#661414';
    ctx.font = '700 20px "DM Sans", sans-serif';
    ctx.fillText('02 / A GENTLE EXPERIMENT TO TRY', 88, curY);
    curY += 38;

    const boxTop = curY - 14;
    ctx.fillStyle = '#EEDDD0';
    roundRect(ctx, 88, boxTop, 904, 140, 12);
    ctx.fill();

    ctx.fillStyle = '#351D1D';
    ctx.font = 'italic 24px Georgia, serif';
    wrapText(ctx, nextStep, 118, curY + 30, 844, 36, 3);
    curY += 180;

    // Theme Pills
    ctx.fillStyle = '#B58777';
    ctx.font = '700 18px "DM Sans", sans-serif';
    ctx.fillText('SIGNALS EXPLORED:', 88, curY + 12);

    let pillX = 300;
    profile.themes.slice(0, 3).forEach(t => {
      const label = t.toUpperCase();
      const pillWidth = ctx.measureText(label).width + 36;
      ctx.fillStyle = '#F8F2EB';
      ctx.strokeStyle = '#C04E2A';
      ctx.lineWidth = 1.5;
      roundRect(ctx, pillX, curY - 12, pillWidth, 34, 17);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#C04E2A';
      ctx.font = '600 16px "DM Sans", sans-serif';
      ctx.fillText(label, pillX + 18, curY + 11);
      pillX += pillWidth + 14;
    });

    // Include observations on the share card without turning them into a
    // clinical conclusion.
    curY += 72;
    ctx.fillStyle = '#C04E2A';
    ctx.font = '700 18px "DM Sans", sans-serif';
    ctx.fillText('YOUR REPORTED CLUES', 88, curY);
    curY += 30;
    ctx.fillStyle = '#4A2A2A';
    ctx.font = '400 19px "DM Sans", sans-serif';
    const reportedClues = questions.slice(0, 3)
      .map(q => q.options[answers[q.id]]?.label)
      .filter(Boolean)
      .join('  ·  ');
    wrapText(ctx, reportedClues, 88, curY, 904, 29, 2);

    // Bottom Footer Area
    ctx.fillStyle = '#E2C9BA';
    ctx.fillRect(88, 1210, 904, 1);

    ctx.fillStyle = '#C04E2A';
    ctx.font = '700 20px "DM Sans", sans-serif';
    ctx.fillText('CURIOSITY, NOT A DIAGNOSIS.', 88, 1255);

    ctx.fillStyle = '#B58777';
    ctx.font = '400 17px "DM Sans", sans-serif';
    ctx.fillText('Doctor-led metabolic care  ·  steerclub.com', 88, 1285);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#351D1D';
    ctx.font = '600 18px "DM Sans", sans-serif';
    ctx.fillText('Steer Signal Prototype', 992, 1255);
    ctx.fillStyle = '#B58777';
    ctx.font = '400 16px "DM Sans", sans-serif';
    ctx.fillText('Hackathon Edition · 2026', 992, 1285);
    ctx.textAlign = 'left';

    const link = document.createElement('a');
    link.download = 'my-afternoon-signals.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
    setToast('Your high-res share card has downloaded!');
  }

  function roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  function wrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines = 5) {
    const words = String(text).split(' ');
    let line = '';
    let lines = 0;
    for (const word of words) {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > maxWidth && line) {
        ctx.fillText(line, x, y);
        y += lineHeight;
        line = word;
        lines++;
        if (lines >= maxLines - 1) break;
      } else {
        line = test;
      }
    }
    if (line) {
      ctx.fillText(line, x, y);
      y += lineHeight;
    }
    return y;
  }

  const loadingStepsCopy = [
    'Reading your 5 lifestyle signals...',
    'Synthesizing sleep, meals & routine rhythms...',
    'Formulating doctor-led educational reflection...'
  ];

  return (
    <div className="app-shell">
      {/* Top Header */}
      <header className="topbar">
        <a className="wordmark" href="#top" onClick={e => { e.preventDefault(); restart(); }} aria-label="Signal home">
          steer<span>.</span>
        </a>
        <div className="topbar-right">
          <span className="edition">A DOCTOR-LED INTERACTIVE EXPLORATION</span>
          <span className="top-dot" />
        </div>
      </header>

      {/* Demo Persona Notification Banner if Active */}
      {demoBanner && (
        <div className="demo-active-bar">
          <Sparkles size={14} />
          <span>{demoBanner}</span>
          <button className="demo-reset-link" onClick={restart}>Reset</button>
        </div>
      )}

      <main id="main-content">
        {/* ==============================================================
            STAGE 1: INTRO / HERO VIEW
            ============================================================== */}
        {stage === 'intro' && (
          <section className="hero view-enter">
            <div className="hero-copy">
              <div className="eyebrow">
                <span className="eyebrow-line" /> A 60-SECOND INTERACTIVE
              </div>
              <h1>
                It's 3 PM.<br />
                You're hungry <em>again.</em><br />
                <span className="rust">What's behind it?</span>
              </h1>
              {/* Supporting text directly from Section 2 hackathon requirements */}
              <p className="hero-lede">
                Sleep, meal timing, daily routines and stress can all influence appetite.
                <br /><br />
                Explore a few everyday signals. Get useful insights in 60 seconds.
              </p>

              <div className="hero-cta-group">
                <button
                  className="primary-btn pulse-glow"
                  onClick={startQuiz}
                  id="start-quiz-btn"
                  autoFocus
                >
                  Solve the mystery <ArrowRight size={18} />
                </button>
                <div className="micro-proof">
                  <span><Clock3 size={15} /> 60 seconds</span>
                  <i />
                  <span><ShieldCheck size={15} /> No login · No judgement</span>
                </div>
              </div>

              {/* Sample Journey Presets (Section 12) */}
              <div className="demo-presets-card">
                <div className="presets-label">
                  <Zap size={14} className="rust" />
                  <span>TRY A SAMPLE JOURNEY (DEMO PRESETS):</span>
                </div>
                <div className="presets-pills">
                  {demoPersonas.map(persona => (
                    <button
                      key={persona.id}
                      className="preset-btn"
                      onClick={() => loadDemoPersona(persona)}
                      title={persona.desc}
                    >
                      <Sparkles size={12} />
                      <strong>{persona.name}</strong>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Hero Artwork with Chai Cup & Floating Steam */}
            <div className="hero-art" aria-label="Illustration of an afternoon tea and snack">
              <div className="art-orbit orbit-one" />
              <div className="art-orbit orbit-two" />
              <div className="sun-disc" />
              <div className="art-label label-top">A NOTE TO SELF <span>✳</span></div>

              <div className="plate">
                <div className="plate-inner">
                  <div className="snack snack-one" title="Warm afternoon samosa snack" />
                  <div className="snack snack-two" title="Chana bite" />
                  <div className="snack snack-three" title="Dry fruit crunch" />
                  <div className="leaf-doodle">〰</div>
                </div>
              </div>

              <div className="chai-cup">
                <div className="chai-steam">
                  <span>~</span>
                  <span>~</span>
                  <span>~</span>
                </div>
                <div className="chai-liquid" />
                <div className="cup-handle" />
                <div className="cup-rim" />
              </div>

              <div className="art-label label-bottom">PAUSE. NOTICE. LEARN.</div>
              <div className="sparkle s1">✳</div>
              <div className="sparkle s2">✦</div>
              <div className="sparkle s3">✳</div>
            </div>

            <div className="hero-bottom">
              <span>METABOLIC HEALTH, MADE HUMAN.</span>
              <span>01 — 05 / CHOOSE YOUR PATH</span>
            </div>
          </section>
        )}

        {/* ==============================================================
            STAGE 2: 5-QUESTION INTERACTIVE QUIZ WITH MICRO-FEEDBACK
            ============================================================== */}
        {stage === 'quiz' && (
          <section className="quiz-wrap view-enter" key={current.id}>
            <div className="quiz-topline">
              <button className="text-btn" onClick={back} id="back-btn">
                <ArrowLeft size={16} /> Back
              </button>
              <div className="quiz-nav-steps">
                {questions.map((q, idx) => (
                  <button
                    key={q.id}
                    className={`step-dot ${idx === index ? 'active' : ''} ${answers[q.id] !== undefined ? 'completed' : ''} ${idx > furthestUnlocked ? 'locked' : ''}`}
                    onClick={() => idx <= furthestUnlocked && setIndex(idx)}
                    title={idx <= furthestUnlocked ? `Review clue ${idx + 1}` : 'Solve the earlier clue first'}
                    aria-label={idx <= furthestUnlocked ? `Review clue ${idx + 1}` : `Clue ${idx + 1} is locked`}
                    disabled={idx > furthestUnlocked}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
              <span className="quiz-counter">
                CASE FILE <b>{String(index + 1).padStart(2, '0')}</b> OF 05
              </span>
            </div>

            <div className="progress-track" aria-label="Quiz progress">
              <div className="progress-fill" style={{ width: `${((index + 1) / questions.length) * 100}%` }} />
            </div>

            <div className="quiz-content">
              <div className="eyebrow">
                <span className="eyebrow-line" /> CLUE {String(index + 1).padStart(2, '0')} · {current.eyebrow}
              </div>
              <h2>{current.title}</h2>
              <p className="quiz-subtitle">{current.subtitle}</p>

              <div className="options-grid" role="radiogroup" aria-label={current.title}>
                {current.options.map((option, i) => {
                  const Icon = option.icon;
                  const isSelected = chosen === i;
                  return (
                    <button
                      key={option.label}
                      className={`option-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => selectOption(i)}
                      role="radio"
                      aria-checked={isSelected}
                      id={`option-${current.id}-${i}`}
                    >
                      <span className="key-shortcut" title={`Press ${i + 1} on keyboard`}>
                        {i + 1}
                      </span>
                      <span className="option-icon">
                        <Icon size={20} />
                      </span>
                      <span className="option-text">
                        <strong>{option.label}</strong>
                        <small>{option.detail}</small>
                      </span>
                      <span className="option-check">
                        {isSelected ? <Check size={18} className="rust" /> : <ChevronRight size={17} />}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Immediate Educational Micro-Feedback with Traceable Evidence (Requirement 1, 2, 3) */}
              {chosen !== undefined && current.options[chosen] && (
                <div className="inline-feedback-banner view-enter">
                  <div className="feedback-header">
                    <Sparkles size={15} className="rust" />
                    <strong>CLUE LOG · WHAT RESEARCH CAN AND CAN’T SAY:</strong>
                  </div>
                  <p className="feedback-text">{current.options[chosen].microFeedback}</p>

                  {/* Compact "Read the evidence" interaction */}
                  {current.options[chosen].evidenceKey && verifiedEvidence[current.options[chosen].evidenceKey] && (
                    <div className="feedback-evidence-box">
                      <button
                        className="evidence-toggle-btn"
                        onClick={() => {
                          const k = current.options[chosen].evidenceKey;
                          setExpandedEvidenceKey(expandedEvidenceKey === k ? null : k);
                        }}
                      >
                        <BookOpen size={13} />
                        <span>
                          {expandedEvidenceKey === current.options[chosen].evidenceKey
                            ? 'Hide clinical reference'
                            : `Read the evidence: ${verifiedEvidence[current.options[chosen].evidenceKey].source}`}
                        </span>
                      </button>

                      {expandedEvidenceKey === current.options[chosen].evidenceKey && (
                        <div className="evidence-detail-card view-enter">
                          <div className="evidence-detail-title">
                            <strong>{verifiedEvidence[current.options[chosen].evidenceKey].title}</strong>
                            <span className="evidence-journal">{verifiedEvidence[current.options[chosen].evidenceKey].journal}</span>
                          </div>
                          {verifiedEvidence[current.options[chosen].evidenceKey].needsVerification && (
                            <p className="verification-flag"><AlertCircle size={13} /> Reference verification required — this link documents a mismatch and does not support a claim.</p>
                          )}
                          <p className="evidence-finding">
                            <strong>What the study established:</strong> {verifiedEvidence[current.options[chosen].evidenceKey].keyFinding}
                          </p>
                          <p className="evidence-limitation">
                            <strong>Scientific limitation:</strong> {verifiedEvidence[current.options[chosen].evidenceKey].limitation}
                          </p>
                          <a
                            href={verifiedEvidence[current.options[chosen].evidenceKey].url}
                            target="_blank"
                            rel="noreferrer"
                            className="evidence-direct-link"
                          >
                            Open publication at official source <ExternalLink size={12} />
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              <div className="quiz-footer">
                <span className="session-privacy-note">
                  <Info size={15} /> Your answers stay purely in this session · Press [Enter] to advance
                </span>
                <button
                  className="primary-btn"
                  disabled={chosen === undefined}
                  onClick={next}
                  id="next-question-btn"
                >
                  {index === questions.length - 1 ? 'Reveal my takeaway' : 'Next question'} <ArrowRight size={17} />
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ==============================================================
            STAGE 2B: INTERACTIVE MYTH VS FACT CHECKPOINT (Requirement 4)
            ============================================================== */}
        {stage === 'myth' && (
          <section className="myth-wrap view-enter">
            <div className="myth-topline">
              <span className="myth-badge">
                <HelpCircle size={14} /> MYTH CHECKPOINT · INTERACTIVE CLUE
              </span>
              <span className="quiz-counter">MIDPOINT CLUE</span>
            </div>

            <div className="myth-card">
              <div className="eyebrow">
                <span className="eyebrow-line" /> COMMON METABOLIC MISCONCEPTION
              </div>
              <h2>
                True or false?<br />
                <em>"Hunger is simply a matter of willpower."</em>
              </h2>
              <p className="myth-prompt">
                Before exploring the rest of your daily signals, what does your intuition say?
              </p>

              <div className="myth-buttons-row">
                <button
                  className={`myth-choice-btn ${selectedMythAnswer === 'true' ? 'selected' : ''}`}
                  onClick={() => handleMythAnswer('true')}
                >
                  <span>A. True</span>
                </button>
                <button
                  className={`myth-choice-btn ${selectedMythAnswer === 'false' ? 'selected' : ''}`}
                  onClick={() => handleMythAnswer('false')}
                >
                  <span>B. False</span>
                </button>
              </div>

              {/* Revealed Explanation */}
              {selectedMythAnswer && (
                <div className="myth-reveal-box view-enter">
                  <div className="reveal-tag">
                    {selectedMythAnswer === 'false' ? (
                      <span className="correct-tag"><CheckCircle2 size={16} /> Exactly right!</span>
                    ) : (
                      <span className="clarify-tag"><XCircle size={16} /> Actually, false!</span>
                    )}
                  </div>
                  <p className="reveal-core-text">
                    <strong>False.</strong> Appetite is regulated by complex, interacting biological systems—including
                    hunger and satiety hormones (such as ghrelin, leptin, and insulin), sleep duration, and daily routines.
                    Hunger is not a simple test of discipline, character, or willpower. It can be shaped by many biological and everyday factors.
                  </p>

                  <div className="myth-learn-more">
                    <button
                      className="text-btn learn-more-toggle"
                      onClick={() => setShowMythExplanation(!showMythExplanation)}
                    >
                      <Info size={14} /> {showMythExplanation ? 'Hide scientific reference' : 'Why? Read the clinical evidence'}
                    </button>
                    {showMythExplanation && (
                      <div className="myth-evidence-drawer view-enter">
                        <p>
                          <strong>Supporting Evidence:</strong> Clinical reviews by the National Institutes of Health (NIH / NIDDK)
                          and a controlled sleep study (Spiegel et al., <em>Annals of Internal Medicine</em>) describe biological factors
                          associated with appetite. They do not identify the cause of hunger for an individual or make willpower irrelevant.
                        </p>
                        <a
                          href="https://www.niddk.nih.gov/health-information/weight-management/adult-overweight-obesity/factors-affecting-weight-health"
                          target="_blank"
                          rel="noreferrer"
                          className="evidence-direct-link"
                        >
                          View NIDDK Health Information publication <ExternalLink size={12} />
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="myth-continue-row">
                    <button className="primary-btn" onClick={proceedFromMyth}>
                      Continue exploring signals <ArrowRight size={17} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ==============================================================
            STAGE 3: 3-CONCEPT RESULTS VIEW (Requirement 5)
            ============================================================== */}
        {stage === 'result' && (
          <section className="result-wrap view-enter" ref={resultCardRef}>
            <div className="result-header">
              <div className="eyebrow">
                <span className="eyebrow-line" /> YOUR SIGNAL NOTE
              </div>
              <span className="result-badge">
                <Sparkles size={14} /> PERSONALIZED METABOLIC REFLECTION
              </span>
            </div>

            <h2>Not a label.<br /><em>A place to start.</em></h2>
            <p className="result-intro">
              Your choices describe an everyday pattern to explore. They do not identify the cause of hunger or assess your metabolic health.
            </p>

            <div className="result-safety-strip">
              <ShieldCheck size={17} /> Educational reflection only — not a diagnosis, medical assessment, or treatment recommendation.
            </div>

            {/* CONCEPT A: WHAT YOU REPORTED (Requirement 5.A) */}
            <div className="concept-section concept-a">
              <div className="concept-header">
                <span className="concept-tag">CONCEPT A</span>
                <span className="card-index">WHAT YOU REPORTED</span>
              </div>
              <p className="concept-subtext">Summary of your 5 reported everyday signals:</p>
              <div className="signals-chips-grid">
                {questions.map((q, qIdx) => {
                  const optIdx = answers[q.id];
                  const opt = q.options[optIdx];
                  if (!opt) return null;
                  const Icon = opt.icon;
                  return (
                    <div className="signal-chip" key={q.id}>
                      <span className="chip-badge">0{qIdx + 1}</span>
                      <Icon size={16} className="chip-icon" />
                      <div className="chip-text">
                        <strong>{opt.label}</strong>
                        <small>{opt.detail}</small>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CONCEPT B: WHAT RESEARCH SUGGESTS (Requirement 5.B) */}
            <div className="concept-section concept-b">
              <div className="concept-header">
                <span className="concept-tag">CONCEPT B</span>
                <span className="card-index">WHAT RESEARCH SUGGESTS</span>
              </div>

              <div className="result-grid">
                <article className="insight-card primary-insight">
                  <span className="card-index">THE PATTERN EXPLORED</span>
                  {loadingInsight ? (
                    <div className="loading-line">
                      <span className="spin-dot" />
                      <div className="loading-copy">
                        <strong>{loadingStepsCopy[loadingStep]}</strong>
                        <small>Evaluating sleep, meal timing, and daily habits</small>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3>{insight?.headline || (themeCopy[profile.themes[0]] || themeCopy.routine).title}</h3>
                      <p>{insight?.summary || (themeCopy[profile.themes[0]] || themeCopy.routine).body}</p>
                    </>
                  )}
                  <div className="card-foot">
                    <span>
                      <Sparkles size={15} /> {insight?.mode || 'Guided insight · Evidence-informed'}
                    </span>
                  </div>
                </article>

                {/* Gentle, low-risk, observational experiment (Requirement 6) */}
                <article className="insight-card next-insight">
                  <span className="card-index">A GENTLE EXPERIMENT TO TRY</span>
                  <h3>Try noticing, not fixing.</h3>
                  <p>
                    {loadingInsight
                      ? 'Synthesizing an observational, low-friction experiment for your weekday routine…'
                      : insight?.nextStep || (themeCopy[profile.themes[1]] || themeCopy.meals).action}
                  </p>
                  <div className="tiny-note">
                    <Leaf size={16} />
                    Gentle observation builds self-trust far more sustainably than guilt or restriction.
                  </div>
                </article>
              </div>

              {/* Research evidence callout card */}
              <div className="research-evidence-highlight">
                <div className="highlight-icon">
                  <BookOpen size={18} className="rust" />
                </div>
                <div className="highlight-copy">
                  <strong>Biological Evidence:</strong>
                  <p>
                    {insight?.whatScienceExplains || (themeCopy[profile.themes[0]] || themeCopy.routine).whatScienceExplains}
                  </p>
                </div>
              </div>
            </div>

            {/* CONCEPT C: WHAT THIS REFLECTION CANNOT DETERMINE (Requirement 5.C) */}
            <div className="concept-section concept-c">
              <div className="concept-header">
                <span className="concept-tag tag-warning">CONCEPT C</span>
                <span className="card-index">WHAT THIS REFLECTION CANNOT DETERMINE</span>
              </div>
              <div className="boundaries-box">
                <p className="boundaries-intro">
                  {insight?.whatRemainsUncertain || (themeCopy[profile.themes[0]] || themeCopy.routine).whatRemainsUncertain}
                </p>
                <div className="boundary-items-grid">
                  <div className="boundary-item">
                    <AlertCircle size={15} className="rust" />
                    <span>Cannot measure individual blood glucose, HbA1c, or fasting insulin levels.</span>
                  </div>
                  <div className="boundary-item">
                    <AlertCircle size={15} className="rust" />
                    <span>Cannot diagnose endocrine conditions (such as thyroid disorders or insulin resistance).</span>
                  </div>
                  <div className="boundary-item">
                    <AlertCircle size={15} className="rust" />
                    <span>Cannot evaluate clinical sleep disorders (such as sleep apnea) or nutrient deficiencies.</span>
                  </div>
                  <div className="boundary-item">
                    <AlertCircle size={15} className="rust" />
                    <span>Cannot substitute for a personalized medical consultation with a qualified doctor.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Key factors pill row */}
            <div className="themes-row">
              <span className="themes-label">KEY FACTORS AT PLAY:</span>
              {profile.themes.slice(0, 3).map(t => (
                <span className="theme-pill" key={t}>
                  <Compass size={12} /> {t}
                </span>
              ))}
            </div>

            {/* Actions: Share Reflection, Save PNG, Copy Text, Start Again (Requirement 8 & 10) */}
            <div className="result-actions">
              <button className="primary-btn" onClick={shareResult} id="share-btn">
                <Share2 size={17} /> Share reflection <ArrowUpRight size={16} />
              </button>
              <button className="secondary-btn" onClick={downloadCard} id="download-card-btn">
                <Download size={17} /> Save share card (PNG)
              </button>
              <button className="secondary-btn" onClick={copyReflectionText} id="copy-btn">
                <Copy size={16} /> Copy text
              </button>
              <button className="secondary-btn challenge-btn" onClick={challengeFriend} id="challenge-friend-btn">
                <Sparkles size={16} /> Challenge a friend
              </button>
              <button className="text-btn restart-btn" onClick={restart} id="restart-btn">
                <RotateCcw size={15} /> Start again
              </button>
            </div>

            {/* Natural STEER Handoff (Requirement 9) */}
            <div className="conversion-card">
              <div>
                <span className="card-index">WHEN YOU WANT TO GO DEEPER</span>
                <h3>Curious about metabolic health beyond the myths?</h3>
                <p>
                  Learn how Steer describes its clinician-led programme and decide whether you would like to explore it.
                </p>
              </div>
              <a
                href="https://steerclub.com"
                target="_blank"
                rel="noreferrer"
                className="conversion-link"
                id="explore-steer-cta"
              >
                Explore doctor-led metabolic care <ArrowUpRight size={17} />
              </a>
            </div>

            {/* Credible Scientific References Section (Requirement 1 & 8) */}
            <div className="sources">
              <span className="sources-title">
                <Info size={15} /> Selected references and scope notes
              </span>
              <p className="reference-review-note">
                <AlertCircle size={14} /> Prototype citation status: verify each source’s wording, URL, and scope before public use. The meal-timing citation marked “Verification required” is a known mismatch and must not support a biological claim.
              </p>
              <div className="sources-table-list">
                {sourceNotes.map(s => (
                  <div key={s.label} className="source-row-card">
                    <div className="source-row-main">
                      <span className="source-org">{s.label}</span>
                      <a href={s.url} target="_blank" rel="noreferrer" className="source-title-link">
                        {s.title} <ExternalLink size={12} />
                      </a>
                    </div>
                    <p className="source-finding">{s.note}</p>
                    <small className="source-limit">
                      <strong>Limitation:</strong> {s.limitation}
                    </small>
                  </div>
                ))}
              </div>

              {/* Prominent, readable disclaimer (Requirement 5 & 8) */}
              <p className="disclaimer">
                <strong>Medical Disclaimer:</strong> This application provides general educational reflections and is not a medical assessment or diagnostic tool.
                It cannot determine the clinical cause of your hunger or diagnose a health condition. If you experience persistent fatigue, rapid weight changes, or metabolic concerns, consult a qualified healthcare professional.
              </p>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <span>steer<span className="rust">.</span> / SIGNAL NOTES</span>
        <span>DOCTOR-LED METABOLIC CARE · HUMAN-FIRST</span>
        <span>© 2026 STEER</span>
      </footer>

      {/* Toast Notification */}
      {toast && (
        <div className="toast" role="status" aria-live="polite">
          <Check size={16} />
          {toast}
        </div>
      )}
    </div>
  );
}

function App() {
  return <BrowserRouter><AppErrorBoundary><SkipLink /><Routes>
    <Route path="/" element={<DiscoveryHub />} />
    <Route path="/signal" element={<SignalExperience />} />
    <Route path="/games/missing-clue" element={<MissingClue />} />
    <Route path="/games/predict" element={<PredictTwist />} />
    <Route path="/games/signal-rush" element={<SignalRush />} />
    <Route path="/games/case-file" element={<CaseFile />} />
    <Route path="/learn/metabolism" element={<MetabolismLearning />} />
    <Route path="/demo" element={<DemoPage />} />
    <Route path="/demo/campaign" element={<CampaignStudio />} />
    <Route path="/demo/reels" element={<ReelsSimulator />} />
    <Route path="/index.html" element={<Navigate to="/" replace />} />
    <Route path="*" element={<NotFound />} />
  </Routes></AppErrorBoundary></BrowserRouter>;
}

createRoot(document.getElementById('root')).render(<App />);
