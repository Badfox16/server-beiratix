import { body } from 'express-validator';

export const validateEvento = [
    body('titulo')
        .trim()
        .notEmpty().withMessage('O título do evento é obrigatório.'),

    body('descricao')
        .trim()
        .notEmpty().withMessage('A descrição do evento é obrigatória.'),

    body('id_organizador')
        .notEmpty().withMessage('O evento deve ter um organizador.')
        .isMongoId().withMessage('ID do organizador inválido.'),

    body('id_local')
        .notEmpty().withMessage('O local do evento é obrigatório.')
        .isMongoId().withMessage('ID do local inválido.'),

    body('dataInicio')
        .notEmpty().withMessage('A data de início é obrigatória.')
        .isISO8601().withMessage('Formato de data de início inválido.'),

    body('dataFim')
        .notEmpty().withMessage('A data de fim é obrigatória.')
        .isISO8601().withMessage('Formato de data de fim inválido.')
        .custom((value, { req }) => {
            if (new Date(value) <= new Date(req.body.dataInicio)) {
                throw new Error('A data de término deve ser posterior à data de início.');
            }
            return true;
        }),

    body('categoria')
        .notEmpty().withMessage('A categoria é obrigatória.')
        .isMongoId().withMessage('ID da categoria inválido.'),
    
    body('images').optional().isArray().withMessage('O campo de imagens deve ser um array.'),
    body('featured').optional().isBoolean().withMessage('O campo de destaque deve ser um booleano.'),
    body('estado').optional().isIn(['disponível', 'quase-esgotado', 'esgotado', 'cancelado', 'adiado']).withMessage('Estado do evento inválido.'),
];
