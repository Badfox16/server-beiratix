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

const router = express.Router();

router.route('/')
    .post(checkJwt, validateOrganizador, handleValidationErrors, createOrganizador)
    .get(getAllOrganizadores);

router.route('/:id')
    .get(getOrganizadorById)
    .put(checkJwt, validateOrganizador, handleValidationErrors, updateOrganizador)
    .delete(checkJwt, deleteOrganizador);

export default router;