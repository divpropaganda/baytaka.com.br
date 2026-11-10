/**
 * BAYTAKA INTERIORES - MODAL DE CATÁLOGO INTELIGENTE & DIRECIONAMENTO COMERCIAL
 * Captura leads qualificados e encaminha para o WhatsApp com mensagem contextualizada.
 */

class BaytakaCatalogModal {
  constructor() {
    this.modalId = 'by-catalog-modal-backdrop';
    this.contextProduct = null;
    this.contextCategory = null;
    this.init();
  }

  init() {
    this.injectModalHTML();
    this.bindTriggers();
  }

  injectModalHTML() {
    if (document.getElementById(this.modalId)) return;

    const modalHTML = `
      <div id="${this.modalId}" class="by-modal-backdrop" style="display:none !important;" role="dialog" aria-modal="true" aria-labelledby="by-modal-title">
        <div class="by-modal-box">
          <button type="button" class="by-modal-close" id="by-modal-close-btn" aria-label="Fechar janela">&times;</button>
          
          <div class="by-modal-header">
            <span class="by-eyebrow">Atendimento Direto da Fábrica</span>
            <h3 id="by-modal-title" class="by-modal-title">Receber Catálogo & Condições Comerciais</h3>
            <p id="by-modal-subtitle" class="by-modal-subtitle">
              Preencha seus dados rápidos para liberarmos o catálogo atualizado e direcionar seu atendimento para um consultor comercial no WhatsApp.
            </p>
          </div>

          <form id="by-catalog-lead-form" class="by-lead-form">
            <div class="by-form-grid">
              <div class="by-field">
                <label for="lead-name">Seu Nome *</label>
                <input type="text" id="lead-name" name="name" required placeholder="Ex: Mariana Almeida">
              </div>
              <div class="by-field">
                <label for="lead-company">Empresa / Ateliê / Buffet *</label>
                <input type="text" id="lead-company" name="company" required placeholder="Ex: Almeida Decorações">
              </div>
            </div>

            <div class="by-form-grid">
              <div class="by-field">
                <label for="lead-whatsapp">WhatsApp com DDD *</label>
                <input type="tel" id="lead-whatsapp" name="whatsapp" required placeholder="(11) 99999-9999">
              </div>
              <div class="by-field">
                <label for="lead-segment">Área de Atuação *</label>
                <select id="lead-segment" name="segment" required>
                  <option value="" disabled selected>Selecione seu perfil...</option>
                  <option value="Decorador(a) de Festas e Eventos">Decorador(a) de Festas e Eventos</option>
                  <option value="Locadora de Mobiliário e Acervo">Locadora de Mobiliário e Acervo</option>
                  <option value="Buffet / Espaço de Eventos">Buffet / Espaço de Eventos</option>
                  <option value="Cerimonialista / Produtor(a)">Cerimonialista / Produtor(a)</option>
                  <option value="Lojista / Revenda de Decoração">Lojista / Revenda de Decoração</option>
                  <option value="Design de Interiores / Arquitetura">Design de Interiores / Arquitetura</option>
                  <option value="Outro Profissional">Outro Profissional</option>
                </select>
              </div>
            </div>

            <div class="by-form-grid">
              <div class="by-field">
                <label for="lead-city">Cidade *</label>
                <input type="text" id="lead-city" name="city" required placeholder="Ex: Ribeirão Preto">
              </div>
              <div class="by-field">
                <label for="lead-state">Estado (UF) *</label>
                <select id="lead-state" name="state" required>
                  <option value="" disabled selected>UF</option>
                  <option value="SP">SP - São Paulo</option>
                  <option value="MG">MG - Minas Gerais</option>
                  <option value="RJ">RJ - Rio de Janeiro</option>
                  <option value="PR">PR - Paraná</option>
                  <option value="SC">SC - Santa Catarina</option>
                  <option value="RS">RS - Rio Grande do Sul</option>
                  <option value="GO">GO - Goiás</option>
                  <option value="DF">DF - Distrito Federal</option>
                  <option value="MS">MS - Mato Grosso do Sul</option>
                  <option value="MT">MT - Mato Grosso</option>
                  <option value="BA">BA - Bahia</option>
                  <option value="PE">PE - Pernambuco</option>
                  <option value="CE">CE - Ceará</option>
                  <option value="ES">ES - Espírito Santo</option>
                  <option value="PA">PA - Pará</option>
                  <option value="AM">AM - Amazonas</option>
                  <option value="MA">MA - Maranhão</option>
                  <option value="PB">PB - Paraíba</option>
                  <option value="RN">RN - Rio Grande do Norte</option>
                  <option value="AL">AL - Alagoas</option>
                  <option value="SE">SE - Sergipe</option>
                  <option value="PI">PI - Piauí</option>
                  <option value="TO">TO - Tocantins</option>
                  <option value="RO">RO - Rondônia</option>
                  <option value="AC">AC - Acre</option>
                  <option value="AP">AP - Amapá</option>
                  <option value="RR">RR - Roraima</option>
                </select>
              </div>
            </div>

            <div class="by-field">
              <label for="lead-interest">Linha de Maior Interesse</label>
              <select id="lead-interest" name="interestCategory">
                <option value="Catálogo Completo Baytaka 2026">Catálogo Completo Baytaka 2026 (Todas as 14 Linhas)</option>
                <option value="Mesas - Base - Cavalete">01. Mesas, Bases e Cavaletes</option>
                <option value="Painéis - Arcos - Portais">02. Painéis, Arcos e Portais</option>
                <option value="Pergolado - Balanço - Gazebo - Carruagem">03. Pergolados, Balanços, Gazebos e Carruagens</option>
                <option value="Decoração de Mesa">04. Decoração de Mesa</option>
                <option value="Doceiras - Boleiras - Suportes">05. Doceiras, Boleiras e Suportes</option>
                <option value="Carrinho - Roda Gigante">06. Carrinhos Gourmet e Roda Gigante</option>
                <option value="Árvores - Topo">07. Árvores Escultóricas e Topos</option>
                <option value="Castiçal - Suportes Suspensos">08. Castiçais e Suportes Suspensos</option>
                <option value="Colunas - Gaiolas - Lanternas">09. Colunas, Gaiolas e Lanternas</option>
                <option value="Espaços Kids">10. Linha Espaço Kids</option>
                <option value="Vasos & Suportes para Arranjos e Velas">11. Vasos & Suportes para Arranjos e Velas</option>
                <option value="Cadeiras - Bancos - Poltrona - Banqueta - Jogo de Bistrô">12. Cadeiras, Bancos, Poltronas e Jogos de Bistrô</option>
                <option value="Móveis para Decoração e Interiores">13. Móveis para Decoração e Interiores</option>
                <option value="Igreja & Cerimônias">14. Linha Igreja & Cerimônias</option>
              </select>
            </div>

            <div id="by-modal-product-context" class="by-product-context-box" style="display:none;">
              <span>Peça selecionada: <strong id="by-context-prod-name"></strong></span>
            </div>

            <button type="submit" class="by-btn by-btn-primary by-btn-lg w-full">
              <span>Continuar para Atendimento no WhatsApp</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </button>
            <p class="by-privacy-notice">Seus dados estão seguros e são usados exclusivamente para atendimento comercial da fábrica Baytaka.</p>
          </form>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const backdrop = document.getElementById(this.modalId);
    const closeBtn = document.getElementById('by-modal-close-btn');
    const form = document.getElementById('by-catalog-lead-form');

    closeBtn?.addEventListener('click', () => this.close());
    backdrop?.addEventListener('click', (e) => {
      if (e.target === backdrop) this.close();
    });

    const phoneInput = document.getElementById('lead-whatsapp');
    phoneInput?.addEventListener('input', (e) => {
      let v = e.target.value.replace(/\D/g, '');
      if (v.length > 11) v = v.slice(0, 11);
      if (v.length > 7) {
        v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
      } else if (v.length > 2) {
        v = `(${v.slice(0,2)}) ${v.slice(2)}`;
      }
      e.target.value = v;
    });

    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit(form);
    });
  }

  bindTriggers() {
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-catalog-trigger]');
      if (!trigger) return;

      e.preventDefault();
      const prodId = trigger.getAttribute('data-product-id');
      const catSlug = trigger.getAttribute('data-category-slug');
      const customTitle = trigger.getAttribute('data-modal-title');

      this.open({ productId: prodId, categorySlug: catSlug, customTitle });
    });
  }

  open(options = {}) {
    const backdrop = document.getElementById(this.modalId);
    const prodContextBox = document.getElementById('by-modal-product-context');
    const prodNameEl = document.getElementById('by-context-prod-name');
    const interestSelect = document.getElementById('lead-interest');
    const modalTitle = document.getElementById('by-modal-title');

    this.contextProduct = null;
    this.contextCategory = null;

    if (options.customTitle) {
      modalTitle.textContent = options.customTitle;
    } else {
      modalTitle.textContent = 'Receber Catálogo & Condições Comerciais';
    }

    if (options.productId) {
      const prod = window.baytakaStore.getProductById(options.productId);
      if (prod) {
        this.contextProduct = prod;
        prodContextBox.style.display = 'block';
        prodNameEl.textContent = prod.name;
        const cat = window.baytakaStore.getCategoryBySlug(prod.category);
        if (cat) {
          this.contextCategory = cat.name;
          interestSelect.value = cat.name;
        }
      }
    } else {
      prodContextBox.style.display = 'none';
    }

    if (options.categorySlug && !this.contextProduct) {
      const cat = window.baytakaStore.getCategoryBySlug(options.categorySlug);
      if (cat) {
        this.contextCategory = cat.name;
        interestSelect.value = cat.name;
      }
    }

    backdrop.style.setProperty('display', 'flex', 'important');
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';

    if (window.baytakaTracker && typeof window.baytakaTracker.trackEvent === 'function') {
      window.baytakaTracker.trackEvent('modal_catalog_opened', {
        productName: this.contextProduct ? this.contextProduct.name : null,
        categoryName: this.contextCategory
      });
    }
  }

  close() {
    const backdrop = document.getElementById(this.modalId);
    if (backdrop) {
      backdrop.style.setProperty('display', 'none', 'important');
      backdrop.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  handleSubmit(form) {
    const formData = new FormData(form);
    const leadData = {
      name: formData.get('name').trim(),
      company: formData.get('company').trim(),
      whatsapp: formData.get('whatsapp').trim(),
      segment: formData.get('segment'),
      city: formData.get('city').trim(),
      state: formData.get('state'),
      interestCategory: formData.get('interestCategory'),
      productInterest: this.contextProduct ? this.contextProduct.name : null,
      sourceType: this.contextProduct ? 'Interesse em Peça Específica' : 'Solicitação de Catálogo Geral'
    };

    if (window.baytakaTracker && typeof window.baytakaTracker.registerCatalogLead === 'function') {
      window.baytakaTracker.registerCatalogLead(leadData);
    }

    let message = `Olá, equipe Baytaka! Meu nome é *${leadData.name}*, da empresa *${leadData.company}* (${leadData.segment}) de *${leadData.city}/${leadData.state}*.\n\n`;

    if (this.contextProduct) {
      const codeStr = this.contextProduct.code ? ` (Cód. ${this.contextProduct.code})` : '';
      message += `Gostaria de receber o catálogo atualizado e informações comerciais sobre a peça *${this.contextProduct.name}${codeStr}* e a linha de *${leadData.interestCategory}*.`;
    } else {
      message += `Gostaria de receber o *Catálogo Baytaka 2026* e conhecer as condições comerciais para *${leadData.interestCategory}*.`;
    }

    let whatsappUrl = 'https://wa.me/5519998044269?text=' + encodeURIComponent(message);
    if (window.baytakaTracker && typeof window.baytakaTracker.buildWhatsAppUrl === 'function') {
      whatsappUrl = window.baytakaTracker.buildWhatsAppUrl(message);
    }

    this.close();
    form.reset();
    window.open(whatsappUrl, '_blank');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.baytakaCatalogModal = new BaytakaCatalogModal();
});
