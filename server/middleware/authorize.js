import ErrorResponse from '@/utils/errorResponse.js';
import asyncHandler from 'express-async-handler';
import Usuario from '@/models/usuario.js';

// @desc    Middleware para autorizar utilizadores com base na sua função (role)
//          e/ou se são donos do recurso.
export const authorize = (...roles) => {
    return asyncHandler(async (req, res, next) => {
        const auth0Id = req.auth.sub;
        if (!auth0Id) {
            return next(new ErrorResponse('Não autorizado para aceder a esta rota', 401));
        }

        // Encontra o utilizador na nossa base de dados para obter a sua função
        const user = await Usuario.findOne({ auth0Id });

        if (!user) {
            return next(new ErrorResponse('Utilizador não encontrado', 404));
        }

        // Anexa o utilizador ao objeto req para uso posterior
        req.user = user;

        // Se a lista de roles inclui a função do utilizador, ele tem acesso
        if (roles.includes(user.role)) {
            return next();
        }

        // Se não tem a função, não tem acesso
        return next(new ErrorResponse(`O utilizador com a função '${user.role}' não está autorizado a aceder a esta rota`, 403));
    });
};

// @desc    Middleware para verificar se o utilizador é o dono de um recurso específico
//          ou se é um admin.
export const protect = (model) => {
    return asyncHandler(async (req, res, next) => {
        const resourceId = req.params.id;
        const resource = await model.findById(resourceId);

        if (!resource) {
            return next(new ErrorResponse(`Recurso não encontrado com o id ${resourceId}`, 404));
        }

        // O campo que liga o recurso ao seu dono.
        // Tenta encontrar um campo comum como 'id_organizador' ou 'criadoPor'.
        // NOTA: Isto pode precisar de ser mais específico dependendo do modelo.
        const ownerField = resource.id_organizador || resource.criadoPor || resource.id_usuario;

        // Verifica se o utilizador é o dono do recurso ou se é um admin
        if (ownerField && ownerField.toString() === req.user._id.toString()) {
            return next(); // É o dono, permite
        }

        // Se não for o dono, não tem acesso
        return next(new ErrorResponse('Utilizador não autorizado a modificar este recurso', 403));
    });
};
