// Lógica do Amigo Secreto: adicionar, listar, remover e sortear

const inputAmigo = document.getElementById('amigo');
const listaEl = document.getElementById('listaAmigos');
const resultadoEl = document.getElementById('resultado');
const btnSortear = document.getElementById('btnSortear');

const STORAGE_KEY = 'amigo-secreto:amigos';
let amigos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

function salvar() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(amigos));
}

function renderLista() {
    listaEl.innerHTML = '';
    if (amigos.length === 0) {
        const vazio = document.createElement('li');
        vazio.className = 'empty-item';
        vazio.textContent = 'Nenhum amigo adicionado.';
        listaEl.appendChild(vazio);
    } else {
        amigos.forEach((nome, idx) => {
            const li = document.createElement('li');
            li.className = 'name-item';

            const span = document.createElement('span');
            span.textContent = nome;
            span.className = 'name-text';
            li.appendChild(span);

            const btnRemover = document.createElement('button');
            btnRemover.type = 'button';
            btnRemover.className = 'button-remove';
            btnRemover.textContent = 'Remover';
            btnRemover.addEventListener('click', () => {
                amigos.splice(idx, 1);
                salvar();
                renderLista();
                limparResultado();
            });

            li.appendChild(document.createTextNode(' '));
            li.appendChild(btnRemover);
            listaEl.appendChild(li);
        });
    }

    // Atualiza estado do botão de sortear
    if (btnSortear) btnSortear.disabled = amigos.length === 0;
}

function limparResultado() {
    resultadoEl.innerHTML = '';
}

function adicionarAmigo() {
    const nome = inputAmigo.value.trim();
    if (!nome) {
        alert('Digite um nome válido.');
        inputAmigo.focus();
        return;
    }

    // Evitar duplicatas (case-insensitive)
    const existe = amigos.some(a => a.toLowerCase() === nome.toLowerCase());
    if (existe) {
        alert('Este nome já está na lista.');
        inputAmigo.focus();
        return;
    }

    amigos.push(nome);
    salvar();
    inputAmigo.value = '';
    inputAmigo.focus();
    renderLista();
}

function sortearAmigo() {
    if (amigos.length === 0) {
        alert('Adicione pelo menos um nome antes de sortear.');
        return;
    }
    const indice = Math.floor(Math.random() * amigos.length);
    const sorteado = amigos[indice];

    resultadoEl.innerHTML = '';
    const li = document.createElement('li');
    li.className = 'result-item';
    li.textContent = `Amigo secreto: ${sorteado}`;
    resultadoEl.appendChild(li);
}

// Ativa Enter para adicionar
inputAmigo.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        adicionarAmigo();
    }
});

// Expõe funções para os botões com onclick no HTML
window.adicionarAmigo = adicionarAmigo;
window.sortearAmigo = sortearAmigo;

// Inicialização
renderLista();