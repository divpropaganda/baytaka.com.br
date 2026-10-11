# Baytaka Interiores — Website Institucional e Comercial

Site institucional e comercial completo, moderno, premium e responsivo desenvolvido sob medida para a marca **BAYTAKA INTERIORES** ([baytaka.com.br](https://baytaka.com.br/)).

---

## 🎯 Objetivo e Regra Principal de Conversão
O site **NÃO é um e-commerce convencional** (sem carrinho de compras e sem checkout transacional). Ele atua como um **Showroom Digital e Gerador de Oportunidades Comerciais**:

$$\text{Visitante} \longrightarrow \text{Apresentação da Marca} \longrightarrow \text{Showroom de Peças} \longrightarrow \text{Inspiração \& Prova Social} \longrightarrow \text{Qualificação do Perfil} \longrightarrow \text{Roteamento WhatsApp} \longrightarrow \text{Orçamento Comercial}$$

---

## 💎 Identidade Visual e Arquitetura de Design
- **Paleta de Cores**: Branco predominante (`#FFFFFF`), tons neutros de apoio (`#F8F9FA`, `#F3F4F6`), tipografia em preto sólido (`#0F1115`, `#1C1F26`) e o **Laranja Baytaka** (`#E85D04`) como cor de destaque e conversão.
- **Tipografia**: *Plus Jakarta Sans* (Google Fonts) em escala editorial, transmitindo autoridade industrial e sofisticação para decoradores.
- **Fotografia**: Imagens de grande formato destacando acabamentos em pintura eletrostática, montagens reais de casamentos, formaturas, gazebos e os bastidores da fábrica em Porto Ferreira - SP.
- **Mobile First**: Layout totalmente adaptado e ultra veloz para navegação via smartphones.

---

## 📂 Páginas e Estrutura do Projeto

1. [`index.html`](index.html): **Página Principal (Home)**
   - **Hero**: Imagem cinematográfica de evento, headline *"PEÇAS QUE DÃO FORMA A GRANDES PROJETOS"*, badges de *Fabricação Própria* e *+40 Anos de Experiência*, CTAs principais.
   - **Institucional**: *"DA NOSSA FÁBRICA PARA O SEU ACERVO"* — 40 anos de pioneirismo fabril em Porto Ferreira - SP.
   - **12 Categorias de Produtos**: Cards fotográficos interativos para as 12 famílias de acervo.
   - **Profissionais**: *"SEU ACERVO PRECISA ACOMPANHAR SUA CRIATIVIDADE"* — Visão de retorno sobre investimento para decoradores e locadoras.
   - **Produtos em Destaque**: Cards de peças com botão *"Conhecer Peça"* e modal rápido de especificações.
   - **Inspirações**: Galeria com filtros rápidos de eventos (Casamentos, Formaturas, 15 Anos, Corporativo, etc.).
   - **Baytaka pelo Brasil**: Mapa SVG interativo dos estados brasileiros com depoimentos e produtos utilizados em cada região.
   - **Fabricação & Bastidores**: *"A QUALIDADE COMEÇA MUITO ANTES DO EVENTO"* — Processos de corte CNC, solda TIG, pintura eletrostática a pó e expedição reforçada.
   - **Catálogo / Bloco de Conversão**: CTA *"GOSTOU DO QUE VIU?"* com acionamento do modal comercial.
   - **Rodapé Editorial**: Endereço fabril, redes sociais (Instagram, Facebook, Pinterest, YouTube) e links institucionais.

2. [`a-baytaka.html`](a-baytaka.html): **História da Baytaka**
   - Linha do tempo desde 1984, parque industrial em Porto Ferreira, engenharia modular e diferenciais técnicos.

3. [`produtos.html`](produtos.html): **Showroom Geral**
   - Campo de busca instantânea por nome ou acabamento, filtro pelas 12 categorias em pills clicáveis, grid dinâmico e modal com ficha técnica detalhada.

4. [`categoria.html`](categoria.html): **Landing Pages por Categoria**
   - Página temática dinâmica (`?cat=arcos-e-portais`, `?cat=mesas-e-bases`, etc.) com conceito de acervo, produtos da categoria e botão *"Solicitar Catálogo e Valores"*.

5. [`inspiracoes.html`](inspiracoes.html): **Portfólio Editorial Revista**
   - Projetos de eventos reais com lista dos produtos Baytaka utilizados em cada composição (com links diretos para cada produto).

6. [`baytaka-pelo-brasil.html`](baytaka-pelo-brasil.html): **Presença Nacional**
   - Cases e depoimentos de locadoras e decoradores de SP, RJ, MG, PR, SC, RS, BA, GO, DF e outros estados.

7. [`representantes.html`](representantes.html): **Localizador de Representantes**
   - Seletor de Estado (UF) e Cidade com exibição do representante comercial regional e link direto para WhatsApp. Fallback inteligente para falar com a Matriz caso o estado não tenha representante exclusivo.

8. [`novidades.html`](novidades.html): **Lançamentos**
   - Peças recém-desenvolvidas e tendências de mercado para ampliação de acervo.

9. [`contato.html`](contato.html): **Canais de Atendimento**
   - Localização no Polo de Porto Ferreira - SP, telefones, e-mail e formulário qualificado conectado ao WhatsApp e CRM.

10. [`admin.html`](admin.html): **Painel Administrativo Completo**
    - **Dashboard**: Métricas em tempo real de produtos, categorias, representantes e leads.
    - **CRM de Leads**: Visualização de todos os contatos que solicitaram catálogo com nome, whatsapp, segmento, interesse, status e **Exportação para CSV**.
    - **Gestão de Produtos**: Cadastrar novas peças, editar dimensões, trocar foto, alterar status de destaque e lançamento.
    - **Gestão de Categorias, Representantes e Projetos**.
    - **Configurações Gerais**: Atualização dos números de WhatsApp da Matriz, telefones e e-mail.

---

## ⚡ Fluxos Comerciais e Automação de WhatsApp

### 1. Modal Inteligente "Solicitar Catálogo"
- **Etapa 1**: Usuário escolhe entre:
  - **Comprar pelo Varejo** (direto com a fábrica)
  - **Falar com um Representante** (busca por UF/Cidade)
- **Etapa 2 (Varejo)**: Formulário com Nome, WhatsApp, Cidade, Estado, Perfil Profissional (Decorador, Locadora, Buffet, etc.) e Categoria de Interesse.
- **Ação**:
  - Salva o lead no CRM local (`baytaka_leads`).
  - Dispara eventos de conversão analítica (`retail_lead`, `catalog_request`).
  - Abre o WhatsApp com a mensagem pré-formatada com todos os dados do cliente e a peça de interesse.

### 2. Botão Flutuante de WhatsApp
- Não abre diretamente uma conversa genérica. Ao clicar, exibe menu suspenso:
  - **Comprar no Varejo**
  - **Falar com Representante**
  - **Já sou Cliente / Pedidos**

---

## 📈 Rastreamento e Analytics ([`js/tracker.js`](js/tracker.js))
- Captura automática de parâmetros **UTM** (`utm_source`, `utm_medium`, `utm_campaign`).
- Integração nativa com **Google Tag Manager** (`dataLayer.push`), **Google Analytics 4** (`gtag`) e **Meta Pixel** (`fbq`).
- Eventos rastreados:
  - `catalog_request`
  - `whatsapp_click`
  - `retail_lead`
  - `representative_lead`
  - `product_view`
  - `category_view`
  - `representative_search`
  - `contact_form`

---

## 🚀 Como Executar Localmente

### Opção 1 (Direto no Navegador)
Basta abrir o arquivo `index.html` em qualquer navegador moderno.

### Opção 2 (Servidor Local)
Execute no terminal PowerShell:
```powershell
powershell -ExecutionPolicy Bypass -File .\serve.ps1
```
E acesse no navegador:
`http://localhost:8099/`
Admin: `http://localhost:8099/admin.html`
