document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const planoId = urlParams.get('id'); 
    if (planoId) {
        carregarPlano(planoId);
    }

    function carregarPlano(id) {
         fetch(`https://sistema-de-gestao-de-academia.onrender.com/planos-detalhes/${id}`)
            .then(response => response.json())
            .then(data => {
                if (data && data.plano) {
                    const plano = data.plano;
                    document.getElementById("nome").value = plano.nome;
                    document.getElementById("valor").value = plano.valor;
                    document.getElementById("descricao").value = plano.descricao;

                } else {
                    alert("Erro ao carregar os dados do plano");
                }
            })
            .catch(error => console.error("Erro ao carregar o plano:", error));
    }

     // Atualizando o plano quando o formulário for enviado
    const form = document.querySelector("form");
    form.addEventListener("submit", function(event) {
        event.preventDefault();

        const planoData = {
            nome: document.getElementById("nome").value,
            valor: document.getElementById("valor").value,
            descricao: document.getElementById("descricao").value
        };

        fetch(`https://sistema-de-gestao-de-academia.onrender.com/planos-atualizar/${planoId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(planoData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Dados atualizados com sucesso!");
            } else {
                alert("Erro ao atualizar os dados.");
            }
        })
        .catch(error => console.error("Erro ao atualizar plano:", error));
    });
    });