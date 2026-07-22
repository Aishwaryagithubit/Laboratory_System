/* ============================================================
   Hi-Tech Pathology Lab — Chatbot v2
   Smarter keyword matching — best-score wins, no greedy misfires
   Unknown queries → WhatsApp referral
============================================================ */

(function () {
  'use strict';

  const WHATSAPP_NUMBER = '9779822382156';
  const WHATSAPP_BASE   = 'https://wa.me/' + WHATSAPP_NUMBER;
  const WHATSAPP_LINK   = WHATSAPP_BASE + '?text=Hello%2C%20I%20have%20a%20query%20regarding%20Hi-Tech%20Pathology%20Lab.';
  const BOT_TYPING_MS   = 650;

  /* ── Full knowledge base (inline — no fetch needed) ────────── */
  const KB = [
    {
      id: 'greeting',
      phrases: ['hello','hi','hey','namaste','good morning','good afternoon','good evening','start','help me','who are you'],
      answer: '👋 Hello! Welcome to Hi-Tech Pathology Lab, Janakpurdham!\n\nI can help you with:\n• Tests & services\n• Booking a test\n• Timings & location\n• Reports & pricing\n• Contact & WhatsApp\n\nWhat would you like to know?'
    },
    {
      id: 'booking',
      phrases: ['how do i book','how to book','book a test','book test','book appointment','make appointment','schedule test','schedule appointment','want to book','i want to book','book online','online booking','appointment'],
      answer: '📅 How to Book a Test:\n\n1️⃣ Online → visit our Book a Test page\n2️⃣ WhatsApp → +977-9822382156\n3️⃣ Phone → Call +977-9822382156\n4️⃣ Walk-in → Hospital Road, Janakpurdham\n\nTap below to book via WhatsApp right now!',
      whatsapp: true
    },
    {
      id: 'services',
      phrases: ['what tests','which tests','what services','what do you offer','what can you do','list of tests','available tests','all tests','services available','what test do you','tests available'],
      answer: '🧪 Our Diagnostic Services:\n\n🩸 Blood Tests (CBC, Sugar, Lipid Profile)\n💧 Urine Analysis\n😷 COVID-19 Testing (RT-PCR & Rapid)\n🦋 Thyroid & Hormone Tests (TSH, T3, T4)\n🔬 Biochemistry (Liver, Kidney, Lipid)\n🎗️ Cancer & Tumor Markers\n⚡ Electrolyte Analysis\n🏥 Complete Health Checkup Packages\n\nAsk me about any specific test!'
    },
    {
      id: 'blood',
      phrases: ['blood test','blood','cbc','hemoglobin','hb','rbc','wbc','platelet','complete blood count','blood count'],
      answer: '🩸 Blood Tests:\n\nWe use the world-class Medonic M Series CBC Analyzer (Sweden) for all blood tests.\n\n• Complete Blood Count (CBC)\n• Blood Glucose (Fasting / PP / Random)\n• Hemoglobin, ESR, Blood Group\n• And many more\n\n✅ Accurate results with certified equipment.\n\nContact us to book!'
    },
    {
      id: 'thyroid',
      phrases: ['thyroid','tsh','t3','t4','thyroid test','hormone test','free t3','free t4','immunoassay'],
      answer: '🦋 Thyroid & Hormone Tests:\n\nWe use the Tosoh AiA 360 — a world-class Japanese analyzer.\n\n• TSH, T3, T4\n• Free T3 / Free T4\n• Anti-TPO Antibodies\n\n✅ Highly accurate results.\n\nBook your thyroid test today!'
    },
    {
      id: 'biochemistry',
      phrases: ['liver test','kidney test','lipid profile','cholesterol','creatinine','uric acid','sgpt','sgot','bilirubin','urea','lft','kft','biochemistry','liver function','kidney function'],
      answer: '🔬 Biochemistry Tests:\n\nWe use Erba Chem 7 & Erba Chem 6 — Germany-manufactured analyzers.\n\n• Liver Function Test (SGPT, SGOT, Bilirubin)\n• Kidney Function Test (Creatinine, BUN, Uric Acid)\n• Lipid Profile (Cholesterol, HDL, LDL, Triglycerides)\n• Blood Glucose, HbA1c\n\nContact us for prices!'
    },
    {
      id: 'cancer',
      phrases: ['cancer','tumor','tumor marker','cancer marker','psa','cea','afp','ca125','ca 125','ca19','cancer test','tumor test'],
      answer: '🎗️ Cancer & Tumor Marker Tests:\n\nWe use the Tosoh AiA 360 Immunoassay Analyzer.\n\n• PSA (Prostate)\n• CEA (Colon / Lung)\n• AFP (Liver)\n• CA-125, CA 19-9\n\nEarly detection saves lives. Consult your doctor and book with us!'
    },
    {
      id: 'covid',
      phrases: ['covid','corona','covid test','covid-19','rt-pcr','pcr test','antigen test','rapid test','coronavirus'],
      answer: '😷 COVID-19 Testing:\n\n• 🔬 RT-PCR Test (Gold standard, 24hr result)\n• ⚡ Rapid Antigen Test (Quick result)\n\nSafe sample collection, certified results.\n\nCall or WhatsApp us to check current availability!'
    },
    {
      id: 'urine',
      phrases: ['urine','urine test','urine analysis','urinalysis','urine routine','urine culture'],
      answer: '💧 Urine Analysis:\n\n• Urine Routine & Microscopy\n• Urine Culture & Sensitivity\n• Urine Protein / Glucose\n• 24-hour Urine Tests\n\n✅ Quick turnaround, accurate results.'
    },
    {
      id: 'electrolyte',
      phrases: ['electrolyte','sodium','potassium','chloride','electrolyte test','imbalance'],
      answer: '⚡ Electrolyte Analysis:\n\nWe use a Micro Lab Electrolyte Analyzer (India).\n\n• Sodium (Na)\n• Potassium (K)\n• Chloride (Cl)\n\nUseful for detecting dehydration, kidney disease, and more.'
    },
    {
      id: 'package',
      phrases: ['health package','checkup package','full body checkup','basic checkup','advanced checkup','health screening','preventive checkup','package'],
      answer: '🏥 Health Checkup Packages:\n\n📦 Basic Health Checkup (POPULAR)\nRoutine screening for early detection of health conditions.\n\n📦 Advanced Health Checkup (PREMIUM)\nBlood investigations + organ function + full health assessment.\n\nGreat value! Contact us for pricing and to book.',
      whatsapp: true
    },
    {
      id: 'timing',
      phrases: ['timing','timings','opening hours','what time','when open','are you open','open today','hours','schedule','close time','closing time','what are your hours','lab hours'],
      answer: '🕐 Lab Timings:\n\n📅 Sunday – Friday:\n  🌅 Morning: 7:00 AM – 12:00 PM\n  🌇 Evening: 5:00 PM – 8:00 PM\n\n📅 Saturday:\n  🌅 Morning: 7:00 AM – 12:00 PM\n\n⚠️ For emergencies outside hours, please call us!'
    },
    {
      id: 'location',
      phrases: ['location','address','where are you','how to reach','directions','find you','find the lab','where is','map','google map','janakpurdham','hospital road','dhanusha'],
      answer: '📍 Our Location:\n\nHi-Tech Pathology Lab\nHospital Road, Janakpurdham\nDhanusha, Nepal\n\n🗺️ Find us on the map on our homepage, or tap below for WhatsApp directions!',
      whatsapp: true
    },
    {
      id: 'contact',
      phrases: ['contact','phone number','call','telephone','mobile number','how to contact','reach you','get in touch'],
      answer: '📞 Contact Us:\n\n📱 Phone / WhatsApp: +977-9822382156\n📧 Email: hplnepal18@gmail.com\n📍 Hospital Road, Janakpurdham, Dhanusha, Nepal\n\nWe are available during working hours!',
      whatsapp: true
    },
    {
      id: 'whatsapp',
      phrases: ['whatsapp','wa','chat on whatsapp','message us','contact on whatsapp','open whatsapp','wa.me'],
      answer: '💬 Chat with us on WhatsApp!\n\nOur team is ready to help you with booking, pricing, and any queries.\n\nTap below to open WhatsApp now:',
      whatsapp: true
    },
    {
      id: 'report',
      phrases: ['report','result','test result','when will i get','how long','report ready','collect report','report time','get my report','report delivery'],
      answer: '📋 Test Report Timings:\n\n⏱️ Routine (CBC, Urine): 2–4 hours\n⏱️ Biochemistry: 3–5 hours\n⏱️ Thyroid / Hormones: Same or next day\n⏱️ Culture tests: 3–5 days\n⏱️ COVID RT-PCR: 24 hours\n\n📲 Reports collected in person. Ask us about WhatsApp delivery!'
    },
    {
      id: 'price',
      phrases: ['price','cost','rate','charge','fee','how much','pricing','affordable','test price','how much does','what is the cost','what is the price'],
      answer: '💰 Pricing:\n\nWe offer very affordable and competitive prices for all tests.\n\nPrices vary by test. Please contact us for the latest rates:\n\n📱 WhatsApp: +977-9822382156\n📞 Call: +977-9822382156',
      whatsapp: true
    },
    {
      id: 'home_collection',
      phrases: ['home collection','home sample','sample at home','collect at home','home visit','doorstep','home service'],
      answer: '🏠 Home Sample Collection:\n\nWe may offer home collection in the Janakpurdham area.\n\nPlease contact us to check availability and schedule:\n\n📱 WhatsApp: +977-9822382156\n📞 Phone: +977-9822382156',
      whatsapp: true
    },
    {
      id: 'fasting',
      phrases: ['fasting','fast','empty stomach','food before','should i fast','eating before test','preparation','prepare for test','before test'],
      answer: '🍽️ Test Preparation — Fasting:\n\n✅ Fast 8–12 hours before:\n• Blood Sugar (Fasting)\n• Lipid Profile\n• Liver Function Test\n\n❌ No fasting needed for:\n• CBC, Urine Tests\n• Thyroid (morning sample preferred)\n\nWhen unsure, ask your doctor or call us!'
    },
    {
      id: 'equipment',
      phrases: ['machine','equipment','instrument','technology','analyzer','which machine','lab machine','what machine'],
      answer: '🔬 Our World-Class Equipment:\n\n🇯🇵 Tosoh AiA 360 (Japan) — Thyroid & Immunoassay\n🇸🇪 Medonic M Series (Sweden) — CBC Blood Count\n🇩🇪 Erba Chem 7 & 6 (Germany) — Biochemistry\n🇮🇳 Micro Lab Electrolyte Analyzer (India) — Electrolytes\n\nInternationally certified machines for precision results.'
    },
    {
      id: 'about',
      phrases: ['about','about you','who are you','history','founded','years','experience','founder','santosh','santosh nirmal','how old','established'],
      answer: '🏆 About Hi-Tech Pathology Lab:\n\nFounded by Mr. Santosh Nirmal, we have completed 20 years of trusted diagnostic service.\n\n👨‍🔬 Mr. Santosh Nirmal:\n• President — MELAN (Medical Lab Association of Nepal, Dhanusha)\n• BSc. MLT, Bangalore\n• NHPC: A-1156\n\nOur mission: Accurate, reliable, timely diagnostics with the highest quality care.'
    },
    {
      id: 'prescription',
      phrases: ['prescription','doctor referral','need prescription','without prescription','referral','do i need a doctor'],
      answer: '📄 Prescription Requirement:\n\nFor most routine tests, you do NOT need a prescription — just walk in!\n\nFor specialized tests, a doctor referral may be helpful.\n\nWhen in doubt, call or WhatsApp us!'
    },
    {
      id: 'thanks',
      phrases: ['thank you','thanks','thank u','great','awesome','ok thanks','that is all','done','goodbye','bye','see you','ok bye'],
      answer: '😊 Thank you for reaching out to Hi-Tech Pathology Lab!\n\nWishing you good health. Feel free to ask anytime.\n\n📱 WhatsApp: +977-9822382156\n📞 Call: +977-9822382156'
    }
  ];

  const GREETING   = '👋 Hello! I\'m the Hi-Tech Pathology Lab Assistant.\n\nAsk me about:\n• Tests & services\n• Booking a test\n• Timings & location\n• Reports & pricing\n• WhatsApp contact';
  const QUICK_CHIPS = ['What tests do you offer?', 'How do I book a test?', 'Timings', 'Location', 'Contact on WhatsApp'];
  const FALLBACK_MSG = '🤔 I\'m not sure about that, but our team will be happy to help you!\n\nTap below to reach us directly on WhatsApp 👇';

  /* ── Smart matching: score every FAQ, return the best ───────── */
  function findAnswer(input) {
    const q = input.toLowerCase().trim();
    let bestScore = 0;
    let bestFaq   = null;

    for (const faq of KB) {
      let score = 0;
      for (const phrase of faq.phrases) {
        if (q === phrase) {
          score = Math.max(score, phrase.length * 3);   // exact match → highest
        } else if (q.includes(phrase)) {
          score = Math.max(score, phrase.length * 2);   // longer phrase = better
        } else {
          // word-level partial: every matching word adds 1
          const words = phrase.split(' ');
          let wordHits = 0;
          for (const w of words) {
            if (w.length > 2 && q.includes(w)) wordHits++;
          }
          if (wordHits > 0) score = Math.max(score, wordHits);
        }
      }
      if (score > bestScore) {
        bestScore = score;
        bestFaq   = faq;
      }
    }

    // Require minimum score of 2 to avoid weak single-word misfires
    return bestScore >= 2 ? bestFaq : null;
  }

  /* ── DOM refs ─────────────────────────────────────────────── */
  const launcher     = document.getElementById('chatbot-launcher');
  const toggleBtn    = document.getElementById('chatbot-toggle-btn');
  const chatWindow   = document.getElementById('chatbot-window');
  const closeBtn     = document.getElementById('chatbot-close-btn');
  const msgArea      = document.getElementById('chatbot-messages-area');
  const chipArea     = document.getElementById('chatbot-quick-replies');
  const textInput    = document.getElementById('chatbot-text-input');
  const sendBtn      = document.getElementById('chatbot-send-btn');

  if (!launcher || !toggleBtn || !chatWindow) return;

  let isOpen     = false;
  let hasGreeted = false;

  /* ── Open / Close ─────────────────────────────────────────── */
  function openChat() {
    isOpen = true;
    chatWindow.classList.add('open');
    launcher.classList.add('open');
    toggleBtn.setAttribute('aria-expanded', 'true');
    toggleBtn.textContent = '✕';
    textInput.focus();
    if (!hasGreeted) {
      hasGreeted = true;
      setTimeout(() => {
        addBotMsg(GREETING, true);
        showChips(QUICK_CHIPS);
      }, 250);
    }
  }

  function closeChat() {
    isOpen = false;
    chatWindow.classList.remove('open');
    launcher.classList.remove('open');
    toggleBtn.setAttribute('aria-expanded', 'false');
    toggleBtn.textContent = '💬';
  }

  toggleBtn.addEventListener('click', () => isOpen ? closeChat() : openChat());
  closeBtn.addEventListener('click', closeChat);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && isOpen) closeChat(); });

  /* ── Add user bubble ─────────────────────────────────────── */
  function addUserMsg(text) {
    const d = document.createElement('div');
    d.className = 'cb-msg user';
    d.textContent = text;
    msgArea.appendChild(d);
    scrollDown();
  }

  /* ── Add bot bubble (optionally with WhatsApp button) ─────── */
  function addBotMsg(text, instant, showWA) {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;flex-direction:column;align-items:flex-start;gap:8px;';

    const bubble = document.createElement('div');
    bubble.className = 'cb-msg bot';
    bubble.textContent = text;
    wrap.appendChild(bubble);

    if (showWA) {
      const a = document.createElement('a');
      a.href      = WHATSAPP_LINK;
      a.target    = '_blank';
      a.rel       = 'noopener noreferrer';
      a.className = 'cb-whatsapp-btn';
      a.innerHTML = '📱 Open WhatsApp';
      wrap.appendChild(a);
    }

    if (instant) {
      msgArea.appendChild(wrap);
      scrollDown();
      return;
    }

    // Typing dots then reveal
    const dots = document.createElement('div');
    dots.className = 'cb-typing';
    dots.innerHTML = '<span></span><span></span><span></span>';
    msgArea.appendChild(dots);
    scrollDown();

    setTimeout(() => {
      msgArea.removeChild(dots);
      msgArea.appendChild(wrap);
      scrollDown();
    }, BOT_TYPING_MS);
  }

  /* ── Quick reply chips ───────────────────────────────────── */
  function showChips(list) {
    chipArea.innerHTML = '';
    (list || []).forEach(label => {
      const btn = document.createElement('button');
      btn.className   = 'cb-quick-chip';
      btn.textContent = label;
      btn.addEventListener('click', () => {
        chipArea.innerHTML = '';
        handleMsg(label);
      });
      chipArea.appendChild(btn);
    });
  }

  /* ── Core message handler ────────────────────────────────── */
  function handleMsg(text) {
    if (!text.trim()) return;
    addUserMsg(text);

    const match = findAnswer(text);

    if (match) {
      addBotMsg(match.answer, false, !!match.whatsapp);
    } else {
      // Unknown question → WhatsApp referral
      addBotMsg(FALLBACK_MSG, false, true);
    }

    // Always show follow-up chips after a short delay
    setTimeout(() => {
      showChips(['What tests do you offer?', 'How do I book a test?', 'Timings', 'Pricing', 'Contact on WhatsApp']);
    }, BOT_TYPING_MS + 500);
  }

  /* ── Input events ────────────────────────────────────────── */
  sendBtn.addEventListener('click', () => {
    const v = textInput.value.trim();
    if (!v) return;
    chipArea.innerHTML = '';
    textInput.value = '';
    handleMsg(v);
  });

  textInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const v = textInput.value.trim();
      if (!v) return;
      chipArea.innerHTML = '';
      textInput.value = '';
      handleMsg(v);
    }
  });

  /* ── Scroll helper ───────────────────────────────────────── */
  function scrollDown() {
    setTimeout(() => { msgArea.scrollTop = msgArea.scrollHeight; }, 60);
  }

})();