import express from 'express';
import {
    createEvento,
    getAllEventos,
    getEventoById,
    updateEvento,
    deleteEvento,
    // --- Funções para recursos aninhados ---
    createTipoBilheteForEvento,
    getAllTiposBilheteFromEvento
} from '@/controllers/eventoController.js';

const router = express.Router();

router.route('/')
    .post(createEvento)
    .get(getAllEventos);

router.route('/:id')
    .get(getEventoById)
    .put(updateEvento)
    .delete(deleteEvento);

// --- ROTAS ANINHADAS PARA TIPOS DE BILHETE ---
// Endpoint: /api/v1/eventos/:eventoId/tipos-bilhete
router.route('/:eventoId/tipos-bilhete')
    .post(createTipoBilheteForEvento)
    .get(getAllTiposBilheteFromEvento);

export default router;