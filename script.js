document.addEventListener('DOMContentLoaded', function() {
    const descricaoContainer = document.querySelector('#descricao-container');
    const botaoAdicionar = document.getElementById('adicionar-container');
    const linksAbas = document.querySelectorAll('.head a');
    const tituloAba = document.getElementById('titulo-aba');

    let abaAtual = 'nivel0'; // Aba padrão

    // Função para salvar os containers no localStorage da aba atual
    const salvarContainers = () => {
        const containers = [];
        descricaoContainer.querySelectorAll('.descricao').forEach(container => {
            const id = container.getAttribute('data-id');
            const titulo = container.querySelector('.editavel-titulo').innerText;
            const conjuracao = container.querySelector('[data-campo="conjuracao"]').innerText;
            const alcance = container.querySelector('[data-campo="alcance"]').innerText;
            const alvo = container.querySelector('[data-campo="alvo"]').innerText;
            const duracao = container.querySelector('[data-campo="duracao"]').innerText;
            const descricao = container.querySelector('.descricao-texto').innerText;

            // Verifica se o container foi editado (não é apenas o placeholder)
            const foiEditado = (
                titulo !== "Digite aqui" ||
                conjuracao !== "Digite aqui" ||
                alcance !== "Digite aqui" ||
                alvo !== "Digite aqui" ||
                duracao !== "Digite aqui" ||
                descricao !== "Digite aqui"
            );

            // Salva apenas se foi editado
            if (foiEditado) {
                containers.push({
                    id,
                    titulo,
                    conjuracao,
                    alcance,
                    alvo,
                    duracao,
                    descricao
                });
            }
        });
        localStorage.setItem(abaAtual, JSON.stringify(containers));
    };

    // Função para carregar os containers do localStorage da aba atual
    const carregarContainers = () => {
        const containersSalvos = JSON.parse(localStorage.getItem(abaAtual)) || [];
        descricaoContainer.innerHTML = ''; // Limpa o container antes de carregar
        containersSalvos.forEach(container => {
            criarNovoContainer(container);
        });
    };

    // Função para criar um novo container de descrição
    const criarNovoContainer = (dados = {}) => {
        const novoContainer = document.createElement('div');
        novoContainer.classList.add('descricao');
        novoContainer.setAttribute('data-id', dados.id || Date.now());

        novoContainer.innerHTML = `
            <button class="excluir-container">Excluir</button>
            <h2 class="editavel-titulo" data-campo="titulo">${dados.titulo || "Digite aqui"}</h2>
            <p><strong>Conjuração:</strong> <span class="editavel-opcao" data-campo="conjuracao">${dados.conjuracao || "Digite aqui"}</span></p>
            <p><strong>Alcance:</strong> <span class="editavel-opcao" data-campo="alcance">${dados.alcance || "Digite aqui"}</span></p>
            <p><strong>Alvo:</strong> <span class="editavel-opcao" data-campo="alvo">${dados.alvo || "Digite aqui"}</span></p>
            <p><strong>Duração:</strong> <span class="editavel-opcao" data-campo="duracao">${dados.duracao || "Digite aqui"}</span></p>
            <br>
            <p class="descricao-texto">${dados.descricao || "Digite aqui"}</p>
        `;

        // Aplicar a funcionalidade de edição ao novo container
        aplicarFuncionalidadeEdicao(novoContainer);

        // Adicionar funcionalidade de exclusão ao botão
        const botaoExcluir = novoContainer.querySelector('.excluir-container');
        botaoExcluir.addEventListener('click', function() {
            novoContainer.remove(); // Remove o container do DOM
            salvarContainers(); // Atualiza o localStorage
        });

        // Adicionar o novo container ao DOM
        descricaoContainer.appendChild(novoContainer);

        // Salvar os containers no localStorage
        salvarContainers();
    };

    // Função para aplicar a funcionalidade de edição a um container
    const aplicarFuncionalidadeEdicao = (container) => {
        const id = container.getAttribute('data-id');

        // Função para tornar um elemento editável
        const tornarEditavel = (elemento, campo) => {
            elemento.addEventListener('click', function() {
                // Verifica se já há um input ou textarea aberto
                if (elemento.querySelector('input, textarea')) return;

                // Cria um input temporário
                const input = document.createElement('input');
                input.type = 'text';
                input.value = elemento.innerText.trim(); // Pega o texto do elemento
                input.placeholder = "Digite aqui"; // Placeholder
                input.classList.add('editavel-temporario');

                // Substitui o texto pelo input
                const textoOriginal = elemento.innerText; // Salva o texto original
                elemento.innerText = ''; // Limpa o conteúdo do elemento
                elemento.appendChild(input);
                input.focus();

                // Salvar ao pressionar "Enter" ou clicar fora
                const salvarEdicao = () => {
                    const novoTexto = input.value.trim();
                    elemento.innerText = novoTexto || textoOriginal; // Restaura o texto ou exibe o texto original
                    salvarContainers(); // Atualiza o localStorage
                };

                input.addEventListener('keydown', function(event) {
                    if (event.key === 'Enter') {
                        salvarEdicao();
                    }
                });

                input.addEventListener('blur', function() {
                    salvarEdicao();
                });
            });
        };

        // Aplicar a funcionalidade de edição ao título
        const tituloElemento = container.querySelector('.editavel-titulo');
        tornarEditavel(tituloElemento, 'titulo');

        // Aplicar a funcionalidade de edição ao texto da descrição
        const textoElemento = container.querySelector('.descricao-texto');
        textoElemento.addEventListener('click', function() {
            // Verifica se já há um input ou textarea aberto
            if (textoElemento.querySelector('input, textarea')) return;

            const textarea = document.createElement('textarea');
            textarea.value = textoElemento.innerText === "Digite aqui" ? "" : textoElemento.innerText; // Remove o placeholder ao editar
            textarea.placeholder = "Digite aqui"; // Placeholder
            textarea.classList.add('editavel-temporario');

            // Substitui o texto pelo textarea
            const textoOriginal = textoElemento.innerText; // Salva o texto original
            textoElemento.innerText = ''; // Limpa o conteúdo do elemento
            textoElemento.appendChild(textarea);
            textarea.focus();

            // Função para salvar a edição
            const salvarEdicao = () => {
                const novoTexto = textarea.value.trim();
                textoElemento.innerText = novoTexto || textoOriginal; // Restaura o texto ou exibe o texto original
                salvarContainers(); // Atualiza o localStorage
            };

            // Salvar ao pressionar "Enter"
            textarea.addEventListener('keydown', function(event) {
                if (event.key === 'Enter') {
                    event.preventDefault(); // Evita quebrar a linha no textarea
                    salvarEdicao();
                }
            });

            // Salvar ao clicar fora
            textarea.addEventListener('blur', function() {
                salvarEdicao();
            });
        });

        // Aplicar a funcionalidade de edição às outras opções
        const opcoesEditaveis = container.querySelectorAll('.editavel-opcao');
        opcoesEditaveis.forEach(opcao => {
            const campo = opcao.getAttribute('data-campo');
            tornarEditavel(opcao, campo);
        });
    };

    // Adicionar funcionalidade ao botão de adicionar container
    botaoAdicionar.addEventListener('click', () => criarNovoContainer());

    // Função para trocar de aba
    const trocarAba = (novaAba) => {
        abaAtual = novaAba; // Atualiza a aba atual
        carregarContainers(); // Carrega os containers da nova aba

        // Atualiza o título da aba
        const nomeAba = document.querySelector(`[data-aba="${novaAba}"]`).textContent;
        tituloAba.textContent = nomeAba; // Define o texto do título
    };

    // Adicionar funcionalidade aos links das abas
    linksAbas.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Evita o comportamento padrão do link
            trocarAba(this.getAttribute('data-aba')); // Troca para a aba clicada
        });
    });

    // Carregar os containers da aba padrão ao iniciar a página
    carregarContainers();
});