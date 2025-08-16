// Lógica do Amigo Secreto: adicionar, listar, remover e sortear

const inputAmigo = document.getElementById('amigo');
const listaEl = document.getElementById('listaAmigos');
const resultadoEl = document.getElementById('resultado');

let amigos = [];

function renderLista() {
    listaEl.innerHTML = '';
    amigos.forEach((nome, idx) => {
        const li = document.createElement('li');
        li.className = 'name-item';
        li.textContent = nome;

        const btnRemover = document.createElement('button');
        btnRemover.type = 'button';
        btnRemover.className = 'button-remove';
        btnRemover.textContent = 'Remover';
        btnRemover.addEventListener('click', () => {
            amigos.splice(idx, 1);
            renderLista();
            limparResultado();
        });

        li.appendChild(document.createTextNode(' '));
        li.appendChild(btnRemover);
        listaEl.appendChild(li);
    });
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
    amigos.push(nome);
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
    if (e.key === 'Enter') adicionarAmigo();
});

// Expõe funções para os botões com onclick no HTML
window.adicionarAmigo = adicionarAmigo;
window.sortearAmigo = sortearAmigo;