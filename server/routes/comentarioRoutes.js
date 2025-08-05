import express from 'express';
import {
    createComentario,
    getComentariosByEvento,
    updateComentario,
    deleteComentario
} from '@/controllers/comentarioController.js';
import checkJwt from '@/middleware/authMiddleware.js';

const router = express.Router({ mergeParams: true });

router.route('/')
    .post(checkJwt, createComentario)
    .get(getComentariosByEvento);

router.route('/:id')
    .put(checkJwt, updateComentario)
    .delete(checkJwt, deleteComentario);

export default router;