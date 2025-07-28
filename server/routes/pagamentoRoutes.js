import express from 'express';
import {
    processarCompraBilhete,
    createPagamento,
    getPagamentoById,
    handlePagamentoWebhook
} from '@/controllers/pagamentoController.js';
import checkJwt from '@/middleware/authMiddleware.js';
import { validateCompraBilhete, validatePagamento } from '@/validators/pagamentoValidators.js';
import handleValidationErrors from '@/middleware/handleValidationErrors.js';

const router = express.Router();

// Rota principal para a compra de bilhetes (valida, cria bilhetes, atualiza stock)
router.post('/comprar',
    checkJwt,
    validateCompraBilhete,
    handleValidationErrors,
    processarCompraBilhete
);

// Rota para iniciar um processo de pagamento para um tipo de bilhete
// (Pode ser usada para cenários mais complexos que não a compra direta)
router.route('/')
    .post(checkJwt, validatePagamento, handleValidationErrors, createPagamento);

router.route('/:id')
    .get(checkJwt, getPagamentoById);

// Rota para receber a confirmação do provedor de pagamento (ex: M-Pesa, Stripe)
router.route('/webhook')
    .post(handlePagamentoWebhook);

export default router;
