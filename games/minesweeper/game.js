// slicegames/games/minesweeper/game.js
(() => {
'use strict';

const DIFFS = {
  easy:   { r:9,  c:9,  m:10 },
  medium: { r:16, c:16, m:40 },
  hard:   { r:16, c:30, m:99 },
};
const SAVE_KEY = 'ms-save';

/* ── DOM ── */
const tableEl     = document.getElementById('table');
const boardWrap   = document.getElementById('board-wrap');
const minesLeftEl = document.getElementById('mines-left');
const timerEl     = document.getElementById('timer');
const bestEl      = document.getElementById('best');
const resultOv    = document.getElementById('result-overlay');
const resultTitle = document.getElementById('result-title');
const resultMsg   = document.getElementById('result-msg');
const resultIcon  = document.getElementById('result-icon');

/* ── STATE ── */
let diff = localStorage.getItem('ms-diff') || 'easy';
let rows, cols, mines;
let board, revealed, flagged, mineSet;
let started, done, timerVal, timerInt;

/* ── SAVE / RESUME ── */
function saveGame() {
  if (!started || done) return;
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({
      diff, board, revealed, flagged,
      mineSet: [...mineSet], timerVal,
    }));
  } catch (_) {}
}

function loadSave() {
  try { const r = localStorage.getItem(SAVE_KEY); return r ? JSON.parse(r) : null; }
  catch (_) { return null; }
}

function clearSave() { localStorage.removeItem(SAVE_KEY); }

/* ── BEST TIME ── */
function getBest() { return localStorage.getItem(`ms-best-${diff}`); }
function setBest(v){ localStorage.setItem(`ms-best-${diff}`, v); }

/* ── INIT ── */
function init() {
  clearSave();
  const d = DIFFS[diff];
  rows = d.r; cols = d.c; mines = d.m;
  board    = Array.from({ length:rows }, () => Array(cols).fill(0));
  revealed = Array.from({ length:rows }, () => Array(cols).fill(false));
  flagged  = Array.from({ length:rows }, () => Array(cols).fill(false));
  mineSet  = new Set();
  started  = false; done = false; timerVal = 0;
  clearInterval(timerInt);
  timerEl.textContent     = '0s';
  minesLeftEl.textContent = mines;
  const b = getBest();
  bestEl.textContent = b ? b + 's' : '—';
  resultOv.classList.remove('show');
  buildTable();
}

/* ── RESUME SAVED GAME ── */
function resumeSaved(save) {
  diff     = save.diff || 'easy';
  const d  = DIFFS[diff];
  rows = d.r; cols = d.c; mines = d.m;
  board    = save.board;
  revealed = save.revealed;
  flagged  = save.flagged;
  mineSet  = new Set(save.mineSet);
  timerVal = save.timerVal || 0;
  started  = true; done = false;
  // update diff pill
  document.querySelectorAll('.diff-pill').forEach(p => {
    p.classList.toggle('active', p.dataset.diff === diff);
  });
  const b = getBest();
  bestEl.textContent = b ? b + 's' : '—';
  resultOv.classList.remove('show');
  buildTable();
  renderAll();
  // restart timer
  timerEl.textContent = timerVal + 's';
  timerInt = setInterval(() => { timerVal++; timerEl.textContent = timerVal + 's'; saveGame(); }, 1000);
}

/* ── TABLE BUILDER ── */
function buildTable() {
  tableEl.innerHTML = '';
  for (let r = 0; r < rows; r++) {
    const tr = document.createElement('tr');
    for (let c = 0; c < cols; c++) {
      const td = document.createElement('td');
      td.dataset.r = r; td.dataset.c = c;
      td.addEventListener('click', onReveal);
      td.addEventListener('contextmenu', e => { e.preventDefault(); onFlag(r, c); });
      // Long press = flag on mobile
      let pressTimer;
      td.addEventListener('touchstart', () => { pressTimer = setTimeout(() => onFlag(r, c), 500); }, { passive: true });
      td.addEventListener('touchend',   () => clearTimeout(pressTimer), { passive: true });
      td.addEventListener('touchmove',  () => clearTimeout(pressTimer), { passive: true });
      tr.appendChild(td);
    }
    tableEl.appendChild(tr);
  }
  // Update flags count
  updateMinesLeft();
}

function getCell(r, c) { return tableEl.rows[r]?.cells[c]; }

/* ── MINE PLACEMENT (safe first click) ── */
function placeMines(sr, sc) {
  while (mineSet.size < mines) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    if (Math.abs(r-sr) <= 1 && Math.abs(c-sc) <= 1) continue;
    mineSet.add(r + ',' + c);
    board[r][c] = -1;
  }
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      if (board[r][c] === -1) continue;
      board[r][c] = neighbors(r, c).filter(([nr, nc]) => board[nr][nc] === -1).length;
    }
}

function neighbors(r, c) {
  const out = [];
  for (let dr = -1; dr <= 1; dr++)
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = r+dr, nc = c+dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) out.push([nr, nc]);
    }
  return out;
}

/* ── REVEAL ── */
function reveal(r, c) {
  if (revealed[r][c] || flagged[r][c]) return;
  revealed[r][c] = true;
  if (board[r][c] === 0) neighbors(r, c).forEach(([nr, nc]) => reveal(nr, nc));
  renderCell(r, c);
}

