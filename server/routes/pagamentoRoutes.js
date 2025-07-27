import express from 'express';
import {
    createPagamento,
    getPagamentoById,
    handlePagamentoWebhook
} from '@/controllers/pagamentoController.js';

const router = express.Router();

// Rota para iniciar um processo de pagamento para um tipo de bilhete
// Ex: POST /api/v1/pagamentos
// Corpo: { id_tipoBilhete: "...", quantidade: 2, metodoPagamento: "M-Pesa" }
router.route('/')
    .post(createPagamento);

router.route('/:id')
    .get(getPagamentoById);

// Rota para receber a confirmação do provedor de pagamento (ex: M-Pesa, Stripe)
// Ex: POST /api/v1/pagamentos/webhook
router.route('/webhook')
    .post(handlePagamentoWebhook);

export default router;