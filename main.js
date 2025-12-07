document.addEventListener("DOMContentLoaded", function () {
  // === Menu Mobile ===
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");

  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener("click", function () {
      mobileMenu.classList.toggle("hidden");
    });

    mobileMenu.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => mobileMenu.classList.add("hidden"));
    });
  }

    // Generate Projects Dynamically
  const projectsGrid = document.getElementById("projects-grid");
  if (projectsGrid) {
    const projects = [
      { id: 1, location: "Porto Velho - RO", type: "Residencial", kWp: 3.5, savings: 350 },
      { id: 2, location: "Porto Velho - RO", type: "Residencial", kWp: 7.0, savings: 700 },
      { id: 3, location: "Porto Velho - RO", type: "Residencial", kWp: 10.5, savings: 1050 },
      { id: 4, location: "Porto Velho - RO", type: "Residencial", kWp: 14.0, savings: 1400 },
      { id: 5, location: "Porto Velho - RO", type: "Residencial", kWp: 17.5, savings: 1750 },
      { id: 6, location: "Porto Velho - RO", type: "Residencial", kWp: 21.0, savings: 2100 },
    ];

    const fragment = document.createDocumentFragment();
    projects.forEach((project) => {
      const card = document.createElement("div");
      card.className = "bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden hover:bg-white/20 transition-colors";
      card.innerHTML = `
        <div class="h-48 relative">
          <img src="img/projeto${project.id}.jpg" alt="Projeto ${project.id}" class="w-full h-full object-cover" loading="lazy">
        </div>
        <div class="p-4">
          <h3 class="font-semibold text-lg mb-1">Projeto em ${project.location}</h3>
          <p class="text-sm opacity-90 mb-2">Sistema de ${project.kWp.toFixed(1)} kWp - ${project.type}</p>
          <p class="text-sm opacity-80">Economia mensal estimada: R$ ${project.savings.toFixed(2)}</p>
        </div>
      `;
      fragment.appendChild(card);
    });
    projectsGrid.appendChild(fragment);
  }

  // === Envio do formulário para o WhatsApp ===
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Captura os dados do formulário
      const nome = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const telefone = document.getElementById("phone").value.trim();
      const cpf = document.getElementById("cpf").value.trim();
      const cidade = document.getElementById("city").value.trim();
      const endereco = document.getElementById("address").value.trim();
      const tipo = document.getElementById("tipo").value;
      const potencia = document.getElementById("potencia").value.trim();
      const mensagem = document.getElementById("message").value.trim();

      // Validação simples
      if (!nome || !email || !telefone) {
        alert("Por favor, preencha pelo menos Nome, E-mail e Telefone.");
        return;
      }

      // Número do WhatsApp (com DDI 55 e DDD)
      const numeroEmpresa = "556993853683"; // só números

      // Monta a mensagem com quebras de linha
      const texto =
    `🌞 *Novo Pedido de Orçamento - SunTech Solar* 🌞%0A%0A` +
    `👤 *Nome:* ${nome}%0A` +
    `📧 *E-mail:* ${email}%0A` +
    `📱 *Telefone:* ${telefone}%0A` +
    `🧾 *CPF/CNPJ:* ${cpf}%0A` +
    `🏙️ *Cidade:* ${cidade}%0A` +
    `📍 *Endereço:* ${endereco}%0A%0A` +
    `⚙️ *Tipo de Projeto:* ${tipo}%0A` +
    `🔋 *Potência Estimada:* ${potencia} kWp%0A%0A` +
    `📝 *Mensagem adicional:*%0A${mensagem}%0A%0A` +
    `_________________________%0A` +
    `📅 Enviado via *Formulário do Site*`;

      // Monta o link correto do WhatsApp
      const url = `https://wa.me/${numeroEmpresa}?text=${texto}`;

      // Abre o WhatsApp em nova aba
      window.open(url, "_blank"); 
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.getElementById("chatbot-toggle");
  const box = document.getElementById("chatbot-box");
  const closeBtn = document.getElementById("chatbot-close");
  const sendBtn = document.getElementById("chatbot-send");
  const input = document.getElementById("chatbot-input");
  const messages = document.getElementById("chatbot-messages");

  let etapa = 0;
  let tipoFluxo = "";
  let dados = { nome: "", cidade: "", tipoProjeto: "", consumo: "", area: "", placa: "", quantidade: "" };

  // Função para validar números
  function validarNumero(v) { return !isNaN(v) && Number(v) > 0; }

  // Digitando...
  function botDigitando() {
    const div = document.createElement("div");
    div.id = "digitando";
    div.classList.add("text-gray-500", "text-xs");
    div.textContent = "Digitando...";
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }
  function removerDigitando() {
    const d = document.getElementById("digitando");
    if (d) d.remove();
  }

  // Adicionar mensagem ao chat
  function msg(texto, tipo) {
    removerDigitando();
    const div = document.createElement("div");
    div.classList.add("p-2", "rounded-lg", "max-w-[80%]");
    if (tipo === "user") div.classList.add("bg-[#FFB700]/20", "text-right", "ml-auto");
    else div.classList.add("bg-gray-100", "text-gray-800");
    div.innerHTML = texto;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  // Botões iniciais
  function botoesInicio() {
    const div = document.createElement("div");
    div.classList.add("flex", "flex-col", "gap-3", "mt-3");

    const b1 = document.createElement("button");
    b1.textContent = "📞 Atendimento";
    b1.classList.add("bg-[#25D366]", "text-white", "px-3", "py-2", "rounded-lg");
    b1.onclick = () => { tipoFluxo = "orcamento"; div.remove(); msg(b1.textContent, "user"); perguntarNome(); };

    const b2 = document.createElement("button");
    b2.textContent = "⚡ Realizar Simulação";
    b2.classList.add("bg-[#004C01]", "text-white", "px-3", "py-2", "rounded-lg");
    b2.onclick = () => { tipoFluxo = "simulacao"; div.remove(); msg(b2.textContent, "user"); perguntarNome(); };

    div.append(b1, b2);
    messages.appendChild(div);
  }

  // WhatsApp
  function botaoWhats() {
    const existente = document.getElementById("whatsapp-btn");
    if (existente) existente.remove();

    const numero = "5569993853683";
    let mensagem = `Olá! Tenho interesse em atendimento.\n\nNome: ${dados.nome}\nCidade: ${dados.cidade}\n Tipo de Projeto ${dados.tipoProjeto}\nConsumo: ${dados.consumo} kWh\n`;

    if (tipoFluxo === "simulacao") {
      mensagem += `Área: ${dados.area} m²\nPlaca: ${dados.placa}w\nQuantidade: ${dados.quantidade}\n`;
    }

    const link = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;

    const btn = document.createElement("a");
    btn.id = "whatsapp-btn";
    btn.href = link;
    btn.target = "_blank";
    btn.innerHTML = "📞 Enviar informações no WhatsApp";
    btn.classList.add("block", "mt-3", "bg-[#25D366]", "text-white", "py-2", "rounded-md");
    messages.appendChild(btn);

    reiniciarBtn();
  }

  function reiniciarBtn() {
    const btn = document.createElement("button");
    btn.textContent = "🔄 Nova conversa";
    btn.classList.add("block", "w-full", "mt-2", "bg-gray-200", "py-2", "rounded-md");
    btn.onclick = () => resetarChat();
    messages.appendChild(btn);
  }

  function perguntarNome() {
    etapa = 1;
    botDigitando();
    setTimeout(() => msg("Qual o seu nome completo?", "bot"), 600);
  }

  // Processar etapas
  function processar() {
    const texto = input.value.trim();
    if (!texto) return;
    input.value = "";
    msg(texto, "user");

switch (etapa) {
  case 1:
    dados.nome = texto;
    etapa = 2;
    botDigitando();
    setTimeout(() => msg("Qual cidade você mora?", "bot"), 600);
    break;

  case 2:
    if (!/[a-zA-ZÀ-ú]/.test(texto)) {
      return msg("Por favor, informe o nome da cidade corretamente 🏙️", "bot");
    }

    dados.cidade = texto;

    if (tipoFluxo === "orcamento") {
      etapa = 3;
      botDigitando();
      setTimeout(() => msg("Qual seu tipo de projeto? (Residencial, Comercial ou Industrial)", "bot"), 600);
    } else {
      etapa = 4;
      botDigitando();
      setTimeout(() => msg("Qual o consumo médio mensal (em kWh)?", "bot"), 600);
    }
    break;

  case 3: // Somente para atendimento
    const tipo = texto.toLowerCase();

    if (!["residencial", "comercial", "industrial"].includes(tipo)) {
      return msg("Escolha uma opção válida: Residencial, Comercial ou Industrial 🏗️", "bot");
    }

    dados.tipoProjeto = texto;
    etapa = 4;
    botDigitando();
    setTimeout(() => msg("Qual o consumo médio mensal (em kWh)?", "bot"), 600);
    break;

  case 4:
    if (!validarNumero(texto)) return msg("Por favor, informe um número válido 🧮", "bot");
    dados.consumo = texto;

    if (tipoFluxo === "orcamento") {
      botaoWhats();
    } else {
      etapa = 5;
      botDigitando();
      setTimeout(() => msg("Qual o tamanho da área disponível (m²)?", "bot"), 600);
    }
    break;

  case 5:
    if (!validarNumero(texto)) return msg("Digite um valor numérico válido 🙂", "bot");
    dados.area = texto;
    etapa = 6;
    botDigitando();
    setTimeout(() => msg("Qual a potência da placa? (ex: 550W)", "bot"), 600);
    break;

  case 6:
    if (!validarNumero(texto)) return msg("Informe apenas números (ex: 550) 📌", "bot");
    dados.placa = texto;
    etapa = 7;
    botDigitando();
    setTimeout(() => msg("Quantas placas deseja instalar?", "bot"), 600);
    break;

  case 7:
    if (!validarNumero(texto)) return msg("Digite uma quantidade válida 😊", "bot");
    dados.quantidade = texto;
    botaoWhats();
    break;
}

  }

  sendBtn.onclick = processar;
  input.addEventListener("keypress", e => { if (e.key === "Enter") processar(); });

  // Resetar conversa ao fechar
  function resetarChat() {
    etapa = 0;
    tipoFluxo = "";
    messages.innerHTML = "";
    iniciarSaudacao();
  }

  // Abrir / Fechar chat
  toggle.onclick = () => { box.classList.remove("hidden"); toggle.classList.add("hidden"); messages.innerHTML = ""; iniciarSaudacao(); }; // limpa as mensagens
  closeBtn.onclick = () => { box.classList.add("hidden"); toggle.classList.remove("hidden");}; // Não chamar resetarChat aqui 

  // Saudação inicial
  function iniciarSaudacao() {
    msg("👋 Olá! Eu sou o assistente da Suntech Solar.", "bot");
    setTimeout(() => {
      msg("Como posso te ajudar hoje?", "bot");
      botoesInicio();
    }, 800);
  }
});