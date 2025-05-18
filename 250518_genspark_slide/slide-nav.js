/* slide-nav.js ───────────────────────────────────────────
   - ← → PageUp PageDown Space キー、クリック、スクロールでページ送り
   - 全スライドをウィンドウに合わせて自動スケーリング
   - 追加 UI を一切描画しない（矢印やガイドは非表示）
   ------------------------------------------------------ */
(() => {
  /* ===== 設定 ===== */
  const slides = ["index.html", "02.html", "03.html", "04.html", "05.html"];
  const DESIGN_WIDTH  = 1280;   // 元スライド想定幅
  const DESIGN_HEIGHT = 720;    // 元スライド想定高さ

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

  /* ===== リサイズ補正アルゴリズム =====
     1) 画面幅÷デザイン幅 と 画面高さ÷デザイン高さ → 倍率候補
     2) 小さい方を採用（はみ出し防止）
     3) body 全体へ scale() 適用
     4) window.resize 時に再計算                                */
  const fit = () => {
    const sx = innerWidth  / DESIGN_WIDTH;
    const sy = innerHeight / DESIGN_HEIGHT;
    const scale = Math.min(sx, sy, 1);                // 拡大し過ぎない
    document.documentElement.style.height = DESIGN_HEIGHT + "px"; // 高さ基準維持
    document.body.style.transformOrigin = "top left";
    document.body.style.transform = `scale(${scale})`;
  };
  addEventListener("resize", fit, { passive: true });
  fit();

  /* ===== スクロールバーも非表示（UI最小化） ===== */
  const style = document.createElement("style");
  style.textContent = `
    /* Hide scrollbars (WebKit & Firefox) */
    ::-webkit-scrollbar { display: none; }
    html { scrollbar-width: none; }
  `;
  document.head.appendChild(style);
})();


