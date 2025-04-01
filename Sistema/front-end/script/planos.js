function buscarPlanos() {
    fetch('https://sistema-de-gestao-de-academia.onrender.com/planos') 
        .then(response => response.json())
        .then(data => {
            console.log('Dados recebidos do servidor:', data);
            const tableBody = document.querySelector("#tabela-plano tbody");
            tableBody.innerHTML = ''; 
            data.forEach(plano => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><input type="checkbox" class="planoCheckbox" value="${plano.id}"></td>
                    <td>${plano.id}</td>
                    <td>${plano.nome}</td>
                    <td>R$${plano.valor}</td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Erro ao buscar planos:', error));
}

function excluirPlano() {
    const planoId = getPlanoSelecionado();
    if (planoId) {
        if (confirm('Tem certeza que deseja excluir este plano?')) {
            fetch(`https://sistema-de-gestao-de-academia.onrender.com/planos/${planoId}`, {
                method: 'DELETE'
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert('Plano excluído com sucesso!');
                        buscarPlanos();
                    } else {
                        alert('Erro ao excluir plano: ' + data.message);
                    }
                })
                .catch(error => console.error('Erro ao excluir plano:', error));
        }
    }
}

function adicionarPlano() {
    window.location.href = "planos-adicionar.html";
}

function verDetalhesPlano() {
    const planoSelecionado = getPlanoSelecionado();
    if (planoSelecionado) {
        window.location.href = `/planos-detalhes.html?id=${planoSelecionado}`;
    }
}

function getPlanoSelecionado() {
    const checkboxes = document.querySelectorAll(".planoCheckbox:checked");

    if (checkboxes.length === 1) {
        return checkboxes[0].value; 
    } else if (checkboxes.length > 1) {
        alert("Selecione apenas um plano de cada vez.");
    } else {
        alert("Selecione plano para continuar.");
    }

    return null;
}

document.addEventListener("DOMContentLoaded", () => {
    buscarPlanos(); 
});