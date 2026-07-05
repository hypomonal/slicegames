// anigames/games/snake/game.js
(() => {
  'use strict';
  const COLS = 20, ROWS = 20;
  const canvas    = document.getElementById('canvas');
  const ctx       = canvas.getContext('2d');
  const overlay   = document.getElementById('overlay');
  const olTitle   = document.getElementById('ol-title');
  const olMsg     = document.getElementById('ol-msg');
  const scoreEl   = document.getElementById('score');
  const bestEl    = document.getElementById('best');
  const speedEl   = document.getElementById('speed');
  const canvasWrap= document.getElementById('canvas-wrap');

  const maxW = Math.min(window.innerWidth - 32, 420);
  const cell = Math.floor(maxW / COLS);
  canvas.width = cell * COLS;
  canvas.height= cell * ROWS;

  let snake, dir, nextDir, food, score, raf, stepMs, lastStep, speed, running;
  let best = +localStorage.getItem('snake-best') || 0;
  bestEl.textContent = best;


  /* ── AUTO-SAVE / RESUME ── */
  const SAVE_KEY = 'snake-save';

  function saveGame() {
    if (!running) return;
    localStorage.setItem(SAVE_KEY, JSON.stringify({
      snake, dir, nextDir, food, score, speed, stepMs
    }));
  }

  function loadSave() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }

  function clearSave() { localStorage.removeItem(SAVE_KEY); }

  function resumeGame(save) {
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

  const rand = n => Math.floor(Math.random() * n);

  function placeFood() {
    const flat = new Set(snake.map(s => s.x + ',' + s.y));
    let f;
    do { f = { x: rand(COLS), y: rand(ROWS) }; }
    while (flat.has(f.x + ',' + f.y));
    food = f;
  }

  function init() {
    snake   = [{ x:10, y:10 }, { x:9, y:10 }, { x:8, y:10 }];
    dir     = { x:1, y:0 }; nextDir = { x:1, y:0 };
    score   = 0; speed = 1; stepMs = 160; running = true;
    scoreEl.textContent = 0; speedEl.textContent = 1;
    placeFood();
    lastStep = performance.now();
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(loop);
  }

  function loop(ts) {
    raf = requestAnimationFrame(loop);
    if (!running) return;
    if (ts - lastStep >= stepMs) { lastStep = ts; step(); }
    draw();
  }

  function step() {
    saveGame(); // auto-save every tick
    dir = { ...nextDir };
    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
    if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) return gameOver();
    if (snake.some(s => s.x === head.x && s.y === head.y)) return gameOver();
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
      score++;
      scoreEl.textContent = score;
      if (score > best) { best = score; bestEl.textContent = best; localStorage.setItem('snake-best', best); }
      if (score % 5 === 0 && stepMs > 70) { stepMs = Math.max(70, stepMs - 14); speed++; speedEl.textContent = speed; }
      placeFood();
    } else { snake.pop(); }
  }

  function draw() {
    ctx.fillStyle = '#0a1410';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // grid dots
    ctx.fillStyle = 'rgba(255,255,255,0.025)';
    for (let x = 0; x < COLS; x++)
      for (let y = 0; y < ROWS; y++) {
        ctx.beginPath();
        ctx.arc(x*cell+cell/2, y*cell+cell/2, 1, 0, Math.PI*2);
        ctx.fill();
      }
    if (!food) return;
    // food glow
    ctx.save(); ctx.shadowColor='#f87171'; ctx.shadowBlur=14;
    ctx.fillStyle='#f87171';
    ctx.beginPath(); ctx.roundRect(food.x*cell+2, food.y*cell+2, cell-4, cell-4, 5); ctx.fill();
    ctx.restore();
    // snake
    snake.forEach((s, i) => {
      ctx.save();
      ctx.globalAlpha = 1 - (i / snake.length) * 0.45;
      if (i === 0) { ctx.shadowColor='#4ade80'; ctx.shadowBlur=10; }
      ctx.fillStyle = '#4ade80';
      ctx.beginPath(); ctx.roundRect(s.x*cell+1, s.y*cell+1, cell-2, cell-2, i===0?7:3); ctx.fill();
      ctx.restore();
    });
  }

  function gameOver() {
    running = false;
    clearSave();
    cancelAnimationFrame(raf);
    draw();
    olTitle.textContent = '💀 Game Over';
    olMsg.textContent   = '🍎 Score: ' + score + (score > 0 && score === best ? ' — New Best! 🏆' : '');
    document.getElementById('btn-start').innerHTML = '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7a5 5 0 015-5 5 5 0 013.5 1.4M12 7a5 5 0 01-5 5 5 5 0 01-3.5-1.4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M10 2v3H7M4 12V9h3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg> Play Again';
    overlay.style.display = 'flex';
  }

  document.getElementById('btn-start').addEventListener('click', () => { overlay.style.display='none'; init(); });

  const KEY_DIR = {
    ArrowUp:{x:0,y:-1}, ArrowDown:{x:0,y:1}, ArrowLeft:{x:-1,y:0}, ArrowRight:{x:1,y:0},
    w:{x:0,y:-1}, s:{x:0,y:1}, a:{x:-1,y:0}, d:{x:1,y:0},
    W:{x:0,y:-1}, S:{x:0,y:1}, A:{x:-1,y:0}, D:{x:1,y:0},
  };
  document.addEventListener('keydown', e => {
    const d = KEY_DIR[e.key]; if (!d) return;
    e.preventDefault();
    if (d.x !== -dir.x || d.y !== -dir.y) nextDir = d;
  });

  const DPAD_MAP = { 'd-up':{x:0,y:-1}, 'd-down':{x:0,y:1}, 'd-left':{x:-1,y:0}, 'd-right':{x:1,y:0} };
  Object.entries(DPAD_MAP).forEach(([id, d]) => {
    document.getElementById(id).addEventListener('click', () => {
      if (running && (d.x !== -dir.x || d.y !== -dir.y)) nextDir = d;
    });
  });

  let tx = 0, ty = 0;
  canvasWrap.addEventListener('touchstart', e => { tx=e.touches[0].clientX; ty=e.touches[0].clientY; }, { passive: true });
  canvasWrap.addEventListener('touchmove',  e => e.preventDefault(), { passive: false });
  canvasWrap.addEventListener('touchend',   e => {
    const dx = e.changedTouches[0].clientX - tx;
    const dy = e.changedTouches[0].clientY - ty;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 18) return;
    const d = Math.abs(dx) > Math.abs(dy)
      ? (dx > 0 ? {x:1,y:0} : {x:-1,y:0})
      : (dy > 0 ? {x:0,y:1} : {x:0,y:-1});
    if (running && (d.x !== -dir.x || d.y !== -dir.y)) nextDir = d;
  }, { passive: true });

  /* ── CHECK FOR SAVED GAME ── */
  const existingSave = loadSave();
  if (existingSave) {
    olTitle.textContent = '🐍 Resume Game?';
    olMsg.textContent   = '⭐ Score: ' + existingSave.score + ' · ⚡ Speed: ' + existingSave.speed;
    const btnStart = document.getElementById('btn-start');
    btnStart.textContent = '▶ Resume';

    // Add a "New Game" secondary button
    const btnNew2 = document.createElement('button');
    btnNew2.className   = 'btn-play';
    btnNew2.style.cssText = 'background:rgba(255,255,255,.12);box-shadow:none;margin-top:4px;';
    btnNew2.textContent = '🔄 New Game';
    btnNew2.addEventListener('click', () => { clearSave(); overlay.style.display='none'; init(); });
    overlay.appendChild(btnNew2);

    document.getElementById('btn-start').addEventListener('click', () => resumeGame(existingSave), { once: true });
  }

  /* ── Save on page hide ── */
  document.addEventListener('visibilitychange', () => { if (document.hidden) saveGame(); });
  window.addEventListener('pagehide', saveGame);

})();
