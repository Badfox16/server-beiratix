import Evento from '@/models/evento.js';
import TipoBilhete from '@/models/tipoBilhete.js';
import asyncHandler from 'express-async-handler';
import ErrorResponse from '@/utils/errorResponse.js';

// @desc    Cria um novo evento
// @route   POST /api/v1/eventos
// @access  Privado
const createEvento = asyncHandler(async (req, res, next) => {
    // Adiciona o ID do utilizador que está a criar o evento
    req.body.criadoPor = req.user._id;
    // Associa também ao organizador, se o utilizador tiver essa ligação
    // (Esta lógica pode ser mais complexa, por agora associamos ao utilizador)
    req.body.id_organizador = req.user._id; 

    // Adiciona as URLs das imagens do Cloudinary, se existirem
    if (req.cloudinaryUrls) {
        req.body.images = req.cloudinaryUrls;
    }

    const evento = await Evento.create(req.body);
    res.success(evento, 201);
});

// @desc    Adiciona imagens a um evento existente
// @route   POST /api/v1/eventos/:id/images
// @access  Privado
const addImagesToEvento = asyncHandler(async (req, res, next) => {
    if (!req.cloudinaryUrls || req.cloudinaryUrls.length === 0) {
        return next(new ErrorResponse('Nenhuma imagem para adicionar.', 400));
    }

    const evento = await Evento.findById(req.params.id);

    if (!evento) {
        return next(new ErrorResponse(`Evento não encontrado com o id ${req.params.id}`, 404));
    }

    // Adiciona as novas imagens ao array existente
    evento.images.push(...req.cloudinaryUrls);
    await evento.save();

    res.success(evento);
});

// @desc    Retorna todos os eventos
// @route   GET /api/v1/eventos
// @access  Público
const getAllEventos = asyncHandler(async (req, res, next) => {
    // res.advancedResults já tem a estrutura correta
    res.status(200).json(res.advancedResults);
});

// @desc    Retorna um evento específico
// @route   GET /api/v1/eventos/:id
// @access  Público
const getEventoById = asyncHandler(async (req, res, next) => {
    const evento = await Evento.findById(req.params.id).populate('tiposBilhete');
    if (!evento) {
        return next(new ErrorResponse(`Evento não encontrado com o id ${req.params.id}`, 404));
    }
    res.success(evento);
});

// @desc    Atualiza um evento
// @route   PUT /api/v1/eventos/:id
// @access  Privado
const updateEvento = asyncHandler(async (req, res, next) => {
    // Se novas imagens forem enviadas, elas substituem as antigas.
    // Para adição, use o endpoint /images
    if (req.cloudinaryUrls) {
        req.body.images = req.cloudinaryUrls;
    }

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
    const evento = await Evento.findById(req.params.id);
    if (!evento) {
        return next(new ErrorResponse(`Evento não encontrado com o id ${req.params.id}`, 404));
    }

    // Antes de deletar o evento, deleta os tipos de bilhete associados
    await TipoBilhete.deleteMany({ id_evento: req.params.id });
    
    await evento.deleteOne();

    res.success({});
});

// --- Funções para recursos aninhados ---

// @desc    Cria um novo tipo de bilhete para um evento
// @route   POST /api/v1/eventos/:eventoId/tipos-bilhete
// @access  Privado
const createTipoBilheteForEvento = asyncHandler(async (req, res, next) => {
    const { eventoId } = req.params;
    req.body.id_evento = eventoId;

    const evento = await Evento.findById(eventoId);
    if (!evento) {
        return next(new ErrorResponse(`Evento não encontrado com o id ${eventoId}`, 404));
    }

    const tipoBilhete = await TipoBilhete.create(req.body);

    // Adiciona o novo tipo de bilhete ao evento
    evento.tiposBilhete.push(tipoBilhete._id);
    await evento.save();

    res.success(tipoBilhete, 201);
});

// @desc    Retorna todos os tipos de bilhete de um evento
// @route   GET /api/v1/eventos/:eventoId/tipos-bilhete
// @access  Público
const getAllTiposBilheteFromEvento = asyncHandler(async (req, res, next) => {
    const { eventoId } = req.params;

    const evento = await Evento.findById(eventoId);
    if (!evento) {
        return next(new ErrorResponse(`Evento não encontrado com o id ${eventoId}`, 404));
    }

    const tiposBilhete = await TipoBilhete.find({ id_evento: eventoId });

    res.success({
        count: tiposBilhete.length,
        data: tiposBilhete
    });
});

export {
    createEvento,
    addImagesToEvento,
    getAllEventos,
    getEventoById,
    updateEvento,
    deleteEvento,
    createTipoBilheteForEvento,
    getAllTiposBilheteFromEvento
};

