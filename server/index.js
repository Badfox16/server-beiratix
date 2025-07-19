import express from 'express';
import dotenv from 'dotenv';
import { connectToDatabase } from './config/db.js'; 

// Importar os nossos middlewares
import responseHandler from './middleware/responseHandler.js';
import errorHandler from './middleware/errorHandler.js';

dotenv.config();

const app = express();

// --- MIDDLEWARES GLOBAIS ---

// Middleware para processar JSON no corpo das requisições
app.use(express.json());

// Middleware para adicionar os formatadores de resposta (res.success, res.error)
app.use(responseHandler);


// --- ROTAS DA API ---
// (Aqui é onde irá importar e usar as suas rotas no futuro)
// Exemplo:
// import eventoRoutes from './routes/eventoRoutes.js';
// app.use('/api/v1/eventos', eventoRoutes);

app.get('/', (req, res) => {
  res.success({ message: 'Bem-vindo à API do EiTickets!' });
});


// --- MIDDLEWARE DE ERRO ---
// IMPORTANTE: Este deve ser o ÚLTIMO middleware a ser adicionado.
app.use(errorHandler);


const PORT = process.env.PORT || 3001;

app.listen(PORT, async () => {
  await connectToDatabase();
  console.log(`🚀 Servidor a correr na porta ${PORT}`);
});