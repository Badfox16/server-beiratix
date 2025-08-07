import Categoria from '@/models/categoria.js';
import asyncHandler from 'express-async-handler';
import ErrorResponse from '@/utils/errorResponse.js';

// @desc    Cria uma nova categoria
// @route   POST /api/v1/categorias
// @access  Privado
const createCategoria = asyncHandler(async (req, res, next) => {
    const categoria = await Categoria.create(req.body);
    res.success(categoria, 201);
});

// @desc    Retorna todas as categorias
// @route   GET /api/v1/categorias
// @access  Público
const getAllCategorias = asyncHandler(async (req, res, next) => {
    res.json(res.advancedResults);
});

// @desc    Retorna uma categoria específica
// @route   GET /api/v1/categorias/:id
// @access  Público
const getCategoriaById = asyncHandler(async (req, res, next) => {
    const categoria = await Categoria.findById(req.params.id);
    if (!categoria) {
        return next(new ErrorResponse(`Categoria não encontrada com o id ${req.params.id}`, 404));
    }
    res.success(categoria);
});

// @desc    Atualiza uma categoria
// @route   PUT /api/v1/categorias/:id
// @access  Privado
const updateCategoria = asyncHandler(async (req, res, next) => {
    const categoria = await Categoria.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    if (!categoria) {
        return next(new ErrorResponse(`Categoria não encontrada com o id ${req.params.id}`, 404));
    }
    res.success(categoria);
});

// @desc    Deleta uma categoria
// @route   DELETE /api/v1/categorias/:id
// @access  Privado
const deleteCategoria = asyncHandler(async (req, res, next) => {
    const categoria = await Categoria.findByIdAndDelete(req.params.id);
    if (!categoria) {
        return next(new ErrorResponse(`Categoria não encontrada com o id ${req.params.id}`, 404));
    }
    res.success({});
});

export {
    createCategoria,
    getAllCategorias,
    getCategoriaById,
    updateCategoria,
    deleteCategoria
};
