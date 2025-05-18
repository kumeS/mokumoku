/* slide-nav.js ───────────────────────────────────────────
   - ページ送り        : ← / → キー・左右 40% タップ・Back/Next ボタン
   - 縦スクロール      : 常時可
   - **横スクロール**  : モバイル／PC 共通で自由に可   ←★今回強化
   - 水平スクロール操作でページ送りはしない
   - UI は JS で注入（HTML 変更不要）
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
    /* スクロール直後の「おまけクリック」を無視 */
    if (window.__gs_suppressClick) return (window.__gs_suppressClick = false);
    const ratio = e.clientX / innerWidth;
    if (ratio > 0.6)       jump(curIdx + 1);
    else if (ratio < 0.4)  jump(curIdx - 1);
  });

  /* ── ドラッグ量で「スクロール vs タップ」を判定 ───────── */
  let sx = 0, sy = 0;
  const TH = 25;
  const suppress = () => (window.__gs_suppressClick = true);
  addEventListener("pointerdown", (e) => { sx = e.clientX; sy = e.clientY; });
  addEventListener("pointerup",   (e) => {
    if (Math.abs(e.clientX - sx) > TH || Math.abs(e.clientY - sy) > TH) suppress();
  });

  /* ── スクロール許可（縦横とも）────────────────────── */
  const html = document.documentElement, body = document.body;
  html.style.overflowX = "auto";         // ★横スクロール解禁
  html.style.overflowY = "auto";
  body.style.overscrollBehaviorX = "auto"; // iOS Safari “跳ね返り” も許可

  /* ===== viewport メタタグ ===== */
  const meta = document.createElement("meta");
  meta.name = "viewport";
  meta.content = "width=device-width, initial-scale=1";
  document.head.appendChild(meta);

  /* ===== 右下 Back / Next ボタン ===== */
  const box = document.createElement("div");
  box.innerHTML = `
    <button id="gs-back">Back</button>
    <button id="gs-next">Next</button>
  `;
  Object.assign(box.style, {
    position: "fixed", bottom: "12px", right: "12px",
    display: "flex", gap: "8px", zIndex: 9999,
    pointerEvents: "auto"         // 横スクロールを邪魔しない
  });

  const css = `
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
  styleTag.textContent = css;
  document.head.appendChild(styleTag);

  document.body.appendChild(box);
  document.getElementById("gs-back").onclick = () => jump(curIdx - 1);
  document.getElementById("gs-next").onclick = () => jump(curIdx + 1);
})();
