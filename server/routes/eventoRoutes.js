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
import handleValidationErrors from '@/middleware/handleValidationErrors.js';

const router = express.Router();

router.route('/')
    .post(checkJwt, imageUploadHandler, validateEvento, handleValidationErrors, createEvento)
    .get(getAllEventos);

router.route('/:id')
    .get(getEventoById)
    .put(checkJwt, imageUploadHandler, validateEvento, handleValidationErrors, updateEvento)
    .delete(checkJwt, deleteEvento);

router.route('/:id/images')
    .post(checkJwt, imageUploadHandler, handleValidationErrors, addImagesToEvento);

// --- ROTAS ANINHADAS PARA TIPOS DE BILHETE ---
// Endpoint: /api/v1/eventos/:eventoId/tipos-bilhete
router.route('/:eventoId/tipos-bilhete')
    .post(checkJwt, createTipoBilheteForEvento) // TODO: Add validation for tipoBilhete
    .get(getAllTiposBilheteFromEvento);

export default router;