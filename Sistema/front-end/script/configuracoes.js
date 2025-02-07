function alterarUsuario(event) {
    event.preventDefault();  // Impede o envio do formulário

    const login = document.getElementById('login').value;
    const senha = document.getElementById('senha').value;

    // Envia os dados para a API
    fetch('https://sistema-de-gestao-de-academia.onrender.com/salvar-usuario', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login, senha }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Usuário criado com sucesso!');
        } else {
            alert('Erro ao criar usuário: ' + data.message);
        }
    })
    .catch(error => console.error('Erro ao criar usuário:', error));
}

// Adiciona o evento ao formulário
document.getElementById('formularioAlterarUsuario').addEventListener('submit', alterarUsuario);
