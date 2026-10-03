document.addEventListener('DOMContentLoaded', () => {
  const loginScreen = document.getElementById('login-screen');
  const bootScreen = document.getElementById('boot-screen');
  const shutdownScreen = document.getElementById('shutdown-screen');
  const mainScreen = document.getElementById('main-screen');
  const loginBtn = document.getElementById('loginBtn');
  const clockBtn = document.getElementById('clockBtn');

  const BOOT_DURATION = 2200;
  const SHUTDOWN_DURATION = 1800;

  // ---------- Reloj ----------
  function updateClock() {
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const yy = String(now.getFullYear()).slice(-2);

    let hours = now.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    if (hours === 0) hours = 12;
    const hh = String(hours).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');

    clockBtn.textContent = `${dd}/${mm}/${yy}  ${hh}:${min} ${ampm}`;
  }

  updateClock();
  setInterval(updateClock, 1000 * 30);

  // ---------- Transición entre pantallas ----------
  function switchScreen(from, to) {
    from.classList.add('fade-out');

    setTimeout(() => {
      from.hidden = true;
      from.classList.remove('fade-out');

      to.hidden = false;
      to.classList.add('fade-in');

      setTimeout(() => to.classList.remove('fade-in'), 600);
    }, 600);
  }

  // ---------- Sonido de arranque (sintetizado) ----------
  let muted = false;
  const muteBtn = document.getElementById('muteBtn');
  const muteIcon = document.getElementById('muteIcon');

  function playChime() {
    if (muted) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, now + i * 0.15);
        gain.gain.linearRampToValueAtTime(0.18, now + i * 0.15 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.15 + 0.6);
        osc.connect(gain).connect(ctx.destination);
        osc.start(now + i * 0.15);
        osc.stop(now + i * 0.15 + 0.6);
      });
    } catch (e) { /* audio no disponible */ }
  }

  if (muteBtn) {
    muteBtn.addEventListener('click', () => {
      muted = !muted;
      muteIcon.style.opacity = muted ? '0.45' : '1';
      muteBtn.title = muted ? 'Activar sonido' : 'Silenciar sonido';
    });
  }

  // ---------- Login / Boot / Shutdown ----------
  loginBtn.addEventListener('click', () => {
    playChime();
    switchScreen(loginScreen, bootScreen);

    setTimeout(() => {
      switchScreen(bootScreen, mainScreen);
    }, 600 + BOOT_DURATION);
  });

  const powerBtn = document.getElementById('powerBtn');
  if (powerBtn) {
    powerBtn.addEventListener('click', () => {
      closeNotifPanel();
      closeCalendar();
      switchScreen(mainScreen, shutdownScreen);

      setTimeout(() => {
        switchScreen(shutdownScreen, loginScreen);
      }, 600 + SHUTDOWN_DURATION);
    });
  }

  // ---------- Parallax del fondo ----------
  const bgLayer = document.getElementById('bgLayer');
  let targetX = 0, targetY = 0, curX = 0, curY = 0;

  window.addEventListener('mousemove', (e) => {
    const relX = e.clientX / window.innerWidth - 0.5;
    const relY = e.clientY / window.innerHeight - 0.5;
    targetX = relX * 26;
    targetY = relY * 18;
  });

  window.addEventListener('deviceorientation', (e) => {
    if (e.gamma === null || e.beta === null) return;
    targetX = Math.max(-20, Math.min(20, e.gamma));
    targetY = Math.max(-16, Math.min(16, (e.beta - 45) * 0.6));
  });

  function animateBg() {
    curX += (targetX - curX) * 0.06;
    curY += (targetY - curY) * 0.06;
    bgLayer.style.transform = `translate(${curX}px, ${curY}px)`;
    requestAnimationFrame(animateBg);
  }
  animateBg();

  // ---------- Panel de notificaciones ----------
  const notifBtn = document.getElementById('notifBtn');
  const notifPanel = document.getElementById('notifPanel');

  function closeNotifPanel() {
    if (notifPanel) notifPanel.hidden = true;
  }

  if (notifBtn) {
    notifBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeCalendar();
      notifPanel.hidden = !notifPanel.hidden;
    });
  }

  // ---------- Mini calendario ----------
  const calendarPopup = document.getElementById('calendarPopup');

  function closeCalendar() {
    if (calendarPopup) calendarPopup.hidden = true;
  }

  function buildCalendar() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const monthNames = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let html = `<div class="cal-header">${monthNames[month]} ${year}</div><div class="cal-grid">`;
    ['D', 'L', 'M', 'M', 'J', 'V', 'S'].forEach((d) => {
      html += `<span class="cal-dow">${d}</span>`;
    });
    for (let i = 0; i < firstDay; i++) html += '<span></span>';
    for (let d = 1; d <= daysInMonth; d++) {
      const isToday = d === now.getDate();
      html += `<span class="${isToday ? 'cal-today' : ''}">${d}</span>`;
    }
    html += '</div>';
    calendarPopup.innerHTML = html;
  }

  if (clockBtn) {
    clockBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeNotifPanel();
      if (calendarPopup.hidden) buildCalendar();
      calendarPopup.hidden = !calendarPopup.hidden;
    });
  }

  document.addEventListener('click', () => {
    closeNotifPanel();
    closeCalendar();
  });

  // ---------- Íconos de escritorio ----------
  const infoOverlay = document.getElementById('infoOverlay');
  const infoTitle = document.getElementById('infoTitle');
  const infoBody = document.getElementById('infoBody');
  const infoClose = document.getElementById('infoClose');

  document.querySelectorAll('.desktop-icon').forEach((icon) => {
    icon.addEventListener('click', () => {
      infoTitle.textContent = icon.dataset.title;
      infoBody.innerHTML = icon.dataset.content;
      infoOverlay.hidden = false;
    });
  });

  function closeInfo() {
    infoOverlay.hidden = true;
  }

  if (infoClose) infoClose.addEventListener('click', closeInfo);
  if (infoOverlay) {
    infoOverlay.addEventListener('click', (e) => {
      if (e.target === infoOverlay) closeInfo();
    });
  }
});
