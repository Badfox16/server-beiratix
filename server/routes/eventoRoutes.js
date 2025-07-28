import express from 'express';
import {
    createEvento,
    addImagesToEvento,
    getAllEventos,
    getEventoById,
    updateEvento,
    deleteEvento,
    // --- Funções para recursos aninhados ---
    createTipoBilheteForEvento,
    getAllTiposBilheteFromEvento
} from '@/controllers/eventoController.js';
import checkJwt from '@/middleware/authMiddleware.js';
import imageUploadHandler from '@/middleware/imageUploadHandler.js';
import { validateEvento } from '@/validators/eventoValidators.js';
import { validateTipoBilhete } from '@/validators/tipoBilheteValidators.js';
import handleValidationErrors from '@/middleware/handleValidationErrors.js';
import advancedResults from '@/middleware/advancedResults.js';
import Evento from '@/models/evento.js';

const router = express.Router();

router.route('/')
    .get(advancedResults(Evento, { path: 'tiposBilhete categoria', select: 'nome preco' }), getAllEventos)
    .post(checkJwt, imageUploadHandler, validateEvento, handleValidationErrors, createEvento);

router.route('/:id')
    .get(getEventoById)
    .put(checkJwt, imageUploadHandler, validateEvento, handleValidationErrors, updateEvento)
    .delete(checkJwt, deleteEvento);

router.route('/:id/images')
    .post(checkJwt, imageUploadHandler, handleValidationErrors, addImagesToEvento);

// --- ROTAS ANINHADAS PARA TIPOS DE BILHETE ---
// Endpoint: /api/v1/eventos/:eventoId/tipos-bilhete
router.route('/:eventoId/tipos-bilhete')
    .post(checkJwt, validateTipoBilhete, handleValidationErrors, createTipoBilheteForEvento)
    .get(getAllTiposBilheteFromEvento);

export default router;
