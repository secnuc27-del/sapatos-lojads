/* =============================================
   LUMIÈRE — SCRIPT.JS
   Loja de Sapatos Premium
   ============================================= */

// ==== DADOS DOS PRODUTOS ====
const PRODUTOS = [
  {
    id: 1,
    nome: "Air Pulse Elite",
    categoria: "Tênis",
    genero: "Unissex",
    preco: 289.90,
    precoOld: 359.90,
    tag: "mais-vendido",
    tagLabel: "Mais vendido",
    destaque: true,
    promo: true,
    desc: "Amortecimento responsivo com cabedal em malha técnica respirável. Ideal para corrida e lifestyle urbano.",
    tamanhos: ["37","38","39","40","41","42","43","44"],
    cores: ["Branco","Preto","Cinza"],
    material: "Malha técnica",
    garantia: "1 ano",
    peso: "350g",
    imgs: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
      "https://images.unsplash.com/photo-1543508282-6319a3e2621f?w=600&q=80",
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600&q=80",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80",
    ]
  },
  {
    id: 2,
    nome: "Lumière Classic Oxford",
    categoria: "Social",
    genero: "Masculino",
    preco: 319.90,
    precoOld: null,
    tag: "novo",
    tagLabel: "Novo",
    destaque: true,
    promo: false,
    desc: "Couro legítimo envernizado com sola em couro. Elegância e conforto para todas as ocasiões formais.",
    tamanhos: ["38","39","40","41","42","43","44"],
    cores: ["Preto","Marrom"],
    material: "Couro legítimo",
    garantia: "1 ano",
    peso: "520g",
    imgs: [
      "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&q=80",
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&q=80",
      "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=600&q=80",
      "https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?w=600&q=80",
      "https://images.unsplash.com/photo-1504270997636-07ddfbd48945?w=600&q=80",
    ]
  },
  {
    id: 3,
    nome: "Summer Sand Flat",
    categoria: "Sandálias",
    genero: "Feminino",
    preco: 159.90,
    precoOld: 199.90,
    tag: "promo",
    tagLabel: "−20%",
    destaque: true,
    promo: true,
    desc: "Sandália plana em couro sintético com detalhes dourados. Perfeita para dias quentes e noites a beira-mar.",
    tamanhos: ["34","35","36","37","38","39","40"],
    cores: ["Areia","Dourado","Branco"],
    material: "Couro sintético",
    garantia: "6 meses",
    peso: "180g",
    imgs: [
      "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=600&q=80",
      "https://images.unsplash.com/photo-1583496661160-fb5218e5f5b8?w=600&q=80",
      "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=600&q=80",
      "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&q=80",
      "https://images.unsplash.com/photo-1612392062631-94d8f0621ba5?w=600&q=80",
    ]
  },
  {
    id: 4,
    nome: "Urban Hiker Boot",
    categoria: "Botas",
    genero: "Unissex",
    preco: 389.90,
    precoOld: 479.90,
    tag: "promo",
    tagLabel: "−19%",
    destaque: false,
    promo: true,
    desc: "Bota de couro com palmilha memory foam e sola de borracha para agarre em qualquer superfície.",
    tamanhos: ["37","38","39","40","41","42","43","44"],
    cores: ["Marrom","Preto","Caqui"],
    material: "Couro bovino",
    garantia: "1 ano",
    peso: "680g",
    imgs: [
      "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600&q=80",
      "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=600&q=80",
      "https://images.unsplash.com/photo-1542558788-a82b7a58c1cd?w=600&q=80",
      "https://images.unsplash.com/photo-1578774296842-c45e472b3028?w=600&q=80",
      "https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?w=600&q=80",
    ]
  },
  {
    id: 5,
    nome: "Cloud Slide",
    categoria: "Chinelos",
    genero: "Unissex",
    preco: 89.90,
    precoOld: null,
    tag: "novo",
    tagLabel: "Novo",
    destaque: false,
    promo: false,
    desc: "Chinelo slide com palmilha ergonômica extra-confortável. A leveza que você não vai querer tirar do pé.",
    tamanhos: ["34","35","36","37","38","39","40","41","42","43","44"],
    cores: ["Preto","Cinza","Verde"],
    material: "EVA + borracha",
    garantia: "6 meses",
    peso: "200g",
    imgs: [
      "https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?w=600&q=80",
      "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=600&q=80",
      "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=600&q=80",
      "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=600&q=80",
      "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=600&q=80",
    ]
  },
  {
    id: 6,
    nome: "Derby Canvas Co.",
    categoria: "Tênis",
    genero: "Masculino",
    preco: 219.90,
    precoOld: 269.90,
    tag: "promo",
    tagLabel: "−18%",
    destaque: true,
    promo: true,
    desc: "Tênis em canvas resistente com cadarço encerado. Visual retrô com conforto moderno para o dia a dia.",
    tamanhos: ["38","39","40","41","42","43","44"],
    cores: ["Off-white","Azul","Vermelho"],
    material: "Canvas + borracha",
    garantia: "6 meses",
    peso: "310g",
    imgs: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80",
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&q=80",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80",
    ]
  },
  {
    id: 7,
    nome: "Scarpin Royale",
    categoria: "Social",
    genero: "Feminino",
    preco: 249.90,
    precoOld: null,
    tag: "novo",
    tagLabel: "Novo",
    destaque: false,
    promo: false,
    desc: "Scarpin em verniz com salto 8cm. Elegância intemporal que eleva qualquer look.",
    tamanhos: ["34","35","36","37","38","39","40"],
    cores: ["Preto","Nude","Vermelho"],
    material: "Verniz sintético",
    garantia: "6 meses",
    peso: "350g",
    imgs: [
      "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=600&q=80",
      "https://images.unsplash.com/photo-1583496661160-fb5218e5f5b8?w=600&q=80",
      "https://images.unsplash.com/photo-1612392062631-94d8f0621ba5?w=600&q=80",
      "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=600&q=80",
      "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&q=80",
    ]
  },
  {
    id: 8,
    nome: "Street Mule Suede",
    categoria: "Social",
    genero: "Feminino",
    preco: 199.90,
    precoOld: 249.90,
    tag: "promo",
    tagLabel: "−20%",
    destaque: false,
    promo: true,
    desc: "Mule em suede macio com bico quadrado e salto bloco 5cm. Tendência e conforto juntos.",
    tamanhos: ["34","35","36","37","38","39","40"],
    cores: ["Caramelo","Preto","Cinza"],
    material: "Suede sintético",
    garantia: "6 meses",
    peso: "290g",
    imgs: [
      "https://images.unsplash.com/photo-1583496661160-fb5218e5f5b8?w=600&q=80",
      "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=600&q=80",
      "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=600&q=80",
      "https://images.unsplash.com/photo-1612392062631-94d8f0621ba5?w=600&q=80",
      "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=600&q=80",
    ]
  },
];

