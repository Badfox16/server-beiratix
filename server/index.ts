import express from 'express';
import dotenv from 'dotenv';
import { connectToDatabase } from '@/config/db.js'; 

// Importar os nossos middlewares
import responseHandler from '@/middleware/responseHandler.js';
import errorHandler from '@/middleware/errorHandler.js';

dotenv.config();

const app = express();

// Importar as rotas
import categoriaRoutes from '@/routes/categoriaRoutes.js';
import eventoRoutes from '@/routes/eventoRoutes.js';
import localRoutes from '@/routes/localRoutes.js';
import organizadorRoutes from '@/routes/organizadorRoutes.js';
import pagamentoRoutes from '@/routes/pagamentoRoutes.js';
import usuarioRoutes from '@/routes/usuarioRoutes.js';

// --- MIDDLEWARES GLOBAIS ---

// Middleware para processar JSON no corpo das requisições
app.use(express.json());

// Middleware para adicionar os formatadores de resposta (res.success, res.error)
app.use(responseHandler);


// --- ROTAS DA API ---
app.use('/api/v1/categorias', categoriaRoutes);
app.use('/api/v1/eventos', eventoRoutes);
app.use('/api/v1/locais', localRoutes);
app.use('/api/v1/organizadores', organizadorRoutes);
app.use('/api/v1/pagamentos', pagamentoRoutes);
app.use('/api/v1/usuarios', usuarioRoutes);

app.get('/', (req, res) => {
  res.json({ success: true, message: 'Bem-vindo à API do BeiraTix!' });
});


// --- MIDDLEWARE DE ERRO ---
// IMPORTANTE: Este deve ser o ÚLTIMO middleware a ser adicionado.
app.use(errorHandler);


const PORT = process.env.PORT || 3001;

app.listen(PORT, async () => {
  await connectToDatabase();
  console.log(`🚀 Servidor a correr na porta ${PORT}`);
});