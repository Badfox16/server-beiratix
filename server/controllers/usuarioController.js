import Usuario from '@/models/usuario.js';
import asyncHandler from 'express-async-handler';
import ErrorResponse from '@/utils/errorResponse.js';

// @desc    Cria um novo usuário (sincronização com Auth0)
// @route   POST /api/v1/usuarios
// @access  Privado (Apenas para M2M)
const createUsuario = asyncHandler(async (req, res, next) => {
    const { nome, email, auth0Id } = req.body;
    const usuario = await Usuario.create({ nome, email, auth0Id });
    res.success(usuario, 201);
});

// @desc    Retorna todos os usuários
// @route   GET /api/v1/usuarios
// @access  Privado (Admin)
const getAllUsuarios = asyncHandler(async (req, res, next) => {
    res.success(res.advancedResults);
});

// @desc    Retorna um usuário específico
// @route   GET /api/v1/usuarios/:id
// @access  Privado
const getUsuarioById = asyncHandler(async (req, res, next) => {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) {
        return next(new ErrorResponse(`Usuário não encontrado com o id ${req.params.id}`, 404));
    }
    res.success(usuario);
});

// @desc    Atualiza um usuário
// @route   PUT /api/v1/usuarios/:id
// @access  Privado
const updateUsuario = asyncHandler(async (req, res, next) => {
    const usuario = await Usuario.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!usuario) {
        return next(new ErrorResponse(`Usuário não encontrado com o id ${req.params.id}`, 404));
    }
    res.success(usuario);
});

// @desc    Deleta um usuário
// @route   DELETE /api/v1/usuarios/:id
// @access  Privado (Admin)
const deleteUsuario = asyncHandler(async (req, res, next) => {
    const usuario = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuario) {
        return next(new ErrorResponse(`Usuário não encontrado com o id ${req.params.id}`, 404));
    }
    res.success({});
});

export {
    createUsuario,
    getAllUsuarios,
    getUsuarioById,
    updateUsuario,
    deleteUsuario
};
