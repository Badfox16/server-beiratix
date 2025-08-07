import Local from '@/models/local.js';
import asyncHandler from 'express-async-handler';
import ErrorResponse from '@/utils/errorResponse.js';

// @desc    Cria um novo local
// @route   POST /api/v1/locais
// @access  Privado
const createLocal = asyncHandler(async (req, res, next) => {
    // Adiciona as URLs das imagens do Cloudinary, se existirem
    if (req.cloudinaryUrls) {
        req.body.imagens = req.cloudinaryUrls;
    }

    const local = await Local.create(req.body);
    res.success(local, 201);
});

// @desc    Adiciona imagens a um local existente
// @route   POST /api/v1/locais/:id/images
// @access  Privado
const addImagesToLocal = asyncHandler(async (req, res, next) => {
    if (!req.cloudinaryUrls || req.cloudinaryUrls.length === 0) {
        return next(new ErrorResponse('Nenhuma imagem para adicionar.', 400));
    }

    const local = await Local.findById(req.params.id);

    if (!local) {
        return next(new ErrorResponse(`Local não encontrado com o id ${req.params.id}`, 404));
    }

    // Adiciona as novas imagens ao array existente
    local.imagens.push(...req.cloudinaryUrls);
    await local.save();

    res.success(local);
});

// @desc    Retorna todos os locais
// @route   GET /api/v1/locais
// @access  Público
const getAllLocais = asyncHandler(async (req, res, next) => {
    res.json(res.advancedResults);
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
    // Se novas imagens forem enviadas, elas substituem as antigas.
    // Para adição, use o endpoint /images
    if (req.cloudinaryUrls) {
        req.body.imagens = req.cloudinaryUrls;
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
    addImagesToLocal,
    getAllLocais,
    getLocalById,
    updateLocal,
    deleteLocal
};
