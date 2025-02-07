import express from "express"
import bcrypt from "bcryptjs"
import { validarUsuario, salvarUsuario } from "../models/usuarioModel.js";


const routesUsuario = (app) => {
    app.use(express.json());

    // Rota para validar login
    app.post('/login', async (req, res) => {
        const { login, senha } = req.body;

        if (!login || !senha) {
            return res.status(400).json({ success: false, message: 'Login e senha são obrigatórios.' });
        }

        try {
            const usuarioValido = await validarUsuario(login, senha);

            if (usuarioValido) {
                return res.json({ success: true, message: 'Login bem-sucedido!' });
            } else {
                return res.status(401).json({ success: false, message: 'Login ou senha inválidos.' });
            }
        } catch (error) {
            console.error('Erro ao validar login:', error);
            return res.status(500).json({ success: false, message: 'Erro interno no servidor.' });
        }
    });

    app.post('/salvar-usuario', async (req, res) => {
        const { login, senha } = req.body; 

        if (!login || !senha) {
            return res.status(400).json({ success: false, message: 'Login e senha são obrigatórios.' });
        }

        try {
            const saltRounds = 10; 
            const hashSenha = await bcrypt.hash(senha, saltRounds);

            const resultado = await salvarUsuario(login, hashSenha);

            res.status(201).json({
                success: true,
                message: 'Usuário criado com sucesso!',
                user: { login }, 
            });
        } catch (error) {
            console.error('Erro ao salvar usuário:', error);
            res.status(500).json({ success: false, message: 'Erro ao criar o usuário.' });
        }
    });

}

export default routesUsuario;