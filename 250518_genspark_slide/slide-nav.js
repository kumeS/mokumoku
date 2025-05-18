/* slide-nav.js ───────────────────────────────────────────
   - ← → PageUp PageDown Space キー・クリック・ホイールでページ送り
   - ウィンドウサイズに合わせて 1280×720 をアスペクト比維持で中央表示
   - 追加 UI を一切描画しない（矢印やガイド非表示）
   ------------------------------------------------------ */
(() => {
  /* ===== 設定 ===== */
  const slides = ["index.html", "02.html", "03.html", "04.html", "05.html"];
  const DESIGN_WIDTH  = 1280;   // 元スライド幅
  const DESIGN_HEIGHT = 720;    // 元スライド高

  /* ===== ページ遷移 ===== */
  const currentName  = location.pathname.split("/").pop() || "index.html";
  const currentIndex = slides.indexOf(currentName);

  const goTo = (i) => {
    if (i < 0 || i >= slides.length) return;
    const base = location.pathname.replace(/[^/]*$/, ""); // ディレクトリ部分
    location.href = base + slides[i];
  };

  /* ===== 入力ハンドラ ===== */
  /* キーボード */
  addEventListener("keydown", (e) => {
    const k = e.key;
    if (k === "ArrowRight" || k === "PageDown" || k === " ") {
      e.preventDefault(); goTo(currentIndex + 1);
    }
    if (k === "ArrowLeft" || k === "PageUp") {
      e.preventDefault(); goTo(currentIndex - 1);
    }
  });

  /* クリック：左右 40% でページ送り */
  addEventListener("click", (e) => {
    const ratio = e.clientX / innerWidth;
    if (ratio > 0.6)       goTo(currentIndex + 1);
    else if (ratio < 0.4)  goTo(currentIndex - 1);
  });

  /* ホイール：下スクロール→次／上スクロール→前（連続防止ロック付き） */
  let wheelLock = false;
  addEventListener("wheel", (e) => {
    if (wheelLock) return;
    if (e.deltaY > 40)      { wheelLock = true; goTo(currentIndex + 1); }
    else if (e.deltaY < -40){ wheelLock = true; goTo(currentIndex - 1); }
    setTimeout(() => (wheelLock = false), 400);   // 0.4 秒ロック
  }, { passive: true });

  /* ======= フィット用ラッパー生成 =======
     - Body 直下に wrapper を作り、既存 DOM を移動
     - wrapper を scale() ＋ translate() で中央寄せ           */
  const wrapper = document.createElement("div");
  while (document.body.firstChild) wrapper.appendChild(document.body.firstChild);
  document.body.appendChild(wrapper);

  /* wrapper 固定サイズ & 基本スタイル */
  Object.assign(wrapper.style, {
    width:  DESIGN_WIDTH  + "px",
    height: DESIGN_HEIGHT + "px",
    position: "absolute",
    transformOrigin: "top left"
  });
  document.body.style.margin = "0";   // 余白排除

  /* ===== 自動リサイズ（中央レターボックス） ===== */
  const fit = () => {
    const sx = innerWidth  / DESIGN_WIDTH;
    const sy = innerHeight / DESIGN_HEIGHT;
    const scale = Math.min(sx, sy);          // はみ出さない最大倍率

    /* スケール & 余白中央寄せ */
    wrapper.style.transform = `scale(${scale})`;
    wrapper.style.left = ((innerWidth  - DESIGN_WIDTH  * scale) / 2) + "px";
    wrapper.style.top  = ((innerHeight - DESIGN_HEIGHT * scale) / 2) + "px";
  };
  addEventListener("resize", fit, { passive: true });
  fit();   // 初回実行

  /* ===== スクロールバーを隠す ===== */
  const style = document.createElement("style");
  style.textContent = `
    ::-webkit-scrollbar { display: none; }
    html { scrollbar-width: none; }
  `;
  document.head.appendChild(style);
})();
