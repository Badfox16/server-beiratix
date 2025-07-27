import { body } from 'express-validator';

export const validateLocal = [
    body('nome')
        .trim()
        .notEmpty().withMessage('O nome do local é obrigatório.'),

    body('descricao')
        .trim()
        .notEmpty().withMessage('A descrição é obrigatória.'),

    body('endereco')
        .trim()
        .notEmpty().withMessage('O endereço é obrigatório.'),

    body('tipo')
        .trim()
        .notEmpty().withMessage('O tipo de local é obrigatório.'),

    body('capacidade')
        .optional()
        .isInt({ min: 0 }).withMessage('A capacidade deve ser um número inteiro não negativo.'),

    body('imagemUrl')
        .optional()
        .isURL().withMessage('URL da imagem inválida.')
];
