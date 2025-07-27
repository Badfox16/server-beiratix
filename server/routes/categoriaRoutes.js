import express from 'express';
import {
    createCategoria,
    getAllCategorias,
    getCategoriaById,
    updateCategoria,
    deleteCategoria
} from '@/controllers/categoriaController.js';

const router = express.Router();

router.route('/')
    .post(createCategoria)
    .get(getAllCategorias);

router.route('/:id')
    .get(getCategoriaById)
    .put(updateCategoria)
    .delete(deleteCategoria);

export default router;