document.addEventListener('DOMContentLoaded', () => {
  const loginScreen = document.getElementById('login-screen');
  const bootScreen = document.getElementById('boot-screen');
  const mainScreen = document.getElementById('main-screen');
  const loginBtn = document.getElementById('loginBtn');

  const BOOT_DURATION = 2200;

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
