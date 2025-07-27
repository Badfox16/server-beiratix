import { body } from 'express-validator';

export const validateCategoria = [
    body('nome')
        .trim()
        .notEmpty().withMessage('O nome da categoria é obrigatório.')
        .isString().withMessage('O nome da categoria deve ser um texto.'),

    body('icon')
        .trim()
        .notEmpty().withMessage('O ícone da categoria é obrigatório.')
        .isString().withMessage('O ícone da categoria deve ser um texto.')
];
