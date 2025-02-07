import express from "express";
import client from "../config/bd.js";
import bcrypt from 'bcryptjs'; 

// Função para validar o login
export const validarUsuario = async (login, senha) => {
    try {
        const result = await client.query('SELECT * FROM usuario WHERE login = $1', [login]);

        if (result.rows.length === 0) {
            return false; 
        }

        const usuario = result.rows[0];

        
        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
        return senhaCorreta; 
    } catch (error) {
        console.error('Erro ao validar usuário no banco de dados:', error);
        throw error; 
    }
};

export const salvarUsuario = async (login, senha) => {
    try {
        
        

        // Salva o login e a senha criptografada no bd
        await client.query('UPDATE usuario SET login = $1, senha = $2 WHERE id = 1;', [login, senha]);

        const { rows: updatedRows } = await client.query('SELECT * FROM usuario WHERE id = 1;');
        console.log('Usuário depois de atualizar:', updatedRows);
        
    } catch (error) {
        console.error('Erro ao salvar usuário:', error);
        throw error;
    }
};
