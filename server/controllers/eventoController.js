import Evento from '@/models/evento.js';
import asyncHandler from 'express-async-handler';
import ErrorResponse from '@/utils/errorResponse.js';

// @desc    Cria um novo evento
// @route   POST /api/v1/eventos
// @access  Privado
const createEvento = asyncHandler(async (req, res, next) => {
    const evento = await Evento.create(req.body);
    res.success(evento, 201);
});

// @desc    Retorna todos os eventos
// @route   GET /api/v1/eventos
// @access  Público
const getAllEventos = asyncHandler(async (req, res, next) => {
    const eventos = await Evento.find({});
    res.success({
        count: eventos.length,
        data: eventos
    });
});

// @desc    Retorna um evento específico
// @route   GET /api/v1/eventos/:id
// @access  Público
const getEventoById = asyncHandler(async (req, res, next) => {
    const evento = await Evento.findById(req.params.id);
    if (!evento) {
        return next(new ErrorResponse(`Evento não encontrado com o id ${req.params.id}`, 404));
    }
    res.success(evento);
});

// @desc    Atualiza um evento
// @route   PUT /api/v1/eventos/:id
// @access  Privado
const updateEvento = asyncHandler(async (req, res, next) => {
    const evento = await Evento.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    if (!evento) {
        return next(new ErrorResponse(`Evento não encontrado com o id ${req.params.id}`, 404));
    }
    res.success(evento);
});

// @desc    Deleta um evento
// @route   DELETE /api/v1/eventos/:id
// @access  Privado
const deleteEvento = asyncHandler(async (req, res, next) => {
    const evento = await Evento.findByIdAndDelete(req.params.id);
    if (!evento) {
        return next(new ErrorResponse(`Evento não encontrado com o id ${req.params.id}`, 404));
    }
    res.success({});
});

// --- Funções para recursos aninhados ---

// @desc    Cria um novo tipo de bilhete para um evento
// @route   POST /api/v1/eventos/:eventoId/tipos-bilhete
// @access  Privado
const createTipoBilheteForEvento = asyncHandler(async (req, res, next) => {
    // TODO: Implementar a lógica para criar um tipo de bilhete para um evento
    res.success({ message: 'Rota para criar tipo de bilhete para um evento' }, 201);
});

// @desc    Retorna todos os tipos de bilhete de um evento
// @route   GET /api/v1/eventos/:eventoId/tipos-bilhete
// @access  Público
const getAllTiposBilheteFromEvento = asyncHandler(async (req, res, next) => {
    // TODO: Implementar a lógica para retornar todos os tipos de bilhete de um evento
    res.success({ message: 'Rota para retornar todos os tipos de bilhete de um evento' });
});

export {
    createEvento,
    getAllEventos,
    getEventoById,
    updateEvento,
    deleteEvento,
    createTipoBilheteForEvento,
    getAllTiposBilheteFromEvento
};

