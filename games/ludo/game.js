// slicegames/games/ludo/game.js
(() => {
'use strict';

/* ── CONSTANTS ────────────────────────────────────────────── */
const COLORS = ['red','blue','green','yellow'];
const PC = { red:'#f87171', blue:'#60a5fa', green:'#4ade80', yellow:'#fbbf24' };
const PC_DARK = { red:'#7f1d1d', blue:'#1e3a8a', green:'#14532d', yellow:'#78350f' };
const LABEL = { red:'🔴 Red', blue:'🔵 Blue', green:'🟢 Green', yellow:'🟡 Yellow' };

/* Standard Ludo 52-step outer path on a 15×15 grid */
const OUTER = [
  [13,6],[12,6],[11,6],[10,6],[9,6],[8,6],
  [8,5],[8,4],[8,3],[8,2],[8,1],[8,0],
  [7,0],[6,0],
  [6,1],[6,2],[6,3],[6,4],[6,5],[6,6],
  [5,6],[4,6],[3,6],[2,6],[1,6],[0,6],
  [0,7],[0,8],
  [1,8],[2,8],[3,8],[4,8],[5,8],[6,8],
  [6,9],[6,10],[6,11],[6,12],[6,13],[6,14],
  [7,14],[8,14],
  [8,13],[8,12],[8,11],[8,10],[8,9],[8,8],
  [9,8],[10,8],[11,8],[12,8],[13,8],[14,8],
  [14,7],[13,7],
];
// Pad / trim to exactly 52
while (OUTER.length < 52) OUTER.push(OUTER[OUTER.length - 1]);
const PATH = OUTER.slice(0, 52);

/* Entry index on PATH for each colour */
const ENTRY = { red:0, blue:13, green:26, yellow:39 };

/* Home column (6 steps into centre, last = finished) */
const HOME_COL = {
  red:    [[13,7],[12,7],[11,7],[10,7],[9,7],[8,7]],
  blue:   [[7,1],[7,2],[7,3],[7,4],[7,5],[7,6]],
  green:  [[1,7],[2,7],[3,7],[4,7],[5,7],[6,7]],
  yellow: [[7,13],[7,12],[7,11],[7,10],[7,9],[7,8]],
};

/* Base (yard) positions for 4 pieces */
const BASE_POS = {
  red:    [[2,2],[3,2],[2,3],[3,3]],
  blue:   [[2,11],[3,11],[2,12],[3,12]],
  green:  [[11,11],[12,11],[11,12],[12,12]],
  yellow: [[11,2],[12,2],[11,3],[12,3]],
};

/* Safe squares (no capture) — row*15+col */
const SAFE = new Set([
  8*15+6, 6*15+2, 2*15+6, 6*15+12,
  6*15+8, 12*15+8, 8*15+2, 8*15+12,
  0*15+6, 6*15+0, 0*15+8, 8*15+0,
  6*15+14, 14*15+6, 8*15+14, 14*15+8,
]);

const DICE_DOTS = {
  1:[[22,22]],
  2:[[13,13],[31,31]],
  3:[[13,13],[22,22],[31,31]],
  4:[[13,13],[31,13],[13,31],[31,31]],
  5:[[13,13],[31,13],[22,22],[13,31],[31,31]],
  6:[[13,13],[31,13],[13,22],[31,22],[13,31],[31,31]],
};

/* ── STATE ────────────────────────────────────────────────── */
let mode      = null;   // e.g. '4-human', '1v1-cpu', etc.
let players   = [];     // active colour list
let cpuSet    = new Set();
let pieces    = {};     // color → [{pos, done}]  pos:-1=base, 0-51=path, 52-57=home col, 58=done
let curIdx    = 0;      // index into players array
let diceVal   = 0;
let rolled    = false;
let gameOver  = false;
let animating = false;

/* ── DOM ──────────────────────────────────────────────────── */
const modeScreen  = document.getElementById('mode-screen');
const gameScreen  = document.getElementById('game-screen');
const winOverlay  = document.getElementById('win-overlay');
const winTitle    = document.getElementById('win-title');
const winSub      = document.getElementById('win-sub');
const winBig      = document.getElementById('win-big');
const logText     = document.getElementById('log-text');
const boardCanvas = document.getElementById('board-canvas');
const ctx         = boardCanvas.getContext('2d');

/* ── CANVAS RESIZE ────────────────────────────────────────── */
function resizeCanvas() {
  const wrap = boardCanvas.parentElement;
  boardCanvas.width  = wrap.clientWidth;
  boardCanvas.height = wrap.clientHeight;
}

/* ── MODE SELECTION ───────────────────────────────────────── */
document.querySelectorAll('.mode-btn').forEach(btn => {
  btn.addEventListener('click', () => startMode(btn.dataset.mode));
});

function startMode(m) {
  mode = m;
  switch (m) {
    case '1v1-human': players=['red','blue'];             cpuSet=new Set(); break;
    case '1v1-cpu':   players=['red','blue'];             cpuSet=new Set(['blue']); break;
    case '3-human':   players=['red','blue','green'];     cpuSet=new Set(); break;
    case '4-human':   players=['red','blue','green','yellow']; cpuSet=new Set(); break;
    case '2v2-cpu':   players=['red','blue','green','yellow']; cpuSet=new Set(['green','yellow']); break;
    case '1v3-cpu':   players=['red','blue','green','yellow']; cpuSet=new Set(['blue','green','yellow']); break;
  }
  modeScreen.style.display = 'none';
  gameScreen.style.display  = 'flex';
  setupDiceUI();
  initGame();
}

/* ── DICE UI SETUP ────────────────────────────────────────── */
function setupDiceUI() {
  COLORS.forEach(col => {
    const zone = document.getElementById(`dz-${col}`);
    zone.style.setProperty('--pc', PC[col]);
    const active = players.includes(col);
    zone.style.display = active ? 'flex' : 'none';
    // Only show visible zones in correct corners for 1v1 / 3-player
    if (players.length === 2) {
      document.getElementById('dz-red').className    = 'dice-zone dz-tl';
      document.getElementById('dz-blue').className   = 'dice-zone dz-tr';
    }
  });

  COLORS.forEach(col => {
    document.getElementById(`df-${col}`).addEventListener('click', () => onDiceClick(col));
  });
}

/* ── GAME INIT ────────────────────────────────────────────── */
function initGame() {
  pieces = {};
  players.forEach(col => {
    pieces[col] = [0,1,2,3].map(() => ({ pos:-1, done:false }));
  });
  curIdx = 0; diceVal = 0; rolled = false; gameOver = false; animating = false;
  winOverlay.classList.remove('show');
  resizeCanvas();
  updateAllDiceUI();
  setLog(`${LABEL[curPlayer()]} goes first! 🎲 Tap their dice!`);
  if (rafId) cancelAnimationFrame(rafId);
  drawLoop();
  schedCPU();
}

const curPlayer = () => players[curIdx];

/* ── DICE CLICK ───────────────────────────────────────────── */
function onDiceClick(col) {
  if (gameOver || animating || rolled) return;
  if (col !== curPlayer()) return;
  if (cpuSet.has(col)) return;  // human can't click CPU dice
  rollDice();
}

function rollDice() {
  if (animating || rolled) return;
  animating = true;
  const col   = curPlayer();
  const face  = document.getElementById(`df-${col}`);
  face.classList.add('rolling');
  face.addEventListener('animationend', () => {
    face.classList.remove('rolling');
    animating = false;
    diceVal = Math.floor(Math.random() * 6) + 1;
    renderDiceDots(col, diceVal);
    rolled = true;
    afterRoll();
  }, { once: true });
}

function afterRoll() {
  const col = curPlayer();
  const movable = movablePieces(col, diceVal);
  if (movable.length === 0) {
    setLog(`${LABEL[col]} rolled ${diceVal} 🎲 — no moves! Skipping ⏭️`);
    setTimeout(() => nextTurn(), 1200);
  } else {
    setLog(`${LABEL[col]} rolled ${diceVal} 🎲 — pick a piece! 👆`);
    updateAllDiceUI();
    draw();
    if (cpuSet.has(col)) schedCPUMove(col, movable);
  }
}

/* ── PIECE MOVEMENT ───────────────────────────────────────── */
function movablePieces(col, roll) {
  return pieces[col].reduce((acc, p, i) => {
    if (p.done) return acc;
    if (p.pos === -1 && roll === 6) { acc.push(i); return acc; }
    if (p.pos === -1) return acc;
    if (p.pos + roll <= 57) acc.push(i);
    return acc;
  }, []);
}

function movePiece(col, idx) {
  if (!rolled || gameOver || animating) return;
  if (!movablePieces(col, diceVal).includes(idx)) return;
  animating = true;

  const p = pieces[col][idx];
  let msg = '';
  const rolledVal = diceVal; // capture before we reset it
  let extraTurn = false;

  if (p.pos === -1) {
    // Exit base — needed a 6
    p.pos = 0;
    msg = `${LABEL[col]} piece ${idx+1} enters the board! 🎉`;
    extraTurn = true;
  } else {
    const newPos = p.pos + rolledVal;
    p.pos = newPos;
    if (newPos >= 57) {
      p.pos  = 57;
      p.done = true;
      msg = `${LABEL[col]} piece ${idx+1} reached home! 🏁`;
    } else {
      msg = `${LABEL[col]} piece ${idx+1} moves ${rolledVal} steps.`;
      // Capture check (only on outer path)
      if (p.pos < 52) {
        const [pr, pc2] = pathCell(col, p.pos);
        if (!SAFE.has(pr*15+pc2)) {
          players.forEach(other => {
            if (other === col) return;
            pieces[other].forEach((op, oi) => {
              if (op.done || op.pos < 0 || op.pos >= 52) return;
              const [or, oc] = pathCell(other, op.pos);
              if (or === pr && oc === pc2) {
                op.pos = -1;
                msg += ` 💥 Captured ${LABEL[other]} piece ${oi+1}!`;
              }
            });
          });
        }
      }
    }
    extraTurn = diceVal === 6;
  }

  // Check win
  if (pieces[col].every(p => p.done)) {
    draw();
    animating = false;
    showWin(col);
    return;
  }

  rolled = false;
  diceVal = 0;
  renderDiceDots(col, 0);
  setLog(msg);
  draw();

  if (extraTurn) {
    setLog(msg + ' 🎲 Roll again!');
    animating = false;
    updateAllDiceUI();
    schedCPU();
  } else {
    animating = false;
    nextTurn();
  }
}

function nextTurn() {
  // Advance to next active (non-done) player
  let tries = 0;
  do {
    curIdx = (curIdx + 1) % players.length;
    tries++;
    if (tries > players.length) break; // all done somehow
  } while (pieces[curPlayer()].every(p => p.done));

  rolled = false;
  updateAllDiceUI();
  setLog(`${LABEL[curPlayer()]}'s turn! 🎯 Tap their dice!`);
  draw();
  schedCPU();
}

/* ── CPU AI ───────────────────────────────────────────────── */
function schedCPU() {
  const col = curPlayer();
  if (!cpuSet.has(col) || rolled || gameOver) return;
  setTimeout(() => {
    if (curPlayer() !== col || rolled || gameOver) return;
    rollDice();
  }, 900);
}

function schedCPUMove(col, movable) {
  setTimeout(() => {
    if (gameOver) return;
    // Strategy: prefer piece closest to finish, or that can capture
    let best = movable[0];
    let bestScore = -Infinity;
    movable.forEach(i => {
      const p = pieces[col][i];
      let score = p.pos === -1 ? 0 : p.pos;
      // Bonus for capture potential
      if (p.pos >= 0 && p.pos + diceVal < 52) {
        const [pr, pc2] = pathCell(col, p.pos + diceVal);
        players.forEach(other => {
          if (other === col) return;
          pieces[other].forEach(op => {
            if (op.done || op.pos < 0 || op.pos >= 52) return;
            const [or, oc] = pathCell(other, op.pos);
            if (or === pr && oc === pc2) score += 20;
          });
        });
      }
      if (score > bestScore) { bestScore = score; best = i; }
    });
    movePiece(col, best);
  }, 700);
}

/* ── PATH HELPERS ─────────────────────────────────────────── */
function pathCell(col, pos) {
  if (pos >= 52) return HOME_COL[col][pos - 52] || HOME_COL[col][5];
  const absIdx = (ENTRY[col] + pos) % 52;
  return PATH[absIdx];
}

function pieceGridCell(col, pieceIdx) {
  const p = pieces[col][pieceIdx];
  if (p.pos === -1) return BASE_POS[col][pieceIdx];
  if (p.done)       return null; // drawn in centre
  return pathCell(col, p.pos);
}

/* ── BOARD DRAWING ────────────────────────────────────────── */
const GRID = 15;

function cellBg(r, c) {
  if (r>=1&&r<=4&&c>=1&&c<=4)    return PC_DARK.red;
  if (r>=1&&r<=4&&c>=10&&c<=13)  return PC_DARK.blue;
  if (r>=10&&r<=13&&c>=10&&c<=13)return PC_DARK.green;
  if (r>=10&&r<=13&&c>=1&&c<=4)  return PC_DARK.yellow;
  if (r===7&&c>=1&&c<=5)  return 'rgba(248,113,113,.15)';
  if (c===7&&r>=1&&r<=5)  return 'rgba(96,165,250,.15)';
  if (r===7&&c>=9&&c<=13) return 'rgba(74,222,128,.15)';
  if (c===7&&r>=9&&r<=13) return 'rgba(251,191,36,.15)';
  if (r>=6&&r<=8&&c>=6&&c<=8) return '#1a1a2e';
  if (SAFE.has(r*15+c)) return 'rgba(255,255,255,.1)';
  return 'rgba(255,255,255,.03)';
}

function draw() {
  const W = boardCanvas.width, H = boardCanvas.height;
  if (!W || !H) return;
  const cs = W / GRID;
  ctx.clearRect(0, 0, W, H);

  // Cells
  for (let r = 0; r < GRID; r++) {
    for (let c = 0; c < GRID; c++) {
      ctx.fillStyle = cellBg(r, c);
      ctx.fillRect(c*cs, r*cs, cs, cs);
      ctx.strokeStyle = 'rgba(255,255,255,.06)';
      ctx.lineWidth   = 0.5;
      ctx.strokeRect(c*cs+.25, r*cs+.25, cs-.5, cs-.5);
    }
  }

  // Safe star markers
  SAFE.forEach(key => {
    const r = Math.floor(key/15), c = key%15;
    drawStar(c*cs+cs/2, r*cs+cs/2, cs*0.26);
  });

  // Home zone inner circles
  const zones = [
    {rows:[1,4],cols:[1,4],col:'red'},
    {rows:[1,4],cols:[10,13],col:'blue'},
    {rows:[10,13],cols:[10,13],col:'green'},
    {rows:[10,13],cols:[1,4],col:'yellow'},
  ];
  zones.forEach(({rows,cols,col}) => {
    if (!players.includes(col)) return;
    const x1=cols[0]*cs, y1=rows[0]*cs;
    const w=(cols[1]-cols[0]+1)*cs, h=(rows[1]-rows[0]+1)*cs;
    ctx.save();
    ctx.fillStyle   = PC[col]+'22';
    ctx.strokeStyle = PC[col]+'55';
    ctx.lineWidth   = 1.5;
    ctx.beginPath();
    ctx.arc(x1+w/2, y1+h/2, Math.min(w,h)*0.36, 0, Math.PI*2);
    ctx.fill(); ctx.stroke();
    ctx.restore();
  });

  // Centre gradient
  const grd = ctx.createLinearGradient(6*cs,6*cs,9*cs,9*cs);
  grd.addColorStop(0,  'rgba(248,113,113,.2)');
  grd.addColorStop(.33,'rgba(96,165,250,.2)');
  grd.addColorStop(.66,'rgba(74,222,128,.2)');
  grd.addColorStop(1,  'rgba(251,191,36,.2)');
  ctx.fillStyle = grd;
  ctx.fillRect(6*cs, 6*cs, 3*cs, 3*cs);

  // Draw pieces
  players.forEach(col => {
    pieces[col].forEach((piece, i) => {
      let gc;
      if (piece.done) {
        // Cluster finished pieces around centre
        const offsets = {red:[6.3+i*.45,6.3],blue:[6.3,8.3-i*.45],green:[8.3-i*.45,8.3],yellow:[8.3,6.3+i*.45]};
        const [rf,cf] = offsets[col];
        drawPiece(cf*cs+cs/2, rf*cs+cs/2, cs, col, i, false);
        return;
      }
      gc = pieceGridCell(col, i);
      if (!gc) return;
      const [r, c] = gc;
      const selectable = rolled && !gameOver && col===curPlayer() && movablePieces(col,diceVal).includes(i);
      drawPiece(c*cs+cs/2, r*cs+cs/2, cs, col, i, selectable);
    });
  });
}

function drawPiece(px, py, cs, col, idx, selectable) {
  const r = cs * 0.34;
  ctx.save();
  if (selectable) { ctx.shadowColor = PC[col]; ctx.shadowBlur = 12; }
  // outer ring
  ctx.fillStyle = '#12121e';
  ctx.beginPath(); ctx.arc(px, py, r+2, 0, Math.PI*2); ctx.fill();
  // body
  ctx.fillStyle = PC[col];
  ctx.beginPath(); ctx.arc(px, py, r, 0, Math.PI*2); ctx.fill();
  // shine
  ctx.fillStyle = 'rgba(255,255,255,.28)';
  ctx.beginPath(); ctx.arc(px-r*.28, py-r*.28, r*.38, 0, Math.PI*2); ctx.fill();
  // number
  ctx.shadowBlur  = 0;
  ctx.fillStyle   = '#fff';
  ctx.font        = `900 ${Math.round(cs*.28)}px Nunito,sans-serif`;
  ctx.textAlign   = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(idx+1, px, py+1);
  // pulse ring for selectable
  if (selectable) {
    ctx.strokeStyle = PC[col];
    ctx.lineWidth   = 2;
    ctx.globalAlpha = .55 + .45*Math.sin(Date.now()/200);
    ctx.beginPath(); ctx.arc(px, py, r+5, 0, Math.PI*2); ctx.stroke();
  }
  ctx.restore();
}

function drawStar(cx, cy, r) {
  ctx.save(); ctx.fillStyle='rgba(255,255,220,.45)';
  ctx.beginPath();
  for (let i=0;i<10;i++) {
    const a=(i*Math.PI)/5 - Math.PI/2;
    const rad = i%2===0 ? r : r*.44;
    i===0?ctx.moveTo(cx+rad*Math.cos(a),cy+rad*Math.sin(a)):ctx.lineTo(cx+rad*Math.cos(a),cy+rad*Math.sin(a));
  }
  ctx.closePath(); ctx.fill(); ctx.restore();
}

// Redraw loop for selectable pulse
let rafId;
function drawLoop() { draw(); rafId = requestAnimationFrame(drawLoop); }

/* ── DICE DOTS SVG ────────────────────────────────────────── */
function renderDiceDots(col, val) {
  const el  = document.getElementById(`dsv-${col}`);
  const hex = PC[col];
  const dots = val >= 1 ? DICE_DOTS[val].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="4" fill="${hex}"/>`).join('') : `<circle cx="22" cy="22" r="4" fill="${hex}"/>`;
  el.innerHTML = `<rect x="2" y="2" width="40" height="40" rx="8" fill="rgba(255,255,255,.07)" stroke="${hex}" stroke-width="1.8"/>${dots}`;
}

/* ── DICE UI STATE ────────────────────────────────────────── */
function updateAllDiceUI() {
  players.forEach((col, i) => {
    const zone = document.getElementById(`dz-${col}`);
    const dst  = document.getElementById(`dst-${col}`);
    const isCur = i === curIdx;
    zone.classList.toggle('is-active', isCur);
    zone.classList.toggle('is-cpu',    cpuSet.has(col));
    if (isCur) {
      dst.textContent = rolled ? 'Pick piece 👆' : cpuSet.has(col) ? 'CPU thinking… 🤖' : 'Tap to roll! 🎲';
    } else {
      dst.textContent = 'Waiting… ⏳';
    }
  });
}

/* ── CANVAS CLICK → piece select ─────────────────────────── */
boardCanvas.addEventListener('click', e => {
  if (!rolled || gameOver || animating) return;
  const col = curPlayer();
  if (cpuSet.has(col)) return;
  const rect  = boardCanvas.getBoundingClientRect();
  const scaleX = boardCanvas.width  / rect.width;
  const scaleY = boardCanvas.height / rect.height;
  const mx = (e.clientX - rect.left) * scaleX;
  const my = (e.clientY - rect.top)  * scaleY;
  const cs = boardCanvas.width / GRID;

  pieces[col].forEach((_, i) => {
    const gc = pieceGridCell(col, i);
    if (!gc) return;
    const [r, c] = gc;
    const px = c*cs+cs/2, py = r*cs+cs/2;
    if (Math.hypot(mx-px, my-py) < cs*.55) movePiece(col, i);
  });
});
boardCanvas.addEventListener('touchmove', e => e.preventDefault(), { passive: false });

/* ── WIN ──────────────────────────────────────────────────── */
function showWin(col) {
  gameOver = true;
  cancelAnimationFrame(rafId);
  winBig.textContent   = '🏆';
  winTitle.textContent = `${LABEL[col]} Wins!`;
  winSub.textContent   = cpuSet.has(col) ? '🤖 The CPU beat you! Try again? 😤' : 'All pieces made it home! 🎉';
  winOverlay.classList.add('show');
}

/* ── LOG ──────────────────────────────────────────────────── */
function setLog(msg) { logText.textContent = msg; }

/* ── BUTTONS ──────────────────────────────────────────────── */
document.getElementById('btn-menu').addEventListener('click', () => {
  cancelAnimationFrame(rafId);
  gameScreen.style.display  = 'none';
  modeScreen.style.display  = 'flex';
  winOverlay.classList.remove('show');
});
document.getElementById('btn-restart').addEventListener('click', () => initGame());
document.getElementById('btn-win-menu').addEventListener('click', () => {
  cancelAnimationFrame(rafId);
  winOverlay.classList.remove('show');
  gameScreen.style.display = 'none';
  modeScreen.style.display = 'flex';
});
document.getElementById('btn-win-restart').addEventListener('click', () => {
  winOverlay.classList.remove('show');
  initGame();
});
document.querySelector('.back-btn').addEventListener('click', () => cancelAnimationFrame(rafId));

window.addEventListener('resize', () => { resizeCanvas(); draw(); });

/* ── BOOT ─────────────────────────────────────────────────── */
// drawLoop starts inside initGame — no game yet so just draw static board

})();
