/* slide-nav.js ───────────────────────────────────────────
   - ページ送り手段
     • ← / → キー
     • 左右 40 % 域タップ／クリック
     • 画面右下 Back / Next ボタン
   - スクロールはモバイル／PC 共通で縦横とも自由
   - 水平スクロールやピンチズームではページ送りしない
   - UI は JS で注入するので HTML は変更不要
   ------------------------------------------------------ */
(() => {
  /* ===== スライド定義 ===== */
  const slides = ["index.html", "02.html", "03.html", "04.html", "05.html"];

  /* ===== 現在位置 ===== */
  const curName = location.pathname.split("/").pop() || "index.html";
  const curIdx  = slides.indexOf(curName);

  const jump = (i) => {
    if (i < 0 || i >= slides.length) return;
    const dir = location.pathname.replace(/[^/]*$/, "");
    location.href = dir + slides[i];
  };

  /* ── キーボード ← / → ───────────────────────────── */
  addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") { e.preventDefault(); jump(curIdx + 1); }
    if (e.key === "ArrowLeft")  { e.preventDefault(); jump(curIdx - 1); }
  });

  /* ── クリック / タップ領域 ───────────────────────── */
  addEventListener("click", (e) => {
    /* スクロール動作直後に発火する “おまけクリック” を抑制するため、
       直前の touchmove / pointermove で大きく移動していた場合は無視 */
    if (window.__gs_suppressClick) return (window.__gs_suppressClick = false);

    const ratio = e.clientX / innerWidth;
    if (ratio > 0.6)       jump(curIdx + 1);
    else if (ratio < 0.4)  jump(curIdx - 1);
  });

  /* タップ移動量を検知して “ドラッグ後のクリック” を無視するロジック */
  let startX = 0, startY = 0;
  const MOVE_THRESHOLD = 25;        // px 以上動けば「スクロール」と判定
  const setSup = () => (window.__gs_suppressClick = true);

  addEventListener("pointerdown", (e) => { startX = e.clientX; startY = e.clientY; });
  addEventListener("pointerup",   (e) => {
    const dx = Math.abs(e.clientX - startX);
    const dy = Math.abs(e.clientY - startY);
    if (dx > MOVE_THRESHOLD || dy > MOVE_THRESHOLD) setSup();
  });

  /* ── スクロール許可（縦横とも）────────────────────── */
  const html = document.documentElement;
  html.style.overflowY = "auto";
  html.style.overflowX = "auto";

  /* ===== viewport メタタグを動的追加（モバイル表示最適化） ===== */
  const meta = document.createElement("meta");
  meta.name = "viewport";
  meta.content = "width=device-width, initial-scale=1";
  document.head.appendChild(meta);

  /* ===== 右下 Back / Next ボタン ===== */
  const navBox = document.createElement("div");
  navBox.innerHTML = `
    <button id="gs-back">Back</button>
    <button id="gs-next">Next</button>
  `;
  Object.assign(navBox.style, {
    position: "fixed", bottom: "12px", right: "12px",
    display: "flex", gap: "8px", zIndex: 9999,
  });

  const btnStyle = `
    #gs-back, #gs-next {
      padding: 8px 14px;
      font: 14px/1 sans-serif;
      border: 1px solid #666;
      background: #fff;
      border-radius: 6px;
      cursor: pointer;
      opacity: .85;
      touch-action: manipulation;
    }
    #gs-back:hover, #gs-next:hover { opacity: 1; }
  `;
  const styleTag = document.createElement("style");
  styleTag.textContent = btnStyle;
  document.head.appendChild(styleTag);

  document.body.appendChild(navBox);
  document.getElementById("gs-back").onclick = () => jump(curIdx - 1);
  document.getElementById("gs-next").onclick = () => jump(curIdx + 1);
})();
