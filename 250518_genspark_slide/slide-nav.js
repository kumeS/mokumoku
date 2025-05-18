/* slide-nav.js ───────────────────────────────────────────
   - ページ送りは「← / → キー」または「右下 Back / Next ボタン」のみ
   - 画面をタップ／クリックしてもページ送りしない（誤作動防止）
   - 縦横スクロールは PC / モバイル共通で自由
   - HTML 変更不要。JS だけで UI を注入
   ------------------------------------------------------ */
(() => {
  /* ===== スライド定義 ===== */
  const slides = ["index.html", "02.html", "03.html", "04.html", "05.html"];

  /* ===== 現在ページを判定（末尾 / のアクセスも index.html 扱い） ===== */
  let curName = location.pathname.split("/").pop();
  if (!curName || !curName.includes(".")) curName = "index.html";
  const curIdx = slides.indexOf(curName);

  const goTo = (i) => {
    if (i < 0 || i >= slides.length) return;       // 範囲外は無視
    const dir = location.pathname.replace(/[^/]*$/, "");
    location.href = dir + slides[i];
  };

  /* ── キーボード ← / → ───────────────────────────── */
  addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") { e.preventDefault(); goTo(curIdx + 1); }
    if (e.key === "ArrowLeft")  { e.preventDefault(); goTo(curIdx - 1); }
  });

  /* ── スクロール許可（縦横とも）────────────────────── */
  const html = document.documentElement;
  html.style.overflowX = "auto";
  html.style.overflowY = "auto";
  // ここから追加
  const body = document.body;
  body.style.overflowX = "auto";
  body.style.overflowY = "auto";

  /* ===== viewport メタタグ（モバイル最適化） ===== */
if (!document.querySelector('meta[name="viewport"]')) {
  const meta = document.createElement("meta");
  meta.name = "viewport";
  // ここを修正
  meta.content = "width=device-width, initial-scale=1, maximum-scale=5.0, user-scalable=yes";
  document.head.appendChild(meta);
}

  /* ===== 右下 Back / Next ボタン ===== */
  const navBox = document.createElement("div");
  navBox.innerHTML = `
    <button id="gs-back">Back</button>
    <button id="gs-next">Next</button>
  `;
  Object.assign(navBox.style, {
    position: "fixed",
    bottom: "12px",
    right: "12px",
    display: "flex",
    gap: "8px",
    zIndex: 9999,
    pointerEvents: "auto",
  });

  /* ボタン基本スタイル */
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

  /* クリックイベントはバブリングさせず誤作動を回避 */
  navBox.addEventListener("click", (e) => e.stopPropagation());
  document.body.appendChild(navBox);

  document.getElementById("gs-back").addEventListener("click", (e) => {
    e.stopPropagation();
    goTo(curIdx - 1);
  });
  document.getElementById("gs-next").addEventListener("click", (e) => {
    e.stopPropagation();
    goTo(curIdx + 1);
  });
})();
