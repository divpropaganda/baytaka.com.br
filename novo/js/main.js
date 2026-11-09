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

  document.querySelectorAll('.by-drawer-links a').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // Helper para nome formatado da categoria (curto para tags e botões)
  function formatCategoryShortName(slug) {
    if (!window.baytakaStore) return slug;
    const cat = window.baytakaStore.getCategoryBySlug(slug);
    return cat ? (cat.shortName || cat.name || cat.title) : slug;
  }

  // --- RENDERIZAR TODAS AS 14 CATEGORIAS NO BLOCO LARANJA DA HOME (APENAS NOME E IMAGEM GENÉRICA, SEM CITAR PÁGINAS) ---
  const categoriesContainer = document.getElementById('by-home-categories-grid');
  if (categoriesContainer && window.baytakaStore) {
    const categories = window.baytakaStore.getCategories();
    categoriesContainer.innerHTML = categories.map(cat => {
      const slug = cat.slug || cat.id;
      const title = cat.shortName || cat.name || cat.title;
      return `
      <a href="produtos.html?cat=${slug}" class="by-category-card" data-category-slug="${slug}">
        <div class="by-cat-img-wrap">
          <img src="${cat.image}" alt="${title} - Baytaka Interiores" loading="lazy">
        </div>
        <div class="by-cat-info">
          <div>
            <h3 class="by-cat-title">${title}</h3>
          </div>
          <div class="by-cat-action">
            <span>Ver Produtos</span>
            <span>→</span>
          </div>
        </div>
      </a>
    `;
    }).join('');
  }

  // Helper global para renderizar card de produto padronizado
  // (SEM PREÇOS, SEM QUANTIDADE DE FOTOS, SEM QUANTIDADE DE MEDIDAS/MODELOS DISPONÍVEL)
  window.renderBaytakaProductCard = function(prod, overrideCatName) {
    const catObj = window.baytakaStore ? window.baytakaStore.getCategoryBySlug(prod.category) : null;
    const catLabel = overrideCatName || (catObj ? (catObj.shortName || catObj.name) : (prod.categoryName || prod.category));
    const vars = Array.isArray(prod.variations) ? prod.variations : [];

    let specsHtml = '';
    if (prod.dimensions) {
      specsHtml = `<div class="by-prod-specs-mini"><strong>Medidas:</strong> ${prod.dimensions.split('|')[0] || prod.dimensions}</div>`;
    }

    return `
      <div class="by-product-card" id="prod-card-${prod.id}">
        <div class="by-prod-img-box by-open-prod-detail" data-prod-id="${prod.id}" style="cursor:pointer;">
          <img src="${prod.image}" alt="${prod.name}" loading="lazy">
          ${prod.code ? `<span class="by-prod-code-badge">CÓD. ${prod.code}</span>` : ''}
        </div>
        <div class="by-prod-body">
          <div class="by-prod-meta-row">
            <span class="by-prod-category">${catLabel}</span>
          </div>
          <h3 class="by-prod-title">${prod.name}</h3>
          <p class="by-prod-desc">${prod.shortDesc || ''}</p>
          ${specsHtml}
          <button type="button" class="by-btn by-btn-outline w-full by-open-prod-detail" data-prod-id="${prod.id}">
            Conhecer Peça
          </button>
        </div>
      </div>
    `;
  };

  // --- RENDERIZAR PRODUTOS EM DESTAQUE NA HOME ---
  const featuredContainer = document.getElementById('by-home-featured-grid');
  if (featuredContainer && window.baytakaStore) {
    const featuredProds = window.baytakaStore.getFeaturedProducts().slice(0, 8);
    featuredContainer.innerHTML = featuredProds.map(prod => window.renderBaytakaProductCard(prod)).join('');
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

  // --- MODAL DETALHE DO PRODUTO (SEM PREÇO, SEM NÚMERO DE PÁGINA) ---
  function openProductDetailModal(productId) {
    const product = window.baytakaStore.getProductById(productId);
    if (!product) return;

    if (window.baytakaTracker && window.baytakaTracker.trackProductView) {
      window.baytakaTracker.trackProductView(product);
    }

    let modal = document.getElementById('by-prod-detail-modal');
    if (!modal) {
      const modalHtml = `
        <div id="by-prod-detail-modal" class="by-modal-overlay" style="display:none;" role="dialog" aria-modal="true">
          <div class="by-modal-box by-product-modal-box">
            <button type="button" class="by-modal-close" id="by-close-prod-modal" aria-label="Fechar janela">&times;</button>
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

    const rawSlides = Array.isArray(product.images) && product.images.length > 0
      ? product.images.map(s => typeof s === 'string' ? { url: s, label: product.name, code: product.code, dimensions: product.dimensions } : s)
      : [{ url: product.image, label: product.name, code: product.code, dimensions: product.dimensions }];

    const vars = Array.isArray(product.variations) ? product.variations : [];
    const hasCarousel = rawSlides.length > 1;
    let currentSlideIdx = 0;

    let cleanFullDesc = (product.fullDesc || product.shortDesc || '')
      .replace(/\(Págs?\.\s*[\d,\s]+\)\.?\s*/gi, '')
      .trim();

    const contentBox = document.getElementById('by-prod-detail-content');
    contentBox.innerHTML = `
      <div class="by-prod-detail-grid">
        <!-- Coluna da Esquerda: Galeria e Carrossel Robusto -->
        <div class="by-prod-detail-gallery">
          <div class="by-carousel-stage">
            ${hasCarousel ? `
              <button type="button" class="by-carousel-nav by-carousel-prev" id="by-carousel-prev-btn" aria-label="Foto anterior">&#10094;</button>
              <button type="button" class="by-carousel-nav by-carousel-next" id="by-carousel-next-btn" aria-label="Próxima foto">&#10095;</button>
              <span class="by-carousel-counter" id="by-carousel-counter" style="display:none !important;">1 / ${rawSlides.length}</span>
            ` : ''}
            <img id="by-carousel-main-img" src="${rawSlides[0].url}" alt="${product.name}">
          </div>

          <!-- Legenda da Variação Selecionada -->
          <div class="by-carousel-caption-box" id="by-carousel-caption">
            <div class="by-carousel-cap-top">
              <span class="by-carousel-var-badge" id="by-carousel-var-label">${rawSlides[0].label || product.name}</span>
              ${rawSlides[0].code ? `<span class="by-carousel-var-code" id="by-carousel-var-code">CÓD. ${rawSlides[0].code}</span>` : '<span class="by-carousel-var-code" id="by-carousel-var-code" style="display:none;"></span>'}
            </div>
            <div class="by-carousel-cap-dims" id="by-carousel-var-dims">${rawSlides[0].dimensions || product.dimensions || ''}</div>
          </div>

          <!-- Miniaturas Clicáveis sem scrollbar -->
          ${hasCarousel ? `
            <div class="by-carousel-thumbs-track" id="by-carousel-thumbs">
              ${rawSlides.map((sl, idx) => `
                <button type="button" class="by-carousel-thumb-btn ${idx === 0 ? 'active' : ''}" data-slide-idx="${idx}" title="${sl.label || `Opção ${idx + 1}`}">
                  <img src="${sl.url}" alt="${sl.label || ''}">
                  
                </button>
              `).join('')}
            </div>
          ` : ''}
        </div>

        <!-- Coluna da Direita: Dados, Tabela de Medidas e Ações -->
        <div class="by-prod-detail-info">
          <div class="by-prod-detail-header">
            <span class="by-prod-detail-category">${formatCategoryShortName(product.category)}</span>
            ${product.code ? `<span class="by-badge-pill" style="background:#0F172A; color:#FFF; font-size:0.75rem; padding:3px 8px;">CÓD. ${product.code}</span>` : ''}
          </div>
          <h2>${product.name}</h2>
          <p class="by-prod-detail-desc">${cleanFullDesc}</p>

          ${vars.length > 0 ? `
            <div class="by-variations-section">
              <h4 class="by-variations-heading">Medidas e Variações Disponíveis</h4>
              <div class="by-variations-table-wrap">
                <table class="by-variations-table">
                  <thead>
                    <tr>
                      <th>Variação / Medida</th>
                      <th>Código</th>
                      <th>Dimensões</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${vars.map((v, vIdx) => {
                      const matchingSlide = rawSlides.findIndex(s => s.code === v.code && s.label === v.label);
                      const targetSlide = matchingSlide >= 0 ? matchingSlide : 0;
                      return `
                        <tr class="by-var-row-clickable ${targetSlide === 0 ? 'active' : ''}" data-slide-idx="${targetSlide}" title="Clique para ver a foto desta medida">
                          <td><strong>${v.label}</strong></td>
                          <td><span class="by-var-code-tag">CÓD. ${v.code}</span></td>
                          <td>${v.dimensions}</td>
                        </tr>
                      `;
                    }).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          ` : ''}

          <table class="by-prod-specs-table">
            <tbody>
              <tr>
                <th>Materiais:</th>
                <td>${product.materials || 'Aço carbono com pintura eletrostática industrial'}</td>
              </tr>
              <tr>
                <th>Estrutura:</th>
                <td>${product.capacity || product.weightCapacity || 'Alta resistência e estabilidade'}</td>
              </tr>
              <tr>
                <th>Aplicações:</th>
                <td>${product.applications || 'Decoração de eventos, festas e interiores'}</td>
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

          <div style="display:flex; flex-direction:column; gap:12px; margin-top:20px;">
            <button type="button" class="by-btn by-btn-primary w-full" data-catalog-trigger data-product-id="${product.id}">
              Quero Este Produto no Meu Acervo
            </button>
            <a href="produtos.html?cat=${product.category}" class="by-btn by-btn-secondary w-full by-btn-ver-categoria" style="text-align:center; white-space:normal; line-height:1.3; padding:12px 16px;">Ver Todos os Produtos Desta Categoria</a>
          </div>
        </div>
      </div>
    `;

    function setSlide(idx) {
      currentSlideIdx = (idx + rawSlides.length) % rawSlides.length;
      const sl = rawSlides[currentSlideIdx];
      const mainImg = document.getElementById('by-carousel-main-img');
      const counterEl = document.getElementById('by-carousel-counter');
      const labelEl = document.getElementById('by-carousel-var-label');
      const codeEl = document.getElementById('by-carousel-var-code');
      const dimsEl = document.getElementById('by-carousel-var-dims');

      if (mainImg) mainImg.src = sl.url;
      if (counterEl) counterEl.textContent = `${currentSlideIdx + 1} / ${rawSlides.length}`;
      if (labelEl) labelEl.textContent = sl.label || product.name;
      if (codeEl) {
        if (sl.code) {
          codeEl.textContent = `CÓD. ${sl.code}`;
          codeEl.style.display = 'inline-block';
        } else {
          codeEl.style.display = 'none';
        }
      }
      if (dimsEl) dimsEl.textContent = sl.dimensions || product.dimensions || '';

      contentBox.querySelectorAll('.by-carousel-thumb-btn').forEach((btn, bIdx) => {
        btn.classList.toggle('active', bIdx === currentSlideIdx);
      });
      contentBox.querySelectorAll('.by-var-row-clickable').forEach(row => {
        const rIdx = parseInt(row.getAttribute('data-slide-idx') || '0', 10);
        row.classList.toggle('active', rIdx === currentSlideIdx);
      });
    }

    document.getElementById('by-carousel-prev-btn')?.addEventListener('click', () => setSlide(currentSlideIdx - 1));
    document.getElementById('by-carousel-next-btn')?.addEventListener('click', () => setSlide(currentSlideIdx + 1));

    contentBox.querySelectorAll('.by-carousel-thumb-btn, .by-var-row-clickable').forEach(el => {
      el.addEventListener('click', () => {
        const idx = parseInt(el.getAttribute('data-slide-idx') || '0', 10);
        setSlide(idx);
      });
    });

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  document.addEventListener('click', (e) => {
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
});
