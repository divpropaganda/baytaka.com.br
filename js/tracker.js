// Sistema de Rastreamento de Conversões e Eventos Comerciais - Baytaka Interiores
(function(window) {
  'use strict';

  // Captura automática de parâmetros UTM da URL e Referrer
  function getUrlParams() {
    const params = {};
    const searchParams = new URLSearchParams(window.location.search);
    for (const [key, value] of searchParams.entries()) {
      if (key.startsWith('utm_') || key === 'src' || key === 'ref') {
        params[key] = value;
      }
    }
    return params;
  }

  // Armazena UTMs na sessão do usuário
  const utmParams = getUrlParams();
  if (Object.keys(utmParams).length > 0) {
    try {
      sessionStorage.setItem('baytaka_utm_params', JSON.stringify(utmParams));
    } catch (e) {}
  }

  function getStoredUtms() {
    try {
      const stored = sessionStorage.getItem('baytaka_utm_params');
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      return {};
    }
  }

  // Inicializa dataLayer se não existir
  window.dataLayer = window.dataLayer || [];

  const BaytakaTracker = {
    getTrackingContext() {
      return {
        timestamp: new Date().toISOString(),
        url: window.location.href,
        referrer: document.referrer || 'direto',
        ...getStoredUtms()
      };
    },

    track(eventName, customData = {}) {
      const payload = {
        event: eventName,
        event_time: Math.floor(Date.now() / 1000),
        ...this.getTrackingContext(),
        ...customData
      };

      // 1. Google Tag Manager / GA4 dataLayer push
      window.dataLayer.push(payload);

      // 2. Google Analytics 4 (se gtag estiver carregado)
      if (typeof window.gtag === 'function') {
        window.gtag('event', eventName, customData);
      }

      // 3. Meta Pixel (se fbq estiver carregado)
      if (typeof window.fbq === 'function') {
        if (eventName === 'catalog_request' || eventName === 'retail_lead') {
          window.fbq('track', 'Lead', customData);
        } else if (eventName === 'product_view') {
          window.fbq('track', 'ViewContent', customData);
        } else {
          window.fbq('trackCustom', eventName, customData);
        }
      }

      // 4. Log para validação no console
      console.log(`[Baytaka Tracker] 🎯 Evento: "${eventName}"`, payload);
    },

    // Helpers específicos para os fluxos exigidos:
    trackCatalogRequest(step, channel) {
      this.track('catalog_request', { step, channel });
    },

    trackWhatsAppClick(targetNumber, messageType, context = {}) {
      this.track('whatsapp_click', {
        target_number: targetNumber,
        message_type: messageType,
        ...context
      });
    },

    trackRetailLead(leadData) {
      this.track('retail_lead', {
        segment: leadData.segment,
        category: leadData.categoryInterest,
        city: leadData.city,
        state: leadData.state
      });
    },

    trackRepresentativeLead(repData, customerLocation) {
      this.track('representative_lead', {
        rep_name: repData.name,
        rep_code: repData.code,
        customer_city: customerLocation.city,
        customer_state: customerLocation.state
      });
    },

    trackProductView(product) {
      this.track('product_view', {
        product_id: product.id,
        product_name: product.name,
        category: product.category
      });
    },

    trackCategoryView(category) {
      this.track('category_view', {
        category_id: category.id,
        category_name: category.name
      });
    },

    trackRepresentativeSearch(state, city, found) {
      this.track('representative_search', {
        state: state,
        city: city,
        found_representative: found
      });
    },

    trackContactForm(formData) {
      this.track('contact_form', {
        interest: formData.interest,
        city: formData.city,
        state: formData.state
      });
    }
  };

  window.baytakaTracker = BaytakaTracker;
})(window);