const WHATSAPP_NUMBER = "5599999999999"; // ← altere para o número da loja

// ==== ESTADO GLOBAL ====
let carrinho = JSON.parse(localStorage.getItem("lumiere_cart") || "[]");
let paginaAtual = "home";
let produtoAtual = null;
let catSelecionada = null;
let qtdDetalhe = 1;
let tamSelecionado = null;
let corSelecionada = null;
let imgAtual = 0;

// ==== NAVEGAÇÃO ====
function navigate(pagina, catFiltro) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  const targetPage = document.getElementById("page-" + pagina);
  if (targetPage) targetPage.classList.add("active");
  paginaAtual = pagina;
  window.scrollTo({ top: 0, behavior: "smooth" });

  // Update active links state
  document.querySelectorAll(".nav a").forEach(a => {
    const clickAttr = a.getAttribute("onclick") || "";
    const isCurrent = clickAttr.includes(`navigate('${pagina}')`);
    a.classList.toggle("active", isCurrent);
  });

  // Close mobile navigation menu
  const navElement = document.getElementById("nav");
  if (navElement) navElement.classList.remove("open");
  const hamburger = document.getElementById("hamburger");
  if (hamburger) hamburger.classList.remove("open");

  if (pagina === "home") renderHome();
  if (pagina === "produtos") { catSelecionada = catFiltro || null; renderProdutos(); }
  if (pagina === "carrinho") renderCarrinho();

  window.dispatchEvent(new Event("contentChanged"));
  
  // Atualizar animação das abas
  updateAnimatedTabs();
}

