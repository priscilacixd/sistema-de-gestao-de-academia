import express from "express";
import client from "../config/bd.js";

export function buscarClientes() {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT 
                cliente.id,
                cliente.nome,
                COALESCE(plano.nome, 'Nenhum') AS plano_nome  
            FROM cliente
            LEFT JOIN cliente_plano ON cliente_plano.cliente_id_FK = cliente.id
            LEFT JOIN plano ON plano.id = cliente_plano.plano_id_FK;
        `;

        client.query(query, (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result.rows);
        });
    });
}

export function excluirCliente(clienteId) {
    const query = 'DELETE FROM cliente WHERE id = $1 RETURNING *';

    return new Promise((resolve, reject) => {
        console.log('ID recebido para exclusão:', clienteId);
        client.query(query, [clienteId], (err, result) => {
            if (err) {
                console.error('Erro ao excluir cliente:', err);
                reject({ success: false, message: 'Erro ao excluir cliente', error: err });
                return;
            }
            if (!result || result.rowCount === 0) {
                console.warn('Cliente não encontrado para exclusão:', clienteId);
                reject({ success: false, message: 'Cliente não encontrado' });
                return;
            }
            console.log('Cliente excluído com sucesso:', result.rows[0]);
            resolve({ success: true, message: 'Cliente excluído com sucesso!' });
        });
    });
}

export async function adicionarCliente(cliente, planoId, data_vencimento) {

    try {

        await client.query('BEGIN');

        // Insere o cliente
        const clienteQuery = `
            INSERT INTO cliente (nome, cpf, data_nascimento, telefone_1, telefone_2, email)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id;
        `;
        const clienteValues = [
            cliente.nome,
            cliente.cpf,
            cliente.data_nascimento,
            cliente.telefone_1,
            cliente.telefone_2,
            cliente.email,
        ];
        const resCliente = await client.query(clienteQuery, clienteValues);
        console.log('Cliente inserido com ID:', resCliente.rows[0].id);
        const clienteId = resCliente.rows[0].id;

        const enderecoQuery = `
            INSERT INTO endereco (cep, logradouro, numero, complemento, cliente_id_fk)
            VALUES ($1, $2, $3, $4, $5);
        `;
        const enderecoValues = [
            cliente.cep,
            cliente.logradouro,
            cliente.numero,
            cliente.complemento,
            clienteId
        ];
        await client.query(enderecoQuery, enderecoValues);
        console.log('Endereço inserido com sucesso.');

        // Vincula o cliente ao plano na tabela cliente_plano
        const clientePlanoQuery = `
            INSERT INTO cliente_plano (cliente_id_fk, plano_id_fk, data_vencimento)
            VALUES ($1, $2, $3);
        `;
        const clientePlanoValues = [clienteId, planoId, data_vencimento];
        await client.query(clientePlanoQuery, clientePlanoValues);
        console.log('Cliente vinculado ao plano com sucesso.');

        await client.query('COMMIT');
        return { success: true, message: 'Cliente cadastrado com sucesso!' };
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Erro ao adicionar cliente:', error);
        throw error;
    }
}

export async function getClienteDetalhes(clienteId) {
    try {
        const clienteQuery = `
          SELECT
              c.id,
              c.nome,
              c.cpf,
              c.data_nascimento,
              c.telefone_1,
              c.telefone_2,
              c.email,
              COALESCE(e.cep, '') AS cep,
              COALESCE(e.logradouro, '') AS logradouro,
              COALESCE(e.numero, 0) AS numero,
              COALESCE(e.complemento, '') AS complemento,
              cp.data_vencimento,
              JSON_AGG(
                  JSON_BUILD_OBJECT('id', p.id, 'nome', p.nome)
              ) AS planos
          FROM
              cliente c
          LEFT JOIN
              endereco e ON e.cliente_id_fk = c.id
          LEFT JOIN
              cliente_plano cp ON cp.cliente_id_fk = c.id
          LEFT JOIN
              plano p ON p.id = cp.plano_id_fk
          WHERE
              c.id = $1
          GROUP BY 
              c.id, c.nome, c.cpf, c.data_nascimento, c.telefone_1, 
              c.telefone_2, c.email, e.cep, e.logradouro, e.numero, 
              e.complemento, cp.data_vencimento;
      `;
        const result = await client.query(clienteQuery, [clienteId]);

        if (result.rows.length > 0) {
            const cliente = result.rows[0];
            let planos = cliente.planos;
            if (planos && planos[0] && planos[0].id === null && planos[0].nome === null) {
                planos = [];
            }
            return {
                success: true,
                cliente: {
                    id: cliente.id,
                    nome: cliente.nome,
                    cpf: cliente.cpf,
                    data_nascimento: cliente.data_nascimento,
                    telefone_1: cliente.telefone_1,
                    telefone_2: cliente.telefone_2,
                    email: cliente.email,
                    endereco: {
                        cep: cliente.cep,
                        logradouro: cliente.logradouro,
                        numero: cliente.numero,
                        complemento: cliente.complemento
                    },
                    planos: planos,
                    data_vencimento: cliente.data_vencimento
                }
            };
        } else {
            return { success: false, message: "Cliente não encontrado." };
        }
    } catch (error) {
        console.error("Erro ao buscar cliente:", error);
        return { success: false, message: "Erro ao buscar cliente." };
    }
}

export async function getClienteFinanceiro(clienteId) {
    try {
        console.log('ID recebido no model:', clienteId); // Adiciona um log para verificar o ID
        const clienteQuery = `
            SELECT nome FROM cliente WHERE id = $1;
        `;
        const titulosAbertosQuery = `
           SELECT ct.id, ct.data_vencimento as data_vencimento, ct.data_processamento, p.valor
            FROM cliente_titulos ct
            JOIN cliente_plano cp ON ct.cliente_plano_id_FK = cp.id
            JOIN plano p ON cp.plano_id_FK = p.id
            WHERE cp.cliente_id_FK = $1 AND ct.status = 'aberto'
        `;
        const titulosRecebidosQuery = `
            SELECT ct.id, ct.data_vencimento as data_vencimento, ct.data_pagamento, p.valor
            FROM cliente_titulos ct
            JOIN cliente_plano cp ON ct.cliente_plano_id_FK = cp.id
            JOIN plano p ON cp.plano_id_FK = p.id
             WHERE cp.cliente_id_FK = $1 AND ct.status = 'recebido'
        `;
        const clienteResult = await client.query(clienteQuery, [clienteId]);
       if (clienteResult.rows.length === 0) {
         console.warn(`Cliente com ID ${clienteId} não encontrado.`);
            return { success: false, message: "Cliente não encontrado" };
        }
        console.log(`Cliente encontrado com sucesso!`);
         const titulosAbertosResult = await client.query(titulosAbertosQuery, [clienteId]);
         const titulosRecebidosResult = await client.query(titulosRecebidosQuery, [clienteId]);

          return {
              success: true,
              cliente: clienteResult.rows[0],
              titulosAbertos: titulosAbertosResult.rows,
              titulosRecebidos: titulosRecebidosResult.rows
          };
     } catch (error) {
        console.error("Erro ao buscar financeiro do cliente:", error);
        return { success: false, message: "Erro ao buscar financeiro do cliente." };
    }
}




