/* ================================================================
   PYRAMIDS v2 – script.js
   Israel Nantes | Videomaker & Produtor de Conteúdo

   Funções:
   1. Menu mobile
   2. Header scroll
   3. Reveal ao entrar na tela
   4. Contador animado
   5. CALCULADORA DE ORÇAMENTO (principal novidade)
   6. Botão enviar orçamento pelo WhatsApp
   7. Triângulos decorativos
   8. Scroll spy (link ativo)
   9. Voltar ao topo
  10. PORTFÓLIO DINÂMICO (carregado do admin.html via localStorage)
================================================================ */

/* ================================================================
   PORTFÓLIO DINÂMICO — carrega config do painel admin
================================================================ */
(function buildPortfolio() {
  const STORAGE_KEY = 'pyramids_portfolio_config';
  let config;
  try { config = JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch(e) { config = null; }
  if (!config) return; // sem config salva = usa o HTML original

  // ── helpers ──
  function imgItem(path, label, tag, icon) {
    return `
    <div class="porto-item porto-lightbox-trigger reveal" data-img="${path}" data-label="${label}">
      <div class="porto-item__media">
        <img src="${path}" alt="${label}" class="porto-img" loading="lazy" />
        <div class="porto-img-overlay"><i class="fas fa-expand"></i></div>
      </div>
      <div class="porto-item__info">
        <span class="porto-item__tag"><i class="${icon}"></i> ${tag}</span>
        <p class="porto-item__label">${label}</p>
      </div>
    </div>`;
  }

  function videoItem(path, label, tag, icon) {
    const isEmbed = path.startsWith('http');
    const media = isEmbed
      ? `<iframe src="${path}" class="porto-video" allowfullscreen style="border:none;width:100%;aspect-ratio:16/9"></iframe>`
      : `<video class="porto-video" controls preload="metadata"><source src="${path}" type="video/mp4" />Seu navegador não suporta vídeo.</video>`;
    return `
    <div class="porto-item porto-item--video reveal">
      <div class="porto-item__media">${media}</div>
      <div class="porto-item__info">
        <span class="porto-item__tag"><i class="${icon}"></i> ${tag}</span>
        <p class="porto-item__label">${label}</p>
      </div>
    </div>`;
  }

  // ── Feed ──
  if (config.feed && config.feed.length > 0) {
    const grid = document.querySelector('#subtab-feed .porto-grid');
    if (grid) grid.innerHTML = config.feed.map(i => imgItem(i.path, i.label, 'Feed', 'fas fa-grid-2')).join('');
  }

  // ── Story ──
  if (config.story && config.story.length > 0) {
    const grid = document.querySelector('#subtab-story .porto-grid');
    if (grid) grid.innerHTML = config.story.map(i => imgItem(i.path, i.label, 'Story', 'fas fa-mobile-screen-button')).join('');
  }

  // ── Jogador ──
  if (config.jogador && config.jogador.length > 0) {
    const grid = document.querySelector('#subtab-jogador .porto-grid');
    if (grid) grid.innerHTML = config.jogador.map(i => imgItem(i.path, i.label, 'Jogador', 'fas fa-futbol')).join('');
  }

  // ── Drone ──
  if (config.drone && config.drone.length > 0) {
    const grid = document.querySelector('#tab-drone .porto-grid');
    if (grid) grid.innerHTML = config.drone.map(i => videoItem(i.path, i.label, 'Drone', 'fas fa-paper-plane')).join('');
  }

  // ── Vídeos Feed ──
  if (config.videosfeed && config.videosfeed.length > 0) {
    const grid = document.querySelector('#tab-videosfeed .porto-grid');
    if (grid) grid.innerHTML = config.videosfeed.map(i => videoItem(i.path, i.label, 'Vídeo Feed', 'fas fa-film')).join('');
  }
})();

document.addEventListener('DOMContentLoaded', () => {

  /* ──────────────────────────────────────────────
     SELETORES GLOBAIS
  ────────────────────────────────────────────── */
  const header    = document.getElementById('header');
  const hamburger = document.getElementById('hamburger');
  const nav       = document.getElementById('nav');
  const backToTop = document.getElementById('backToTop');
  const heroShapes = document.getElementById('heroShapes');


  /* ──────────────────────────────────────────────
     1. MENU MOBILE
  ────────────────────────────────────────────── */
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    nav.classList.toggle('nav--open');
    document.body.style.overflow = nav.classList.contains('nav--open') ? 'hidden' : '';
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      nav.classList.remove('nav--open');
      document.body.style.overflow = '';
    });
  });

  document.addEventListener('click', (e) => {
    if (nav.classList.contains('nav--open') && !nav.contains(e.target) && !hamburger.contains(e.target)) {
      hamburger.classList.remove('active');
      nav.classList.remove('nav--open');
      document.body.style.overflow = '';
    }
  });


  /* ──────────────────────────────────────────────
     2. HEADER SCROLL + BOTÃO TOPO
  ────────────────────────────────────────────── */
  window.addEventListener('scroll', () => {
    header.classList.toggle('header--scrolled', window.scrollY > 50);
    backToTop.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));


  /* ──────────────────────────────────────────────
     3. REVEAL AO ENTRAR NA TELA
  ────────────────────────────────────────────── */
  const revealObserver = new IntersectionObserver(
    (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObserver.unobserve(e.target); } }),
    { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
  );
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


  /* ──────────────────────────────────────────────
     4. CONTADOR ANIMADO
  ────────────────────────────────────────────── */
  const counterObserver = new IntersectionObserver(
    (entries) => entries.forEach(e => { if (e.isIntersecting) { animateCounter(e.target); counterObserver.unobserve(e.target); } }),
    { threshold: 0.5 }
  );
  document.querySelectorAll('.stat__number[data-target]').forEach(el => counterObserver.observe(el));

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'));
    const start = performance.now();
    const duration = 1400;
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }


  /* ──────────────────────────────────────────────
     5. CALCULADORA DE ORÇAMENTO
     Lógica de preços conforme a proposta real do Israel:

     VÍDEOS:
       1-3  → R$70 cada
       4-7  → R$65 cada (Bronze)
       8-11 → R$60 cada (Prata)
       12+  → R$55 cada (Ouro)

     POSTS (design):
       1-3  → R$35 cada
       4-7  → R$32,50 cada (Bronze)
       8+   → R$30 cada (Prata)

     DRONE:
       R$180 por gravação (mão de obra)
       + R$40 alimentação (opcional, por gravação)
       + R$80 deslocamento (opcional, por gravação)

     URGENTE:
       + R$30 por vídeo urgente
  ────────────────────────────────────────────── */

  // Valores de referência (fácil de editar)
  const PRECO = {
    video: {
      individual: 70,      // 1–3 vídeos
      bronze: 65,           // 4–7 vídeos (Bronze: 4 vídeos = R$260 = R$65/cada)
      prata: 60,            // 8–11 vídeos (Prata: 8 vídeos = R$480 = R$60/cada)
      ouro: 55,             // 12+ vídeos (Ouro: 12 vídeos = R$660 = R$55/cada)
    },
    post: {
      individual: 35,       // 1–3 posts
      bronze: 32.5,         // 4–7 posts (Bronze: 4 posts = R$130 = R$32,50/cada)
      prata: 30,            // 8+ posts (Prata: 8 posts = R$240 = R$30/cada)
    },
    drone: 180,             // mão de obra por gravação
    alimentacao: 40,        // extra por gravação de drone
    deslocamento: 80,       // extra por gravação de drone
    urgente: 30,            // extra por vídeo urgente
  };

  // Referências aos inputs
  const inputVideos      = document.getElementById('calc-videos');
  const inputPosts       = document.getElementById('calc-posts');
  const inputDrone       = document.getElementById('calc-drone');
  const inputUrgente     = document.getElementById('calc-urgente');
  const chkAlimentacao   = document.getElementById('calc-alimentacao');
  const chkDeslocamento  = document.getElementById('calc-deslocamento');
  const calcExtras       = document.getElementById('calcExtras');
  const calcItens        = document.getElementById('calcItens');
  const calcTotalEl      = document.getElementById('calcTotal');
  const btnEnviar        = document.getElementById('btnEnviarOrcamento');
  const calcPlaceholder  = calcItens.querySelector('.calc__placeholder');

  // Mostra extras do drone apenas quando qtd. drone > 0
  inputDrone.addEventListener('input', () => {
    const val = parseInt(inputDrone.value) || 0;
    calcExtras.classList.toggle('visible', val > 0);
    calcular();
  });

  // Recalcula sempre que qualquer campo muda
  [inputVideos, inputPosts, inputUrgente].forEach(el => el.addEventListener('input', calcular));
  [chkAlimentacao, chkDeslocamento].forEach(el => el.addEventListener('change', calcular));

  /**
   * Calcula o preço dos vídeos baseado na quantidade (com plano automático)
   */
  function calcularVideos(qtd) {
    if (qtd === 0) return { total: 0, plano: null, unitario: 0 };
    let unitario, plano;
    if (qtd >= 12) { unitario = PRECO.video.ouro;  plano = '🥇 Ouro'; }
    else if (qtd >= 8)  { unitario = PRECO.video.prata; plano = '🥈 Prata'; }
    else if (qtd >= 4)  { unitario = PRECO.video.bronze;plano = '🥉 Bronze'; }
    else                { unitario = PRECO.video.individual; plano = 'Individual'; }
    return { total: qtd * unitario, plano, unitario };
  }

  /**
   * Calcula o preço dos posts baseado na quantidade
   */
  function calcularPosts(qtd) {
    if (qtd === 0) return { total: 0, plano: null, unitario: 0 };
    let unitario, plano;
    if (qtd >= 8)      { unitario = PRECO.post.prata;     plano = '🥈 Prata'; }
    else if (qtd >= 4) { unitario = PRECO.post.bronze;    plano = '🥉 Bronze'; }
    else               { unitario = PRECO.post.individual; plano = 'Individual'; }
    return { total: qtd * unitario, plano, unitario };
  }

  /**
   * Função principal: recalcula tudo e atualiza a tela
   */
  function calcular() {
    const qtdVideos   = Math.max(0, parseInt(inputVideos.value)  || 0);
    const qtdPosts    = Math.max(0, parseInt(inputPosts.value)   || 0);
    const qtdDrone    = Math.max(0, parseInt(inputDrone.value)   || 0);
    const qtdUrgente  = Math.max(0, parseInt(inputUrgente.value) || 0);
    const temAlim     = chkAlimentacao.checked  && qtdDrone > 0;
    const temDeslocam = chkDeslocamento.checked && qtdDrone > 0;

    // Calcula cada bloco
    const videos  = calcularVideos(qtdVideos);
    const posts   = calcularPosts(qtdPosts);
    const droneMO = qtdDrone  * PRECO.drone;
    const alim    = temAlim   ? qtdDrone * PRECO.alimentacao  : 0;
    const desloc  = temDeslocam ? qtdDrone * PRECO.deslocamento : 0;
    const urgente = qtdUrgente * PRECO.urgente;

    const totalGeral = videos.total + posts.total + droneMO + alim + desloc + urgente;

    // Limpa a lista de itens
    calcItens.innerHTML = '';

    // Se não há nada selecionado, mostra placeholder
    if (totalGeral === 0) {
      calcItens.innerHTML = '<p class="calc__placeholder">👆 Selecione os serviços ao lado</p>';
      calcTotalEl.textContent = 'R$ 0,00';
      return;
    }

    // Monta os itens da lista
    if (qtdVideos > 0) adicionarItem(`${qtdVideos}x Vídeo`, formatBRL(videos.total), videos.plano);
    if (qtdPosts  > 0) adicionarItem(`${qtdPosts}x Post Design`, formatBRL(posts.total), posts.plano);
    if (qtdDrone  > 0) adicionarItem(`${qtdDrone}x Drone (MO)`, formatBRL(droneMO), null);
    if (alim      > 0) adicionarItem(`Alimentação (${qtdDrone}x)`, formatBRL(alim), null);
    if (desloc    > 0) adicionarItem(`Deslocamento (${qtdDrone}x)`, formatBRL(desloc), null);
    if (urgente   > 0) adicionarItem(`${qtdUrgente}x Urgência`, formatBRL(urgente), 'Adicional');

    // Atualiza total
    calcTotalEl.textContent = formatBRL(totalGeral);

    // Atualiza mensagem do WhatsApp
    atualizarWhatsApp({ qtdVideos, videos, qtdPosts, posts, qtdDrone, droneMO, alim, desloc, qtdUrgente, urgente, totalGeral });
  }

  /**
   * Adiciona uma linha de item na lista de resultado
   */
  function adicionarItem(label, valor, badge) {
    const div = document.createElement('div');
    div.className = 'calc__item';
    div.innerHTML = `
      <span>${label}${badge ? `<span class="calc__item-badge">${badge}</span>` : ''}</span>
      <strong>${valor}</strong>
    `;
    calcItens.appendChild(div);
  }

  /**
   * Formata número para Real Brasileiro
   */
  function formatBRL(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  /**
   * Atualiza o link do WhatsApp com o orçamento detalhado
   */
  function atualizarWhatsApp(dados) {
    // Monta o texto da mensagem
    let msg = `Olá Israel! 👋 Vim pelo seu site e quero fazer um orçamento pela PYRAMIDS.\n\n`;
    msg += `*📋 MEU ORÇAMENTO:*\n`;

    if (dados.qtdVideos > 0) msg += `• ${dados.qtdVideos}x Vídeo (${dados.videos.plano}): ${formatBRL(dados.videos.total)}\n`;
    if (dados.qtdPosts  > 0) msg += `• ${dados.qtdPosts}x Post Design (${dados.posts.plano}): ${formatBRL(dados.posts.total)}\n`;
    if (dados.qtdDrone  > 0) msg += `• ${dados.qtdDrone}x Gravação Drone: ${formatBRL(dados.droneMO)}\n`;
    if (dados.alim      > 0) msg += `• Alimentação: ${formatBRL(dados.alim)}\n`;
    if (dados.desloc    > 0) msg += `• Deslocamento: ${formatBRL(dados.desloc)}\n`;
    if (dados.qtdUrgente> 0) msg += `• ${dados.qtdUrgente}x Urgência: ${formatBRL(dados.urgente)}\n`;

    msg += `\n*💰 TOTAL ESTIMADO: ${formatBRL(dados.totalGeral)}*\n\n`;
    msg += `Podemos confirmar e combinar os detalhes?`;

    // TROQUE o número pelo real!
    const numero = '5519999828263';
    btnEnviar.onclick = () => window.open(`https://wa.me/${numero}?text=${encodeURIComponent(msg)}`, '_blank');
  }

  // Calcula na carga da página
  calcular();

  /* Botões +/− da calculadora */
  document.querySelectorAll('.calc__btn-mais, .calc__btn-menos').forEach(btn => {
    btn.addEventListener('click', () => {
      const campo = btn.getAttribute('data-campo');
      const inputMap = { videos: inputVideos, posts: inputPosts, drone: inputDrone, urgente: inputUrgente };
      const input = inputMap[campo];
      if (!input) return;

      const val = parseInt(input.value) || 0;
      const max = parseInt(input.max) || 999;
      const min = parseInt(input.min) || 0;

      if (btn.classList.contains('calc__btn-mais')) {
        input.value = Math.min(val + 1, max);
      } else {
        input.value = Math.max(val - 1, min);
      }

      input.dispatchEvent(new Event('input')); // dispara o recálculo
    });
  });


  /* ──────────────────────────────────────────────
     6. TRIÂNGULOS DECORATIVOS NO HERO
  ────────────────────────────────────────────── */
  if (heroShapes) {
    for (let i = 0; i < 10; i++) {
      const t = document.createElement('div');
      const size = Math.random() * 28 + 12;
      t.style.cssText = `
        position:absolute;
        width:0; height:0;
        border-left:${size}px solid transparent;
        border-right:${size}px solid transparent;
        border-bottom:${size*1.7}px solid rgba(184,146,58,0.05);
        left:${Math.random()*100}%;
        bottom:-80px;
        animation:rise ${Math.random()*14+10}s linear ${Math.random()*10}s infinite;
        pointer-events:none;
      `;
      heroShapes.appendChild(t);
    }
  }


  /* ──────────────────────────────────────────────
     7. SCROLL SPY (link ativo no menu)
  ────────────────────────────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

  new IntersectionObserver(
    (entries) => entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${e.target.id}"]`);
        if (active) active.classList.add('active');
      }
    }),
    { threshold: 0.4, rootMargin: '-80px 0px 0px 0px' }
  ).observe && sections.forEach(s => {
    new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) {
          navLinks.forEach(l => l.classList.remove('active'));
          const active = document.querySelector(`.nav-link[href="#${e.target.id}"]`);
          if (active) active.classList.add('active');
        }
      }),
      { threshold: 0.4, rootMargin: '-80px 0px 0px 0px' }
    ).observe(s);
  });


  /* ──────────────────────────────────────────────
     8. SMOOTH SCROLL com offset do header
  ────────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - header.offsetHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  console.log('%c✦ PYRAMIDS v2 – Israel Nantes ✦', 'color:#B8923A; font-size:15px; font-weight:bold;');

  /* ──────────────────────────────────────────────
     9. PORTFÓLIO – SISTEMA DE ABAS
  ────────────────────────────────────────────── */

  // Abas principais (Drone / Feed·Story / Vídeos Feed)
  document.querySelectorAll('.porto-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-tab');

      // Remove ativo de todas as abas e painéis
      document.querySelectorAll('.porto-tab').forEach(t => t.classList.remove('porto-tab--active'));
      document.querySelectorAll('.porto-panel').forEach(p => p.classList.remove('porto-panel--active'));

      // Ativa a aba clicada
      tab.classList.add('porto-tab--active');
      const panel = document.getElementById('tab-' + target);
      if (panel) panel.classList.add('porto-panel--active');

      // Re-observa os elementos reveal dentro do painel ativado
      panel.querySelectorAll('.reveal:not(.visible)').forEach(el => revealObserver.observe(el));
    });
  });

  // Sub-abas (Feed / Story dentro da aba Feed·Story)
  document.querySelectorAll('.porto-subtab').forEach(subtab => {
    subtab.addEventListener('click', () => {
      const target = subtab.getAttribute('data-subtab');

      document.querySelectorAll('.porto-subtab').forEach(t => t.classList.remove('porto-subtab--active'));
      document.querySelectorAll('.porto-subpanel').forEach(p => p.classList.remove('porto-subpanel--active'));

      subtab.classList.add('porto-subtab--active');
      const subpanel = document.getElementById('subtab-' + target);
      if (subpanel) {
        subpanel.classList.add('porto-subpanel--active');
        subpanel.querySelectorAll('.reveal:not(.visible)').forEach(el => revealObserver.observe(el));
      }
    });
  });
});

