import Local from '../models/local.js';
import asyncHandler from 'express-async-handler';
import ErrorResponse from '@/utils/errorResponse.js';

// @desc    Cria um novo local
// @route   POST /api/v1/locais
// @access  Privado
const createLocal = asyncHandler(async (req, res, next) => {
    // Adiciona a URL da imagem do Cloudinary, se existir
    if (req.cloudinaryUrl) {
        req.body.imagemUrl = req.cloudinaryUrl;
    }

    const local = await Local.create(req.body);
    res.success(local, 201);
});

// @desc    Retorna todos os locais
// @route   GET /api/v1/locais
// @access  Público
const getAllLocais = asyncHandler(async (req, res, next) => {
    const locais = await Local.find();
    res.success({
        count: locais.length,
        data: locais
    });
});

// @desc    Retorna um local específico
// @route   GET /api/v1/locais/:id
// @access  Público
const getLocalById = asyncHandler(async (req, res, next) => {
    const local = await Local.findById(req.params.id);
    if (!local) {
        return next(new ErrorResponse(`Local não encontrado com o id ${req.params.id}`, 404));
    }
    res.success(local);
});

// @desc    Atualiza um local
// @route   PUT /api/v1/locais/:id
// @access  Privado
const updateLocal = asyncHandler(async (req, res, next) => {
    // Adiciona a URL da imagem do Cloudinary, se existir
    if (req.cloudinaryUrl) {
        req.body.imagemUrl = req.cloudinaryUrl;
    }

    const local = await Local.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!local) {
        return next(new ErrorResponse(`Local não encontrado com o id ${req.params.id}`, 404));
    }
    res.success(local);
});

// @desc    Deleta um local
// @route   DELETE /api/v1/locais/:id
// @access  Privado
const deleteLocal = asyncHandler(async (req, res, next) => {
    const local = await Local.findByIdAndDelete(req.params.id);
    if (!local) {
        return next(new ErrorResponse(`Local não encontrado com o id ${req.params.id}`, 404));
    }
    res.success({});
});

export {
    createLocal,
    getAllLocais,
    getLocalById,
    updateLocal,
    deleteLocal
};
