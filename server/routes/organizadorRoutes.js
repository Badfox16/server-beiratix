import express from 'express';
import {
    createOrganizador,
    getAllOrganizadores,
    getOrganizadorById,
    updateOrganizador,
    deleteOrganizador
} from '@/controllers/organizadorController.js';
import checkJwt from '@/middleware/authMiddleware.js';
import { validateOrganizador } from '@/validators/organizadorValidators.js';
import handleValidationErrors from '@/middleware/handleValidationErrors.js';
import advancedResults from '@/middleware/advancedResults.js';
import Organizador from '@/models/organizador.js';

const router = express.Router();

router.route('/')
    .get(advancedResults(Organizador, 'eventosOrganizados'), getAllOrganizadores)
    .post(checkJwt, validateOrganizador, handleValidationErrors, createOrganizador);

router.route('/:id')
    .get(getOrganizadorById)
    .put(checkJwt, validateOrganizador, handleValidationErrors, updateOrganizador)
    .delete(checkJwt, deleteOrganizador);

export default router;