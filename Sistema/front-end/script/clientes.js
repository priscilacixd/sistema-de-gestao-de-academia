function buscarClientes() {
    fetch('https://sistema-de-gestao-de-academia.onrender.com/clientes') 
        .then(response => response.json())
        .then(data => {
            console.log('Dados recebidos do servidor:', data);
            const tableBody = document.querySelector("#tabela-cliente tbody");
            tableBody.innerHTML = ''; 
            data.forEach(cliente => {
                const row = document.createElement('tr');
                // Verifica se o plano_nome está presente; caso contrário, exibe "Nenhum"
                const planoNome = cliente.plano_nome ? cliente.plano_nome : 'Nenhum';
                row.innerHTML = `
                    <td><input type="checkbox" class="clienteCheckbox" value="${cliente.id}"></td>
                    <td>${cliente.id}</td>
                    <td>${planoNome}</td>
                    <td>${cliente.nome}</td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Erro ao buscar clientes:', error));
}

function adicionarCliente() {
    window.location.href = "clientes-adicionar.html";
}

function excluirCliente() {
    const clienteId = getClienteSelecionado();
    if (clienteId) {
        if (confirm('Tem certeza que deseja excluir este cliente?')) {
            fetch(`https://sistema-de-gestao-de-academia.onrender.com/clientes/${clienteId}`, {
                method: 'DELETE'
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert('Cliente excluído com sucesso!');
                        buscarClientes();
                    } else {
                        alert('Erro ao excluir cliente: ' + data.message);
                    }
                })
                .catch(error => console.error('Erro ao excluir cliente:', error));
        }
    }
}

function verDetalhesCliente() {
    const clienteSelecionado = getClienteSelecionado();
    if (clienteSelecionado) {
        window.location.href = `/clientes-detalhes.html?id=${clienteSelecionado}`;
    }
}

function verFinanceiro() {
    const clienteSelecionado = getClienteSelecionado();
    if (clienteSelecionado) {
        window.location.href = `/clientes-financeiro.html?id=${clienteSelecionado}`;
    }
}

function getClienteSelecionado() {
    const checkboxes = document.querySelectorAll(".clienteCheckbox:checked");

    if (checkboxes.length === 1) {
        return checkboxes[0].value; 
    } else if (checkboxes.length > 1) {
        alert("Selecione apenas um cliente de cada vez.");
    } else {
        alert("Selecione um cliente para continuar.");
    }

    return null;
}

document.addEventListener("DOMContentLoaded", () => {
    buscarClientes(); 
});



