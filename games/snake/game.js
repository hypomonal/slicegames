// slicegames/games/snake/game.js
(() => {
'use strict';

const COLS = 20, ROWS = 20;
const SAVE_KEY = 'snake-save';

/* ── DOM ── */
const canvas     = document.getElementById('canvas');
const ctx        = canvas.getContext('2d');
const overlay    = document.getElementById('overlay');
const olTitle    = document.getElementById('ol-title');
const olMsg      = document.getElementById('ol-msg');
const btnStart   = document.getElementById('btn-start');
const scoreEl    = document.getElementById('score');
const bestEl     = document.getElementById('best');
const speedEl    = document.getElementById('speed');
const canvasWrap = document.getElementById('canvas-wrap');

/* ── CANVAS SIZE ── */
const maxW = Math.min(window.innerWidth - 32, 420);
const cell = Math.floor(maxW / COLS);
canvas.width  = cell * COLS;
canvas.height = cell * ROWS;

/* ── STATE ── */
let snake, dir, nextDir, food, score, raf, stepMs, lastStep, speed, running;
let best = +localStorage.getItem('snake-best') || 0;
bestEl.textContent = best;

/* ── SAVE / RESUME ── */
function saveGame() {
  if (!running) return;
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({ snake, dir, nextDir, food, score, speed, stepMs }));
  } catch (_) {}
}

function loadSave() {
  try { const r = localStorage.getItem(SAVE_KEY); return r ? JSON.parse(r) : null; }
  catch (_) { return null; }
}

function clearSave() { localStorage.removeItem(SAVE_KEY); }

/* ── HELPERS ── */
const rand = n => Math.floor(Math.random() * n);

function placeFood() {
  const flat = new Set(snake.map(s => s.x + ',' + s.y));
  let f;
  do { f = { x: rand(COLS), y: rand(ROWS) }; }
  while (flat.has(f.x + ',' + f.y));
  food = f;
}

/* ── INIT ── */
function init() {
  clearSave();
  snake   = [{ x:10, y:10 }, { x:9, y:10 }, { x:8, y:10 }];
  dir     = { x:1, y:0 };
  nextDir = { x:1, y:0 };
  score   = 0; speed = 1; stepMs = 160; running = true;
  scoreEl.textContent = 0;
  speedEl.textContent = 1;
  placeFood();
  lastStep = performance.now();
  if (raf) cancelAnimationFrame(raf);
  raf = requestAnimationFrame(loop);
}

function resume(save) {
  snake   = save.snake;
  dir     = save.dir;
  nextDir = save.nextDir;
  food    = save.food;
  score   = save.score;
  speed   = save.speed;
  stepMs  = save.stepMs;
  running = true;
  scoreEl.textContent = score;
  speedEl.textContent = speed;
  overlay.style.display = 'none';
  lastStep = performance.now();
  if (raf) cancelAnimationFrame(raf);
  raf = requestAnimationFrame(loop);
}

/* ── GAME LOOP ── */
function loop(ts) {
  raf = requestAnimationFrame(loop);
  if (!running) return;
  if (ts - lastStep >= stepMs) {
    lastStep = ts;
    step();
  }
  draw();
}

let stepCount = 0;
function step() {
  dir = { ...nextDir };
  const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

  // Wall collision
  if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) return gameOver();
  // Self collision
  if (snake.some(s => s.x === head.x && s.y === head.y)) return gameOver();

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreEl.textContent = score;
    if (score > best) {
      best = score;
      bestEl.textContent = best;
      localStorage.setItem('snake-best', best);
    }
    if (score % 5 === 0 && stepMs > 70) {
      stepMs = Math.max(70, stepMs - 14);
      speed++;
      speedEl.textContent = speed;
    }
    placeFood();
  } else {
    snake.pop();
  }

  // Save every 5 steps to reduce localStorage writes
  stepCount++;
  if (stepCount % 5 === 0) saveGame();
}

