/* サポーター・パートナー一覧（sponsors.html 専用）：sponsors.json を読み込んで表示します */
(function(){
  /* ---- 協賛者データの表示 ---- */
  const TIERS = [
    { key:"shukaku", name:"しゅうかく", sub:"年50万円以上",
      icon:'<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="20" fill="#1B4332"/><ellipse cx="20" cy="24" rx="12" ry="8" fill="#2D6A4F"/><circle cx="15" cy="20" r="6" fill="#52B788"/><circle cx="25" cy="19.5" r="5.5" fill="#52B788"/><circle cx="20" cy="17" r="4.5" fill="#B7E4C7"/></svg>' },
    { key:"honba", name:"ほんば", sub:"年30万円",
      icon:'<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="20" fill="#E4EFE7"/><path d="M20 32V16" stroke="#1B4332" stroke-width="2.4" stroke-linecap="round"/><path d="M20 21c0-6 4-9 10-9 0 6-4 9-10 9z" fill="#2D6A4F"/><path d="M20 25c0-5-3-8-8.5-8 0 5 3 8 8.5 8z" fill="#52B788"/></svg>' },
    { key:"futaba", name:"ふたば", sub:"年10万円",
      icon:'<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="20" fill="#E4EFE7"/><path d="M20 30V20" stroke="#2D6A4F" stroke-width="2.4" stroke-linecap="round"/><ellipse cx="15" cy="19" rx="5.5" ry="3.5" fill="#52B788"/><ellipse cx="25" cy="19" rx="5.5" ry="3.5" fill="#52B788"/></svg>' },
    { key:"tane", name:"たね", sub:"年3万円",
      icon:'<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="20" fill="#F1EEE6"/><ellipse cx="20" cy="24" rx="7" ry="4.5" fill="#8C9692"/><ellipse cx="20" cy="22.5" rx="3" ry="2" fill="#52B788"/></svg>' }
  ];
  const IK = {
    seed:{ label:"種・苗", icon:'<svg viewBox="0 0 24 24" fill="none" stroke="#1B4332" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20V10"/><path d="M12 11c0-4 2.5-6 6.5-6 0 4-2.5 6-6.5 6z"/><path d="M12 14c0-3.4-2-5-5.5-5 0 3.4 2 5 5.5 5z"/></svg>' },
    equipment:{ label:"設備・厨房機器", icon:'<svg viewBox="0 0 24 24" fill="none" stroke="#1B4332" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="3" width="12" height="18" rx="2"/><path d="M6 10h12M9 6v2M9 13v3"/></svg>' },
    food:{ label:"食材", icon:'<svg viewBox="0 0 24 24" fill="none" stroke="#1B4332" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11h16a8 8 0 0 1-16 0z"/><path d="M9 7c0-1.5 1-2.5 3-3M14 7c0-1 .6-2 2-2.5"/></svg>' },
    other:{ label:"その他", icon:'<svg viewBox="0 0 24 24" fill="none" stroke="#1B4332" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="9" width="16" height="11" rx="2"/><path d="M3 9h18M12 9v11M12 9c-2-4-6-4-6-1.5S12 9 12 9zM12 9c2-4 6-4 6-1.5S12 9 12 9z"/></svg>' }
  };
  const PLATE_ICON = '<svg viewBox="0 0 34 34" aria-hidden="true"><circle cx="17" cy="17" r="17" fill="rgba(255,255,255,.2)"/><rect x="7" y="19" width="20" height="3" rx="1.5" fill="#fff"/><circle cx="12" cy="16" r="3" fill="#B7E4C7"/><circle cx="17" cy="16" r="3" fill="#B7E4C7"/><circle cx="22" cy="16" r="3" fill="#B7E4C7"/></svg>';

  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const safeUrl = u => /^https?:\/\//.test(u || "") ? u : "";
  const markOf = s => s.logo ? `<img src="${esc(s.logo)}" alt="${esc(s.name)}" loading="lazy">` : `<span>${esc(s.name)}</span>`;
  const linkOr = (s, cls, inner) => {
    const u = safeUrl(s.url);
    return u ? `<a class="${cls}" href="${esc(u)}" target="_blank" rel="noopener">${inner}</a>` : `<div class="${cls}">${inner}</div>`;
  };
  const label = t => `<h3 class="tier-label">${t.icon}${esc(t.name)}<small>${esc(t.sub)}</small></h3>`;

  function partnersHTML(list){
    let h = "";
    TIERS.forEach(t => {
      const items = list.filter(p => p.tier === t.key);
      if (!items.length) return;
      h += label(t);
      if (t.key === "shukaku"){
        h += `<div class="p-xl">${items.map(p => linkOr(p, "pcard shukaku",
          `<span class="badge">しゅうかく</span><div class="mark">${markOf(p)}</div>${p.logo ? `<b>${esc(p.name)}</b>` : ""}${p.rack ? `<span class="rack">${esc(p.rack)}</span>` : ""}${p.message ? `<blockquote>${esc(p.message)}</blockquote>` : ""}`)).join("")}</div>`;
      } else if (t.key === "honba"){
        h += `<div class="p-l">${items.map(p => linkOr(p, "pcard",
          `<div class="mark">${markOf(p)}</div>${p.rack ? `<span class="rack">${esc(p.rack)}</span>` : ""}${p.message ? `<blockquote>${esc(p.message)}</blockquote>` : ""}`)).join("")}</div>`;
      } else if (t.key === "futaba"){
        h += `<div class="p-m">${items.map(p => linkOr(p, "logo-tile", markOf(p))).join("")}</div>`;
      } else {
        h += `<ul class="name-row">${items.map(p => {
          const u = safeUrl(p.url);
          return `<li>${u ? `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(p.name)}</a>` : `<span>${esc(p.name)}</span>`}</li>`;
        }).join("")}</ul>`;
      }
    });
    return h || `<p class="empty">最初の法人パートナーの席が、まだ空いています。ラックやエリアに、御社の名前を刻みませんか。<a href="partners.html">法人パートナープランを見る</a></p>`;
  }

  function wallHTML(monthly, oyasai, note){
    const lanes = monthly.filter(m => m.plan === "lane");
    const names = monthly.filter(m => m.plan !== "lane");
    let h = "";
    if (lanes.length){
      h += `<p class="wall-sub">マイ・レーン オーナー<small>月10,000円〜</small></p>
        <div class="lanes">${lanes.map(m => `<div class="plate">${PLATE_ICON}<div><b>${esc(m.lane || m.name + "のレーン")}</b><span>${esc(m.name)}</span></div></div>`).join("")}</div>`;
    }
    if (names.length){
      h += `<p class="wall-sub">そだてるサポーター<small>月3,000円〜</small></p>
        <ul class="wall">${names.map(m => `<li>${esc(m.name)}</li>`).join("")}</ul>`;
    }
    if (oyasai > 0){
      h += `<div class="oyasai"><b>${oyasai}</b><span>名のおやさいサポーター（月1,000円〜）が、毎月の食数チケットを支えています。</span></div>`;
    }
    if (!h){
      return `<p class="empty">サポーターズウォールの一番目は、まだ空いています。月3,000円のそだてるサポーターになると、ここに最初のお名前が刻まれます。<a href="support.html">月額プランを見る</a></p>`;
    }
    return `<div class="wall-wrap">${h}${note ? `<p class="wall-note">${esc(note)}</p>` : ""}</div>`;
  }

  function inkindHTML(list){
    if (!list.length) return `<p class="empty">種や苗、厨房機器、食材のご提供をお待ちしています。<a href="join.html#goods">提供のご相談はこちら</a></p>`;
    return `<div class="ik">${list.map(i => {
      const t = IK[i.type] ? i.type : "other";
      return `<div class="ik-card ${t}"><span class="ico">${IK[t].icon}</span><b>${esc(i.name)}<span class="ik-type">${IK[t].label}</span></b><span>${esc(i.item)}</span></div>`;
    }).join("")}</div>`;
  }

  const FARM_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="#1B4332" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21v-9"/><path d="M12 12c0-4.5 2.8-7 7-7 0 4.5-2.8 7-7 7z"/><path d="M12 15c0-3.8-2.3-6-6-6 0 3.8 2.3 6 6 6z"/><path d="M4 21h16"/></svg>';
  const WELFARE_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="#8A3E1F" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="7" r="3"/><circle cx="16" cy="7" r="3"/><path d="M2.5 20c0-3.6 2.5-6 5.5-6s5.5 2.4 5.5 6"/><path d="M10.5 20c0-3.6 2.5-6 5.5-6s5.5 2.4 5.5 6"/></svg>';
  function farmersHTML(list){
    if (!list.length) return `<p class="empty">最初の「ヒーロー農家さん」を募集しています。規格外の野菜や、採れすぎた旬の野菜を、こどもたちの食卓へ。<a href="join.html#farmers">野菜の提供・農福連携について</a></p>`;
    return `<div class="fgrid">${list.map(f => {
      const w = f.kind === "welfare";
      const u = safeUrl(f.url);
      const inner = `<div class="fc-top"><span class="fc-ico">${w ? WELFARE_ICON : FARM_ICON}</span><span class="fc-name">${esc(f.name)}<small>さま</small></span></div>
        <span class="fc-badge">${w ? "農福連携パートナー" : "ヒーロー農家さん"}</span>
        ${f.item ? `<p class="fc-item"><b>${esc(f.item)}</b>${w ? "でご協力いただいています" : "をご提供いただきました"}</p>` : ""}
        ${f.area ? `<span class="fc-area">${esc(f.area)}</span>` : ""}
        ${f.message ? `<blockquote>${esc(f.message)}</blockquote>` : ""}`;
      return u ? `<a class="fcard${w ? " welfare" : ""}" href="${esc(u)}" target="_blank" rel="noopener">${inner}</a>`
               : `<div class="fcard${w ? " welfare" : ""}">${inner}</div>`;
    }).join("")}</div>`;
  }

  const section = (id, title, lead, link, body) => `
    <section class="cat" id="${id}" aria-labelledby="${id}-title"><div class="wrap">
      <div class="cat-head"><div><h2 id="${id}-title">${title}</h2><p>${lead}</p></div>${link}</div>
      ${body}
    </div></section>`;

  function render(d){
    /* 旧形式（sponsors / supporters）にも対応 */
    const partners = Array.isArray(d.partners) ? d.partners : (Array.isArray(d.sponsors) ? d.sponsors : []);
    let monthly = Array.isArray(d.monthly) ? d.monthly : [];
    if (!monthly.length && Array.isArray(d.supporters)) monthly = d.supporters.map(n => ({ name:n, plan:"sodateru" }));
    const oyasai = Math.max(0, parseInt(d.oyasai_count, 10) || 0);
    const inkind = Array.isArray(d.inkind) ? d.inkind : [];
    const farmers = Array.isArray(d.farmers) ? d.farmers : [];
    const note = d.monthly_note || d.supporters_note || "";

    document.getElementById("content").innerHTML =
      section("partners", "法人・団体パートナー", "年間スポンサーとして栽培ラックやエリアに名を刻み、この場所を共につくっている企業・団体のみなさまです。",
        `<a class="cta-link" href="partners.html">法人パートナープランを見る</a>`, partnersHTML(partners)) +
      section("farmers", "野菜・農福連携パートナー", "地域の農家・福祉事業所のみなさま。畑の恵みと、手しごとの力を、こどもたちの食卓へ届けてくださっています。",
        `<a class="cta-link" href="contact.html#farm">パートナーについて相談する</a>`, farmersHTML(farmers)) +
      section("wall", "サポーターズウォール", "毎月のサポートで食堂の土台を支える、共同オーナーのみなさまです。ニックネームやペンネームで応援してくださっている共同オーナーのみなさまも、たくさんいらっしゃいます。",
        `<a class="cta-link" href="support.html">月額サポーターになる</a>`, wallHTML(monthly, oyasai, note)) +
      section("inkind", "物品・設備・食材サポーター", "種や苗、厨房機器、食材。この場所のかたちそのものを届けてくださったみなさまです。",
        `<a class="cta-link" href="join.html#goods">物品提供について</a>`, inkindHTML(inkind));

    const counts = { monthly: monthly.length + oyasai, partners: partners.length, inkind: inkind.length, farmers: farmers.length };
    sodateruCount(document.getElementById("stat-farmers"), counts.farmers, { from: 0, duration: 1400 });
    sodateruCount(document.getElementById("stat-monthly"), counts.monthly, { from: 0, duration: 1400 });
    sodateruCount(document.getElementById("stat-partners"), counts.partners, { from: 0, duration: 1400 });
    sodateruCount(document.getElementById("stat-inkind"), counts.inkind, { from: 0, duration: 1400 });
    const chipCount = { partners: counts.partners, farmers: counts.farmers, wall: counts.monthly, inkind: counts.inkind };
    chipCount.all = chipCount.partners + chipCount.farmers + chipCount.wall + chipCount.inkind;
    document.querySelectorAll(".chip").forEach(c => {
      const span = document.createElement("span"); span.className = "cnt"; span.textContent = chipCount[c.dataset.filter] ?? 0;
      c.appendChild(span);
    });
    sodateruReveal(document.getElementById("content"));
    setupFilter();
    if (d.updated) document.getElementById("updated").textContent = `${d.updated} 更新`;
    const hasSample = [...partners, ...farmers, ...monthly, ...inkind].some(x => x && x.sample);
    document.getElementById("sample-notice").hidden = !hasSample;
  }

  /* ---- カテゴリー絞り込み（ページ遷移なし） ---- */
  function setupFilter(){
    const chips = [...document.querySelectorAll(".chip")];
    const cats = () => [...document.querySelectorAll("#content .cat")];
    const markFirst = () => {
      cats().forEach(c => c.classList.remove("first-visible"));
      const f = cats().find(c => !c.hidden); if (f) f.classList.add("first-visible");
    };
    let timer = null;
    const apply = key => {
      chips.forEach(c => c.setAttribute("aria-pressed", c.dataset.filter === key ? "true" : "false"));
      const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
      clearTimeout(timer);
      const leaving = cats().filter(c => !c.hidden && key !== "all" && c.id !== key);
      leaving.forEach(c => c.classList.add("is-leaving"));
      timer = setTimeout(() => {
        cats().forEach(c => {
          const show = key === "all" || c.id === key;
          c.classList.remove("is-leaving");
          if (show && c.hidden){
            c.hidden = false; c.classList.add("is-entering");
            requestAnimationFrame(() => requestAnimationFrame(() => c.classList.remove("is-entering")));
            c.querySelectorAll(".rv").forEach(el => el.classList.add("in"));
          }
          if (!show) c.hidden = true;
        });
        markFirst();
        const bar = document.querySelector(".sp-filter-bar");
        const top = document.getElementById("content").getBoundingClientRect().top + scrollY - bar.offsetHeight - 68;
        if (scrollY > top) window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
      }, (reduce || !leaving.length) ? 0 : 280);
    };
    chips.forEach(c => c.addEventListener("click", () => apply(c.dataset.filter)));
    const hash = location.hash.replace("#", "");
    if (["partners","farmers","wall","inkind"].includes(hash)) apply(hash); else markFirst();
  }

  fetch("sponsors.json", { cache: "no-cache" })
    .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(render)
    .catch(() => {
      document.getElementById("content").innerHTML =
        '<div class="wrap"><p class="empty">支援者の一覧を読み込めませんでした。sponsors.json が同じ場所にあるか、書き方に誤り（カンマの付け忘れなど）がないか確認してください。</p></div>';
    });
})();
