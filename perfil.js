(function () {
  'use strict';

  const ROLE_CONTENT = {
    admin: {
      label: 'Administrador', area: 'Administração', navLabel: 'Administração',
      metrics: [
        ['Produtos', '▤'], ['Funcionários', '♙'], ['Pedidos', '▣'], ['Clientes', '♧']
      ],
      modules: [
        ['Funcionários', 'Gerencie a equipe da cafeteria.', '♙'],
        ['Produtos', 'Cadastre e gerencie produtos.', '▤'],
        ['Categorias', 'Organize o cardápio.', '▦'],
        ['Clientes', 'Acesso visual à área de clientes.', '♧'],
        ['Pedidos', 'Acompanhe pedidos da cafeteria.', '▣'],
        ['Estoque', 'Disponibilidade dos produtos.', '◫'],
        ['Relatórios', 'Indicadores quando houver integração.', '▥'],
        ['Configurações', 'Preferências do sistema.', '⚙']
      ],
      quick: [['Novo produto', '▤'], ['Novo funcionário', '♙'], ['Ver pedidos', '▣'], ['Relatórios', '▥']]
    },
    gestor: {
      label: 'Gestor', area: 'Gestão', navLabel: 'Gestão',
      metrics: [
        ['Produtos', '▤'], ['Pedidos', '▣'], ['Estoque', '◫'], ['Vendas', '◈']
      ],
      modules: [
        ['Produtos', 'Cadastre e organize produtos.', '▤'],
        ['Categorias', 'Organize o cardápio.', '▦'],
        ['Estoque', 'Disponibilidade dos produtos.', '◫'],
        ['Pedidos', 'Acompanhe pedidos da cafeteria.', '▣'],
        ['Relatórios', 'Indicadores quando houver integração.', '▥']
      ],
      quick: [['Novo produto', '▤'], ['Estoque', '◫'], ['Pedidos', '▣'], ['Relatórios', '▥']]
    },
    cliente: {
      label: 'Cliente', area: 'Minha conta', navLabel: 'Minha conta',
      metrics: [
        ['Pedidos', '▣'], ['Favoritos', '♡'], ['Itens no carrinho', '▱'], ['Fidelidade', '✦']
      ],
      modules: [
        ['Meus pedidos', 'Seu histórico aparecerá após a integração.', '▣'],
        ['Favoritos', 'Seus itens salvos, quando disponíveis.', '♡'],
        ['Carrinho', 'Acesso visual; rota não conectada.', '▱'],
        ['Histórico', 'Atividade da conta não conectada.', '◷'],
        ['Preferências', 'Personalize sua experiência.', '☷']
      ],
      quick: [['Fazer pedido', '＋'], ['Ver carrinho', '▱'], ['Meus pedidos', '▣'], ['Cardápio', '☕']]
    }
  };

  const $ = (selector, root) => (root || document).querySelector(selector);
  const $$ = (selector, root) => Array.from((root || document).querySelectorAll(selector));
  const safeText = (value) => String(value == null ? '' : value);
  let toastTimer;
  let localProfile = { name: '', email: '', phone: '' };

  function showToast(message) {
    const toast = $('#toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 3300);
  }

  function renderMetrics(role) {
    const grid = $('#metrics-grid');
    grid.replaceChildren();
    ROLE_CONTENT[role].metrics.forEach(([label, icon]) => {
      const card = document.createElement('article');
      card.className = 'metric-card';
      card.dataset.searchable = '';
      card.dataset.searchText = `${label} resumo indicadores`;
      card.innerHTML = `<span class="metric-icon" aria-hidden="true">${icon}</span><span class="metric-copy"><span>${label}</span><strong>—</strong><small>Sem dados conectados</small></span>`;
      grid.append(card);
    });
  }

  function makeModuleCard([title, description, icon]) {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'module-card';
    card.dataset.searchable = '';
    card.dataset.searchText = `${title} ${description}`;
    card.setAttribute('aria-label', `${title}. Prévia visual, rota não conectada.`);
    card.innerHTML = `<span class="module-card-top"><span class="module-icon" aria-hidden="true">${icon}</span><span class="module-arrow" aria-hidden="true">↗</span></span><strong>${title}</strong><small>${description}</small>`;
    card.addEventListener('click', () => showToast('Acesso ilustrativo: esta área ainda não possui uma rota conectada.'));
    return card;
  }

  function makeQuickCard([title, icon], role) {
    if (role === 'cliente' && title === 'Cardápio') {
      const link = document.createElement('a');
      link.className = 'quick-card';
      link.href = '../pages/bebidas.html';
      link.dataset.searchable = '';
      link.dataset.searchText = `${title} menu cafeteria`;
      link.innerHTML = `<span aria-hidden="true">${icon}</span><span><strong>${title}</strong><small>Abrir cardápio disponível</small></span>`;
      return link;
    }
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'quick-card';
    button.dataset.searchable = '';
    button.dataset.searchText = `${title} acesso rápido`;
    button.setAttribute('aria-label', `${title}; ação não conectada nesta prévia.`);
    button.innerHTML = `<span aria-hidden="true">${icon}</span><span><strong>${title}</strong><small>Atalho ilustrativo</small></span>`;
    button.addEventListener('click', () => showToast('Este atalho é apenas visual e ainda não executa uma ação no sistema.'));
    return button;
  }

  function renderRole(role) {
    const content = ROLE_CONTENT[role] || ROLE_CONTENT.cliente;
    $('#profile-type').value = role;
    $('#profile-role').textContent = `${content.label} · prévia local`;
    $('#nav-modules-label').textContent = content.navLabel;
    $('#modules-title').textContent = content.area;
    $('#modules-eyebrow').textContent = role === 'cliente' ? 'ACESSO PESSOAL' : 'ÁREAS DE TRABALHO';
    $('#modules-description').textContent = role === 'cliente' ? 'Atalhos ilustrativos — rotas ainda não conectadas' : 'Acessos demonstrativos — autorização não implementada';

    const metrics = $('#metrics-grid');
    const modules = $('#module-grid');
    const quick = $('#quick-grid');
    renderMetrics(role);
    modules.replaceChildren(...content.modules.map(makeModuleCard));
    quick.replaceChildren(...content.quick.map((item) => makeQuickCard(item, role)));
    updateProfilePreview();
    applySearch($('#painel-busca').value);
  }

  function updateProfilePreview() {
    const name = localProfile.name.trim();
    const email = localProfile.email.trim();
    $('#profile-name').textContent = name || 'Perfil não conectado';
    $('#profile-email').textContent = email || 'Nenhuma sessão autenticada nesta prévia.';
    $('.profile-avatar span').textContent = name ? name.charAt(0).toLocaleUpperCase('pt-BR') : '?';
    $('.top-avatar span').textContent = name ? name.charAt(0).toLocaleUpperCase('pt-BR') : '?';
    $('#profile-data-note').textContent = name || email ? 'Dados temporários desta tela' : 'Dados reais indisponíveis';
  }

  function applySearch(query) {
    const term = safeText(query).trim().toLocaleLowerCase('pt-BR');
    let shown = 0;
    $$('[data-searchable]').forEach((element) => {
      const match = !term || safeText(element.dataset.searchText || element.textContent).toLocaleLowerCase('pt-BR').includes(term);
      element.hidden = !match;
      if (match) shown += 1;
    });
    ['metrics-grid', 'module-grid', 'quick-grid'].forEach((id) => {
      const grid = document.getElementById(id);
      const prior = grid.querySelector('.no-results');
      if (prior) prior.remove();
      if (term && grid.children.length && !Array.from(grid.children).some((child) => child.dataset.searchable && !child.hidden)) {
        const empty = document.createElement('div');
        empty.className = 'no-results';
        empty.textContent = 'Nenhum item corresponde à busca.';
        grid.append(empty);
      }
    });
    if (term && shown === 0) showToast('Nenhum resultado encontrado neste painel.');
  }

  function setTheme(theme) {
    const light = theme === 'claro';
    document.body.classList.toggle('modo-claro', light);
    const toggle = $('#theme-toggle');
    toggle.setAttribute('aria-pressed', String(light));
    toggle.setAttribute('aria-label', light ? 'Ativar tema escuro' : 'Ativar tema claro');
    toggle.title = light ? 'Ativar tema escuro' : 'Ativar tema claro';
    toggle.querySelector('span').textContent = light ? '☾' : '☼';
    try { window.localStorage.setItem('kaffe_perfil_tema', light ? 'claro' : 'escuro'); } catch (_) { /* Preferência apenas local; armazenamento pode estar bloqueado. */ }
  }

  function openDialog() {
    const dialog = $('#profile-dialog');
    $('#edit-name').value = localProfile.name;
    $('#edit-email').value = localProfile.email;
    $('#edit-phone').value = localProfile.phone;
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
    $('#edit-name').focus();
  }

  function closeDialog() {
    const dialog = $('#profile-dialog');
    if (typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
  }

  function setMenu(open) {
    document.body.classList.toggle('menu-aberto', open);
    $('#menu-toggle').setAttribute('aria-expanded', String(open));
    $('#menu-toggle').setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    $('#sidebar-scrim').hidden = !open;
  }

  function initialize() {
    const select = $('#profile-type');
    select.addEventListener('change', () => renderRole(select.value));
    $('#theme-toggle').addEventListener('click', () => setTheme(document.body.classList.contains('modo-claro') ? 'escuro' : 'claro'));
    $('#painel-busca').addEventListener('input', (event) => applySearch(event.currentTarget.value));
    $$('.search-box kbd').forEach((key) => key.addEventListener('click', () => $('#painel-busca').focus()));
    $('#menu-toggle').addEventListener('click', () => setMenu(!document.body.classList.contains('menu-aberto')));
    $('#sidebar-scrim').addEventListener('click', () => setMenu(false));
    $$('#side-nav a').forEach((link) => link.addEventListener('click', () => {
      $$('#side-nav a').forEach((item) => item.classList.toggle('is-active', item === link));
      setMenu(false);
    }));
    $$('[data-open-profile]').forEach((button) => button.addEventListener('click', openDialog));
    $$('[data-close-dialog]').forEach((button) => button.addEventListener('click', closeDialog));
    $('#profile-dialog').addEventListener('click', (event) => {
      if (event.target === event.currentTarget) closeDialog();
    });
    $('#profile-dialog').addEventListener('cancel', (event) => { event.preventDefault(); closeDialog(); });
    $('#profile-form').addEventListener('submit', (event) => {
      event.preventDefault();
      localProfile = {
        name: $('#edit-name').value,
        email: $('#edit-email').value,
        phone: $('#edit-phone').value
      };
      updateProfilePreview();
      closeDialog();
      showToast('Aplicado apenas nesta tela; nada foi enviado ou salvo no Supabase.');
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
        event.preventDefault();
        $('#painel-busca').focus();
      }
      if (event.key === 'Escape') setMenu(false);
    });
    try {
      const savedTheme = window.localStorage.getItem('kaffe_perfil_tema');
      if (savedTheme === 'claro' || savedTheme === 'escuro') document.body.classList.toggle('modo-claro', savedTheme === 'claro');
    } catch (_) { /* Segue com o tema escuro padrão. */ }
    setTheme(document.body.classList.contains('modo-claro') ? 'claro' : 'escuro');
    renderRole(select.value);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true });
  else initialize();
})();
