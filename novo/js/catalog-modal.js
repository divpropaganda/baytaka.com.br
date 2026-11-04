// Modal de Conversão e Roteamento de WhatsApp Comercial - Baytaka Interiores
(function() {
  'use strict';

  const BRAZIL_STATES = [
    { uf: 'AC', name: 'Acre' },
    { uf: 'AL', name: 'Alagoas' },
    { uf: 'AP', name: 'Amapá' },
    { uf: 'AM', name: 'Amazonas' },
    { uf: 'BA', name: 'Bahia' },
    { uf: 'CE', name: 'Ceará' },
    { uf: 'DF', name: 'Distrito Federal' },
    { uf: 'ES', name: 'Espírito Santo' },
    { uf: 'GO', name: 'Goiás' },
    { uf: 'MA', name: 'Maranhão' },
    { uf: 'MT', name: 'Mato Grosso' },
    { uf: 'MS', name: 'Mato Grosso do Sul' },
    { uf: 'MG', name: 'Minas Gerais' },
    { uf: 'PA', name: 'Pará' },
    { uf: 'PB', name: 'Paraíba' },
    { uf: 'PR', name: 'Paraná' },
    { uf: 'PE', name: 'Pernambuco' },
    { uf: 'PI', name: 'Piauí' },
    { uf: 'RJ', name: 'Rio de Janeiro' },
    { uf: 'RN', name: 'Rio Grande do Norte' },
    { uf: 'RS', name: 'Rio Grande do Sul' },
    { uf: 'RO', name: 'Rondônia' },
    { uf: 'RR', name: 'Roraima' },
    { uf: 'SC', name: 'Santa Catarina' },
    { uf: 'SP', name: 'São Paulo' },
    { uf: 'SE', name: 'Sergipe' },
    { uf: 'TO', name: 'Tocantins' }
  ];

  class CatalogModalController {
    constructor() {
      this.currentProduct = null;
      this.currentCategory = null;
      this.selectedChannel = 'retail'; // 'retail' | 'wholesale'
      this.initDom();
      this.bindEvents();
    }

    initDom() {
      if (document.getElementById('baytaka-catalog-modal')) return;

      const modalHtml = `
        <div id="baytaka-catalog-modal" class="by-modal-overlay" style="display:none;" aria-hidden="true" role="dialog">
          <div class="by-modal-box">
            <button type="button" class="by-modal-close" id="by-close-modal-btn" aria-label="Fechar modal">&times;</button>
            
            <div class="by-modal-header">
              <span class="by-modal-badge">Atendimento Comercial Direto</span>
              <h2 class="by-modal-title" id="by-modal-main-title">Como você deseja ser atendido?</h2>
              <p class="by-modal-subtitle" id="by-modal-main-sub">Selecione o canal para direcionarmos você ao WhatsApp correto da nossa equipe de fábrica.</p>
            </div>

            <!-- ETAPA 1: ESCOLHA ENTRE OS DOIS CANAIS DE WHATSAPP -->
            <div id="by-step-choice" class="by-step-content">
              <div class="by-channel-grid">
                <!-- CANAL 1: VAREJO & LOCADORAS -->
                <div class="by-channel-card" id="by-choose-retail">
                  <div class="by-channel-icon">
                    <svg viewBox="0 0 24 24" width="26" height="26" stroke="currentColor" fill="none" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                  </div>
                  <h3>1 — Atendimento Varejo</h3>
                  <p>Para decoradores, locadoras de festas, buffets e espaços de eventos comprando peças para o acervo diretamente com a fábrica.</p>
                  <button type="button" class="by-btn by-btn-primary w-full">Falar com o Varejo</button>
                </div>

                <!-- CANAL 2: ATACADO & GRANDES VOLUMES -->
                <div class="by-channel-card" id="by-choose-wholesale">
                  <div class="by-channel-icon">
                    <svg viewBox="0 0 24 24" width="26" height="26" stroke="currentColor" fill="none" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                  </div>
                  <h3>2 — Atendimento Atacado</h3>
                  <p>Para revendedores, distribuidores, lojistas e compras em grande escala de mobiliário e estruturas cenográficas.</p>
                  <button type="button" class="by-btn by-btn-outline w-full">Falar com o Atacado</button>
                </div>
              </div>
            </div>

            <!-- ETAPA 2: FORMULÁRIO RÁPIDO DE QUALIFICAÇÃO ANTES DO WHATSAPP -->
            <div id="by-step-form" class="by-step-content" style="display:none;">
              <button type="button" class="by-back-link" id="by-back-to-choice">← Escolher outro canal</button>
              
              <div id="by-channel-selected-alert" class="by-product-context-box" style="margin-bottom:14px; background:#F8FAFC; border-color:#CBD5E1;">
                <strong>Canal Selecionado:</strong> <span id="by-selected-channel-label">Atendimento Varejo</span>
              </div>

              <div id="by-rf-product-alert" class="by-product-context-box" style="display:none; margin-bottom:14px;">
                <strong>Peça de Interesse:</strong> <span id="by-rf-product-name"></span>
              </div>

              <form id="by-qualify-form" class="by-form-flow">
                <div class="by-form-grid">
                  <div class="by-field">
                    <label for="by-qf-name">Seu Nome Completo *</label>
                    <input type="text" id="by-qf-name" required placeholder="Ex: Patrícia Alves">
                  </div>
                  <div class="by-field">
                    <label for="by-qf-whatsapp">WhatsApp com DDD *</label>
                    <input type="tel" id="by-qf-whatsapp" required placeholder="(11) 99999-9999" maxlength="15">
                  </div>
                </div>

                <div class="by-form-grid">
                  <div class="by-field">
                    <label for="by-qf-state">Estado (UF) *</label>
                    <select id="by-qf-state" required>
                      <option value="">Selecione seu Estado</option>
                      ${BRAZIL_STATES.map(s => `<option value="${s.uf}">${s.name} (${s.uf})</option>`).join('')}
                    </select>
                  </div>
                  <div class="by-field">
                    <label for="by-qf-city">Sua Cidade *</label>
                    <input type="text" id="by-qf-city" required placeholder="Ex: Campinas">
                  </div>
                </div>

                <div class="by-field">
                  <label for="by-qf-segment">Qual é o seu perfil de atuação? *</label>
                  <select id="by-qf-segment" required>
                    <option value="">Selecione sua atuação</option>
                    <option value="Decorador profissional">Decorador profissional</option>
                    <option value="Locadora de mobiliários para festas">Locadora de mobiliários para festas</option>
                    <option value="Buffet / Espaço para eventos">Buffet / Espaço para eventos</option>
                    <option value="Produtor de eventos / Cenografia">Produtor de eventos / Cenografia</option>
                    <option value="Lojista / Revendedor / Distribuidor">Lojista / Revendedor / Distribuidor</option>
                    <option value="Consumidor direto">Consumidor que deseja comprar diretamente</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>

                <div class="by-field">
                  <label for="by-qf-category">Qual categoria mais interessa ao seu acervo? *</label>
                  <select id="by-qf-category" required>
                    <option value="">Selecione a categoria de maior interesse</option>
                  </select>
                </div>

                <button type="submit" class="by-btn by-btn-whatsapp-action w-full" style="padding:14px; font-size:0.95rem;">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.889 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.712 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  Iniciar Conversa no WhatsApp
                </button>

                <p class="by-privacy-notice">Ao clicar, abriremos diretamente o WhatsApp da fábrica com seus dados pré-configurados.</p>
              </form>
            </div>

          </div>
        </div>
      `;

      document.body.insertAdjacentHTML('beforeend', modalHtml);
      this.populateCategoryOptions();
    }

    populateCategoryOptions() {
      const select = document.getElementById('by-qf-category');
      if (!select) return;
      const categories = window.baytakaStore.getCategories();
      select.innerHTML = '<option value="">Selecione a categoria de maior interesse</option>' +
        categories.map(c => `<option value="${c.name}">${c.name}</option>`).join('');
    }

    bindEvents() {
      const modal = document.getElementById('baytaka-catalog-modal');
      const closeBtn = document.getElementById('by-close-modal-btn');
      const btnRetail = document.getElementById('by-choose-retail');
      const btnWholesale = document.getElementById('by-choose-wholesale');
      const backBtn = document.getElementById('by-back-to-choice');
      const form = document.getElementById('by-qualify-form');
      const phoneInput = document.getElementById('by-qf-whatsapp');

      if (closeBtn) closeBtn.addEventListener('click', () => this.close());
      
      if (modal) {
        modal.addEventListener('click', (e) => {
          if (e.target === modal) this.close();
        });
      }

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.style.display !== 'none') {
          this.close();
        }
      });

      if (btnRetail) {
        btnRetail.addEventListener('click', () => this.goToForm('retail'));
      }
      if (btnWholesale) {
        btnWholesale.addEventListener('click', () => this.goToForm('wholesale'));
      }

      if (backBtn) {
        backBtn.addEventListener('click', () => this.goToChoice());
      }

      // Máscara de telefone WhatsApp
      if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
          let v = e.target.value.replace(/\D/g, '');
          if (v.length > 11) v = v.substring(0, 11);
          if (v.length > 6) {
            e.target.value = `(${v.substring(0, 2)}) ${v.substring(2, 7)}-${v.substring(7)}`;
          } else if (v.length > 2) {
            e.target.value = `(${v.substring(0, 2)}) ${v.substring(2)}`;
          } else if (v.length > 0) {
            e.target.value = `(${v}`;
          }
        });
      }

      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          this.handleSubmit();
        });
      }

      // Interceptador global para botões data-catalog-trigger
      document.addEventListener('click', (e) => {
        const trigger = e.target.closest('[data-catalog-trigger]');
        if (trigger) {
          e.preventDefault();
          const prodId = trigger.getAttribute('data-product-id');
          const catSlug = trigger.getAttribute('data-category-slug');
          this.open({ productId: prodId, categorySlug: catSlug });
        }
      });
    }

    open(options = {}) {
      const modal = document.getElementById('baytaka-catalog-modal');
      if (!modal) return;

      this.currentProduct = null;
      this.currentCategory = null;

      if (options.productId) {
        this.currentProduct = window.baytakaStore.getProductById(options.productId);
      }
      if (options.categorySlug) {
        this.currentCategory = window.baytakaStore.getCategoryBySlug(options.categorySlug);
      }

      const prodAlert = document.getElementById('by-rf-product-alert');
      const prodName = document.getElementById('by-rf-product-name');
      const catSelect = document.getElementById('by-qf-category');

      if (this.currentProduct) {
        if (prodAlert) prodAlert.style.display = 'block';
        if (prodName) prodName.textContent = this.currentProduct.name;
        if (catSelect) {
          const cat = window.baytakaStore.getCategoryBySlug(this.currentProduct.category);
          if (cat) catSelect.value = cat.name;
        }
      } else {
        if (prodAlert) prodAlert.style.display = 'none';
        if (this.currentCategory && catSelect) {
          catSelect.value = this.currentCategory.name;
        }
      }

      this.goToChoice();
      modal.style.display = 'flex';
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      window.baytakaTracker.trackCatalogRequest('opened_modal', 'selection');
    }

    close() {
      const modal = document.getElementById('baytaka-catalog-modal');
      if (!modal) return;
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    goToChoice() {
      document.getElementById('by-step-choice').style.display = 'block';
      document.getElementById('by-step-form').style.display = 'none';
      document.getElementById('by-modal-main-title').textContent = 'Como você deseja ser atendido?';
      document.getElementById('by-modal-main-sub').textContent = 'Selecione o canal para direcionarmos você ao WhatsApp correto da nossa equipe de fábrica.';
    }

    goToForm(channel) {
      this.selectedChannel = channel;
      document.getElementById('by-step-choice').style.display = 'none';
      document.getElementById('by-step-form').style.display = 'block';

      const label = document.getElementById('by-selected-channel-label');
      if (channel === 'retail') {
        document.getElementById('by-modal-main-title').textContent = 'Atendimento Varejo & Locadoras';
        document.getElementById('by-modal-main-sub').textContent = 'Preencha seus dados para receber o catálogo e atendimento consultivo da fábrica.';
        if (label) label.textContent = '1 — Varejo & Locadoras de Festas';
      } else {
        document.getElementById('by-modal-main-title').textContent = 'Atendimento Atacado & Revenda';
        document.getElementById('by-modal-main-sub').textContent = 'Condições diferenciadas para lojistas, revendedores e compras em escala.';
        if (label) label.textContent = '2 — Atacado & Compras em Escala';
      }

      window.baytakaTracker.trackCatalogRequest('step_form', channel);
    }

    handleSubmit() {
      const name = document.getElementById('by-qf-name').value.trim();
      const whatsapp = document.getElementById('by-qf-whatsapp').value.trim();
      const state = document.getElementById('by-qf-state').value;
      const city = document.getElementById('by-qf-city').value.trim();
      const segment = document.getElementById('by-qf-segment').value;
      const categoryInterest = document.getElementById('by-qf-category').value;

      if (!name || !whatsapp || !state || !city || !segment || !categoryInterest) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
      }

      const channelName = this.selectedChannel === 'retail' ? 'Varejo & Locadoras' : 'Atacado & Revenda';

      // Salva o lead no CRM
      const leadPayload = {
        name,
        whatsapp,
        city,
        state,
        segment,
        categoryInterest,
        channel: channelName,
        productContext: this.currentProduct ? this.currentProduct.name : null
      };

      window.baytakaStore.addLead(leadPayload);
      window.baytakaTracker.trackRetailLead(leadPayload);

      // Define o número de WhatsApp correto de acordo com a escolha:
      const settings = window.baytakaStore.getSettings();
      const targetPhone = this.selectedChannel === 'retail' 
        ? (settings.whatsappRetail || "5519998418000")
        : (settings.whatsappWholesale || "5519998418002");

      let msg = "";
      if (this.currentProduct) {
        msg = `Olá! Conheci o ${this.currentProduct.name} pelo site da Baytaka e gostaria de receber o catálogo e cotação.\n\n` +
              `Canal: ${channelName}\n` +
              `Nome: ${name}\n` +
              `Cidade/UF: ${city}/${state}\n` +
              `Segmento: ${segment}\n` +
              `Interesse: ${categoryInterest}`;
      } else {
        msg = `Olá! Conheci a Baytaka pelo site e gostaria de atendimento comercial e catálogo.\n\n` +
              `Canal: ${channelName}\n` +
              `Nome: ${name}\n` +
              `Cidade/UF: ${city}/${state}\n` +
              `Segmento: ${segment}\n` +
              `Interesse: ${categoryInterest}`;
      }

      window.baytakaTracker.trackWhatsAppClick(targetPhone, this.selectedChannel, { customer_name: name });

      const whatsappUrl = `https://api.whatsapp.com/send?phone=${targetPhone}&text=${encodeURIComponent(msg)}`;

      window.open(whatsappUrl, '_blank');
      this.close();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.baytakaCatalogModal = new CatalogModalController();
    });
  } else {
    window.baytakaCatalogModal = new CatalogModalController();
  }
})();
