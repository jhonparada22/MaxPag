document.addEventListener('DOMContentLoaded', () => {
  const loginScreen = document.getElementById('login-screen');
  const bootScreen = document.getElementById('boot-screen');
  const mainScreen = document.getElementById('main-screen');
  const loginBtn = document.getElementById('loginBtn');
  const clockEl = document.getElementById('clock');

  const BOOT_DURATION = 2200;

  function updateClock() {
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const yy = String(now.getFullYear()).slice(-2);
    const hh = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    clockEl.textContent = `${dd}/${mm}/${yy}  ${hh}:${min}`;
  }

  updateClock();
  setInterval(updateClock, 1000 * 30);

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

  loginBtn.addEventListener('click', () => {
    switchScreen(loginScreen, bootScreen);

    setTimeout(() => {
      switchScreen(bootScreen, mainScreen);
    }, 600 + BOOT_DURATION);
  });
});
