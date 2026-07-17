// slicegames/games/wordle/game.js
(() => {
'use strict';

const SAVE_KEY = 'wordle-save';
const ROWS = 6, COLS = 5;

const WORDS = [
  'crane','slate','trace','blast','flame','graze','plumb','swift','quirk','vivid',
  'boxer','queen','crypt','kneel','flown','pixel','oxide','synth','glyph','fuzzy',
  'proxy','vapor','witch','extra','quest','jumpy','blaze','crisp','dwarf','epoch',
  'flair','gloom','hoist','irony','joust','karma','lapel','macro','naive','ozone',
  'piano','reign','scout','tacit','ultra','vigor','waltz','xenon','yacht','zesty',
  'abbey','baker','civic','depot','elite','finch','grove','hedge','inlet','joker',
  'knack','lemon','mayor','noble','olive','prank','quota','rivet','stomp','tidal',
  'umbra','verge','whole','yield','alpha','brisk','cedar','delta','ember','fudge',
  'grimy','humid','infer','jewel','lunar','mirth','niece','occur','plaza','robin',
  'snowy','taunt','venom','weave','yearn','bride','derby','envoy','frost','guile',
  'hasty','mourn','nifty','optic','plaid','rebut','sigma','thumb','vouch','wafer',
  'yodel','algae','brine','cloth','dowry','ensue','frond','gummy','hippo','ionic',
  'leafy','mulch','nudge','onset','prism','runic','smear','tower','viola','acorn',
  'birch','chalk','deter','elbow','freak','gusto','havoc','kebab','lyric','mocha',
  'nexus','ovoid','prowl','rugby','stint','tepid','vault','whelp','tiger','spade',
  'flute','globe','chess','plume','storm','brave','clown','drank','elegy','finny',
  'groan','ivory','jazzy','kinky','lusty','mango','nutty','orbit','quack','rhyme',
  'sunny','tapir','unzip','viper','expel','zilch','bless','candy','dandy','easel',
  'fable','gavel','haste','index','jelly','label','maple','noodle','pearl','quest',
  'raven','scone','thorn','umbra','vivid','witty','expat','zonal','adore','banjo',
];

/* ── DOM ── */
const gridEl   = document.getElementById('grid');
const kbEl     = document.getElementById('keyboard');
const msgBar   = document.getElementById('msg-bar');
const btnNext  = document.getElementById('btn-next');
const streakEl = document.getElementById('streak');

let cells = [], keyEls = {};
let word, curRow, curCol, guesses, done, streak;

/* ── SAVE / RESUME ── */
function saveGame() {
  if (done) { clearSave(); return; }
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({ word, curRow, curCol, guesses }));
  } catch (_) {}
}

function loadSave() {
  try { const r = localStorage.getItem(SAVE_KEY); return r ? JSON.parse(r) : null; }
  catch (_) { return null; }
}

function clearSave() { localStorage.removeItem(SAVE_KEY); }

/* ── STREAK ── */
function loadStreak() {
  streak = +localStorage.getItem('wordle-streak') || 0;
  streakEl.textContent = streak;
}

/* ── BUILD GRID ── */
function buildGrid() {
  gridEl.innerHTML = '';
  cells = [];
  for (let r = 0; r < ROWS; r++) {
    const rowEl = document.createElement('div');
    rowEl.className = 'row';
    const rowCells = [];
    for (let c = 0; c < COLS; c++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      rowEl.appendChild(cell);
      rowCells.push(cell);
    }
    gridEl.appendChild(rowEl);
    cells.push(rowCells);
  }
}

/* ── BUILD KEYBOARD ── */
const KB_LAYOUT = [
  ['Q','W','E','R','T','Y','U','I','O','P'],
  ['A','S','D','F','G','H','J','K','L'],
  ['ENTER','Z','X','C','V','B','N','M','⌫'],
];

function buildKeyboard() {
  kbEl.innerHTML = '';
  keyEls = {};
  KB_LAYOUT.forEach(row => {
    const div = document.createElement('div');
    div.className = 'kb-row';
    row.forEach(k => {
      const btn = document.createElement('button');
      btn.className = 'key' + (k==='ENTER'||k==='⌫' ? ' wide' : '');
      if (k === 'ENTER') {
        btn.innerHTML = `<svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M11 2v4a2 2 0 01-2 2H2M4.5 5.5L2 8l2.5 2.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg> OK`;
      } else if (k === '⌫') {
        btn.innerHTML = `<svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M4.5 1.5H11a1 1 0 011 1v8a1 1 0 01-1 1H4.5L1 6.5l3.5-5z" stroke="currentColor" stroke-width="1.4"/><path d="M8 4.5l-2.5 4M5.5 4.5L8 8.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>`;
      } else {
        btn.textContent = k;
      }
      btn.addEventListener('click', () => handleKey(k));
      div.appendChild(btn);
      keyEls[k] = btn;
    });
    kbEl.appendChild(div);
  });
}

/* ── NEW GAME ── */
function newGame() {
  clearSave();
  word    = WORDS[Math.floor(Math.random() * WORDS.length)].toUpperCase();
  curRow  = 0; curCol = 0;
  guesses = Array.from({ length:ROWS }, () => Array(COLS).fill(''));
  done    = false;
  btnNext.style.display = 'none';
  setMsg('');
  buildGrid();
  buildKeyboard();
}

