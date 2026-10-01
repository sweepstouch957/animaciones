/* Sweepstouch · Pre-RCS explainer — el sitio real (site/) corre dentro del celular y se toca solo */
(function () {
  const { useComposition, useTimeline, Easing, interpolate, clamp, CompositionStage, TweaksPanel, useTweaks, TweakSection, TweakToggle, TweakRadio } = window;
  const PINK = '#FC0680', INK = '#18181B', INK2 = '#52525B', HAIR = '#E4E4E7';
  const F = "'Outfit', system-ui, sans-serif";
  const PW = 430, PH = 900, PX = 1170, PY = 78, SITE = './site/';
  const prog = (T, s, d) => clamp((T - s) / d, 0, 1);
  const RES = (id, fb) => (window.__resources && window.__resources[id]) || fb;
  const idFor = (p) => 'a_' + p.replace(/[^\w]/g, '_');
  const resolveAssets = (txt) => txt.replace(/(["'`(])(?:\.\/site\/)?assets\/([\w./-]+)/g, (m, q, p) => q + RES(idFor(p), SITE + 'assets/' + p));
  const MOTIONpop = (T, s, d = 0.5) => Easing.easeOutBack(clamp((T - s) / d, 0, 1));
  const fade = (T, s, e, d = 0.35) => Math.min(prog(T, s, d), 1 - prog(T, e - d, d));

  /* ── guion: pasos sobre el sitio real (tiempo relativo a la escena) ── */
  const STEPS = [
    { s: 'Intro', dt: 0, sel: '[data-act="lang"]', silent: true, lang: true },
    { s: 'Ruleta', dt: -1.4, sel: '@#mms-link1', noclick: true },
    { s: 'Ruleta', dt: 3.2, sel: '@#ru-spin', noclick: true },
    { s: 'Ruleta', dt: 17.2, sel: '@#ru-claim', noclick: true },
    { s: 'Portal', dt: 6.2, sel: '@#lt-cta', noclick: true },
    { s: 'Nombre', dt: 2.5, sel: 'input[data-inp="nameDraft"]', type: 'Sara Smith', dur: 2.2 },
    { s: 'Nombre', dt: 7.0, sel: 'form[data-form="name"] button' },
    { s: 'Nombre', dt: 14.6, sel: '[data-act="closeWelcome"]' },
    { s: 'Lista', dt: 3.0, sel: '.cards .card:nth-child(1) .top' },
    { s: 'Lista', dt: 7.0, sel: '.cards .card:nth-child(4) .top' },
    { s: 'Lista', dt: 11.5, sel: '.cards .card:nth-child(9) .top' },
    { s: 'Lista', dt: 17.4, sel: '.bottom-bar .cta' },
    { s: 'WhatsApp', dt: 4.0, sel: '@#wa-btn', noclick: true },
    { s: 'WhatsApp', dt: 6.5, sel: '@#wa-send', noclick: true },
    { s: 'WhatsApp', dt: 13.5, sel: '@#wa-send', noclick: true },
    { s: 'WhatsApp', dt: 21.0, sel: '@#wa-send', noclick: true },
    { s: 'Soporte', dt: 1.6, sel: '@#sp-btn', noclick: true },
    { s: 'Encuesta', dt: -0.4, sel: '[data-act="editFromReceipt"]', silent: true },
    { s: 'Encuesta', dt: 2.2, sel: '.sb-card, .sb-icon' },
    { s: 'Encuesta', dt: 4.0, sel: '.sb-card' },
    { s: 'Encuesta', dt: 5.6, sel: '[data-act="pickTier"][data-arg="full"]' },
    { s: 'Encuesta', dt: 8.0, sel: '.options .opt:nth-child(5)' },
    { s: 'Encuesta', dt: 10.5, sel: '.options .opt:nth-child(1)' },
    { s: 'Encuesta', dt: 13.0, sel: '.options .opt:nth-child(4)' },
    { s: 'Encuesta', dt: 15.5, sel: '.options .opt:nth-child(1)' },
    { s: 'Rapida', dt: 0.3, sel: '[data-act="closeSurvey"]' },
    { s: 'Rapida', dt: 3.0, sel: '.sb-card, .sb-icon' },
    { s: 'Rapida', dt: 4.8, sel: '.sb-card' },
    { s: 'Rapida', dt: 6.2, sel: '[data-act="pickTier"][data-arg="quick"]' },
    { s: 'Rapida', dt: 7.8, sel: '.stars button:nth-child(5)' },
    { s: 'Rapida', dt: 9.4, sel: '[data-act="sendQuick"]' },
    { s: 'Premios', dt: 0.6, sel: '[data-act="closeQuick"]' },
    { s: 'Premios', dt: 2.0, sel: '.pts-chip' },
    { s: 'Premios', dt: 11.0, sel: '.rw-card' },
    { s: 'Premios', dt: 18.6, sel: '[data-confirm]' },
    { s: 'QR', dt: 1.8, sel: '[data-f="email"]', type: 'maria.perez@gmail.com', dur: 1.2 },
    { s: 'QR', dt: 3.5, sel: '[data-gate-next]' },
    { s: 'QR', dt: 5.3, sel: '[data-f="address"]', type: '490 W 207th St, Apt 4B', dur: 1.0 },
    { s: 'QR', dt: 6.8, sel: '[data-gate-next]' },
    { s: 'QR', dt: 8.6, sel: '[data-f="zip"]', type: '10034', dur: 0.6 },
    { s: 'QR', dt: 9.7, sel: '[data-gate-next]' },
    { s: 'QR', dt: 11.5, sel: '[data-f="birthday"]', type: '1990-05-12', dur: 0.3, whole: true },
    { s: 'QR', dt: 12.4, sel: '[data-gate-next]' },
    { s: 'QR', dt: 14.2, sel: '[data-f="nationality"]', type: 'Domin', dur: 0.7 },
    { s: 'QR', dt: 15.6, sel: '.nat-sug button' },
    { s: 'QR', dt: 16.5, sel: '[data-gate-next]' },
    { s: 'QR', dt: 18.3, sel: '.hh .plus' },
    { s: 'QR', dt: 18.8, sel: '.hh .plus' },
    { s: 'QR', dt: 19.6, sel: '[data-gate-next]' },
    { s: 'QR', dt: 21.4, sel: '[data-gate-next]' },
    { s: 'Tienda', dt: 17.6, sel: '[data-simulate]' },
  ];

  /* ── temporizadores virtuales (para reproducir el guion al instante al hacer scrub) ── */
  const VT = { fast: false, now: 0, seq: 0, list: [], cleared: new Set(), real: new Map() };
  window.__rcsTO = (fn, ms, ...a) => { if (!VT.fast) return setTimeout(fn, ms, ...a); const id = -(++VT.seq); VT.list.push({ id, due: VT.now + ms / 1000, fn: () => fn(...a) }); return id; };
  window.__rcsIV = (fn, ms) => { if (!VT.fast) return setInterval(fn, ms); const id = -(++VT.seq); VT.list.push({ id, due: VT.now + ms / 1000, fn, every: ms / 1000 }); return id; };
  window.__rcsClr = (id) => { if (id < 0) { VT.cleared.add(id); VT.list = VT.list.filter((x) => x.id !== id); const r = VT.real.get(id); if (r) { clearTimeout(r.t); clearInterval(r.i); } } else { clearTimeout(id); clearInterval(id); } };
  window.__rcsScroll = () => { const v = document.getElementById('rcs-vp'); if (v) v.scrollTop = 0; };
  const flush = (until) => { for (;;) { VT.list.sort((a, b) => a.due - b.due); const x = VT.list[0]; if (!x || x.due > until) break; VT.list.shift(); VT.now = x.due; x.fn(); if (x.every && !VT.cleared.has(x.id)) { x.due += x.every; VT.list.push(x); } } };
  const materialize = (T) => { for (const x of VT.list) { const r = {}; r.t = setTimeout(() => { x.fn(); if (x.every) r.i = setInterval(x.fn, x.every * 1000); }, Math.max(0, (x.due - T) * 1000)); VT.real.set(x.id, r); } VT.list = []; };

  /* ── director ── */
  const D = window.__RCS = {
    host: null, err: null, cursor: null, ready: false, lastT: -1, done: new Set(), scrolled: new Set(), cur: { x: PW / 2, y: PH / 2 }, vis: 0, code: {}, lib: null,
    async init(host, cursor) {
      if (this.host) return; this.host = host; this.cursor = cursor;
      const [css, cf, data, rw, app] = await Promise.all(['app.css', 'assets/confetti.js', 'data.js', 'rewards.patched.js', 'app.patched.js'].map((f) => fetch(RES(f.startsWith('assets/') ? idFor(f.slice(7)) : idFor('site_' + f), SITE + f)).then((r) => r.text())));
      const st = document.createElement('style'); st.textContent = resolveAssets(css); document.head.appendChild(st);
      const fix = (rules) => { for (const r of rules) { if (r.cssRules && !(r instanceof CSSKeyframesRule)) fix(r.cssRules); else if (r.selectorText != null) r.selectorText = r.selectorText.split(',').map((s) => { s = s.trim(); return /^(html|body|:root)$/.test(s) ? '#rcs' : '#rcs ' + s; }).join(', '); } };
      try { fix(st.sheet.cssRules); } catch (e) { console.warn('css scope', e); }
      const ov = document.createElement('style'); ov.textContent = `#rcs #app{min-height:${PH}px}#rcs .shell{min-height:${PH}px}#rcs .survey{height:${PH}px}#rcs .survey .hero{width:62%;max-width:260px;margin-top:6px}#rcs .survey .greeting{font-size:28px;margin-top:12px}#rcs .survey .stats{margin:14px 0;padding:10px 3px}#rcs .survey .primary,#rcs .survey .secondary{min-height:48px;font-size:17px}#rcs .survey .secondary{margin-top:8px}#rcs .survey .privacy{margin:12px auto 0;font-size:12px}#rcs .receipt{min-height:${PH - 64}px}#rcs .saved{min-height:${PH}px}#rcs{font-family:${F};color:${INK};background:#F4F4F5;-webkit-font-smoothing:antialiased}#rcs-vp::-webkit-scrollbar{display:none}#rcs img{max-width:100%}#rcs input,#rcs textarea{color:#18181B;font-weight:600;-webkit-text-fill-color:#18181B;opacity:1}#rcs .name-card input:not(:placeholder-shown){border-color:#FC0680}#rcs .name-card .inp-lbl{display:block;text-align:left;font-size:16px;font-weight:500;color:#18181B;margin:0 0 8px;line-height:1.3}#rcs .card .foot .st button{color:#18181B;line-height:1}#rcs .pg-sheet,#rcs .qr-sheet,#rcs .rw-sheet{max-height:${PH - 60}px}#rcs .hh button{color:#18181B}#rcs .rw-star-b{right:auto;left:calc(50% + 6px);top:196px}#rcs textarea,#rcs input:not([type=checkbox]):not([type=radio]){background:#FAFAFA;color:#18181B;-webkit-text-fill-color:#18181B;border-color:#E4E4E7;color-scheme:light}#rcs textarea::placeholder,#rcs input::placeholder{color:#A1A1AA;-webkit-text-fill-color:#A1A1AA;opacity:1}#rcs *{backdrop-filter:none!important;-webkit-backdrop-filter:none!important}#rcs .pg-scrim{background:rgba(255,255,255,.72)}#rcs .pg-body .fld{position:relative}#rcs .nat-caret{position:absolute;right:16px;top:50%;transform:translateY(-50%);color:#52525B;font-size:14px;pointer-events:none}#rcs .nat-sug{margin-top:8px;background:#fff;border:1.5px solid #E4E4E7;border-radius:14px;box-shadow:0 8px 24px rgba(24,24,27,.08);overflow:hidden;display:flex;flex-direction:column;animation:fadeUp .25s ease both}#rcs .nat-sug:empty{display:none}#rcs .nat-sug button{border:0;background:#fff;text-align:left;padding:13px 16px;font:500 15px 'Outfit',system-ui,sans-serif;color:#18181B;border-top:1px solid #F4F4F5;cursor:pointer}#rcs .nat-sug button:first-child{border-top:0;background:#FFF0F7;color:#C4046A;font-weight:700}#rcs.rcs-settled .card,#rcs.rcs-settled .scrim,#rcs.rcs-settled .pg-page,#rcs.rcs-settled .pg-head *,#rcs.rcs-settled .rail *,#rcs.rcs-settled .pg-sheet,#rcs.rcs-settled .rw-sheet,#rcs.rcs-settled .qr-sheet,#rcs.rcs-settled .sheet,#rcs.rcs-settled .cards,#rcs.rcs-settled .list-intro,#rcs.rcs-settled .offers,#rcs.rcs-settled .bottom-bar,#rcs.rcs-settled .rw-card,#rcs.rcs-settled .rw-in,#rcs.rcs-settled .rw-gift,#rcs.rcs-settled .rw-star-a,#rcs.rcs-settled .rw-star-b,#rcs.rcs-settled .rw-bar,#rcs.rcs-settled .rw-shine,#rcs.rcs-settled .rw-success,#rcs.rcs-settled .rw-cat-head,#rcs.rcs-settled .rw-hero,#rcs.rcs-settled .survey .hero,#rcs.rcs-settled .survey h1,#rcs.rcs-settled .survey .qi,#rcs.rcs-settled .survey .options,#rcs.rcs-settled .survey .stats,#rcs.rcs-settled .survey .thanksArt,#rcs.rcs-settled .xsell,#rcs.rcs-settled .sb-icon,#rcs.rcs-settled .sb-badge,#rcs.rcs-settled .sb-card,#rcs.rcs-settled .receipt > *,#rcs.rcs-settled .saved > *{animation-name:none!important}#rcs.rcs-settled .rw-gift,#rcs.rcs-settled .rw-star-a,#rcs.rcs-settled .rw-star-b,#rcs.rcs-settled .rw-bar{opacity:1!important;transform:none!important}`; document.head.appendChild(ov);
      new Function(cf)(); this.lib = window.confetti;
      new Function(resolveAssets(data))();
      this.code = { rw: resolveAssets(rw), app: resolveAssets(app) };
      this.reset(); this.ready = true;
    },
    reset() {
      this.host.innerHTML = '';
      const rcs = document.createElement('div'); rcs.id = 'rcs'; rcs.style.cssText = 'position:absolute;inset:0;overflow:hidden;transform:translateZ(0)';
      rcs.innerHTML = '<div id="rcs-vp" style="position:absolute;inset:0;overflow:auto;scrollbar-width:none"><div id="app"></div></div><canvas id="rcs-cf" style="position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:5000"></canvas>';
      this.host.appendChild(rcs);
      window.confetti = this.lib.create(rcs.querySelector('#rcs-cf'), { resize: true, useWorker: false });
      new Function(this.code.rw)(); new Function(this.code.app)();
      this.done = new Set(); this.scrolled = new Set();
    },
    q: (sel) => sel[0] === '@' ? document.querySelector(sel.slice(1)) : document.querySelector('#rcs ' + sel),
    vp: () => document.getElementById('rcs-vp'),
    resolve(CUES) { return STEPS.map((s, i) => ({ ...s, i, t: (CUES[s.s] ?? 0) + s.dt })).sort((a, b) => a.t - b.t); },
    scrollTo(el, smooth, T) { const vp = this.vp(); if (!vp || !el) return; const fixedIn = el.closest('.scrim,.cam,.scan,.success,.bottom-bar,.sb-wrap,.rw-nav'); if (fixedIn) return; const r = el.getBoundingClientRect(), v = vp.getBoundingClientRect(); const sc = v.height / PH; const top = (r.top - v.top) / sc, bot = (r.bottom - v.top) / sc; if (top < 90 || bot > PH - 200) { const target = vp.scrollTop + top - 250; if (smooth) this.anim = { from: vp.scrollTop, to: target, t0: T, dur: 0.85 }; else vp.scrollTop = target; } },
    scrollTick(T) { const a = this.anim, vp = this.vp(); if (!a || !vp) return; const p = prog(T, a.t0, a.dur); const e = 1 - Math.pow(1 - p, 3.2); vp.scrollTop = a.from + (a.to - a.from) * e; if (p >= 1) this.anim = null; },
    exec(st, fast) {
      const el = this.q(st.sel); if (!el) { console.warn('paso sin elemento', st.sel); return; }
      if (st.lang) { const b = this.q(`[data-act="lang"][data-arg="${this.lang || 'en'}"]`); if (b) b.click(); return; }
      if (st.type) { if (fast) this.setVal(el, st.type); return; }
      if (st.noclick) return;
      const rcs = document.getElementById('rcs');
      if (rcs) { const shell = () => { const s = rcs.querySelector('.shell'); return s ? s.className + '|' + (s.firstElementChild && s.firstElementChild.className) + '|' + !!rcs.querySelector('.survey') + '|' + !!rcs.querySelector('#rw') : ''; }; const before = shell(); el.click(); const after = shell(); if (after !== before) { rcs.classList.remove('rcs-settled'); __rcsTO(() => rcs.classList.add('rcs-settled'), fast ? 0 : 1400); } else rcs.classList.add('rcs-settled'); return; }
      if (fast) this.scrollTo(el, false);
      el.click();
    },
    setVal(el, v) { if (el.value === v) return; el.value = v; if (el.tagName === 'TEXTAREA') el.textContent = v; else el.setAttribute('value', v); el.dispatchEvent(new Event('input', { bubbles: true })); },
    tick(T, CUES) {
      if (!this.ready) return;
      const steps = this.resolve(CUES);
      const jump = T < this.lastT - 0.05 || T > this.lastT + 1.5 || this.lastT < 0;
      if (jump) {
        VT.fast = true; VT.list = []; VT.cleared = new Set(); VT.now = 0; this.anim = null; this.reset();
        for (const st of steps) { if (st.t > T) break; VT.now = st.t; flush(st.t); this.exec(st, true); this.done.add(st.i); }
        flush(T); VT.fast = false; materialize(T);
        const nx = steps.find((s) => !s.silent && s.t > T); const p = nx && this.pos(nx); if (p) this.cur = p;
      } else {
        for (const st of steps) if (st.t > this.lastT && st.t <= T && !this.done.has(st.i)) { this.exec(st, false); this.done.add(st.i); }
      }
      // tipeo progresivo
      for (const st of steps) if (st.type && st.t <= T && T < st.t + st.dur + 0.1) { const el = this.q(st.sel); if (el) this.setVal(el, st.whole ? (T >= st.t + st.dur * 0.5 ? st.type : el.value) : st.type.slice(0, Math.round(prog(T, st.t, st.dur) * st.type.length))); }
      this.lastT = T;
      this.cursorTick(T, steps);
    },
    pos(st) { const el = this.q(st.sel); if (!el) return null; const r = el.getBoundingClientRect(), h = this.host.getBoundingClientRect(); if (!r.width) return null; return { x: (r.left + r.width / 2 - h.left) / h.width * PW, y: (r.top + Math.min(r.height / 2, 40) - h.top) / h.height * PH }; },
    cursorTick(T, steps) {
      const c = this.cursor; if (!c) return;
      const vis = steps.filter((s) => !s.silent);
      const next = vis.find((s) => s.t > T), prev = [...vis].reverse().find((s) => s.t <= T);
      let show = 0;
      if (next && T >= next.t - 1.4) { show = prog(T, next.t - 1.0, 0.3); const el = this.q(next.sel); if (el && !this.scrolled.has(next.i)) { this.scrolled.add(next.i); this.scrollTo(el, true, T); } this.scrollTick(T); const p = this.pos(next); if (p) { const k = 0.16; this.cur = { x: this.cur.x + (p.x - this.cur.x) * k, y: this.cur.y + (p.y - this.cur.y) * k }; } }
      if (prev && T < prev.t + 0.8) show = Math.max(show, 1 - prog(T, prev.t + 0.5, 0.3));
      if (prev && next && next.t - prev.t < 3) show = 1;
      const press = prev ? 1 - prog(T, prev.t, 0.3) : 0, rip = prev ? prog(T, prev.t, 0.5) : 1;
      c.style.opacity = show; c.style.transform = `translate(${this.cur.x}px, ${this.cur.y}px)`;
      c.firstChild.style.transform = `translate(-50%,-50%) scale(${1 - 0.25 * press})`;
      const r = c.lastChild; r.style.opacity = 1 - rip; r.style.transform = `translate(-50%,-50%) scale(${0.6 + rip * 1.6})`;
    },
  };

  const CAPTIONS_I18N = {
    es: [
      ['MMS', '01', 'Llega el MMS', 'Cada semana el cliente recibe las ofertas de su tienda por mensaje. Un toque en el link y empieza.'],
      ['Ruleta', '02', 'Gira y gana', 'Al entrar al portal aparece la ruleta de premios. El cliente gira y gana sus primeros 25 puntos.'],
      ['Portal', '02', 'El portal de la tienda', 'Ofertas VIP, circular, lista, premios y sorteos en un solo lugar. El cliente toca "Start My List".'],
      ['Nombre', '03', 'Empieza con tu nombre', 'Sin app ni registro: el cliente escribe su nombre y recibe 100 puntos de regalo por su primera lista.'],
      ['Lista', '04', 'Arma tu lista', 'Elige las ofertas reales de la tienda y ve al instante cuánto ahorras y cuántos puntos ganas.'],
      ['WhatsApp', '05', 'Reserva tu lista por WhatsApp', 'Un toque y el cliente escribe a la tienda. El bot de Sweepstouch confirma su visita y le programa un recordatorio.'],
      ['Soporte', '05', 'O habla con la tienda', 'Con Customer support el cliente llama directo a un encargado, que da seguimiento y le reserva su lista de productos.'],
      ['Encuesta', '06', 'Opina y gana +50', 'Cuatro preguntas sobre la visita. Menos de un minuto y los puntos se suman al momento.'],
      ['Rapida', '07', 'Encuesta rápida +25', 'Un banner invita a calificar con estrellas. Diez segundos, cada semana.'],
      ['Premios', '08', 'Catálogo de premios', 'Catálogo real de la tienda con el progreso exacto hacia cada premio y el canje en dos toques.'],
      ['QR', '09', 'Completa tu perfil y genera tu QR', 'Cada dato suma +10 pts. Al terminar, el cliente guarda sus datos y recibe su código QR de retiro.'],
      ['Tienda', '10', 'Canjea en la tienda', 'El cliente va al supermercado y muestra el QR. Un encargado lo escanea desde su panel y el premio queda entregado.'],
    ],
    en: [
      ['MMS', '01', 'The MMS arrives', "Every week the shopper gets their store's deals by text. One tap on the link and it begins."],
      ['Ruleta', '02', 'Spin & win', 'Entering the portal, the prize wheel pops up. The shopper spins and wins their first 25 points.'],
      ['Portal', '02', 'The store portal', 'VIP deals, circular, list, rewards and sweepstakes in one place. The shopper taps "Start My List".'],
      ['Nombre', '03', 'Start with your name', 'No app, no sign-up: the shopper types their name and gets 100 gift points for their first list.'],
      ['Lista', '04', 'Build your list', 'Pick real store deals and instantly see how much you save and how many points you earn.'],
      ['WhatsApp', '05', 'Reserve your list on WhatsApp', 'One tap and the shopper messages the store. The Sweepstouch bot confirms the visit and schedules a reminder.'],
      ['Soporte', '05', 'Or talk to the store', 'With Customer support the shopper calls a store associate, who follows up and reserves their product list.'],
      ['Encuesta', '06', 'Share feedback, earn +50', 'Four questions about the visit. Under a minute, and points are added instantly.'],
      ['Rapida', '07', 'Quick survey +25', 'A banner invites a star rating. Ten seconds, every week.'],
      ['Premios', '08', 'Rewards catalog', "The store's real catalog, exact progress toward each reward, redemption in two taps."],
      ['QR', '09', 'Complete your profile and get your QR', 'Each field earns +10 pts. When done, the shopper saves their info and gets a pickup QR code.'],
      ['Tienda', '10', 'Redeem at the store', 'The shopper goes to the supermarket and shows the QR. A staff member scans it from their panel and the reward is marked delivered.'],
    ],
  };
  const COPY = {
    es: { tag1: 'Tu lista. Tu recibo. ', tag2: 'Tus puntos.', out1: 'Más ahorros. Más puntos. ', out2: 'Clientes que vuelven.', powered: 'POWERED BY SWEEPSTOUCH', home: 'Inicio', back: 'Atrás', repeat: 'Repetir', next: 'Siguiente', pause: 'Pausa', play: 'Reproducir', pick: 'Elige tu idioma', pickSub: 'Choose your language', start: 'Empezar' },
    en: { tag1: 'Your list. Your receipt. ', tag2: 'Your points.', out1: 'More savings. More points. ', out2: 'Shoppers who come back.', powered: 'POWERED BY SWEEPSTOUCH', home: 'Home', back: 'Back', repeat: 'Replay', next: 'Next', pause: 'Pause', play: 'Play', pick: 'Choose your language', pickSub: 'Elige tu idioma', start: 'Start' },
  };
  const VOICE = {
    Intro: { es: RES('audio_intro_es', './site/audio/intro-es.mp3'), en: RES('audio_intro_en', './site/audio/intro-en.mp3') },
    MMS: { es: RES('audio_mms_es', './site/audio/mms-es.mp3'), en: RES('audio_mms_en', './site/audio/mms-en.mp3') },
    Portal: { es: RES('audio_portal_es', './site/audio/portal-es.mp3'), en: RES('audio_portal_en', './site/audio/portal-en.mp3') },
    Nombre: { es: RES('audio_nombre_es', './site/audio/nombre-es.mp3'), en: RES('audio_nombre_en', './site/audio/nombre-en.mp3') },
    Lista: { es: RES('audio_lista_es', './site/audio/lista-es.mp3'), en: RES('audio_lista_en', './site/audio/lista-en.mp3') },
    Encuesta: { es: RES('audio_encuesta_es', './site/audio/encuesta-es.mp3'), en: RES('audio_encuesta_en', './site/audio/encuesta-en.mp3') },
    Rapida: { es: RES('audio_rapida_es', './site/audio/rapida-es.mp3'), en: RES('audio_rapida_en', './site/audio/rapida-en.mp3') },
    Premios: { es: RES('audio_premios_es', './site/audio/premios-es.mp3'), en: RES('audio_premios_en', './site/audio/premios-en.mp3') },
    QR: { es: RES('audio_qr_es', './site/audio/qr-es.mp3'), en: RES('audio_qr_en', './site/audio/qr-en.mp3') },
    Tienda: { es: RES('audio_tienda_es', './site/audio/tienda-es.mp3'), en: RES('audio_tienda_en', './site/audio/tienda-en.mp3') },
  };

  const STEP_ORDER = ['Intro', 'MMS', 'Ruleta', 'Portal', 'Nombre', 'Lista', 'WhatsApp', 'Soporte', 'Encuesta', 'Rapida', 'Premios', 'QR', 'Tienda', 'Cierre'];
  function StepBar({ CUES, T, total, dark, L, onHome, mob }) {
    const tl = useTimeline();
    const marks = STEP_ORDER.filter((n) => CUES[n] != null).map((n) => ({ n, t: CUES[n] }));
    const cur = Math.max(0, marks.reduce((k, m, i) => (T >= m.t - 0.01 ? i : k), 0));
    const go = (i) => {
      const m = marks[clamp(i, 0, marks.length - 1)]; if (!m) return;
      const t = m.t + 0.01;
      if (window.__RCS) window.__RCS.lastT = -1; // fuerza al director a reconstruir el estado del sitio
      try { tl.setPlaying(false); tl.setTime(t); } catch (e) {}
      const el = document.querySelector('[data-om-exportable-video-with-duration-secs]');
      if (el) el.dispatchEvent(new CustomEvent('data-om-seek-to-time-frame', { detail: { time: t, sync: true } }));
      setTimeout(() => { try { tl.setTime(t); tl.setPlaying(true); } catch (e) {} }, 60);
    };
    const stop = (e) => { e.stopPropagation(); e.preventDefault(); };
    const isPlaying = tl.playing || tl.extPlaying;
    const togglePlay = () => { try { tl.setPlaying(!isPlaying); } catch (e) {} };
    const btn = { width: mob ? 84 : 56, height: mob ? 84 : 56, borderRadius: mob ? 26 : 18, border: 'none', background: dark ? 'rgba(255,255,255,.08)' : 'rgba(24,24,27,.06)', color: dark ? '#fff' : INK, display: 'grid', placeItems: 'center', cursor: 'pointer', backdropFilter: 'blur(10px)', transition: 'background .15s, transform .1s' };
    const lbl = { position: 'absolute', left: 0, right: 0, bottom: mob ? -32 : -22, textAlign: 'center', font: `600 ${mob ? 17 : 12}px ${F}`, color: dark ? 'rgba(255,255,255,.55)' : INK2, letterSpacing: 1, textTransform: 'uppercase', whiteSpace: 'nowrap' };
    const Ico = ({ d }) => <svg width={mob ? 34 : 24} height={mob ? 34 : 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>;
    return (
      <div onPointerDown={stop} onMouseDown={stop} onClick={(e) => e.stopPropagation()} style={{ position: 'absolute', left: mob ? '50%' : 60, bottom: mob ? 70 : 60, transform: mob ? 'translateX(-50%)' : 'none', display: 'flex', alignItems: 'center', gap: mob ? 18 : 14, zIndex: 100, pointerEvents: 'auto' }}>
        <div style={{ position: 'relative' }}><button style={{ ...btn, marginRight: 10 }} onClick={onHome} title={L.home}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10" /><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" /></svg></button><span style={lbl}>{L.home}</span></div>
        <div style={{ position: 'relative' }}><button style={btn} onClick={() => go(cur - 1)} title={L.back}><Ico d="M15 5l-7 7 7 7" /></button><span style={lbl}>{L.back}</span></div>
        <div style={{ position: 'relative' }}><button style={{ ...btn, background: PINK, color: '#fff', boxShadow: `0 12px 30px ${PINK}55` }} onClick={() => go(cur)} title={L.repeat}><Ico d="M4 12a8 8 0 1 1 2.3 5.7M4 12V7m0 5h5" /></button><span style={lbl}>{L.repeat}</span></div>
        <div style={{ position: 'relative' }}><button style={btn} onClick={() => go(cur + 1)} title={L.next}><Ico d="M9 5l7 7-7 7" /></button><span style={lbl}>{L.next}</span></div>
        <div style={{ position: 'relative', marginLeft: 10 }}><button style={{ ...btn, background: isPlaying ? (dark ? 'rgba(255,255,255,.16)' : 'rgba(24,24,27,.12)') : PINK, color: isPlaying ? (dark ? '#fff' : INK) : '#fff' }} onClick={togglePlay} title={isPlaying ? L.pause : L.play}>{isPlaying ? <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4.5" height="16" rx="1.5" /><rect x="13.5" y="4" width="4.5" height="16" rx="1.5" /></svg> : <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l12-7.5z" /></svg>}</button><span style={lbl}>{isPlaying ? L.pause : L.play}</span></div>
        <div style={{ marginLeft: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ font: `800 15px ${F}`, color: dark ? '#fff' : INK }}>{cur + 1} / {marks.length} · {marks[cur] && marks[cur].n}</div>
          <div style={{ display: 'flex', gap: 5 }}>{marks.map((m, i) => <button key={m.n} onClick={() => go(i)} title={m.n} style={{ width: i === cur ? 30 : 10, height: 6, borderRadius: 3, border: 'none', padding: 0, cursor: 'pointer', background: i === cur ? PINK : i < cur ? (dark ? 'rgba(255,255,255,.5)' : INK2) : (dark ? 'rgba(255,255,255,.18)' : HAIR), transition: 'width .2s' }} />)}</div>
        </div>
      </div>
    );
  }

  function Voice({ T, CUES, lang, on }) {
    const tl = useTimeline();
    const ref = React.useRef(null);
    const active = tl.playing || tl.extPlaying;
    const cue = Object.keys(VOICE).map((k) => ({ k, t: CUES[k] ?? 0 })).sort((a, b) => b.t - a.t).find((c) => T >= c.t);
    const src = cue && VOICE[cue.k] && VOICE[cue.k][lang];
    const off = cue ? T - cue.t : 0;
    React.useEffect(() => {
      const a = ref.current; if (!a) return;
      if (!on || !src || !active) { a.pause(); return; }
      if (a.dataset.src !== src) { a.dataset.src = src; a.src = src; }
      const go = () => { if (Math.abs(a.currentTime - off) > 0.4) a.currentTime = Math.max(0, off); if (off < (a.duration || 999)) a.play().catch(() => {}); else a.pause(); };
      if (a.readyState >= 1) go(); else a.onloadedmetadata = go;
    }, [src, active, on, Math.floor(off * 2)]);
    return <audio ref={ref} preload="auto" style={{ display: 'none' }} />;
  }

  function Piece({ tweaks, lang, setLang, picked, onPick, onHome, mob }) {
    const SW = mob ? 1080 : 1920, SH = mob ? 1920 : 1080;
    const PXm = mob ? (SW - PW - 24) / 2 : PX, PYm = mob ? 1150 - (PH + 24) / 2 : PY, PS = mob ? 1.22 : 1;
    const { T, CUES, authoredTotal, scenes } = useComposition();
    const CAPTIONS = CAPTIONS_I18N[lang], L = COPY[lang];
    React.useEffect(() => { D.lang = lang; D.lastT = -1; }, [lang]);
    const hostRef = React.useRef(null), curRef = React.useRef(null), ltRef = React.useRef(null);
    React.useEffect(() => { D.init(hostRef.current, curRef.current).catch((e) => { D.err = String(e && e.stack || e); console.error('rcs init', e); }); }, []);
    React.useEffect(() => { try { D.tick(T, CUES); } catch (e) { console.error(e); } }, [T, CUES]);
    const Z = CUES.Cierre ?? authoredTotal - 5, END = authoredTotal;
    const dark = tweaks.theme !== 'claro';
    const BG = dark ? '#120C14' : '#FBF7F9', FG = dark ? '#FFFFFF' : INK, FG2 = dark ? 'rgba(255,255,255,.72)' : INK2;
    const order = CAPTIONS.map((c) => c[0]);
    const bounds = (name) => { const i = order.indexOf(name); const a = CUES[name] ?? 0; const nextName = i + 1 < order.length ? order[i + 1] : 'Cierre'; return [a, CUES[nextName] ?? Z]; };

    const WA = CUES.WhatsApp ?? 0, SP = CUES.Soporte ?? WA + 28, EN = CUES.Encuesta ?? SP + 14, Q = CUES.QR ?? 0, W = CUES.Premios ?? 0, TD = CUES.Tienda ?? Q + 28, M = CUES.MMS ?? 4;
    const mmsIn = Easing.easeOutBack(prog(T, M + 0.4, 0.7));
    const PT = CUES.Portal ?? M + 7;
    const RU = CUES.Ruleta ?? PT;
    const mmsOut = Easing.easeInOutCubic(prog(T, RU - 0.9, 0.6));
    const ltIn = Easing.easeOutCubic(prog(T, RU - 0.9, 0.6));
    const ruShade = fade(T, RU + 0.2, RU + 18.0, 0.6);
    const ruIn = Easing.easeOutCubic(prog(T, RU + 1.1, 0.35));
    const ruOut = Easing.easeInOutCubic(prog(T, RU + 17.5, 0.5));
    const wheelRef = React.useRef(null), ruPrev = React.useRef(-1);
    const [ruBox, setRuBox] = React.useState({ spin: null, claim: null });
    React.useEffect(() => {
      const f = wheelRef.current, prev = ruPrev.current; ruPrev.current = T;
      const doc = f && f.contentDocument; if (!doc) return;
      const box = (id) => { const e = doc.getElementById(id); if (!e) return null; const r = e.getBoundingClientRect(); return r.width ? { left: r.left, top: r.top + 44, width: r.width, height: r.height } : null; };
      if (T >= RU && T < RU + 18.8) { const b = { spin: box('spinBtn'), claim: box('wBtn') }; if (JSON.stringify(b) !== JSON.stringify(ruBox)) setRuBox(b); }
      if (T < RU + 3.2 && prev >= RU + 3.2) { try { f.contentWindow.location.reload(); } catch (e) {} return; }
      if (prev < RU + 3.2 && T >= RU + 3.2 && T < RU + 12) { const b = doc.getElementById('spinBtn'); if (b) b.click(); }
      if (prev < RU + 17.2 && T >= RU + 17.2 && T < RU + 18.3) { const b = doc.getElementById('wBtn'); if (b) b.click(); }
    }, [T]);
    const NM = CUES.Nombre ?? PT + 7;
    const ltPress = T >= NM - 0.8 && T < NM - 0.5;
    React.useEffect(() => { const w = ltRef.current && ltRef.current.contentWindow; if (w) w.postMessage({ type: 'lt-press', on: ltPress }, '*'); }, [ltPress]);
    React.useEffect(() => { const w = ltRef.current && ltRef.current.contentWindow; if (w) w.postMessage({ type: 'lt-lang', lang }, '*'); }, [lang, T >= RU - 0.8]);
    const ltOut = Easing.easeInOutCubic(prog(T, NM - 0.55, 0.5));
    const linkPress = T >= RU - 1.4 && T < RU - 1.1;
    const mmsScroll = 340 * Easing.easeInOutCubic(prog(T, RU - 6.0, 1.6));
    const cam = [[0, 1, 0, 0], [W + 2.6, 1, 0, 0], [W + 3.6, 1.32, -80, 210], [W + 9.6, 1.32, -80, 210], [W + 10.6, 1, 0, 0], [TD, 1, 0, 0], [TD + 0.1, 1, 0, 0]];
    const camAt = (k) => interpolate(cam.map((c) => c[0]), cam.map((c) => c[k]), Easing.easeInOutCubic)(T);
    const scale = PS * (mob ? 1 + (camAt(1) - 1) * 0.55 : camAt(1)), dx = camAt(2) * (mob ? 0.4 : 1), dy = camAt(3) * (mob ? 0.9 : 1);
    const rise = Easing.easeOutCubic(prog(T, M - 2.0, 1.3));
    const recede = Easing.easeInOutCubic(prog(T, Z, 1.4));
    const TDend = CUES.Cierre ?? TD + 12;
    const storeIn = Easing.easeInOutCubic(prog(T, TD + 0.2, 0.9));
    const storeOut = Easing.easeInOutCubic(prog(T, TD + 16.0, 0.7));
    const store = storeIn * (1 - storeOut);
    const beam = fade(T, TD + 6.0, TD + 13.5, 0.35);
    const beamT = (T - TD - 6.0) * 1.6;
    const scanned = T >= TD + 13.5;
    // ── WhatsApp ──
    const waIn = Easing.easeOutCubic(prog(T, WA - 1.4, 0.5)), waOut = Easing.easeInOutCubic(prog(T, EN - 0.1, 0.45));
    const chatIn = Easing.easeOutCubic(prog(T, WA + 4.4, 0.45)) * (1 - Easing.easeInOutCubic(prog(T, SP - 0.2, 0.45)));
    const spPress = T >= SP + 1.6 && T < SP + 1.9;
    const callIn = Easing.easeOutCubic(prog(T, SP + 2.0, 0.5));
    const callSecs = Math.max(0, Math.floor(T - (SP + 3.6)));
    const waPress = T >= WA + 4.0 && T < WA + 4.3;
    const chooseRef = React.useRef(null);
    const [waBox, setWaBox] = React.useState(null);
    React.useEffect(() => { const w = chooseRef.current && chooseRef.current.contentWindow; if (w) w.postMessage({ type: 'wa-press', on: waPress }, '*'); }, [waPress]);
    React.useEffect(() => { const w = chooseRef.current && chooseRef.current.contentWindow; if (w) w.postMessage({ type: 'wa-press', on: spPress, sel: 'a[href^="tel:"]' }, '*'); }, [spPress]);
    const [spBox, setSpBox] = React.useState(null);
    React.useEffect(() => { if (T < WA - 1.5 || T > SP + 2.2) return; const d = chooseRef.current && chooseRef.current.contentDocument; const a = d && d.querySelector('a[href^="tel:"]'); if (!a) return; const r = a.getBoundingClientRect(); const b = { left: r.left, top: r.top + 44, width: r.width, height: r.height }; if (!spBox || Math.abs(spBox.top - b.top) > 1) setSpBox(b); }, [T]);
    React.useEffect(() => { if (T < WA - 1.5 || T > WA + 4.5) return; const d = chooseRef.current && chooseRef.current.contentDocument; const a = d && d.querySelector('a[href^="https://wa.me"]'); if (!a) return; const r = a.getBoundingClientRect(); const f = chooseRef.current.getBoundingClientRect(); const k = f.width / PW || 1; const b = { left: r.left, top: r.top + 44, width: r.width, height: r.height }; if (!waBox || Math.abs(waBox.top - b.top) > 1) setWaBox(b); }, [T]);
    const WA_MSGS = [
      { t: WA + 6.6, me: true, text: 'Hello, I would like to reserve my list at Super Supermarket.' },
      { t: WA + 8.8, me: false, text: "Hi Sara👋\n\nThanks for shopping with Food Fresh Supermarket\n\nAre you visiting the store this week? Reply:\n\n1️⃣ Yes, I'm going this week\n2️⃣ Not sure yet\n3️⃣ Just browsing" },
      { t: WA + 13.6, me: true, text: '1' },
      { t: WA + 15.6, me: false, text: "Perfect! 🛒\n\nYour list is waiting for you at Super Supermarket 31 Memorial Dr, Paterson, NJ 07505.\n\nWhat day are you planning to go? Reply with the day (e.g. Saturday) and we'll send you a reminder" },
      { t: WA + 21.1, me: true, text: 'Friday night' },
      { t: WA + 23.0, me: false, text: "Got it! 📅 We'll send you a reminder on Friday morning.\n\nYour list at Super Supermarket 31 Memorial Dr, Paterson, NJ 07505 will be ready for you. See you there! 🛒" },
    ];
    const waTyping = [[WA + 7.2, WA + 8.8], [WA + 14.2, WA + 15.6], [WA + 21.7, WA + 23.0]].find(([a, b]) => T >= a && T < b);
    const waDraft = T < WA + 6.5 ? WA_MSGS[0].text : (T >= WA + 12.5 && T < WA + 13.5) ? '1' : (T >= WA + 19.5 && T < WA + 21.0) ? 'Friday night'.slice(0, Math.round(prog(T, WA + 19.5, 1.0) * 12)) : '';
    const waSendPress = [6.5, 13.5, 21.0].some((d) => T >= WA + d && T < WA + d + 0.25);
    const phoneY = ((1 - rise) * 1150 + recede * 1250 + store * 1250) * (mob ? 1.6 : 1);
    const wm = interpolate([M - 2.4, M - 1.4, Z + 0.6, Z + 1.8], [0, 1, 1, 0], Easing.easeInOutCubic)(T);
    const wmX = mob ? 540 : 960 + (330 - 960) * wm, wmY = mob ? 900 + (78 - 900) * wm : 540 + (110 - 540) * wm, wmS = mob ? 1.15 - 0.7 * wm : 1 - 0.5 * wm;
    const tagline = fade(T, 0.7, M - 1.8, 0.4);
    const outroTag = fade(T, Z + 1.2, END - 0.6, 0.4);

    return (
      <div style={{ position: 'absolute', inset: 0, background: BG, overflow: 'hidden', fontFamily: F, color: FG }}>
        <div style={{ position: 'absolute', left: 1180 + Math.sin(T * 0.35) * 60, top: -200 + Math.cos(T * 0.3) * 40, width: 900, height: 900, borderRadius: '50%', background: `radial-gradient(circle, ${PINK}${dark ? '55' : '33'}, transparent 62%)`, filter: 'blur(20px)' }} />
        <div style={{ position: 'absolute', left: -300 + Math.cos(T * 0.25) * 50, top: 500 + Math.sin(T * 0.4) * 50, width: 800, height: 800, borderRadius: '50%', background: `radial-gradient(circle, ${dark ? '#6B21A855' : '#F9A8D444'}, transparent 62%)`, filter: 'blur(20px)' }} />
        <img src={RES('logo', './sweepstouch-logo.png')} alt="Sweepstouch" style={{ position: 'absolute', left: wmX, top: wmY, width: 640, height: 152, objectFit: 'contain', transform: `translate(-50%,-50%) scale(${wmS})`, filter: dark ? `drop-shadow(0 12px 40px ${PINK}55)` : 'none' }} />
        <div style={{ position: 'absolute', left: mob ? 60 : 0, right: mob ? 60 : 0, top: mob ? 1030 : 625, textAlign: 'center', font: `500 ${mob ? 46 : 40}px ${F}`, lineHeight: 1.3, textWrap: 'balance', color: FG2, opacity: tagline, transform: `translateY(${(1 - tagline) * 20}px)` }}>{L.tag1}<span style={{ color: PINK, fontWeight: 800 }}>{L.tag2}</span></div>
        <div style={{ position: 'absolute', left: mob ? 60 : 0, right: mob ? 60 : 0, top: mob ? 1030 : 625, textAlign: 'center', textWrap: 'balance', opacity: outroTag, transform: `translateY(${(1 - outroTag) * 20}px)` }}>
          <div style={{ font: `500 ${mob ? 46 : 40}px ${F}`, lineHeight: 1.3, color: FG2 }}>{L.out1}<span style={{ color: PINK, fontWeight: 800 }}>{L.out2}</span></div>
        </div>

        {(() => {
          // agrupa por número: pasos que comparten número  usan una sola tarjeta y solo cambian el texto
          const groups = []; for (const c of CAPTIONS) { const g = groups.find((x) => x.n === c[1]); if (g) g.items.push(c); else groups.push({ n: c[1], items: [c] }); }
          const nums = groups.map((g) => g.n);
          return groups.map((g) => {
            const a0 = bounds(g.items[0][0])[0], b1 = bounds(g.items[g.items.length - 1][0])[1];
            const o = fade(T, a0 + 0.15, b1 - 0.15, 0.45); if (o <= 0) return null;
            const e = Easing.easeOutCubic(prog(T, a0 + 0.15, 0.7));
            return (
              <div key={g.n} style={{ position: 'absolute', left: mob ? 70 : 170, top: mob ? 140 : 290, width: mob ? 940 : 860, opacity: o, transform: `translateY(${(1 - e) * 40}px)` }}>
                <div style={{ font: `900 ${mob ? 96 : 150}px ${F}`, color: PINK, lineHeight: 0.9, letterSpacing: mob ? -4 : -6 }}>{g.n}</div>
                <div style={{ position: 'relative', height: mob ? 270 : 260 }}>
                  {g.items.map(([name, n, title, sub], i) => { const [ia, ib] = bounds(name); const io = g.items.length === 1 ? 1 : fade(T, i === 0 ? ia - 1 : ia, i === g.items.length - 1 ? ib + 1 : ib, 0.4); if (io <= 0) return null; return (
                    <div key={name} style={{ position: 'absolute', inset: 0, opacity: io, transform: `translateY(${(1 - io) * 14}px)` }}>
                      <div style={{ font: `900 ${mob ? 58 : 80}px ${F}`, letterSpacing: mob ? -2 : -3, lineHeight: 1, marginTop: mob ? 16 : 26, textWrap: 'balance' }}>{title}</div>
                      <div style={{ font: `400 ${mob ? 29 : 32}px ${F}`, color: FG2, lineHeight: 1.35, marginTop: mob ? 16 : 28, maxWidth: mob ? 940 : 760, textWrap: 'pretty' }}>{sub}</div>
                    </div>); })}
                </div>
                <div style={{ marginTop: 10, display: 'flex', gap: 10 }}>{nums.map((k) => <span key={k} style={{ width: k === g.n ? 48 : 14, height: 8, borderRadius: 4, background: k === g.n ? PINK : (dark ? 'rgba(255,255,255,.2)' : HAIR) }} />)}</div>
              </div>);
          });
        })()}

        {store > 0 && (
          <div style={{ position: 'absolute', left: mob ? 110 : 1010, top: mob ? 640 : 40, width: 860, height: 1000, opacity: store, transform: `translateY(${(1 - storeIn) * 80}px)`, pointerEvents: 'none' }}>
            <img src={RES('a_store_scan_png', './site/assets/store-scan.png')} alt="" style={{ position: 'absolute', left: 0, top: 0, width: 860, height: 1000, objectFit: 'contain' }} />
            {/* rayo del escáner: del gatillo (≈ x 415, y 300) a la pantalla del celular (≈ x 470, y 330) */}
            <div style={{ position: 'absolute', left: 408, top: 262, width: 70, height: 60, opacity: beam, transformOrigin: '0 50%', transform: `rotate(6deg) scaleX(${0.6 + 0.4 * (0.5 + 0.5 * Math.sin(beamT * 6))})`, background: 'linear-gradient(90deg, rgba(255,60,60,.0), rgba(255,60,60,.55) 40%, rgba(255,90,90,.85))', clipPath: 'polygon(0 45%, 100% 0, 100% 100%, 0 55%)', filter: 'blur(1px)' }} />

            {scanned && <div style={{ position: 'absolute', left: 430, top: 215, background: '#16A34A', color: '#fff', borderRadius: 999, padding: '9px 16px', font: `800 18px ${F}`, boxShadow: '0 12px 30px rgba(22,163,74,.45)', transform: `translateX(-50%) scale(${MOTIONpop(T, TD + 13.6)}) translateY(${(1 - MOTIONpop(T, TD + 13.6)) * 20}px)`, opacity: MOTIONpop(T, TD + 13.6), display: 'flex', alignItems: 'center', gap: 9, whiteSpace: 'nowrap' }}><span style={{ width: 22, height: 22, borderRadius: '50%', background: '#fff', color: '#16A34A', display: 'grid', placeItems: 'center', fontSize: 13, fontWeight: 900 }}>✓</span>{lang === 'es' ? 'QR validado' : 'QR validated'}</div>}
          </div>
        )}
        {tweaks.controls && <StepBar CUES={CUES} T={T} total={authoredTotal} dark={dark} L={L} onHome={onHome} mob={mob} />}
        <Voice T={T} CUES={CUES} lang={lang} on={tweaks.voice && picked} />
        <div style={{ position: 'absolute', left: PXm, top: PYm, width: PW + 24, height: PH + 24, opacity: 1 - recede, transform: `translate(${dx}px, ${dy + phoneY}px) scale(${scale})`, transformOrigin: '50% 50%' }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: 60, background: '#1C1B20', boxShadow: `0 40px 120px rgba(0,0,0,.55), 0 0 0 2px #3a3940, 0 0 80px ${PINK}33` }} />
          <div style={{ position: 'absolute', left: 12, top: 12, width: PW, height: PH, borderRadius: 48, overflow: 'hidden', background: '#F4F4F5' }}>
            <div ref={hostRef} style={{ position: 'absolute', inset: 0 }} />
            {T >= RU - 1.0 && ltOut < 1 && (
              <div style={{ position: 'absolute', inset: 0, background: '#fff', zIndex: 5400, opacity: 1 - ltOut, transform: `translateX(${(1 - ltIn) * 100}%) scale(${1 + ltOut * 0.08})`, overflow: 'hidden' }}>
                <iframe ref={ltRef} src="./site/portal/Portal.dc.html" title="Portal" style={{ position: 'absolute', left: 0, top: 44, width: PW, height: PH - 44, border: 0, background: '#fff', pointerEvents: 'none' }} />
                <div id="lt-cta" style={{ position: 'absolute', left: 34, top: 44 + 367, width: 154, height: 47, borderRadius: 999, pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 44, background: '#fff' }} />
                {T >= RU - 1 && T < RU + 18.2 && (
                  <React.Fragment>
                    <div style={{ position: 'absolute', left: 0, right: 0, top: 44, bottom: 0, background: '#000', opacity: 0.67 * ruShade, pointerEvents: 'none' }} />
                    <iframe ref={wheelRef} src="./site/portal/prize-wheel.html" title="Prize wheel" allowtransparency="true" style={{ position: 'absolute', left: 0, top: 44, width: PW, height: PH - 44, border: 0, background: 'transparent', colorScheme: 'light', pointerEvents: 'none', opacity: ruIn * (1 - ruOut), transform: `translateY(${(1 - ruIn) * 16 + ruOut * 20}px) scale(${0.97 + 0.03 * ruIn})` }} />
                    <div style={{ position: 'absolute', left: 10, top: 54, width: 40, height: 40, borderRadius: '50%', background: '#fff', border: '1px solid #ddd', color: '#333', fontSize: 28, lineHeight: '36px', textAlign: 'center', opacity: ruIn * (1 - ruOut), pointerEvents: 'none' }}>×</div>
                    <div id="ru-spin" style={{ position: 'absolute', pointerEvents: 'none', ...(ruBox.spin || { left: PW / 2 - 90, top: PH - 190, width: 180, height: 56 }) }} />
                    <div id="ru-claim" style={{ position: 'absolute', pointerEvents: 'none', ...(ruBox.claim || { left: PW / 2 - 90, top: PH - 170, width: 180, height: 56 }) }} />
                  </React.Fragment>
                )}
              </div>
            )}
            {T < RU - 0.2 && (
              <div style={{ position: 'absolute', inset: 0, background: '#fff', fontFamily: "-apple-system, 'SF Pro Text', 'Helvetica Neue', system-ui, sans-serif", color: '#000', zIndex: 5300, transform: `translateX(${-mmsOut * 30}%)`, overflow: 'hidden' }}>
                <div style={{ position: 'absolute', left: 0, right: 0, top: 0, transform: `translateY(${-mmsScroll}px)`, padding: '128px 14px 100px', display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start', opacity: Math.min(1, mmsIn) }}>
                  <div style={{ alignSelf: 'center', font: "500 11px -apple-system, 'SF Pro Text', 'Helvetica Neue', system-ui, sans-serif", color: '#8E8E93', marginBottom: 2 }}>Text Message · MMS · Today 9:41 AM</div>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 10, transform: `translateY(${(1 - Math.min(1, mmsIn)) * 40}px) scale(${0.9 + 0.1 * Math.min(1, mmsIn)})`, transformOrigin: '0 100%' }}>
                    <div style={{ width: 330, borderRadius: 20, overflow: 'hidden', background: '#E9E9EB', boxShadow: '0 1px 2px rgba(0,0,0,.06)' }}><img src={RES('a_mms_flyer_png', './site/assets/mms-flyer.png')} alt="" style={{ width: 330, height: 647, display: 'block' }} /></div>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#F2F2F7', display: 'grid', placeItems: 'center' }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0A84FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v12M7 10l5 5 5-5M4 17v3h16v-3" /></svg></div>
                  </div>
                  <div style={{ width: 350, background: '#E9E9EB', borderRadius: 20, padding: '11px 15px', font: "400 17px -apple-system, 'SF Pro Text', 'Helvetica Neue', system-ui, sans-serif", lineHeight: 1.3, whiteSpace: 'pre-line', position: 'relative' }}>
                    <b style={{ fontWeight: 700 }}>Food-Fresh Supermarket</b>{'🛒\n\n💎VIP BIG SALES!🎉\n\nHi Sara 👋\nStart saving 💰 and earning points ⭐\n👉'}<span id="mms-link1" style={{ color: '#0A84FF', textDecoration: 'underline', background: linkPress ? 'rgba(10,132,255,.2)' : 'transparent', borderRadius: 4 }}>swtrcs.com/s/UyZk9R</span>
                    {'\n\n📍Address: '}<span style={{ textDecoration: 'underline' }}>490 W 207th St, New York, NY 10034</span>
                    {'\n\nReply STOP to unsubscribe'}
                    <span style={{ position: 'absolute', left: -6, bottom: 0, width: 18, height: 18, background: '#E9E9EB', borderRadius: '0 0 18px 0', clipPath: 'polygon(0 100%, 100% 100%, 100% 0)' }} />
                  </div>
                </div>
                <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 112, background: 'rgba(249,249,249,.94)', backdropFilter: 'blur(14px)', borderBottom: '1px solid rgba(0,0,0,.12)' }}>
                  <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 44, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 26px 0 30px', font: "600 15px -apple-system, 'SF Pro Text', 'Helvetica Neue', system-ui, sans-serif" }}><span>9:41</span><span style={{ display: 'flex', gap: 5, alignItems: 'center' }}><span style={{ width: 17, height: 11, borderRadius: 2, border: '1.5px solid #000', display: 'block' }} /><span style={{ width: 25, height: 12, borderRadius: 3.5, border: '1.5px solid #000', position: 'relative', display: 'block' }}><span style={{ position: 'absolute', left: 2, top: 2, bottom: 2, width: 17, background: '#000', borderRadius: 1 }} /></span></span></div>
                  <div style={{ position: 'absolute', left: 14, top: 52, width: 36, height: 36, borderRadius: '50%', background: '#F2F2F7', display: 'grid', placeItems: 'center' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M15 5l-7 7 7 7" /></svg></div>
                  <div style={{ position: 'absolute', left: '50%', top: 48, transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(180deg,#A8B2CC,#8E99B8)', display: 'grid', placeItems: 'center' }}><svg width="26" height="26" viewBox="0 0 24 24" fill="#fff"><circle cx="12" cy="8" r="4.2" /><path d="M4 21c0-4.4 3.6-7.5 8-7.5s8 3.1 8 7.5z" /></svg></div>
                    <div style={{ font: "600 12px -apple-system, 'SF Pro Text', 'Helvetica Neue', system-ui, sans-serif" }}>+1 (855) 440-7056 <span style={{ color: '#8E8E93' }}>›</span></div>
                  </div>
                </div>
                <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 92, background: 'rgba(249,249,249,.96)', display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 14px 0' }}>
                  <span style={{ width: 38, height: 38, borderRadius: '50%', background: '#E9E9EB', display: 'grid', placeItems: 'center', font: "300 26px -apple-system, 'SF Pro Text', 'Helvetica Neue', system-ui, sans-serif", color: '#000' }}>+</span>
                  <span style={{ flex: 1, height: 38, borderRadius: 19, border: '1px solid #D1D1D6', background: '#fff', font: "400 16px -apple-system, 'SF Pro Text', 'Helvetica Neue', system-ui, sans-serif", color: '#8E8E93', display: 'flex', alignItems: 'center', padding: '0 14px' }}>Text Message · SMS</span>
                </div>
              </div>
            )}
            {T >= WA - 1.5 && waOut < 1 && (
              <div style={{ position: 'absolute', inset: 0, zIndex: 5800, background: '#fff', opacity: waIn * (1 - waOut), pointerEvents: 'none', overflow: 'hidden' }}>
                <iframe ref={chooseRef} src={'./site/portal/lista-choose.html?lang=' + (lang === 'es' ? 'es' : 'en')} title="Choose" style={{ position: 'absolute', left: 0, top: 44, width: PW, height: PH - 44, border: 0, background: '#fff', pointerEvents: 'none' }} />
                <div id="wa-btn" style={{ position: 'absolute', pointerEvents: 'none', ...(waBox || { left: 30, top: 560, width: PW - 60, height: 40 }) }} />
                <div id="sp-btn" style={{ position: 'absolute', pointerEvents: 'none', ...(spBox || { left: 30, top: 620, width: PW - 60, height: 40 }) }} />
                {callIn > 0 && (
                  <div style={{ position: 'absolute', inset: 0, zIndex: 3, background: 'linear-gradient(180deg,#FFF5FA 0%,#FFFFFF 55%)', transform: `translateY(${(1 - callIn) * 100}%)`, display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: F, color: INK }}>
                    <div style={{ marginTop: 78, font: `700 13px ${F}`, letterSpacing: 2, color: PINK, textTransform: 'uppercase' }}>{lang === 'es' ? 'Customer support' : 'Customer support'}</div>
                    <div style={{ marginTop: 8, font: `800 26px ${F}`, letterSpacing: -0.5 }}>Food Fresh Supermarket</div>
                    <div style={{ marginTop: 4, font: `500 15px ${F}`, color: INK2, fontVariantNumeric: 'tabular-nums' }}>{T < SP + 3.6 ? (lang === 'es' ? 'Llamando…' : 'Calling…') : `${String(Math.floor(callSecs / 60)).padStart(2, '0')}:${String(callSecs % 60).padStart(2, '0')}`}</div>
                    <div style={{ position: 'relative', width: PW, height: 250, marginTop: 44 }}>
                      <img src={RES('a_support_call_png', './site/assets/support-call.png')} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain' }} />
                      <div style={{ position: 'absolute', left: '50%', top: '44%', width: '21%', height: 74, transform: 'translate(-50%,-50%)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        {Array.from({ length: 9 }, (_, i) => { const live = T >= SP + 3.6 ? 1 : 0.18; const a = Math.abs(Math.sin(T * (5.2 + (i % 4) * 1.3) + i * 1.7)) * 0.7 + Math.abs(Math.sin(T * 2.1 + i)) * 0.3; const env = 1 - Math.abs(i - 4) / 6; return <span key={i} style={{ width: 5, borderRadius: 3, background: PINK, height: 8 + 64 * a * env * live }} />; })}
                      </div>
                    </div>
                    <div style={{ margin: '34px 34px 0', font: `400 16px ${F}`, color: INK2, lineHeight: 1.45, textAlign: 'center', textWrap: 'pretty', opacity: prog(T, SP + 4.0, 0.5) }}>{lang === 'es' ? 'Un encargado de la tienda da seguimiento y reserva tu lista de productos.' : 'A store associate follows up and reserves your product list.'}</div>
                    <div style={{ marginTop: 'auto', marginBottom: 64, display: 'flex', gap: 40 }}>
                      {[['M11 5 6 9H2v6h4l5 4V5z', '#F4F4F5', INK], ['M3 5.5a2 2 0 0 1 2-2h2.4l1.6 4-2 1.2a11 11 0 0 0 6.3 6.3l1.2-2 4 1.6V17a2 2 0 0 1-2 2A16 16 0 0 1 3 5.5z', '#EF4444', '#fff']].map(([d, bg, fg], i) => (
                        <div key={i} style={{ width: 64, height: 64, borderRadius: '50%', background: bg, display: 'grid', placeItems: 'center', transform: i === 1 ? 'rotate(135deg)' : 'none' }}><svg width="28" height="28" viewBox="0 0 24 24" fill={i === 1 ? fg : 'none'} stroke={fg} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg></div>
                      ))}
                    </div>
                  </div>
                )}
                {chatIn > 0 && (
                  <div style={{ position: 'absolute', inset: 0, background: '#EFE7DD', transform: `translateX(${(1 - chatIn) * 100}%)`, display: 'flex', flexDirection: 'column', fontFamily: "-apple-system, 'SF Pro Text', 'Helvetica Neue', system-ui, sans-serif", color: '#111B21' }}>
                    <div style={{ flex: 'none', background: '#F6F6F6', borderBottom: '1px solid rgba(0,0,0,.08)', padding: '52px 12px 10px', display: 'flex', alignItems: 'center', gap: 10 }}>
                      <svg width="14" height="22" viewBox="0 0 14 22" fill="none" stroke="#007AFF" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M11 3 3 11l8 8" /></svg>
                      <div style={{ width: 40, height: 40, borderRadius: '50%', background: PINK, color: '#fff', display: 'grid', placeItems: 'center', font: `900 20px ${F}` }}>S</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ font: "600 16px -apple-system, system-ui, sans-serif", display: 'flex', alignItems: 'center', gap: 5 }}>Food Fresh Supermarket <svg width="15" height="15" viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#25D366" /><path d="m7 12.5 3.2 3.2L17 9" stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
                        <div style={{ font: "400 12.5px -apple-system, system-ui, sans-serif", color: waTyping ? '#25D366' : '#667781' }}>{waTyping ? 'typing…' : 'online'}</div>
                      </div>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="14" height="12" rx="3" /><path d="m16 10 6-3v10l-6-3" /></svg>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" /></svg>
                    </div>
                    <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '8px 10px 6px', gap: 0 }}>
                      <div style={{ alignSelf: 'center', background: '#FFF6C9', color: '#54656F', font: '400 11.5px -apple-system, system-ui, sans-serif', borderRadius: 8, padding: '5px 10px', margin: '0 16px 8px', textAlign: 'center', lineHeight: 1.35 }}>🔒 Messages are end-to-end encrypted.</div>
                      {WA_MSGS.map((m, i) => { const e = prog(T, m.t, 0.35); if (e <= 0) return null; const k = Easing.easeOutCubic(e); return (
                        <div key={i} style={{ display: 'grid', gridTemplateRows: k + 'fr', flex: 'none' }}>
                          <div style={{ minHeight: 0, overflow: 'hidden', display: 'flex', justifyContent: m.me ? 'flex-end' : 'flex-start', paddingBottom: 6 }}>
                            <div style={{ maxWidth: '82%', background: m.me ? '#D9FDD3' : '#fff', borderRadius: m.me ? '12px 3px 12px 12px' : '3px 12px 12px 12px', padding: '7px 10px 6px', boxShadow: '0 1px 1px rgba(0,0,0,.1)', font: '400 15px -apple-system, system-ui, sans-serif', lineHeight: 1.35, whiteSpace: 'pre-wrap', opacity: k, transform: `translateY(${(1 - k) * 12}px) scale(${0.96 + 0.04 * k})`, transformOrigin: m.me ? '100% 100%' : '0 100%' }}>
                              {m.text}
                              <span style={{ float: 'right', display: 'inline-flex', alignItems: 'center', gap: 3, margin: '8px 0 -2px 10px', font: '400 11px -apple-system, system-ui, sans-serif', color: '#667781' }}>9:41{m.me && <svg width="16" height="11" viewBox="0 0 16 11" fill="none" stroke={T >= m.t + 1 ? '#53BDEB' : '#8696A0'} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="m1 6 3 3 6-7M6.5 9l1 .5L14 2" /></svg>}</span>
                            </div>
                          </div>
                        </div>); })}
                      {waTyping && (
                        <div style={{ display: 'flex', paddingBottom: 6 }}>
                          <div style={{ background: '#fff', borderRadius: '3px 12px 12px 12px', padding: '11px 14px', display: 'flex', gap: 4, boxShadow: '0 1px 1px rgba(0,0,0,.1)' }}>
                            {[0, 1, 2].map((d) => <span key={d} style={{ width: 7, height: 7, borderRadius: '50%', background: '#8696A0', opacity: 0.4 + 0.6 * Math.max(0, Math.sin((T - d * 0.18) * 7)) }} />)}
                          </div>
                        </div>
                      )}
                    </div>
                    <div style={{ flex: 'none', background: '#F6F6F6', borderTop: '1px solid rgba(0,0,0,.06)', padding: '8px 10px 26px', display: 'flex', alignItems: 'flex-end', gap: 8 }}>
                      <span style={{ fontSize: 26, color: '#007AFF', lineHeight: '36px', width: 24, textAlign: 'center' }}>+</span>
                      <div style={{ flex: 1, minHeight: 36, background: '#fff', border: '1px solid #E0E0E0', borderRadius: 18, padding: '8px 12px', font: '400 15px -apple-system, system-ui, sans-serif', lineHeight: 1.3, color: waDraft ? '#111B21' : '#8696A0' }}>{waDraft || 'Message'}</div>
                      <div id="wa-send" style={{ width: 36, height: 36, borderRadius: '50%', background: '#25D366', display: 'grid', placeItems: 'center', flex: 'none', transform: `scale(${waSendPress ? 0.86 : 1})`, opacity: waDraft ? 1 : 0.55 }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M3.4 20.4 21 12 3.4 3.6 3.4 10l12.6 2-12.6 2z" /></svg>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            <div ref={curRef} style={{ position: 'absolute', left: 0, top: 0, width: 0, height: 0, opacity: tweaks.cursor ? 0 : 0, pointerEvents: 'none', zIndex: 6000, display: tweaks.cursor ? 'block' : 'none' }}>
              <div style={{ position: 'absolute', width: 46, height: 46, borderRadius: '50%', background: 'rgba(255,255,255,.5)', border: '2px solid #fff', boxShadow: '0 4px 18px rgba(0,0,0,.35)', transform: 'translate(-50%,-50%)' }}><div style={{ position: 'absolute', left: '50%', top: '50%', width: 16, height: 16, marginLeft: -8, marginTop: -8, borderRadius: '50%', background: PINK }} /></div>
              <div style={{ position: 'absolute', width: 60, height: 60, borderRadius: '50%', border: `3px solid ${PINK}`, transform: 'translate(-50%,-50%)', opacity: 0 }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  function LangGate({ lang, onPick, dark, mob }) {
    const tl = useTimeline();
    React.useEffect(() => { tl.setPlaying(false); tl.setTime(0); }, []);
    const [hover, setHover] = React.useState(null);
    const BG = dark ? 'rgba(18,12,20,.96)' : 'rgba(251,247,249,.97)', FG = dark ? '#fff' : INK, FG2 = dark ? 'rgba(255,255,255,.7)' : INK2;
    const opt = (code, name, sub) => { const sel = lang === code, hv = hover === code; return (
      <button key={code} onMouseEnter={() => setHover(code)} onMouseLeave={() => setHover(null)} onClick={() => onPick(code)} style={{ width: 300, padding: '34px 30px', borderRadius: 28, border: `2px solid ${sel ? PINK : dark ? 'rgba(255,255,255,.14)' : HAIR}`, background: sel ? (dark ? 'rgba(252,6,128,.14)' : '#FFF0F7') : (dark ? 'rgba(255,255,255,.04)' : '#fff'), color: FG, cursor: 'pointer', textAlign: 'left', transform: hv ? 'translateY(-4px)' : 'none', transition: 'all .2s', boxShadow: sel ? `0 24px 60px ${PINK}44` : 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span style={{ font: `800 12px ${F}`, letterSpacing: 3, color: PINK }}>{code.toUpperCase()}</span>
        <span style={{ font: `900 44px ${F}`, letterSpacing: -1.5, lineHeight: 1 }}>{name}</span>
        <span style={{ font: `400 18px ${F}`, color: FG2 }}>{sub}</span>
        {sel && <span style={{ marginTop: 8, font: `700 13px ${F}`, color: PINK }}>{code === 'en' ? 'Default' : 'Predeterminado: English'}</span>}
      </button>); };
    return (
      <div style={{ position: 'absolute', inset: 0, background: BG, zIndex: 500, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 44, fontFamily: F }}>
        <img src={RES('logo', './sweepstouch-logo.png')} alt="Sweepstouch" style={{ width: 380, height: 90, objectFit: 'contain' }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ font: `900 54px ${F}`, color: FG, letterSpacing: -1.5 }}>Choose your language</div>
          <div style={{ font: `500 24px ${F}`, color: FG2, marginTop: 8 }}>Elige tu idioma</div>
        </div>
        <div style={{ display: 'flex', flexDirection: mob ? 'column' : 'row', gap: 24, transform: mob ? 'scale(1.5)' : 'none', transformOrigin: '50% 0', marginBottom: mob ? 300 : 0 }}>{opt('en', 'English', 'Watch the demo in English')}{opt('es', 'Español', 'Ver la demo en español')}</div>
      </div>
    );
  }

  function SweepsExplainer() {
    const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS);
    const [lang, setLang] = React.useState(() => { try { return localStorage.getItem('swt-demo-lang') || 'en'; } catch (e) { return 'en'; } });
    const [picked, setPicked] = React.useState(false);
    const stageRef = React.useRef(null);
    const onPick = (code) => { setLang(code); try { localStorage.setItem('swt-demo-lang', code); } catch (e) {} setPicked(true); setTimeout(() => { const el = document.querySelector('[data-om-exportable-video-with-duration-secs]'); if (el) el.dispatchEvent(new CustomEvent('data-om-seek-to-time-frame', { detail: { time: 0, sync: true } })); window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space', bubbles: true })); }, 50); };
    const dark = t.theme !== 'claro';
    const [narrow, setNarrow] = React.useState(() => window.innerWidth < 760 || window.innerHeight > window.innerWidth * 1.1);
    React.useEffect(() => { const f = () => setNarrow(window.innerWidth < 760 || window.innerHeight > window.innerWidth * 1.1); window.addEventListener('resize', f); return () => window.removeEventListener('resize', f); }, []);
    const fmt = t.formato || 'auto';
    const mob = fmt === 'móvil' || (fmt === 'auto' && narrow);
    return (
      <React.Fragment>
        <CompositionStage width={mob ? 1080 : 1920} height={mob ? 1920 : 1080} scenes={window.OM_SCENES} playback={window.OM_PLAYBACK} bg="#120C14">
          <Piece tweaks={t} lang={lang} setLang={setLang} picked={picked} onPick={onPick} onHome={() => setPicked(false)} mob={mob} />
          {!picked && t.gate && <LangGate lang={lang} onPick={onPick} dark={dark} mob={mob} />}
        </CompositionStage>
        <TweaksPanel>
          <TweakSection label="Video" />
          <TweakRadio label="Formato" value={fmt} options={['auto', 'escritorio', 'móvil']} onChange={(v) => setTweak('formato', v)} />
          <TweakRadio label="Fondo" value={t.theme} options={['oscuro', 'claro']} onChange={(v) => setTweak('theme', v)} />
          <TweakToggle label="Mostrar cursor" value={t.cursor} onChange={(v) => setTweak('cursor', v)} />
          <TweakToggle label="Controles de paso" value={t.controls} onChange={(v) => setTweak('controls', v)} />
          <TweakToggle label="Selector de idioma al inicio" value={t.gate} onChange={(v) => setTweak('gate', v)} />
          <TweakToggle label="Voz en off" value={t.voice} onChange={(v) => setTweak('voice', v)} />
          <TweakRadio label="Idioma" value={lang} options={['en', 'es']} onChange={(v) => { setLang(v); setPicked(true); }} />
          <TweakSection label="Editor" />
          <TweakToggle label="Motion editor" value={t.motionEditor} onChange={(v) => setTweak('motionEditor', v)} />
        </TweaksPanel>
      </React.Fragment>
    );
  }
  window.SweepsExplainer = SweepsExplainer;
})();
