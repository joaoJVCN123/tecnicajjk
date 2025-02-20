document.addEventListener('DOMContentLoaded', function() {
    const descricaoContainer = document.querySelector('#descricao-container');
    const botaoAdicionar = document.getElementById('adicionar-container');
    const linksAbas = document.querySelectorAll('.head a');
    const tituloAba = document.getElementById('titulo-aba');
    const listaPersonagens = document.getElementById('lista-personagens');
    const botaoAdicionarPersonagem = document.getElementById('adicionar-personagem');
    const toggleButton = document.getElementById('toggle-esquerda');
    const selecaoPersonagem = document.getElementById('selecao-personagem');

    toggleButton.addEventListener('click', function() {
        selecaoPersonagem.classList.toggle('recolhido');
        if (selecaoPersonagem.classList.contains('recolhido')) {
            toggleButton.textContent = '►'; // Seta para a direita (recolhido)
        } else {
            toggleButton.textContent = '◄'; // Seta para a esquerda (expandido)
        }
    });

    let personagemAtual = null; // Personagem atual (será definido ao carregar a página)
    let abaAtual = 'nivel0'; // Aba padrão

    // Função para salvar os containers no localStorage do personagem atual
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

            const foiEditado = (
                titulo !== "Digite aqui" ||
                conjuracao !== "Digite aqui" ||
                alcance !== "Digite aqui" ||
                alvo !== "Digite aqui" ||
                duracao !== "Digite aqui" ||
                descricao !== "Digite aqui"
            );

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
        localStorage.setItem(`${personagemAtual}-${abaAtual}`, JSON.stringify(containers));
    };

    // Função para carregar os containers do localStorage do personagem atual
    const carregarContainers = () => {
        const containersSalvos = JSON.parse(localStorage.getItem(`${personagemAtual}-${abaAtual}`)) || [];
        descricaoContainer.innerHTML = '';
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
            <h2 class="editavel-titulo" data-campo="titulo">${dados.titulo || "Digite aqui"}</h2>
            <p><strong>Conjuração:</strong> <span class="editavel-opcao" data-campo="conjuracao">${dados.conjuracao || "Digite aqui"}</span></p>
            <p><strong>Alcance:</strong> <span class="editavel-opcao" data-campo="alcance">${dados.alcance || "Digite aqui"}</span></p>
            <p><strong>Alvo:</strong> <span class="editavel-opcao" data-campo="alvo">${dados.alvo || "Digite aqui"}</span></p>
            <p><strong>Duração:</strong> <span class="editavel-opcao" data-campo="duracao">${dados.duracao || "Digite aqui"}</span></p>
            <br>
            <p class="descricao-texto">${dados.descricao || "Digite aqui"}</p><br>
            <button class="excluir-container">Excluir</button>
        `;

        aplicarFuncionalidadeEdicao(novoContainer);

        const botaoExcluir = novoContainer.querySelector('.excluir-container');
        botaoExcluir.addEventListener('click', function() {
            if (confirm("Você tem certeza que deseja excluir esta técnica?")) {
                novoContainer.remove(); 
                salvarContainers(); 
            }
        });

        descricaoContainer.appendChild(novoContainer);
        salvarContainers();
    };

    // Função para aplicar a funcionalidade de edição a um container
    const aplicarFuncionalidadeEdicao = (container) => {
        const tornarEditavel = (elemento, campo) => {
            elemento.addEventListener('click', function() {
                if (elemento.querySelector('input, textarea')) return;

                const input = document.createElement('input');
                input.type = 'text';
                input.value = elemento.innerText.trim();
                input.placeholder = "Digite aqui";
                input.classList.add('editavel-temporario');

                const textoOriginal = elemento.innerText;
                elemento.innerText = '';
                elemento.appendChild(input);
                input.focus();

                const salvarEdicao = () => {
                    const novoTexto = input.value.trim();
                    elemento.innerText = novoTexto || textoOriginal;
                    salvarContainers();
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

        const tituloElemento = container.querySelector('.editavel-titulo');
        tornarEditavel(tituloElemento, 'titulo');

        const textoElemento = container.querySelector('.descricao-texto');
        textoElemento.addEventListener('click', function() {
            if (textoElemento.querySelector('input, textarea')) return;

            const textarea = document.createElement('textarea');
            textarea.value = textoElemento.innerText === "Digite aqui" ? "" : textoElemento.innerText;
            textarea.placeholder = "Digite aqui";
            textarea.classList.add('editavel-temporario');

            const textoOriginal = textoElemento.innerText;
            textoElemento.innerText = '';
            textoElemento.appendChild(textarea);
            textarea.focus();

            const salvarEdicao = () => {
                const novoTexto = textarea.value.trim();
                textoElemento.innerText = novoTexto || textoOriginal;
                salvarContainers();
            };

            textarea.addEventListener('keydown', function(event) {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    salvarEdicao();
                }
            });

            textarea.addEventListener('blur', function() {
                salvarEdicao();
            });
        });

        const opcoesEditaveis = container.querySelectorAll('.editavel-opcao');
        opcoesEditaveis.forEach(opcao => {
            const campo = opcao.getAttribute('data-campo');
            tornarEditavel(opcao, campo);
        });
    };

    // Função para trocar de personagem
    const trocarPersonagem = (novoPersonagem) => {
        personagemAtual = novoPersonagem;
        carregarContainers(); // Carrega os containers do novo personagem
    };

    // Função para editar o nome de um personagem
    const editarNomePersonagem = (personagem) => {
        const novoNome = prompt("Digite o novo nome do personagem:", personagem.textContent);
        if (novoNome && novoNome.trim() !== "") {
            const personagemAntigo = personagem.getAttribute('data-personagem');
            const personagemNovo = novoNome.toLowerCase().replace(/\s/g, '');

            // Atualiza o nome no DOM
            personagem.textContent = novoNome;
            personagem.setAttribute('data-personagem', personagemNovo);

            // Atualiza o localStorage
            if (personagemAntigo === personagemAtual) {
                personagemAtual = personagemNovo;
            }

            // Renomeia as chaves no localStorage
            const chaves = Object.keys(localStorage);
            chaves.forEach(chave => {
                if (chave.startsWith(personagemAntigo)) {
                    const dados = JSON.parse(localStorage.getItem(chave));
                    localStorage.removeItem(chave);
                    localStorage.setItem(chave.replace(personagemAntigo, personagemNovo), JSON.stringify(dados));
                }
            });

            // Atualiza a lista de personagens no localStorage
            atualizarLocalStoragePersonagens();
        }
    };

    // Função para atualizar a lista de personagens no localStorage
    const atualizarLocalStoragePersonagens = () => {
        const personagens = [];
        listaPersonagens.querySelectorAll('li').forEach(personagem => {
            personagens.push({
                nome: personagem.textContent,
                id: personagem.getAttribute('data-personagem')
            });
        });
        localStorage.setItem('personagens', JSON.stringify(personagens));
    };

    // Função para carregar a lista de personagens do localStorage
    const carregarPersonagens = () => {
        const personagensSalvos = JSON.parse(localStorage.getItem('personagens')) || [];
        listaPersonagens.innerHTML = '';

        // Se não houver personagens salvos, cria um personagem padrão
        if (personagensSalvos.length === 0) {
            const personagemPadrao = {
                nome: 'Personagem 1',
                id: 'personagem1'
            };
            personagensSalvos.push(personagemPadrao);
            localStorage.setItem('personagens', JSON.stringify(personagensSalvos));
        }

        personagensSalvos.forEach(personagem => {
            const novoItem = document.createElement('li');
            novoItem.textContent = personagem.nome;
            novoItem.setAttribute('data-personagem', personagem.id);
            listaPersonagens.appendChild(novoItem);

            // Adicionar funcionalidade ao novo personagem
            novoItem.addEventListener('click', function() {
                trocarPersonagem(this.getAttribute('data-personagem'));
            });

            // Clique duplo para editar o nome do personagem
            novoItem.addEventListener('dblclick', function() {
                editarNomePersonagem(this);
            });
        });

        // Seleciona o primeiro personagem da lista como padrão
        const primeiroPersonagem = listaPersonagens.querySelector('li');
        if (primeiroPersonagem) {
            personagemAtual = primeiroPersonagem.getAttribute('data-personagem');
            primeiroPersonagem.classList.add('selecionado'); // Adiciona uma classe de seleção
            carregarContainers(); // Carrega os containers do personagem padrão
        }
    };

    // Adicionar funcionalidade aos links das abas
    linksAbas.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            abaAtual = this.getAttribute('data-aba');
            carregarContainers();

            const nomeAba = document.querySelector(`[data-aba="${abaAtual}"]`).textContent;
            tituloAba.textContent = nomeAba;
        });
    });

    // Adicionar funcionalidade ao botão de adicionar personagem
    botaoAdicionarPersonagem.addEventListener('click', function() {
        const novoPersonagem = prompt("Digite o nome do novo personagem:");
        if (novoPersonagem) {
            const novoItem = document.createElement('li');
            novoItem.textContent = novoPersonagem;
            const personagemId = novoPersonagem.toLowerCase().replace(/\s/g, '');
            novoItem.setAttribute('data-personagem', personagemId);
            listaPersonagens.appendChild(novoItem);

            // Adicionar funcionalidade ao novo personagem
            novoItem.addEventListener('click', function() {
                trocarPersonagem(this.getAttribute('data-personagem'));
            });

            // Clique duplo para editar o nome do personagem
            novoItem.addEventListener('dblclick', function() {
                editarNomePersonagem(this);
            });

            // Atualiza a lista de personagens no localStorage
            atualizarLocalStoragePersonagens();
        }
    });

    // Adicionar funcionalidade ao botão de adicionar container
    botaoAdicionar.addEventListener('click', () => criarNovoContainer());

    // Carregar os personagens e containers ao iniciar a página
    carregarPersonagens(); // Carrega os personagens e seleciona o padrão
});