// ==== LOADER CONTROLS ====
function showLoader() {
  const loader = document.getElementById("lumiere-loader");
  if (loader) loader.classList.add("active");
}

function hideLoader() {
  const loader = document.getElementById("lumiere-loader");
  if (loader) loader.classList.remove("active");
}

// ==== ANIMATED TABS (SLIDING PILL) ====
function updateAnimatedTabs() {
  const overlay = document.getElementById("activeTabsOverlay");
  const nav = document.getElementById("nav");
  if (!overlay || !nav) return;

  // Encontrar o link ativo
  let activeLink = nav.querySelector("a.active");
  if (!activeLink) {
    activeLink = document.getElementById("nav-home") || nav.querySelector("a");
  }

  if (activeLink) {
    const offsetLeft = activeLink.offsetLeft;
    const offsetWidth = activeLink.offsetWidth;
    const containerWidth = overlay.offsetWidth;

    if (containerWidth > 0) {
      const clipLeft = offsetLeft;
      const clipRight = offsetLeft + offsetWidth;

      const pctLeft = ((clipLeft / containerWidth) * 100).toFixed(2);
      const pctRight = (100 - (clipRight / containerWidth) * 100).toFixed(2);

      overlay.style.clipPath = `inset(0px ${pctRight}% 0px ${pctLeft}% round 9999px)`;
    }
  }
}

// Alinhar no redimensionamento da janela
window.addEventListener("resize", updateAnimatedTabs);

function toggleMenu() {
  document.getElementById("nav").classList.toggle("open");
  const hamburger = document.getElementById("hamburger");
  if (hamburger) hamburger.classList.toggle("open");
}


// ==== CARRINHO ====
function salvarCarrinho() {
  localStorage.setItem("lumiere_cart", JSON.stringify(carrinho));
  atualizarContador();
}

function atualizarContador() {
  const total = carrinho.reduce((s, i) => s + i.qty, 0);
  document.getElementById("cartCount").textContent = total;
}

function adicionarAoCarrinho(produtoId, tam, cor, qty) {
  const p = PRODUTOS.find(x => x.id === produtoId);
  if (!p) return;
  const key = produtoId + "|" + (tam || "") + "|" + (cor || "");
  const existente = carrinho.find(i => i.key === key);
  if (existente) {
    existente.qty += qty || 1;
  } else {
    carrinho.push({ key, produtoId, nome: p.nome, tamanho: tam, cor: cor, preco: p.preco, img: p.imgs[0], qty: qty || 1 });
  }
  salvarCarrinho();
  renderDrawerItems();
  abrirCarrinho();
}

function removerDoCarrinho(key) {
  carrinho = carrinho.filter(i => i.key !== key);
  salvarCarrinho();
  renderDrawerItems();
  if (paginaAtual === "carrinho") renderCarrinho();
}

function alterarQtd(key, delta) {
  const item = carrinho.find(i => i.key === key);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  salvarCarrinho();
  renderDrawerItems();
  if (paginaAtual === "carrinho") renderCarrinho();
}

function limparCarrinho() {
  carrinho = [];
  salvarCarrinho();
  renderDrawerItems();
  if (paginaAtual === "carrinho") renderCarrinho();
}

function toggleCarrinho() {
  document.getElementById("drawer").classList.toggle("open");
  document.getElementById("drawerOverlay").classList.toggle("open");
  renderDrawerItems();
}

function abrirCarrinho() {
  document.getElementById("drawer").classList.add("open");
  document.getElementById("drawerOverlay").classList.add("open");
}

function totalCarrinho() {
  return carrinho.reduce((s, i) => s + i.preco * i.qty, 0);
}

