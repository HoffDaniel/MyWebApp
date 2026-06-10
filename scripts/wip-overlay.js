// /scripts/wip-overlay.js
// Lightweight WIP overlay: no deps, CSS-in-JS, one line to show/hide.

const STYLE = `
.wip-overlay{position:fixed;inset:0;z-index:9998;display:grid;place-items:center;
  --bg:rgba(5,12,20,var(--alpha,0.18)); /* dim layer */
  background:var(--bg); font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,Helvetica,Arial;
  pointer-events:var(--pe,auto)}
.wip-overlay[data-block="false"]{--pe:none} /* let clicks pass through if desired */
.wip-fog{position:absolute;inset:0;overflow:hidden;pointer-events:none;mix-blend-mode:screen}
.wip-fog::before,.wip-fog::after{content:"";position:absolute;inset:-20%;background:
  radial-gradient(1200px 600px at 20% 60%, rgba(255,255,255,.06), transparent 60%),
  radial-gradient(900px 500px at 80% 40%, rgba(255,255,255,.05), transparent 60%);
  filter:blur(12px);animation:fogShift 26s linear infinite}
.wip-fog::after{animation-duration:42s;opacity:.75;transform:scaleY(-1)}
@keyframes fogShift{0%{transform:translateX(-10%) translateY(0)}
                    50%{transform:translateX(10%) translateY(2%)}
                    100%{transform:translateX(-10%) translateY(0)}}

.wip-card{position:relative;z-index:1;display:flex;align-items:center;gap:16px;
  padding:14px 18px;border-radius:14px;background:rgba(12,18,28,.55);
  box-shadow:0 6px 24px rgba(0,0,0,.35), inset 0 0 0 1px rgba(255,255,255,.06);
  color:#e6f1ff; backdrop-filter:blur(6px)}
.wip-title{font-weight:700;letter-spacing:.3px}
.wip-sub{opacity:.8;font-size:.9rem}

.wip-ic {width:28px;height:28px;display:inline-block;color:#e6f1ff}
.wip-gear{transform-origin:50% 50%;animation:spin 10s linear infinite}
.wip-gear.s{animation-duration:6s}
@keyframes spin{to{transform:rotate(360deg)}}

.wip-hammer{transform-origin:75% 10%;animation:tap 1.4s ease-in-out infinite}
@keyframes tap{
  0%,60%,100% { transform:rotate(-8deg) translateY(0) }
  45% { transform:rotate(14deg) translateY(1px) }
}

.wip-close{position:absolute;top:8px;right:8px;border:0;background:transparent;
  color:#e6f1ff;opacity:.75;cursor:pointer;padding:6px;border-radius:8px}
.wip-close:hover{opacity:1;background:rgba(255,255,255,.08)}
`;

let mounted;

export function showWIP({
  message = 'Work in progress',
  sub = 'We’re building this playground. You can still look around 👀',
  blockClicks = false,      // true = block page interactions; false = let clicks pass
  alpha = 0.18,             // dim amount over the page
  showClose = false,        // show an X button to hide
} = {}) {

  // Inject styles once
  if (!mounted) {
    const s = document.createElement('style');
    s.id = 'wip-overlay-style';
    s.textContent = STYLE;
    document.head.appendChild(s);
    mounted = true;
  }

  // If already there, update text & options
  let el = document.getElementById('wip-overlay');
  if (!el) {
    el = document.createElement('div');
    el.id = 'wip-overlay';
    el.className = 'wip-overlay';
    el.innerHTML = `
      <div class="wip-fog"></div>
      <div class="wip-card">
        <div class="wip-ic" aria-hidden="true">${svgGear(true)}</div>
        <div>
          <div class="wip-title">${escapeHTML(message)}</div>
          <div class="wip-sub">${escapeHTML(sub)}</div>
        </div>
        <button class="wip-close" title="Hide" style="display:none">${svgX()}</button>
      </div>
    `;
    document.body.appendChild(el);
  }

  el.dataset.block = String(!!blockClicks);
  el.style.setProperty('--alpha', clamp(alpha, 0, 1));
  el.style.setProperty('--pe', blockClicks ? 'auto' : 'none');

  el.querySelector('.wip-title').textContent = message;
  el.querySelector('.wip-sub').textContent = sub;

  const btn = el.querySelector('.wip-close');
  btn.style.display = showClose ? 'block' : 'none';
  btn.onclick = hideWIP;
}

export function hideWIP() {
  const el = document.getElementById('wip-overlay');
  if (el) el.remove();
}

// ------- small helpers --------
function clamp(v, lo, hi){ return Math.max(lo, Math.min(hi, v)); }
function escapeHTML(s){ return String(s).replace(/[&<>"']/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])); }

function svgGear(small){
  return `
  <svg viewBox="0 0 24 24" class="wip-gear ${small?'s':''}" fill="currentColor" width="100%" height="100%">
    <path d="M19.14,12.94a7.49,7.49,0,0,0,.05-.94,7.49,7.49,0,0,0-.05-.94l2-1.56a.5.5,0,0,0,.12-.64l-1.9-3.29a.5.5,0,0,0-.6-.22l-2.36,1a7.61,7.61,0,0,0-1.63-.94l-.36-2.52A.5.5,0,0,0,12.76,2H9.24a.5.5,0,0,0-.49.42L8.39,4.94a7.61,7.61,0,0,0-1.63.94l-2.36-1a.5.5,0,0,0-.6.22L1.9,8.39a.5.5,0,0,0,.12.64l2,1.56a7.49,7.49,0,0,0-.05.94,7.49,7.49,0,0,0,.05.94l-2,1.56a.5.5,0,0,0-.12.64l1.9,3.29a.5.5,0,0,0,.6.22l2.36-1c.5.39,1.05.7,1.63.94l.36,2.52a.5.5,0,0,0,.49.42h3.52a.5.5,0,0,0,.49-.42l.36-2.52a7.61,7.61,0,0,0,1.63-.94l2.36,1a.5.5,0,0,0,.6-.22l1.9-3.29a.5.5,0,0,0-.12-.64ZM11,15.5A3.5,3.5,0,1,1,14.5,12,3.5,3.5,0,0,1,11,15.5Z"/>
  </svg>`;
}

function svgHammer(){
  return `
  <svg viewBox="0 0 24 24" class="wip-ic wip-hammer" fill="currentColor" width="100%" height="100%">
    <path d="M2 21l7-7 1.5 1.5L3.5 22.5A1.06 1.06 0 012 21z"/>
    <path d="M14 3l2 2-2.5 2.5L16 10l-2 2-3.5-3.5L12 6.5 10.5 5 12 3h2z"/>
  </svg>`;
}

function svgX(){
  return `
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
    <path d="M18.3 5.7a1 1 0 00-1.4-1.4L12 9.17 7.1 4.3A1 1 0 105.7 5.7L10.6 10.6 5.7 15.5a1 1 0 101.4 1.4L12 12.03l4.9 4.87a1 1 0 001.4-1.4l-4.88-4.9 4.88-4.9z"/>
  </svg>`;
}
