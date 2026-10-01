/* Demo estática del Pre-RCS de Sweepstouch. Sin backend: todo el estado vive en
   memoria y se reinicia al recargar. Misma UI, copy y animaciones que la app. */
(function () {
  const D = window.DEMO_DATA;
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const money = (n) => `$${Number(n).toFixed(2)}`;

  /* ─── matemática de precios (espejo de domain/savings.ts) ─── */
  const priceNum = (p) => {
    if (!p) return 0;
    const m = p.match(/(\d+)\s*\/\s*\$?([\d.]+)/);
    if (m) return parseFloat(m[2]) || 0;
    if (p.includes("¢")) return (parseFloat(p.replace(/[^0-9.]/g, "")) || 0) / 100;
    return parseFloat(p.replace(/[^0-9.]/g, "")) || 0;
  };
  const unitSaving = (o) => {
    const price = priceNum(o.price);
    const s = (o.savings || "").trim();
    if (s.includes("%")) return ((parseFloat(s) || 0) / 100) * price;
    if (s) return parseFloat(s.replace(/[^0-9.]/g, "")) || 0;
    return priceNum(o.originalPrice) - price;
  };
  const OFFERS = D.products.filter((o) => unitSaving(o) > 0).slice(0, 60);
  const pointsFor = (items) => items.reduce((a, it) => a + Math.max(1, Math.round(priceNum(it.price))) * it.qty, 0);

  /* ─── estado global compartido con la pantalla de premios ─── */
  const App = (window.App = {
    state: {
      lang: "en",
      name: "",
      points: { available: 2091, earned: 2091, spent: 0 },
      rewards: D.rewards,
      claims: [],
      profile: { saved: { firstName: "", lastName: "", email: "", address: "", zip: "", birthday: "", nationality: "", household: 0 } },
      survey: { quick: { points: 25, available: true, nextAt: null }, full: { points: 50, available: true, nextAt: null } },
    },
    route: "home",
    setLang(l) { App.state.lang = l; },
    go(route) {
      App.route = route === "rewards" ? "rewards" : "home";
      window.scrollTo(0, 0);
      render();
    },
  });

  /* ─── estado de la pantalla Pre-RCS ─── */
  const P = {
    screen: "offers", askName: true, nameDraft: "", welcome: false, lightbox: false,
    sel: {}, editing: false, list: null, notice: "",
    validatePopup: false, expirePopup: false, deletePopup: false, deletedPopup: false, details: false,
    cam: null, scan: null, success: null,
    banner: { expanded: false, pinned: false, dismissed: false, sheet: false, timers: [] },
    quick: null, redeem: false, survey: null,
    bubbles: { show: false, timer: null, prevCount: 0 },
  };

  const T = {
    es: {
      nameTitle: ["Tu", "lista"], nameSub: "Crea tu lista y descubre tus ahorros, tus puntos.", namePh: "Escribe aqui tu nombre y apellido", cont: "Continuar",
      welcomeAlt: "Un regalo para tu primera lista", welcomeCta: "Crear mi primera lista",
      listOf: (n) => (n ? `Lista de ${n}` : "Tu lista"), listCopy: "Para saber cuánto ahorras\ny cuántos puntos ganas",
      picked: (n) => `${n} seleccionada${n === 1 ? "" : "s"}`, myList: "Mi lista", editName: "Editar nombre y apellido",
      used: "Tu QR anterior ya se usó en la caja. Arma tu lista de nuevo para llevarte más puntos.",
      help: "Precio de oferta y ahorro por unidad.", save: "Ahorra", qty: "Cantidad", empty: "Esta tienda todavía no tiene ofertas cargadas.",
      youSave: "Ahorras", youEarn: "Ganas", estSav: "Tu ahorro estimado", seeRewards: "Ver mis premios",
      ctaNone: "Selecciona al menos una oferta", ctaGo: "Listo! Validar mis puntos", ctaSave: "Guardar cambios",
      // popup validar
      vTitle: "¡Primero valida tu lista!", vP1: "Tu lista anterior está pendiente de validación.", vP2: "Toma una foto de tu recibo para confirmar tus compras y ", vP2b: "recibir tus puntos.",
      vExp: "Vencimiento: ", vFoot: "Podrás crear una nueva lista después de validar la anterior.", vBtn: "Validar mi lista",
      // recibo
      rT1: "Elige qué quieres", rT2: "hacer ahora.", rP: "Puedes guardar tu lista para después o tomar fotos de tu recibo para validar tus productos y sumar tus puntos.",
      listValue: "Valor de tu lista", estPts: "Puntos estimados", scan: "Escanear mi recibo", scanSub: "¿Recibo largo? Tómalo por partes, en varias fotos.",
      saveList: "Guardar mi lista", saveSub: "Podrás validarla después.", editList: "Modificar mi lista",
      camT: "Escanea tu recibo", camS: "¿Muy largo? Tómalo por partes — hasta 4 fotos.", frame: "Encuadra con buena luz", part: (n) => `Parte ${n}`, take: "Tomar foto", gal: "Subir de la galería",
      validate: (n) => `Validar recibo (${n} foto${n === 1 ? "" : "s"}) ›`,
      steps: ["Leyendo tu recibo…", "Detectando productos…", "Buscando tus ofertas…", "Calculando tus puntos…"], ai: "Validando con inteligencia artificial", parts: (n) => `${n} partes`,
      okT1: "¡Puntos", okT2: "acreditados!", ticket: "★ RECIBO VALIDADO ★", yourPts: "TUS PUNTOS", stamp: "VALIDADO", okNote: "Tus puntos ya están en tu cuenta.", okBtn: "Continuar ›",
      // guardada
      sT1: "¡Lista ", sT2: "guardada!", sP1: "Tu lista se guardó correctamente.", sP2: "Cuando hagas tu compra, toma una foto de tu recibo para validar tus productos y sumar tus puntos.",
      ptsToVal: "Puntos por validar", ptsEarned: "Puntos ganados", remember: "Recuerda: ", rememberP: "Podrás validar tus puntos después tomando una foto de tu recibo de compra.",
      viewList: "Ver mi lista ›", keep: "Seguir comprando",
      eTitle: "¡Lista guardada!", eP1: "Tu lista vence el", eP2: "Tienes 7 días desde su creación para validarla con tu recibo.", accept: "Aceptar",
      // mi lista
      back: "Volver", myListT: "Mi lista", intro: "Aquí puedes ver tus listas guardadas. Realiza tu compra y toma una foto de tu recibo para validar tus puntos.",
      products: (n) => `${n} producto${n === 1 ? "" : "s"}`, savedOn: "Guardada el", expiration: "Vencimiento: ", daysLeft: (n) => `${n} días restantes`,
      details: "Ver detalles", edit: "Editar lista", scanBtn: "Escanear mi recibo ›", delTitle: "Eliminar lista",
      dTitle: "¿Estás seguro?", dBody: "Esta acción eliminará tu lista y no podrás recuperarla.", no: "No", yes: "Sí, borrar",
      ddTitle: "¡Lista eliminada!", ddBody: "Tu lista ha sido eliminada correctamente.",
      detT: "Detalle de tu lista", qtyL: "Cantidad", close: "Cerrar",
      // banner
      bTitle: (n) => `Gana ${n} pts con una encuesta`, bSub: "Toma cerca de 1 minuto", bDone: "Tu opinión cuenta", bSubDone: (d) => `Vuelve en ${d} ${d === 1 ? "día" : "días"} por más puntos`,
      chooseT: "Gánate puntos opinando", chooseS: "Cada semana puedes volver a responder y ganar de nuevo.",
      quick: "Encuesta rápida", quickS: "Califica tu experiencia con estrellas", full: "Encuesta completa", fullS: "4 preguntas · menos de 1 minuto", noPts: "Ya cobraste", hide: "Plegar",
      // rápida
      qT: "¿Cómo fue tu experiencia hoy?", qPh: "¿Algo que quieras contarnos? (opcional)", qSend: "Enviar calificación", qThanks: "¡Gracias por tu opinión!", qAward: (n) => `+${n} puntos a tu saldo`,
      qMore: (n) => `¿Sumas ${n} pts más?`, qMoreS: "La encuesta completa son 4 preguntas y toma menos de 1 minuto.", qMoreB: (n) => `Hacer la encuesta completa · +${n}`, done: "Listo",
      // canjeables
      rbT: (n) => `¡Tienes ${n} producto${n === 1 ? "" : "s"} para canjear!`, rbS: (n) => `Tienes ${n} puntos disponibles.`, rbNext: (n, name) => `Te faltan ${n} pts para ${name}`, rbGo: "Ir a canjearlos",
      rbBadge: (n) => `${n} producto${n === 1 ? "" : "s"} para canjear`,
      // encuesta completa
      svGreet: ["¿Te gustaría", "responder una", "breve encuesta?"], svIntro: "Cuéntanos cómo estuvo tu visita a", svStats: [["1 minuto", "de tu tiempo"], ["+50 puntos", "por completarla"], ["4 preguntas", "muy rápidas"]],
      svStart: "Empezar", svNot: "Ahora no", svRedeem: "Canjear puntos", svPriv: "Tus respuestas son anónimas y nos ayudan a mejorar tu tienda.",
      svOf: (a) => `${a} de 4`, svRestart: "Reiniciar", svReward: "puntos al terminar", svHint: ["Toca una carita", "Elige una opción", "Elige una opción", "Toca una opción"],
      svQ: (s) => [`¿Cómo fue tu visita hoy a ${s}?`, "¿Qué fue lo mejor de tu visita?", "¿Qué mejorarías?", `¿Recomendarías ${s} a un familiar o amigo?`],
      svOpts: [["Mala", "Regular", "Buena", "Muy buena", "Excelente"], ["Frescura y calidad de los productos", "Atención del personal", "Precios y ofertas", "Variedad de productos latinos"], ["Tiempo de espera en caja", "Limpieza de la tienda", "Disponibilidad de productos", "Todo estuvo perfecto"], ["Sí", "Tal vez", "No"]],
      svThanks: (n) => `¡Gracias${n ? `, ${n}` : ""}!`, svCopy1: "Tu opinión ayuda a mejorar", svCopy2: " para toda la comunidad.", svEarned: "PUNTOS GANADOS", svAdded: "añadidos a tu cuenta Sweepstouch",
      svXsT: (n) => `¿Sumas ${n} pts más?`, svXsS: "Califica tu experiencia con estrellas: toma 10 segundos.", svXsB: (n) => `Encuesta rápida · +${n}`, svBack: "Volver",
      svDeliv: ["Recibirás tus ahorros y puntos", "en tu próximo MMS de Sweepstouch."],
    },
    en: {
      nameTitle: ["Your", "list"], nameSub: "Create your list and discover your savings, your points.", namePh: "Enter your first and last name here", cont: "Continue",
      welcomeAlt: "A gift for your first list", welcomeCta: "Create my first list",
      listOf: (n) => (n ? `${n}'s list` : "Your list"), listCopy: "See how much you save\nand how many points you earn",
      picked: (n) => `${n} selected`, myList: "My list", editName: "Edit first and last name",
      used: "Your previous QR was already used at the register. Build a new list to earn more points.",
      help: "Offer price and savings per unit.", save: "Save", qty: "Quantity", empty: "This store has no deals loaded yet.",
      youSave: "You save", youEarn: "You earn", estSav: "Your estimated savings", seeRewards: "See my rewards",
      ctaNone: "Pick at least one deal", ctaGo: "Done! Validate my points", ctaSave: "Save changes",
      vTitle: "Validate your list!", vP1: "Your current list is pending validation.", vP2: "Take a photo of your receipt to confirm your purchases and ", vP2b: "receive your points.",
      vExp: "Expires: ", vFoot: "You can create a new list after validating your current one.", vBtn: "Validate my list",
      rT1: "Choose what to", rT2: "do next.", rP: "Save your list for later or take photos of your receipt to validate your products and earn points.",
      listValue: "List value", estPts: "Estimated points", scan: "Scan my receipt", scanSub: "Long receipt? Capture it in parts, several photos.",
      saveList: "Save my list", saveSub: "You can validate it later.", editList: "Edit my list",
      camT: "Scan your receipt", camS: "Too long? Capture it in parts — up to 4 photos.", frame: "Frame in good light", part: (n) => `Part ${n}`, take: "Take photo", gal: "Upload from gallery",
      validate: (n) => `Validate receipt (${n} photo${n === 1 ? "" : "s"}) ›`,
      steps: ["Reading your receipt…", "Detecting products…", "Matching your deals…", "Calculating your points…"], ai: "Validating with AI", parts: (n) => `${n} parts`,
      okT1: "Points", okT2: "credited!", ticket: "★ RECEIPT VALIDATED ★", yourPts: "YOUR POINTS", stamp: "VALIDATED", okNote: "Your points are in your account.", okBtn: "Continue ›",
      sT1: "List ", sT2: "saved!", sP1: "Your list was saved successfully.", sP2: "When you shop, take a photo of your receipt to validate your products and earn points.",
      ptsToVal: "Points to validate", ptsEarned: "Points earned", remember: "Remember: ", rememberP: "You can validate your points later by taking a photo of your receipt.",
      viewList: "View my list ›", keep: "Keep shopping",
      eTitle: "List saved!", eP1: "Your list expires on", eP2: "You have 7 days from creation to validate it with your receipt.", accept: "Accept",
      back: "Back", myListT: "My list", intro: "Here is your saved list. Shop and take a photo of your receipt to validate your points.",
      products: (n) => `${n} product${n === 1 ? "" : "s"}`, savedOn: "Saved on", expiration: "Expiration: ", daysLeft: (n) => `${n} days left`,
      details: "View details", edit: "Edit list", scanBtn: "Scan my receipt ›", delTitle: "Delete list",
      dTitle: "Are you sure?", dBody: "This will delete your list and you won't be able to recover it.", no: "No", yes: "Yes, delete",
      ddTitle: "List deleted!", ddBody: "Your list has been deleted successfully.",
      detT: "Your list details", qtyL: "Quantity", close: "Close",
      bTitle: (n) => `Earn ${n} pts with a survey`, bSub: "Takes about 1 minute", bDone: "Your opinion counts", bSubDone: (d) => `Back in ${d} ${d === 1 ? "day" : "days"} for more points`,
      chooseT: "Earn points with your opinion", chooseS: "Come back every week to answer again and earn again.",
      quick: "Quick survey", quickS: "Rate your experience with stars", full: "Full survey", fullS: "4 questions · under 1 minute", noPts: "Already earned", hide: "Collapse",
      qT: "How was your experience today?", qPh: "Anything you'd like to tell us? (optional)", qSend: "Send rating", qThanks: "Thanks for your feedback!", qAward: (n) => `+${n} points added`,
      qMore: (n) => `Want ${n} more pts?`, qMoreS: "The full survey is 4 questions and takes under 1 minute.", qMoreB: (n) => `Take the full survey · +${n}`, done: "Done",
      rbT: (n) => `You have ${n} product${n === 1 ? "" : "s"} to redeem!`, rbS: (n) => `You have ${n} points available.`, rbNext: (n, name) => `${n} pts to go for ${name}`, rbGo: "Go redeem them",
      rbBadge: (n) => `${n} product${n === 1 ? "" : "s"} to redeem`,
      svGreet: ["Would you like", "to take a", "short survey?"], svIntro: "Tell us about your visit to", svStats: [["1 minute", "of your time"], ["+50 points", "for completing"], ["4 questions", "very quick"]],
      svStart: "Start", svNot: "Not now", svRedeem: "Redeem points", svPriv: "Your answers are anonymous and help us improve your store.",
      svOf: (a) => `${a} of 4`, svRestart: "Restart", svReward: "points on completion", svHint: ["Tap a face", "Choose an option", "Choose an option", "Tap an option"],
      svQ: (s) => [`How was your visit to ${s} today?`, "What was the best part of your visit?", "What would you improve?", `Would you recommend ${s} to family or friends?`],
      svOpts: [["Bad", "Fair", "Good", "Very good", "Excellent"], ["Freshness and quality of products", "Staff service", "Prices and deals", "Variety of Latin products"], ["Checkout waiting time", "Store cleanliness", "Product availability", "Everything was perfect"], ["Yes", "Maybe", "No"]],
      svThanks: (n) => `Thank you${n ? `, ${n}` : ""}!`, svCopy1: "Your feedback helps improve", svCopy2: " for the whole community.", svEarned: "POINTS EARNED", svAdded: "added to your Sweepstouch account",
      svXsT: (n) => `Want ${n} more pts?`, svXsS: "Rate your experience with stars: takes 10 seconds.", svXsB: (n) => `Quick survey · +${n}`, svBack: "Back",
      svDeliv: ["You’ll receive your savings and points", "in your next MMS from Sweepstouch."],
    },
  };
  const SV_ART = [["bad", "fair", "good", "very-good", "excellent"], ["freshness", "staff", "prices", "variety"], ["checkout", "cleanliness", "availability", "perfect"], ["yes", "maybe", "no"]];

  const I = {
    chev: '<svg width="16" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 5 7 7-7 7"/></svg>',
    chevS: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 5 7 7-7 7"/></svg>',
    person: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="7" r="4"/><path d="M4 21v-2a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v2"/></svg>',
    pen: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m16 3 5 5M4 15 16 3a3.5 3.5 0 0 1 5 5L9 20l-6 1 1-6Z"/></svg>',
    check: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    info: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FC0680" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 16v-4M12 8h.01"/></svg>',
    piggy: '<svg width="15" height="15" viewBox="0 0 24 24" fill="#FC0680"><path d="M15 3a5 5 0 0 0-4.9 4H8a6 6 0 0 0-6 6c0 2.4 1.4 4.4 3.4 5.4L6 21h3l.5-1.5h5L15 21h3l.8-3.2A4 4 0 0 0 21 14h1v-3h-1.3a5 5 0 0 0-1.2-2.1A5 5 0 0 0 15 3zm2 9a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/></svg>',
    star: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#18181B" stroke-width="2" stroke-linejoin="round"><path d="M12 3l2.7 5.6 6.1.8-4.5 4.3 1.1 6.1L12 17l-5.4 2.8 1.1-6.1L3.2 9.4l6.1-.8z"/></svg>',
    redeem: '<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M20 6h-2.2A3 3 0 0 0 12 3.8 3 3 0 0 0 6.2 6H4a2 2 0 0 0-2 2v2h20V8a2 2 0 0 0-2-2zM9 4.5A1.5 1.5 0 1 1 9 7.5 1.5 1.5 0 0 1 9 4.5zm6 0A1.5 1.5 0 1 1 15 7.5 1.5 1.5 0 0 1 15 4.5zM2 12v7a2 2 0 0 0 2 2h7v-9zm11 9h7a2 2 0 0 0 2-2v-7h-9z"/></svg>',
    redeemBig: '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20 6h-2.2A3 3 0 0 0 12 3.8 3 3 0 0 0 6.2 6H4a2 2 0 0 0-2 2v2h20V8a2 2 0 0 0-2-2zM9 4.5A1.5 1.5 0 1 1 9 7.5 1.5 1.5 0 0 1 9 4.5zm6 0A1.5 1.5 0 1 1 15 7.5 1.5 1.5 0 0 1 15 4.5zM2 12v7a2 2 0 0 0 2 2h7v-9zm11 9h7a2 2 0 0 0 2-2v-7h-9z"/></svg>',
    assign: '<svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 3h6v3H9zM8 11h8M8 15h5"/></svg>',
    assignS: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 3h6v3H9zM8 11h8M8 15h5"/></svg>',
    starF: (c) => `<svg width="24" height="24" viewBox="0 0 24 24" fill="${c}"><path d="M12 3l2.7 5.6 6.1.8-4.5 4.3 1.1 6.1L12 17l-5.4 2.8 1.1-6.1L3.2 9.4l6.1-.8z"/></svg>`,
    starFs: (c, s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="${c}"><path d="M12 3l2.7 5.6 6.1.8-4.5 4.3 1.1 6.1L12 17l-5.4 2.8 1.1-6.1L3.2 9.4l6.1-.8z"/></svg>`,
    camera: (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="3.5"/></svg>`,
    receipt: '<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2h12v20l-3-2-3 2-3-2-3 2zM9 7h6M9 11h6M9 15h4"/></svg>',
    gift: (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M5 12v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8M12 8v13M12 8H7.5a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8zM12 8h4.5a2.5 2.5 0 0 0 0-5C13 3 12 8 12 8z"/></svg>`,
    cart: '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>',
    trash: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></svg>',
    clock: (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>`,
    chat: '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M4 4h16v12H8l-4 4z"/></svg>',
    lock: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>',
    x: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="m6 6 12 12M18 6 6 18"/></svg>',
    xBold: '<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"><path d="m5 5 14 14M19 5 5 19"/></svg>',
    party: '<svg width="56" height="56" viewBox="0 0 24 24" fill="#FC0680"><path d="M2 22l4-11 7 7zM14.5 3.5l1 2 2 1-2 1-1 2-1-2-2-1 2-1zM19 9l.7 1.3L21 11l-1.3.7L19 13l-.7-1.3L17 11l1.3-.7zM9.5 4.5l.5 1 1 .5-1 .5-.5 1-.5-1-1-.5 1-.5zM13 12l-1 1 3 3 1-1z"/></svg>',
    photo: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 16 5-5 4 4 3-3 6 6"/><circle cx="16" cy="9" r="1.5"/></svg>',
  };

  /* ─── helpers ─── */
  const t = () => T[App.state.lang];
  const loc = () => (App.state.lang === "es" ? "es-HN" : "en-US");
  const firstName = () => App.state.name.split(/\s+/)[0] || "";
  const selItems = () => Object.entries(P.sel).filter(([, q]) => q > 0).map(([id, qty]) => ({ ...(P.list && P.editing ? [...P.list.items.map((it, i) => ({ ...it, _id: "saved:" + i })), ...OFFERS] : OFFERS).find((o) => o._id === id), qty })).filter((x) => x.name);
  const totals = (items) => ({
    savings: items.reduce((a, it) => a + unitSaving(it) * it.qty, 0),
    toPay: items.reduce((a, it) => a + priceNum(it.price) * it.qty, 0),
    points: pointsFor(items),
  });
  const longDate = (iso) => new Date(iso).toLocaleDateString(loc(), { year: "numeric", month: "long", day: "numeric" });
  const shortDate = (iso) => new Date(iso).toLocaleDateString(loc());
  const daysLeft = (iso) => Math.max(0, Math.ceil((new Date(iso) - Date.now()) / 864e5));
  const balance = () => App.state.points.available + 100;
  const redeemable = () => App.state.rewards.filter((r) => r.pointsCost > 0 && r.pointsCost <= App.state.points.available);
  const offersFor = () => (P.editing && P.list ? [...P.list.items.map((it, i) => ({ ...it, _id: "saved:" + i })), ...OFFERS.filter((o) => !P.list.items.some((it) => it.name === o.name))] : OFFERS);

  /* ─── render principal ─── */
  const root = document.getElementById("app");
  function render() {
    if (App.route === "rewards") { root.innerHTML = '<div class="shell" style="max-width:430px;background:#F4F3F6"><div id="rw"></div></div>'; Rewards.render(document.getElementById("rw")); return; }
    const L = t();
    let body;
    if (P.survey) body = renderSurvey(L);
    else if (P.screen === "receipt") body = renderReceipt(L);
    else if (P.screen === "savedConfirm") body = renderSavedConfirm(L);
    else if (P.screen === "savedList") body = renderSavedList(L);
    else body = renderOffers(L);
    const white = P.survey || P.screen !== "offers";
    root.innerHTML = `<div class="shell ${white ? "white" : ""}">${body}${!P.survey ? renderBanner(L) : ""}</div>
      ${P.askName ? renderName(L) : ""}${P.welcome && !P.askName ? renderWelcome(L) : ""}${P.lightbox ? renderLightbox(L) : ""}
      ${P.validatePopup ? renderPopup(L, 4, L.vTitle, `<p>${L.vP1}</p><p class="sm">${L.vP2}<b>${L.vP2b}</b></p><p style="font-size:13px">${L.vExp}${shortDate(P.list.expiresAt)}</p>`, `<button class="pbtn" data-act="validateFromPopup">${I.camera(26)}${L.vBtn} →</button>`, L.vFoot, "closeValidate") : ""}
      ${P.expirePopup ? renderPopup(L, 1, L.eTitle, `<p>${L.eP1} <b>${longDate(P.list.expiresAt)}.</b></p><p>${L.eP2}</p>`, `<button class="pbtn" data-act="closeExpire">${L.accept}</button>`, "", "closeExpire") : ""}
      ${P.deletePopup ? renderPopup(L, 2, L.dTitle, `<p>${L.dBody}</p>`, `<button class="pbtn sec" data-act="closeDelete">${L.no}</button><button class="pbtn" data-act="deleteList">${L.yes}</button>`, "", "closeDelete") : ""}
      ${P.deletedPopup ? renderPopup(L, 3, L.ddTitle, `<p>${L.ddBody}</p>`, `<button class="pbtn" data-act="closeDeleted">${L.accept}</button>`, "", null) : ""}
      ${P.details ? renderDetails(L) : ""}
      ${P.cam ? renderCam(L) : ""}${P.scan ? renderScan(L) : ""}${P.success ? renderSuccess(L) : ""}
      ${P.banner.sheet ? renderChooser(L) : ""}${P.quick ? renderQuick(L) : ""}${P.redeem ? renderRedeem(L) : ""}
      <div class="bubbles ${P.bubbles.show ? "show" : ""}">${P.bubbles.show ? renderBubbles(L) : ""}</div>`;
    if (P.cam) startCamera();
  }

  /* ─── pantallas ─── */
  function renderName(L) {
    const ok = P.nameDraft.trim().split(/\s+/).filter(Boolean).length >= 2;
    return `<div class="scrim"><form class="name-card" data-form="name">
      <h2>${L.nameTitle[0]} <b>${L.nameTitle[1]}</b></h2><p>${L.nameSub}</p>
      <img src="assets/name-illustration.webp" alt="">
      <div class="inp">${I.person}<input data-inp="nameDraft" value="${esc(P.nameDraft)}" placeholder="${L.namePh}" maxlength="50" autocomplete="name" autofocus></div>
      <button type="submit" class="pink-btn ${ok ? "" : "off"}">${L.cont}</button></form></div>`;
  }
  function renderWelcome(L) {
    return `<div class="scrim"><div class="welcome" role="dialog" aria-label="${L.welcomeAlt}"><img class="art" src="assets/welcome-popup.webp" alt="">
      <button class="pink-btn" data-act="closeWelcome"><img src="assets/list-icon-inverted.svg" width="42" height="28" alt="">${L.welcomeCta}${I.chev}</button></div></div>`;
  }
  function renderLightbox(L) {
    return `<div class="lightbox" role="dialog" data-act="closeLightbox"><button class="x" data-act="closeLightbox">×</button><img src="assets/campaign.webp" alt="Labor Day Sale!" data-stop></div>`;
  }
  function header(L) {
    return `<div class="hdr"><div class="row">
      <div class="logo"><img src="${D.store.logo}" alt=""></div>
      <div class="nm"><b>${esc(D.store.name)}</b><span>${esc(D.store.address)}</span></div>
      <div class="lang"><button data-act="lang" data-arg="en" class="${App.state.lang === "en" ? "on" : ""}">EN</button><button data-act="lang" data-arg="es" class="${App.state.lang === "es" ? "on" : ""}">ES</button></div>
    </div><button class="campaign" data-act="openLightbox"><img src="assets/campaign.webp" alt="Labor Day Sale!"></button></div>`;
  }
  function renderOffers(L) {
    const items = selItems(), tt = totals(items), n = items.length, offers = offersFor();
    const cta = n === 0 ? L.ctaNone : P.editing ? L.ctaSave : L.ctaGo;
    const rb = redeemable().length;
    return `${header(L)}<div class="offers ${P.askName || P.welcome ? "" : ""}">
      <div class="list-intro"><div class="h"><img src="assets/list-icon.svg" alt=""><h2>${esc(L.listOf(firstName()))}</h2><button class="pen" data-act="editName" aria-label="${L.editName}">${I.pen}</button></div>
        <div class="sub"><div><div class="list-copy">${L.listCopy}</div>${n ? `<div class="picked">${L.picked(n)}</div>` : ""}</div>
        ${P.list && !P.editing ? `<button class="my-lists" data-act="goSavedList">${L.myList}${I.chevS}</button>` : ""}</div></div>
      ${P.notice ? `<div class="notice">${I.info}<span>${P.notice}</span></div>` : ""}
      ${offers.length ? `<div class="cards">${offers.map((o, i) => {
        const q = P.sel[o._id] || 0, on = q > 0, m = o.price.match(/^([^/]+)(\/.*)$/);
        return `<div class="card ${on ? "on" : ""}" style="animation-delay:${Math.min(i * 0.04, 0.32)}s">
          <div class="top" data-act="toggle" data-arg="${o._id}">
            ${o.imageUrl ? `<img src="${o.imageUrl}" alt="" loading="lazy">` : ""}
            <div class="txt"><div class="name">${esc(o.name)}</div><div class="help">${L.help}</div>
              ${o.brand || o.size ? `<div class="bs">${[o.brand, o.size].filter(Boolean).join(" · ")}</div>` : ""}
              <div class="pr"><span class="price">${m ? `${esc(m[1])}<small>${esc(m[2])}</small>` : esc(o.price)}</span>${o.originalPrice ? `<span class="orig">${esc(o.originalPrice)}</span>` : ""}</div>
              ${o.offerCondition ? `<div class="bs" style="color:#52525B;font-size:12px;margin-top:5px">${esc(o.offerCondition)}</div>` : ""}</div>
            <span class="chk">${I.check}</span></div>
          ${on ? `<div class="foot"><strong>${L.save} ${money(unitSaving(o) * q)}</strong><span class="lbl">${L.qty}</span>
            <span class="st"><button data-act="qty" data-arg="${o._id}|-1" aria-label="−">−</button><span>${q}</span><button data-act="qty" data-arg="${o._id}|1" aria-label="+">+</button></span></div>` : ""}
        </div>`;
      }).join("")}</div>` : `<p class="empty">${L.empty}</p>`}
    </div>
    <div class="bar-spacer"></div>
    <div class="bottom-bar"><div class="row"><div><div class="lbl">${L.estSav}</div><div class="amt">${money(tt.savings)}</div></div>
      <a class="pts-chip" data-act="goRewards" aria-label="${L.seeRewards}"><img src="assets/regalos.png" alt="">${rb ? `<span class="rb-badge" data-act="openRedeem" title="${L.rbBadge(rb)}">${I.redeem}${rb}</span>` : ""}<b>${balance().toLocaleString(loc())}</b><small>pts</small><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FC0680" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m9 5 7 7-7 7"/></svg></a></div>
      <button class="cta ${n ? "" : "idle"}" data-act="cta"><span>${cta}${n ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m9 4 8 8-8 8"/></svg>` : ""}</span></button></div>`;
  }
  function renderBubbles(L) {
    const tt = totals(selItems());
    return `<div class="pill"><span class="st">${I.piggy}<small>${L.youSave}</small><b style="color:#FC0680">${money(tt.savings)}</b></span><span class="div"></span><span class="st">${I.star}<small>${L.youEarn}</small><b>+${tt.points}</b></span></div>`;
  }
  function renderPopup(L, icon, title, body, actions, foot, closeAct) {
    return `<div class="scrim" ${closeAct ? `data-act="${closeAct}"` : ""}><div class="popup" data-stop>
      ${closeAct ? `<button class="x" data-act="${closeAct}" aria-label="${L.close}">${I.xBold}</button>` : ""}
      <div class="art"><i></i><img src="assets/dialogs/${icon}.webp" alt=""></div><h2>${title}</h2>${body}<div class="acts">${actions}</div>${foot ? `<div class="ft">${foot}</div>` : ""}</div></div>`;
  }
  function renderReceipt(L) {
    const tt = totals(P.list.items);
    return `<main class="receipt"><div class="hd"><span class="ck">✓</span><div><h1>${L.rT1}<br><b>${L.rT2}</b></h1><p>${L.rP}</p></div></div>
      <img class="illo" src="assets/receipt-illustration.webp" alt="">
      <div class="summary"><div><span class="c">$</span><div><small>${L.listValue}</small><strong>${money(tt.toPay)}</strong></div></div><div><span class="c">${I.gift(26)}</span><div><small>${L.estPts}</small><strong>+${tt.points} pts</strong></div></div></div>
      <button class="rbtn" data-act="openCam">${I.camera(34)}<span class="t"><b>${L.scan}</b><span>${L.scanSub}</span></span>${I.chev}</button>
      <button class="rbtn" data-act="saveList">${I.receipt}<span class="t"><b>${L.saveList}</b><span>${L.saveSub}</span></span>${I.chev}</button>
      <button class="rbtn solid" data-act="editFromReceipt">← ${L.editList}</button></main><div style="height:64px"></div>`;
  }
  function renderCam(L) {
    const c = P.cam, n = c.shots.length;
    return `<div class="cam" role="dialog"><div class="top"><div><b>${L.camT}</b><span>${L.camS}</span></div><button class="x" data-act="closeCam">${I.x}</button></div>
      <div class="frame"><video id="cam-video" autoplay playsinline muted hidden></video><div id="cam-fake" class="fake"><div class="paper">${fakeReceiptText()}</div></div><div class="flash" id="cam-flash"></div>
        <div class="chips"><span class="chip">${L.frame}</span>${n ? `<span class="chip n">${n}/4</span>` : ""}</div></div>
      ${n ? `<div class="thumbs">${c.shots.map((s, i) => `<div><img src="${s}" alt="${L.part(i + 1)}"><button class="rm" data-act="rmShot" data-arg="${i}">×</button></div>`).join("")}</div>` : ""}
      <div class="ctl"><button class="gal" data-act="shot" aria-label="${L.gal}">${I.photo}</button><button class="shutter ${n >= 4 ? "off" : ""}" data-act="shot" aria-label="${L.take}"></button><span style="width:52px"></span></div>
      ${n ? `<button class="validate" data-act="startScan">${L.validate(n)}</button>` : ""}</div>`;
  }
  function fakeReceiptText() {
    const items = (P.list ? P.list.items : selItems()).slice(0, 8);
    return `<div style="text-align:center;font-weight:700">${esc(D.store.name)}<br>${esc(D.store.address)}</div><div style="border-top:1px dashed #999;margin:6px 0"></div>${items.map((it) => `<div style="display:flex;justify-content:space-between"><span>${it.qty}x ${esc(it.name).slice(0, 18)}</span><span>${money(priceNum(it.price) * it.qty)}</span></div>`).join("")}<div style="border-top:1px dashed #999;margin:6px 0"></div><div style="display:flex;justify-content:space-between;font-weight:700"><span>TOTAL</span><span>${money(totals(items).toPay)}</span></div>`;
  }
  function renderScan(L) {
    const s = P.scan;
    return `<div class="scan"><div class="prev"><img src="${s.shots[0]}" alt=""><div class="lines"></div><i></i><i></i><i></i><i></i><div class="bar" style="top:4%"></div>${s.shots.length > 1 ? `<span class="chip n" style="position:absolute;top:10px;left:50%;transform:translateX(-50%);background:#FFF0F7;border:1.5px solid #FC0680;color:#FC0680;border-radius:999px;padding:5px 12px;font-size:12px;font-weight:900">${L.parts(s.shots.length)}</span>` : ""}</div>
      <div class="steps">${L.steps.map((st, i) => `<div class="${i < s.step ? "done" : i === s.step ? "cur" : ""}"><span class="o">${i < s.step ? "✓" : ""}</span>${st}</div>`).join("")}</div><div class="fn">${L.ai}</div></div>`;
  }
  function renderSuccess(L) {
    const s = P.success, rows = s.rows;
    return `<div class="success"><div class="in">${["🎉", "✨", "💗", "⭐", "🎊", "✨", "💗", "⭐"].map((e, i) => `<span class="cf" style="left:${8 + i * 12}%;animation-duration:${1.6 + (i % 3) * 0.5}s;animation-delay:${i * 0.12}s">${e}</span>`).join("")}
      <span class="ck">✓</span><h1>${L.okT1} <b>${L.okT2}</b></h1>
      <div class="ticket"><div class="th">${L.ticket}</div>${rows.map((r, i) => `<div class="r" style="animation-delay:${0.25 + i * 0.22}s;opacity:${r.matched ? 1 : ".42"}"><span class="m" style="color:${r.matched ? "#FC0680" : "#A1A1AA"}">${r.matched ? "✓" : "·"}</span><span class="n">${r.qty}× ${esc(r.name)}</span><span>${money(r.price)}</span></div>`).join("")}
        <div class="tot"><span>${L.yourPts}</span><b id="countup">+0</b></div><span class="stamp">${L.stamp}</span></div><div class="tear"></div>
      <div class="note">${L.okNote}</div><button class="pink-btn" data-act="successContinue">${L.okBtn}</button></div></div>`;
  }
  function totalsBlock(L, list, validated) {
    const tt = totals(list.items);
    return `<div class="totals-card"><div class="totals"><div><small>${L.listValue}</small><div class="v">${money(tt.toPay)}</div></div><div class="r"><small>${validated ? L.ptsEarned : L.ptsToVal}</small><b>${I.gift(24)}+${tt.points} pts</b></div></div></div>`;
  }
  function renderSavedConfirm(L) {
    return `<main class="saved"><div class="center"><img src="assets/list-saved.webp" alt=""><h1>${L.sT1}<b>${L.sT2}</b></h1><p class="p17">${L.sP1}</p><p class="p14">${L.sP2}</p>
      ${totalsBlock(L, P.list, P.list.status === "validated")}
      <div class="remind">${I.camera(34).replace('stroke="currentColor"', 'stroke="#FC0680"')}<span><b>${L.remember}</b>${L.rememberP}</span></div>
      <button class="sbtn" data-act="goSavedList">${L.viewList}</button><button class="sbtn sec" data-act="keepShopping">${L.keep}</button></div></main><div style="height:64px"></div>`;
  }
  function renderSavedList(L) {
    const l = P.list;
    return `<main class="saved"><div class="top"><button data-act="goOffers" aria-label="${L.back}">‹</button><h1>${L.myListT}</h1><span style="width:38px"></span></div>
      <p class="intro">${L.intro}</p>
      ${l ? `<article class="list-art"><div class="row"><span style="color:#FC0680">${I.cart}</span><div class="t"><h2>${L.myListT}</h2><small>${L.products(l.items.length)}</small><small style="font-size:11px">${L.savedOn} ${shortDate(l.date)}</small></div><button class="del" data-act="openDelete" aria-label="${L.delTitle}">${I.trash}</button></div>
        <div class="exp">${L.expiration}${longDate(l.expiresAt)}</div><span class="cd" style="color:${daysLeft(l.expiresAt) <= 2 ? "#DC2626" : "#FC0680"}">${I.clock(15)}${L.daysLeft(daysLeft(l.expiresAt))}</span><hr>
        ${totalsBlock(L, l, l.status === "validated")}
        <button class="sbtn sec sm" data-act="openDetails">${L.details}</button><button class="sbtn sec sm" data-act="editList">${L.edit}</button>
        <button class="sbtn" data-act="scanFromList" style="display:flex;align-items:center;justify-content:center;gap:10px">${I.camera(22)}${L.scanBtn}</button></article>` : ""}
    </main><div style="height:64px"></div>`;
  }
  function renderDetails(L) {
    const l = P.list;
    return `<div class="scrim" data-act="closeDetails"><div class="details" data-stop><h3>${L.detT}</h3><div class="mono" style="text-align:center">${l.id}<br>${shortDate(l.date)}</div>
      <div class="rows mono">${l.items.map((it) => `<div><span><b>${esc(it.name)}</b><br><span style="font-size:12px">${L.qtyL}: ${it.qty}</span></span><span>${esc(it.price)}</span></div>`).join("")}</div>
      ${totalsBlock(L, l, l.status === "validated")}<div class="mono" style="font-size:12px;margin-top:8px">${L.expiration}${longDate(l.expiresAt)}</div>
      <button class="sbtn" style="margin-top:14px" data-act="closeDetails">${L.close}</button></div></div>`;
  }

  /* ─── banner + encuestas ─── */
  function renderBanner(L) {
    const b = P.banner, s = App.state.survey;
    const fullOpen = s.full.available, quickOpen = s.quick.available, anyOpen = fullOpen || quickOpen;
    const best = fullOpen ? s.full.points : quickOpen ? s.quick.points : 0;
    const badge = anyOpen ? best : Math.max(s.quick.points, s.full.points);
    const offset = P.screen === "offers" ? 168 : 16;
    const nextD = 7;
    return `<div class="sb-wrap" style="bottom:calc(${offset}px + env(safe-area-inset-bottom, 0px))"><div>
      ${b.expanded ? `<div style="position:relative"><button class="sb-close" data-act="collapseBanner" aria-label="${L.hide}">×</button>
        <button class="sb-card" data-act="openChooser"><span class="sb-ball"><span>${I.starFs("#FC0680", 24)}</span><span class="sb-float">+${badge}</span></span>
          <span class="t"><b>${anyOpen ? L.bTitle(best) : L.bDone}</b><span>${anyOpen ? L.bSub : L.bSubDone(nextD)}</span></span><span class="chev">›</span></button></div>`
      : `<button class="sb-icon" data-act="expandBanner">${anyOpen ? '<span class="sb-ring"></span>' : ""}${I.assign}<span class="sb-badge">+${badge}</span></button>`}
    </div></div>`;
  }
  function renderChooser(L) {
    const s = App.state.survey;
    const tier = (k) => { const st = s[k], open = st.available; return `<button class="tier" style="${open ? "" : "border-color:#E4E4E7"}" data-act="pickTier" data-arg="${k}">
      <span class="ic" style="${open ? "" : "background:#F4F4F5"}">${k === "quick" ? I.starFs("currentColor", 24) : I.assignS}</span><span class="t"><b>${k === "quick" ? L.quick : L.full}</b><span style="${open ? "" : "color:#A1A1AA"}">${open ? (k === "quick" ? L.quickS : L.fullS) : L.bSubDone(7)}</span></span>
      <span class="pts" style="${open ? "" : "background:#F4F4F5;color:#A1A1AA"}">${open ? `+${st.points}` : L.noPts}</span></button>`; };
    return `<div class="scrim bottom" data-act="closeChooser" style="z-index:1000"><div class="sheet" role="dialog" data-stop><button class="x" data-act="closeChooser">×</button>
      <h2 style="margin:0 40px 4px 0;font-size:21px;font-weight:900">${L.chooseT}</h2><p style="margin:0 0 14px;font-size:13px;color:#52525B">${L.chooseS}</p><div style="display:grid;gap:10px">${tier("full")}${tier("quick")}</div></div></div>`;
  }
  function renderQuick(L) {
    const q = P.quick, s = App.state.survey;
    const body = q.phase === "rate"
      ? `<div style="text-align:center;padding-top:6px"><h2 style="font-size:20px;font-weight:900;margin:0 36px 16px">${L.qT}</h2>
          <div class="stars" role="radiogroup">${[1, 2, 3, 4, 5].map((n) => `<button class="${q.rating >= n ? "on" : ""}" data-act="rate" data-arg="${n}" aria-label="${n}/5"><svg width="46" height="46" viewBox="0 0 24 24" fill="${q.rating >= n ? "#FC0680" : "#F3D9E6"}" stroke="${q.rating >= n ? "#FC0680" : "#E9C9DA"}" stroke-width="1.2"><path d="M12 2.5l2.9 5.9 6.6 1-4.8 4.6 1.1 6.5L12 17.4l-5.8 3.1 1.1-6.5L2.5 9.4l6.6-1z"/></svg></button>`).join("")}</div>
          <textarea class="qs-ta" rows="2" maxlength="280" placeholder="${L.qPh}" data-inp="quickText">${esc(q.text)}</textarea>
          <button class="pink-btn" style="margin-top:12px;padding:14px;font-size:15px;font-weight:900;${q.rating ? "" : "background:#F4F4F5;color:#A1A1AA"}" data-act="sendQuick">${L.qSend}</button></div>`
      : `<div style="text-align:center;padding-top:6px"><div style="animation:popIn .5s ease both">${I.party}</div><h2 style="font-size:22px;font-weight:900;margin:8px 0 10px">${L.qThanks}</h2><span class="qs-award">${L.qAward(s.quick.points)}</span>
          ${s.full.available ? `<div class="xsell"><b>${I.redeemBig.replace('width="24" height="24"', 'width="19" height="19"').replace("currentColor", "#FC0680")}${L.qMore(s.full.points)}</b><p>${L.qMoreS}</p><button class="pink-btn" style="padding:13px;font-size:14.5px;font-weight:900" data-act="fullFromQuick">${L.qMoreB(s.full.points)}</button></div>` : ""}
          <button class="pink-btn" style="margin-top:14px;padding:14px;font-size:15px;font-weight:900;${s.full.available ? "background:#fff;border:1.5px solid #E4E4E7;color:#52525B" : ""}" data-act="closeQuick">${L.done}</button></div>`;
    return `<div class="scrim bottom" data-act="closeQuick" style="z-index:1250"><div class="sheet" role="dialog" data-stop><button class="x" data-act="closeQuick">×</button>${body}</div></div>`;
  }
  function renderRedeem(L) {
    const rs = redeemable(), av = App.state.points.available;
    const next = [...App.state.rewards].sort((a, b) => a.pointsCost - b.pointsCost).find((r) => r.pointsCost > av);
    return `<div class="scrim bottom" data-act="closeRedeem" style="z-index:1050"><div class="sheet rb-sheet" role="dialog" data-stop><button class="x" data-act="closeRedeem">×</button>
      <div class="hd"><span class="tile">${I.redeemBig}</span><div><b>${L.rbT(rs.length)}</b><span>${L.rbS(av.toLocaleString(loc()))}</span></div></div>
      <div class="body">${rs.map((r) => `<div class="rb-row"><span class="th"><img src="${r.img}" alt=""></span><div style="min-width:0"><b>${esc(r.name)}</b><span>${r.pointsCost.toLocaleString(loc())} pts${r.priceUSD ? ` <i>· $${r.priceUSD.toFixed(2)}</i>` : ""}</span></div></div>`).join("")}
        ${next ? `<div class="rb-next">${L.rbNext(next.pointsCost - av, esc(next.name))}</div>` : ""}</div>
      <div class="ft"><button class="pink-btn" style="font-weight:900" data-act="goRewards">${L.rbGo}</button><button class="txt" data-act="closeRedeem">${L.close}</button></div></div></div>`;
  }
  function renderSurvey(L) {
    const s = P.survey, store = D.store.name, name = firstName();
    const close = `<button class="x" data-act="closeSurvey" aria-label="${L.close}">${I.x}</button>`;
    if (s.step === 0) return `<main class="survey">${close}<img class="hero" src="assets/survey/welcome.webp" alt=""><h1 class="greeting">${L.svGreet.join("<br>")}</h1><p class="intro">${L.svIntro} <strong>${esc(store)}.</strong></p>
      <div class="stats">${[I.clock(30), I.gift(30), I.chat].map((ic, i) => `<div>${ic}<strong>${L.svStats[i][0]}</strong><span>${L.svStats[i][1]}</span></div>`).join("")}</div>
      <button class="primary" data-act="svNext">${L.svStart}<span class="arr">→</span></button><button class="secondary" data-act="closeSurvey">${L.svNot}</button><button class="secondary" data-act="goRewards">${L.svRedeem}</button>
      <p class="privacy">${I.lock}${L.svPriv}</p></main>`;
    if (s.step <= 4) {
      const qi = s.step - 1, opts = L.svOpts[qi], cls = qi === 0 ? "ratings" : qi === 3 ? "recs" : "rows";
      return `<main class="survey">${close}<div class="progress" role="progressbar"><div style="width:${s.step * 25}%"></div></div>
        <div class="stepHeader"><span>${L.svOf(s.step)}</span><button data-act="svRestart">${L.svRestart}</button></div><div class="reward">+50 ${L.svReward}</div>
        <div class="qi ${qi === 0 ? "centered" : ""}"><h1>${L.svQ(store)[qi]}</h1><p>${L.svHint[qi]}</p></div>
        <div class="options ${cls}">${opts.map((o, i) => `<button class="opt ${s.answers[qi] === i ? "on" : ""}" data-act="svPick" data-arg="${i}"><img src="assets/survey/${SV_ART[qi][i]}.webp" alt="" ${SV_ART[qi][i] === "perfect" ? 'style="transform:scale(.85)"' : ""}><span>${o}</span></button>`).join("")}</div>
        <div class="dots">${[1, 2, 3, 4].map((n) => `<i class="${n === s.step ? "on" : ""}"></i>`).join("")}</div></main>`;
    }
    return `<main class="survey">${close}<img class="thanksArt" src="assets/survey/thanks.webp" alt=""><h1 class="thanksTitle">${L.svThanks(esc(name))}</h1><p class="thanksCopy">${L.svCopy1} <strong>${esc(store)}</strong>${L.svCopy2}</p>
      <div class="earned"><small>${L.svEarned}</small><b id="sv-count">+0</b><span>${L.svAdded}</span></div>
      ${App.state.survey.quick.available ? `<div class="xsell"><b>${I.starFs("#FC0680", 19)}${L.svXsT(App.state.survey.quick.points)}</b><p>${L.svXsS}</p><button class="pink-btn" style="padding:12px;font-size:14px;font-weight:900" data-act="quickFromSurvey">${L.svXsB(App.state.survey.quick.points)}</button></div>` : ""}
      <button class="primary" data-act="closeSurvey">${L.svBack}</button><button class="secondary" data-act="goRewards">${L.svRedeem}</button><p class="delivery">${L.svDeliv[0]}<br>${L.svDeliv[1]}</p></main>`;
  }

  /* ─── cámara ─── */
  let stream = null;
  function startCamera() {
    const v = document.getElementById("cam-video"), fake = document.getElementById("cam-fake");
    if (!v) return;
    if (stream) { v.srcObject = stream; v.hidden = false; fake.hidden = true; return; }
    if (!navigator.mediaDevices?.getUserMedia) return;
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then((s) => { stream = s; const vv = document.getElementById("cam-video"); if (vv) { vv.srcObject = s; vv.hidden = false; document.getElementById("cam-fake").hidden = true; } }).catch(() => {});
  }
  function stopCamera() { if (stream) { stream.getTracks().forEach((tr) => tr.stop()); stream = null; } }
  function takeShot() {
    const v = document.getElementById("cam-video"), c = document.createElement("canvas");
    if (v && !v.hidden && v.videoWidth) { c.width = v.videoWidth; c.height = v.videoHeight; c.getContext("2d").drawImage(v, 0, 0); return c.toDataURL("image/jpeg", 0.82); }
    // Sin cámara: dibujamos un recibo con la lista para que el flujo se vea completo.
    c.width = 480; c.height = 640; const g = c.getContext("2d");
    g.fillStyle = "#3a3a42"; g.fillRect(0, 0, 480, 640); g.fillStyle = "#fff"; g.fillRect(90, 50, 300, 540);
    g.fillStyle = "#222"; g.font = "bold 16px Courier New"; g.textAlign = "center"; g.fillText(D.store.name.slice(0, 26), 240, 85); g.font = "12px Courier New"; g.fillText(D.store.address.slice(0, 34), 240, 105);
    const items = (P.list ? P.list.items : selItems()).slice(0, 12); g.textAlign = "left"; let y = 150;
    items.forEach((it) => { g.fillText(`${it.qty}x ${it.name.slice(0, 20)}`, 105, y); g.textAlign = "right"; g.fillText(money(priceNum(it.price) * it.qty), 375, y); g.textAlign = "left"; y += 22; });
    g.font = "bold 14px Courier New"; g.fillText("TOTAL", 105, y + 20); g.textAlign = "right"; g.fillText(money(totals(items).toPay), 375, y + 20);
    return c.toDataURL("image/jpeg", 0.85);
  }

  /* ─── acciones ─── */
  const clearBannerTimers = () => { P.banner.timers.forEach(clearTimeout); P.banner.timers = []; };
  const scheduleBanner = () => { clearBannerTimers(); if (P.banner.dismissed || P.banner.pinned) return; P.banner.timers = [setTimeout(() => { P.banner.expanded = true; render(); }, 3000), setTimeout(() => { P.banner.expanded = false; render(); }, 8000)]; };
  const showScreen = (s) => { P.screen = s; window.scrollTo(0, 0); render(); scheduleBanner(); };
  const newList = (items) => ({ id: "SL-" + Math.random().toString(36).slice(2, 8).toUpperCase(), date: new Date().toISOString(), expiresAt: new Date(Date.now() + 7 * 864e5).toISOString(), status: "pending", items: items.map((it) => ({ name: it.name, price: it.price, originalPrice: it.originalPrice, savings: it.savings, unit: it.unit, category: it.category, imageUrl: it.imageUrl, qty: it.qty })) });

  const ACT = {
    lang: (l) => { App.setLang(l); render(); },
    goRewards: () => { P.redeem = false; App.go("rewards"); },
    closeWelcome: () => { P.welcome = false; render(); scheduleBanner(); },
    editName: () => { P.askName = true; P.nameDraft = App.state.name; render(); },
    openLightbox: () => { P.lightbox = true; render(); }, closeLightbox: () => { P.lightbox = false; render(); },
    toggle: (id) => {
      const before = Object.values(P.sel).filter((q) => q > 0).length;
      if (P.sel[id]) delete P.sel[id]; else { const o = offersFor().find((x) => x._id === id); P.sel[id] = (o && o.qty) || 1; }
      const after = Object.values(P.sel).filter((q) => q > 0).length;
      render();
      if (after > before) { P.bubbles.show = true; render(); clearTimeout(P.bubbles.timer); P.bubbles.timer = setTimeout(() => { P.bubbles.show = false; render(); }, 1500); }
    },
    qty: (arg) => { const [id, d] = arg.split("|"); P.sel[id] = Math.max(1, (P.sel[id] || 1) + Number(d)); render(); },
    cta: () => {
      const items = selItems(); if (!items.length) return;
      if (P.editing) { P.list = { ...P.list, items: newList(items).items }; P.editing = false; P.sel = {}; P.expirePopup = false; showScreen("savedConfirm"); return; }
      if (P.list && P.list.status === "pending") { P.validatePopup = true; render(); return; }
      P.list = newList(items); P.notice = ""; showScreen("receipt");
    },
    closeValidate: () => { P.validatePopup = false; render(); },
    validateFromPopup: () => { P.validatePopup = false; P.screen = "receipt"; P.cam = { shots: [] }; render(); },
    goSavedList: () => { P.expirePopup = false; showScreen("savedList"); },
    goOffers: () => showScreen("offers"),
    keepShopping: () => { P.sel = {}; showScreen("offers"); },
    saveList: () => { showScreen("savedConfirm"); if (P.list.status === "pending") { P.expirePopup = true; render(); } },
    closeExpire: () => { P.expirePopup = false; render(); },
    editFromReceipt: () => ACT.editList(),
    editList: () => { P.editing = true; P.sel = {}; P.list.items.forEach((it, i) => { P.sel["saved:" + i] = it.qty; }); showScreen("offers"); },
    openDetails: () => { P.details = true; render(); }, closeDetails: () => { P.details = false; render(); },
    openDelete: () => { P.deletePopup = true; render(); }, closeDelete: () => { P.deletePopup = false; render(); },
    deleteList: () => { P.deletePopup = false; P.deletedPopup = true; render(); },
    closeDeleted: () => { P.deletedPopup = false; P.list = null; P.sel = {}; showScreen("offers"); },
    scanFromList: () => { P.screen = "receipt"; P.cam = { shots: [] }; render(); },
    openCam: () => { P.cam = { shots: [] }; render(); },
    closeCam: () => { P.cam = null; stopCamera(); render(); },
    shot: () => { if (P.cam.shots.length >= 4) return; const f = document.getElementById("cam-flash"); if (f) { f.style.opacity = ".75"; setTimeout(() => (f.style.opacity = "0"), 180); } P.cam.shots.push(takeShot()); render(); },
    rmShot: (i) => { P.cam.shots.splice(Number(i), 1); render(); },
    startScan: () => {
      const shots = P.cam.shots; P.cam = null; stopCamera(); P.scan = { shots, step: 0 }; render();
      const tick = setInterval(() => { if (!P.scan) return clearInterval(tick); P.scan.step++; if (P.scan.step > 3) { clearInterval(tick); return; } render(); }, 1900);
      setTimeout(() => { clearInterval(tick); if (!P.scan) return; P.scan = null; finishScan(); }, 8000);
    },
    successContinue: () => { P.success = null; P.survey = { step: 0, answers: [] }; window.scrollTo(0, 0); render(); },
    expandBanner: () => { P.banner.pinned = true; P.banner.expanded = true; clearBannerTimers(); render(); },
    collapseBanner: () => { P.banner.expanded = false; P.banner.dismissed = true; clearBannerTimers(); render(); },
    openChooser: () => { P.banner.pinned = true; P.banner.sheet = true; clearBannerTimers(); render(); },
    closeChooser: () => { P.banner.sheet = false; render(); },
    pickTier: (k) => { P.banner.sheet = false; P.banner.expanded = false; if (k === "full") { P.survey = { step: 0, answers: [] }; window.scrollTo(0, 0); } else P.quick = { phase: "rate", rating: 0, text: "" }; render(); },
    rate: (n) => { P.quick.rating = Number(n); render(); },
    sendQuick: () => {
      if (!P.quick.rating) return; P.quick.phase = "thanks"; const s = App.state.survey.quick;
      if (s.available) { s.available = false; App.state.points.available += s.points; App.state.points.earned += s.points; if (typeof confetti === "function") confetti({ particleCount: 90, spread: 70, origin: { y: 0.7 }, colors: ["#FC0680", "#FF7AB8", "#FFD1E6", "#fff"], zIndex: 2000 }); }
      render();
    },
    closeQuick: () => { P.quick = null; render(); },
    fullFromQuick: () => { P.quick = null; P.survey = { step: 0, answers: [] }; window.scrollTo(0, 0); render(); },
    quickFromSurvey: () => { P.survey = null; P.quick = { phase: "rate", rating: 0, text: "" }; showScreen("offers"); },
    openRedeem: (a, el, ev) => { ev.preventDefault(); ev.stopPropagation(); P.redeem = true; render(); },
    closeRedeem: () => { P.redeem = false; render(); },
    svNext: () => { P.survey.step++; render(); },
    svRestart: () => { P.survey = { step: 1, answers: [] }; render(); },
    svPick: (i) => {
      const s = P.survey; s.answers[s.step - 1] = Number(i); render();
      setTimeout(() => { if (!P.survey) return; s.step++; render(); if (s.step === 5) finishSurvey(); }, 550);
    },
    closeSurvey: () => { P.survey = null; P.sel = {}; showScreen("offers"); },
  };

  function finishScan() {
    const items = P.list.items, pts = pointsFor(items);
    const rows = items.slice(0, 7).map((it) => ({ name: it.name, qty: it.qty, price: priceNum(it.price) * it.qty, matched: true }));
    rows.push({ name: App.state.lang === "es" ? "Bolsa plástica" : "Plastic bag", qty: 1, price: 0.1, matched: false });
    P.list.status = "validated"; App.state.points.available += pts; App.state.points.earned += pts;
    P.success = { rows, pts }; render();
    countUp("countup", pts, 1200, "+");
  }
  function finishSurvey() {
    const s = App.state.survey.full, pts = s.available ? s.points : 0;
    if (s.available) { s.available = false; App.state.points.available += pts; App.state.points.earned += pts; }
    setTimeout(() => countUp("sv-count", pts, 1600, "+", 2), 50);
  }
  function countUp(id, to, ms, prefix, pow = 3) {
    const el = document.getElementById(id); if (!el) return;
    const t0 = performance.now();
    const step = (now) => { const p = Math.min(1, (now - t0) / ms), e = 1 - Math.pow(1 - p, pow); el.textContent = `${prefix}${Math.round(to * e)}`; if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }

  /* ─── delegación de eventos ─── */
  root.addEventListener("click", (ev) => {
    const el = ev.target.closest("[data-act]"); if (!el) return;
    // Clic adentro de una hoja (data-stop): no dispara la acción del velo que la envuelve.
    const stop = ev.target.closest("[data-stop]"); if (stop && !stop.contains(el)) return;
    if (el.tagName === "A") ev.preventDefault();
    // Al hacer clic en un hijo con acción propia (badge dentro del chip), sólo corre la interior.
    const fn = ACT[el.dataset.act]; if (fn) { ev.stopPropagation(); fn(el.dataset.arg, el, ev); }
  });
  root.addEventListener("input", (ev) => {
    const el = ev.target.closest("[data-inp]"); if (!el) return;
    if (el.dataset.inp === "nameDraft") { P.nameDraft = el.value; const b = el.closest("form").querySelector("button"); b.classList.toggle("off", P.nameDraft.trim().split(/\s+/).filter(Boolean).length < 2); }
    if (el.dataset.inp === "quickText") P.quick.text = el.value;
  });
  root.addEventListener("submit", (ev) => {
    ev.preventDefault();
    if (ev.target.dataset.form === "name") {
      const parts = P.nameDraft.trim().split(/\s+/).filter(Boolean); if (parts.length < 2) return;
      const at = parts.length >= 4 ? 2 : 1;
      App.state.name = P.nameDraft.trim(); App.state.profile.saved.firstName = parts.slice(0, at).join(" "); App.state.profile.saved.lastName = parts.slice(at).join(" ");
      const first = !App.state.profile.firstDone; App.state.profile.firstDone = true;
      P.askName = false; if (first) P.welcome = true; render(); if (!first) scheduleBanner();
    }
  });

  render();
})();