/* ── SVG ICONS ── */
const MINE_SVG = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
  <circle cx="8" cy="8" r="4" fill="#f87171"/>
  <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.2 3.2l1.4 1.4M11.4 11.4l1.4 1.4M3.2 12.8l1.4-1.4M11.4 4.6l1.4-1.4"
    stroke="#f87171" stroke-width="1.4" stroke-linecap="round"/>
</svg>`;

const FLAG_SVG = `<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
  <path d="M3 13V2M3 2l8 3-8 3" fill="#fb923c" stroke="#fb923c" stroke-width="1.2" stroke-linejoin="round"/>
  <line x1="3" y1="13" x2="11" y2="13" stroke="#fb923c" stroke-width="1.4" stroke-linecap="round"/>
</svg>`;

/* ── RENDER ── */
function renderCell(r, c) {
  const td = getCell(r, c);
  if (!td) return;
  if (flagged[r][c])    { td.innerHTML = FLAG_SVG; td.className = 'flagged'; return; }
  if (!revealed[r][c])  { td.innerHTML = ''; td.className = ''; return; }
  if (board[r][c] === -1) { td.innerHTML = MINE_SVG; td.className = 'open'; return; }
  td.className = 'open';
  if (board[r][c] > 0) { td.textContent = board[r][c]; td.dataset.n = board[r][c]; }
  else { td.textContent = ''; delete td.dataset.n; }
}

function renderAll() {
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) renderCell(r, c);
  updateMinesLeft();
}

function updateMinesLeft() {
  let flagCount = 0;
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      if (flagged[r][c]) flagCount++;
  minesLeftEl.textContent = mines - flagCount;
}

/* ── CLICK HANDLER ── */
function onReveal() {
  if (done) return;
  const r = +this.dataset.r, c = +this.dataset.c;
  if (flagged[r][c] || revealed[r][c]) return;

  // First click: place mines then start timer
  if (!started) {
    started = true;
    placeMines(r, c);
    timerInt = setInterval(() => {
      timerVal++;
      timerEl.textContent = timerVal + 's';
      saveGame();
    }, 1000);
  }

  if (board[r][c] === -1) {
    // Hit a mine
    revealed[r][c] = true;
    renderCell(r, c);
    getCell(r, c).classList.add('mine-hit');
    revealAllMines();
    boom();
  } else {
    reveal(r, c);
    checkWin();
  }
}

function onFlag(r, c) {
  if (done || revealed[r][c]) return;
  flagged[r][c] = !flagged[r][c];
  updateMinesLeft();
  renderCell(r, c);
  saveGame();
}

function revealAllMines() {
  mineSet.forEach(key => {
    const [r, c] = key.split(',').map(Number);
    revealed[r][c] = true;
    renderCell(r, c);
  });
}

/* ── WIN / LOSE ── */
function checkWin() {
  let revCount = 0;
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      if (revealed[r][c]) revCount++;

  if (revCount === rows*cols - mines) {
    done = true;
    clearInterval(timerInt);
    clearSave();
    const b = getBest();
    if (!b || timerVal < +b) {
      setBest(timerVal);
      bestEl.textContent = timerVal + 's';
    }
    showResult(true);
  }
}

function boom() {
  done = true;
  clearInterval(timerInt);
  clearSave();
  showResult(false);
}

function showResult(win) {
  resultIcon.style.background = win ? 'rgba(74,222,128,.15)' : 'rgba(248,113,113,.15)';
  resultIcon.innerHTML = win
    ? `<svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M5 14l7 7L23 7" stroke="#4ade80" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`
    : `<svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="7" fill="#f87171"/><path d="M14 1v4M14 23v4M1 14h4M23 14h4" stroke="#f87171" stroke-width="2" stroke-linecap="round"/></svg>`;
  resultTitle.textContent = win ? '🎉 You Win!'  : '💥 Boom!';
  resultMsg.textContent   = win
    ? `🏆 Cleared in ${timerVal}s!`
    : '😵 You hit a mine! Try again!';
  resultOv.classList.add('show');
}

/* ── BLOCK PAGE SCROLL ON BOARD ── */
boardWrap.addEventListener('touchmove', e => e.preventDefault(), { passive: false });

/* ── DIFFICULTY PILLS ── */
document.querySelectorAll('.diff-pill').forEach(pill => {
  // Set active state on load
  if (pill.dataset.diff === diff) pill.classList.add('active');
  else pill.classList.remove('active');

  pill.addEventListener('click', () => {
    document.querySelectorAll('.diff-pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    diff = pill.dataset.diff;
    localStorage.setItem('ms-diff', diff);
    clearSave();
    init();
  });
});

/* ── BUTTONS ── */
document.getElementById('btn-restart').addEventListener('click', () => { clearSave(); init(); });
document.getElementById('btn-play-again').addEventListener('click', () => { clearSave(); init(); });

/* ── AUTO-SAVE ON HIDE ── */
document.addEventListener('visibilitychange', () => { if (document.hidden) saveGame(); });
window.addEventListener('pagehide', saveGame);

/* ── BOOT ── */
const existingSave = loadSave();
if (existingSave && existingSave.board) {
  resumeSaved(existingSave);
} else {
  init();
}

})();