function renderDrawerItems() {
  const el = document.getElementById("drawerItems");
  const ft = document.getElementById("drawerFooter");
  if (!carrinho.length) {
    el.innerHTML = `<div class="drawer-empty"><span>🛍️</span><p>Seu carrinho está vazio.</p></div>`;
    ft.innerHTML = "";
    window.dispatchEvent(new Event("contentChanged"));
    return;
  }
  el.innerHTML = carrinho.map(i => `
    <div class="drawer-item">
      <img src="${i.img}" alt="${i.nome}" onerror="this.src='https://via.placeholder.com/80'" />
      <div class="drawer-item-info">
        <p class="drawer-item-name">${i.nome}</p>
        <p class="drawer-item-sub">${[i.tamanho ? "Nº " + i.tamanho : "", i.cor].filter(Boolean).join(" · ")}</p>
        <p class="drawer-item-price">R$ ${(i.preco * i.qty).toFixed(2).replace(".", ",")}</p>
        <div style="display:flex;align-items:center;gap:0.6rem;">
          <div class="qty-sm">
            <button onclick="alterarQtd('${i.key}', -1)">−</button>
            <span>${i.qty}</span>
            <button onclick="alterarQtd('${i.key}', 1)">+</button>
          </div>
          <button class="drawer-item-remove" onclick="removerDoCarrinho('${i.key}')">🗑 Remover</button>
        </div>
      </div>
    </div>`).join("");

  const total = totalCarrinho();
  ft.innerHTML = `
    <div class="drawer-total"><span>Total</span><span>R$ ${total.toFixed(2).replace(".", ",")}</span></div>
    <input class="drawer-nome" type="text" id="drawerNome" placeholder="Seu nome para o pedido" />
    <p class="drawer-err" id="drawerErr"></p>
    <button class="btn-whatsapp" style="width:100%;justify-content:center;" onclick="enviarWhatsApp('drawer')">
      💬 Finalizar pelo WhatsApp
    </button>
    <div class="drawer-actions">
      <button class="drawer-continue" onclick="toggleCarrinho()">Continuar comprando</button>
      <button class="drawer-clear" onclick="limparCarrinho()">Esvaziar</button>
    </div>
    <a class="drawer-see-cart" href="#" onclick="toggleCarrinho(); navigate('carrinho')">Ver carrinho completo →</a>`;

  window.dispatchEvent(new Event("contentChanged"));
}

// ==== WHATSAPP ====
function enviarWhatsApp(origem) {
  const nomeEl = document.getElementById(origem === "drawer" ? "drawerNome" : "nomeCliente");
  const errEl = document.getElementById(origem === "drawer" ? "drawerErr" : "carrinhoErr");
  const nome = nomeEl ? nomeEl.value.trim() : "";
  if (!nome) {
    if (errEl) errEl.textContent = "Por favor, informe seu nome antes de continuar.";
    nomeEl && nomeEl.focus();
    return;
  }
  if (errEl) errEl.textContent = "";

  // Exibir a animação de carregando antes de redirecionar
  showLoader();

  let msg = `Olá, meu nome é *${nome}* e gostaria de fazer um pedido:\n\n`;
  carrinho.forEach((i, idx) => {
    msg += `${idx + 1}. *${i.nome}*\n`;
    if (i.tamanho) msg += `   Tamanho: ${i.tamanho}\n`;
    if (i.cor) msg += `   Cor: ${i.cor}\n`;
    msg += `   Qtd: ${i.qty}x | R$ ${(i.preco * i.qty).toFixed(2).replace(".", ",")}\n\n`;
  });
  msg += `*Total: R$ ${totalCarrinho().toFixed(2).replace(".", ",")}*`;

  // Simular processamento por 1.5s antes de abrir o WhatsApp
  setTimeout(() => {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
    hideLoader();
  }, 1500);
}

