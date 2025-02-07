import express from 'express';
const app = express();
import { receberTitulo, excluirTitulo, adicionarTitulo } from '../models/titulosModel.js';

const routesTitulos = (app) => {
    app.use(express.json());

    //Rota para receber um título
    app.put('/titulos/receber', async (req, res) => {
        const { tituloIds } = req.body;
        const dataPagamento = new Date().toISOString().split('T')[0];
        try {
            const result = await receberTitulo(tituloIds, dataPagamento);
            res.json(result);
        } catch (error) {
            console.error("Erro ao receber título:", error);
            res.status(500).json({ success: false, message: 'Erro ao receber o título' });
        }
    });
    
    //Rota para excluir um título
    app.delete('/titulos', async (req, res) => {
        const { tituloIds } = req.body;
        try {
            const result = await excluirTitulo(tituloIds);
            res.json(result);
        } catch (error) {
            console.error("Erro ao excluir título:", error);
            res.status(500).json({ success: false, message: 'Erro ao excluir o título' });
        }
    });

    // Rota para adicionar um título
    app.post('/titulos', async (req, res) => {
        const { clienteId, mes, ano } = req.body;

        try {
            const result = await adicionarTitulo(clienteId, mes, ano);
            res.json(result);
        } catch (error) {
            console.error("Erro ao adicionar título:", error);
            res.status(500).json({ success: false, message: "Erro ao adicionar título." });
        }
    });
};

export default routesTitulos;