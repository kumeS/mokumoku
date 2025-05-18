/* slide-nav.js ───────────────────────────────────────────
   - ← / → キーだけでページ送りを行う
   - クリック・スクロール・PageUp/PageDown/Space ではページ送りしない
   - スライドがウインドウより大きい場合は通常の上下スクロールが可能
   - UI（ボタン・矢印）は一切描画しない
   ------------------------------------------------------ */
(() => {
  /* ===== 設定 ===== */
  const slides = ["index.html", "02.html", "03.html", "04.html", "05.html"];

  /* ===== ページ遷移ユーティリティ ===== */
  const currentName  = location.pathname.split("/").pop() || "index.html";
  const currentIndex = slides.indexOf(currentName);

  const goTo = (i) => {
    if (i < 0 || i >= slides.length) return;          // 範囲外は無視
    const base = location.pathname.replace(/[^/]*$/, "");
    location.href = base + slides[i];
  };

  /* ===== キーボード操作：← / → のみ ===== */
  addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goTo(currentIndex + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goTo(currentIndex - 1);
    }
  });

  /* ===== スクロール操作 =====
     - 自動ページ送りは行わず、通常スクロールを許可          */
  document.documentElement.style.overflowY = "auto";  // 常にスクロールバー表示
})();
