import { body } from 'express-validator';

export const validatePagamento = [
    body('id_usuario')
        .notEmpty().withMessage('O ID do usuário é obrigatório.')
        .isMongoId().withMessage('ID do usuário inválido.'),

    body('id_tipoBilhete')
        .notEmpty().withMessage('O ID do tipo de bilhete é obrigatório.')
        .isMongoId().withMessage('ID do tipo de bilhete inválido.'),

    body('id_evento')
        .notEmpty().withMessage('O ID do evento é obrigatório.')
        .isMongoId().withMessage('ID do evento inválido.'),

    body('valorTotal')
        .notEmpty().withMessage('O valor total é obrigatório.')
        .isFloat({ min: 0 }).withMessage('O valor total deve ser um número não negativo.'),

    body('metodoPagamento')
        .trim()
        .notEmpty().withMessage('O método de pagamento é obrigatório.'),

    body('quantidadeBilhetes')
        .notEmpty().withMessage('A quantidade de bilhetes é obrigatória.')
        .isInt({ min: 1 }).withMessage('A quantidade de bilhetes deve ser um número inteiro positivo.')
];
