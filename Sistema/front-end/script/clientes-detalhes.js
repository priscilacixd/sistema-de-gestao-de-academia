document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const clienteId = urlParams.get('id'); // Obtém o id do cliente da URL
    if (clienteId) {
        carregarCliente(clienteId);
        carregarPlanos(); // Carrega os planos disponíveis
    }

    function carregarCliente(id) {
         fetch(`https://sistema-de-gestao-de-academia.onrender.com/clientes-detalhes/${id}`)
            .then(response => response.json())
            .then(data => {
                if (data && data.cliente) {
                    const cliente = data.cliente;
                    document.getElementById("nome").value = cliente.nome;
                    document.getElementById("cpf").value = cliente.cpf;
                    // Formatando a data
                    const dataNascimento = new Date(cliente.data_nascimento);
                    const dataNascimentoFormatada = dataNascimento.toISOString().split('T')[0];
                    document.getElementById("data_nascimento").value = dataNascimentoFormatada;
                    document.getElementById("telefone_1").value = cliente.telefone_1;
                    document.getElementById("telefone_2").value = cliente.telefone_2;
                    document.getElementById("email").value = cliente.email;

                    // Preenchendo os dados de endereço
                    document.getElementById("cep").value = cliente.endereco.cep;
                    document.getElementById("logradouro").value = cliente.endereco.logradouro;
                    document.getElementById("numero").value = cliente.endereco.numero;
                    document.getElementById("complemento").value = cliente.endereco.complemento;

                    // Preenchendo o plano
                     const planoSelect = document.getElementById("plano");
                     // Limpando a seleção
                     planoSelect.value = "";
                     cliente.planos.forEach(plano => {
                        const option = document.createElement("option");
                        option.value = plano.id;
                        option.textContent = plano.nome;
                        planoSelect.appendChild(option);
                    // Definindo o plano selecionado
                        if(cliente.planos && cliente.planos.length > 0 && plano.id === cliente.planos[0].id) {
                            planoSelect.value = plano.id;
                        }
                    });

                    // Preenchendo a data de vencimento
                    document.getElementById("vencimento").value = cliente.data_vencimento;
                } else {
                    alert("Erro ao carregar os dados do cliente");
                }
            })
            .catch(error => console.error("Erro ao carregar o cliente:", error));
    }

    // Função para carregar os planos disponíveis
    function carregarPlanos() {
        fetch('https://sistema-de-gestao-de-academia.onrender.com/planos')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                const planoSelect = document.getElementById("plano");
                // Limpa as opções antigas antes de adicionar as novas
                planoSelect.innerHTML = '<option value="">Selecione um plano</option>';
                if (Array.isArray(data)) {
                    data.forEach(plano => {
                        const option = document.createElement("option");
                        option.value = plano.id;
                        option.textContent = plano.nome;
                        planoSelect.appendChild(option);
                    });
                } else {
                    console.error("Erro: resposta da API não é um array de planos");
                }
            })
            .catch(error => console.error("Erro ao carregar os planos:", error));
    }
     // Atualizando o cliente quando o formulário for enviado
    const form = document.querySelector("form");
    form.addEventListener("submit", function(event) {
        event.preventDefault();

        // Formatando a data para dd/MM/yyyy
        const dataNascimentoInput = document.getElementById("data_nascimento").value;
        const dataNascimentoParts = dataNascimentoInput.split('-');
        const dataNascimentoFormatada = `${dataNascimentoParts[2]}-${dataNascimentoParts[1]}-${dataNascimentoParts[0]}`;

        const planoSelect = document.getElementById("plano");
        const planoId = planoSelect.value === "" ? null : planoSelect.value;

        const clienteData = {
            nome: document.getElementById("nome").value,
            cpf: document.getElementById("cpf").value,
            data_nascimento: dataNascimentoFormatada,
            telefone_1: document.getElementById("telefone_1").value,
            telefone_2: document.getElementById("telefone_2").value,
            email: document.getElementById("email").value,
            endereco: {
                cep: document.getElementById("cep").value,
                logradouro: document.getElementById("logradouro").value,
                numero: document.getElementById("numero").value,
                complemento: document.getElementById("complemento").value
            },
            plano_id: planoId,
            data_vencimento: document.getElementById("vencimento").value
        };

        fetch(`https://sistema-de-gestao-de-academia.onrender.com/clientes-atualizar/${clienteId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(clienteData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Dados atualizados com sucesso!");
            } else {
                alert("Erro ao atualizar os dados.");
            }
        })
        .catch(error => console.error("Erro ao atualizar cliente:", error));
    });
    });