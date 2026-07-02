// anigames/hub.js

(() => {
  'use strict';

  /* ── Category filter ── */
  document.querySelectorAll('.pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const cat = pill.dataset.cat;
      document.querySelectorAll('.game-card').forEach(card => {
        card.classList.toggle('hidden', cat !== 'all' && card.dataset.cat !== cat);
      });
    });
  });

  /* ── Online / offline ── */
  const badge  = document.getElementById('online-badge');
  const tOff   = document.getElementById('toast-offline');
  const tOn    = document.getElementById('toast-online');

  function showToast(el, ms = 3000) {
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), ms);
  }

  function setOnline(on) {
    badge.querySelector('.badge-dot').style.background = on ? '#4ade80' : '#f87171';
    badge.innerHTML = badge.innerHTML.replace(/Online|Offline/, on ? 'Online' : 'Offline');
    badge.classList.toggle('offline', !on);
  }

  setOnline(navigator.onLine);
  window.addEventListener('online',  () => { setOnline(true);  showToast(tOn); });
  window.addEventListener('offline', () => { setOnline(false); showToast(tOff); });

  /* ── PWA install ── */
  let deferred = null;
  const btnPwa = document.getElementById('btn-pwa');

  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferred = e;
    btnPwa.style.display = 'flex';
  });

  btnPwa.addEventListener('click', async () => {
    if (!deferred) return;
    deferred.prompt();
    const { outcome } = await deferred.userChoice;
    if (outcome === 'accepted') btnPwa.style.display = 'none';
    deferred = null;
  });

  window.addEventListener('appinstalled', () => {
    btnPwa.style.display = 'none';
    deferred = null;
  });

  /* ── Service Worker ── */
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
      .then(() => console.log('✅ AniGames ready offline!'))
      .catch(err => console.warn('SW registration failed:', err));
  }
})();
