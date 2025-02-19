document.addEventListener('DOMContentLoaded', function() {
    const descricaoContainer = document.querySelector('#descricao-container');
    const botaoAdicionar = document.getElementById('adicionar-container');
    const linksAbas = document.querySelectorAll('.head a');
    const tituloAba = document.getElementById('titulo-aba');

    let abaAtual = 'nivel0'; 

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
        localStorage.setItem(abaAtual, JSON.stringify(containers));
    };

    const carregarContainers = () => {
        const containersSalvos = JSON.parse(localStorage.getItem(abaAtual)) || [];
        descricaoContainer.innerHTML = ''; 
        containersSalvos.forEach(container => {
            criarNovoContainer(container);
        });
    };

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

    const aplicarFuncionalidadeEdicao = (container) => {
        const id = container.getAttribute('data-id');

       
        const tornarEditavel = (elemento, campo) => {
            elemento.addEventListener('click', function() {

                const input = document.createElement('input');
                input.type = 'text';
                input.value = elemento.innerText.trim(); 
                input.placeholder = "Digite aqui";
                input.classList.add('editavel-temporario');

                elemento.innerText = ''; 
                elemento.appendChild(input);
                input.focus();

                const salvarEdicao = () => {
                    const novoTexto = input.value.trim();
                    elemento.innerText = novoTexto || "Digite aqui";
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
            const textarea = document.createElement('textarea');
            textarea.value = textoElemento.innerText === "Digite aqui" ? "" : textoElemento.innerText;
            textarea.placeholder = "Digite aqui";
            textarea.classList.add('editavel-temporario');

            textoElemento.replaceWith(textarea);
            textarea.focus();

            const salvarEdicao = () => {
                const novoTexto = textarea.value.trim();
                textoElemento.innerText = novoTexto || "Digite aqui"; 
                textarea.replaceWith(textoElemento); 
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

    botaoAdicionar.addEventListener('click', () => criarNovoContainer());

    const trocarAba = (novaAba) => {
        abaAtual = novaAba;
        carregarContainers(); 

        const nomeAba = document.querySelector(`[data-aba="${novaAba}"]`).textContent;
        tituloAba.textContent = nomeAba; 
    };

    linksAbas.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); 
            trocarAba(this.getAttribute('data-aba')); 
        });
    });

    carregarContainers();
});