// ============================================================
//  LIGHTBOX – Clique na foto para ampliar
// ============================================================
(function () {
  const overlay  = document.getElementById('lightboxOverlay');
  const imgEl    = document.getElementById('lightboxImg');
  const labelEl  = document.getElementById('lightboxLabel');
  const closeBtn = document.getElementById('lightboxClose');
  const prevBtn  = document.getElementById('lightboxPrev');
  const nextBtn  = document.getElementById('lightboxNext');

  let currentGroup = [];
  let currentIndex = 0;

  function openLightbox(items, index) {
    currentGroup = items;
    currentIndex = index;
    showImage(currentIndex);
    overlay.classList.add('lightbox-overlay--active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    overlay.classList.remove('lightbox-overlay--active');
    document.body.style.overflow = '';
    imgEl.src = '';
  }

  function showImage(index) {
    const item = currentGroup[index];
    imgEl.src    = item.dataset.img;
    imgEl.alt    = item.dataset.label || '';
    labelEl.textContent = item.dataset.label || '';
    prevBtn.style.display = currentGroup.length > 1 ? '' : 'none';
    nextBtn.style.display = currentGroup.length > 1 ? '' : 'none';
  }

  function navigate(dir) {
    currentIndex = (currentIndex + dir + currentGroup.length) % currentGroup.length;
    showImage(currentIndex);
  }

  // Delegated click — works even for dynamically-shown panels
  document.addEventListener('click', function (e) {
    const trigger = e.target.closest('.porto-lightbox-trigger');
    if (!trigger) return;

    // All triggers visible in the same subpanel (or panel)
    const panel = trigger.closest('.porto-subpanel') || trigger.closest('.porto-panel') || document;
    const siblings = Array.from(panel.querySelectorAll('.porto-lightbox-trigger'));
    const index    = siblings.indexOf(trigger);
    openLightbox(siblings, index >= 0 ? index : 0);
  });

  closeBtn.addEventListener('click', closeLightbox);
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeLightbox();
  });
  prevBtn.addEventListener('click', () => navigate(-1));
  nextBtn.addEventListener('click', () => navigate(1));

  document.addEventListener('keydown', function (e) {
    if (!overlay.classList.contains('lightbox-overlay--active')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   navigate(-1);
    if (e.key === 'ArrowRight')  navigate(1);
  });
})();
