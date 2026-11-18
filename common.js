/* =====================================================================
   そだてる食堂 共通スクリプト（全ページで読み込み）

   ▼ 設定欄：ここだけ書き換えれば、全ページのボタン・リンク・人数に反映されます
   ===================================================================== */
const SITE = {
  /* コングラントの申込ページURL（決まったら貼り付け。空欄のあいだは「準備中」表示） */
  CONGRANT_MONTHLY_URL: "",   // 月額サポーター
  CONGRANT_ONCE_URL:    "",   // 単発のご寄付（空欄なら月額と同じURLを使います）
  CONGRANT_ANNUAL_URL:  "",   // 企業・団体の年間パートナー（空欄なら月額と同じURLを使います）

  /* お問い合わせ先（どちらか一方でもOK。両方空欄なら X のDMへ案内します） */
  CONTACT_EMAIL:    "",       // 例: "info@example.com"
  CONTACT_FORM_URL: "",       // 例: "https://forms.gle/xxxxx"
  X_URL: "https://x.com/fooodflight",

  /* はじまりの100人（月次レポートの作成と同時に更新） */
  SUPPORTER_GOAL:  100,
  SUPPORTER_COUNT: 0,

  /* 支援シミュレーターの試算の前提（仮） */
  MEAL_COST: 1000,            // 1食あたりの費用（円）
  LETTUCE_COST: 500,          // レタス1株あたりの費用（円）
  MONTHLY_COST: 200000        // 毎月の運営費（円）
};
/* ===================================================================== */

