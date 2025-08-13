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
import advancedResults from '@/middleware/advancedResults.js';
import Categoria from '@/models/categoria.js';

const router = express.Router();

router.route('/')
    .get(advancedResults(Categoria, null, ['nome']), getAllCategorias)
    .post(checkJwt, validateCategoria, handleValidationErrors, createCategoria);

router.route('/:id')
    .get(getCategoriaById)
    .put(checkJwt, validateCategoria, handleValidationErrors, updateCategoria)
    .delete(checkJwt, deleteCategoria);

export default router;