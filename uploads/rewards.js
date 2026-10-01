/* Pantalla de Premios (puntos) — demo estática. Misma UI y animaciones que
   app/rewards/[customerId] del linktree, sin backend: todo vive en App.state. */
(function () {
  const C = {
    es: {
      title: "Puntos", availablePoints: "Mis puntos disponibles",
      balanceHelp: "Saldo actual acumulado por compras y una barra de progreso hacia tu próximo premio.",
      rewardReady: "Premio listo", toNext: (n) => `Te faltan ${n} pts para tu próximo premio`, rewardAvailable: "¡Ya puedes canjear un premio!",
      catalogTitle: "Productos para redimir", available: (n) => `${n} disponibles`,
      catalogSub: "Catálogo de premios y los puntos exactos que te faltan para llevarte cada uno.",
      avail: "Disponible", toGo: (n) => `Faltan ${n}`, redeem: "Redimir", enough: "Tienes suficientes puntos",
      need: (n) => `Te faltan ${n} pts para llevártelo.`, details: "Ver detalle ›",
      history: "Historial de canjes", claims: (n) => `${n} ${n === 1 ? "canje" : "canjes"}`,
      pending: "Pendiente de validación", rejected: "Rechazado", delivered: "Entregado", showQr: "Ver QR",
      disclaimerTitle: "PARA REDIMIR PREMIOS",
      disclaimer: "Canjea tu premio aquí y te damos un QR. Muéstralo en caja: lo escanean y te entregan tu premio. Mientras no lo escaneen, lo encuentras en tu historial.",
      nav: ["Inicio", "Circular", "Lista", "Recetas", "Puntos"],
      success: (n) => `"${n}" canjeado con éxito!`,
      // detalle
      redeemReward: "Canjear premio", close: "Cerrar", validUntil: "Vigente hasta el ", cost: "Costo del premio", value: "Valor en tienda",
      after: "Puntos después del canje", afterNo: (n) => `Te faltan ${n} pts. Sigue armando listas y escaneando recibos.`,
      deducted: (n) => `Se descontarán ${n} puntos`, qrNote: "Se generará un código QR para retirarlo en caja.", confirm: "Confirmar canje",
      // stepper
      qrReady: "Preparemos tu QR", back: "Atrás", stepOf: (a, b) => `Paso ${a} de ${b}`, pct: (n) => `${n}% completado`,
      forStep: "por completar este paso", alreadyPaid: "Ya sumaste los puntos de este dato", soFar: "acumulados", allDone: "¡Todo listo!",
      sub: "Un par de datos y te generamos el código. Así te enviamos ofertas para ti y tu familia.",
      savedNote: "Ya lo tenemos. Revisa que esté bien y corrígelo si hace falta.",
      next: "Continuar", submit: "Guardar y generar mi QR", skip: "Saltar por ahora",
      privacy: "Tus datos son privados y solo se usan para enviarte promociones de tu supermercado.",
      required: "Completa este campo", invalidEmail: "Correo no válido", invalidZip: "Son 5 dígitos",
      steps: {
        email: ["Tu correo", "Ahí te avisamos de tus premios y promociones.", "Correo electrónico"],
        address: ["Tu dirección", "Nos sirve para mandarte ofertas de tu zona.", "Dirección"],
        zip: ["Tu código postal", "Con esto te mandamos las ofertas de tu zona.", "Código postal"],
        birthday: ["Tu cumpleaños", "Te mandamos un regalo la semana antes.", "Elige la fecha"],
        nationality: ["Tu nacionalidad", "Para recomendarte productos de tu cocina.", "Escribe o elige tu nacionalidad"],
        household: ["Tu grupo familiar", "Cuántas personas viven contigo, contándote a ti.", ""],
        review: ["Revisa tus datos", "Si algo está mal, vuelve atrás y corrígelo.", ""],
      },
      rv: { name: "Nombre", email: "Correo electrónico", address: "Dirección", birthday: "Cumpleaños", nationality: "Nacionalidad", household: "Personas en el hogar", saved: "ya guardado", years: (n) => `${n} años` },
      // qr
      celebrate: "¡Premio canjeado!", used: (n) => `Usaste ${n} pts`, showMyQr: "Ver mi QR",
      pendingChip: "Validación pendiente", pickupCode: "Código de retiro", copied: "Copiado", copy: "Copiar código",
      s1: "Ve a la caja", s2: "Muestra este QR", s3: "Recoge tu premio", bright: "Sube el brillo de tu pantalla para escanear más rápido.", done: "Listo",
      deliveredT: "¡Premio entregado!", deliveredP: "Tu canje fue validado en la tienda. ¡Disfrútalo!",
      rejectedT: "Canje rechazado", rejectedP: "La tienda rechazó este canje y tus puntos volvieron a tu saldo.",
      simulate: "Demo · simular escaneo en caja",
    },
    en: {
      title: "Points", availablePoints: "My available points",
      balanceHelp: "Your current balance from purchases and progress toward your next reward.",
      rewardReady: "Reward ready", toNext: (n) => `${n} pts to your next reward`, rewardAvailable: "You can redeem a reward!",
      catalogTitle: "Rewards to redeem", available: (n) => `${n} available`,
      catalogSub: "Reward catalog and the exact points you still need for each item.",
      avail: "Available", toGo: (n) => `${n} to go`, redeem: "Redeem", enough: "You have enough points",
      need: (n) => `You need ${n} more pts to get it.`, details: "See details ›",
      history: "Redemption history", claims: (n) => `${n} ${n === 1 ? "redemption" : "redemptions"}`,
      pending: "Pending validation", rejected: "Rejected", delivered: "Delivered", showQr: "Show QR",
      disclaimerTitle: "TO REDEEM REWARDS",
      disclaimer: "Redeem your reward here and get a QR. Show it at checkout: staff scans it and hands you your reward. Until it is scanned, you can find it in your history.",
      nav: ["Home", "Flyer", "List", "Recipes", "Points"],
      success: (n) => `"${n}" redeemed successfully!`,
      redeemReward: "Redeem reward", close: "Close", validUntil: "Valid until ", cost: "Reward cost", value: "Retail value",
      after: "Points after redemption", afterNo: (n) => `${n} pts to go. Keep building lists and scanning receipts.`,
      deducted: (n) => `${n} points will be deducted`, qrNote: "A QR code will be generated for pickup at checkout.", confirm: "Confirm redemption",
      qrReady: "Let's get your QR ready", back: "Back", stepOf: (a, b) => `Step ${a} of ${b}`, pct: (n) => `${n}% complete`,
      forStep: "for completing this step", alreadyPaid: "You already earned points for this one", soFar: "so far", allDone: "All set!",
      sub: "A couple of details and we'll create your code. That's how we send offers for you and your family.",
      savedNote: "We already have this. Check it and fix it if needed.",
      next: "Continue", submit: "Save and get my QR", skip: "Skip for now",
      privacy: "Your data is private and only used to send you promotions from your supermarket.",
      required: "Required", invalidEmail: "Invalid email", invalidZip: "5 digits",
      steps: {
        email: ["Your email", "That's where we send your rewards and promos.", "Email"],
        address: ["Your address", "So we can send offers near you.", "Address"],
        zip: ["Your ZIP code", "That's how we send offers near you.", "ZIP code"],
        birthday: ["Your birthday", "We send you a gift the week before.", "Pick the date"],
        nationality: ["Your nationality", "To recommend products from your cuisine.", "Type or pick your nationality"],
        household: ["Your group family", "How many people live with you, including you.", ""],
        review: ["Review your details", "If something is off, go back and fix it.", ""],
      },
      rv: { name: "Name", email: "Email", address: "Address", birthday: "Birthday", nationality: "Nationality", household: "People at home", saved: "saved", years: (n) => `${n} years old` },
      celebrate: "Reward redeemed!", used: (n) => `You used ${n} pts`, showMyQr: "Show my QR",
      pendingChip: "Pending validation", pickupCode: "Pickup code", copied: "Copied", copy: "Copy code",
      s1: "Go to checkout", s2: "Show this QR", s3: "Collect your reward", bright: "Turn up your screen brightness to scan faster.", done: "Done",
      deliveredT: "Reward delivered!", deliveredP: "Your redemption was validated at the store. Enjoy it!",
      rejectedT: "Redemption rejected", rejectedP: "The store rejected this redemption and your points went back to your balance.",
      simulate: "Demo · simulate checkout scan",
    },
  };

  const NATIONALITIES = [["mexicana","Mexicana","Mexican"],["dominicana","Dominicana","Dominican"],["puertorriqueña","Puertorriqueña","Puerto Rican"],["cubana","Cubana","Cuban"],["colombiana","Colombiana","Colombian"],["salvadoreña","Salvadoreña","Salvadoran"],["guatemalteca","Guatemalteca","Guatemalan"],["hondureña","Hondureña","Honduran"],["venezolana","Venezolana","Venezuelan"],["ecuatoriana","Ecuatoriana","Ecuadorian"],["peruana","Peruana","Peruvian"],["estadounidense","Estadounidense","American"],["nicaragüense","Nicaragüense","Nicaraguan"],["costarricense","Costarricense","Costa Rican"],["panameña","Panameña","Panamanian"],["argentina","Argentina","Argentinian"],["chilena","Chilena","Chilean"],["boliviana","Boliviana","Bolivian"],["uruguaya","Uruguaya","Uruguayan"],["paraguaya","Paraguaya","Paraguayan"],["brasileña","Brasileña","Brazilian"],["española","Española","Spanish"],["haitiana","Haitiana","Haitian"],["jamaiquina","Jamaiquina","Jamaican"]];
  const POINTS_PER_FIELD = 10;
  const ICON = {
    star: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FC0680" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
    home: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A1A1AA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
    circ: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A1A1AA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
    cart: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A1A1AA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>',
    rec: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A1A1AA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
    gift: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FC0680" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M5 12v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8"/><line x1="12" y1="8" x2="12" y2="21"/><path d="M12 8H7.5a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8Z"/><path d="M12 8h4.5a2.5 2.5 0 0 0 0-5C13 3 12 8 12 8Z"/></svg>',
    info: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C4046A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
    qr: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3M21 14v.01M17 21h4v-4M14 21v.01"/></svg>',
    check: '<svg width="20" height="20" viewBox="0 0 24 24" fill="#FC0680"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-1.6 14.4-3.9-3.9 1.4-1.4 2.5 2.5 5.7-5.7 1.4 1.4z"/></svg>',
    checkGrey: '<svg width="20" height="20" viewBox="0 0 24 24" fill="#A1A1AA"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-1.6 14.4-3.9-3.9 1.4-1.4 2.5 2.5 5.7-5.7 1.4 1.4z"/></svg>',
    checkW: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FC0680" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    clock: '<svg width="22" height="22" viewBox="0 0 24 24" fill="#18181B"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm.5 5v5.3l4.3 2.6-.8 1.2-5-3V7z"/></svg>',
    stars: '<svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm3.4 15.2L12 15.1l-3.4 2.1.9-3.9-3-2.6 4-.3L12 6.7l1.5 3.7 4 .3-3 2.6z"/></svg>',
    starsBig: '<svg width="30" height="30" viewBox="0 0 24 24" fill="#fff"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm3.4 15.2L12 15.1l-3.4 2.1.9-3.9-3-2.6 4-.3L12 6.7l1.5 3.7 4 .3-3 2.6z"/></svg>',
    arrowBack: '<svg width="19" height="19" viewBox="0 0 24 24" fill="#18181B"><path d="M20 11H7.8l5.6-5.6L12 4l-8 8 8 8 1.4-1.4L7.8 13H20z"/></svg>',
    checkS: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FC0680" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    lock: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>',
    copy: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>',
    sun: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    stepIcon: {
      email: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M16 12v1.5a2.5 2.5 0 0 0 5 0V12a9 9 0 1 0-3.5 7.1"/></svg>',
      address: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/></svg>',
      zip: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>',
      birthday: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 21h16M5 21v-6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v6M5 17c2 1.5 3 1.5 5 0s3-1.5 5 0 3 1.5 4 0M12 9V6M12 3c.7 1 .7 2 0 3"/><rect x="8" y="9" width="8" height="4" rx="1"/></svg>',
      nationality: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"/></svg>',
      household: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="9" cy="8" r="3"/><circle cx="16.5" cy="9" r="2.5"/><path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6M15 14.5c2.8 0 5 2 5 5"/></svg>',
      review: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 9h8M8 13h5M8 17l1.5 1.5L13 15"/></svg>',
    },
  };
  const STEP_ILLO = { email: 1, address: 2, zip: 3, birthday: 4, nationality: 5, household: 6, review: 7 };
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const loc = () => (App.state.lang === "es" ? "es-US" : "en-US");
  const fmt = (n) => Number(n).toLocaleString(loc());
  const newCode = () => "RW-" + Array.from({ length: 8 }, () => "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[Math.floor(Math.random() * 32)]).join("");

  // Estado local de la pantalla (hojas abiertas, paso del stepper, etc.)
  const L = { selected: null, gate: null, qr: null, success: "", showHistory: true, fresh: false };

  function render(root) {
    const t = C[App.state.lang], st = App.state;
    const rewards = [...st.rewards].sort((a, b) => b.pointsCost - a.pointsCost);
    const goal = rewards[rewards.length - 1]?.pointsCost || 500;
    const avail = st.points.available;
    const pct = Math.min((avail / goal) * 100, 100);
    const countAvail = rewards.filter((r) => avail >= r.pointsCost).length;
    const toGo = Math.max(goal - avail, 0);

    root.innerHTML = `
<div class="rw-page">
  <div class="rw-header">
    <button class="rw-back" data-go="home"><span class="chev">‹</span><span>${t.title}</span></button>
    <div class="lang-pill">${["en", "es"].map((l) => `<button data-lang="${l}" class="${st.lang === l ? "on" : ""}">${l.toUpperCase()}</button>`).join("")}</div>
  </div>

  <div class="rw-hero">
    <span class="rw-wedge"></span>
    <img src="assets/rewards/star-1.webp" alt="" class="rw-star-a">
    <img src="assets/rewards/star-2.webp" alt="" class="rw-star-b">
    <img src="assets/rewards/gift.webp" alt="" class="rw-gift">
    <div class="rw-hero-text">
      <div class="rw-in rw-eyebrow">${t.availablePoints}</div>
      <div class="rw-in rw-help" style="animation-delay:.1s">${t.balanceHelp}</div>
      <div class="rw-in" style="margin-top:10px;animation-delay:.3s"><span class="rw-shine rw-num">${fmt(avail)}</span></div>
      ${avail >= goal ? `<span class="rw-in rw-ready" style="animation-delay:.9s"><span class="rw-dot"></span>${t.rewardReady}</span>` : ""}
      <div class="rw-in rw-next" style="animation-delay:1.1s">${toGo > 0 ? t.toNext(fmt(toGo)) : t.rewardAvailable}</div>
    </div>
    <div class="rw-track"><div class="rw-bar" style="width:${pct}%"></div></div>
  </div>

  ${L.success ? `<div class="rw-success">${ICON.check}<span>${esc(L.success)}</span></div>` : ""}

  <div class="rw-cat-head">
    <div class="row"><h2>${t.catalogTitle}</h2><span class="rw-count"><i></i>${t.available(countAvail)}</span></div>
    <div class="sub">${t.catalogSub}</div>
  </div>

  <div class="rw-cards">
    ${rewards.map((r, i) => {
      const can = avail >= r.pointsCost, need = r.pointsCost - avail;
      return `<div class="rw-card" role="button" tabindex="0" data-open="${r.id}" style="animation-delay:${Math.min(i, 6) * 0.06 + 0.15}s">
        <div class="top">
          <div class="tile"><img src="${r.img}" alt="" onerror="this.src='assets/rewards/gift.webp'"></div>
          <div class="body">
            <div class="name">${esc(r.name)}</div>
            ${r.brand || r.weight ? `<div class="bw">${[r.brand, r.weight].filter(Boolean).map(esc).join(" · ")}</div>` : ""}
            <div class="meta"><span class="cost">${fmt(r.pointsCost)} pts</span><span class="pill ${can ? "ok" : "no"}"><i></i>${can ? t.avail : t.toGo(fmt(need))}</span></div>
          </div>
          ${can ? `<button class="rw-redeem" data-open="${r.id}">${t.redeem}</button>` : ""}
        </div>
        <div class="bottom">
          <span class="left">${can ? ICON.check + `<span>${t.enough}</span>` : `<span class="ell">${esc(r.description || t.need(fmt(need)))}</span>`}</span>
          <span class="right">${t.details}</span>
        </div>
      </div>`;
    }).join("")}
  </div>

  ${st.claims.length ? `
  <button class="rw-hist-toggle" data-toggle-history aria-expanded="${L.showHistory}">
    <span class="l">${ICON.clock}<span>${t.history}</span></span>
    <span class="r">${t.claims(st.claims.length)} <span class="chev" style="transform:rotate(${L.showHistory ? 90 : 0}deg)">›</span></span>
  </button>
  ${L.showHistory ? `<div class="rw-hist">${st.claims.map((c, i) => {
    const rej = c.status === "rejected" || c.status === "cancelled", pend = c.status === "pending";
    const label = pend ? t.pending : rej ? t.rejected : t.delivered;
    const date = new Date(c.claimedAt).toLocaleDateString(loc(), { month: "short", day: "numeric", year: "numeric" });
    return `<div class="rw-row ${i === 0 && L.fresh ? "fresh" : ""}" ${pend ? `role="button" tabindex="0" data-qr="${c.id}"` : ""}>
      <div class="tile"><img src="${c.img}" alt="" onerror="this.replaceWith(document.createRange().createContextualFragment(ICON_STAR))"></div>
      <div class="body">
        <div class="name">${esc(c.name)}</div>
        <div class="meta"><span class="date">${date}</span><span class="pill ${pend ? "pend" : "grey"}"><i></i>${label}</span><span class="pts ${rej ? "strike" : ""}">−${fmt(c.pointsSpent)} pts</span></div>
      </div>
      ${pend ? `<span class="rw-showqr">${ICON.qr}${t.showQr}</span>` : ""}
    </div>`;
  }).join("")}</div>` : ""}` : ""}

  <div class="rw-disc"><div class="h">${ICON.info}${t.disclaimerTitle}</div><div class="b">${t.disclaimer}</div></div>
  <div class="rw-footer">POWERED BY SWEEPSTOUCH</div>
</div>

<nav class="rw-nav">
  ${[["home", ICON.home], ["circular", ICON.circ], ["list", ICON.cart], ["recipes", ICON.rec], ["rewards", ICON.star]].map(([k, ic], i) =>
    `<button data-go="${k}" class="${i === 4 ? "active" : ""}">${ic}<span>${i === 4 ? "• " : ""}${t.nav[i]}</span></button>`).join("")}
</nav>
${L.selected && !L.gate && !L.qr ? renderDetail(t, rewards.find((r) => r.id === L.selected), avail) : ""}
${L.gate ? renderGate(t) : ""}
${L.qr ? renderQr(t) : ""}
<div id="rw-burst"></div>`;

    bind(root, t, rewards, avail);
  }

  /* ─── Detalle del premio ─── */
  function renderDetail(t, r, avail) {
    const can = avail >= r.pointsCost, need = r.pointsCost - avail;
    return `<div class="scrim" data-close-detail>
      <div class="rw-sheet" role="dialog" aria-modal="true" onclick="event.stopPropagation()">
        <div class="sh"><div class="handle"></div><div class="row"><span class="eyebrow">${t.redeemReward}</span><button class="x" data-close-detail>×</button></div></div>
        <div class="sb">
          <div class="prod">
            <div class="tile"><img src="${r.img}" alt="" onerror="this.src='assets/rewards/gift.webp'"></div>
            <div>
              <h3>${esc(r.name)}</h3>
              ${r.brand || r.weight ? `<div class="bw">${[r.brand, r.weight].filter(Boolean).map(esc).join(" · ")}</div>` : ""}
              <span class="avail">${can ? ICON.check : ICON.checkGrey}${can ? t.avail : t.toGo(fmt(need))}</span>
              ${r.validUntil ? `<span class="valid">${t.validUntil}${new Date(r.validUntil).toLocaleDateString(loc(), { day: "numeric", month: "short" })}</span>` : ""}
            </div>
          </div>
          <div class="grid ${r.priceUSD ? "two" : ""}">
            <div class="cell l">${ICON.gift}<div><div class="lbl">${t.cost}</div><div class="val">${fmt(r.pointsCost)} pts</div></div></div>
            ${r.priceUSD ? `<div class="cell r"><div class="lbl">${t.value}</div><div class="val">$${r.priceUSD.toFixed(2)}</div></div>` : ""}
          </div>
          <div class="delta">
            <div class="eyebrow">${can ? t.after : t.afterNo(fmt(need))}</div>
            ${can ? `<div class="nums"><span class="a">${fmt(avail)}</span><span class="arr">→</span><span class="b">${fmt(avail - r.pointsCost)}</span></div><div class="ded">${t.deducted(fmt(r.pointsCost))}</div>`
                  : `<div class="mini"><div style="width:${Math.min((avail / r.pointsCost) * 100, 100)}%"></div></div>`}
          </div>
          ${r.description ? `<p class="desc">${esc(r.description)}</p>` : ""}
          <div class="qrnote"><span class="i">i</span><span>${t.qrNote}</span></div>
        </div>
        <div class="actions">
          <button class="ghost" data-close-detail>${t.close}</button>
          ${can ? `<button class="primary" data-confirm="${r.id}"><span class="ck">${ICON.checkW}</span>${t.confirm}</button>` : ""}
        </div>
      </div>
    </div>`;
  }

  /* ─── Stepper del perfil ─── */
  function gateSteps() {
    const t = C[App.state.lang], p = App.state.profile;
    const keys = ["email", "address", "zip", "birthday", "nationality", "household", "review"];
    return keys.map((k) => ({
      key: k, title: t.steps[k][0], help: t.steps[k][1], ph: t.steps[k][2],
      optional: ["birthday", "nationality", "household"].includes(k),
      field: k === "review" ? null : k,
      locked: k !== "review" && !!String(p.saved[k] ?? "").trim(),
    }));
  }
  function renderGate(t) {
    const g = L.gate, steps = gateSteps(), total = steps.length, cur = steps[g.step], isLast = g.step === total - 1;
    const p = App.state.profile, f = g.form;
    const pays = cur.field && !cur.locked;
    const fieldHtml = () => {
      const err = g.touched && g.error ? `<span class="err" role="alert">${g.error}</span>` : "";
      switch (cur.key) {
        case "email": return `<div class="fld"><label>${cur.ph}</label><input type="email" inputmode="email" data-f="email" value="${esc(f.email)}"></div>${err}`;
        case "address": return `<div class="fld"><label>${cur.ph}</label><textarea rows="2" data-f="address">${esc(f.address)}</textarea></div>${err}`;
        case "zip": return `<div class="fld"><label>${cur.ph}</label><input inputmode="numeric" maxlength="5" placeholder="00000" class="zip" data-f="zip" value="${esc(f.zip)}"></div>${err}`;
        case "birthday": return `<div class="fld"><input type="date" data-f="birthday" value="${esc(f.birthday)}" max="${new Date(Date.now() - 13 * 365.25 * 864e5).toISOString().slice(0, 10)}"></div>`;
        case "nationality": return `<div class="fld"><label>${t.rv.nationality}</label><input list="nat-list" placeholder="${cur.ph}" data-f="nationality" value="${esc(f.nationality)}"><datalist id="nat-list">${NATIONALITIES.map(([k, e, en]) => `<option value="${App.state.lang === "es" ? e : en}">`).join("")}</datalist></div>`;
        case "household": return `<div class="hh"><button data-hh="-1" aria-label="-">−</button><span class="${f.household ? "" : "zero"}">${f.household}</span><button data-hh="1" aria-label="+" class="plus">+</button></div>`;
        case "review": {
          const rows = [
            [t.rv.name, `${p.saved.firstName} ${p.saved.lastName}`.trim(), true],
            [t.rv.email, f.email, !!p.saved.email],
            [t.rv.address, [f.address, f.zip].filter(Boolean).join(", "), !!p.saved.address],
            [t.rv.birthday, f.birthday ? `${fmtDate(f.birthday)} · ${t.rv.years(age(f.birthday))}` : "", !!p.saved.birthday],
            [t.rv.nationality, f.nationality, !!p.saved.nationality],
            [t.rv.household, f.household ? String(f.household) : "", !!p.saved.household],
          ].filter((r) => r[1]);
          return `<div class="review">${rows.map(([l, v, s]) => `<div class="rrow"><span class="l">${l}${s ? `<span class="tag">· ${t.rv.saved}</span>` : ""}</span><span class="v">${esc(v)}</span></div>`).join("")}</div>`;
        }
      }
    };
    return `<div class="scrim gate" data-close-gate>
      <div class="pg-sheet" role="dialog" aria-modal="true" onclick="event.stopPropagation()">
        <div class="pg-head">
          <div class="handle"></div>
          <div class="title-row">
            ${g.step > 0 ? `<button class="rnd" data-gate-back aria-label="${t.back}">${ICON.arrowBack}</button>` : "<span></span>"}
            <div class="title">${t.qrReady}</div>
            <button class="rnd" data-close-gate aria-label="${t.close}">×</button>
          </div>
          <div class="rail">${steps.map((s, i) => `${i > 0 ? `<span class="conn ${i <= g.step ? "on" : ""}"></span>` : ""}
            ${i < g.step ? `<span class="node done">${ICON.checkS}</span>` : i === g.step ? `<span class="node cur">${ICON.stepIcon[s.key]}</span>` : `<span class="node">${i + 1}</span>`}`).join("")}</div>
          <div class="counter"><span>${t.stepOf(g.step + 1, total)}</span><span class="pct">${t.pct(Math.round(((g.step + 1) / total) * 100))}</span></div>
          <div class="chip">
            <span class="av">${ICON.stars}</span>
            ${isLast ? `<span class="big">+${g.earned} pts</span><span class="div">${t.allDone}</span>`
              : pays ? `<span class="pts">+${POINTS_PER_FIELD} pts</span><span class="for">${t.forStep}</span>${g.earned ? `<span class="tot"><b>+${g.earned} pts</b><span>${t.soFar}</span></span>` : ""}`
              : `<span class="for" style="font-weight:700">${t.alreadyPaid}</span>${g.earned ? `<span class="tot"><b>+${g.earned} pts</b><span>${t.soFar}</span></span>` : ""}`}
          </div>
        </div>
        <div class="pg-page pg-body" data-key="${cur.key}">
          <div class="hd"><div><h2>${cur.title}</h2><p>${cur.locked ? t.savedNote : cur.help || t.sub}</p></div><img src="assets/rewards/step-${STEP_ILLO[cur.key]}.webp" alt=""></div>
          <div class="fields">${fieldHtml()}</div>
        </div>
        <div class="pg-actions">
          <button class="cta" data-gate-next>${isLast ? t.submit : t.next}<span class="arr">→</span></button>
          ${cur.optional && !isLast ? `<button class="skip" data-gate-skip>${t.skip}</button>` : ""}
          <p class="priv">${ICON.lock}${t.privacy}</p>
        </div>
        <div class="pg-burst" id="pg-burst"></div>
      </div>
    </div>`;
  }
  const fmtDate = (iso) => { const [y, m, d] = iso.split("-"); return App.state.lang === "es" ? `${d}/${m}/${y}` : `${m}/${d}/${y}`; };
  const age = (iso) => { const d = new Date(iso + "T00:00:00"), n = new Date(); let a = n.getFullYear() - d.getFullYear(); if (n < new Date(n.getFullYear(), d.getMonth(), d.getDate())) a--; return a; };

  function validate(g, cur, t) {
    const f = g.form;
    if (cur.key === "email") return !f.email.trim() ? t.required : !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/.test(f.email) ? t.invalidEmail : "";
    if (cur.key === "address") return f.address.trim() ? "" : t.required;
    if (cur.key === "zip") return /^\d{5}$/.test(f.zip) ? "" : t.invalidZip;
    return "";
  }
  function burst() {
    const el = document.getElementById("pg-burst"); if (!el) return;
    el.innerHTML = `<span class="pg-scrim"></span><span class="pg-ring" style="animation-delay:.25s"></span><span class="pg-ring thin" style="animation-delay:.45s"></span>
      ${[["-40deg", ".3s"], ["20deg", ".35s"], ["80deg", ".4s"], ["150deg", ".3s"], ["-110deg", ".45s"], ["-160deg", ".38s"]].map(([r, d]) => `<span class="pg-spark" style="--r:${r};animation-delay:${d}"></span>`).join("")}
      <span class="pg-center"><span class="pg-star" style="--sx:-150px;--sy:-190px">${ICON.starsBig}</span><span class="pg-pts">+${POINTS_PER_FIELD} pts</span></span>`;
    setTimeout(() => { if (el) el.innerHTML = ""; }, 1600);
  }

  /* ─── Hoja del QR ─── */
  function renderQr(t) {
    const q = L.qr, c = App.state.claims.find((x) => x.id === q.id);
    const done = c.status === "fulfilled", rej = c.status === "rejected" || c.status === "cancelled";
    let body;
    if (q.phase === "celebrate" && !done) {
      body = `<div class="qr-cel">
        <div class="rings"><span style="animation-delay:0s"></span><span style="animation-delay:.35s"></span><span style="animation-delay:.7s"></span><img src="assets/rewards/gift.webp" alt="" class="gift"></div>
        <h2>${t.celebrate}</h2><div class="nm">${esc(c.name)}</div><span class="chip">${t.used(fmt(c.pointsSpent))}</span>
        <button class="primary" data-qr-phase="qr">${t.showMyQr}</button></div>`;
    } else if (done || rej) {
      body = `<div class="qr-done">
        <svg width="112" height="112" viewBox="0 0 112 112" class="pop"><circle cx="56" cy="56" r="52" stroke-width="4" fill="${rej ? "#EFEEF2" : "#FDE6F1"}" stroke="${rej ? "#7A7883" : "#FC0680"}"/>
          ${rej ? `<path class="draw" d="M40 40 L72 72 M72 40 L40 72" stroke="#4B4952" stroke-width="8" stroke-linecap="round" fill="none" pathLength="1"/>`
                : `<path class="draw" d="M34 58 L50 73 L79 42" stroke="#FC0680" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" fill="none" pathLength="1"/>`}</svg>
        <h2 style="color:${rej ? "#1B1A1F" : "#FC0680"}">${rej ? t.rejectedT : t.deliveredT}</h2><div class="nm">${esc(c.name)}</div><p>${rej ? t.rejectedP : t.deliveredP}</p>
        <button class="primary" style="background:${rej ? "#1B1A1F" : "#FC0680"}" data-close-qr>${t.done}</button></div>`;
    } else {
      body = `<div class="qr-main">
        <div class="status"><span class="chip"><span class="qr-dot"></span>${t.pendingChip}</span><span style="flex:1"></span><button class="x" data-close-qr aria-label="${t.close}">×</button></div>
        <div class="rcard"><div class="tile"><img src="${c.img}" alt="" onerror="this.src='assets/rewards/gift.webp'"></div><div><div class="nm">${esc(c.name)}</div><div class="pts">${fmt(c.pointsSpent)} pts</div></div></div>
        <div class="qrblock">
          <img src="assets/qr-demo.png" alt="QR ${c.code}" class="qrimg">
          <div class="code"><div><div class="lbl">${t.pickupCode}</div><div class="cd">${c.code}</div>${q.copied ? `<div class="cp">${t.copied}</div>` : ""}</div><button class="copy" data-copy="${c.code}" aria-label="${t.copy}">${ICON.copy}</button></div>
        </div>
        <div class="steps3">${[t.s1, t.s2, t.s3].map((s, i) => `<div><span class="n">${i + 1}</span><span class="l">${s}</span></div>`).join("")}</div>
        <div class="bright">${ICON.sun}${t.bright}</div>
        <button class="dismiss" data-close-qr>${t.done}</button>
        <button class="simulate" data-simulate="${c.id}">${t.simulate}</button>
      </div>`;
    }
    return `<div class="scrim qr" data-close-qr><div class="qr-sheet" role="dialog" aria-modal="true" onclick="event.stopPropagation()"><div class="handle"></div>${body}</div></div>`;
  }

  /* ─── Eventos ─── */
  function bind(root, t, rewards, avail) {
    const R = () => render(root);
    root.querySelectorAll("[data-lang]").forEach((b) => b.onclick = () => { App.setLang(b.dataset.lang); R(); });
    root.querySelectorAll("[data-go]").forEach((b) => b.onclick = () => App.go(b.dataset.go));
    root.querySelectorAll("[data-open]").forEach((b) => b.onclick = (e) => { e.stopPropagation(); L.selected = b.dataset.open; R(); });
    root.querySelectorAll(".rw-card").forEach((c) => c.onkeydown = (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); L.selected = c.dataset.open; R(); } });
    root.querySelectorAll("[data-close-detail]").forEach((b) => b.onclick = () => { L.selected = null; R(); });
    root.querySelectorAll("[data-toggle-history]").forEach((b) => b.onclick = () => { L.showHistory = !L.showHistory; R(); });
    root.querySelectorAll("[data-qr]").forEach((b) => b.onclick = () => { L.qr = { id: b.dataset.qr, phase: "qr", copied: false }; R(); });
    root.querySelectorAll("[data-close-qr]").forEach((b) => b.onclick = () => { L.qr = null; R(); });
    root.querySelectorAll("[data-qr-phase]").forEach((b) => b.onclick = () => { L.qr.phase = b.dataset.qrPhase; R(); });
    root.querySelectorAll("[data-copy]").forEach((b) => b.onclick = () => { try { navigator.clipboard?.writeText(b.dataset.copy); } catch {} L.qr.copied = true; R(); setTimeout(() => { if (L.qr) { L.qr.copied = false; R(); } }, 1800); });
    root.querySelectorAll("[data-simulate]").forEach((b) => b.onclick = () => {
      const c = App.state.claims.find((x) => x.id === b.dataset.simulate); c.status = "fulfilled"; c.fulfilledAt = new Date().toISOString();
      fire(160); R();
    });

    // Confirmar canje → siempre pasa por el stepper (igual que ALWAYS_PROFILE_GATE en la app)
    root.querySelectorAll("[data-confirm]").forEach((b) => b.onclick = () => {
      const p = App.state.profile;
      L.gate = { rewardId: b.dataset.confirm, step: 0, earned: 0, touched: false, error: "",
        form: { email: p.saved.email || "", address: p.saved.address || "", zip: p.saved.zip || "", birthday: p.saved.birthday || "", nationality: p.saved.nationality || "", household: p.saved.household || 1 } };
      R();
    });
    root.querySelectorAll("[data-close-gate]").forEach((b) => b.onclick = () => { L.gate = null; R(); });
    root.querySelectorAll("[data-gate-back]").forEach((b) => b.onclick = () => { L.gate.step--; L.gate.touched = false; R(); });
    root.querySelectorAll("[data-f]").forEach((i) => i.oninput = () => { const k = i.dataset.f; L.gate.form[k] = k === "zip" ? i.value.replace(/\D/g, "").slice(0, 5) : i.value; if (k === "zip") i.value = L.gate.form[k]; });
    root.querySelectorAll("[data-hh]").forEach((b) => b.onclick = () => { L.gate.form.household = Math.min(20, Math.max(1, L.gate.form.household + Number(b.dataset.hh))); R(); });
    root.querySelectorAll("[data-gate-skip]").forEach((b) => b.onclick = () => { const cur = gateSteps()[L.gate.step]; L.gate.form[cur.key] = App.state.profile.saved[cur.key] || (cur.key === "household" ? 1 : ""); L.gate.step++; L.gate.touched = false; R(); });
    root.querySelectorAll("[data-gate-next]").forEach((b) => b.onclick = () => {
      const g = L.gate, steps = gateSteps(), cur = steps[g.step];
      g.touched = true; g.error = validate(g, cur, t);
      if (g.error) { R(); return; }
      if (g.step < steps.length - 1) {
        const filled = cur.key === "household" ? g.form.household > 0 : !!String(g.form[cur.key] || "").trim();
        if (!cur.locked && filled) { g.earned += POINTS_PER_FIELD; g.step++; g.touched = false; R(); burst(); return; }
        g.step++; g.touched = false; R(); return;
      }
      // Último paso: guardar perfil, sumar puntos ganados, crear el canje y abrir el QR con festejo.
      const st = App.state, r = st.rewards.find((x) => x.id === g.rewardId);
      Object.assign(st.profile.saved, g.form);
      st.points.available += g.earned; st.points.earned += g.earned;
      st.points.available -= r.pointsCost; st.points.spent += r.pointsCost;
      const claim = { id: "c" + Date.now(), rewardId: r.id, name: r.name, img: r.img, pointsSpent: r.pointsCost, status: "pending", code: newCode(), claimedAt: new Date().toISOString() };
      st.claims.unshift(claim);
      L.gate = null; L.selected = null; L.success = t.success(r.name); L.fresh = true; L.showHistory = true;
      L.qr = { id: claim.id, phase: "celebrate", copied: false };
      R(); fire(110);
      setTimeout(() => { if (L.qr && L.qr.id === claim.id && L.qr.phase === "celebrate") { L.qr.phase = "qr"; R(); } }, 2200);
      setTimeout(() => { L.success = ""; R(); }, 4000);
      setTimeout(() => { L.fresh = false; R(); }, 5000);
    });
  }
  function fire(n) {
    if (typeof confetti !== "function") return;
    const colors = ["#FC0680", "#FF7AB8", "#FFD1E6", "#FFFFFF", "#FFC83D"];
    confetti({ particleCount: n, spread: 85, startVelocity: 42, origin: { y: 0.45 }, colors, zIndex: 2000 });
    setTimeout(() => confetti({ particleCount: 60, angle: 60, spread: 60, origin: { x: 0, y: 0.6 }, colors, zIndex: 2000 }), 180);
    setTimeout(() => confetti({ particleCount: 60, angle: 120, spread: 60, origin: { x: 1, y: 0.6 }, colors, zIndex: 2000 }), 320);
  }

  window.ICON_STAR = ICON.star;
  window.Rewards = { render, reset: () => { L.selected = null; L.gate = null; L.qr = null; } };
})();
