document.addEventListener('DOMContentLoaded', () => {
    function carregarPlanos() {
        fetch('https://sistema-de-gestao-de-academia.onrender.com/planos')
            .then(response => response.json())
            .then(data => {
                console.log('Dados recebidos do servidor:', data);

                const selectPlano = document.getElementById('plano');

                const defaultOption = document.createElement('option');
                defaultOption.value = '';
                defaultOption.textContent = 'Selecionar Plano';
                
                defaultOption.selected = true;
                selectPlano.appendChild(defaultOption);

                data.forEach(plano => {
                    const option = document.createElement('option');
                    option.value = plano.id; 
                    option.textContent = plano.nome;
                    selectPlano.appendChild(option);
                });
            })
            .catch(error => console.error('Erro ao carregar planos:', error));
    }
    carregarPlanos();
});

function adicionarCliente(event) {
    event.preventDefault(); 

    const nome = document.getElementById('nome').value;
    const cpf = document.getElementById('cpf').value;
    const dataNascimento = document.getElementById('data_nascimento').value;
    const telefone1 = document.getElementById('telefone_1').value;
    const telefone2 = document.getElementById('telefone_2').value;
    const email = document.getElementById('email').value;
    const cep = document.getElementById('cep').value;
    const logradouro = document.getElementById('logradouro').value;
    const numero = document.getElementById('numero').value;
    const complemento = document.getElementById('complemento').value;
    const plano = document.getElementById('plano').value;
    const data_vencimento = document.getElementById('vencimento').value;

    // Organiza os dados para envio
    const clienteData = {
        cliente: {
            nome,
            cpf,
            data_nascimento: dataNascimento,
            telefone_1: telefone1,
            telefone_2: telefone2,
            email,
            endereco: { logradouro, numero, complemento, cep },
        },
        planoId: plano,
        data_vencimento
    };

    console.log('Dados enviados para o servidor:', clienteData);

    fetch('https://sistema-de-gestao-de-academia.onrender.com/adicionar-cliente', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(clienteData),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Cliente adicionado com sucesso!');
            window.location.href = '/clientes.html'; 
        } else {
            alert('Erro ao adicionar cliente: ' + data.message);
        }
    })
    .catch(error => console.error('Erro ao adicionar cliente:', error));
}

window.onload = function() {
    document.getElementById('formularioAddCliente').addEventListener('submit', adicionarCliente);
};