// ==== HOME ====
function renderHome() {
  const destaques = PRODUTOS.filter(p => p.destaque).slice(0, 4);
  document.getElementById("destaquesGrid").innerHTML = destaques.map(renderCardPequeno).join("");
  const promos = PRODUTOS.filter(p => p.promo).slice(0, 4);
  document.getElementById("promosGrid").innerHTML = promos.map(renderCardPequeno).join("");
  window.dispatchEvent(new Event("contentChanged"));
}

// ==== PRODUTOS ====
function renderProdutos() {
  const cats = [...new Set(PRODUTOS.map(p => p.categoria))];
  document.getElementById("catChips").innerHTML = cats.map(c => `
    <button class="chip ${catSelecionada === c ? "active" : ""}" onclick="selecionarCat('${c}')">${c}</button>
  `).join("") + `<button class="chip ${catSelecionada === null ? "active" : ""}" onclick="selecionarCat(null)">Todos</button>`;
  filtrarProdutos();
}

function selecionarCat(cat) {
  catSelecionada = cat;
  document.querySelectorAll("#catChips .chip").forEach(c => c.classList.remove("active"));
  event.target.classList.add("active");
  filtrarProdutos();
}

function filtrarProdutos() {
  const busca = (document.getElementById("searchInput")?.value || "").toLowerCase();
  const precoMax = parseFloat(document.getElementById("precoRange")?.value || 500);
  const soPromo = document.getElementById("soPromo")?.checked;

  let filtrados = PRODUTOS.filter(p => {
    if (catSelecionada && p.categoria !== catSelecionada) return false;
    if (p.preco > precoMax) return false;
    if (soPromo && !p.promo) return false;
    if (busca && !p.nome.toLowerCase().includes(busca) && !p.categoria.toLowerCase().includes(busca)) return false;
    return true;
  });

  document.getElementById("produtosCount").textContent = `${filtrados.length} modelo${filtrados.length !== 1 ? "s" : ""} encontrado${filtrados.length !== 1 ? "s" : ""}`;
  document.getElementById("produtosGrid").innerHTML = filtrados.length
    ? filtrados.map(renderCardGrande).join("")
    : `<div style="grid-column:1/-1;text-align:center;padding:4rem;color:var(--muted);">Nenhum produto encontrado com esses filtros 😕</div>`;

  window.dispatchEvent(new Event("contentChanged"));
}

function toggleFiltros() {
  const p = document.getElementById("filtrosPanel");
  p.style.display = p.style.display === "none" ? "flex" : "none";
}

// ==== CARDS ====
function renderCardPequeno(p) {
  const desconto = p.precoOld ? Math.round((1 - p.preco / p.precoOld) * 100) : 0;
  return `
    <div class="product-card" onclick="abrirDetalhe(${p.id})">
      <div class="product-img-wrap">
        <img src="${p.imgs[0]}" alt="${p.nome}" loading="lazy" onerror="this.src='https://via.placeholder.com/300'" />
        ${p.tag ? `<span class="product-tag tag-${p.tag}">${p.tagLabel}</span>` : ""}
      </div>
      <div class="product-info">
        <p class="product-cat">${p.categoria}</p>
        <p class="product-name">${p.nome}</p>
        <div class="product-prices">
          ${p.precoOld ? `<span class="product-old">R$ ${p.precoOld.toFixed(2).replace(".", ",")}</span>` : ""}
          <span class="product-price">R$ ${p.preco.toFixed(2).replace(".", ",")}</span>
        </div>
        <div class="product-actions">
          <button class="btn-detail" onclick="event.stopPropagation(); abrirDetalhe(${p.id})">Ver detalhes</button>
          <button class="btn-add-cart" onclick="event.stopPropagation(); adicionarRapido(${p.id})" title="Adicionar ao carrinho">＋</button>
        </div>
      </div>
    </div>`;
}

function renderCardGrande(p) {
  return renderCardPequeno(p);
}

function adicionarRapido(produtoId) {
  const p = PRODUTOS.find(x => x.id === produtoId);
  adicionarAoCarrinho(produtoId, p.tamanhos[Math.floor(p.tamanhos.length / 2)], p.cores[0], 1);
}

