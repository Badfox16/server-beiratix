import Usuario from '@/models/usuario.js';
import asyncHandler from 'express-async-handler';
import ErrorResponse from '@/utils/errorResponse.js';

// @desc    Retorna o perfil do usuário atual (autenticado)
// @route   GET /api/v1/usuarios/me
// @access  Privado
const getCurrentUser = asyncHandler(async (req, res, next) => {
    if (!req.user) {
        return next(new ErrorResponse('Usuário não encontrado', 404));
    }
    
    res.success(req.user);
});

// @desc    Atualiza o perfil do usuário atual
// @route   PUT /api/v1/usuarios/me
// @access  Privado
const updateCurrentUser = asyncHandler(async (req, res, next) => {
    if (!req.user) {
        return next(new ErrorResponse('Usuário não encontrado', 404));
    }
    
    const allowedFields = ['nome', 'telefone'];
    const updateData = {};
    
    // Apenas permite atualizar campos específicos
    Object.keys(req.body).forEach(key => {
        if (allowedFields.includes(key)) {
            updateData[key] = req.body[key];
        }
    });
    
    const usuario = await Usuario.findByIdAndUpdate(req.user._id, updateData, {
        new: true,
        runValidators: true
    });
    
    res.success(usuario);
});

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
    res.json(res.advancedResults);
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
    getCurrentUser,
    updateCurrentUser,
    createUsuario,
    getAllUsuarios,
    getUsuarioById,
    updateUsuario,
    deleteUsuario
};
