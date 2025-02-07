document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('caixa-de-login');
    if (form) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault(); 

            const mensagemErroElemento = document.getElementById('mensagemErro');
            mensagemErroElemento.textContent = '';
            mensagemErroElemento.style.display = 'none';

            const login = document.getElementById('login').value;
            const senha = document.getElementById('senha').value;

            try {
                const response = await fetch('https://sistema-de-gestao-de-academia.onrender.com/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ login, senha }),
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    window.location.href = '/clientes.html'; 
                } else {
                    mensagemErroElemento.textContent = data.message || 'Erro ao fazer login.';
                    mensagemErroElemento.style.display = 'block';
                }
            } catch (error) {
                console.error('Erro ao fazer login:', error);
                mensagemErroElemento.textContent = 'Erro ao conectar com o servidor.';
                mensagemErroElemento.style.display = 'block';
            }
        });
    } else {
        console.error("Formulário não encontrado!");
    }
});
