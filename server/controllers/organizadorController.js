import Organizador from '@/models/organizador.js';
import asyncHandler from 'express-async-handler';
import ErrorResponse from '@/utils/errorResponse.js';

// @desc    Cria um novo organizador
// @route   POST /api/v1/organizadores
// @access  Privado
const createOrganizador = asyncHandler(async (req, res, next) => {
    const organizador = await Organizador.create(req.body);
    res.success(organizador, 201);
});

// @desc    Retorna todos os organizadores
// @route   GET /api/v1/organizadores
// @access  Público
const getAllOrganizadores = asyncHandler(async (req, res, next) => {
    const organizadores = await Organizador.find();
    res.success({
        count: organizadores.length,
        data: organizadores
    });
});

// @desc    Retorna um organizador específico
// @route   GET /api/v1/organizadores/:id
// @access  Público
const getOrganizadorById = asyncHandler(async (req, res, next) => {
    const organizador = await Organizador.findById(req.params.id);
    if (!organizador) {
        return next(new ErrorResponse(`Organizador não encontrado com o id ${req.params.id}`, 404));
    }
    res.success(organizador);
});

// @desc    Atualiza um organizador
// @route   PUT /api/v1/organizadores/:id
// @access  Privado
const updateOrganizador = asyncHandler(async (req, res, next) => {
    const organizador = await Organizador.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!organizador) {
        return next(new ErrorResponse(`Organizador não encontrado com o id ${req.params.id}`, 404));
    }
    res.success(organizador);
});

// @desc    Deleta um organizador
// @route   DELETE /api/v1/organizadores/:id
// @access  Privado
const deleteOrganizador = asyncHandler(async (req, res, next) => {
    const organizador = await Organizador.findByIdAndDelete(req.params.id);
    if (!organizador) {
        return next(new ErrorResponse(`Organizador não encontrado com o id ${req.params.id}`, 404));
    }
    res.success({});
});

export {
    createOrganizador,
    getAllOrganizadores,
    getOrganizadorById,
    updateOrganizador,
    deleteOrganizador
};
