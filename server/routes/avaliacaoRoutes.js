import express from 'express';
import {
    createAvaliacao,
    getAvaliacoesByEvento,
    updateAvaliacao,
    deleteAvaliacao
} from '@/controllers/avaliacaoController.js';
import checkJwt from '@/middleware/authMiddleware.js';

// Usamos mergeParams para aceder ao :eventoId da rota pai (em eventoRoutes.js)
const router = express.Router({ mergeParams: true });

// Todas as rotas, exceto a de listagem, requerem autenticação
router.route('/')
    .post(checkJwt, createAvaliacao)
    .get(getAvaliacoesByEvento);

router.route('/:id')
    .put(checkJwt, updateAvaliacao)
    .delete(checkJwt, deleteAvaliacao);

export default router;