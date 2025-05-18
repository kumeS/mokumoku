/* slide-nav.js ───────────────────────────────────────────
   - ページ送り手段
     • ← / → キー
     • 左右 40 % 域クリック
     • 画面右下の Back / Next ボタン
   - 水平スクロールではページ送りしない
   - 垂直スクロールは通常閲覧専用（自動遷移なし）
   - UI は JS で注入するので HTML は変更不要
   ------------------------------------------------------ */
(() => {
  /* ===== スライド定義 ===== */
  const slides = ["index.html", "02.html", "03.html", "04.html", "05.html"];

  /* ===== ユーティリティ ===== */
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

  /* ── クリック領域 ──────────────────────────────── */
  addEventListener("click", (e) => {
    const r = e.clientX / innerWidth;
    if (r > 0.6)       jump(curIdx + 1);
    else if (r < 0.4)  jump(curIdx - 1);
  });

  /* ── 水平スクロール無効化（deltaX は無視） ────────── */
  /* 何もしないことでページ送りは発生しない */

  /* ── スクロールバー常時表示 ─────────────────────── */
  document.documentElement.style.overflowY = "auto";

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
      padding: 6px 12px;
      font: 14px/1 sans-serif;
      border: 1px solid #666;
      background: #fff;
      border-radius: 4px;
      cursor: pointer;
      opacity: .8;
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
