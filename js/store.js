// Gerenciador de Estado e Persistência do Showroom Baytaka Interiores
class BaytakaStore {
  constructor() {
    this.STORAGE_KEY = 'baytaka_showroom_db_v2';
    this.init();
  }

  init() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) {
        this.data = window.BAYTAKA_INITIAL_DATA ? JSON.parse(JSON.stringify(window.BAYTAKA_INITIAL_DATA)) : {};
        this.save();
      } else {
        this.data = JSON.parse(stored);
        if (window.BAYTAKA_INITIAL_DATA) {
          if (!this.data.leads) this.data.leads = window.BAYTAKA_INITIAL_DATA.leads || [];
          if (!this.data.settings) this.data.settings = window.BAYTAKA_INITIAL_DATA.settings || {};
          // Atualiza novas chaves de whatsapp se não existirem
          if (!this.data.settings.whatsappWholesale) {
            this.data.settings.whatsappWholesale = window.BAYTAKA_INITIAL_DATA.settings.whatsappWholesale;
          }
          // Garante que imagens de categorias usem caminhos atualizados
          if (this.data.categories) {
            this.data.categories.forEach(c => {
              const fresh = window.BAYTAKA_INITIAL_DATA.categories.find(fc => fc.id === c.id);
              if (fresh) c.image = fresh.image;
            });
          }
        }
      }
    } catch (e) {
      console.error("Erro ao carregar dados do localStorage:", e);
      this.data = window.BAYTAKA_INITIAL_DATA ? JSON.parse(JSON.stringify(window.BAYTAKA_INITIAL_DATA)) : {};
    }
  }

  save() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.error("Erro ao salvar dados no localStorage:", e);
    }
  }

  resetToDefaults() {
    if (window.BAYTAKA_INITIAL_DATA) {
      this.data = JSON.parse(JSON.stringify(window.BAYTAKA_INITIAL_DATA));
      this.save();
      return true;
    }
    return false;
  }

  // --- CONFIGURAÇÕES ---
  getSettings() {
    return this.data.settings || {};
  }

  saveSettings(newSettings) {
    this.data.settings = { ...this.data.settings, ...newSettings };
    this.save();
    return this.data.settings;
  }

  // --- CATEGORIAS ---
  getCategories() {
    return this.data.categories || [];
  }

  getCategoryBySlug(slug) {
    return this.getCategories().find(c => c.slug === slug || c.id === slug);
  }

  saveCategory(category) {
    if (!category.id) {
      category.id = this.slugify(category.name);
      category.slug = category.id;
      this.data.categories.push(category);
    } else {
      const idx = this.data.categories.findIndex(c => c.id === category.id);
      if (idx !== -1) {
        this.data.categories[idx] = { ...this.data.categories[idx], ...category };
      } else {
        this.data.categories.push(category);
      }
    }
    this.save();
    return category;
  }

  deleteCategory(id) {
    this.data.categories = this.data.categories.filter(c => c.id !== id);
    this.save();
  }

  // --- PRODUTOS ---
  getProducts() {
    return this.data.products || [];
  }

  getProductById(id) {
    return this.getProducts().find(p => p.id === id);
  }

  getProductsByCategory(catSlug) {
    if (!catSlug || catSlug === 'todos') return this.getProducts();
    return this.getProducts().filter(p => p.category === catSlug);
  }

  getFeaturedProducts() {
    return this.getProducts().filter(p => p.featured);
  }

  saveProduct(product) {
    if (!product.id) {
      product.id = 'prod-' + Date.now();
      this.data.products.push(product);
    } else {
      const idx = this.data.products.findIndex(p => p.id === product.id);
      if (idx !== -1) {
        this.data.products[idx] = { ...this.data.products[idx], ...product };
      } else {
        this.data.products.push(product);
      }
    }
    this.save();
    return product;
  }

  deleteProduct(id) {
    this.data.products = this.data.products.filter(p => p.id !== id);
    this.save();
  }

  // --- INSPIRAÇÕES ---
  getInspirations() {
    return this.data.inspirations || [];
  }

  saveInspiration(item) {
    if (!item.id) {
      item.id = 'insp-' + Date.now();
      this.data.inspirations.push(item);
    } else {
      const idx = this.data.inspirations.findIndex(i => i.id === item.id);
      if (idx !== -1) {
        this.data.inspirations[idx] = { ...this.data.inspirations[idx], ...item };
      } else {
        this.data.inspirations.push(item);
      }
    }
    this.save();
    return item;
  }

  deleteInspiration(id) {
    this.data.inspirations = this.data.inspirations.filter(i => i.id !== id);
    this.save();
  }

  // --- BAYTAKA PELO BRASIL ---
  getBrazilCases() {
    return this.data.brazilCases || [];
  }

  saveBrazilCase(item) {
    if (!item.id) {
      item.id = 'case-' + Date.now();
      this.data.brazilCases.push(item);
    } else {
      const idx = this.data.brazilCases.findIndex(c => c.id === item.id);
      if (idx !== -1) {
        this.data.brazilCases[idx] = { ...this.data.brazilCases[idx], ...item };
      } else {
        this.data.brazilCases.push(item);
      }
    }
    this.save();
    return item;
  }

  deleteBrazilCase(id) {
    this.data.brazilCases = this.data.brazilCases.filter(c => c.id !== id);
    this.save();
  }

  // --- REPRESENTANTES ---
  getRepresentatives() {
    return this.data.representatives || [];
  }

  findRepresentative(stateUf, cityName) {
    if (!stateUf) return null;
    const ufUpper = stateUf.trim().toUpperCase();
    const cityClean = (cityName || '').trim().toLowerCase();

    const reps = this.getRepresentatives().filter(r => r.active && r.states && r.states.includes(ufUpper));

    if (reps.length === 0) return null;

    // Se informou cidade, tenta achar o representante específico dessa cidade
    if (cityClean) {
      const specific = reps.find(r => r.cities && r.cities.some(c => c.toLowerCase().includes(cityClean)));
      if (specific) return specific;
    }

    // Se não encontrou cidade específica ou não informou, retorna o primeiro da UF
    return reps[0];
  }

  saveRepresentative(rep) {
    if (!rep.id) {
      rep.id = 'rep-' + Date.now();
      this.data.representatives.push(rep);
    } else {
      const idx = this.data.representatives.findIndex(r => r.id === rep.id);
      if (idx !== -1) {
        this.data.representatives[idx] = { ...this.data.representatives[idx], ...rep };
      } else {
        this.data.representatives.push(rep);
      }
    }
    this.save();
    return rep;
  }

  deleteRepresentative(id) {
    this.data.representatives = this.data.representatives.filter(r => r.id !== id);
    this.save();
  }

  // --- LEADS & CRM ---
  getLeads() {
    return this.data.leads || [];
  }

  addLead(lead) {
    if (!this.data.leads) this.data.leads = [];
    const newLead = {
      id: 'lead-' + Date.now(),
      date: new Date().toISOString(),
      status: 'Novo',
      ...lead
    };
    this.data.leads.unshift(newLead);
    this.save();
    return newLead;
  }

  updateLeadStatus(id, newStatus) {
    const lead = this.data.leads.find(l => l.id === id);
    if (lead) {
      lead.status = newStatus;
      this.save();
    }
  }

  deleteLead(id) {
    this.data.leads = this.data.leads.filter(l => l.id !== id);
    this.save();
  }

  exportLeadsCSV() {
    const leads = this.getLeads();
    if (!leads.length) return '';

    const headers = ["ID", "Data", "Nome", "WhatsApp", "Cidade", "UF", "Segmento", "Interesse", "Canal", "Status"];
    const rows = leads.map(l => [
      l.id,
      new Date(l.date).toLocaleString('pt-BR'),
      `"${(l.name || '').replace(/"/g, '""')}"`,
      `"${l.whatsapp || ''}"`,
      `"${l.city || ''}"`,
      `"${l.state || ''}"`,
      `"${l.segment || ''}"`,
      `"${l.categoryInterest || ''}"`,
      `"${l.channel || ''}"`,
      `"${l.status || ''}"`
    ]);

    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }

  // --- HELPERS ---
  slugify(text) {
    return text.toString().toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  }
}

// Instância global única
window.baytakaStore = new BaytakaStore();
