import express from 'express';
import {
    createOrganizador,
    getAllOrganizadores,
    getOrganizadorById,
    updateOrganizador,
    deleteOrganizador
} from '@/controllers/organizadorController.js';

const router = express.Router();

router.route('/')
    .post(createOrganizador)
    .get(getAllOrganizadores);

router.route('/:id')
    .get(getOrganizadorById)
    .put(updateOrganizador)
    .delete(deleteOrganizador);

export default router;