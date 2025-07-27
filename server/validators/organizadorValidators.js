import { body } from 'express-validator';

export const validateOrganizador = [
    body('nome')
        .trim()
        .notEmpty().withMessage('O nome do organizador é obrigatório.'),

    body('emailContato')
        .trim()
        .notEmpty().withMessage('O email de contacto é obrigatório.')
        .isEmail().withMessage('Por favor, insira um email válido.'),

    body('telefoneContato')
        .optional({ checkFalsy: true })
        .trim()
        .isString(),

    body('site')
        .optional({ checkFalsy: true })
        .trim()
        .isURL().withMessage('Por favor, insira um URL de site válido.'),

    body('descricao')
        .optional({ checkFalsy: true })
        .trim()
        .isString()
];