/* ── RESUME SAVED GAME ── */
function resumeSaved(save) {
  word    = save.word.toUpperCase();
  curRow  = save.curRow;
  curCol  = save.curCol;
  guesses = save.guesses;
  done    = false;
  btnNext.style.display = 'none';
  buildGrid();
  buildKeyboard();

  // Re-render all committed rows
  for (let r = 0; r < curRow; r++) {
    const g      = guesses[r].join('');
    const result = scoreGuess(g, word);
    result.forEach((state, c) => {
      const cell = cells[r][c];
      cell.textContent = g[c];
      cell.classList.add('filled', state);
      colourKey(g[c], state);
    });
  }

  // Re-render current partial row
  for (let c = 0; c < curCol; c++) {
    cells[curRow][c].textContent = guesses[curRow][c];
    cells[curRow][c].classList.add('filled');
  }

  setMsg('▶ Game resumed! 🎯');
  setTimeout(() => setMsg(''), 2000);
}

/* ── KEY COLOUR HELPER ── */
function colourKey(letter, state) {
  const kEl = keyEls[letter];
  if (!kEl) return;
  if (state === 'correct') {
    kEl.className = 'key' + (kEl.classList.contains('wide') ? ' wide' : '') + ' correct';
  } else if (state === 'present' && !kEl.classList.contains('correct')) {
    kEl.classList.add('present');
  } else if (state === 'absent' && !kEl.classList.contains('correct') && !kEl.classList.contains('present')) {
    kEl.classList.add('absent');
  }
}

/* ── INPUT HANDLER ── */
function handleKey(k) {
  if (done) return;
  if (k === '⌫' || k === 'Backspace') {
    if (curCol > 0) {
      curCol--;
      guesses[curRow][curCol] = '';
      cells[curRow][curCol].textContent = '';
      cells[curRow][curCol].classList.remove('filled');
      saveGame();
    }
  } else if (k === 'ENTER') {
    if (curCol < COLS) { setMsg('✍️ Not enough letters!'); shakeRow(); return; }
    submitGuess();
  } else if (/^[A-Z]$/.test(k) && curCol < COLS) {
    guesses[curRow][curCol] = k;
    const cell = cells[curRow][curCol];
    cell.textContent = k;
    cell.classList.add('filled', 'pop');
    cell.addEventListener('animationend', () => cell.classList.remove('pop'), { once:true });
    curCol++;
    saveGame();
  }
}

function shakeRow() {
  cells[curRow].forEach(c => {
    c.classList.add('shake');
    c.addEventListener('animationend', () => c.classList.remove('shake'), { once:true });
  });
}

/* ── SUBMIT GUESS ── */
function submitGuess() {
  const guess  = guesses[curRow].join('');
  const result = scoreGuess(guess, word);
  const row    = curRow; // capture before async delay

  result.forEach((state, c) => {
    setTimeout(() => {
      const cell = cells[row][c];
      cell.classList.add('flip');
      cell.addEventListener('animationend', () => {
        cell.classList.remove('flip');
        cell.classList.add(state);
        colourKey(guess[c], state);
      }, { once:true });
    }, c * 120);
  });

  const delay = COLS * 120 + 250;
  setTimeout(() => {
    if (guess === word) {
      done = true;
      clearSave();
      streak++;
      localStorage.setItem('wordle-streak', streak);
      streakEl.textContent = streak;
      const msgs = ['🧠 Genius!','🔥 Brilliant!','🎉 Great!','👍 Nice!','😅 Phew!','🍀 Lucky!'];
      setMsg(msgs[row] || '✅ Correct!', '#4ade80');
      // Bounce winning row
      cells[row].forEach((cell, i) => {
        setTimeout(() => {
          cell.classList.add('bounce');
          cell.addEventListener('animationend', () => cell.classList.remove('bounce'), { once:true });
        }, i * 80);
      });
      btnNext.style.display = 'flex';
    } else if (row === ROWS - 1) {
      done = true;
      clearSave();
      streak = 0;
      localStorage.setItem('wordle-streak', 0);
      streakEl.textContent = 0;
      setMsg('😔 The word was ' + word, '#f87171');
      btnNext.style.display = 'flex';
    }
    curRow++;
    curCol = 0;
    if (!done) saveGame();
  }, delay);
}

/* ── SCORING (2-pass) ── */
function scoreGuess(guess, answer) {
  const result = Array(COLS).fill('absent');
  const pool   = [...answer];
  for (let i = 0; i < COLS; i++) {
    if (guess[i] === answer[i]) { result[i] = 'correct'; pool[i] = null; }
  }
  for (let i = 0; i < COLS; i++) {
    if (result[i] === 'correct') continue;
    const idx = pool.indexOf(guess[i]);
    if (idx !== -1) { result[i] = 'present'; pool[idx] = null; }
  }
  return result;
}

function setMsg(txt, color) {
  msgBar.textContent = txt;
  msgBar.style.color = color || '#38bdf8';
}

/* ── KEYBOARD ── */
document.addEventListener('keydown', e => {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  const k = e.key.toUpperCase();
  if      (k === 'BACKSPACE')      handleKey('⌫');
  else if (k === 'ENTER')          handleKey('ENTER');
  else if (/^[A-Z]$/.test(k))     handleKey(k);
});

/* ── BUTTONS ── */
document.getElementById('btn-new').addEventListener('click', newGame);
btnNext.addEventListener('click', newGame);

/* ── AUTO-SAVE ON HIDE ── */
document.addEventListener('visibilitychange', () => { if (document.hidden) saveGame(); });
window.addEventListener('pagehide', saveGame);

/* ── BOOT ── */
loadStreak();
const existingSave = loadSave();
if (existingSave && existingSave.word && WORDS.includes(existingSave.word.toLowerCase())) {
  resumeSaved(existingSave);
} else {
  newGame();
}

})();
