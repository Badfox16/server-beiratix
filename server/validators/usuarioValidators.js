import { body } from 'express-validator';

export const validateCreateUsuario = [
    body('nome')
        .trim()
        .notEmpty().withMessage('O nome é obrigatório.'),

    body('email')
        .trim()
        .notEmpty().withMessage('O email é obrigatório.')
        .isEmail().withMessage('Por favor, insira um email válido.'),

    body('auth0Id')
        .trim()
        .notEmpty().withMessage('O ID do Auth0 é obrigatório.')
];

export const validateUpdateUsuario = [
    body('nome')
        .optional()
        .trim()
        .notEmpty().withMessage('O nome não pode ser vazio.'),

    body('email')
        .optional()
        .trim()
        .isEmail().withMessage('Por favor, insira um email válido.'),

    body('telefone')
        .optional({ checkFalsy: true })
        .trim()
        .isString()
];
