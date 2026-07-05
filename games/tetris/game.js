// anigames/games/tetris/game.js
(() => {
  'use strict';
  const COLS=10, ROWS=20;
  const POINTS=[0,100,300,500,800];
  const PIECES=[
    {shape:[[1,1,1,1]],           color:'#38bdf8'},
    {shape:[[1,1],[1,1]],         color:'#fbbf24'},
    {shape:[[0,1,0],[1,1,1]],     color:'#a78bfa'},
    {shape:[[1,0,0],[1,1,1]],     color:'#fb923c'},
    {shape:[[0,0,1],[1,1,1]],     color:'#60a5fa'},
    {shape:[[0,1,1],[1,1,0]],     color:'#4ade80'},
    {shape:[[1,1,0],[0,1,1]],     color:'#f87171'},
  ];
  const boardEl  = document.getElementById('board');
  const nextEl   = document.getElementById('next');
  const wrap     = document.getElementById('canvas-wrap');
  const bCtx     = boardEl.getContext('2d');
  const nCtx     = nextEl.getContext('2d');
  const scoreEl  = document.getElementById('score');
  const bestEl   = document.getElementById('best');
  const levelEl  = document.getElementById('level');
  const linesEl  = document.getElementById('lines');
  const overlay  = document.getElementById('overlay');
  const olTitle  = document.getElementById('ol-title');
  const olMsg    = document.getElementById('ol-msg');
  const btnStart = document.getElementById('btn-start');
  const btnPause = document.getElementById('btn-pause');
  const pauseSvg = document.getElementById('pause-svg');

  const maxW = Math.min(window.innerWidth - 130, 260);
  const cell = Math.floor(maxW / COLS);
  boardEl.width = cell*COLS; boardEl.height = cell*ROWS;
  nextEl.width  = cell*4;   nextEl.height  = cell*4;

  let best = +localStorage.getItem('tetris-best') || 0;
  bestEl.textContent = best;
  let board, piece, nextPiece, score, level, lines, running, paused, dropInt, lastDrop, raf;


  /* ── AUTO-SAVE / RESUME ── */
  const SAVE_KEY = 'tetris-save';

  function saveGame() {
    if (!running || paused) return;
    localStorage.setItem(SAVE_KEY, JSON.stringify({
      board, score, level, lines, dropInt,
      piece: piece ? { color: piece.color, shape: piece.shape, x: piece.x, y: piece.y } : null,
      nextPiece: nextPiece ? { color: nextPiece.color, shape: nextPiece.shape } : null,
    }));
  }

  function loadSave() {
    try { const r = localStorage.getItem(SAVE_KEY); return r ? JSON.parse(r) : null; }
    catch { return null; }
  }

  function clearSave() { localStorage.removeItem(SAVE_KEY); }

  function resumeGame(save) {
    board      = save.board;
    score      = save.score;
    level      = save.level;
    lines      = save.lines;
    dropInt    = save.dropInt;
    piece      = save.piece;
    nextPiece  = save.nextPiece;
    running    = true; paused = false;
    scoreEl.textContent = score.toLocaleString();
    levelEl.textContent = level;
    linesEl.textContent = lines;
    overlay.style.display = 'none';
    setPauseIcon(false);
    lastDrop = performance.now();
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(loop);
  }

  const emptyBoard = () => Array.from({length:ROWS}, () => Array(COLS).fill(0));
  const randPiece  = () => { const p=PIECES[Math.floor(Math.random()*PIECES.length)]; return {color:p.color, shape:p.shape.map(r=>[...r])}; };
  const rotate     = s => s[0].map((_,c) => s.map(r=>r[c]).reverse());
  const collides   = (shape,ox,oy) => shape.some((row,r)=>row.some((v,c)=>{
    if(!v) return false;
    const nx=ox+c, ny=oy+r;
    return nx<0||nx>=COLS||ny>=ROWS||(ny>=0&&board[ny][nx]);
  }));

  function spawnPiece() {
    const p = nextPiece || randPiece();
    nextPiece = randPiece();
    piece = {...p, shape:p.shape.map(r=>[...r]), x:Math.floor(COLS/2)-Math.floor(p.shape[0].length/2), y:0};
    if (collides(piece.shape,piece.x,piece.y)) { endGame(); return false; }
    return true;
  }

  function lock() {
    piece.shape.forEach((row,r)=>row.forEach((v,c)=>{ if(v&&piece.y+r>=0) board[piece.y+r][piece.x+c]=piece.color; }));
    let cleared=0;
    for (let r=ROWS-1;r>=0;r--) {
      if (board[r].every(c=>c)) { board.splice(r,1); board.unshift(Array(COLS).fill(0)); cleared++; r++; }
    }
    if (cleared) {
      lines+=cleared; score+=POINTS[Math.min(cleared,4)]*level; level=Math.floor(lines/10)+1; dropInt=Math.max(80,800-(level-1)*72);
      scoreEl.textContent=score.toLocaleString(); linesEl.textContent=lines; levelEl.textContent=level;
      if (score>best) { best=score; bestEl.textContent=best.toLocaleString(); localStorage.setItem('tetris-best',best); }
    }
    spawnPiece();
    saveGame();
  }

  function tryRotate() {
    const r=rotate(piece.shape);
    const kicks=[0,-1,1,-2,2];
    for (const kick of kicks) {
      if (!collides(r,piece.x+kick,piece.y)) { piece.shape=r; piece.x+=kick; return; }
    }
  }

  const hardDrop = () => { while(!collides(piece.shape,piece.x,piece.y+1)) piece.y++; lock(); };

  function init() {
    board=emptyBoard(); score=0; level=1; lines=0; dropInt=800; lastDrop=performance.now();
    scoreEl.textContent='0'; levelEl.textContent='1'; linesEl.textContent='0';
    nextPiece=randPiece(); spawnPiece(); running=true; paused=false;
    setPauseIcon(false);
    if (raf) cancelAnimationFrame(raf);
    raf=requestAnimationFrame(loop);
  }

  function loop(ts) {
    raf=requestAnimationFrame(loop);
    if (!running||paused) { draw(); return; }
    if (ts-lastDrop>=dropInt) { lastDrop=ts; if(!collides(piece.shape,piece.x,piece.y+1)) piece.y++; else lock(); }
    draw();
  }

  function draw() {
    bCtx.fillStyle='#060c10'; bCtx.fillRect(0,0,boardEl.width,boardEl.height);
    if (!board) return;
    // grid
    bCtx.strokeStyle='rgba(255,255,255,0.04)'; bCtx.lineWidth=0.5;
    for(let c=0;c<=COLS;c++){bCtx.beginPath();bCtx.moveTo(c*cell,0);bCtx.lineTo(c*cell,boardEl.height);bCtx.stroke();}
    for(let r=0;r<=ROWS;r++){bCtx.beginPath();bCtx.moveTo(0,r*cell);bCtx.lineTo(boardEl.width,r*cell);bCtx.stroke();}
    // locked
    board.forEach((row,r)=>row.forEach((col,c)=>{
      if(!col) return;
      bCtx.fillStyle=col; bCtx.fillRect(c*cell+1,r*cell+1,cell-2,cell-2);
      bCtx.fillStyle='rgba(255,255,255,.18)'; bCtx.fillRect(c*cell+1,r*cell+1,cell-2,2); bCtx.fillRect(c*cell+1,r*cell+1,2,cell-2);
    }));
    if (!running||!piece) { drawNext(); return; }
    // ghost
    let gy=piece.y; while(!collides(piece.shape,piece.x,gy+1)) gy++;
    bCtx.globalAlpha=0.15;
    piece.shape.forEach((row,r)=>row.forEach((v,c)=>{ if(v){bCtx.fillStyle=piece.color; bCtx.fillRect((piece.x+c)*cell+1,(gy+r)*cell+1,cell-2,cell-2);} }));
    bCtx.globalAlpha=1;
    // active piece
    bCtx.save(); bCtx.shadowColor=piece.color; bCtx.shadowBlur=8;
    piece.shape.forEach((row,r)=>row.forEach((v,c)=>{
      if(v) {
        bCtx.fillStyle=piece.color; bCtx.fillRect((piece.x+c)*cell+1,(piece.y+r)*cell+1,cell-2,cell-2);
        bCtx.fillStyle='rgba(255,255,255,.2)'; bCtx.fillRect((piece.x+c)*cell+1,(piece.y+r)*cell+1,cell-2,2);
      }
    }));
    bCtx.restore();
    drawNext();
  }

  function drawNext() {
    nCtx.fillStyle='#060c10'; nCtx.fillRect(0,0,nextEl.width,nextEl.height);
    if (!nextPiece) return;
    const ox=Math.floor((4-nextPiece.shape[0].length)/2);
    const oy=Math.floor((4-nextPiece.shape.length)/2);
    nextPiece.shape.forEach((row,r)=>row.forEach((v,c)=>{
      if(v){nCtx.fillStyle=nextPiece.color; nCtx.fillRect((ox+c)*cell+1,(oy+r)*cell+1,cell-2,cell-2);}
    }));
  }

  function endGame() {
    running=false;
    clearSave();
    olTitle.textContent='💀 Game Over';
    olMsg.textContent='⭐ Score: '+score.toLocaleString()+' · 🏆 Best: '+best.toLocaleString();
    btnStart.textContent='🔄 Play Again';
    overlay.style.display='flex';
  }

  function setPauseIcon(isPaused) {
    pauseSvg.innerHTML = isPaused
      ? '<path d="M4 2l9 6.5L4 15V2z" fill="currentColor"/>'
      : '<rect x="3" y="2" width="4" height="13" rx="1.5" fill="currentColor"/><rect x="10" y="2" width="4" height="13" rx="1.5" fill="currentColor"/>';
  }

  btnStart.addEventListener('click', () => { overlay.style.display='none'; init(); });
  document.getElementById('btn-new').addEventListener('click', () => { overlay.style.display='none'; init(); });
  btnPause.addEventListener('click', () => {
    if (!running) return;
    paused=!paused; setPauseIcon(paused);
    if (!paused) lastDrop=performance.now();
  });

  document.addEventListener('keydown', e => {
    if (!running||paused) return;
    if(e.key==='ArrowLeft'||e.key==='a'||e.key==='A')      { if(!collides(piece.shape,piece.x-1,piece.y))piece.x--; }
    else if(e.key==='ArrowRight'||e.key==='d'||e.key==='D'){ if(!collides(piece.shape,piece.x+1,piece.y))piece.x++; }
    else if(e.key==='ArrowDown'||e.key==='s'||e.key==='S') { if(!collides(piece.shape,piece.x,piece.y+1))piece.y++;else lock(); }
    else if(e.key==='ArrowUp'||e.key==='w'||e.key==='W')   { tryRotate(); }
    else if(e.key===' ')                                     { e.preventDefault(); hardDrop(); return; }
    else if(e.key==='p'||e.key==='P')                       { btnPause.click(); return; }
    else return;
    e.preventDefault();
  });

  document.getElementById('c-left').addEventListener('click',  ()=>{ if(running&&!paused&&!collides(piece.shape,piece.x-1,piece.y))piece.x--; });
  document.getElementById('c-right').addEventListener('click', ()=>{ if(running&&!paused&&!collides(piece.shape,piece.x+1,piece.y))piece.x++; });
  document.getElementById('c-down').addEventListener('click',  ()=>{ if(running&&!paused){if(!collides(piece.shape,piece.x,piece.y+1))piece.y++;else lock();} });
  document.getElementById('c-rot').addEventListener('click',   ()=>{ if(running&&!paused)tryRotate(); });
  document.getElementById('c-drop').addEventListener('click',  ()=>{ if(running&&!paused)hardDrop(); });

  let tx=0, ty=0;
  wrap.addEventListener('touchstart', e=>{ tx=e.touches[0].clientX; ty=e.touches[0].clientY; }, {passive:true});
  wrap.addEventListener('touchmove',  e=>e.preventDefault(), {passive:false});
  wrap.addEventListener('touchend',   e=>{
    if(!running||paused)return;
    const dx=e.changedTouches[0].clientX-tx, dy=e.changedTouches[0].clientY-ty;
    const adx=Math.abs(dx), ady=Math.abs(dy);
    if(Math.max(adx,ady)<14)return;
    if(adx>ady){ if(dx>0){if(!collides(piece.shape,piece.x+1,piece.y))piece.x++;}else{if(!collides(piece.shape,piece.x-1,piece.y))piece.x--;} }
    else if(dy>0) hardDrop(); else tryRotate();
  }, {passive:true});

  draw();

  /* ── CHECK FOR SAVED GAME ── */
  const existingSave = loadSave();
  if (existingSave) {
    document.getElementById('ol-title').textContent = '🧩 Resume?';
    document.getElementById('ol-msg').textContent   = '⭐ ' + (+existingSave.score).toLocaleString() + ' · 🚀 Lvl ' + existingSave.level;
    btnStart.textContent = '▶ Resume';

    const btnNew2 = document.createElement('button');
    btnNew2.className   = 'btn-play';
    btnNew2.style.cssText = 'background:rgba(255,255,255,.1);box-shadow:none;margin-top:4px;';
    btnNew2.textContent = '🔄 New Game';
    btnNew2.addEventListener('click', () => { clearSave(); overlay.style.display='none'; init(); });
    overlay.appendChild(btnNew2);

    btnStart.addEventListener('click', () => resumeGame(existingSave), { once: true });
  }

  document.addEventListener('visibilitychange', () => { if (document.hidden) saveGame(); });
  window.addEventListener('pagehide', saveGame);

})();
