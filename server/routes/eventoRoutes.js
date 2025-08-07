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
import syncUser from '@/middleware/syncUser.js';
import imageUploadHandler from '@/middleware/imageUploadHandler.js';
import { validateEvento } from '@/validators/eventoValidators.js';
import { validateTipoBilhete } from '@/validators/tipoBilheteValidators.js';
import handleValidationErrors from '@/middleware/handleValidationErrors.js';
import advancedResults from '@/middleware/advancedResults.js';
import Evento from '@/models/evento.js';

// Importar os routers dos recursos aninhados
import avaliacaoRouter from './avaliacaoRoutes.js';
import comentarioRouter from './comentarioRoutes.js';


const router = express.Router();

// --- ROTAS ANINHADAS ---
// Redireciona o tráfego para os routers específicos
router.use('/:eventoId/avaliacoes', avaliacaoRouter);
router.use('/:eventoId/comentarios', comentarioRouter);


router.route('/')
    .get(advancedResults(Evento, { path: 'tiposBilhete categoria', select: 'nome preco' }), getAllEventos)
    .post(checkJwt, syncUser, imageUploadHandler, validateEvento, handleValidationErrors, createEvento);

router.route('/:id')
    .get(getEventoById)
    .put(checkJwt, syncUser, imageUploadHandler, validateEvento, handleValidationErrors, updateEvento)
    .delete(checkJwt, syncUser, deleteEvento);

router.route('/:id/images')
    .post(checkJwt, syncUser, imageUploadHandler, handleValidationErrors, addImagesToEvento);

// --- ROTAS ANINHADAS PARA TIPOS DE BILHETE ---
// Endpoint: /api/v1/eventos/:eventoId/tipos-bilhete
router.route('/:eventoId/tipos-bilhete')
    .post(checkJwt, syncUser, validateTipoBilhete, handleValidationErrors, createTipoBilheteForEvento)
    .get(getAllTiposBilheteFromEvento);

export default router;
