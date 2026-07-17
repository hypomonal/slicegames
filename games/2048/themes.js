// slicegames/games/2048/themes.js

const TileThemes = (() => {
'use strict';

/*
  Every theme changes ALL of these:
  - Body background
  - Board background + border + shadow
  - Cell shape (border-radius) + background
  - Tile border-radius (cell shape feel)
  - Font family on tiles
  - Per-tile: gradient, text colour, large bg icon, border, glow, shadow
  - A CSS pattern overlay on the board (SVG background)
*/

const THEMES = {

  /* ══════════════════════════════════════════════════════════
     1. NATURE 🌿
     Feel: You're playing in a forest. Wooden board, leaf cells,
     mossy greens, bark browns. Tiles are leaves getting darker.
  ══════════════════════════════════════════════════════════ */
  nature: {
    label: 'Nature 🌿',
    body: {
      background: 'linear-gradient(160deg,#0a1f0a 0%,#0d2b0d 50%,#0a1a0a 100%)',
    },
    board: {
      background: '#2d1a0e',
      borderRadius: '16px',
      border: '3px solid #5c3a1a',
      boxShadow: '0 8px 40px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,200,100,.1)',
      // Wood grain SVG pattern
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='rgba(120,60,10,0.15)' stroke-width='1'%3E%3Cpath d='M0 30 Q30 25 60 30'/%3E%3Cpath d='M0 10 Q30 5 60 10'/%3E%3Cpath d='M0 50 Q30 45 60 50'/%3E%3C/g%3E%3C/svg%3E")`,
    },
    cell: {
      background: '#1a3a0a',
      borderRadius: '50% 20% 50% 20%', // leaf shape!
      border: '1px solid rgba(100,200,50,.15)',
    },
    tile: {
      borderRadius: '50% 20% 50% 20%', // matching leaf shape
      fontFamily: 'Georgia, serif',
      fontWeight: '900',
    },
    tiles: {
      2:    { gradient:'linear-gradient(135deg,#c8e6c9,#a5d6a7)', fg:'#1b5e20', icon:'🌱', shadow:'0 4px 8px rgba(0,100,0,.3)', border:'1px solid rgba(150,220,100,.4)' },
      4:    { gradient:'linear-gradient(135deg,#a5d6a7,#81c784)', fg:'#1b5e20', icon:'🍀', shadow:'0 4px 8px rgba(0,100,0,.3)', border:'1px solid rgba(130,200,80,.4)' },
      8:    { gradient:'linear-gradient(135deg,#66bb6a,#4caf50)', fg:'#fff',    icon:'🌿', shadow:'0 4px 12px rgba(0,120,0,.4)', border:'1px solid rgba(100,180,60,.4)' },
      16:   { gradient:'linear-gradient(135deg,#4caf50,#388e3c)', fg:'#fff',    icon:'🍃', shadow:'0 4px 14px rgba(0,130,0,.45)', border:'1px solid rgba(80,160,40,.5)' },
      32:   { gradient:'linear-gradient(135deg,#8d6e63,#6d4c41)', fg:'#fff',    icon:'🍂', shadow:'0 4px 16px rgba(80,40,0,.5)',  border:'1px solid rgba(140,90,40,.4)' },
      64:   { gradient:'linear-gradient(135deg,#a1887f,#795548)', fg:'#fff',    icon:'🍁', shadow:'0 4px 18px rgba(100,50,0,.5)', border:'1px solid rgba(160,110,60,.4)', glow:'rgba(160,100,50,.3)' },
      128:  { gradient:'linear-gradient(135deg,#ff8a65,#ff7043)', fg:'#fff',    icon:'🦊', shadow:'0 0 20px rgba(255,100,50,.5)', glow:'rgba(255,100,50,.4)' },
      256:  { gradient:'linear-gradient(135deg,#ff7043,#f4511e)', fg:'#fff',    icon:'🌺', shadow:'0 0 24px rgba(255,80,30,.55)', glow:'rgba(255,80,30,.45)' },
      512:  { gradient:'linear-gradient(135deg,#ef5350,#e53935)', fg:'#fff',    icon:'🦅', shadow:'0 0 28px rgba(240,50,40,.6)',  glow:'rgba(240,50,40,.5)' },
      1024: { gradient:'linear-gradient(135deg,#ffd54f,#ffca28)', fg:'#3e2700', icon:'🌟', shadow:'0 0 32px rgba(255,210,0,.65)', glow:'rgba(255,200,0,.6)' },
      2048: { gradient:'linear-gradient(135deg,#fff176,#ffee58)', fg:'#1a1000', icon:'🌳', shadow:'0 0 40px rgba(255,230,0,.8)',  glow:'rgba(255,230,0,.75)' },
      high: { gradient:'linear-gradient(135deg,#ffffff,#e0e0e0)', fg:'#1b2a00', icon:'🏔️', shadow:'0 0 36px rgba(255,255,255,.6)', glow:'rgba(255,255,255,.5)' },
    }
  },

  /* ══════════════════════════════════════════════════════════
     2. NEON CITY ⚡
     Feel: Cyberpunk arcade at 2am. Pure black board, electric
     borders, each tile pulses a different neon colour.
  ══════════════════════════════════════════════════════════ */
  neon: {
    label: 'Neon City ⚡',
    body: { background: '#000005' },
    board: {
      background: '#050510',
      borderRadius: '8px',
      border: '1px solid rgba(100,0,255,.4)',
      boxShadow: '0 0 60px rgba(100,0,255,.3), 0 0 120px rgba(0,200,255,.1), inset 0 0 40px rgba(0,0,20,.8)',
    },
    cell: {
      background: 'rgba(255,255,255,.025)',
      borderRadius: '4px',
      border: '1px solid rgba(255,255,255,.06)',
    },
    tile: {
      borderRadius: '4px',
      fontFamily: '"Courier New", monospace',
      fontWeight: '900',
    },
    tiles: {
      2:    { gradient:'linear-gradient(135deg,#050510,#0a0520)', fg:'#00ffcc', border:'1.5px solid #00ffcc', shadow:'0 0 16px rgba(0,255,204,.6), inset 0 0 8px rgba(0,255,204,.1)', icon:'⚡' },
      4:    { gradient:'linear-gradient(135deg,#050510,#0a0520)', fg:'#ff00ff', border:'1.5px solid #ff00ff', shadow:'0 0 16px rgba(255,0,255,.6), inset 0 0 8px rgba(255,0,255,.1)', icon:'💜' },
      8:    { gradient:'linear-gradient(135deg,#050510,#0a0520)', fg:'#ffff00', border:'1.5px solid #ffff00', shadow:'0 0 16px rgba(255,255,0,.6), inset 0 0 8px rgba(255,255,0,.1)', icon:'⚡' },
      16:   { gradient:'linear-gradient(135deg,#000d00,#001500)', fg:'#00ff44', border:'1.5px solid #00ff44', shadow:'0 0 20px rgba(0,255,68,.7), inset 0 0 10px rgba(0,255,68,.12)', icon:'🟢' },
      32:   { gradient:'linear-gradient(135deg,#0d0000,#150000)', fg:'#ff4444', border:'1.5px solid #ff4444', shadow:'0 0 20px rgba(255,68,68,.7), inset 0 0 10px rgba(255,68,68,.12)', icon:'🔴' },
      64:   { gradient:'linear-gradient(135deg,#00000d,#000015)', fg:'#4488ff', border:'1.5px solid #4488ff', shadow:'0 0 22px rgba(68,136,255,.75), inset 0 0 12px rgba(68,136,255,.12)', icon:'🔵' },
      128:  { gradient:'linear-gradient(135deg,#0d000d,#150015)', fg:'#ff44ff', border:'2px solid #ff44ff', shadow:'0 0 26px rgba(255,68,255,.8), inset 0 0 14px rgba(255,68,255,.14)', glow:'rgba(255,68,255,.6)', icon:'💫' },
      256:  { gradient:'linear-gradient(135deg,#000d0d,#001515)', fg:'#44ffff', border:'2px solid #44ffff', shadow:'0 0 28px rgba(68,255,255,.85), inset 0 0 14px rgba(68,255,255,.14)', glow:'rgba(68,255,255,.65)', icon:'💠' },
      512:  { gradient:'linear-gradient(135deg,#0d0d00,#151500)', fg:'#ffff44', border:'2px solid #ffff44', shadow:'0 0 30px rgba(255,255,68,.88), inset 0 0 16px rgba(255,255,68,.15)', glow:'rgba(255,255,68,.7)', icon:'⭐' },
      1024: { gradient:'linear-gradient(135deg,#0a0500,#140a00)', fg:'#ff8800', border:'2.5px solid #ff8800', shadow:'0 0 36px rgba(255,136,0,.9), inset 0 0 18px rgba(255,136,0,.18)', glow:'rgba(255,136,0,.75)', icon:'🔥' },
      2048: { gradient:'linear-gradient(135deg,#0a0a0a,#141414)', fg:'#ffffff', border:'2.5px solid rgba(255,255,255,.9)', shadow:'0 0 50px rgba(255,255,255,.95), inset 0 0 24px rgba(255,255,255,.2)', glow:'rgba(255,255,255,.85)', icon:'👑' },
      high: { gradient:'linear-gradient(135deg,#050005,#0a000a)', fg:'#ff00ff', border:'3px solid #ff00ff', shadow:'0 0 44px rgba(255,0,255,.9), inset 0 0 20px rgba(255,0,255,.2)', glow:'rgba(255,0,255,.8)', icon:'🌀' },
    }
  },

  /* ══════════════════════════════════════════════════════════
     3. RETRO ARCADE 👾
     Feel: 1980s CRT arcade. Scanlines on board, pixel tiles,
     3D press-in buttons, chiptune palette.
  ══════════════════════════════════════════════════════════ */
  retro: {
    label: 'Retro Arcade 👾',
    body: { background: '#0a0800' },
    board: {
      background: '#1a1200',
      borderRadius: '4px',
      border: '4px solid #3a2800',
      boxShadow: '0 0 0 2px #5a3800, 6px 6px 0 #000, inset 0 0 80px rgba(0,0,0,.5)',
      // CRT scanline pattern
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='4' height='4' viewBox='0 0 4 4' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='0' y='0' width='4' height='2' fill='rgba(0,0,0,0.15)'/%3E%3C/svg%3E")`,
    },
    cell: {
      background: '#221800',
      borderRadius: '2px',
      border: '2px solid #3a2800',
    },
    tile: {
      borderRadius: '2px',
      fontFamily: '"Courier New", "Lucida Console", monospace',
      fontWeight: '900',
    },
    tiles: {
      2:    { bg:'#c8a020', fg:'#000800', border:'3px solid #e8c040', shadow:'inset 0 -5px 0 rgba(0,0,0,.5), inset 0 2px 0 rgba(255,255,255,.2)', icon:'👾' },
      4:    { bg:'#20c820', fg:'#000800', border:'3px solid #40e840', shadow:'inset 0 -5px 0 rgba(0,0,0,.5), inset 0 2px 0 rgba(255,255,255,.2)', icon:'🕹️' },
      8:    { bg:'#c82020', fg:'#fff',    border:'3px solid #e84040', shadow:'inset 0 -5px 0 rgba(0,0,0,.5), inset 0 2px 0 rgba(255,255,255,.15)', icon:'💥' },
      16:   { bg:'#2020c8', fg:'#fff',    border:'3px solid #4040e8', shadow:'inset 0 -5px 0 rgba(0,0,0,.5), inset 0 2px 0 rgba(255,255,255,.15)', icon:'⚡' },
      32:   { bg:'#c820c8', fg:'#fff',    border:'3px solid #e840e8', shadow:'inset 0 -5px 0 rgba(0,0,0,.5), inset 0 2px 0 rgba(255,255,255,.15)', icon:'🌀' },
      64:   { bg:'#20c8c8', fg:'#000800', border:'3px solid #40e8e8', shadow:'inset 0 -5px 0 rgba(0,0,0,.5), inset 0 2px 0 rgba(255,255,255,.2)', icon:'🎮', glow:'rgba(40,200,200,.25)' },
      128:  { bg:'#e8a020', fg:'#000',    border:'3px solid #ffc840', shadow:'inset 0 -6px 0 rgba(0,0,0,.55), inset 0 2px 0 rgba(255,255,255,.25)', glow:'rgba(255,200,40,.35)', icon:'🏆' },
      256:  { bg:'#e84040', fg:'#fff',    border:'3px solid #ff6060', shadow:'inset 0 -6px 0 rgba(0,0,0,.55), inset 0 2px 0 rgba(255,255,255,.2)',  glow:'rgba(255,60,60,.4)', icon:'❤️' },
      512:  { bg:'#4040e8', fg:'#fff',    border:'3px solid #6060ff', shadow:'inset 0 -6px 0 rgba(0,0,0,.55), inset 0 2px 0 rgba(255,255,255,.2)',  glow:'rgba(60,60,255,.4)', icon:'💙' },
      1024: { bg:'#40e840', fg:'#001800', border:'4px solid #60ff60', shadow:'inset 0 -7px 0 rgba(0,0,0,.6), inset 0 2px 0 rgba(255,255,255,.25)',  glow:'rgba(60,255,60,.5)', icon:'💚' },
      2048: { bg:'#e8e820', fg:'#080800', border:'4px solid #ffff40', shadow:'inset 0 -7px 0 rgba(0,0,0,.6), inset 0 3px 0 rgba(255,255,255,.3)',   glow:'rgba(255,255,40,.65)', icon:'👑' },
      high: { bg:'#e820e8', fg:'#fff',    border:'4px solid #ff40ff', shadow:'inset 0 -7px 0 rgba(0,0,0,.6), inset 0 3px 0 rgba(255,255,255,.25)',  glow:'rgba(255,40,255,.65)', icon:'💎' },
    }
  },

  /* ══════════════════════════════════════════════════════════
     4. DEEP OCEAN 🌊
     Feel: Underwater. Dark blue-black water, ripple pattern,
     bioluminescent glowing tiles, sea creatures on each tile.
  ══════════════════════════════════════════════════════════ */
  ocean: {
    label: 'Deep Ocean 🌊',
    body: { background: 'linear-gradient(180deg,#000e1a 0%,#001525 60%,#000a14 100%)' },
    board: {
      background: '#001525',
      borderRadius: '20px',
      border: '2px solid rgba(0,100,200,.3)',
      boxShadow: '0 12px 48px rgba(0,50,150,.5), inset 0 0 60px rgba(0,20,60,.6)',
      // Ripple / bubble pattern
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='40' cy='40' r='30' fill='none' stroke='rgba(0,100,200,0.06)' stroke-width='1'/%3E%3Ccircle cx='40' cy='40' r='18' fill='none' stroke='rgba(0,150,255,0.04)' stroke-width='1'/%3E%3C/svg%3E")`,
    },
    cell: {
      background: 'rgba(0,80,160,.15)',
      borderRadius: '50%', // bubble cells!
      border: '1px solid rgba(0,150,255,.12)',
    },
    tile: {
      borderRadius: '50%', // bubble tiles!
      fontFamily: 'Nunito, sans-serif',
      fontWeight: '900',
    },
    tiles: {
      2:    { gradient:'linear-gradient(135deg,#e0f4ff,#b8e8ff)', fg:'#003355', shadow:'0 4px 12px rgba(0,80,160,.3)', border:'2px solid rgba(100,180,255,.4)', icon:'🫧' },
      4:    { gradient:'linear-gradient(135deg,#b8e8ff,#80ccff)', fg:'#002244', shadow:'0 4px 12px rgba(0,80,180,.35)', border:'2px solid rgba(80,160,255,.4)', icon:'💧' },
      8:    { gradient:'linear-gradient(135deg,#60b8ff,#3498db)', fg:'#fff',    shadow:'0 4px 14px rgba(0,100,220,.4)', border:'2px solid rgba(60,150,255,.45)', icon:'🐟' },
      16:   { gradient:'linear-gradient(135deg,#2980b9,#1a6fa0)', fg:'#fff',    shadow:'0 6px 18px rgba(0,100,200,.5)', border:'2px solid rgba(40,130,220,.5)', icon:'🐬', glow:'rgba(0,150,255,.25)' },
      32:   { gradient:'linear-gradient(135deg,#1a6fa0,#0d5080)', fg:'#fff',    shadow:'0 6px 20px rgba(0,80,160,.55)', border:'2px solid rgba(20,110,200,.5)', icon:'🦈', glow:'rgba(0,130,255,.3)' },
      64:   { gradient:'linear-gradient(135deg,#0d5080,#083860)', fg:'#aaddff', shadow:'0 0 22px rgba(0,100,200,.6)',   border:'2px solid rgba(0,100,200,.55)', icon:'🐙', glow:'rgba(0,120,220,.4)' },
      128:  { gradient:'linear-gradient(135deg,#083860,#042040)', fg:'#88ccff', shadow:'0 0 26px rgba(0,150,255,.65)', border:'2px solid rgba(0,120,220,.6)', glow:'rgba(0,150,255,.5)', icon:'🦑' },
      256:  { gradient:'linear-gradient(135deg,#042040,#021428)', fg:'#66bbff', shadow:'0 0 30px rgba(0,180,255,.7)',  border:'2px solid rgba(0,150,240,.65)', glow:'rgba(0,180,255,.55)', icon:'🐳' },
      512:  { gradient:'linear-gradient(135deg,#021428,#010a18)', fg:'#44aaff', shadow:'0 0 34px rgba(0,200,255,.75)', border:'2px solid rgba(0,180,255,.7)', glow:'rgba(0,200,255,.6)', icon:'🔱' },
      1024: { gradient:'linear-gradient(135deg,#000e20,#000510)', fg:'#00ccff', shadow:'0 0 38px rgba(0,220,255,.8)',  border:'2px solid rgba(0,210,255,.75)', glow:'rgba(0,220,255,.7)', icon:'🌊' },
      2048: { gradient:'linear-gradient(135deg,#00ccff,#0088cc)', fg:'#fff',    shadow:'0 0 50px rgba(0,240,255,.9)',  border:'3px solid rgba(0,240,255,.9)', glow:'rgba(0,240,255,.85)', icon:'🌟' },
      high: { gradient:'linear-gradient(135deg,#001428,#000a18)', fg:'#00eeff', shadow:'0 0 44px rgba(0,255,240,.8)',  border:'3px solid rgba(0,255,230,.8)', glow:'rgba(0,255,220,.75)', icon:'🪸' },
    }
  },

  /* ══════════════════════════════════════════════════════════
     5. CANDY SHOP 🍬
     Feel: Inside a sweet shop. Pink/white board, round tiles
     like sweets, pastel rainbow progression.
  ══════════════════════════════════════════════════════════ */
  candy: {
    label: 'Candy Shop 🍬',
    body: { background: 'linear-gradient(160deg,#ff80aa 0%,#ffaacc 50%,#ff80aa 100%)' },
    board: {
      background: 'rgba(255,255,255,.85)',
      borderRadius: '24px',
      border: '3px solid rgba(255,150,200,.6)',
      boxShadow: '0 8px 32px rgba(255,100,150,.4), inset 0 2px 0 rgba(255,255,255,.9)',
      // Candy stripe pattern
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='0' y='0' width='10' height='20' fill='rgba(255,150,200,0.07)'/%3E%3C/svg%3E")`,
    },
    cell: {
      background: 'rgba(255,200,220,.3)',
      borderRadius: '50%',
      border: '2px solid rgba(255,150,200,.3)',
    },
    tile: {
      borderRadius: '50%',
      fontFamily: 'Nunito, sans-serif',
      fontWeight: '900',
    },
    tiles: {
      2:    { gradient:'linear-gradient(135deg,#ffb3c6,#ff8fab)', fg:'#6b0020', border:'2px solid rgba(255,255,255,.7)', shadow:'0 4px 10px rgba(255,100,150,.25)', icon:'🍬' },
      4:    { gradient:'linear-gradient(135deg,#ffc8a2,#ffab76)', fg:'#6b2000', border:'2px solid rgba(255,255,255,.7)', shadow:'0 4px 10px rgba(255,150,100,.25)', icon:'🍭' },
      8:    { gradient:'linear-gradient(135deg,#ffe066,#ffd23f)', fg:'#5c3d00', border:'2px solid rgba(255,255,255,.7)', shadow:'0 4px 10px rgba(255,200,50,.3)',  icon:'🍋' },
      16:   { gradient:'linear-gradient(135deg,#b5f5a0,#85e868)', fg:'#1a4400', border:'2px solid rgba(255,255,255,.7)', shadow:'0 4px 10px rgba(100,220,50,.3)',  icon:'🍈' },
      32:   { gradient:'linear-gradient(135deg,#80e8ff,#50d4f0)', fg:'#003344', border:'2px solid rgba(255,255,255,.7)', shadow:'0 4px 10px rgba(50,200,240,.3)',  icon:'🫐' },
      64:   { gradient:'linear-gradient(135deg,#c8a0ff,#aa70ff)', fg:'#2a0066', border:'2px solid rgba(255,255,255,.7)', shadow:'0 4px 10px rgba(160,80,255,.3)',  icon:'🍇', glow:'rgba(180,100,255,.2)' },
      128:  { gradient:'linear-gradient(135deg,#ff80b0,#ff5090)', fg:'#fff',    border:'2px solid rgba(255,255,255,.8)', shadow:'0 4px 14px rgba(255,60,140,.4)', glow:'rgba(255,80,160,.35)', icon:'🍓' },
      256:  { gradient:'linear-gradient(135deg,#ff6060,#f03030)', fg:'#fff',    border:'2px solid rgba(255,255,255,.8)', shadow:'0 0 18px rgba(255,60,60,.45)',   glow:'rgba(255,60,60,.4)', icon:'🍒' },
      512:  { gradient:'linear-gradient(135deg,#ff9040,#f06010)', fg:'#fff',    border:'2px solid rgba(255,255,255,.8)', shadow:'0 0 20px rgba(255,120,40,.5)',   glow:'rgba(255,120,40,.45)', icon:'🍊' },
      1024: { gradient:'linear-gradient(135deg,#40cc80,#20aa60)', fg:'#fff',    border:'2px solid rgba(255,255,255,.8)', shadow:'0 0 24px rgba(40,200,100,.55)',  glow:'rgba(40,200,100,.5)', icon:'🍀' },
      2048: { gradient:'linear-gradient(135deg,#ff40cc,#cc00aa)', fg:'#fff',    border:'3px solid rgba(255,255,255,.9)', shadow:'0 0 32px rgba(255,50,200,.7)',   glow:'rgba(255,50,200,.65)', icon:'🌈' },
      high: { gradient:'linear-gradient(135deg,#aa00cc,#880099)', fg:'#fff',    border:'3px solid rgba(255,200,255,.8)', shadow:'0 0 28px rgba(180,0,200,.65)',   glow:'rgba(180,0,200,.6)', icon:'💎' },
    }
  },

  /* ══════════════════════════════════════════════════════════
     6. EMOJI QUEST 😄
     Feel: Pure emoji chaos — emojis replace numbers, tiles are
     bright gradient squares, board is dark purple.
  ══════════════════════════════════════════════════════════ */
  emoji: {
    label: 'Emoji Quest 😄',
    emoji: true,
    map: { 2:'😊',4:'😎',8:'🤩',16:'😍',32:'🥳',64:'🔥',128:'💎',256:'🦄',512:'👑',1024:'🚀',2048:'🌟',high:'💀',billion:'🥳' },
    body: { background: 'linear-gradient(160deg,#1a0a2e 0%,#2a0a3e 50%,#1a0a2e 100%)' },
    board: {
      background: '#1e1a30',
      borderRadius: '20px',
      border: '2px solid rgba(200,150,255,.2)',
      boxShadow: '0 8px 40px rgba(100,0,200,.3)',
    },
    cell: {
      background: 'rgba(255,255,255,.05)',
      borderRadius: '14px',
      border: '1px solid rgba(255,255,255,.08)',
    },
    tile: {
      borderRadius: '14px',
      fontFamily: 'Nunito, sans-serif',
      fontWeight: '900',
      fontSize: 'calc(var(--tile-size) * 0.5)', // bigger emoji!
    },
    tiles: {
      2:    { gradient:'linear-gradient(135deg,#fff9c4,#ffef80)', fg:'#5c4a00', shadow:'0 4px 12px rgba(255,220,0,.2)' },
      4:    { gradient:'linear-gradient(135deg,#ffe0b2,#ffcc7a)', fg:'#5c2e00', shadow:'0 4px 12px rgba(255,160,0,.25)' },
      8:    { gradient:'linear-gradient(135deg,#ffccbc,#ff9a7a)', fg:'#5c1a00', shadow:'0 4px 12px rgba(255,120,80,.3)' },
      16:   { gradient:'linear-gradient(135deg,#f8bbd0,#f48fb1)', fg:'#5c0022', shadow:'0 4px 12px rgba(255,80,120,.3)' },
      32:   { gradient:'linear-gradient(135deg,#e1bee7,#ba88c8)', fg:'#3a0050', shadow:'0 4px 12px rgba(180,80,220,.3)' },
      64:   { gradient:'linear-gradient(135deg,#bbdefb,#7ab8f5)', fg:'#002255', shadow:'0 4px 12px rgba(80,140,255,.3)' },
      128:  { gradient:'linear-gradient(135deg,#b2dfdb,#70c4bc)', fg:'#00332b', shadow:'0 0 18px rgba(80,220,200,.4)', glow:'rgba(80,220,200,.35)' },
      256:  { gradient:'linear-gradient(135deg,#dcedc8,#aed581)', fg:'#1a3300', shadow:'0 0 20px rgba(160,220,80,.4)', glow:'rgba(160,220,80,.35)' },
      512:  { gradient:'linear-gradient(135deg,#fff176,#ffd740)', fg:'#3a3000', shadow:'0 0 24px rgba(255,215,0,.5)',  glow:'rgba(255,215,0,.45)' },
      1024: { gradient:'linear-gradient(135deg,#ffcc80,#ffa020)', fg:'#3a1a00', shadow:'0 0 28px rgba(255,160,0,.55)', glow:'rgba(255,160,0,.5)' },
      2048: { gradient:'linear-gradient(135deg,#ffe57f,#ffc400)', fg:'#3a2800', shadow:'0 0 36px rgba(255,196,0,.65)', glow:'rgba(255,196,0,.6)' },
      high: { gradient:'linear-gradient(135deg,#212121,#424242)', fg:'#fff',    shadow:'0 0 30px rgba(255,255,255,.4)', glow:'rgba(255,255,255,.4)' },
    }
  },

  /* ══════════════════════════════════════════════════════════
     7. LOVE 💕
     Feel: Valentine's Day. Board is deep rose, tiles are hearts
     getting darker red, heart shapes via border-radius.
  ══════════════════════════════════════════════════════════ */
  love: {
    label: 'Love 💕',
    body: { background: 'linear-gradient(160deg,#1a000e 0%,#2a0018 50%,#1a000e 100%)' },
    board: {
      background: '#3d001e',
      borderRadius: '20px',
      border: '2px solid rgba(255,100,150,.3)',
      boxShadow: '0 8px 40px rgba(200,0,80,.5), inset 0 0 40px rgba(100,0,40,.4)',
    },
    cell: {
      background: 'rgba(255,50,100,.1)',
      borderRadius: '50% 50% 45% 45% / 50% 50% 55% 55%', // heart-ish!
      border: '1px solid rgba(255,100,150,.15)',
    },
    tile: {
      borderRadius: '50% 50% 45% 45% / 50% 50% 55% 55%',
      fontFamily: 'Georgia, serif',
      fontWeight: '900',
    },
    tiles: {
      2:    { gradient:'linear-gradient(135deg,#fce4ec,#f8bbd0)', fg:'#880033', border:'2px solid rgba(255,150,180,.4)', shadow:'0 4px 10px rgba(255,100,150,.2)', icon:'🤍' },
      4:    { gradient:'linear-gradient(135deg,#f8bbd0,#f48fb1)', fg:'#880033', border:'2px solid rgba(255,120,160,.4)', shadow:'0 4px 10px rgba(255,100,150,.25)', icon:'💗' },
      8:    { gradient:'linear-gradient(135deg,#f48fb1,#f06292)', fg:'#fff',    border:'2px solid rgba(255,100,150,.5)', shadow:'0 4px 14px rgba(255,80,130,.35)', icon:'💕' },
      16:   { gradient:'linear-gradient(135deg,#f06292,#ec407a)', fg:'#fff',    border:'2px solid rgba(255,80,130,.55)', shadow:'0 4px 16px rgba(240,80,120,.4)', icon:'💞' },
      32:   { gradient:'linear-gradient(135deg,#e91e63,#d81b60)', fg:'#fff',    border:'2px solid rgba(255,60,110,.6)',  shadow:'0 6px 18px rgba(233,30,99,.45)', icon:'❤️' },
      64:   { gradient:'linear-gradient(135deg,#c2185b,#ad1457)', fg:'#ffd6e7', border:'2px solid rgba(220,40,100,.65)', shadow:'0 0 20px rgba(194,24,91,.5)',  glow:'rgba(200,30,90,.35)', icon:'💘' },
      128:  { gradient:'linear-gradient(135deg,#ad1457,#880e4f)', fg:'#ffd6e7', border:'2px solid rgba(200,20,90,.7)',   shadow:'0 0 24px rgba(173,20,87,.55)', glow:'rgba(180,20,80,.45)', icon:'💝' },
      256:  { gradient:'linear-gradient(135deg,#880e4f,#6a0036)', fg:'#ffb3d1', border:'2px solid rgba(180,10,80,.75)',  shadow:'0 0 28px rgba(136,14,79,.6)',  glow:'rgba(160,10,70,.5)', icon:'💖' },
      512:  { gradient:'linear-gradient(135deg,#6a0036,#4a0028)', fg:'#ffb3d1', border:'2px solid rgba(160,0,70,.8)',    shadow:'0 0 32px rgba(106,0,54,.65)',  glow:'rgba(140,0,60,.55)', icon:'💗' },
      1024: { gradient:'linear-gradient(135deg,#4a0028,#2d0018)', fg:'#ff80ab', border:'2px solid rgba(255,80,140,.8)',  shadow:'0 0 36px rgba(233,30,99,.7)', glow:'rgba(200,20,80,.6)', icon:'💓' },
      2048: { gradient:'linear-gradient(135deg,#ff4081,#ff0055)', fg:'#fff',    border:'3px solid rgba(255,100,160,.9)', shadow:'0 0 48px rgba(255,64,129,.85)', glow:'rgba(255,50,120,.75)', icon:'💘' },
      high: { gradient:'linear-gradient(135deg,#ff0055,#cc0044)', fg:'#fff',    border:'3px solid rgba(255,60,120,.9)',  shadow:'0 0 40px rgba(255,0,80,.8)',   glow:'rgba(255,0,80,.7)', icon:'♾️' },
    }
  },

  /* ══════════════════════════════════════════════════════════
     8. SPACE 🚀
     Feel: Deep space. Star-field board, planet tiles, each tile
     is a different celestial body getting more epic.
  ══════════════════════════════════════════════════════════ */
  space: {
    label: 'Space 🚀',
    body: { background: '#000008' },
    board: {
      background: '#000018',
      borderRadius: '16px',
      border: '1px solid rgba(100,100,255,.2)',
      boxShadow: '0 0 80px rgba(50,0,150,.4), inset 0 0 100px rgba(0,0,30,.8)',
      // Star field pattern
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='30' r='1' fill='rgba(255,255,255,0.6)'/%3E%3Ccircle cx='80' cy='10' r='1.5' fill='rgba(255,255,255,0.4)'/%3E%3Ccircle cx='140' cy='60' r='1' fill='rgba(255,255,255,0.7)'/%3E%3Ccircle cx='170' cy='130' r='0.8' fill='rgba(255,255,255,0.5)'/%3E%3Ccircle cx='50' cy='160' r='1.2' fill='rgba(255,255,255,0.6)'/%3E%3Ccircle cx='120' cy='180' r='1' fill='rgba(255,255,255,0.4)'/%3E%3Ccircle cx='190' cy='20' r='0.8' fill='rgba(255,200,255,0.5)'/%3E%3Ccircle cx='10' cy='100' r='1' fill='rgba(200,200,255,0.5)'/%3E%3C/svg%3E")`,
    },
    cell: {
      background: 'rgba(255,255,255,.03)',
      borderRadius: '50%',
      border: '1px solid rgba(100,100,255,.1)',
    },
    tile: {
      borderRadius: '50%',
      fontFamily: 'Nunito, sans-serif',
      fontWeight: '900',
    },
    tiles: {
      2:    { gradient:'linear-gradient(135deg,#e8e8ff,#c0c0e0)', fg:'#000030', shadow:'0 4px 12px rgba(100,100,200,.3)', border:'2px solid rgba(150,150,255,.4)', icon:'⭐' },
      4:    { gradient:'linear-gradient(135deg,#c0c0ff,#9090d0)', fg:'#000030', shadow:'0 4px 12px rgba(100,100,220,.35)', border:'2px solid rgba(130,130,255,.45)', icon:'🌙' },
      8:    { gradient:'linear-gradient(135deg,#e8c060,#d0a030)', fg:'#1a0a00', shadow:'0 4px 14px rgba(200,150,0,.4)',   border:'2px solid rgba(240,180,60,.5)', icon:'☄️' },
      16:   { gradient:'linear-gradient(135deg,#ff8040,#e05020)', fg:'#fff',    shadow:'0 4px 16px rgba(255,80,30,.45)',  border:'2px solid rgba(255,120,60,.55)', icon:'🌞' },
      32:   { gradient:'linear-gradient(135deg,#8060d0,#5030a0)', fg:'#fff',    shadow:'0 6px 18px rgba(120,60,200,.5)',  border:'2px solid rgba(150,80,230,.6)', icon:'🪐', glow:'rgba(120,60,200,.3)' },
      64:   { gradient:'linear-gradient(135deg,#4080e0,#2050b0)', fg:'#fff',    shadow:'0 0 22px rgba(60,120,220,.6)',    border:'2px solid rgba(80,140,255,.65)', icon:'🌍', glow:'rgba(60,130,230,.4)' },
      128:  { gradient:'linear-gradient(135deg,#e04040,#a02020)', fg:'#fff',    shadow:'0 0 26px rgba(200,40,40,.65)',    border:'2px solid rgba(240,80,80,.7)', glow:'rgba(200,40,40,.5)', icon:'🔴' },
      256:  { gradient:'linear-gradient(135deg,#40e0a0,#20a060)', fg:'#fff',    shadow:'0 0 28px rgba(40,200,120,.7)',    border:'2px solid rgba(60,220,140,.75)', glow:'rgba(40,200,120,.55)', icon:'🟢' },
      512:  { gradient:'linear-gradient(135deg,#e0e040,#a0a000)', fg:'#0a0a00', shadow:'0 0 32px rgba(200,200,0,.75)',   border:'2px solid rgba(240,240,60,.8)', glow:'rgba(200,200,0,.6)', icon:'⚡' },
      1024: { gradient:'linear-gradient(135deg,#40c0ff,#0080c0)', fg:'#fff',    shadow:'0 0 38px rgba(0,160,255,.8)',    border:'2px solid rgba(60,200,255,.85)', glow:'rgba(0,180,255,.7)', icon:'🪐' },
      2048: { gradient:'linear-gradient(135deg,#ffffff,#c0c0ff)', fg:'#000030', shadow:'0 0 50px rgba(200,200,255,.9)',  border:'3px solid rgba(255,255,255,.9)', glow:'rgba(200,200,255,.85)', icon:'🌌' },
      high: { gradient:'linear-gradient(135deg,#8000ff,#4000c0)', fg:'#fff',    shadow:'0 0 44px rgba(120,0,255,.85)',   border:'3px solid rgba(160,60,255,.9)', glow:'rgba(120,0,255,.75)', icon:'🚀' },
    }
  },

};

/* ══════════════════════════════════════════════════════════
   ENGINE — apply() rewrites ALL visual aspects at once
══════════════════════════════════════════════════════════ */
const THEME_NAMES = Object.keys(THEMES);
let current = localStorage.getItem('2048-tile-theme') || 'nature';
if (!THEMES[current]) current = 'nature';

// Style tag for tile rules
const styleEl = document.createElement('style');
styleEl.id    = 'tile-theme-style';
document.head.appendChild(styleEl);

// Extra style tag for structural overrides (board/cell shape etc)
const structEl = document.createElement('style');
structEl.id    = 'tile-theme-struct';
document.head.appendChild(structEl);

function apply(name) {
  current = THEMES[name] ? name : 'nature';
  localStorage.setItem('2048-tile-theme', current);
  document.documentElement.setAttribute('data-tile-theme', current);

  const theme = THEMES[current];

  /* ── 1. Body background ── */
  if (theme.body?.background) {
    document.body.style.background = theme.body.background;
  }

  /* ── 2. Board appearance ── */
  const boardEl = document.getElementById('board');
  if (boardEl && theme.board) {
    const b = theme.board;
    if (b.background)       boardEl.style.background       = b.background;
    if (b.borderRadius)     boardEl.style.borderRadius      = b.borderRadius;
    if (b.border)           boardEl.style.border            = b.border;
    if (b.boxShadow)        boardEl.style.boxShadow         = b.boxShadow;
    if (b.backgroundImage)  boardEl.style.backgroundImage   = b.backgroundImage;
  }

  /* ── 3. Cell shape ── */
  const cellCSS = theme.cell ? `
    .cell {
      background:    ${theme.cell.background || 'rgba(255,255,255,.06)'} !important;
      border-radius: ${theme.cell.borderRadius || '12px'} !important;
      border:        ${theme.cell.border || 'none'} !important;
    }
  ` : '';

  /* ── 4. Tile shape + font ── */
  const tileBase = theme.tile ? `
    .tile {
      border-radius: ${theme.tile.borderRadius || '12px'} !important;
      font-family:   ${theme.tile.fontFamily || 'Nunito, sans-serif'} !important;
      font-weight:   ${theme.tile.fontWeight || '900'} !important;
      position: relative !important;
      overflow: hidden !important;
    }
    .tile > * { position: relative !important; z-index: 1 !important; }
  ` : '';

  structEl.textContent = cellCSS + tileBase;

  /* ── 5. Per-tile colour + icon rules ── */
  const t = theme.tiles;
  let rules = '';

  Object.entries(t).forEach(([val, def]) => {
    const cls = val === 'high' ? '.t-high' : `.t${val}`;

    let bg = def.gradient
      ? `background: ${def.gradient};`
      : `background: ${def.bg || '#888'};`;

    let shadow = '';
    if (def.glow && def.shadow) shadow = `box-shadow: ${def.glow ? `0 0 22px 4px ${def.glow},` : ''}${def.shadow};`;
    else if (def.glow)   shadow = `box-shadow: 0 0 22px 4px ${def.glow};`;
    else if (def.shadow) shadow = `box-shadow: ${def.shadow};`;

    rules += `${cls} { ${bg} color:${def.fg}; ${def.border?`border:${def.border};`:''} ${shadow} }\n`;

    // Large bg icon via ::before
    if (def.icon) {
      rules += `${cls}::before { content:'${def.icon}'; position:absolute; font-size:1.9em; opacity:.14; pointer-events:none; z-index:0; top:50%; left:50%; transform:translate(-50%,-50%) rotate(-10deg); }\n`;
    }
  });

  // Extended tiles beyond 2048 (bucket classes)
  const base2048 = t[2048] || {};
  const baseBg   = base2048.gradient || (base2048.bg ? base2048.bg : '#f0c040');
  for (let i = 0; i < 30; i++) {
    const pct    = Math.round((1 - Math.min(i/15, 1)*0.75)*100);
    const bg2    = base2048.gradient
      ? `background: ${base2048.gradient};`
      : `background: color-mix(in srgb, ${baseBg} ${pct}%, #000);`;
    const glow2  = i > 6 ? `box-shadow: 0 0 ${18+i*2}px ${4+i}px color-mix(in srgb,${baseBg} 55%,transparent);` : '';
    rules += `.t-high-${i+1} { ${bg2} color:#fff; ${glow2} }\n`;
  }

  rules += `.tile { position:relative; overflow:hidden; }\n`;
  styleEl.textContent = rules;

  /* ── 6. Emoji theme ── */
  const isEmoji = !!theme.emoji;
  document.documentElement.setAttribute('data-emoji-theme', isEmoji ? 'true' : 'false');
  window._tileEmojiMap = isEmoji ? theme.map : null;
}

function getThemes()  { return THEMES; }
function getCurrent() { return current; }
function getNames()   { return THEME_NAMES; }

// Apply on load
apply(current);

return { apply, getThemes, getCurrent, getNames };

})();
