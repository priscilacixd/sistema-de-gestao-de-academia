import express from "express"
import client from "../config/bd.js";
import {buscarPlanos, excluirPlano, adicionarPlano, getPlanoDetalhes} from "../models/planosModel.js";


const routesPlanos = (app) => {
    app.use(express.json());

    //Rota para listar planos
    app.get('/planos', async (req, res) => {
        try {
            const planos = await buscarPlanos();
            res.json(planos);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao obter planos' });
        }
    });

    // Rota para excluir plano
    app.delete('/planos/:id', async (req, res) => {
        const { id } = req.params;
        console.log('ID recebido na rota DELETE:', id);
    
        try {
            const result = await excluirPlano(id); // Chama a função do model
            res.json(result);
        } catch (error) {
            if(error.message === "ID do plano inválido ou não fornecido."){
                console.warn('ID inválido fornecido:', id);
                return res.status(400).json({ success: false, message: 'ID do plano inválido ou não fornecido.' });
            }
            if(error.message === "Plano não encontrado."){
                 console.warn(`Plano com ID ${id} não encontrado.`);
                return res.status(404).json({ success: false, message: 'Plano não encontrado.' });
            }
            console.error('Erro ao excluir plano:', error);
            res.status(500).json({ success: false, message: 'Erro ao excluir plano.' });
        }
    });


    app.post('/adicionar-plano', async (req, res) => {
        console.log('Dados recebidos no body:', req.body);
    
        // Certifique-se de acessar os dados corretos
        const { nome, valor, descricao } = req.body;
    
        if (!nome || !valor || !descricao) {
            return res.status(400).json({ message: 'Todos os campos devem ser preenchidos.' });
        }
    
        try {
            const result = await adicionarPlano({ nome, valor, descricao });
            res.json({
                success: true,
                message: 'Plano cadastrado com sucesso!',
                plano: result,
            });
        } catch (error) {
            console.error('Erro ao adicionar plano:', error);
            res.status(500).json({ message: 'Erro ao adicionar plano' });
        }
    });

    //Rota para exibir os detalhes do plano
app.get('/planos-detalhes/:id', async (req, res) => {
    const planoId = req.params.id;
    const planoDetalhes = await getPlanoDetalhes(planoId);

    if (planoDetalhes.success) {
        res.json(planoDetalhes);
    } else {
        res.status(404).json(planoDetalhes);
    }
});

//Rota para atualizar os dados do plano após alteração
app.put('/planos-atualizar/:id', async (req, res) => {
    const planoId = req.params.id;
    const { nome, valor, descricao } = req.body;

    try {
        const resultPlano = await client.query(
            'UPDATE plano SET nome = $1, valor = $2, descricao = $3 WHERE id = $4',
            [nome, valor, descricao, planoId]
        );

    res.json({ success: true, message: "Dados atualizados com sucesso!" });
    } catch (error) {
        console.error("Erro ao atualizar dados do plano:", error);
        res.status(500).json({ success: false, message: "Erro ao atualizar plano." });
    }
});
    

}

export default routesPlanos;