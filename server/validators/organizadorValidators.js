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
        .isString(),

    body('avaliacao')
        .optional({ checkFalsy: true })
        .isFloat({ min: 0, max: 5 })
        .withMessage('A avaliação deve ser um número entre 0 e 5.'),

    body('imagemLogo')
        .optional({ checkFalsy: true })
        .trim()
        .isString()
        .withMessage('A URL da imagem do logo deve ser uma string.')

];
