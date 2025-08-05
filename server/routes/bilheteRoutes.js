import express from 'express';
import {
    getMeusBilhetes,
    getBilheteById,
    validarBilhete
} from '@/controllers/bilheteController.js';
import checkJwt from '@/middleware/authMiddleware.js';
import { authorize } from '@/middleware/authorize.js';

const router = express.Router();

// Todas as rotas aqui são privadas e requerem autenticação
router.use(checkJwt);

// Rota para validar um bilhete (acessível por admin e organizador)
router.route('/validar')
    .post(authorize('admin', 'organizador'), validarBilhete);

router.route('/meus-bilhetes')
    .get(getMeusBilhetes);

router.route('/:id')
    .get(getBilheteById);

export default router;
