import asyncHandler from 'express-async-handler';
import ErrorResponse from '@/utils/errorResponse.js';
import Comentario from '@/models/comentario.js';
import Evento from '@/models/evento.js';
import Usuario from '@/models/usuario.js';

// @desc    Cria um novo comentário para um evento
// @route   POST /api/v1/eventos/:eventoId/comentarios
// @access  Privado
const createComentario = asyncHandler(async (req, res, next) => {
    const { eventoId } = req.params;
    const { texto, id_pai } = req.body;
    const auth0Id = req.auth.sub;

    const user = await Usuario.findOne({ auth0Id });
    if (!user) {
        return next(new ErrorResponse('Utilizador não encontrado', 404));
    }

    const evento = await Evento.findById(eventoId);
    if (!evento) {
        return next(new ErrorResponse(`Evento com ID ${eventoId} não encontrado`, 404));
    }

    const comentario = await Comentario.create({
        id_evento: eventoId,
        id_usuario: user._id,
        texto,
        id_pai
    });

    res.success(comentario, 201);
});

// @desc    Retorna todos os comentários de um evento
// @route   GET /api/v1/eventos/:eventoId/comentarios
// @access  Público
const getComentariosByEvento = asyncHandler(async (req, res, next) => {
    const { eventoId } = req.params;

    // Apenas retorna comentários de nível superior (sem pai)
    const comentarios = await Comentario.find({ id_evento: eventoId, id_pai: null })
        .populate({
            path: 'id_usuario',
            select: 'nome'
        })
        .populate({
            path: 'respostas', // Popula as respostas
            populate: {
                path: 'id_usuario', // Popula o utilizador da resposta
                select: 'nome'
            }
        });

    res.success({
        count: comentarios.length,
        data: comentarios
    });
});

// @desc    Atualiza um comentário
// @route   PUT /api/v1/comentarios/:id
// @access  Privado
const updateComentario = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { texto } = req.body;
    const auth0Id = req.auth.sub;

    const user = await Usuario.findOne({ auth0Id });
    if (!user) {
        return next(new ErrorResponse('Utilizador não encontrado', 404));
    }

    let comentario = await Comentario.findById(id);

    if (!comentario) {
        return next(new ErrorResponse(`Comentário com ID ${id} não encontrado`, 404));
    }

    if (comentario.id_usuario.toString() !== user._id.toString()) {
        return next(new ErrorResponse('Não autorizado a atualizar este comentário', 403));
    }

    comentario.texto = texto;
    await comentario.save();

    res.success(comentario);
});

// @desc    Deleta um comentário
// @route   DELETE /api/v1/comentarios/:id
// @access  Privado
const deleteComentario = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const auth0Id = req.auth.sub;

    const user = await Usuario.findOne({ auth0Id });
    if (!user) {
        return next(new ErrorResponse('Utilizador não encontrado', 404));
    }

    const comentario = await Comentario.findById(id);

    if (!comentario) {
        return next(new ErrorResponse(`Comentário com ID ${id} não encontrado`, 404));
    }

    // Permite que o dono do comentário ou um admin/organizador o delete
    if (comentario.id_usuario.toString() !== user._id.toString() && !['admin', 'organizador'].includes(user.role)) {
        return next(new ErrorResponse('Não autorizado a deletar este comentário', 403));
    }

    // Deleta o comentário e as suas respostas
    await Comentario.deleteMany({ $or: [{ _id: id }, { id_pai: id }] });

    res.success({});
});

export {
    createComentario,
    getComentariosByEvento,
    updateComentario,
    deleteComentario
};