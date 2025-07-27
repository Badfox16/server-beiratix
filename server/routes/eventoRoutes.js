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
import checkJwt from '@/middleware/authMiddleware.js';
import { validateEvento } from '@/validators/eventoValidators.js';
import handleValidationErrors from '@/middleware/handleValidationErrors.js';

const router = express.Router();

router.route('/')
    .post(checkJwt, validateEvento, handleValidationErrors, createEvento)
    .get(getAllEventos);

router.route('/:id')
    .get(getEventoById)
    .put(checkJwt, validateEvento, handleValidationErrors, updateEvento)
    .delete(checkJwt, deleteEvento);

// --- ROTAS ANINHADAS PARA TIPOS DE BILHETE ---
// Endpoint: /api/v1/eventos/:eventoId/tipos-bilhete
router.route('/:eventoId/tipos-bilhete')
    .post(checkJwt, createTipoBilheteForEvento) // TODO: Add validation for tipoBilhete
    .get(getAllTiposBilheteFromEvento);

export default router;