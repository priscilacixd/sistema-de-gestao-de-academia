function adicionarPlano(event) {
    event.preventDefault(); 

    const nome = document.getElementById('nome').value;
    const valor = document.getElementById('valor').value;
    const descricao = document.getElementById('descricao').value;

    // Organiza os dados para envio
    const planoData = { nome, valor, descricao }; 

    console.log('Dados enviados para o servidor:', planoData);

    fetch('https://sistema-de-gestao-de-academia.onrender.com/adicionar-plano', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(planoData),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Plano adicionado com sucesso!');
            window.location.href = '/planos.html'; 
        } else {
            alert('Erro ao adicionar plano: ' + data.message);
        }
    })
    .catch(error => console.error('Erro ao adicionar plano:', error));
}

window.onload = function() {
    document.getElementById('formularioAddPlano').addEventListener('submit', adicionarPlano);
};