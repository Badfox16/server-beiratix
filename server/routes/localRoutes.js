import express from 'express';
import {
    createLocal,
    addImagesToLocal,
    getAllLocais,
    getLocalById,
    updateLocal,
    deleteLocal
} from '@/controllers/localController.js';
import checkJwt from '@/middleware/authMiddleware.js';
import imageUploadHandler from '@/middleware/imageUploadHandler.js';
import { validateLocal } from '@/validators/localValidators.js';
import handleValidationErrors from '@/middleware/handleValidationErrors.js';
import advancedResults from '@/middleware/advancedResults.js';
import Local from '@/models/local.js';

const router = express.Router();

router.route('/')
    .get(advancedResults(Local, 'eventos', ['nome', 'descricao', 'endereco', 'tipo']), getAllLocais)
    .post(checkJwt, imageUploadHandler, validateLocal, handleValidationErrors, createLocal);

router.route('/:id')
    .get(getLocalById)
    .put(checkJwt, imageUploadHandler, validateLocal, handleValidationErrors, updateLocal)
    .delete(checkJwt, deleteLocal);

router.route('/:id/images')
    .post(checkJwt, imageUploadHandler, handleValidationErrors, addImagesToLocal);

export default router;