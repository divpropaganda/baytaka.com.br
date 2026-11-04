// Dados Iniciais e Estrutura do Showroom Baytaka Interiores
const BAYTAKA_INITIAL_DATA = {
  settings: {
    companyName: "Baytaka Interiores",
    tagline: "Peças que dão forma a grandes projetos",
    phone: "(19) 3581-2200",
    whatsappRetail: "5519998418000",   // WhatsApp Varejo & Locadoras (Matriz)
    whatsappWholesale: "5519998418002", // WhatsApp Atacado, Lojistas & Revenda
    whatsappGeneral: "5519998418000",   // Atendimento Geral / Pós-venda
    email: "comercial@baytaka.com.br",
    address: "Polo de Decoração e Eventos - Porto Ferreira, SP - Brasil",
    experienceYears: "40+",
    instagramUrl: "https://www.instagram.com/baytaka.interiores/",
    facebookUrl: "https://www.facebook.com/baytaka.interiores/",
    pinterestUrl: "https://br.pinterest.com/baytakainteriores/",
    youtubeUrl: "https://www.youtube.com/@baytakainteriores"
  },
  
  categories: [
    {
      id: "arcos-e-portais",
      name: "Arcos e Portais",
      slug: "arcos-e-portais",
      shortDesc: "Estruturas arquitetônicas pensadas para alta cenografia, cerimônias e recepções.",
      fullDesc: "Os arcos e portais Baytaka são desenvolvidos para decoradores que buscam criar pontos focais inesquecíveis. Com engenharia desmontável de fácil transporte e pintura eletrostática de alta durabilidade, ampliam as possibilidades do seu acervo a cada montagem.",
      image: "assets/images/cat_arcos.jpg",
      itemCount: 18,
      featured: true
    },
    {
      id: "arvores-e-topos",
      name: "Árvores e Topos",
      slug: "arvores-e-topos",
      shortDesc: "Estruturas imponentes de árvores francesas, cerejeiras e copas para centros de salão.",
      fullDesc: "Crie ambientações de conto de fadas e cenografias monumentais com as estruturas metálicas de árvores Baytaka. Fabricadas para suportar folhagens, flores de cerejeira e iluminação cênica com total estabilidade.",
      image: "assets/images/cat_arvores.jpg",
      itemCount: 12,
      featured: true
    },
    {
      id: "mesas-e-bases",
      name: "Mesas e Bases",
      slug: "mesas-e-bases",
      shortDesc: "Trios ripados, cilindros, mesas orgânicas e bases modulares com acabamento nobre.",
      fullDesc: "Mobiliário projetado especificamente para a rotina intensa de montagem e desmontagem. Acabamento fino em pintura a pó automotiva, tampos nobres e encaixes de alta precisão que garantem longevidade e sofisticação.",
      image: "assets/images/cat_mesas.jpg",
      itemCount: 24,
      featured: true
    },
    {
      id: "gazebos-e-estruturas",
      name: "Gazebos e Estruturas",
      slug: "gazebos-e-estruturas",
      shortDesc: "Tendas abobadadas, gazebos de ferro e pórticos monumentais para celebrações ao ar livre.",
      fullDesc: "Estruturas de grande porte com encaixes modulares resistentes para eventos externos e salões nobres. Valorizam altares, ilhas gastronômicas e lounges com desenho clássico e contemporâneo.",
      image: "assets/images/cat_gazebos.jpg",
      itemCount: 9,
      featured: true
    },
    {
      id: "cadeiras-e-mobiliarios",
      name: "Cadeiras e Mobiliários",
      slug: "cadeiras-e-mobiliarios",
      shortDesc: "Cadeiras de design, bistrôs de ferro, aparadores e banquetas para eventos refinados.",
      fullDesc: "Ergonomia, elegância e robustez mecânica para locadoras que exigem peças empilháveis, leves e com resistência a anos de locações recorrentes.",
      image: "assets/images/cat_cadeiras.jpg",
      itemCount: 16,
      featured: true
    },
    {
      id: "doceiras-e-suportes",
      name: "Doceiras, Boleiras e Suportes",
      slug: "doceiras-e-suportes",
      shortDesc: "Kits de suportes em metal torneado, vidro e espelho para mesas de bolo e doces finos.",
      fullDesc: "Detalhes milimétricos que transformam a mesa principal. Variedade de alturas, pratos em relevo e composições harmoniosas para confeitaria artística e decoradores.",
      image: "assets/images/cat_doceiras.jpg",
      itemCount: 30,
      featured: true
    },
    {
      id: "carrinhos-e-especiais",
      name: "Carrinhos e Estruturas Especiais",
      slug: "carrinhos-e-especiais",
      shortDesc: "Carrinhos gourmet, charretes temáticas, ilhas móveis de drinks e cenografia temática.",
      fullDesc: "Peças coringa para welcome drinks, mesa de café, lembrancinhas e ativações instagramáveis em eventos sociais e corporativos.",
      image: "assets/images/cat_carrinhos.jpg",
      itemCount: 11,
      featured: true
    },
    {
      id: "vasos-e-suportes",
      name: "Vasos e Suportes",
      slug: "vasos-e-suportes",
      shortDesc: "Ânforas de ferro, suportes elevados para arranjos aéreos e pedestais de mesa.",
      fullDesc: "Linha completa de ferragens para sustentação floral. Estruturas pensadas para fixação segura de esponja floral e arranjos volumosos.",
      image: "assets/images/cat_vasos.jpg",
      itemCount: 22,
      featured: true
    },
    {
      id: "casticais-e-suspensos",
      name: "Castiçais e Suportes Suspensos",
      slug: "casticais-e-suspensos",
      shortDesc: "Candelabros imperiais de piso e mesa, aros suspensos para folhagens e velas.",
      fullDesc: "Iluminação cênica e calor visual. Suportes seguros para velas de parafina ou LED, com desenho editorial que enriquece qualquer fotografia.",
      image: "assets/images/cat_casticais.jpg",
      itemCount: 15,
      featured: false
    },
    {
      id: "colunas-e-lanternas",
      name: "Colunas, Gaiolas e Lanternas",
      slug: "colunas-e-lanternas",
      shortDesc: "Colunas gregas em ferro, lanternas marroquinas e gaiolas decorativas estilizadas.",
      fullDesc: "Elementos verticais para demarcação de passarelas, halls de entrada e composições de chão de grande impacto visual.",
      image: "assets/images/cat_colunas.jpg",
      itemCount: 14,
      featured: false
    },
    {
      id: "espaco-kids",
      name: "Espaço Kids",
      slug: "espaco-kids",
      shortDesc: "Mobiliário modular e estruturas leves para temas infantis, mini tables e painéis ripados.",
      fullDesc: "Projetado com cantos arredondados, segurança redobrada e acabamentos lúdicos em cores versáteis para festas infantis e celebrações de 1º ano.",
      image: "assets/images/cat_kids.jpg",
      itemCount: 19,
      featured: false
    },
    {
      id: "igreja-e-cerimonias",
      name: "Igreja e Cerimônias",
      slug: "igreja-e-cerimonias",
      shortDesc: "Púlpitos, passadeiras metálicas, suporte de cortejo e gazebos para bênção nupcial.",
      fullDesc: "Mobiliário cerimonial solene e imponente. Peças que valorizam a fotografia do cortejo nupcial e respeitam as dimensões de naves de igrejas e capelas campestres.",
      image: "assets/images/cat_igreja.jpg",
      itemCount: 17,
      featured: true
    }
  ],

  products: [
    {
      id: "arco-romeu-duplo",
      name: "Arco Romeu Duplo Orgânico",
      category: "arcos-e-portais",
      shortDesc: "Estrutura dupla em curvas entrelaçadas com encaixe rápido e perfil reforçado.",
      fullDesc: "O Arco Romeu Duplo é uma das peças mais solicitadas por decoradores de casamento e festas de 15 anos no Brasil. Sua estrutura em aço carbono tubular oferece rigidez estrutural incomparável, suportando arranjos florais densos sem risco de torção. Pintura eletrostática dourado acetinado de alta resistência a riscos.",
      image: "assets/images/cat_arcos.jpg",
      dimensions: "Altura: 2,40m | Largura: 2,80m | Profundidade da base: 50cm",
      weightCapacity: "Suporta até 35kg de arranjos florais distribuídos",
      materials: "Tubo de aço carbono industrial 1 polegada, base reforçada com contrapeso embutido",
      finishes: ["Dourado Acetinado", "Preto Fosco", "Ouro Velho", "Branco Pérola"],
      applications: "Altares de casamento, fundo de mesa de bolo, entrada triunfal, photo opportunity",
      featured: true,
      isNew: false
    },
    {
      id: "trio-mesas-caneladas-gold",
      name: "Trio de Mesas Cilíndricas Caneladas",
      category: "mesas-e-bases",
      shortDesc: "Conjunto de 3 cilindros com ripas verticais estruturadas e tampo em mármore sintético.",
      fullDesc: "O clássico contemporâneo do acervo moderno. O Trio Canelado une a leveza do design canelado com a facilidade do sistema de encaixe 'boneca russa' (um cabe dentro do outro para transporte compacto em vans de eventos). Tampo com borda chanfrada anti-impacto.",
      image: "assets/images/cat_mesas.jpg",
      dimensions: "G: 90x60cm | M: 75x50cm | P: 60x40cm (Alt x Diâm)",
      weightCapacity: "Até 50kg por cilindro",
      materials: "Aço carbono dobrado em CNC, MDF hidrófugo revestido ou tampo em resina sólida",
      finishes: ["Gold Champagne", "Cobre Rosé", "Preto Texturizado", "Off-White"],
      applications: "Mesa de doces contemporânea, lounges comemorativos, eventos corporativos",
      featured: true,
      isNew: true
    },
    {
      id: "gazebo-imperial-oitavado",
      name: "Gazebo Imperial Oitavado",
      category: "gazebos-e-estruturas",
      shortDesc: "Monumento arquitetônico para altares campestres e cerimônias solenes de grande porte.",
      fullDesc: "Projetado para ser o ápice cenográfico de casamentos no campo ou praia. Todo seccionado em partes modulares numeradas que facilitam a montagem em menos de 45 minutos por equipe de dois montadores. Pintura com primer anticorrosivo e acabamento automotivo PU.",
      image: "assets/images/cat_gazebos.jpg",
      dimensions: "Diâmetro: 3,50m | Altura do topo: 3,80m | Vão livre: 2,20m",
      weightCapacity: "Suporte para lustres de até 25kg no domo central",
      materials: "Aço forjado artesanal e tubos de precisão",
      finishes: ["Ferro Envelhecido", "Preto Nobre", "Branco Provence", "Ouro Imperial"],
      applications: "Cerimônias ao ar livre, altares de igreja campestre, área lounge de gala",
      featured: true,
      isNew: false
    },
    {
      id: "arvore-cerejeira-francesa-3m",
      name: "Árvore Francesa Monumental 3.20m",
      category: "arvores-e-topos",
      shortDesc: "Tronco escultural em ferro forjado com 48 pontos de encaixe para galhos florais.",
      fullDesc: "Transforme qualquer salão em um jardim encantado. O tronco estrutural da Baytaka conta com base quadrangular pesada que dispensa furação no piso, garantindo segurança total em ambientes com grande circulação de convidados.",
      image: "assets/images/cat_arvores.jpg",
      dimensions: "Altura Total: 3,20m | Envergadura da copa: 2,80m | Base: 60x60cm",
      weightCapacity: "Estrutura autoportante até 45kg",
      materials: "Ferro maciço conformado a frio e tubo estrutural",
      finishes: ["Marrom Corten Texturizado", "Dourado Nobre", "Preto Acetinado"],
      applications: "Centro de salão, hall de recepção, cobertura aérea da mesa de doces",
      featured: true,
      isNew: true
    },
    {
      id: "cadeira-tiffany-artisan-gold",
      name: "Cadeira Tiffany Aço Reforçado",
      category: "cadeiras-e-mobiliarios",
      shortDesc: "A cadeira clássica em versão industrial reforçada para 150kg com assento removível.",
      fullDesc: "Desenvolvida com tubulação sem costura e solda TIG com acabamento limpo. Resistência contra quebra de pernas e descascamento mesmo com centenas de locações e empilhamento em caminhões de frete.",
      image: "assets/images/cat_cadeiras.jpg",
      dimensions: "Altura: 92cm | Assento: 40x40cm | Altura assento: 45cm",
      weightCapacity: "Capacidade estática: 180kg | Empilhamento: até 8 unidades",
      materials: "Tubo de aço especial com tratamento químico fosfatizante",
      finishes: ["Dourado Espelhado", "Prata Nobre", "Cobre", "Preto Fosco"],
      applications: "Banquete de gala, mesas de convidados, cerimônia de casamento",
      featured: true,
      isNew: false
    },
    {
      id: "caminho-noiva-passarela-imperiale",
      name: "Kit Passarela e Colunas Imperiale",
      category: "igreja-e-cerimonias",
      shortDesc: "Conjunto de 10 colunas geométricas com suporte para arranjos aéreos e lanternas de chão.",
      fullDesc: "Linhas retas e minimalistas que direcionam o olhar até o altar. Acompanha base de encaixe para vasos e ganchos discretos para fitas de isolamento ou iluminação de fadas.",
      image: "assets/images/cat_igreja.jpg",
      dimensions: "Alturas coordenadas: 80cm, 100cm e 120cm",
      weightCapacity: "Suporta 15kg no prato superior",
      materials: "Barra maciça de aço 3/8 pol com acabamento polido",
      finishes: ["Ouro Real", "Preto Grafite", "Branco Neve"],
      applications: "Passarela de cerimônia nupcial, hall de formatura, cortejo religioso",
      featured: true,
      isNew: false
    },
    {
      id: "trio-doceiras-pedestal-lux",
      name: "Coleção Pedestais Boleira Royale (Kit 5 Peças)",
      category: "doceiras-e-suportes",
      shortDesc: "Boleira central com pé torneado e 4 pratos em degraus para doces finos.",
      fullDesc: "Harmonia perfeita entre alturas para criar profundidade na mesa de doces. Pratos lisos de fácil higienização, preparados para contato com alimentos através de pintura atóxica.",
      image: "assets/images/cat_doceiras.jpg",
      dimensions: "Boleira: 35cm diâm x 25cm alt | Pratos: 20cm, 25cm e 30cm",
      weightCapacity: "Boleira suporta bolo cenográfico ou real de até 12kg",
      materials: "Aço laminado e latão torneado",
      finishes: ["Dourado Gloss", "Rose Gold", "Prata Fosca"],
      applications: "Mesa de doces, mesa de café, montagem de mini weddings",
      featured: true,
      isNew: true
    },
    {
      id: "carrinho-gourmet-vintage",
      name: "Carrinho Gourmet & Welcome Drinks",
      category: "carrinhos-e-especiais",
      shortDesc: "Carrinho com rodas raiadas funcionais, puxador em madeira nobre e cobertura desmontável.",
      fullDesc: "Um dos maiores atrativos de fotos em festas corporativas e aniversários. Rodas raiadas com acabamento dourado, prateleira inferior para estoque de insumos e toldo removível.",
      image: "assets/images/cat_carrinhos.jpg",
      dimensions: "Comprimento: 1,30m | Largura: 65cm | Altura total: 1,95m",
      weightCapacity: "Suporta até 70kg distribuídos",
      materials: "Estrutura tubular de aço com tampos em madeira tratada",
      finishes: ["Dourado com Madeira Natural", "Preto Industrial", "Branco Clássico"],
      applications: "Welcome bar, mesa de brigadeiro gourmet, estação de café e lembranças",
      featured: true,
      isNew: false
    }
  ],

  inspirations: [
    {
      id: "insp-1",
      title: "Casamento Clássico Monumental no Haras",
      category: "Casamentos",
      location: "Campinas, SP",
      decorator: "Studio Renata Abreu Eventos",
      description: "Cenografia romântica com composição de Arcos Romeu em sequência, criando um túnel imersivo de glicínias e rosas brancas na cerimônia crepuscular.",
      image: "assets/images/hero_event.jpg",
      productsUsed: ["arco-romeu-duplo", "gazebo-imperial-oitavado", "cadeira-tiffany-artisan-gold"]
    },
    {
      id: "insp-2",
      title: "Gala de Formatura Medicina USP",
      category: "Formaturas",
      location: "Ribeirão Preto, SP",
      decorator: "Cenarium Formaturas & Produções",
      description: "Ilhas gastronômicas distribuídas com trios de cilindros canelados em acabamento Gold Champagne e colunas de espelho para mais de 1.200 convidados.",
      image: "assets/images/cat_mesas.jpg",
      productsUsed: ["trio-mesas-caneladas-gold", "carrinho-gourmet-vintage"]
    },
    {
      id: "insp-3",
      title: "Cerimônia Sunset na Praia de Juquehy",
      category: "Cerimônias",
      location: "São Sebastião, SP",
      decorator: "Ateliê do Mar Festas",
      description: "O Gazebo Imperial Oitavado instalado na beira da praia com tecido linho cru e folhagens tropicais nativas da Mata Atlântica.",
      image: "assets/images/cat_gazebos.jpg",
      productsUsed: ["gazebo-imperial-oitavado", "caminho-noiva-passarela-imperiale"]
    },
    {
      id: "insp-4",
      title: "Aniversário de 15 Anos Encantado",
      category: "Festas",
      location: "Belo Horizonte, MG",
      decorator: "Luciana Mascarenhas Cenografia",
      description: "A Árvore Francesa Monumental posicionada no centro da pista de dança com 60 pontos de micro lâmpadas e teto de folhagens suspensas.",
      image: "assets/images/cat_arvores.jpg",
      productsUsed: ["arvore-cerejeira-francesa-3m", "trio-doceiras-pedestal-lux"]
    },
    {
      id: "insp-5",
      title: "Lançamento Imobiliário Corporativo",
      category: "Eventos corporativos",
      location: "São Paulo, SP (Faria Lima)",
      decorator: "Prime Concept Brand Events",
      description: "Linhas retas e acabamento preto acetinado em bistrôs de alta durabilidade e totens geométricos para recepção de investidores.",
      image: "assets/images/cat_cadeiras.jpg",
      productsUsed: ["cadeira-tiffany-artisan-gold", "trio-mesas-caneladas-gold"]
    },
    {
      id: "insp-6",
      title: "Celebração Solene na Catedral",
      category: "Cerimônias",
      location: "Curitiba, PR",
      decorator: "Manoel Silva Flores & Acervos",
      description: "Kit de colunas Imperiale e passarela de espelho com candelabros de alta estabilidade para cerimônia nupcial noturna.",
      image: "assets/images/cat_igreja.jpg",
      productsUsed: ["caminho-noiva-passarela-imperiale", "arco-romeu-duplo"]
    }
  ],

  brazilCases: [
    {
      id: "case-sp",
      state: "SP",
      stateName: "São Paulo",
      city: "São Paulo / Campinas / Ribeirão Preto",
      client: "Festas & Acervos Prime",
      quote: "Compramos mais de 40 estruturas da Baytaka nos últimos 5 anos. O acabamento da pintura eletrostática suporta montagens semanais sem descascar. É investimento com retorno garantido.",
      productUsed: "Arcos Romeu, Trios Canelados e Gazebos",
      image: "assets/images/cat_arcos.jpg",
      lat: -23.5505,
      lng: -46.6333
    },
    {
      id: "case-rj",
      state: "RJ",
      stateName: "Rio de Janeiro",
      city: "Rio de Janeiro / Petrópolis",
      client: "Lumière Locadora de Mobiliário",
      quote: "Em casamentos serranos em Petrópolis, a robustez das estruturas Baytaka nos dá tranquilidade até contra rajadas de vento em áreas abertas.",
      productUsed: "Gazebos Imperiais e Árvores Cerejeiras",
      image: "assets/images/cat_gazebos.jpg",
      lat: -22.9068,
      lng: -43.1729
    },
    {
      id: "case-mg",
      state: "MG",
      stateName: "Minas Gerais",
      city: "Belo Horizonte / Uberlândia",
      client: "Arte & Forma Cenografia",
      quote: "A diversidade de produtos para acervo permitiu que a nossa locadora atendesse desde festas infantis requintadas até grandes bailes de formatura.",
      productUsed: "Trio Cilíndrico e Coleção Royale",
      image: "assets/images/cat_mesas.jpg",
      lat: -19.9167,
      lng: -43.9345
    },
    {
      id: "case-pr",
      state: "PR",
      stateName: "Paraná",
      city: "Curitiba / Maringá / Londrina",
      client: "Mobili Festas & Eventos",
      quote: "A expedição da fábrica é muito organizada. Os produtos chegam protegidos com plástico bolha especial e cantoneiras, prontos para locação.",
      productUsed: "Cadeiras Tiffany e Passarelas",
      image: "assets/images/cat_cadeiras.jpg",
      lat: -25.4284,
      lng: -49.2733
    },
    {
      id: "case-sc",
      state: "SC",
      stateName: "Santa Catarina",
      city: "Florianópolis / Balneário Camboriú",
      client: "Coast Line Decorações",
      quote: "No litoral, a proteção anticorrosiva das peças Baytaka faz toda a diferença para o nosso acervo durar anos com visual impecável.",
      productUsed: "Arcos Orgânicos e Suportes Aéreos",
      image: "assets/images/cat_arcos.jpg",
      lat: -27.5954,
      lng: -48.5480
    },
    {
      id: "case-rs",
      state: "RS",
      stateName: "Rio Grande do Sul",
      city: "Porto Alegre / Gramado",
      client: "Gramado Acervos & Cenografia",
      quote: "Trabalhamos com o turismo de eventos em Gramado e o design das peças Baytaka encanta decoradores de todo o Brasil que realizam destination weddings aqui.",
      productUsed: "Gazebos e Árvores Francesas",
      image: "assets/images/cat_arvores.jpg",
      lat: -30.0346,
      lng: -51.2177
    },
    {
      id: "case-ba",
      state: "BA",
      stateName: "Bahia",
      city: "Salvador / Trancoso",
      client: "Axé & Requinte Cerimoniais",
      quote: "Nossas festas em Trancoso exigem mobiliário que combine leveza visual com força estrutural. A Baytaka é nossa fornecedora de confiança.",
      productUsed: "Arcos Romeu e Bistrôs",
      image: "assets/images/cat_arcos.jpg",
      lat: -12.9777,
      lng: -38.5016
    },
    {
      id: "case-go",
      state: "GO",
      stateName: "Goiás & Distrito Federal",
      city: "Goiânia / Brasília DF",
      client: "Capital Eventos & Estruturas",
      quote: "Nos grandes casamentos de Brasília, as peças imponentes da Baytaka são fundamentais para composições cenográficas volumosas e glamourosas.",
      productUsed: "Kit Colunas Imperiale e Gazebo",
      image: "assets/images/cat_igreja.jpg",
      lat: -15.7975,
      lng: -47.8919
    }
  ],

  representatives: [
    {
      id: "rep-sp-capital",
      name: "Carlos Eduardo Mendes",
      code: "REP-SP-01",
      states: ["SP"],
      regionName: "São Paulo Capital e Grande SP",
      cities: ["São Paulo", "Guarulhos", "Santo André", "São Bernardo do Campo", "São Caetano do Sul", "Osasco", "Barueri"],
      whatsapp: "5511987654321",
      phone: "(11) 98765-4321",
      email: "carlos.rep.sp@baytaka.com.br",
      experience: "8 anos representando a Baytaka",
      active: true
    },
    {
      id: "rep-sp-interior",
      name: "Mariana Alcantara",
      code: "REP-SP-02",
      states: ["SP"],
      regionName: "Interior de São Paulo (Campinas, Piracicaba, Sorocaba, Ribeirão Preto)",
      cities: ["Campinas", "Ribeirão Preto", "Sorocaba", "Piracicaba", "Porto Ferreira", "São Carlos", "Americana", "Limeira", "Jundiaí"],
      whatsapp: "5519981234567",
      phone: "(19) 98123-4567",
      email: "mariana.rep.sp@baytaka.com.br",
      experience: "12 anos no setor de eventos e acervos",
      active: true
    },
    {
      id: "rep-rj",
      name: "Roberto Fontes",
      code: "REP-RJ-01",
      states: ["RJ"],
      regionName: "Rio de Janeiro Capital, Região Serrana e Baixada",
      cities: ["Rio de Janeiro", "Niterói", "Petrópolis", "Teresópolis", "Búzios", "Cabo Frio", "Nova Friburgo"],
      whatsapp: "5521996543210",
      phone: "(21) 99654-3210",
      email: "roberto.rep.rj@baytaka.com.br",
      experience: "10 anos representando a marca no RJ",
      active: true
    },
    {
      id: "rep-mg",
      name: "Juliana Vasconcelos",
      code: "REP-MG-01",
      states: ["MG"],
      regionName: "Belo Horizonte, Região Metropolitana e Triângulo Mineiro",
      cities: ["Belo Horizonte", "Nova Lima", "Betim", "Contagem", "Uberlândia", "Uberaba", "Juiz de Fora"],
      whatsapp: "5531988887777",
      phone: "(31) 98888-7777",
      email: "juliana.rep.mg@baytaka.com.br",
      experience: "9 anos atendendo locadoras e buffets mineiros",
      active: true
    },
    {
      id: "rep-sul",
      name: "Fernando Becker",
      code: "REP-SUL-01",
      states: ["PR", "SC", "RS"],
      regionName: "Região Sul (Paraná, Santa Catarina e Rio Grande do Sul)",
      cities: ["Curitiba", "Maringá", "Londrina", "Florianópolis", "Balneário Camboriú", "Joinville", "Porto Alegre", "Caxias do Sul", "Gramado"],
      whatsapp: "5541991238899",
      phone: "(41) 99123-8899",
      email: "fernando.rep.sul@baytaka.com.br",
      experience: "14 anos no polo de móveis e decorações",
      active: true
    },
    {
      id: "rep-centro-oeste",
      name: "Rodrigo Toledo",
      code: "REP-CO-01",
      states: ["GO", "DF", "MT", "MS"],
      regionName: "Centro-Oeste (Goiás, Brasília DF e Mato Grosso)",
      cities: ["Brasília", "Goiânia", "Anápolis", "Cuiabá", "Campo Grande", "Rio Verde"],
      whatsapp: "5561984443322",
      phone: "(61) 98444-3322",
      email: "rodrigo.rep.co@baytaka.com.br",
      experience: "7 anos no atendimento a cerimoniais e produtores",
      active: true
    },
    {
      id: "rep-nordeste",
      name: "Luciana Cavalcanti",
      code: "REP-NE-01",
      states: ["BA", "PE", "CE", "RN", "PB", "AL", "SE"],
      regionName: "Região Nordeste",
      cities: ["Salvador", "Recife", "Fortaleza", "Natal", "João Pessoa", "Maceió", "Aracaju", "Porto Seguro"],
      whatsapp: "5571992221100",
      phone: "(71) 99222-1100",
      email: "luciana.rep.ne@baytaka.com.br",
      experience: "11 anos atendendo grandes buffets e decoradores do NE",
      active: true
    }
  ],

  leads: [
    {
      id: "lead-1001",
      name: "Patrícia Albuquerque",
      whatsapp: "(11) 99421-8840",
      city: "São Paulo",
      state: "SP",
      segment: "Locadora de festas",
      categoryInterest: "Arcos e Portais",
      channel: "Varejo",
      date: "2026-10-08T14:32:00Z",
      status: "Em Atendimento",
      notes: "Interesse em renovar acervo para casamentos 2027"
    },
    {
      id: "lead-1002",
      name: "Marcos Vinícius Cordeiro",
      whatsapp: "(31) 98711-2300",
      city: "Belo Horizonte",
      state: "MG",
      segment: "Decorador",
      categoryInterest: "Mesas e Bases",
      channel: "Representante",
      date: "2026-10-09T09:15:00Z",
      status: "Orçamento Enviado",
      notes: "Cotação para Trio Canelado e Cilindros"
    }
  ]
};

if (typeof window !== "undefined") {
  window.BAYTAKA_INITIAL_DATA = BAYTAKA_INITIAL_DATA;
}
