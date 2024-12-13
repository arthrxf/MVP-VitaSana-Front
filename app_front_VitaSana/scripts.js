const API_URL = 'http://172.18.98.25:5000'; // Base da URL da API
const clienteTableBody = document.getElementById("clienteTableBody");
const addClienteModal = document.getElementById("addClienteModal");
const addClienteForm = document.getElementById("addClienteForm");
const addClienteBtn = document.getElementById("addClienteBtn");
const searchClienteInput = document.getElementById("searchCliente");

// Função para abrir o modal
addClienteBtn.onclick = () => {
    addClienteModal.style.display = "block";
};

// Função para fechar o modal
function closeModal() {
    addClienteModal.style.display = "none";
    addClienteForm.reset(); // Limpa os campos do formulário
}

// Função para carregar clientes
const fetchClientes = async (query = "") => {
    const url = `${API_URL}/clientes?nome=${query}`;
    try {
        const response = await fetch(url, { method: 'GET' });
        if (!response.ok) throw new Error("Erro ao buscar clientes.");

        const data = await response.json();
        clienteTableBody.innerHTML = ""; // Limpar a tabela

        data.clientes.forEach(cliente => {
            insertClienteRow(cliente);
        });
    } catch (error) {
        console.error("Erro ao carregar clientes:", error);
        alert("Não foi possível carregar a lista de clientes.");
    }
};

// Função para adicionar um cliente
// Função para adicionar um cliente
const postCliente = async (nome, idade, telefone, email, cpf) => {
    const url = `${API_URL}/cliente`;

    const formData = new FormData();

    formData.append("nome", nome);
    formData.append("idade", idade);
    formData.append("telefone", telefone);
    formData.append("email", email);
    formData.append("cpf", cpf);

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const result = await response.json();
            alert("Cliente adicionado com sucesso!");
            fetchClientes(); // Atualiza a tabela de clientes
            closeModal();    // Fecha o modal de cadastro
        } else {
            const errorData = await response.json();
            alert(`Erro ao adicionar cliente: ${errorData.message || "Erro desconhecido."}`);
        }
    } catch (error) {
        console.error("Erro ao adicionar cliente:", error);
        alert("Erro ao conectar com o servidor.");
    }
};


// Função para deletar um cliente
const deleteCliente = async (cpf) => {
    const url = `${API_URL}/cliente?cpf=${encodeURIComponent(cpf)}`;
    try {
        const response = await fetch(url, { method: 'DELETE' });

        if (!response.ok) throw new Error("Erro ao deletar cliente.");

        alert("Cliente removido com sucesso!");
        fetchClientes(); // Atualizar lista
    } catch (error) {
        console.error("Erro ao deletar cliente:", error);
        alert("Erro ao tentar remover o cliente.");
    }
};

// Função para filtrar clientes por nome
function searchCliente() {
    const query = searchClienteInput.value.trim();
    fetchClientes(query);
}

// Função para inserir uma linha de cliente na tabela
const insertClienteRow = (cliente) => {
    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${cliente.id}</td>
        <td>${cliente.nome}</td>
        <td>${cliente.idade}</td>
        <td>${cliente.email}</td>
        <td>${cliente.telefone}</td>
        <td>${cliente.cpf}</td>
        <td><button class="delete" onclick="deleteCliente(${cliente.cpf})">Deletar</button></td>
    `;

    clienteTableBody.appendChild(row);
};

// Evento para envio do formulário de cliente
addClienteForm.onsubmit = (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const idade = parseInt(document.getElementById("idade").value.trim());
    const telefone = document.getElementById("telefone").value.trim();
    const email = document.getElementById("email").value.trim();
    const cpf = document.getElementById("cpf").value.trim();

    if (!nome || !email || !cpf) {
        alert("Preencha todos os campos obrigatórios.");
        return;
    }

    postCliente(nome, idade, telefone, email, cpf);
};

// Carregar clientes inicialmente
fetchClientes();

