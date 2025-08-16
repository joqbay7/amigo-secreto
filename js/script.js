// Lógica do Amigo Secreto: adicionar, listar, remover, editar, sortear e reiniciar

const inputAmigo = document.getElementById('amigo');
const listaEl = document.getElementById('listaAmigos');
const resultadoEl = document.getElementById('resultado');
const btnSortear = document.getElementById('btnSortear');
const btnReset = document.getElementById('btnReset');

// --- referências da modal de confirmação ---
const confirmModal = document.getElementById('confirmModal');
const confirmMessageEl = document.getElementById('confirmMessage');
const confirmOkBtn = document.getElementById('confirmOk');
const confirmCancelBtn = document.getElementById('confirmCancel');
let confirmCallback = null;

function showConfirm(message, okLabel = 'Remover', onConfirm) {
    confirmMessageEl.textContent = message;
    confirmOkBtn.textContent = okLabel;
    confirmCallback = onConfirm;
    confirmModal.classList.remove('hidden');
    // foco para acessibilidade
    confirmCancelBtn.focus();
}

function hideConfirm() {
    confirmModal.classList.add('hidden');
    confirmCallback = null;
}

// ações da modal
confirmOkBtn.addEventListener('click', () => {
    if (typeof confirmCallback === 'function') confirmCallback();
    hideConfirm();
});
confirmCancelBtn.addEventListener('click', hideConfirm);
// fechar clicando no overlay
confirmModal.addEventListener('click', (e) => {
    if (e.target === confirmModal) hideConfirm();
});
// fechar com Escape
document.addEventListener('keydown', (e) => {
    if (!confirmModal.classList.contains('hidden') && e.key === 'Escape') hideConfirm();
});

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

            // container para botões de ação (editar / remover)
            const controls = document.createElement('div');
            controls.className = 'controls';

            const btnEditar = document.createElement('button');
            btnEditar.type = 'button';
            btnEditar.className = 'button-edit';
            btnEditar.textContent = 'Editar';
            btnEditar.addEventListener('click', () => startEdit(idx, li));

            const btnRemover = document.createElement('button');
            btnRemover.type = 'button';
            btnRemover.className = 'button-remove';
            btnRemover.textContent = 'Remover';
            // usa modal de confirmação em vez de confirm()
            btnRemover.addEventListener('click', () => {
                showConfirm(`Remover "${nome}" da lista?`, 'Remover', () => {
                    amigos.splice(idx, 1);
                    salvar();
                    renderLista();
                    limparResultado();
                });
            });

            controls.appendChild(btnEditar);
            controls.appendChild(btnRemover);
            li.appendChild(controls);
            listaEl.appendChild(li);
        });
    }

    // Atualiza estado dos botões
    if (btnSortear) btnSortear.disabled = amigos.length === 0;
    if (btnReset) btnReset.disabled = amigos.length === 0;
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

function startEdit(idx, li) {
    const atual = amigos[idx];

    // limpar o conteúdo do li e montar UI de edição inline
    li.innerHTML = '';

    const input = document.createElement('input');
    input.type = 'text';
    input.value = atual;
    input.className = 'edit-input';
    input.setAttribute('aria-label', `Editar nome ${atual}`);

    const controls = document.createElement('div');
    controls.className = 'controls';

    const btnSalvar = document.createElement('button');
    btnSalvar.type = 'button';
    btnSalvar.className = 'button-save';
    btnSalvar.textContent = 'Salvar';

    const btnCancelar = document.createElement('button');
    btnCancelar.type = 'button';
    btnCancelar.className = 'button-cancel';
    btnCancelar.textContent = 'Cancelar';

    // ações
    const salvarEdicao = () => {
        const novo = input.value.trim();
        if (!novo) {
            alert('Nome inválido.');
            input.focus();
            return;
        }
        const existe = amigos.some((a, i) => i !== idx && a.toLowerCase() === novo.toLowerCase());
        if (existe) {
            alert('Já existe esse nome na lista.');
            input.focus();
            return;
        }
        amigos[idx] = novo;
        salvar();
        renderLista();
        limparResultado();
    };

    const cancelarEdicao = () => {
        renderLista();
    };

    btnSalvar.addEventListener('click', salvarEdicao);
    btnCancelar.addEventListener('click', cancelarEdicao);

    // teclas úteis
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            salvarEdicao();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            cancelarEdicao();
        }
    });

    li.appendChild(input);
    controls.appendChild(btnSalvar);
    controls.appendChild(btnCancelar);
    li.appendChild(controls);

    // foco no input
    input.focus();
    // mover cursor para o fim
    input.setSelectionRange(input.value.length, input.value.length);
}

function editAmigo(idx) {
    // compatibilidade com chamadas diretas (não usado quando inline)
    const atual = amigos[idx];
    const novo = prompt('Editar nome:', atual);
    if (novo === null) return; // cancelou
    const nomeTrim = String(novo).trim();
    if (!nomeTrim) {
        alert('Nome inválido.');
        return;
    }

    const existe = amigos.some((a, i) => i !== idx && a.toLowerCase() === nomeTrim.toLowerCase());
    if (existe) {
        alert('Já existe esse nome na lista.');
        return;
    }

    amigos[idx] = nomeTrim;
    salvar();
    renderLista();
    limparResultado();
}

function resetLista() {
    showConfirm(
        'Deseja realmente reiniciar a lista? Essa ação apagará todos os nomes.',
        'Reiniciar',
        () => {
            amigos = [];
            salvar();
            renderLista();
            limparResultado();
        }
    );
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
window.editAmigo = editAmigo;
window.resetLista = resetLista;

// Inicialização
renderLista();