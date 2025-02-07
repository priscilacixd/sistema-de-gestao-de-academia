import express from "express";
import cors from "cors";
import client from "./src/config/bd.js";
import routesClientes from "./src/routes/clientesRoutes.js"
import routesPlanos from "./src/routes/planosRoutes.js"
import routesUsuario from "./src/routes/usuarioRoutes.js";
import routesTitulos from "./src/routes/titulosRoutes.js";

const app = express();

app.use(cors({
    origin: 'https://sgda.onrender.com',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

app.use(express.json());

routesClientes(app);
routesPlanos(app);
routesUsuario(app);
routesTitulos(app);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

