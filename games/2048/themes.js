// slicegames/games/2048/themes.js

const TileThemes = (() => {
'use strict';

/*
  Each theme defines:
  - label: display name
  - boardBg: board background colour
  - cellBg:  empty cell colour
  - bodyBg:  page body background
  - font: tile font-weight + family override (optional)
  - tiles: per-value {bg, fg, glow, icon, gradient, border, shadow}
    icon    = emoji shown BEHIND the number (large, low opacity)
    gradient= CSS gradient string for the tile background
    border  = border style
    shadow  = box-shadow (separate from glow)
  - emoji: true if tile label is replaced by emoji map
  - map: emoji map (if emoji:true)
  - boardStyle: extra CSS string applied to .board element
*/

const THEMES = {

  /* ── 1. PASTEL ──────────────────────────────────────────── */
  pastel: {
    label: 'Pastel 🌸',
    boardBg: '#d9cfc6',
    cellBg:  '#e8e0d8',
    bodyBg:  '#f7f3ef',
    tiles: {
      2:    { bg:'#f9d7e0', fg:'#5c3d45', icon:'🌸' },
      4:    { bg:'#ddd6f7', fg:'#3d3760', icon:'🌷' },
      8:    { bg:'#fddccc', fg:'#6b3a25', icon:'🍑' },
      16:   { bg:'#f4a08a', fg:'#5c2010', icon:'🌹' },
      32:   { bg:'#f2845a', fg:'#fff',    icon:'🍊' },
      64:   { bg:'#f5c842', fg:'#5c3d00', icon:'🌻' },
      128:  { bg:'#7ecba1', fg:'#fff',    icon:'🍀' },
      256:  { bg:'#6dbfea', fg:'#fff',    icon:'💧' },
      512:  { bg:'#9d74d4', fg:'#fff',    icon:'🔮' },
      1024: { bg:'#d4956a', fg:'#fff',    icon:'🏵️' },
      2048: { bg:'#f0c040', fg:'#fff',    icon:'⭐', glow:'rgba(240,192,64,.55)' },
      high: { bg:'#3a3028', fg:'#fff',    icon:'✨' },
    }
  },

  /* ── 2. NEON CITY ───────────────────────────────────────── */
  neon: {
    label: 'Neon City ⚡',
    boardBg: '#060612',
    cellBg:  '#0d0d22',
    bodyBg:  '#04040e',
    boardStyle: 'box-shadow:0 0 60px rgba(124,0,255,.3),0 0 120px rgba(0,255,200,.1);',
    tiles: {
      2:    { gradient:'linear-gradient(135deg,#0d0d1a,#1a0a2e)', fg:'#00ffcc', border:'1px solid #00ffcc44', shadow:'0 0 12px rgba(0,255,204,.4)', icon:'⚡' },
      4:    { gradient:'linear-gradient(135deg,#0d0d1a,#1a0a2e)', fg:'#ff00ff', border:'1px solid #ff00ff44', shadow:'0 0 12px rgba(255,0,255,.4)', icon:'💜' },
      8:    { gradient:'linear-gradient(135deg,#0d0d1a,#1a0a2e)', fg:'#ffff00', border:'1px solid #ffff0044', shadow:'0 0 12px rgba(255,255,0,.4)',  icon:'⚡' },
      16:   { gradient:'linear-gradient(135deg,#001a00,#003300)', fg:'#00ff44', border:'1px solid #00ff4444', shadow:'0 0 16px rgba(0,255,68,.5)',   icon:'🟢' },
      32:   { gradient:'linear-gradient(135deg,#1a0000,#330000)', fg:'#ff4444', border:'1px solid #ff444444', shadow:'0 0 16px rgba(255,68,68,.5)',  icon:'🔴' },
      64:   { gradient:'linear-gradient(135deg,#00001a,#000033)', fg:'#4488ff', border:'1px solid #4488ff44', shadow:'0 0 18px rgba(68,136,255,.5)', icon:'🔵' },
      128:  { gradient:'linear-gradient(135deg,#1a001a,#330033)', fg:'#ff44ff', border:'1px solid #ff44ff55', shadow:'0 0 20px rgba(255,68,255,.6)', icon:'💫' },
      256:  { gradient:'linear-gradient(135deg,#001a1a,#003333)', fg:'#44ffff', border:'1px solid #44ffff55', shadow:'0 0 20px rgba(68,255,255,.6)', icon:'💠' },
      512:  { gradient:'linear-gradient(135deg,#1a1a00,#333300)', fg:'#ffff44', border:'1px solid #ffff4455', shadow:'0 0 24px rgba(255,255,68,.7)', icon:'⭐' },
      1024: { gradient:'linear-gradient(135deg,#0d0d0d,#1a1a1a)', fg:'#ff8800', border:'1px solid #ff880066', shadow:'0 0 28px rgba(255,136,0,.75)', icon:'🔥' },
      2048: { gradient:'linear-gradient(135deg,#111,#222)',        fg:'#ffffff', border:'1px solid rgba(255,255,255,.5)', shadow:'0 0 40px rgba(255,255,255,.8)', glow:'rgba(255,255,255,.7)', icon:'👑' },
      high: { gradient:'linear-gradient(135deg,#000,#111)',        fg:'#ff00ff', border:'1px solid #ff00ff66', shadow:'0 0 32px rgba(255,0,255,.8)', icon:'🌀' },
    }
  },

  /* ── 3. RETRO ARCADE ────────────────────────────────────── */
  retro: {
    label: 'Retro Arcade 👾',
    boardBg: '#1a1200',
    cellBg:  '#221800',
    bodyBg:  '#100e00',
    font: '900 inherit "Press Start 2P", "Courier New", monospace',
    tiles: {
      2:    { bg:'#8b6914', fg:'#fff8d0', border:'3px solid #c8a020', shadow:'inset 0 -4px 0 rgba(0,0,0,.4)', icon:'👾' },
      4:    { bg:'#6b8b14', fg:'#f0ffd0', border:'3px solid #a0c820', shadow:'inset 0 -4px 0 rgba(0,0,0,.4)', icon:'🕹️' },
      8:    { bg:'#8b1414', fg:'#ffd0d0', border:'3px solid #c82020', shadow:'inset 0 -4px 0 rgba(0,0,0,.4)', icon:'💥' },
      16:   { bg:'#148b8b', fg:'#d0ffff', border:'3px solid #20c8c8', shadow:'inset 0 -4px 0 rgba(0,0,0,.4)', icon:'⚡' },
      32:   { bg:'#8b148b', fg:'#ffd0ff', border:'3px solid #c820c8', shadow:'inset 0 -4px 0 rgba(0,0,0,.4)', icon:'🌀' },
      64:   { bg:'#14148b', fg:'#d0d0ff', border:'3px solid #2020c8', shadow:'inset 0 -4px 0 rgba(0,0,0,.4)', icon:'🎮' },
      128:  { bg:'#c87820', fg:'#fff8d0', border:'3px solid #ffc840', shadow:'inset 0 -4px 0 rgba(0,0,0,.5)', glow:'rgba(255,200,64,.3)', icon:'🏆' },
      256:  { bg:'#20c820', fg:'#d0ffd0', border:'3px solid #40ff40', shadow:'inset 0 -4px 0 rgba(0,0,0,.5)', glow:'rgba(64,255,64,.35)', icon:'💚' },
      512:  { bg:'#c82020', fg:'#ffd0d0', border:'3px solid #ff4040', shadow:'inset 0 -4px 0 rgba(0,0,0,.5)', glow:'rgba(255,64,64,.35)', icon:'❤️' },
      1024: { bg:'#2020c8', fg:'#d0d0ff', border:'3px solid #4040ff', shadow:'inset 0 -4px 0 rgba(0,0,0,.5)', glow:'rgba(64,64,255,.4)', icon:'💙' },
      2048: { bg:'#c8c820', fg:'#fffff0', border:'4px solid #ffff40', shadow:'inset 0 -5px 0 rgba(0,0,0,.5)', glow:'rgba(255,255,64,.6)', icon:'👑' },
      high: { bg:'#c820c8', fg:'#ffe0ff', border:'4px solid #ff40ff', shadow:'inset 0 -5px 0 rgba(0,0,0,.5)', glow:'rgba(255,64,255,.6)', icon:'💎' },
    }
  },

  /* ── 4. DEEP OCEAN ──────────────────────────────────────── */
  ocean: {
    label: 'Deep Ocean 🌊',
    boardBg: '#003355',
    cellBg:  '#004466',
    bodyBg:  '#001a2e',
    boardStyle: 'box-shadow:0 8px 32px rgba(0,100,200,.4);',
    tiles: {
      2:    { gradient:'linear-gradient(135deg,#e0f4ff,#c8eeff)', fg:'#003355', icon:'🫧' },
      4:    { gradient:'linear-gradient(135deg,#b8e8ff,#96d8ff)', fg:'#002244', icon:'💧' },
      8:    { gradient:'linear-gradient(135deg,#80ccff,#5ab8ff)', fg:'#001833', icon:'🐬' },
      16:   { gradient:'linear-gradient(135deg,#44aaee,#2090dd)', fg:'#fff',    icon:'🐠', shadow:'0 4px 12px rgba(0,120,220,.4)' },
      32:   { gradient:'linear-gradient(135deg,#1188cc,#0066aa)', fg:'#fff',    icon:'🦈', shadow:'0 4px 16px rgba(0,100,180,.5)' },
      64:   { gradient:'linear-gradient(135deg,#0066aa,#004488)', fg:'#fff',    icon:'🐙', shadow:'0 4px 16px rgba(0,80,160,.5)' },
      128:  { gradient:'linear-gradient(135deg,#004488,#002266)', fg:'#aaddff', icon:'🦑', glow:'rgba(0,180,255,.4)', shadow:'0 0 20px rgba(0,150,255,.4)' },
      256:  { gradient:'linear-gradient(135deg,#003366,#001144)', fg:'#88ccff', icon:'🐳', glow:'rgba(0,200,255,.5)', shadow:'0 0 24px rgba(0,180,255,.5)' },
      512:  { gradient:'linear-gradient(135deg,#002244,#000e22)', fg:'#66bbff', icon:'🌊', glow:'rgba(0,220,255,.55)', shadow:'0 0 28px rgba(0,200,255,.55)' },
      1024: { gradient:'linear-gradient(135deg,#001133,#000819)', fg:'#44aaff', icon:'🔱', glow:'rgba(0,240,255,.6)', shadow:'0 0 32px rgba(0,220,255,.6)' },
      2048: { gradient:'linear-gradient(135deg,#000a1a,#000510)', fg:'#00eeff', icon:'🌟', glow:'rgba(0,255,255,.7)', shadow:'0 0 40px rgba(0,240,255,.7)' },
      high: { gradient:'linear-gradient(135deg,#00050f,#000208)', fg:'#00ccdd', icon:'🪸', glow:'rgba(0,255,220,.6)', shadow:'0 0 36px rgba(0,220,200,.6)' },
    }
  },

  /* ── 5. CANDY SHOP ──────────────────────────────────────── */
  candy: {
    label: 'Candy Shop 🍬',
    boardBg: '#ff99bb',
    cellBg:  '#ffaac8',
    bodyBg:  '#ffe0ee',
    boardStyle: 'box-shadow:0 8px 32px rgba(255,100,150,.35);border:3px solid rgba(255,255,255,.4);',
    tiles: {
      2:    { bg:'#ffb3c6', fg:'#6b0020', border:'2px solid rgba(255,255,255,.5)', icon:'🍬' },
      4:    { bg:'#ffc8a2', fg:'#6b2000', border:'2px solid rgba(255,255,255,.5)', icon:'🍭' },
      8:    { bg:'#ffe066', fg:'#5c3d00', border:'2px solid rgba(255,255,255,.5)', icon:'🍋' },
      16:   { bg:'#b5f5a0', fg:'#1a4400', border:'2px solid rgba(255,255,255,.5)', icon:'🍈' },
      32:   { bg:'#80e8ff', fg:'#003344', border:'2px solid rgba(255,255,255,.5)', icon:'🫐' },
      64:   { bg:'#c8a0ff', fg:'#2a0066', border:'2px solid rgba(255,255,255,.5)', icon:'🍇' },
      128:  { bg:'#ff80b0', fg:'#fff',    border:'2px solid rgba(255,255,255,.6)', shadow:'0 4px 14px rgba(255,80,140,.4)', icon:'🍓' },
      256:  { bg:'#ff6060', fg:'#fff',    border:'2px solid rgba(255,255,255,.6)', shadow:'0 4px 14px rgba(255,60,60,.4)',  icon:'🍒' },
      512:  { bg:'#ff9040', fg:'#fff',    border:'2px solid rgba(255,255,255,.6)', shadow:'0 4px 14px rgba(255,120,40,.4)', icon:'🍊' },
      1024: { bg:'#40cc80', fg:'#fff',    border:'2px solid rgba(255,255,255,.6)', shadow:'0 4px 14px rgba(40,200,100,.4)', icon:'🍀' },
      2048: { bg:'#ff40cc', fg:'#fff',    border:'3px solid rgba(255,255,255,.7)', glow:'rgba(255,64,204,.55)', shadow:'0 0 24px rgba(255,64,204,.55)', icon:'🌈' },
      high: { bg:'#cc0088', fg:'#fff',    border:'3px solid rgba(255,255,255,.7)', glow:'rgba(200,0,136,.6)', icon:'💎' },
    }
  },

  /* ── 6. EMOJI QUEST ─────────────────────────────────────── */
  emoji: {
    label: 'Emoji Quest 😄',
    emoji: true,
    map: { 2:'😊',4:'😎',8:'🤩',16:'😍',32:'🥳',64:'🔥',128:'💎',256:'🦄',512:'👑',1024:'🚀',2048:'🌟',high:'💀',billion:'🥳' },
    boardBg: '#1e1b2e',
    cellBg:  '#2a2640',
    bodyBg:  '#14121e',
    tiles: {
      2:    { gradient:'linear-gradient(135deg,#fff9c4,#ffef80)', fg:'#5c4a00', shadow:'0 2px 8px rgba(255,220,0,.2)' },
      4:    { gradient:'linear-gradient(135deg,#ffe0b2,#ffcc7a)', fg:'#5c2e00', shadow:'0 2px 8px rgba(255,160,0,.25)' },
      8:    { gradient:'linear-gradient(135deg,#ffccbc,#ff9a7a)', fg:'#5c1a00', shadow:'0 2px 8px rgba(255,120,80,.25)' },
      16:   { gradient:'linear-gradient(135deg,#f8bbd0,#f48fb1)', fg:'#5c0022', shadow:'0 2px 8px rgba(255,80,120,.3)' },
      32:   { gradient:'linear-gradient(135deg,#e1bee7,#ba88c8)', fg:'#3a0050', shadow:'0 2px 8px rgba(180,80,220,.3)' },
      64:   { gradient:'linear-gradient(135deg,#bbdefb,#7ab8f5)', fg:'#002255', shadow:'0 2px 8px rgba(80,140,255,.3)' },
      128:  { gradient:'linear-gradient(135deg,#b2dfdb,#70c4bc)', fg:'#00332b', glow:'rgba(80,220,200,.35)', shadow:'0 0 16px rgba(80,220,200,.35)' },
      256:  { gradient:'linear-gradient(135deg,#dcedc8,#aed581)', fg:'#1a3300', glow:'rgba(160,220,80,.35)', shadow:'0 0 18px rgba(160,220,80,.35)' },
      512:  { gradient:'linear-gradient(135deg,#fff176,#ffd740)', fg:'#3a3000', glow:'rgba(255,215,0,.45)', shadow:'0 0 20px rgba(255,215,0,.45)' },
      1024: { gradient:'linear-gradient(135deg,#ffcc80,#ffa020)', fg:'#3a1a00', glow:'rgba(255,160,0,.5)', shadow:'0 0 24px rgba(255,160,0,.5)' },
      2048: { gradient:'linear-gradient(135deg,#ffe57f,#ffc400)', fg:'#3a2800', glow:'rgba(255,196,0,.6)', shadow:'0 0 32px rgba(255,196,0,.6)' },
      high: { gradient:'linear-gradient(135deg,#212121,#424242)', fg:'#fff',    glow:'rgba(255,255,255,.4)', shadow:'0 0 28px rgba(255,255,255,.4)' },
    }
  },

  /* ── 7. LOVE & HEARTS ───────────────────────────────────── */
  love: {
    label: 'Love 💕',
    boardBg: '#c2185b',
    cellBg:  '#d81b60',
    bodyBg:  '#880e4f',
    boardStyle: 'box-shadow:0 8px 32px rgba(200,0,80,.5);',
    tiles: {
      2:    { bg:'#fce4ec', fg:'#880033', icon:'🤍', border:'2px solid rgba(255,150,180,.3)' },
      4:    { bg:'#f8bbd0', fg:'#880033', icon:'💗', border:'2px solid rgba(255,120,160,.3)' },
      8:    { bg:'#f48fb1', fg:'#fff',    icon:'💕', shadow:'0 3px 10px rgba(255,80,130,.3)' },
      16:   { bg:'#f06292', fg:'#fff',    icon:'💞', shadow:'0 3px 10px rgba(240,80,120,.35)' },
      32:   { bg:'#e91e63', fg:'#fff',    icon:'❤️', shadow:'0 4px 14px rgba(233,30,99,.4)' },
      64:   { bg:'#c2185b', fg:'#ffd6e7', icon:'💘', shadow:'0 4px 14px rgba(194,24,91,.4)', glow:'rgba(233,30,99,.3)' },
      128:  { bg:'#ad1457', fg:'#ffd6e7', icon:'💝', shadow:'0 4px 16px rgba(173,20,87,.45)', glow:'rgba(194,24,91,.4)' },
      256:  { bg:'#880e4f', fg:'#ffb3d1', icon:'💖', shadow:'0 0 20px rgba(136,14,79,.5)',    glow:'rgba(173,20,87,.45)' },
      512:  { bg:'#6a0036', fg:'#ffb3d1', icon:'💗', shadow:'0 0 24px rgba(106,0,54,.55)',   glow:'rgba(136,14,79,.5)' },
      1024: { bg:'#4a0028', fg:'#ff80ab', icon:'💓', shadow:'0 0 28px rgba(233,30,99,.6)',   glow:'rgba(173,20,87,.55)' },
      2048: { bg:'#ff4081', fg:'#fff',    icon:'💘', glow:'rgba(255,64,129,.7)', shadow:'0 0 36px rgba(255,64,129,.7)' },
      high: { bg:'#1a000e', fg:'#ff80ab', icon:'♾️', glow:'rgba(255,64,129,.6)' },
    }
  },

  /* ── 8. JUNGLE SAFARI ───────────────────────────────────── */
  jungle: {
    label: 'Jungle 🌿',
    boardBg: '#1b4a1b',
    cellBg:  '#1e5c1e',
    bodyBg:  '#0a2a0a',
    boardStyle: 'box-shadow:0 8px 32px rgba(0,100,0,.5);',
    tiles: {
      2:    { bg:'#f1f8e9', fg:'#1b4a00', icon:'🌱', border:'2px solid rgba(100,200,100,.2)' },
      4:    { bg:'#dcedc8', fg:'#1b4a00', icon:'🍃', border:'2px solid rgba(100,200,100,.2)' },
      8:    { bg:'#aed581', fg:'#1b3a00', icon:'🌿', shadow:'0 3px 10px rgba(100,200,50,.25)' },
      16:   { bg:'#8bc34a', fg:'#fff',    icon:'🦎', shadow:'0 3px 10px rgba(120,200,60,.3)' },
      32:   { bg:'#689f38', fg:'#fff',    icon:'🐍', shadow:'0 4px 14px rgba(80,160,40,.35)' },
      64:   { bg:'#558b2f', fg:'#f0ffe0', icon:'🦜', shadow:'0 4px 14px rgba(60,140,30,.4)', glow:'rgba(100,200,50,.25)' },
      128:  { bg:'#33691e', fg:'#ccff90', icon:'🐊', shadow:'0 0 18px rgba(50,120,20,.4)', glow:'rgba(80,200,40,.3)' },
      256:  { bg:'#795548', fg:'#ffe0cc', icon:'🦁', shadow:'0 0 20px rgba(120,80,40,.4)', glow:'rgba(160,100,60,.3)' },
      512:  { bg:'#5d4037', fg:'#ffd0b0', icon:'🐘', shadow:'0 0 24px rgba(100,60,30,.5)',  glow:'rgba(140,80,40,.35)' },
      1024: { bg:'#4e342e', fg:'#ffcc80', icon:'🦅', shadow:'0 0 28px rgba(80,50,30,.55)', glow:'rgba(200,140,80,.4)' },
      2048: { bg:'#ffd600', fg:'#1b3a00', icon:'🌞', glow:'rgba(255,220,0,.6)', shadow:'0 0 36px rgba(255,220,0,.6)' },
      high: { bg:'#1b2a00', fg:'#b9f6ca', icon:'🌳', glow:'rgba(100,255,120,.4)', shadow:'0 0 28px rgba(80,220,100,.4)' },
    }
  },

};

/* ── Engine ─────────────────────────────────────────────── */
const THEME_NAMES = Object.keys(THEMES);
let current = localStorage.getItem('2048-tile-theme') || 'pastel';
if (!THEMES[current]) current = 'pastel';

const styleEl = document.createElement('style');
styleEl.id = 'tile-theme-style';
document.head.appendChild(styleEl);

function apply(name) {
  current = THEMES[name] ? name : 'pastel';
  localStorage.setItem('2048-tile-theme', current);
  document.documentElement.setAttribute('data-tile-theme', current);

  const theme = THEMES[current];
  const t     = theme.tiles;

  // Override board / body colours
  const html  = document.documentElement;
  const board = document.getElementById('board');
  if (theme.bodyBg)  document.body.style.background = theme.bodyBg;
  if (theme.boardBg && board) board.style.background = theme.boardBg;
  if (theme.cellBg) {
    document.querySelectorAll('.cell').forEach(c => c.style.background = theme.cellBg);
  }
  if (theme.boardStyle && board) board.style.cssText += ';' + theme.boardStyle;

  // Generate CSS rules for each tile value
  let rules = '';
  Object.entries(t).forEach(([val, def]) => {
    const cls = val === 'high' ? '.t-high' : `.t${val}`;
    let bg = def.gradient ? def.gradient : `background:${def.bg}`;
    let rule = `${cls}{`;
    rule += def.gradient ? `background:${def.gradient};` : `background:${def.bg};`;
    rule += `color:${def.fg};`;
    if (def.border)  rule += `border:${def.border};`;
    if (def.shadow)  rule += `box-shadow:${def.shadow};`;
    if (def.glow)    rule += `box-shadow:0 0 22px 4px ${def.glow}${def.shadow ? ',' + def.shadow : ''};`;
    rule += `}`;
    rules += rule + '\n';

    // Icon pseudo-element (shows large emoji behind number)
    if (def.icon) {
      rules += `${cls}::before{content:'${def.icon}';position:absolute;font-size:1.8em;opacity:.18;pointer-events:none;z-index:0;}\n`;
    }
  });

  // Extended high tiles (4096+) — darken progressively from the 2048 colour
  const base = t[2048] || { bg:'#f0c040', fg:'#fff' };
  for (let i = 0; i < 30; i++) {
    const pct = Math.round((1 - Math.min(i/15,1)*0.75)*100);
    const shadow = i > 8
      ? `box-shadow:0 0 ${16+i*2}px ${4+i}px color-mix(in srgb,${base.bg||'#f0c040'} 55%,#000);`
      : '';
    rules += `.t-high-${i+1}{${base.gradient?`background:${base.gradient};`:`background:color-mix(in srgb,${base.bg||'#f0c040'} ${pct}%,#000);`}color:#fff;${shadow}}\n`;
  }

  // Tile position:relative so ::before icon works
  rules += `.tile{position:relative;overflow:hidden;}\n`;
  rules += `.tile>*{position:relative;z-index:1;}\n`;

  styleEl.textContent = rules;

  // Emoji theme toggle
  const isEmoji = !!theme.emoji;
  document.documentElement.setAttribute('data-emoji-theme', isEmoji ? 'true' : 'false');
  window._tileEmojiMap = isEmoji ? theme.map : null;
}

function getThemes()  { return THEMES; }
function getCurrent() { return current; }
function getNames()   { return THEME_NAMES; }

apply(current);
return { apply, getThemes, getCurrent, getNames };

})();
