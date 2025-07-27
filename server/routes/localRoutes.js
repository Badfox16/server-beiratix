import express from 'express';
import {
    createLocal,
    getAllLocais,
    getLocalById,
    updateLocal,
    deleteLocal
} from '@/controllers/localController.js';

const router = express.Router();

// O middleware `imageUploadHandler` será adicionado aqui no futuro para o upload de imagens
router.route('/')
    .post(createLocal)
    .get(getAllLocais);

router.route('/:id')
    .get(getLocalById)
    .put(updateLocal)
    .delete(deleteLocal);

export default router;