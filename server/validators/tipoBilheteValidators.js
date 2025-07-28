import { body } from 'express-validator';

export const validateTipoBilhete = [
    body('nome')
        .trim()
        .notEmpty()
        .withMessage('O nome do tipo de bilhete é obrigatório (ex: Normal, VIP).'),
    body('preco')
        .isFloat({ gt: 0 })
        .withMessage('O preço deve ser um número maior que zero.'),
    body('quantidadeTotal')
        .isInt({ gt: 0 })
        .withMessage('A quantidade total deve ser um número inteiro maior que zero.'),
    body('maxPorCompra')
        .optional()
        .isInt({ gt: 0 })
        .withMessage('O número máximo de bilhetes por compra deve ser um número inteiro maior que zero.')
];
