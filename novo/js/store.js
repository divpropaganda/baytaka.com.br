/**
 * BAYTAKA INTERIORES - DATA STORE LAYER (STATE MANAGEMENT)
 * Camada de gerenciamento de dados centralizada (LocalStorage + Initial Data)
 * Preparada para futura migração transparente para API/PostgreSQL.
 */

class BaytakaStore {
  constructor() {
    this.STORAGE_KEY = 'baytaka_showroom_db_v2026_clean_v5';
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

  // --- BAYTAKA PELO BRASIL / CASOS ---
  getBrazilCases() {
    if (this.data.brazilCases && this.data.brazilCases.length > 0) {
      return this.data.brazilCases;
    }
    return [
      {
        id: "case-sp",
        state: "SP",
        stateName: "São Paulo",
        city: "São Paulo / Campinas / Ribeirão Preto",
        client: "Festas & Acervos Prime",
        quote: "Compramos mais de 40 estruturas da Baytaka nos últimos 5 anos. O acabamento da pintura eletrostática suporta montagens semanais sem descascar. É investimento com retorno garantido.",
        productUsed: "Arcos Romeu, Trios Canelados e Gazebos",
        image: "assets/images/insp_arcos_casamento.jpg"
      },
      {
        id: "case-rj",
        state: "RJ",
        stateName: "Rio de Janeiro",
        city: "Rio de Janeiro / Petrópolis",
        client: "Lumière Locadora de Mobiliário",
        quote: "Em casamentos serranos em Petrópolis, a robustez das estruturas Baytaka nos dá tranquilidade até contra rajadas de vento em áreas abertas.",
        productUsed: "Gazebos Imperiais e Árvores Cerejeiras",
        image: "assets/images/insp_pergolado_casamento.jpg"
      },
      {
        id: "case-mg",
        state: "MG",
        stateName: "Minas Gerais",
        city: "Belo Horizonte / Uberlândia",
        client: "Minas Cenografia & Design",
        quote: "As doceiras e arcos são os itens mais solicitados no nosso catálogo. A resistência para transporte diário em caminhão é incomparável.",
        productUsed: "Doceiras Finas e Painéis Modulares",
        image: "assets/images/insp_mesas_festa.jpg"
      },
      {
        id: "case-pr",
        state: "PR",
        stateName: "Paraná",
        city: "Curitiba / Londrina / Maringá",
        client: "Ateliê Sul Eventos",
        quote: "O suporte pós-venda da fábrica e a padronização das peças facilitam muito quando precisamos repor ou ampliar o acervo para grandes formaturas.",
        productUsed: "Cadeiras Laço e Estantes de Cenografia",
        image: "assets/images/insp_kids_aniversario.jpg"
      },
      {
        id: "case-go",
        state: "GO",
        stateName: "Goiás",
        city: "Goiânia / Anápolis",
        client: "Celebrar Eventos & Cerimonial",
        quote: "Estruturas com pintura eletrostática perfeita e encaixes precisos. Os altares e capelas elevam o ticket médio das decorações de casamento.",
        productUsed: "Capela de Ferro e Arcos Catedrais",
        image: "assets/images/insp_capela_cerimonia.jpg"
      },
      {
        id: "case-rs",
        state: "RS",
        stateName: "Rio Grande do Sul",
        city: "Porto Alegre / Caxias do Sul",
        client: "Grand Gala Formaturas",
        quote: "Peças monumentais de alta estabilidade e acabamento premium. A Baytaka é nossa parceira estratégica há mais de 8 anos.",
        productUsed: "Árvores Francesas e Lustres de Ferro",
        image: "assets/images/insp_arvore_gala.jpg"
      },
      {
        id: "case-ba",
        state: "BA",
        stateName: "Bahia",
        city: "Salvador / Feira de Santana",
        client: "Bahia Decorações & Cenografia",
        quote: "Mobiliário impecável e atendimento rápido de fábrica. Nossas montagens de casamentos na praia ganharam outro nível com os arcos e gazebos.",
        productUsed: "Arcos Orgânicos e Gazebos para Praia",
        image: "assets/images/insp_arcos_casamento.jpg"
      },
      {
        id: "case-sc",
        state: "SC",
        stateName: "Santa Catarina",
        city: "Florianópolis / Balneário Camboriú / Joinville",
        client: "Litoral Sul Eventos",
        quote: "Estruturas resistentes com acabamento sofisticado. Perfeitas para eventos de alto padrão no litoral catarinense.",
        productUsed: "Gazebos, Pergolados e Mesas Orgânicas",
        image: "assets/images/insp_pergolado_casamento.jpg"
      }
    ];
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
