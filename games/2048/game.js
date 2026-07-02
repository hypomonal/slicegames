/**
 * game.js — 2048 core  (fully corrected + extended tile values to 1B)
 */
(() => {
  'use strict';

  /* ── Constants ── */
  const SIZE        = 4;
  const TRANSITION  = 110;   // ms slide duration
  const LB_MAX      = 5;
  const UNDO_LIMIT  = 10;
  const WIN_VALUE   = 2048;  // first win trigger (overlay shows once)
  const MEGA_VALUE  = 1_000_000_000; // 1 billion → 🥳

  /* ── Tile label helper ──────────────────────────────────────────────
     Formats a raw value into a human-readable string.
     Values ≥ 1 B → 🥳
     Values ≥ 1 M → "Xm"  (e.g. 4194304 → "4m")
     Values ≥ 1 K → "Xk"  (e.g. 16384  → "16k")
     Below 1 K    → raw number
  ─────────────────────────────────────────────────────────────────── */
  function formatValue(v) {
    if (v >= MEGA_VALUE)        return '🥳';
    if (v >= 1_000_000)         return (v / 1_000_000).toFixed(v % 1_000_000 === 0 ? 0 : 1) + 'm';
    if (v >= 1_000)             return (v / 1_000).toFixed(v % 1_000 === 0 ? 0 : 1) + 'k';
    return String(v);
  }

  function tileLabel(value) {
    // Emoji theme overrides the display text
    const map = window._tileEmojiMap;
    if (map) {
      if (value >= MEGA_VALUE) return map['billion'] || '🥳';
      // Find closest key ≤ value (themes only define up to 2048)
      const key = value > 2048 ? 'high' : value;
      if (map[key]) return map[key];
    }
    return formatValue(value);
  }

  /* ── colorClass: returns a stable CSS class for styling.
     We bucket everything > 2048 into progressively darker 't-high-N' classes
     so themes can style them, but all fall back to .t-high if not defined. ── */
  function colorClass(v) {
    if (v <= 2048)   return 't' + v;
    // bucket by power-of-two index above 2048
    const idx = Math.min(Math.floor(Math.log2(v)) - 11, 20); // 4096=1, 8192=2 …
    return 't-high t-high-' + idx;
  }

  function fontClass(v) {
    const label = formatValue(v);
    const len   = label.replace(/[^\x00-\x7F]/g, 'xx').length; // emoji = 2 chars wide
    if (len <= 2)  return '';
    if (len <= 3)  return 'fs-3';
    if (len <= 4)  return 'fs-4';
    return 'fs-5';
  }

  /* ── DOM refs ── */
  const boardEl       = document.getElementById('board');
  const tilesLayer    = document.getElementById('tiles-layer');
  const scoreEl       = document.getElementById('score');
  const bestEl        = document.getElementById('best');
  const movesEl       = document.getElementById('moves');
  const timerEl       = document.getElementById('timer');
  const overlayWin    = document.getElementById('overlay-win');
  const overlayOver   = document.getElementById('overlay-over');
  const overScoreMsg  = document.getElementById('over-score-msg');
  const winScoreMsg   = document.getElementById('win-score-msg');
  const boardWrap     = document.getElementById('board-wrap');
  const confCanvas    = document.getElementById('confetti-canvas');
  const confCtx       = confCanvas.getContext('2d');
  const lbList        = document.getElementById('lb-list');
  const statsGrid     = document.getElementById('stats-grid');
  const resumeBanner  = document.getElementById('resume-banner');
  const btnUndo       = document.getElementById('btn-undo');
  const btnSound      = document.getElementById('btn-sound');
  const btnTheme      = document.getElementById('btn-theme');
  const btnTileTheme  = document.getElementById('btn-tile-theme');
  const btnStats      = document.getElementById('btn-stats');
  const statsBackdrop = document.getElementById('stats-backdrop');
  const themeBackdrop = document.getElementById('theme-backdrop');
  const themeOptions  = document.getElementById('theme-options');

  /* ── State ── */
  let tileGrid  = [];
  let tileEls   = {};
  let nextId    = 1;
  let score     = 0;
  let moves     = 0;
  let best      = +localStorage.getItem('2048-best') || 0;
  let won       = false;   // true once player first reaches WIN_VALUE
  let over      = false;
  let moving    = false;
  let undoStack = [];

  /* ── Timer ── */
  let timerSeconds  = 0;
  let timerInterval = null;
  let timerRunning  = false;

  function startTimer() {
    if (timerRunning) return;
    timerRunning = true;
    timerInterval = setInterval(() => { timerSeconds++; renderTimer(); }, 1000);
  }
  function stopTimer() {
    timerRunning = false;
    clearInterval(timerInterval);
    timerInterval = null;
  }
  function resetTimer() { stopTimer(); timerSeconds = 0; renderTimer(); }
  function renderTimer() {
    const m = Math.floor(timerSeconds / 60);
    const s = timerSeconds % 60;
    timerEl.textContent = `${m}:${String(s).padStart(2, '0')}`;
  }

  /* ── Dark mode ── */
  const html = document.documentElement;
  let darkMode = localStorage.getItem('2048-theme') === 'dark';
  function applyDark() {
    html.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    btnTheme.textContent = darkMode ? '☀️' : '🌙';
    localStorage.setItem('2048-theme', darkMode ? 'dark' : 'light');
  }
  applyDark();
  btnTheme.addEventListener('click', () => { darkMode = !darkMode; applyDark(); });

  /* ── Sound ── */
  function updateSoundBtn() {
    btnSound.textContent = Sounds.isEnabled() ? '🔊' : '🔇';
    btnSound.classList.toggle('muted', !Sounds.isEnabled());
  }
  updateSoundBtn();
  btnSound.addEventListener('click', () => { Sounds.setEnabled(!Sounds.isEnabled()); updateSoundBtn(); });

  /* ── Tile theme picker ── */
  function buildThemePicker() {
    themeOptions.innerHTML = '';
    TileThemes.getNames().forEach(name => {
      const theme = TileThemes.getThemes()[name];
      const btn   = document.createElement('button');
      btn.className   = 'theme-btn' + (name === TileThemes.getCurrent() ? ' active' : '');
      btn.textContent = theme.label;
      btn.addEventListener('click', () => {
        TileThemes.apply(name);
        document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        // Re-render live tiles immediately
        for (let r = 0; r < SIZE; r++)
          for (let c = 0; c < SIZE; c++) {
            const t = tileGrid[r][c];
            if (!t) continue;
            const el = tileEls[t.id];
            if (el) el.textContent = tileLabel(t.value);
          }
      });
      themeOptions.appendChild(btn);
    });
  }
  btnTileTheme.addEventListener('click', () => { buildThemePicker(); themeBackdrop.classList.add('show'); });
  document.getElementById('btn-close-theme').addEventListener('click', () => themeBackdrop.classList.remove('show'));
  themeBackdrop.addEventListener('click', e => { if (e.target === themeBackdrop) themeBackdrop.classList.remove('show'); });

  /* ── Stats ── */
  function loadStats() {
    return JSON.parse(localStorage.getItem('2048-stats') || JSON.stringify({
      gamesPlayed: 0, gamesWon: 0, totalScore: 0, totalMoves: 0, bestTime: null,
    }));
  }
  function saveStats(finalScore, finalMoves, didWin, seconds) {
    const s = loadStats();
    s.gamesPlayed++;
    if (didWin) s.gamesWon++;
    s.totalScore += finalScore;
    s.totalMoves += finalMoves;
    if (seconds > 0 && (s.bestTime === null || seconds < s.bestTime)) s.bestTime = seconds;
    localStorage.setItem('2048-stats', JSON.stringify(s));
  }
  function fmtTime(sec) {
    if (sec == null) return '—';
    return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;
  }
  function renderStats() {
    const s       = loadStats();
    const lb      = loadLeaderboard();
    const winRate = s.gamesPlayed ? Math.round((s.gamesWon / s.gamesPlayed) * 100) : 0;
    const avgScore= s.gamesPlayed ? Math.round(s.totalScore / s.gamesPlayed) : 0;
    const avgMoves= s.gamesPlayed ? Math.round(s.totalMoves / s.gamesPlayed) : 0;
    statsGrid.innerHTML = `
      <div class="stat-item"><div class="stat-val">${s.gamesPlayed}</div><div class="stat-lbl">Played</div></div>
      <div class="stat-item"><div class="stat-val">${s.gamesWon}</div><div class="stat-lbl">Won</div></div>
      <div class="stat-item"><div class="stat-val">${winRate}%</div><div class="stat-lbl">Win Rate</div></div>
      <div class="stat-item"><div class="stat-val">${avgScore.toLocaleString()}</div><div class="stat-lbl">Avg Score</div></div>
      <div class="stat-item"><div class="stat-val">${avgMoves}</div><div class="stat-lbl">Avg Moves</div></div>
      <div class="stat-item"><div class="stat-val">${fmtTime(s.bestTime)}</div><div class="stat-lbl">Best Time</div></div>
    `;
    lbList.innerHTML = '';
    if (!lb.length) {
      lbList.innerHTML = '<li class="empty">No scores yet — play a game! 🎮</li>';
    } else {
      lb.forEach((entry, i) => {
        const li = document.createElement('li');
        if (i < 3) li.classList.add(['gold','silver','bronze'][i]);
        li.innerHTML = `
          <span class="rank">${['🥇','🥈','🥉'][i] || '#'+(i+1)}</span>
          <span class="lb-score">${entry.score.toLocaleString()}</span>
          <span class="lb-moves">${entry.moves} moves · ${fmtTime(entry.time)}</span>
        `;
        lbList.appendChild(li);
      });
    }
  }
  btnStats.addEventListener('click', () => { renderStats(); statsBackdrop.classList.add('show'); });
  document.getElementById('btn-close-stats').addEventListener('click', () => statsBackdrop.classList.remove('show'));
  statsBackdrop.addEventListener('click', e => { if (e.target === statsBackdrop) statsBackdrop.classList.remove('show'); });

  /* ── Leaderboard ── */
  function loadLeaderboard() { return JSON.parse(localStorage.getItem('2048-lb') || '[]'); }
  function saveToLeaderboard(finalScore, finalMoves, seconds) {
    const lb = loadLeaderboard();
    lb.push({ score: finalScore, moves: finalMoves, time: seconds, date: Date.now() });
    lb.sort((a, b) => b.score - a.score);
    lb.splice(LB_MAX);
    localStorage.setItem('2048-lb', JSON.stringify(lb));
  }

  /* ── Auto-save / Resume ── */
  function saveGame() {
    if (over) return;
    const snap = {
      tileGrid:     tileGrid.map(row => row.map(t => t ? { ...t } : null)),
      score, moves, won, nextId, timerSeconds,
      undoStack:    undoStack.map(s => ({
        grid:  s.grid.map(row => row.map(t => t ? { ...t } : null)),
        score: s.score, moves: s.moves,
      })),
    };
    localStorage.setItem('2048-save', JSON.stringify(snap));
  }
  function clearSave()  { localStorage.removeItem('2048-save'); }
  function hasSave()    { return !!localStorage.getItem('2048-save'); }

  function resumeGame() {
    const raw = localStorage.getItem('2048-save');
    if (!raw) return;
    const snap = JSON.parse(raw);
    resumeBanner.style.display = 'none';
    clearSave();

    tileGrid     = snap.tileGrid;
    score        = snap.score;
    moves        = snap.moves;
    won          = snap.won  || false;
    nextId       = snap.nextId;
    timerSeconds = snap.timerSeconds || 0;
    undoStack    = snap.undoStack    || [];
    over         = false;
    moving       = false;

    scoreEl.textContent = score.toLocaleString();
    movesEl.textContent = moves;
    bestEl.textContent  = best.toLocaleString();
    renderTimer();
    btnUndo.disabled = !undoStack.length;

    tilesLayer.innerHTML = '';
    tileEls = {};
    for (let r = 0; r < SIZE; r++)
      for (let c = 0; c < SIZE; c++) {
        const t = tileGrid[r][c];
        if (!t) continue;
        if (t.id >= nextId) nextId = t.id + 1;
        createTileEl(t.id, t.value, r, c);
      }

    overlayWin.classList.remove('show');
    overlayOver.classList.remove('show');
    stopConfetti();
    startTimer();
  }

  /* ── Tile size / positioning ── */
  function cssGap() {
    return parseInt(getComputedStyle(html).getPropertyValue('--gap'), 10) || 12;
  }
  function tileSize() {
    const cell = boardEl.querySelector('.cell');
    return cell ? cell.offsetWidth : 80;
  }
  function posFor(row, col) {
    const gap = cssGap(), ts = tileSize();
    const br  = boardEl.getBoundingClientRect();
    const wr  = boardWrap.getBoundingClientRect();
    return {
      left: (br.left - wr.left) + gap + col * (ts + gap),
      top:  (br.top  - wr.top)  + gap + row * (ts + gap),
    };
  }

  /* ── Build empty cell grid ── */
  for (let i = 0; i < SIZE * SIZE; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    boardEl.appendChild(cell);
  }

  /* ── Tile DOM ── */
  function createTileEl(id, value, row, col) {
    const el  = document.createElement('div');
    const pos = posFor(row, col);
    const ts  = tileSize();
    el.className     = `tile ${colorClass(value)} ${fontClass(value)}`;
    el.dataset.id    = id;
    el.dataset.val   = value;   // numeric value for change-detection
    el.textContent   = tileLabel(value);
    el.style.cssText = `width:${ts}px;height:${ts}px;left:${pos.left}px;top:${pos.top}px;transition:none;`;
    tilesLayer.appendChild(el);
    tileEls[id] = el;
    return el;
  }

  function moveTileEl(id, row, col) {
    const el = tileEls[id];
    if (!el) return;
    const pos = posFor(row, col);
    el.style.transition = `left ${TRANSITION}ms ease, top ${TRANSITION}ms ease`;
    el.style.left = pos.left + 'px';
    el.style.top  = pos.top  + 'px';
  }

  function removeTileEl(id) {
    const el = tileEls[id];
    if (el) { el.remove(); delete tileEls[id]; }
  }

  function updateTileEl(id, value) {
    const el = tileEls[id];
    if (!el) return;
    el.dataset.val   = value;
    el.textContent   = tileLabel(value);
    el.className     = `tile ${colorClass(value)} ${fontClass(value)} merge-tile`;
    el.style.transition = 'none';
  }

  /* ── Grid helpers ── */
  function emptyGrid()  { return Array.from({ length: SIZE }, () => Array(SIZE).fill(null)); }
  function emptyCells() {
    const out = [];
    for (let r = 0; r < SIZE; r++)
      for (let c = 0; c < SIZE; c++)
        if (!tileGrid[r][c]) out.push([r, c]);
    return out;
  }
  function cloneGrid(g) { return g.map(row => row.map(t => t ? { ...t } : null)); }

  function spawnTile(animate = true) {
    const cells = emptyCells();
    if (!cells.length) return;
    const [r, c] = cells[Math.floor(Math.random() * cells.length)];
    const value  = Math.random() < 0.9 ? 2 : 4;
    const id     = nextId++;
    tileGrid[r][c] = { id, value };
    const el = createTileEl(id, value, r, c);
    void el.offsetWidth; // force reflow before animation
    if (animate) { el.classList.add('new-tile'); Sounds.spawn(); }
  }

  /* ── Score + moves ── */
  function addScore(n) {
    if (!n) return;
    score += n;
    scoreEl.textContent = score.toLocaleString();
    scoreEl.classList.remove('score-bump');
    void scoreEl.offsetWidth;
    scoreEl.classList.add('score-bump');
    if (score > best) {
      best = score;
      bestEl.textContent = best.toLocaleString();
      localStorage.setItem('2048-best', best);
    }
  }
  function incMoves() { moves++; movesEl.textContent = moves; }

  /* ── Undo ── */
  function pushUndo() {
    undoStack.push({ grid: cloneGrid(tileGrid), score, moves });
    if (undoStack.length > UNDO_LIMIT) undoStack.shift();
    btnUndo.disabled = false;
  }

  function applyUndo() {
    if (!undoStack.length || moving) return;
    const snap = undoStack.pop();
    tilesLayer.innerHTML = '';
    tileEls   = {};
    nextId    = 1;
    tileGrid  = snap.grid;
    score     = snap.score;
    moves     = snap.moves;
    scoreEl.textContent = score.toLocaleString();
    movesEl.textContent = moves;
    for (let r = 0; r < SIZE; r++)
      for (let c = 0; c < SIZE; c++) {
        const t = tileGrid[r][c];
        if (!t) continue;
        if (t.id >= nextId) nextId = t.id + 1;
        createTileEl(t.id, t.value, r, c);
      }
    if (!undoStack.length) btnUndo.disabled = true;
    Sounds.undo();
    saveGame();
  }

  btnUndo.disabled = true;
  btnUndo.addEventListener('click', applyUndo);

  /* ── Move logic ── */
  function shiftLeft(row) {
    const vals    = row.filter(Boolean);
    const out     = Array(SIZE).fill(null);
    let gained    = 0;
    const removes = [], merges = [];
    let wi = 0, ri = 0;
    while (ri < vals.length) {
      if (ri + 1 < vals.length && vals[ri].value === vals[ri + 1].value) {
        const nv = vals[ri].value * 2;
        gained += nv;
        out[wi] = { id: vals[ri].id, value: nv };
        removes.push(vals[ri + 1].id);
        merges.push({ id: vals[ri].id, value: nv });
        ri += 2;
      } else {
        out[wi] = { id: vals[ri].id, value: vals[ri].value };
        ri++;
      }
      wi++;
    }
    return { line: out, gained, removes, merges };
  }

  const rotateRight = g => g[0].map((_, c) => g.map(row => row[c]).reverse());
  const rotateLeft  = g => g[0].map((_, c) => g.map(row => row[SIZE - 1 - c]));
  const flipH       = g => g.map(row => [...row].reverse());

  function move(dir) {
    if (moving || over) return;

    let g = cloneGrid(tileGrid);
    if (dir === 'right') g = flipH(g);
    if (dir === 'up')    g = rotateLeft(g);
    if (dir === 'down')  g = rotateRight(g);

    let totalGained = 0, changed = false;
    const allRemoves = [], allMergeValues = [];
    const newGrid    = emptyGrid();

    for (let r = 0; r < SIZE; r++) {
      const { line, gained, removes, merges } = shiftLeft(g[r]);
      for (let c = 0; c < SIZE; c++) {
        const ov = g[r][c] ? g[r][c].value : 0;
        const nv = line[c] ? line[c].value  : 0;
        if (ov !== nv || removes.length) changed = true;
      }
      totalGained += gained;
      allRemoves.push(...removes);
      merges.forEach(m => allMergeValues.push(m.value));
      newGrid[r] = line;
    }

    // Reverse transforms
    let finalGrid = newGrid;
    if (dir === 'right') finalGrid = flipH(finalGrid);
    if (dir === 'up')    finalGrid = rotateRight(finalGrid);
    if (dir === 'down')  finalGrid = rotateLeft(finalGrid);

    // Definitive change check by tile ID positions
    if (!changed) {
      let really = false;
      outer: for (let r = 0; r < SIZE; r++)
        for (let c = 0; c < SIZE; c++) {
          const a = tileGrid[r][c], b = finalGrid[r][c];
          if ((a ? a.id : 0) !== (b ? b.id : 0)) { really = true; break outer; }
        }
      if (!really) return;
    }

    startTimer();  // start on first real move
    pushUndo();
    moving = true;

    // Build position map (survivor id → {r,c})
    const positions = {};
    for (let r = 0; r < SIZE; r++)
      for (let c = 0; c < SIZE; c++) {
        const t = finalGrid[r][c];
        if (t) positions[t.id] = { r, c };
      }

    // Map absorbed id → survivor id (so absorbed tile slides to merge destination)
    const absorbedTo = {};
    {
      let gc = cloneGrid(tileGrid);
      if (dir === 'right') gc = flipH(gc);
      if (dir === 'up')    gc = rotateLeft(gc);
      if (dir === 'down')  gc = rotateRight(gc);
      for (let r = 0; r < SIZE; r++) {
        const vals = gc[r].filter(Boolean);
        let ri = 0;
        while (ri < vals.length) {
          if (ri + 1 < vals.length && vals[ri].value === vals[ri + 1].value) {
            absorbedTo[vals[ri + 1].id] = vals[ri].id;
            ri += 2;
          } else ri++;
        }
      }
    }

    // Send absorbed tiles behind survivor
    allRemoves.forEach(id => { const el = tileEls[id]; if (el) el.style.zIndex = '1'; });

    // Slide absorbed tiles to their merge destination
    Object.entries(absorbedTo).forEach(([absId, survivorId]) => {
      const pos = positions[survivorId];
      if (pos) moveTileEl(Number(absId), pos.r, pos.c);
    });

    // Slide survivors
    Object.entries(positions).forEach(([id, { r, c }]) => moveTileEl(Number(id), r, c));
    Sounds.move();

    setTimeout(() => {
      // Remove absorbed tiles
      allRemoves.forEach(id => removeTileEl(id));

      // Update merged tiles (value + colour + bounce)
      for (let r = 0; r < SIZE; r++)
        for (let c = 0; c < SIZE; c++) {
          const t  = finalGrid[r][c];
          if (!t) continue;
          const el = tileEls[t.id];
          // compare via stored data-val (works even with emoji labels)
          if (el && Number(el.dataset.val) !== t.value) updateTileEl(t.id, t.value);
        }

      tileGrid = finalGrid;
      addScore(totalGained);
      incMoves();
      allMergeValues.forEach(v => Sounds.merge(v));

      // Win: show overlay once when first hitting WIN_VALUE, then let player continue
      if (!won) {
        outer:
        for (let r = 0; r < SIZE; r++)
          for (let c = 0; c < SIZE; c++)
            if (tileGrid[r][c] && tileGrid[r][c].value >= WIN_VALUE) {
              won = true;
              // DON'T stop timer — player can keep going
              saveStats(score, moves, true, timerSeconds);
              saveToLeaderboard(score, moves, timerSeconds);
              winScoreMsg.textContent =
                `Score: ${score.toLocaleString()} · ${moves} moves · ${timerEl.textContent}`;
              Sounds.win();
              showWin();
              break outer;
            }
      }

      spawnTile(true);

      // Clean animation classes after they fire
      Object.values(tileEls).forEach(el => {
        el.addEventListener('animationend', () => {
          el.classList.remove('new-tile', 'merge-tile');
        }, { once: true });
      });

      // Game over?
      if (!canMove()) {
        over = true;
        stopTimer();
        // Only save stats if we haven't already on win
        if (!won) saveStats(score, moves, false, timerSeconds);
        saveToLeaderboard(score, moves, timerSeconds);
        Sounds.gameOver();
        overScoreMsg.textContent =
          `Score: ${score.toLocaleString()} · ${moves} moves · ${timerEl.textContent}`;
        clearSave();
        setTimeout(() => overlayOver.classList.add('show'), 350);
      } else {
        saveGame();
      }

      moving = false;
    }, TRANSITION + 20);
  }

  /* ── Can move? ── */
  function canMove() {
    for (let r = 0; r < SIZE; r++)
      for (let c = 0; c < SIZE; c++) {
        if (!tileGrid[r][c]) return true;
        const v = tileGrid[r][c].value;
        if (r + 1 < SIZE && tileGrid[r+1][c] && tileGrid[r+1][c].value === v) return true;
        if (c + 1 < SIZE && tileGrid[r][c+1] && tileGrid[r][c+1].value === v) return true;
      }
    return false;
  }

  /* ── Init / restart ── */
  function init() {
    clearSave();
    tilesLayer.innerHTML = '';
    tileEls   = {};
    nextId    = 1;
    tileGrid  = emptyGrid();
    score     = 0;
    moves     = 0;
    won       = false;
    over      = false;
    moving    = false;
    undoStack = [];
    btnUndo.disabled = true;
    scoreEl.textContent = '0';
    movesEl.textContent = '0';
    bestEl.textContent  = best.toLocaleString();
    overlayWin.classList.remove('show');
    overlayOver.classList.remove('show');
    resumeBanner.style.display = 'none';
    stopConfetti();
    resetTimer();
    spawnTile(false);
    spawnTile(false);
    Object.values(tileEls).forEach(el => el.classList.remove('new-tile'));
  }

  /* ── Win overlay ── */
  function showWin() { overlayWin.classList.add('show'); startConfetti(); }

  /* ── Confetti ── */
  let confettiRAF = null, pieces = [];
  const PALETTE = ['#f9d7e0','#ddd6f7','#f5c842','#7ecba1','#6dbfea','#f2845a','#9d74d4'];

  function startConfetti() {
    const W = confCanvas.offsetWidth, H = confCanvas.offsetHeight;
    confCanvas.width = W; confCanvas.height = H;
    pieces = Array.from({ length: 90 }, () => ({
      x: Math.random()*W, y: Math.random()*H-H, r: Math.random()*6+4,
      vy: Math.random()*2+1, color: PALETTE[Math.floor(Math.random()*PALETTE.length)],
      tilt: Math.random()*10-5, tiltV: Math.random()*0.3+0.1,
      angle: Math.random()*Math.PI*2, angleV: Math.random()*0.08+0.02,
    }));
    (function loop() {
      confCtx.clearRect(0,0,W,H);
      pieces.forEach(p => {
        p.y+=p.vy; p.angle+=p.angleV; p.tilt+=p.tiltV;
        if (p.y>H) { p.y=-10; p.x=Math.random()*W; }
        confCtx.beginPath();
        confCtx.ellipse(p.x+p.tilt,p.y,p.r,p.r*0.5,p.angle,0,Math.PI*2);
        confCtx.fillStyle=p.color; confCtx.fill();
      });
      confettiRAF = requestAnimationFrame(loop);
    })();
  }
  function stopConfetti() {
    if (confettiRAF) { cancelAnimationFrame(confettiRAF); confettiRAF = null; }
    confCtx.clearRect(0,0,confCanvas.width,confCanvas.height);
    pieces = [];
  }

  /* ── Keyboard ── */
  const KEY_MAP = {
    ArrowLeft:'left', ArrowRight:'right', ArrowUp:'up', ArrowDown:'down',
    a:'left', d:'right', w:'up', s:'down',
    A:'left', D:'right', W:'up', S:'down',
  };
  document.addEventListener('keydown', e => {
    if ((e.ctrlKey||e.metaKey) && e.key==='z') { e.preventDefault(); applyUndo(); return; }
    const dir = KEY_MAP[e.key];
    if (dir) { e.preventDefault(); move(dir); }
  });

  /* ── Touch / swipe ── */
  let touchStartX = 0, touchStartY = 0;
  boardWrap.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: false });
  boardWrap.addEventListener('touchmove', e => e.preventDefault(), { passive: false });
  boardWrap.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 20) return;
    move(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right':'left') : (dy > 0 ? 'down':'up'));
  }, { passive: false });

  /* ── Buttons ── */
  document.getElementById('btn-new').addEventListener('click', init);
  document.getElementById('btn-continue').addEventListener('click', () => {
    overlayWin.classList.remove('show');
    stopConfetti();
    // Timer keeps running — player continues beyond 2048
  });
  document.getElementById('btn-restart-win').addEventListener('click', init);
  document.getElementById('btn-restart-over').addEventListener('click', init);
  document.getElementById('btn-resume').addEventListener('click', resumeGame);
  document.getElementById('btn-discard').addEventListener('click', () => {
    clearSave(); resumeBanner.style.display = 'none'; init();
  });

  /* ── Resize ── */
  window.addEventListener('resize', () => {
    const ts = tileSize();
    html.style.setProperty('--tile-size', ts + 'px');
    for (let r = 0; r < SIZE; r++)
      for (let c = 0; c < SIZE; c++) {
        const t = tileGrid[r][c];
        if (!t) continue;
        const el = tileEls[t.id], pos = posFor(r,c);
        if (el) {
          el.style.transition = 'none';
          el.style.left = pos.left+'px'; el.style.top = pos.top+'px';
          el.style.width = ts+'px';      el.style.height = ts+'px';
        }
      }
  });

  /* ── Auto-save on page hide ── */
  document.addEventListener('visibilitychange', () => { if (document.hidden && !over) saveGame(); });
  window.addEventListener('pagehide',           () => { if (!over) saveGame(); });

  /* ── Boot ── */
  if (hasSave()) {
    init();
    resumeBanner.style.display = 'flex';
  } else {
    init();
  }
})();
