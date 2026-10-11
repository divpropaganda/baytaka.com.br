// Lógica Principal de Interação, Renderização e Navegação - Baytaka Interiores
document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --- HEADER & SCROLL BEHAVIOR ---
  const header = document.querySelector('.by-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }, { passive: true });

  // --- MENU MOBILE DRAWER ---
  const mobileToggleBtn = document.getElementById('by-mobile-toggle');
  const mobileDrawer = document.getElementById('by-mobile-drawer');
  const drawerOverlay = document.getElementById('by-drawer-overlay');
  const drawerCloseBtn = document.getElementById('by-drawer-close');

  function openDrawer() {
    mobileDrawer?.classList.add('active');
    drawerOverlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    mobileDrawer?.classList.remove('active');
    drawerOverlay?.classList.remove('active');
    document.body.style.overflow = '';
  }

  mobileToggleBtn?.addEventListener('click', openDrawer);
  drawerCloseBtn?.addEventListener('click', closeDrawer);
  drawerOverlay?.addEventListener('click', closeDrawer);

  // Fecha menu mobile ao clicar em um link interno
  document.querySelectorAll('.by-drawer-links a').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // --- RENDERIZAR CATEGORIAS NA HOME ---
  const categoriesContainer = document.getElementById('by-home-categories-grid');
  if (categoriesContainer && window.baytakaStore) {
    const categories = window.baytakaStore.getCategories();
    categoriesContainer.innerHTML = categories.map(cat => `
      <a href="categoria.html?cat=${cat.slug}" class="by-category-card" data-category-slug="${cat.slug}">
        <div class="by-cat-img-wrap">
          <img src="${cat.image}" alt="${cat.name} - Baytaka Interiores" loading="lazy">
        </div>
        <div class="by-cat-info">
          <div>
            <h3 class="by-cat-title">${cat.name}</h3>
            <p class="by-cat-sub">${cat.shortDesc}</p>
          </div>
          <div class="by-cat-action">
            <span>Explorar Categoria</span>
            <span>→</span>
          </div>
        </div>
      </a>
    `).join('');
  }

  // --- RENDERIZAR PRODUTOS EM DESTAQUE NA HOME ---
  const featuredContainer = document.getElementById('by-home-featured-grid');
  if (featuredContainer && window.baytakaStore) {
    const featuredProds = window.baytakaStore.getFeaturedProducts().slice(0, 8);
    featuredContainer.innerHTML = featuredProds.map(prod => `
      <div class="by-product-card" id="prod-card-${prod.id}">
        <div class="by-prod-img-box">
          <img src="${prod.image}" alt="${prod.name}" loading="lazy">
          ${prod.isNew ? '<span class="by-prod-badge new-badge">Lançamento</span>' : '<span class="by-prod-badge">Acervo Pro</span>'}
        </div>
        <div class="by-prod-body">
          <span class="by-prod-category">${formatCategoryName(prod.category)}</span>
          <h3 class="by-prod-title">${prod.name}</h3>
          <p class="by-prod-desc">${prod.shortDesc}</p>
          <div class="by-prod-specs-mini">
            <strong>Dimensões:</strong> ${prod.dimensions.split('|')[0] || prod.dimensions}
          </div>
          <button type="button" class="by-btn by-btn-outline w-full by-open-prod-detail" data-prod-id="${prod.id}">
            Conhecer Peça
          </button>
        </div>
      </div>
    `).join('');
  }

  // --- RENDERIZAR INSPIRAÇÕES COM FILTROS NA HOME ---
  const inspContainer = document.getElementById('by-home-insp-grid');
  const inspFilterBar = document.getElementById('by-insp-filter-bar');
  if (inspContainer && window.baytakaStore) {
    let allInspirations = window.baytakaStore.getInspirations();

    function renderInspirations(filterCategory = 'Todos') {
      const filtered = filterCategory === 'Todos' 
        ? allInspirations 
        : allInspirations.filter(i => i.category.toLowerCase() === filterCategory.toLowerCase());

      inspContainer.innerHTML = filtered.map(item => `
        <article class="by-insp-card">
          <div class="by-insp-img-wrap">
            <img src="${item.image}" alt="${item.title}" loading="lazy">
            <span class="by-insp-tag">${item.category}</span>
          </div>
          <div class="by-insp-body">
            <div class="by-insp-location">📍 ${item.location}</div>
            <h3 class="by-insp-title">${item.title}</h3>
            <p class="by-insp-decorator"><strong>Projeto por:</strong> ${item.decorator}</p>
            <p class="by-insp-desc">${item.description}</p>
            
            ${item.productsUsed && item.productsUsed.length ? `
              <div class="by-insp-prods-box">
                <span class="by-insp-prods-label">Produtos Baytaka neste projeto:</span>
                <div class="by-insp-prod-pills">
                  ${item.productsUsed.map(prodId => {
                    const p = window.baytakaStore.getProductById(prodId);
                    return p ? `<a href="#" class="by-open-prod-detail" data-prod-id="${p.id}">${p.name}</a>` : '';
                  }).join('')}
                </div>
              </div>
            ` : ''}
          </div>
        </article>
      `).join('');
    }

    renderInspirations('Todos');

    inspFilterBar?.addEventListener('click', (e) => {
      const btn = e.target.closest('.by-insp-filter-btn');
      if (btn) {
        document.querySelectorAll('.by-insp-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filterVal = btn.getAttribute('data-filter') || 'Todos';
        renderInspirations(filterVal);
      }
    });
  }

  // --- BAYTAKA PELO BRASIL: MAPA SVG & CASOS ---
  const brazilCasesContainer = document.getElementById('by-brasil-cases-list');
  const brazilSvgMap = document.getElementById('by-brazil-svg-map');
  if (brazilCasesContainer && window.baytakaStore) {
    const cases = window.baytakaStore.getBrazilCases();

    function renderCases(selectedState = null) {
      const filtered = selectedState 
        ? cases.filter(c => c.state.toUpperCase() === selectedState.toUpperCase())
        : cases.slice(0, 4);

      brazilCasesContainer.innerHTML = filtered.map(c => `
        <div class="by-case-card">
          <img src="${c.image}" alt="Projeto ${c.city} - ${c.state}" class="by-case-img" loading="lazy">
          <div>
            <div class="by-case-meta">
              <span>📍 ${c.city} • ${c.state}</span>
            </div>
            <h4 class="by-case-client">${c.client}</h4>
            <p class="by-case-quote">"${c.quote}"</p>
            <p class="by-case-prod"><strong>Peças no Acervo:</strong> ${c.productUsed}</p>
          </div>
        </div>
      `).join('');
    }

    renderCases();

    // Interatividade com caminhos SVG do mapa do Brasil
    if (brazilSvgMap) {
      brazilSvgMap.addEventListener('click', (e) => {
        const path = e.target.closest('path');
        if (path) {
          const stateUf = path.getAttribute('id') || path.getAttribute('data-state');
          if (stateUf) {
            brazilSvgMap.querySelectorAll('path').forEach(p => p.classList.remove('selected'));
            path.classList.add('selected');
            renderCases(stateUf);
          }
        }
      });
    }
  }

  // --- MODAL DETALHE DO PRODUTO (QUICK VIEW COM COMPRA CONSULTIVA) ---
  function openProductDetailModal(productId) {
    const product = window.baytakaStore.getProductById(productId);
    if (!product) return;

    window.baytakaTracker.trackProductView(product);

    let modal = document.getElementById('by-prod-detail-modal');
    if (!modal) {
      const modalHtml = `
        <div id="by-prod-detail-modal" class="by-modal-overlay" style="display:none;" role="dialog">
          <div class="by-modal-box by-product-modal-box">
            <button type="button" class="by-modal-close" id="by-close-prod-modal">&times;</button>
            <div id="by-prod-detail-content"></div>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML('beforeend', modalHtml);
      modal = document.getElementById('by-prod-detail-modal');

      document.getElementById('by-close-prod-modal')?.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = '';
      });

      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.style.display = 'none';
          document.body.style.overflow = '';
        }
      });
    }

    const contentBox = document.getElementById('by-prod-detail-content');
    contentBox.innerHTML = `
      <div class="by-prod-detail-grid">
        <div class="by-prod-detail-gallery">
          <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="by-prod-detail-info">
          <span class="by-prod-detail-category">${formatCategoryName(product.category)}</span>
          <h2>${product.name}</h2>
          <p class="by-prod-detail-desc">${product.fullDesc}</p>
          
          <table class="by-prod-specs-table">
            <tbody>
              <tr>
                <th>Dimensões:</th>
                <td>${product.dimensions}</td>
              </tr>
              <tr>
                <th>Capacidade:</th>
                <td>${product.weightCapacity}</td>
              </tr>
              <tr>
                <th>Materiais:</th>
                <td>${product.materials}</td>
              </tr>
              <tr>
                <th>Aplicações:</th>
                <td>${product.applications}</td>
              </tr>
              <tr>
                <th>Acabamentos:</th>
                <td>
                  <div class="by-finishes-tags">
                    ${(product.finishes || []).map(f => `<span class="by-finish-pill">${f}</span>`).join('')}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div style="display:flex; flex-direction:column; gap:12px;">
            <button type="button" class="by-btn by-btn-primary w-full" data-catalog-trigger data-product-id="${product.id}">
              Quero Este Produto no Meu Acervo
            </button>
            <a href="categoria.html?cat=${product.category}" class="by-btn by-btn-secondary w-full" style="text-align:center;">
              Ver Todos da Categoria ${formatCategoryName(product.category)}
            </a>
          </div>
        </div>
      </div>
    `;

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  // Captura cliques para abrir o modal de detalhes do produto
  document.addEventListener('click', (e) => {
    // Se clicou em solicitar catálogo de dentro do modal de produto, fecha o modal de produto
    const prodModal = document.getElementById('by-prod-detail-modal');
    if (prodModal && prodModal.style.display === 'flex' && e.target.closest('[data-catalog-trigger]')) {
      prodModal.style.display = 'none';
    }

    const btn = e.target.closest('.by-open-prod-detail');
    if (btn) {
      e.preventDefault();
      const prodId = btn.getAttribute('data-prod-id');
      if (prodId) openProductDetailModal(prodId);
    }
  });

  // Helper de nome de categoria formatado
  function formatCategoryName(slug) {
    if (!window.baytakaStore) return slug;
    const cat = window.baytakaStore.getCategoryBySlug(slug);
    return cat ? cat.name : slug;
  }
});