// ==== DETALHE ====
function abrirDetalhe(produtoId) {
  produtoAtual = PRODUTOS.find(p => p.id === produtoId);
  if (!produtoAtual) return;
  qtdDetalhe = 1;
  tamSelecionado = null;
  corSelecionada = null;
  imgAtual = 0;
  navigate("detalhe");
  renderDetalhe();
}

function renderDetalhe() {
  const p = produtoAtual;
  if (!p) return;
  const desconto = p.precoOld ? Math.round((1 - p.preco / p.precoOld) * 100) : 0;
  const preco = p.preco.toFixed(2).replace(".", ",");
  const parcela = (p.preco / 3).toFixed(2).replace(".", ",");

  document.getElementById("detalheConteudo").innerHTML = `
    <div class="detalhe-galeria">
      <div class="detalhe-main-img" id="mainImgWrap">
        <img id="mainImg" src="${p.imgs[imgAtual]}" alt="${p.nome}" />
      </div>
      <div class="detalhe-thumbs">
        ${p.imgs.map((img, i) => `
          <div class="detalhe-thumb ${i === imgAtual ? "active" : ""}" onclick="mudarImg(${i})">
            <img src="${img}" alt="Foto ${i+1}" loading="lazy" />
          </div>
        `).join("")}
      </div>
    </div>

    <div class="detalhe-info">
      <p class="detalhe-cat">${p.categoria} · ${p.genero}</p>
      <h1 class="detalhe-nome">${p.nome}</h1>
      <div class="detalhe-stars">★★★★★ <span>(4.9 · 128 avaliações)</span></div>

      <div class="detalhe-precos">
        ${p.precoOld ? `<span class="detalhe-old">R$ ${p.precoOld.toFixed(2).replace(".", ",")}</span>` : ""}
        <span class="detalhe-price">R$ ${preco}</span>
        ${desconto ? `<span class="detalhe-desconto">−${desconto}%</span>` : ""}
      </div>
      <p class="detalhe-parcela">ou 3× de R$ ${parcela} sem juros</p>

      <p class="detalhe-desc">${p.desc}</p>

      <p class="opcoes-label">Tamanho</p>
      <div class="opcoes-chips" id="tamChips">
        ${p.tamanhos.map(t => `<button class="opcao-chip" onclick="selecionarTam('${t}')">${t}</button>`).join("")}
      </div>

      <p class="opcoes-label">Cor</p>
      <div class="opcoes-chips" id="corChips">
        ${p.cores.map(c => `<button class="opcao-chip" onclick="selecionarCor('${c}')">${c}</button>`).join("")}
      </div>

      <p class="opcoes-label">Quantidade</p>
      <div class="qty-control">
        <button class="qty-btn" onclick="mudarQtd(-1)">−</button>
        <span class="qty-val" id="qtdDetalheEl">${qtdDetalhe}</span>
        <button class="qty-btn" onclick="mudarQtd(1)">+</button>
      </div>

      <div class="detalhe-cta">
        <button class="btn-primary" onclick="addDetalhe()">🛍 Adicionar ao carrinho</button>
        <a href="https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Olá! Tenho interesse no produto: ' + p.nome)}" target="_blank" class="btn-whatsapp">💬 Comprar via WhatsApp</a>
      </div>

      <div class="detalhe-specs">
        <div class="spec-card"><p>Material</p><p>${p.material}</p></div>
        <div class="spec-card"><p>Peso</p><p>${p.peso}</p></div>
        <div class="spec-card"><p>Garantia</p><p>${p.garantia}</p></div>
        <div class="spec-card"><p>Entrega</p><p>Em até 5 dias úteis</p></div>
      </div>
    </div>`;

  window.dispatchEvent(new Event("contentChanged"));
}

function mudarImg(idx) {
  imgAtual = idx;
  document.getElementById("mainImg").src = produtoAtual.imgs[idx];
  document.querySelectorAll(".detalhe-thumb").forEach((t, i) => {
    t.classList.toggle("active", i === idx);
  });
}

function selecionarTam(t) {
  tamSelecionado = t;
  document.querySelectorAll("#tamChips .opcao-chip").forEach(c => c.classList.toggle("active", c.textContent === t));
}

