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
    res.json(res.advancedResults);
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

// @desc    Upload de logo do organizador
// @route   POST /api/v1/organizadores/:id/logo
// @access  Privado
const uploadLogoOrganizador = asyncHandler(async (req, res, next) => {
    const organizador = await Organizador.findById(req.params.id);
    
    if (!organizador) {
        return next(new ErrorResponse(`Organizador não encontrado com o id ${req.params.id}`, 404));
    }

    if (!req.cloudinaryUrls || req.cloudinaryUrls.length === 0) {
        return next(new ErrorResponse('Nenhuma imagem foi enviada', 400));
    }

    // Para organizador, usamos apenas a primeira imagem como logo
    organizador.imagemLogo = req.cloudinaryUrls[0];
    await organizador.save();

    res.success(organizador);
});

// @desc    Remove logo do organizador
// @route   DELETE /api/v1/organizadores/:id/images
// @access  Privado
const removeLogoOrganizador = asyncHandler(async (req, res, next) => {
    console.log('=== REMOVE LOGO ORGANIZADOR ===');
    console.log('ID do organizador:', req.params.id);
    console.log('req.body:', req.body);
    
    const organizador = await Organizador.findById(req.params.id);
    
    if (!organizador) {
        console.log('Organizador não encontrado');
        return next(new ErrorResponse(`Organizador não encontrado com o id ${req.params.id}`, 404));
    }

    // Para organizador, simplesmente remove o logo
    organizador.imagemLogo = undefined;
    await organizador.save();

    console.log('Logo removido com sucesso');
    res.success(organizador);
});

export {
    createOrganizador,
    getAllOrganizadores,
    getOrganizadorById,
    updateOrganizador,
    deleteOrganizador,
    uploadLogoOrganizador,
    removeLogoOrganizador
};
