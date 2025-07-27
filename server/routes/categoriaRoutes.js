import express from 'express';
import {
    createCategoria,
    getAllCategorias,
    getCategoriaById,
    updateCategoria,
    deleteCategoria
} from '@/controllers/categoriaController.js';
import checkJwt from '@/middleware/authMiddleware.js';
import { validateCategoria } from '@/validators/categoriaValidators.js';
import handleValidationErrors from '@/middleware/handleValidationErrors.js';

const router = express.Router();

router.route('/')
    .post(checkJwt, validateCategoria, handleValidationErrors, createCategoria)
    .get(getAllCategorias);

router.route('/:id')
    .get(getCategoriaById)
    .put(checkJwt, validateCategoria, handleValidationErrors, updateCategoria)
    .delete(checkJwt, deleteCategoria);

export default router;