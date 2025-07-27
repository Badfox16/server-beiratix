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

const router = express.Router();

router.route('/')
    .post(checkJwt, imageUploadHandler, validateLocal, handleValidationErrors, createLocal)
    .get(getAllLocais);

router.route('/:id')
    .get(getLocalById)
    .put(checkJwt, imageUploadHandler, validateLocal, handleValidationErrors, updateLocal)
    .delete(checkJwt, deleteLocal);

router.route('/:id/images')
    .post(checkJwt, imageUploadHandler, handleValidationErrors, addImagesToLocal);

export default router;