/**
 * BAYTAKA INTERIORES - DATA STORE LAYER (STATE MANAGEMENT)
 * Camada de gerenciamento de dados centralizada (LocalStorage + Initial Data)
 * Preparada para futura migração transparente para API/PostgreSQL.
 */

class BaytakaStore {
  constructor() {
    this.STORAGE_KEY = 'baytaka_showroom_db_v2026_clean_v4';
    this.data = this.init();
  }

  init() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Sempre sincroniza categorias e produtos do Catálogo 2026 oficial sem preços
        if (window.BAYTAKA_INITIAL_DATA) {
          parsed.categories = JSON.parse(JSON.stringify(window.BAYTAKA_INITIAL_DATA.categories || []));
          parsed.products = JSON.parse(JSON.stringify(window.BAYTAKA_INITIAL_DATA.products || []));
        }
        return parsed;
      } catch (e) {
        console.error('Erro ao ler banco local Baytaka, restaurando padrão:', e);
      }
    }
    const initial = JSON.parse(JSON.stringify(window.BAYTAKA_INITIAL_DATA));
    this.save(initial);
    return initial;
  }

  save(newData = this.data) {
    this.data = newData;
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.warn('LocalStorage cheio ou indisponível, mantendo em memória:', e);
    }
  }

  resetToDefault() {
    localStorage.removeItem(this.STORAGE_KEY);
    this.data = JSON.parse(JSON.stringify(window.BAYTAKA_INITIAL_DATA));
    this.save(this.data);
    return this.data;
  }

  // --- CONFIGURAÇÕES ---
  getConfig() {
    return this.data.config;
  }

  updateConfig(newConfig) {
    this.data.config = { ...this.data.config, ...newConfig };
    this.save();
    return this.data.config;
  }

  // --- CATEGORIAS ---
  getCategories(onlyActive = true) {
    const list = this.data.categories || [];
    const filtered = onlyActive ? list.filter(c => c.active !== false) : list;
    return filtered.sort((a, b) => (a.order || 99) - (b.order || 99));
  }

  getCategoryBySlug(slug) {
    return (this.data.categories || []).find(c => c.slug === slug || c.id === slug);
  }

  // --- PRODUTOS ---
  getProducts(onlyActive = true) {
    const list = this.data.products || [];
    return onlyActive ? list.filter(p => p.active !== false) : list;
  }

  getFeaturedProducts() {
    return this.getProducts(true).filter(p => p.featured);
  }

  getNewProducts() {
    return this.getProducts(true).filter(p => p.isNew);
  }

  getProductsByCategory(categorySlug) {
    if (!categorySlug || categorySlug === 'todos') return this.getProducts(true);
    return this.getProducts(true).filter(p => p.category === categorySlug);
  }

  getProductById(id) {
    return (this.data.products || []).find(p => p.id === id);
  }

  saveProduct(productData) {
    const list = this.data.products || [];
    const index = list.findIndex(p => p.id === productData.id);
    if (index >= 0) {
      list[index] = { ...list[index], ...productData };
    } else {
      const newProd = {
        ...productData,
        id: productData.id || 'prod-' + Date.now(),
        active: productData.active !== undefined ? productData.active : true
      };
      list.unshift(newProd);
    }
    this.save();
  }

  deleteProduct(id) {
    this.data.products = (this.data.products || []).filter(p => p.id !== id);
    this.save();
  }

  // --- INSPIRAÇÕES ---
  getInspirations() {
    return this.data.inspirations || [];
  }

  saveInspiration(item) {
    const list = this.data.inspirations || [];
    const idx = list.findIndex(i => i.id === item.id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...item };
    } else {
      list.unshift({ ...item, id: 'insp-' + Date.now() });
    }
    this.save();
  }

  deleteInspiration(id) {
    this.data.inspirations = (this.data.inspirations || []).filter(i => i.id !== id);
    this.save();
  }

  // --- DEPOIMENTOS ---
  getTestimonials() {
    return this.data.testimonials || [];
  }

  // --- ESTADOS / PRESENÇA NACIONAL ---
  getStatesPresence() {
    return this.data.statesPresence || [];
  }

  getStateByUF(uf) {
    return (this.data.statesPresence || []).find(s => s.uf.toUpperCase() === uf.toUpperCase());
  }

  // --- LEADS & EVENTOS DE RASTREAMENTO ---
  getLeads() {
    return (this.data.leads || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  addLead(leadObj) {
    if (!this.data.leads) this.data.leads = [];
    const newLead = {
      id: 'lead-' + Date.now(),
      createdAt: new Date().toISOString(),
      status: 'Novo',
      ...leadObj
    };
    this.data.leads.unshift(newLead);
    this.save();
    return newLead;
  }

  getTrackingEvents() {
    return (this.data.trackingEvents || []).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  addTrackingEvent(eventObj) {
    if (!this.data.trackingEvents) this.data.trackingEvents = [];
    this.data.trackingEvents.unshift({
      id: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      timestamp: new Date().toISOString(),
      ...eventObj
    });
    // Limita histórico local a 500 eventos para performance
    if (this.data.trackingEvents.length > 500) {
      this.data.trackingEvents = this.data.trackingEvents.slice(0, 500);
    }
    this.save();
  }

  clearLeadsAndEvents() {
    this.data.leads = [];
    this.data.trackingEvents = [];
    this.save();
  }
}

window.baytakaStore = new BaytakaStore();
