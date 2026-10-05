(function () {
  'use strict';

  var botaoMenu = document.getElementById('menu-toggle');
  var menu = document.getElementById('menu-principal');

  if (!botaoMenu || !menu) return;

  function fecharMenu() {
    menu.classList.remove('is-open');
    botaoMenu.setAttribute('aria-expanded', 'false');
    botaoMenu.setAttribute('aria-label', 'Abrir menu');
  }

  botaoMenu.addEventListener('click', function () {
    var aberto = botaoMenu.getAttribute('aria-expanded') !== 'true';
    menu.classList.toggle('is-open', aberto);
    botaoMenu.setAttribute('aria-expanded', String(aberto));
    botaoMenu.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
  });

  document.addEventListener('keydown', function (evento) {
    if (evento.key === 'Escape') fecharMenu();
  });

  window.addEventListener('resize', function () {
    if (window.matchMedia('(min-width: 721px)').matches) fecharMenu();
  });
})();
