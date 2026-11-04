// Botão Flutuante de WhatsApp Inteligente - Baytaka Interiores
(function() {
  'use strict';

  function initFloatingWhatsApp() {
    if (document.getElementById('baytaka-float-wa-container')) return;

    const html = `
      <div id="baytaka-float-wa-container" class="by-wa-wrapper">
        <!-- POPUP COM OPÇÕES DE ATENDIMENTO -->
        <div id="by-wa-menu-popup" class="by-wa-popup" style="display:none;" aria-hidden="true">
          <div class="by-wa-popup-header">
            <div class="by-wa-brand-avatar">
              <span>B</span>
            </div>
            <div>
              <h4 class="by-wa-popup-title">Como podemos ajudar?</h4>
              <p class="by-wa-popup-sub">Selecione o canal para atendimento no WhatsApp:</p>
            </div>
            <button type="button" id="by-wa-close-btn" class="by-wa-popup-close">&times;</button>
          </div>

          <div class="by-wa-options-list">
            <!-- OPÇÃO 1: VAREJO & LOCADORAS -->
            <button type="button" class="by-wa-opt-item" id="by-wa-opt-retail">
              <span class="by-wa-opt-icon">🏷️</span>
              <div class="by-wa-opt-text">
                <strong>Varejo & Locadoras de Festas</strong>
                <small>Decoradores e buffets comprando direto da fábrica</small>
              </div>
            </button>

            <!-- OPÇÃO 2: ATACADO & REVENDA -->
            <button type="button" class="by-wa-opt-item" id="by-wa-opt-wholesale">
              <span class="by-wa-opt-icon">🏢</span>
              <div class="by-wa-opt-text">
                <strong>Atacado & Lojistas (Grandes Lotes)</strong>
                <small>Condições especiais para revenda e escala</small>
              </div>
            </button>

            <!-- OPÇÃO 3: JÁ SOU CLIENTE -->
            <button type="button" class="by-wa-opt-item" id="by-wa-opt-existing">
              <span class="by-wa-opt-icon">📦</span>
              <div class="by-wa-opt-text">
                <strong>Já Sou Cliente / Pós-Venda</strong>
                <small>Acompanhar produção, expedição ou suporte</small>
              </div>
            </button>
          </div>

          <div class="by-wa-popup-footer">
            <span>Fábrica em Porto Ferreira, SP • Atendimento Nacional</span>
          </div>
        </div>

        <!-- BOTÃO FLUTUANTE PULSANTE -->
        <button type="button" id="by-wa-main-trigger" class="by-wa-trigger-btn" aria-label="Abrir canais de WhatsApp">
          <span class="by-wa-pulse-ring"></span>
          <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.889 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.712 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        </button>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', html);

    const triggerBtn = document.getElementById('by-wa-main-trigger');
    const popup = document.getElementById('by-wa-menu-popup');
    const closeBtn = document.getElementById('by-wa-close-btn');

    const optRetail = document.getElementById('by-wa-opt-retail');
    const optWholesale = document.getElementById('by-wa-opt-wholesale');
    const optExisting = document.getElementById('by-wa-opt-existing');

    function togglePopup() {
      const isVisible = popup.style.display === 'block';
      popup.style.display = isVisible ? 'none' : 'block';
      popup.setAttribute('aria-hidden', isVisible ? 'true' : 'false');
    }

    triggerBtn.addEventListener('click', togglePopup);
    closeBtn.addEventListener('click', () => {
      popup.style.display = 'none';
      popup.setAttribute('aria-hidden', 'true');
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('#baytaka-float-wa-container')) {
        popup.style.display = 'none';
        popup.setAttribute('aria-hidden', 'true');
      }
    });

    // Opção 1: Varejo -> Abre o WhatsApp Varejo direto ou modal
    optRetail.addEventListener('click', () => {
      popup.style.display = 'none';
      const settings = window.baytakaStore ? window.baytakaStore.getSettings() : {};
      const phone = settings.whatsappRetail || "5519998418000";
      const msg = "Olá! Conheci a Baytaka pelo site e gostaria de atendimento para Varejo / Acervo de Locadora.";
      window.baytakaTracker.trackWhatsAppClick(phone, 'retail_direct');
      window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(msg)}`, '_blank');
    });

    // Opção 2: Atacado & Revenda -> Abre o WhatsApp Atacado direto
    optWholesale.addEventListener('click', () => {
      popup.style.display = 'none';
      const settings = window.baytakaStore ? window.baytakaStore.getSettings() : {};
      const phone = settings.whatsappWholesale || "5519998418002";
      const msg = "Olá! Gostaria de informações sobre compras em Atacado / Revenda de estruturas Baytaka.";
      window.baytakaTracker.trackWhatsAppClick(phone, 'wholesale_direct');
      window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(msg)}`, '_blank');
    });

    // Opção 3: Já sou cliente -> WhatsApp Pós-Venda
    optExisting.addEventListener('click', () => {
      popup.style.display = 'none';
      const settings = window.baytakaStore ? window.baytakaStore.getSettings() : {};
      const phone = settings.whatsappGeneral || "5519998418000";
      const msg = "Olá! Já sou cliente da Baytaka e gostaria de falar com o suporte/pós-venda sobre um pedido.";
      window.baytakaTracker.trackWhatsAppClick(phone, 'existing_customer');
      window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(msg)}`, '_blank');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFloatingWhatsApp);
  } else {
    initFloatingWhatsApp();
  }
})();