function selecionarCor(c) {
  corSelecionada = c;
  document.querySelectorAll("#corChips .opcao-chip").forEach(el => el.classList.toggle("active", el.textContent === c));
}

function mudarQtd(delta) {
  qtdDetalhe = Math.max(1, qtdDetalhe + delta);
  document.getElementById("qtdDetalheEl").textContent = qtdDetalhe;
}

function addDetalhe() {
  if (!tamSelecionado) { alert("Por favor, selecione um tamanho."); return; }
  if (!corSelecionada) { alert("Por favor, selecione uma cor."); return; }
  adicionarAoCarrinho(produtoAtual.id, tamSelecionado, corSelecionada, qtdDetalhe);
}

// ==== CARRINHO PÁGINA ====
function renderCarrinho() {
  const el = document.getElementById("carrinhoLayout");
  if (!carrinho.length) {
    el.innerHTML = `
      <div class="carrinho-empty" style="grid-column:1/-1">
        <span style="font-size:3rem">🛍️</span>
        <p>Seu carrinho está vazio.</p>
        <button class="btn-primary" onclick="navigate('produtos')">Explorar produtos</button>
      </div>`;
    window.dispatchEvent(new Event("contentChanged"));
    return;
  }

  const total = totalCarrinho();
  const frete = total > 200 ? 0 : 19.90;
  const grand = total + frete;

  const itensHtml = carrinho.map(i => `
    <div class="carrinho-item">
      <img src="${i.img}" alt="${i.nome}" onerror="this.src='https://via.placeholder.com/100'" />
      <div class="carrinho-item-info">
        <p class="carrinho-item-name">${i.nome}</p>
        <p class="carrinho-item-sub">${[i.tamanho ? "Nº " + i.tamanho : "", i.cor].filter(Boolean).join(" · ")}</p>
        <p class="carrinho-item-price">R$ ${i.preco.toFixed(2).replace(".", ",")} cada</p>
        <div class="carrinho-item-controls">
          <div class="qty-control" style="height:auto">
            <button class="qty-btn" onclick="alterarQtd('${i.key}', -1)">−</button>
            <span class="qty-val">${i.qty}</span>
            <button class="qty-btn" onclick="alterarQtd('${i.key}', 1)">+</button>
          </div>
          <button style="font-size:0.8rem;color:var(--muted)" onclick="removerDoCarrinho('${i.key}')">🗑 Remover</button>
        </div>
      </div>
      <p class="carrinho-item-total">R$ ${(i.preco * i.qty).toFixed(2).replace(".", ",")}</p>
    </div>`).join("");

  el.innerHTML = `
    <div class="carrinho-lista">${itensHtml}</div>
    <div class="carrinho-resumo">
      <h2>Resumo do pedido</h2>
      <div class="resumo-line"><span>Subtotal</span><span>R$ ${total.toFixed(2).replace(".", ",")}</span></div>
      <div class="resumo-line"><span>Frete</span><span>${frete ? "R$ " + frete.toFixed(2).replace(".", ",") : "🎉 Grátis"}</span></div>
      ${total < 200 ? `<p style="font-size:0.75rem;color:var(--muted)">Frete grátis acima de R$ 200,00</p>` : ""}
      <div class="resumo-total"><span>Total</span><span>R$ ${grand.toFixed(2).replace(".", ",")}</span></div>
      <input class="nome-input" type="text" id="nomeCliente" placeholder="Seu nome para o pedido" />
      <p class="drawer-err" id="carrinhoErr"></p>
      <button class="btn-whatsapp" style="width:100%;justify-content:center;" onclick="enviarWhatsApp('carrinho')">
        💬 Finalizar pelo WhatsApp
      </button>
      <button onclick="limparCarrinho()" style="display:block;width:100%;text-align:center;margin-top:0.75rem;font-size:0.82rem;color:var(--muted)">Esvaziar carrinho</button>
    </div>`;

  window.dispatchEvent(new Event("contentChanged"));
}

