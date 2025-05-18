/* slide-nav.js ───────────────────────────────────────────
   - ← ↑ ↓ → PageUp PageDown Space キー、クリック、スクロールでページ送り
   - スライドがウィンドウより大きい場合は通常の縦スクロールを維持
   - ページのどの位置にいても ↑／↓／PageUp／PageDown／Space／クリック で送り可能
   - UI（ボタン・矢印）は描画しない
   ------------------------------------------------------ */
(() => {
  /* ===== 設定 ===== */
  const slides = ["index.html", "02.html", "03.html", "04.html", "05.html"];

  /* ===== ページ遷移ユーティリティ ===== */
  const currentName  = location.pathname.split("/").pop() || "index.html";
  const currentIndex = slides.indexOf(currentName);

  const goTo = (i) => {
    if (i < 0 || i >= slides.length) return;
    const base = location.pathname.replace(/[^/]*$/, "");
    location.href = base + slides[i];
  };

  /* ===== キーボード操作 ===== */
  addEventListener("keydown", (e) => {
    const { key } = e;
    /* 次へ */
    if (["ArrowRight", "ArrowDown", "PageDown", " "].includes(key)) {
      e.preventDefault(); goTo(currentIndex + 1);
    }
    /* 前へ */
    if (["ArrowLeft", "ArrowUp", "PageUp"].includes(key)) {
      e.preventDefault(); goTo(currentIndex - 1);
    }
  });

  /* ===== クリック操作（左右 40%） ===== */
  addEventListener("click", (e) => {
    const ratio = e.clientX / innerWidth;
    if (ratio > 0.6)       goTo(currentIndex + 1);
    else if (ratio < 0.4)  goTo(currentIndex - 1);
  });

  /* ===== スクロール操作 =====
     - スライドが長い場合は通常スクロールを許可
     - 最上部／最下部に達したときのみ自動でページ送り             */
  let lock = false;
  addEventListener("scroll", () => {
    if (lock) return;
    const bottomReached = scrollY + innerHeight >= document.body.scrollHeight - 5;
    const topReached    = scrollY === 0;
    if (bottomReached) { lock = true; goTo(currentIndex + 1); }
    else if (topReached) { lock = true; goTo(currentIndex - 1); }
  });

  /* ===== スクロールバー表示制御 =====
     - スライドが短いときだけスクロールバーを隠す（美観目的）
     - 長い場合はスクロールバーを残して通常スクロールを可能にする  */
  const toggleScrollbar = () => {
    const needScroll = document.body.scrollHeight > innerHeight + 5;
    document.documentElement.style.overflowY = needScroll ? "auto" : "hidden";
  };
  addEventListener("resize", toggleScrollbar, { passive: true });
  toggleScrollbar();
})();