(function(){
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- ヘッダー：すりガラス・スマホメニュー ---------- */
  const head = $("#head");
  if (head){
    const onScroll = () => head.classList.toggle("is-scrolled", scrollY > 8);
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }
  const btn = $("#menu-btn"), nav = $("#m-nav");
  if (btn && nav){
    const set = open => {
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      btn.setAttribute("aria-label", open ? "メニューを閉じる" : "メニューを開く");
      nav.classList.toggle("open", open);
      head && head.classList.toggle("menu-open", open);
    };
    btn.addEventListener("click", () => set(btn.getAttribute("aria-expanded") !== "true"));
    nav.addEventListener("click", e => { if (e.target.closest("a")) set(false); });
    addEventListener("keydown", e => { if (e.key === "Escape") set(false); });
    addEventListener("resize", () => { if (innerWidth > 900) set(false); });
  }

  /* ---------- スクロールに合わせて、下からふわっと表示 ---------- */
  const SELECTORS = [
    ".hero-tags",".hero h1",".hero-lead",".hero-actions",".hero-meta",".collage > *",
    ".sec-head",".tile",".reason",".farm-card",".farm-flow",".farm-cta",".fcard",".story-photo",".story-body",
    ".goal-card",".budget",".sim",".plan",".role",".tier",".corp-why > div",".media",".angles li",".way",
    ".org-text",".facts",".faq details",".final-card",
    ".sp-hero h1",".sp-lead",".stat",".cat-head",".pcard",".logo-tile",".name-row li",
    ".wall-wrap",".plate",".wall li",".oyasai",".ik-card",".empty",
    ".post-card",".note-box",".kpi > div",".empty-box",".page-hero h1",".page-hero .lead",
    ".contact-grid > *",".pay-grid > *",".r-table",".faq-nav"
  ].join(",");
  let io = null;
  if (!reduce && "IntersectionObserver" in window){
    io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: .12, rootMargin: "0px 0px -6% 0px" });
  }
  window.sodateruReveal = (root = document) => {
    if (!io) return;
    $$(SELECTORS, root).forEach(el => {
      if (el.classList.contains("rv")) return;
      const sibs = [...el.parentElement.children].filter(c => c.matches(SELECTORS));
      el.style.setProperty("--d", (Math.min(sibs.indexOf(el), 6) * 0.08) + "s");
      el.classList.add("rv");
      io.observe(el);
    });
  };
  window.sodateruReveal();

  /* ---------- 数字のカウントアップ ---------- */
  window.sodateruCount = (el, to, opts = {}) => {
    const from = opts.from ?? (parseFloat(String(el.dataset.v ?? "0")) || 0);
    const dec = opts.decimals ?? 0, dur = reduce ? 0 : (opts.duration ?? 1100);
    const fmt = v => v.toLocaleString("ja-JP", { minimumFractionDigits: dec, maximumFractionDigits: dec });
    el.dataset.v = to;
    if (!dur){ el.textContent = fmt(to); return; }
    const t0 = performance.now();
    const step = t => {
      const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(from + (to - from) * e);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  /* ---------- コングラントの申込ボタン ---------- */
  const CG = {
    monthly: SITE.CONGRANT_MONTHLY_URL,
    once:    SITE.CONGRANT_ONCE_URL   || SITE.CONGRANT_MONTHLY_URL,
    annual:  SITE.CONGRANT_ANNUAL_URL || SITE.CONGRANT_MONTHLY_URL
  };
  $$("[data-congrant]").forEach(a => {
    const url = CG[a.dataset.congrant];
    if (url){ a.href = url; a.target = "_blank"; a.rel = "noopener"; }
    else { a.classList.add("is-pending"); a.title = "お申し込みの受付は準備中です"; }
  });
  /* 「受付準備中」のお知らせ枠：URLが入ったら自動で消える */
  $$(".js-congrant-pending").forEach(el => { el.hidden = !!CG[el.dataset.for || "monthly"]; });

  /* ---------- お問い合わせボタン（data-mail="件名"） ---------- */
  $$("[data-mail]").forEach(a => {
    const subject = "【そだてる食堂】" + (a.dataset.mail || "お問い合わせ");
    if (SITE.CONTACT_EMAIL){
      a.href = "mailto:" + SITE.CONTACT_EMAIL + "?subject=" + encodeURIComponent(subject);
    } else if (SITE.CONTACT_FORM_URL){
      a.href = SITE.CONTACT_FORM_URL; a.target = "_blank"; a.rel = "noopener";
      if (a.dataset.label !== "keep") a.textContent = "フォームで問い合わせる";
    } else {
      a.href = SITE.X_URL; a.target = "_blank"; a.rel = "noopener";
      if (a.dataset.label !== "keep") a.textContent = "X（@fooodflight）のDMで問い合わせる";
    }
  });
  $$(".js-contact-email").forEach(el => {
    if (SITE.CONTACT_EMAIL){ el.innerHTML = `<a href="mailto:${SITE.CONTACT_EMAIL}">${SITE.CONTACT_EMAIL}</a>`; }
    else el.closest(".js-contact-email-row")?.setAttribute("hidden", "");
  });
  $$(".js-contact-form").forEach(el => {
    if (SITE.CONTACT_FORM_URL){ el.href = SITE.CONTACT_FORM_URL; el.target = "_blank"; el.rel = "noopener"; }
    else el.closest(".js-contact-form-row")?.setAttribute("hidden", "");
  });

  /* ---------- 写真：読み込めたらふわっと表示、だめなら元の枠に戻す ---------- */
  $$(".ph img").forEach(img => {
    const ph = img.closest(".ph");
    const ok = () => { img.classList.add("loaded"); ph.classList.add("has-photo"); };
    const ng = () => { img.remove(); ph.classList.remove("has-photo"); };
    if (img.complete && img.naturalWidth) ok();
    else if (img.complete) ng();
    else { img.addEventListener("load", ok, { once: true }); img.addEventListener("error", ng, { once: true }); }
  });

  /* ---------- はじまりの100人 ---------- */
  const goal = Math.max(1, SITE.SUPPORTER_GOAL);
  const count = Math.max(0, Math.min(SITE.SUPPORTER_COUNT, goal));
  $$(".js-goal-text").forEach(el => el.textContent = goal);
  $$(".js-count").forEach(el => el.textContent = count);
  $$(".js-rest").forEach(el => el.textContent = goal - count);
  $$(".js-mini").forEach(el => {
    let h = ""; for (let i = 0; i < 30; i++) h += `<i class="${i < Math.round(count / goal * 30) ? "on" : ""}"></i>`;
    el.innerHTML = h;
  });
  $$(".js-seats").forEach(grid => {
    let h = "";
    for (let i = 0; i < goal; i++){
      const cls = i < count ? "on" : (i === count ? "you" : "");
      h += `<i class="${cls}" style="--i:${i}" data-n="${i + 1}"></i>`;
    }
    grid.innerHTML = h;
    grid.setAttribute("aria-label", `${goal}席のうち${count}席が埋まっています。${count < goal ? `次はNo.${String(count + 1).padStart(2, "0")}の席です。` : ""}`);
    const card = grid.closest(".goal-card");
    if (!card) return;
    const tip = document.createElement("span");
    tip.className = "seat-tip"; tip.setAttribute("aria-hidden", "true");
    card.appendChild(tip);
    const show = el => {
      const n = +el.dataset.n, no = String(n).padStart(2, "0");
      tip.innerHTML = n <= count ? `No.<b>${no}</b>：参加済みのサポーター`
        : n === count + 1 ? `No.<b>${no}</b>：募集中（あなたの席）` : `No.<b>${no}</b>：募集中`;
      const r = el.getBoundingClientRect(), c = card.getBoundingClientRect();
      const x = Math.max(110, Math.min(c.width - 110, r.left - c.left + r.width / 2));
      tip.style.left = x + "px"; tip.style.top = (r.top - c.top) + "px";
      tip.classList.add("show");
    };
    grid.addEventListener("pointerover", e => { if (e.target.tagName === "I") show(e.target); });
    grid.addEventListener("pointerleave", () => tip.classList.remove("show"));
    grid.addEventListener("click", e => { if (e.target.tagName === "I") show(e.target); });
    if ("IntersectionObserver" in window){
      const o = new IntersectionObserver(([en]) => { if (en.isIntersecting){ grid.classList.add("go"); o.disconnect(); } }, { threshold: .3 });
      o.observe(grid);
    } else grid.classList.add("go");
  });

  /* ---------- 支援シミュレーター ---------- */
  const range = $("#sim-range");
  if (range){
    const btns = $$(".sim-amounts button");
    const out = $("#sim-out"), amt = $("#sim-amt"), meals = $("#sim-meals"), lettuce = $("#sim-lettuce"),
          share = $("#sim-share"), sprouts = $("#sim-sprouts"), plan = $("#sim-plan"), perk = $("#sim-perk");
    const SPROUT = '<svg viewBox="0 0 20 20"><path d="M10 18v-7" stroke="#B7E4C7" stroke-width="1.6" stroke-linecap="round"/><path d="M10 11.5c0-3.5 2.2-5.5 6-5.5 0 3.5-2.2 5.5-6 5.5z" fill="#52B788"/><path d="M10 13c0-3-1.9-4.6-5-4.6 0 3 1.9 4.6 5 4.6z" fill="#E3A92B"/></svg>';
    let shown = 0;
    const update = (v, instant) => {
      v = Math.round(v / 1000) * 1000;
      range.value = v;
      btns.forEach(b => b.setAttribute("aria-pressed", +b.dataset.v === v ? "true" : "false"));
      out.textContent = "¥" + v.toLocaleString("ja-JP");
      const o = instant ? { duration: 0 } : { duration: 700 };
      sodateruCount(amt, v, o);
      sodateruCount(meals, Math.round(v * 12 / SITE.MEAL_COST), o);
      sodateruCount(lettuce, Math.round(v * 12 / SITE.LETTUCE_COST), o);
      sodateruCount(share, v / SITE.MONTHLY_COST * 100, { ...o, decimals: 1 });
      const n = Math.max(1, Math.min(36, Math.round(v * 12 / SITE.LETTUCE_COST / 20)));
      if (n > shown){ for (let i = shown; i < n; i++){ const s = document.createElement("span"); s.innerHTML = SPROUT; s.firstChild.style.animationDelay = ((i - shown) * 25) + "ms"; sprouts.appendChild(s.firstChild); } }
      else while (sprouts.children.length > n) sprouts.lastChild.remove();
      shown = n;
      if (v >= 10000){ plan.textContent = "マイ・レーン オーナー"; perk.textContent = "栽培ラック1段のネームプレートと、支援者限定ナイト交流会"; }
      else if (v >= 3000){ plan.textContent = "そだてるサポーター"; perk.textContent = "名前の掲示と、月1回の収穫体験・試食会"; }
      else { plan.textContent = "おやさいサポーター"; perk.textContent = "毎月1食分の食数チケットと、月次レポート"; }
    };
    btns.forEach(b => b.addEventListener("click", () => update(+b.dataset.v)));
    range.addEventListener("input", () => update(+range.value));
    update(+range.value, true);
  }

  /* ---------- 画面下の追従ボタン ---------- */
  const float = $("#float");
  if (float){
    const fb = float.querySelector("a");
    const hero = $(".hero");
    const zones = $$("#join");
    let past = false; const visible = new Set();
    const update = () => {
      const show = past && visible.size === 0;
      float.classList.toggle("show", show);
      float.setAttribute("aria-hidden", show ? "false" : "true");
      fb.tabIndex = show ? 0 : -1;
    };
    if (hero && "IntersectionObserver" in window){
      new IntersectionObserver(([e]) => { past = !e.isIntersecting && e.boundingClientRect.top < 0; update(); }, { threshold: 0 }).observe(hero);
    } else {
      const onS = () => { past = scrollY > 560; update(); };
      addEventListener("scroll", onS, { passive: true }); onS();
    }
    if ("IntersectionObserver" in window){
      const zo = new IntersectionObserver(es => { es.forEach(e => e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)); update(); }, { threshold: .15 });
      zones.forEach(z => zo.observe(z));
    }
  }
})();