// ==== INIT ====
function init() {
  initTheme();
  document.getElementById("year").textContent = new Date().getFullYear();

  // Update all static WhatsApp links on the page with the configured WHATSAPP_NUMBER
  document.querySelectorAll('a[href*="wa.me"]').forEach(a => {
    try {
      const url = new URL(a.href);
      a.href = `https://wa.me/${WHATSAPP_NUMBER}${url.search}`;
    } catch(e) {}
  });

  atualizarContador();
  renderHome();

  // Initialize Interactivity & Animations
  initScrollReveal();
  initHeroCardTilt();
  initHeroCanvas();
  initStatCounters();

  // Destacar a aba ativa na inicialização
  setTimeout(updateAnimatedTabs, 100);
}

// ==== ANIMATIONS & INTERACTIVITY ====


function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, {
    threshold: 0.05
  });

  const updateReveals = () => {
    document.querySelectorAll(".reveal").forEach(el => {
      observer.observe(el);
    });
  };

  updateReveals();
  window.addEventListener("contentChanged", updateReveals);
}

function initHeroCardTilt() {
  const card = document.getElementById("heroCard");
  if (!card) return;

  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((centerY - y) / centerY) * 15;
    const rotateY = ((x - centerX) / centerX) * 15;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  });
}

function initHeroCanvas() {
  const canvas = document.getElementById("heroCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let width = canvas.width = canvas.offsetWidth;
  let height = canvas.height = canvas.offsetHeight;

  window.addEventListener("resize", () => {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
  });

  const particles = [];
  const numParticles = 40;

  for (let i = 0; i < numParticles; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2 + 1,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.5 + 0.1
    });
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201, 168, 76, ${p.alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(animate);
  }
  animate();
}

function initStatCounters() {
  const counters = document.querySelectorAll(".stat-n");
  if (!counters.length) return;

  const animateCount = (el) => {
    const target = parseInt(el.getAttribute("data-target"), 10);
    const duration = 2000;
    const start = 0;
    const startTime = performance.now();

    const update = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = progress * (2 - progress);
      const current = Math.floor(start + easedProgress * (target - start));
      
      el.textContent = current;
      
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target;
      }
    };
    requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains("counted")) {
        entry.target.classList.add("counted");
        animateCount(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

// ==== THEME TOGGLE (Modo Claro / Escuro) ====
function initTheme() {
  const savedTheme = localStorage.getItem("theme") || "dark";
  if (savedTheme === "light") {
    document.documentElement.classList.add("light");
    document.documentElement.classList.remove("dark");
  } else {
    document.documentElement.classList.add("dark");
    document.documentElement.classList.remove("light");
  }
  updateToggleIcons(savedTheme);
}

function toggleTheme() {
  const isLight = document.documentElement.classList.contains("light");
  const nextTheme = isLight ? "dark" : "light";
  
  if (nextTheme === "light") {
    document.documentElement.classList.add("light");
    document.documentElement.classList.remove("dark");
  } else {
    document.documentElement.classList.add("dark");
    document.documentElement.classList.remove("light");
  }
  
  localStorage.setItem("theme", nextTheme);
  updateToggleIcons(nextTheme);
}

function updateToggleIcons(theme) {
  const moonIcon = document.querySelector(".toggle-moon-icon");
  const sunIcon = document.querySelector(".toggle-sun-icon");
  const trackMoonIcon = document.querySelector(".track-moon-icon");
  const trackSunIcon = document.querySelector(".track-sun-icon");
  
  if (!moonIcon || !sunIcon) return;
  
  if (theme === "light") {
    moonIcon.style.display = "none";
    sunIcon.style.display = "block";
    trackMoonIcon.style.display = "block";
    trackSunIcon.style.display = "none";
  } else {
    moonIcon.style.display = "block";
    sunIcon.style.display = "none";
    trackMoonIcon.style.display = "none";
    trackSunIcon.style.display = "block";
  }
}

// Torna toggleTheme global para uso direto em inline onclick
window.toggleTheme = toggleTheme;

document.addEventListener("DOMContentLoaded", init);

