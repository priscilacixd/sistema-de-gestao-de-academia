document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const clienteId = urlParams.get('id');

    if (clienteId) {
        carregarClienteFinanceiro(clienteId);
    }

   async function carregarClienteFinanceiro(id) {
    try {
        const response = await fetch(`https://sistema-de-gestao-de-academia.onrender.com/clientes-financeiro/${id}`);
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        const data = await response.json();
        if (data && data.cliente) {
            document.querySelector('main h1').textContent = data.cliente.nome;
            carregarTitulosAbertos(data.titulosAbertos || []);
             carregarTitulosRecebidos(data.titulosRecebidos || []);
        }else {
              alert("Erro ao carregar os dados do cliente.");
            }
         } catch (error) {
             console.error("Erro ao carregar o financeiro do cliente", error);
             alert("Erro ao carregar os dados do cliente.");
        }
    }


   function carregarTitulosAbertos(titulos) {
        const tbody = document.querySelector('#tabela-titulos tbody');
        tbody.innerHTML = '';
        titulos.forEach(titulo => {
           let valor = Number(titulo.valor); // Converte para número, caso não seja
            if(isNaN(valor)) {
                valor = 0; // caso não seja um valor numérico válido
            }
            const row = `
                <tr>
                     <td><input type="checkbox" class="titulo-checkbox" value="${titulo.id}"></td>
                    <td>${titulo.id}</td>
                    <td>${formatDate(titulo.data_vencimento)}</td>
                    <td>${formatDate(titulo.data_processamento)}</td>
                    <td>R$ ${valor.toFixed(2)}</td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    }


   function carregarTitulosRecebidos(titulos) {
    const tbody = document.querySelector('section.titulos-container table tbody');
    tbody.innerHTML = '';
    titulos.forEach(titulo => {
         let valor = Number(titulo.valor);
         if(isNaN(valor)) {
                valor = 0;
            }
        const row = `
            <tr>
                <td>${titulo.id}</td>
                <td>${formatDate(titulo.data_vencimento)}</td>
                <td>${formatDate(titulo.data_pagamento)}</td>
                 <td>R$ ${valor.toFixed(2)}</td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}


    function formatDate(dateString) {
        if(!dateString) return '';
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }
    // Função para obter os IDs dos títulos selecionados
  function getTitulosSelecionados() {
    const checkboxes = document.querySelectorAll('#tabela-titulos tbody .titulo-checkbox:checked');
    if (checkboxes.length > 0) {
         return Array.from(checkboxes).map(checkbox => checkbox.value);
        } else {
            alert("Selecione ao menos um título.");
        }
        return null;
    }
    // Evento para Receber
    const receberBtn = document.getElementById('receber');
    receberBtn.addEventListener('click', receberTitulo);

    async function receberTitulo() {
        const tituloIds = getTitulosSelecionados();
          if (!tituloIds) {
              return;
          }
       try {
            const response = await fetch(`https://sistema-de-gestao-de-academia.onrender.com/titulos/receber`, {
                method: 'PUT',
                 headers: {
                     'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({ tituloIds })
            });
             if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            const data = await response.json();

           if (data.success) {
            alert(data.message);
            carregarClienteFinanceiro(clienteId);
           } else {
            alert(data.message)
            console.error("Erro ao receber o título:", data);
           }
        } catch (error) {
            console.error("Erro ao receber o título:", error);
            alert("Erro ao receber o título.");
        }
     }
     // Evento para Excluir
    const excluirBtn = document.getElementById('excluir');
    excluirBtn.addEventListener('click', excluirTitulo);
     async function excluirTitulo() {
         const tituloIds = getTitulosSelecionados();
          if (!tituloIds) {
            return;
        }
         try {
             const response = await fetch(`https://sistema-de-gestao-de-academia.onrender.com/titulos`, {
                 method: 'DELETE',
                   headers: {
                     'Content-Type': 'application/json'
                  },
                   body: JSON.stringify({ tituloIds })
             });
               if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }

            const data = await response.json();
           if (data.success) {
            alert(data.message);
           carregarClienteFinanceiro(clienteId);
         } else {
            alert(data.message)
           }
         } catch (error) {
            console.error("Erro ao excluir o título:", error);
            alert("Erro ao excluir o título.");
         }
     }
     // Evento para Adicionar
    const adicionarBtn = document.getElementById('adicionar');
    adicionarBtn.addEventListener('click', abrirModalAdicionar);
    function abrirModalAdicionar(){
         document.getElementById('modal-adicionar').style.display = 'block';
        document.getElementById('overlay').style.display = 'block';
        document.getElementById('mes-titulo').value = "";
        document.getElementById('ano-titulo').value = new Date().getFullYear();
    }

      // Evento para Fechar Modal
    const fecharModalBtn = document.querySelector('.fechar-modal');
     fecharModalBtn.addEventListener('click', fecharModal);
     function fecharModal() {
        document.getElementById('modal-adicionar').style.display = 'none';
        document.getElementById('overlay').style.display = 'none';
    }
    //Evento para adicionar um título
    const adicionarTituloBtn = document.getElementById('adicionar-titulo');
    adicionarTituloBtn.addEventListener('click', adicionarTitulo);
    async function adicionarTitulo() {
        const mes = document.getElementById('mes-titulo').value;
        const ano = document.getElementById('ano-titulo').value;
        if(!mes) {
            alert("Selecione um mês para adicionar o título")
            return;
        }
         try {
            const response = await fetch(`https://sistema-de-gestao-de-academia.onrender.com/titulos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({clienteId, mes, ano})
            });
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            const data = await response.json();
           if (data.success) {
             alert(data.message);
            carregarClienteFinanceiro(clienteId);
            fecharModal()
         } else {
            alert(data.message)
           }
        } catch (error) {
            console.error("Erro ao adicionar o título:", error);
            alert("Erro ao adicionar o título.");
        }
     }
});