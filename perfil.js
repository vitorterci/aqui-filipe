(function () {
  'use strict';

  const SECTION_INFO = {
    conta: { id: 'sec-minha-conta', title: 'Minha conta', eyebrow: 'SEU ESPAÇO PESSOAL', icon: '◉' },
    acessos: { id: 'sec-meus-acessos', title: 'Meus acessos', eyebrow: 'ÁREAS PESSOAIS', icon: '◷' },
    operacional: { id: 'sec-operacional', title: 'Operacional', eyebrow: 'RECURSOS DA UNIDADE', icon: '▤' },
    administracao: { id: 'sec-administracao', title: 'Administração', eyebrow: 'RECURSOS ADMINISTRATIVOS', icon: '⚙' }
  };

  const MODULE_LIBRARY = {
    'dados-pessoais': { title: 'Dados pessoais', description: 'Dados exibidos a partir do perfil fornecido pela sessão.', icon: '⌑', permission: 'perfil.visualizar' },
    seguranca: { title: 'Segurança', description: 'Opções de segurança ainda não integradas neste repositório.', icon: '◇', permission: 'perfil.seguranca' },
    preferencias: { title: 'Preferências', description: 'Ajustes de preferência ainda não integrados neste repositório.', icon: '☷', permission: 'perfil.preferencias' },
    'meus-pedidos': { title: 'Meus pedidos', description: 'A rota de pedidos pessoais ainda não está integrada.', icon: '▣', permission: 'pedidos.proprios' },
    favoritos: { title: 'Favoritos', description: 'A rota de favoritos ainda não está integrada.', icon: '♡', permission: 'favoritos.proprios' },
    carrinho: { title: 'Carrinho', description: 'A rota do carrinho ainda não está integrada.', icon: '▱', permission: 'carrinho.proprio' },
    historico: { title: 'Histórico', description: 'O histórico de conta ainda não está conectado.', icon: '◷', permission: 'historico.proprio' },
    cardapio: { title: 'Cardápio', description: 'A rota do cardápio não existe nesta versão do repositório.', icon: '☕', permission: 'cardapio.visualizar' },
    'pedidos-unidade': { title: 'Pedidos', description: 'Área de pedidos operacionais ainda sem rota integrada.', icon: '▣', permission: 'pedidos.operacional' },
    produtos: { title: 'Produtos', description: 'Área de produtos ainda sem rota integrada.', icon: '▤', permission: 'produtos.visualizar' },
    categorias: { title: 'Categorias', description: 'Área operacional de categorias ainda sem rota integrada.', icon: '▦', permission: 'categorias.visualizar' },
    estoque: { title: 'Estoque', description: 'Área de estoque ainda sem rota integrada.', icon: '◫', permission: 'estoque.visualizar' },
    relatorios: { title: 'Relatórios', description: 'Relatórios aguardam conexão aos dados da unidade.', icon: '▥', permission: 'relatorios.visualizar' },
    'status-unidade': { title: 'Status da unidade', description: 'O status da unidade ainda não tem integração operacional.', icon: '◉', permission: 'unidade.status' },
    usuarios: { title: 'Usuários', description: 'Administração de usuários ainda sem rota integrada.', icon: '♧', permission: 'usuarios.gerenciar' },
    funcionarios: { title: 'Funcionários', description: 'Administração de funcionários ainda sem rota integrada.', icon: '♙', permission: 'funcionarios.gerenciar' },
    gestores: { title: 'Gestores', description: 'Administração de gestores ainda sem rota integrada.', icon: '♜', permission: 'gestores.gerenciar' },
    'categorias-admin': { title: 'Gerenciar categorias', description: 'A gestão administrativa de categorias ainda não está integrada.', icon: '▦', permission: 'categorias.gerenciar' },
    permissoes: { title: 'Permissões', description: 'A configuração de permissões ainda não está integrada.', icon: '◇', permission: 'permissoes.gerenciar' },
    configuracoes: { title: 'Configurações', description: 'As configurações administrativas ainda não estão integradas.', icon: '⚙', permission: 'configuracoes.gerenciar' },
    logs: { title: 'Logs / Auditoria', description: 'A auditoria ainda não está integrada.', icon: '▥', permission: 'logs.visualizar' }
  };

  const MODULES_BY_SECTION = {
    conta: ['dados-pessoais', 'seguranca', 'preferencias'],
    acessos: ['meus-pedidos', 'favoritos', 'carrinho', 'historico', 'cardapio'],
    operacional: ['pedidos-unidade', 'produtos', 'categorias', 'estoque', 'relatorios', 'status-unidade'],
    administracao: ['usuarios', 'funcionarios', 'gestores', 'categorias-admin', 'permissoes', 'configuracoes', 'logs']
  };

  const PERMISSIONS = {
    pessoal: ['perfil.visualizar', 'perfil.seguranca', 'perfil.preferencias', 'pedidos.proprios', 'favoritos.proprios', 'carrinho.proprio', 'historico.proprio', 'cardapio.visualizar'],
    operacional: ['pedidos.operacional', 'produtos.visualizar', 'categorias.visualizar', 'estoque.visualizar', 'relatorios.visualizar', 'unidade.status'],
    administracao: ['usuarios.gerenciar', 'funcionarios.gerenciar', 'gestores.gerenciar', 'categorias.gerenciar', 'permissoes.gerenciar', 'configuracoes.gerenciar', 'logs.visualizar']
  };

  function createRole({ label, area, metrics, sections, permissions, quick }) {
    return Object.freeze({
      label,
      area,
      metrics,
      sections,
      modules: sections.flatMap((section) => MODULES_BY_SECTION[section].map((id) => ({ ...MODULE_LIBRARY[id], id, section }))),
      permissions,
      quick
    });
  }

  // ROLE_CONTENT define o catálogo visual por papel. As seções e os módulos compartilhados
  // são montados uma vez; permissões de usuário, quando fornecidas, podem restringir a lista.
  const ROLE_CONTENT = Object.freeze({
    cliente: createRole({
      label: 'Cliente', area: 'Minha conta', sections: ['conta', 'acessos'],
      metrics: [['Pedidos', '▣'], ['Favoritos', '♡'], ['Itens no carrinho', '▱'], ['Fidelidade', '✦']],
      permissions: PERMISSIONS.pessoal, quick: ['conta', 'acessos']
    }),
    gestor: createRole({
      label: 'Gestor', area: 'Operacional', sections: ['conta', 'acessos', 'operacional'],
      metrics: [['Produtos', '▤'], ['Pedidos', '▣'], ['Estoque', '◫'], ['Vendas', '◈']],
      permissions: [...PERMISSIONS.pessoal, ...PERMISSIONS.operacional], quick: ['conta', 'acessos', 'operacional']
    }),
    admin: createRole({
      label: 'Administrador', area: 'Operacional e administração', sections: ['conta', 'acessos', 'operacional', 'administracao'],
      metrics: [['Produtos', '▤'], ['Funcionários', '♙'], ['Pedidos', '▣'], ['Clientes', '♧']],
      permissions: [...PERMISSIONS.pessoal, ...PERMISSIONS.operacional, ...PERMISSIONS.administracao], quick: ['conta', 'acessos', 'operacional', 'administracao']
    })
  });

  const $ = (selector, root) => (root || document).querySelector(selector);
  const text = (value) => String(value == null ? '' : value);
  const processedEvents = new WeakSet();
  let activePermissions = new Set();

  function el(tag, className, value) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (value != null) node.textContent = value;
    return node;
  }

  function setSessionMessage(title, message) {
    const container = $('#aviso-sessao-texto');
    const strong = el('strong', '', title);
    container.replaceChildren(strong, document.createTextNode(` ${message}`));
  }

  function showWaitingState(message, title) {
    $('#profile-state').textContent = 'SEM SESSÃO';
    $('#profile-initial').textContent = 'K';
    $('#profile-name').textContent = 'Não disponível';
    $('#profile-email').textContent = 'Não disponível';
    $('#profile-phone').textContent = 'Não disponível';
    $('#profile-role').textContent = 'Não disponível';
    $('#profile-summary').textContent = 'Os dados da conta aparecerão quando o sistema fornecer um perfil autenticado.';
    $('#profile-note').textContent = 'A interface organiza o que aparece; qualquer operação protegida deve ser autorizada no servidor com Auth, RLS e Policies.';
    $('#role-empty-title').textContent = title || 'Aguardando seu perfil';
    $('#role-empty-copy').textContent = message || 'Esta versão do repositório não inclui autenticação. Quando uma sessão fornecer tipo_usuario, as áreas correspondentes serão exibidas.';
    $('#role-empty').hidden = false;
    $('#metrics-section').hidden = true;
    $('#role-sections').replaceChildren();
    $('#role-sections').hidden = true;
    $('#quick-grid').replaceChildren();
    $('#quick-section').hidden = true;
    setSessionMessage('Perfil aguardando autenticação.', 'Nenhum dado pessoal ou nível de acesso será presumido.');
  }

  function getSuppliedPermissions(profile) {
    if (Array.isArray(profile.permissions)) return profile.permissions;
    if (Array.isArray(profile.permissoes)) return profile.permissoes;
    return null;
  }

  function getProfileName(profile) {
    return text(profile.nome_completo || profile.nome || profile.name).trim();
  }

  function updateProfile(profile, role) {
    const name = getProfileName(profile);
    const email = text(profile.email).trim();
    const phone = text(profile.telefone || profile.phone || profile.celular).trim();
    const initial = Array.from(name || role.label)[0] || 'K';

    $('#profile-state').textContent = role.label.toLocaleUpperCase('pt-BR');
    $('#profile-initial').textContent = initial.toLocaleUpperCase('pt-BR');
    $('#profile-name').textContent = name || 'Nome não fornecido pelo perfil';
    $('#profile-email').textContent = email || 'E-mail não fornecido pelo perfil';
    $('#profile-phone').textContent = phone || 'Telefone não fornecido pelo perfil';
    $('#profile-role').textContent = role.label;
    $('#profile-summary').textContent = `Perfil recebido do sistema. As áreas exibidas estão organizadas para: ${role.area}.`;
    $('#profile-note').textContent = 'A filtragem visual não é uma barreira de segurança. Operações reais exigem validação no servidor por Auth, RLS e Policies.';
    $('#role-empty').hidden = true;
    setSessionMessage('Perfil recebido do sistema.', `O nível de acesso informado é ${role.label}. A autorização real deve ser aplicada no servidor.`);
  }

  function makeMetric([label, icon]) {
    const card = el('article', 'cartao-metrica');
    const symbol = el('span', 'metrica-icone', icon);
    symbol.setAttribute('aria-hidden', 'true');
    const copy = el('span', 'metrica-conteudo');
    copy.append(el('span', 'metrica-rotulo', label), el('strong', 'metrica-valor', '—'), el('small', 'metrica-nota', 'Dados não conectados'));
    card.append(symbol, copy);
    return card;
  }

  function makeModuleCard(module) {
    const card = el('article', 'cartao-modulo');
    card.dataset.permission = module.permission;
    const icon = el('span', 'modulo-icone', module.icon);
    icon.setAttribute('aria-hidden', 'true');
    card.append(icon, el('h3', 'modulo-titulo', module.title), el('p', 'modulo-descricao', module.description), el('span', 'modulo-estado', 'Rota não integrada'));
    return card;
  }

  function makeSection(sectionKey, modules) {
    const info = SECTION_INFO[sectionKey];
    const section = el('section', 'grupo-modulos');
    section.id = info.id;
    section.setAttribute('aria-labelledby', `${info.id}-titulo`);
    const heading = el('div', 'hub-heading');
    const copy = el('div');
    copy.append(el('p', 'rotulo-secao', info.eyebrow));
    const title = el('h2', '', info.title);
    title.id = `${info.id}-titulo`;
    copy.append(title);
    heading.append(copy, el('span', 'hub-aside', 'Recursos previstos para este perfil'));
    const grid = el('div', 'grade-modulos');
    modules.forEach((module) => grid.append(makeModuleCard(module)));
    section.append(heading, grid);
    return section;
  }

  function makeQuickLink(sectionKey) {
    const info = SECTION_INFO[sectionKey];
    const link = el('a', 'atalho-perfil');
    link.href = `#${info.id}`;
    const icon = el('span', 'atalho-icone', info.icon);
    icon.setAttribute('aria-hidden', 'true');
    const copy = el('span', 'atalho-conteudo');
    copy.append(el('strong', '', info.title), el('small', '', 'Ir para esta seção'));
    link.append(icon, copy);
    return link;
  }

  function renderProfile(candidate) {
    const profile = candidate && candidate.profile && typeof candidate.profile === 'object'
      ? candidate.profile
      : candidate;
    if (!profile || typeof profile !== 'object') {
      showWaitingState();
      return;
    }

    const roleKey = text(profile.tipo_usuario).trim().toLocaleLowerCase('pt-BR');
    if (!Object.prototype.hasOwnProperty.call(ROLE_CONTENT, roleKey)) {
      showWaitingState('O perfil recebido não contém um tipo_usuario reconhecido (cliente, gestor ou admin). Nenhuma área foi liberada.', 'Nível de acesso não reconhecido');
      $('#profile-state').textContent = 'TIPO INVÁLIDO';
      setSessionMessage('Tipo de usuário não reconhecido.', 'Nenhuma área pessoal, operacional ou administrativa foi exibida.');
      return;
    }

    const role = ROLE_CONTENT[roleKey];
    const suppliedPermissions = getSuppliedPermissions(profile);
    activePermissions = new Set(suppliedPermissions || role.permissions);
    updateProfile(profile, role);

    $('#metrics-title').textContent = role.area === 'Minha conta' ? 'Seu resumo' : `Resumo ${role.area.toLocaleLowerCase('pt-BR')}`;
    $('#metrics-grid').replaceChildren(...role.metrics.map(makeMetric));
    $('#metrics-section').hidden = false;

    const host = $('#role-sections');
    host.replaceChildren();
    const visibleSections = [];
    role.sections.forEach((sectionKey) => {
      const modules = role.modules.filter((module) => module.section === sectionKey && activePermissions.has(module.permission));
      if (!modules.length) return;
      host.append(makeSection(sectionKey, modules));
      visibleSections.push(sectionKey);
    });
    host.hidden = host.children.length === 0;

    const quick = $('#quick-grid');
    quick.replaceChildren(...role.quick.filter((key) => visibleSections.includes(key)).map(makeQuickLink));
    $('#quick-section').hidden = quick.children.length === 0;

    if (!visibleSections.length) {
      $('#role-empty-title').textContent = 'Nenhum módulo disponibilizado';
      $('#role-empty-copy').textContent = 'O perfil foi recebido, mas as permissões informadas não liberaram módulos para exibição.';
      $('#role-empty').hidden = false;
    }
  }

  function handleProfileEvent(event) {
    if (processedEvents.has(event)) return;
    processedEvents.add(event);
    renderProfile(event.detail);
  }

  function initializeMenu() {
    const button = $('#menu-toggle');
    const menu = $('#menu-principal');
    if (!button || !menu) return;

    function closeMenu() {
      menu.classList.remove('is-open');
      button.setAttribute('aria-expanded', 'false');
      button.setAttribute('aria-label', 'Abrir menu');
    }

    button.addEventListener('click', () => {
      const open = button.getAttribute('aria-expanded') !== 'true';
      menu.classList.toggle('is-open', open);
      button.setAttribute('aria-expanded', String(open));
      button.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });
    window.addEventListener('resize', () => {
      if (window.matchMedia('(min-width: 721px)').matches) closeMenu();
    });
  }

  function initialize() {
    initializeMenu();
    // Contrato de integração futura: o sistema pode definir window.perfilAutenticado
    // antes desta página carregar, ou emitir 'perfil-autenticado' com um perfil.
    // Não há consulta a banco, endpoint ou tabela presumida neste repositório.
    document.addEventListener('perfil-autenticado', handleProfileEvent);
    window.addEventListener('perfil-autenticado', handleProfileEvent);
    showWaitingState();
    if (window.perfilAutenticado) renderProfile(window.perfilAutenticado);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true });
  else initialize();
})();