/* ── DRAW ── */
function draw() {
  // Background
  ctx.fillStyle = '#0a1410';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle grid dots
  ctx.fillStyle = 'rgba(255,255,255,0.025)';
  for (let x = 0; x < COLS; x++)
    for (let y = 0; y < ROWS; y++) {
      ctx.beginPath();
      ctx.arc(x*cell+cell/2, y*cell+cell/2, 1, 0, Math.PI*2);
      ctx.fill();
    }

  if (!food) return;

  // Food with glow
  ctx.save();
  ctx.shadowColor = '#f87171';
  ctx.shadowBlur  = 14;
  ctx.fillStyle   = '#f87171';
  ctx.beginPath();
  ctx.roundRect(food.x*cell+2, food.y*cell+2, cell-4, cell-4, 5);
  ctx.fill();
  ctx.restore();

  // Snake body
  snake.forEach((s, i) => {
    ctx.save();
    ctx.globalAlpha = 1 - (i / snake.length) * 0.45;
    if (i === 0) { ctx.shadowColor = '#4ade80'; ctx.shadowBlur = 10; }
    ctx.fillStyle = i === 0 ? '#4ade80' : '#22c55e';
    ctx.beginPath();
    ctx.roundRect(s.x*cell+1, s.y*cell+1, cell-2, cell-2, i===0 ? 7 : 3);
    ctx.fill();
    ctx.restore();
  });
}

/* ── GAME OVER ── */
function gameOver() {
  running = false;
  clearSave();
  cancelAnimationFrame(raf);
  draw();
  olTitle.textContent = '💀 Game Over';
  olMsg.textContent   = '🍎 Score: ' + score + (score === best && score > 0 ? ' · 🏆 New Best!' : '');
  btnStart.textContent = '🔄 Play Again';
  overlay.style.display = 'flex';

  // Re-bind start button to fresh init (not resume)
  btnStart.onclick = () => { overlay.style.display='none'; init(); };
}

/* ── INPUT ── */
const KEY_DIR = {
  ArrowUp:{x:0,y:-1},  ArrowDown:{x:0,y:1},
  ArrowLeft:{x:-1,y:0}, ArrowRight:{x:1,y:0},
  w:{x:0,y:-1}, s:{x:0,y:1}, a:{x:-1,y:0}, d:{x:1,y:0},
  W:{x:0,y:-1}, S:{x:0,y:1}, A:{x:-1,y:0}, D:{x:1,y:0},
};

document.addEventListener('keydown', e => {
  const d = KEY_DIR[e.key];
  if (!d) return;
  e.preventDefault();
  if (running && (d.x !== -dir.x || d.y !== -dir.y)) nextDir = d;
});

// D-pad
['d-up','d-down','d-left','d-right'].forEach(id => {
  const d = { 'd-up':{x:0,y:-1}, 'd-down':{x:0,y:1}, 'd-left':{x:-1,y:0}, 'd-right':{x:1,y:0} }[id];
  document.getElementById(id).addEventListener('click', () => {
    if (running && (d.x !== -dir.x || d.y !== -dir.y)) nextDir = d;
  });
});

// Touch swipe — only on canvas, blocks page scroll
let tx = 0, ty = 0;
canvasWrap.addEventListener('touchstart', e => {
  tx = e.touches[0].clientX;
  ty = e.touches[0].clientY;
}, { passive: true });

canvasWrap.addEventListener('touchmove', e => e.preventDefault(), { passive: false });

canvasWrap.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - tx;
  const dy = e.changedTouches[0].clientY - ty;
  if (Math.max(Math.abs(dx), Math.abs(dy)) < 18) return;
  const d = Math.abs(dx) > Math.abs(dy)
    ? (dx > 0 ? {x:1,y:0} : {x:-1,y:0})
    : (dy > 0 ? {x:0,y:1} : {x:0,y:-1});
  if (running && (d.x !== -dir.x || d.y !== -dir.y)) nextDir = d;
}, { passive: true });

/* ── AUTO-SAVE ON HIDE ── */
document.addEventListener('visibilitychange', () => { if (document.hidden) saveGame(); });
window.addEventListener('pagehide', saveGame);

/* ── BOOT: check for saved game ── */
const existingSave = loadSave();
if (existingSave && existingSave.snake && existingSave.food) {
  // Show resume screen
  olTitle.textContent = '🐍 Continue?';
  olMsg.textContent   = '⭐ Score: ' + existingSave.score + ' · ⚡ Speed: ' + existingSave.speed;
  btnStart.textContent = '▶ Resume';
  btnStart.onclick = () => resume(existingSave);

  // Add "New Game" option
  const btnNew = document.createElement('button');
  btnNew.className  = 'btn-play';
  btnNew.style.cssText = 'background:rgba(255,255,255,.1);box-shadow:none;margin-top:6px;font-size:.9rem;';
  btnNew.textContent = '🔄 New Game';
  btnNew.onclick = () => { clearSave(); overlay.style.display='none'; init(); };
  overlay.appendChild(btnNew);
} else {
  // No save — normal start
  btnStart.onclick = () => { overlay.style.display='none'; init(); };
}

})();
