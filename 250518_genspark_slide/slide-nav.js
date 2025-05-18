/* slide-nav.js ───────────────────────────────────────────
   - ← → PageUp PageDown Space キー、クリック、スクロールでページ送り
   - 自動スケーリングは行わない（ブラウザの等倍表示に委ねる）
   - 追加 UI を一切描画しない（矢印やガイドは非表示）
   ------------------------------------------------------ */
(() => {
  /* ===== 設定 ===== */
  const slides = ["index.html", "02.html", "03.html", "04.html", "05.html"];

  /* ===== ページ遷移 ===== */
  const currentName  = location.pathname.split("/").pop() || "index.html";
  const currentIndex = slides.indexOf(currentName);

  const goTo = (i) => {
    if (i < 0 || i >= slides.length) return;
    const base = location.pathname.replace(/[^/]*$/, ""); // ディレクトリ部分
    location.href = base + slides[i];
  };

  /* --- キーボード操作 --- */
  addEventListener("keydown", (e) => {
    const k = e.key;
    if (k === "ArrowRight" || k === "PageDown" || k === " ") {
      e.preventDefault(); goTo(currentIndex + 1);
    }
    if (k === "ArrowLeft" || k === "PageUp") {
      e.preventDefault(); goTo(currentIndex - 1);
    }
  });

  /* --- クリック操作 --- */
  addEventListener("click", (e) => {
    const ratio = e.clientX / innerWidth;
    if (ratio > 0.6)       goTo(currentIndex + 1);   // 右 40% で次へ
    else if (ratio < 0.4)  goTo(currentIndex - 1);   // 左 40% で前へ
  });

  /* --- スクロール操作 --- */
  let lock = false;
  addEventListener("scroll", () => {
    if (lock) return;
    const atBottom = scrollY + innerHeight >= document.body.scrollHeight - 5;
    const atTop    = scrollY === 0;
    if (atBottom) { lock = true; goTo(currentIndex + 1); }
    else if (atTop) { lock = true; goTo(currentIndex - 1); }
  });

  /* ===== スクロールバーを隠す追加 CSS ===== */
  const style = document.createElement("style");
  style.textContent = `
    /* Hide scrollbars (WebKit & Firefox) */
    ::-webkit-scrollbar { display: none; }
    html { scrollbar-width: none; }
  `;
  document.head.appendChild(style);
})();
