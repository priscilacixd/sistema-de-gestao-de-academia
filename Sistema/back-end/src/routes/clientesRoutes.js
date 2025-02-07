import express from "express";
import client from "../config/bd.js";
import { buscarClientes, excluirCliente, adicionarCliente, getClienteDetalhes, getClienteFinanceiro } from "../models/clientesModel.js";

const routesClientes = (app) => {
    app.use(express.json());

    //Rota para listar clientes
    app.get('/clientes', async (req, res) => {
        try {
            const clientes = await buscarClientes();
            res.json(clientes);
        } catch (error) {
            console.error('Erro ao buscar clientes:', error);
            res.status(500).json({ success: false, message: 'Erro ao buscar clientes' });
        }
    });

    // Rota para excluir cliente
    app.delete('/clientes/:id', async (req, res) => {
        const { id } = req.params;
        console.log('ID recebido na rota DELETE:', id);

        if (!id || isNaN(Number(id))) {
            console.warn('ID inválido fornecido:', id);
            return res.status(400).json({ success: false, message: 'ID do cliente inválido ou não fornecido.' });
        }

        try {
            const result = await excluirCliente(Number(id));
            res.json(result);
        } catch (error) {
            console.error('Erro ao excluir cliente:', error);
            res.status(500).json({ success: false, message: 'Erro ao excluir cliente' });
        }
    });

    // Rota para adicionar cliente
    app.post('/adicionar-cliente', async (req, res) => {
        console.log('Dados recebidos no body:', req.body);
        const { cliente, planoId, data_vencimento } = req.body;
        try {
            const result = await adicionarCliente(cliente, planoId, data_vencimento);

            // Caso tudo tenha dado certo, retorna os dados inseridos
            res.json({
                success: true,
                message: 'Cliente cadastrado com sucesso!',
                cliente,        // Retorna os dados do cliente
                planoId,
                data_vencimento
            });
        } catch (error) {
            console.error('Erro ao adicionar cliente:', error);
            res.status(500).json({ message: 'Erro ao adicionar cliente' });
        }
    });

    //Rota para exibir os detalhes do cliente
    app.get('/clientes-detalhes/:id', async (req, res) => {
        const clienteId = req.params.id;
        const clienteDetalhes = await getClienteDetalhes(clienteId);

        if (clienteDetalhes.success) {
            res.json(clienteDetalhes);
        } else {
            res.status(404).json(clienteDetalhes);
        }
    });

    //Rota para atualizar os dados do cliente após alteração
    app.put('/clientes-atualizar/:id', async (req, res) => {
        const clienteId = req.params.id;
        const { nome, cpf, data_nascimento, telefone_1, telefone_2, email, endereco, plano_id, data_vencimento } = req.body;

        try {
            // Atualizando os dados do cliente
            const resultCliente = await client.query(
                'UPDATE cliente SET nome = $1, cpf = $2, data_nascimento = $3, telefone_1 = $4, telefone_2 = $5, email = $6 WHERE id = $7',
                [nome, cpf, data_nascimento, telefone_1, telefone_2, email, clienteId]
            );

            // Atualizando o endereço do cliente
            const resultEndereco = await client.query(
                'UPDATE endereco SET cep = $1, logradouro = $2, numero = $3, complemento = $4 WHERE cliente_id_FK = $5',
                [endereco.cep, endereco.logradouro, endereco.numero, endereco.complemento, clienteId]
            );
            // Atualizando o plano do cliente, apenas se plano_id for fornecido
            if (plano_id) {
                const resultPlano = await client.query(
                    'UPDATE cliente_plano SET plano_id_FK = $1, data_vencimento = $2 WHERE cliente_id_FK = $3',
                    [plano_id, data_vencimento, clienteId]
                );
            }


            res.json({ success: true, message: "Dados atualizados com sucesso!" });
        } catch (error) {
            console.error("Erro ao atualizar dados do cliente:", error);
            res.status(500).json({ success: false, message: "Erro ao atualizar cliente." });
        }
    });

    // Rota para exibir os dados financeiros do cliente
    app.get('/clientes-financeiro/:id', async (req, res) => {
        const clienteId = req.params.id;

        try {
            const result = await getClienteFinanceiro(clienteId);
            if (result.success) {
                res.json(result);
            } else {
                res.status(404).json(result);
            }
        } catch (error) {
            console.error("Erro ao buscar financeiro do cliente:", error);
            res.status(500).json({ success: false, message: "Erro ao buscar financeiro do cliente." });
        }
    });


};

export default routesClientes;