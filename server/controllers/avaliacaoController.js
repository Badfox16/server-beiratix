import asyncHandler from 'express-async-handler';
import ErrorResponse from '@/utils/errorResponse.js';
import Avaliacao from '@/models/avaliacao.js';
import Evento from '@/models/evento.js';
import Bilhete from '@/models/bilhete.js';
import Usuario from '@/models/usuario.js';

// @desc    Cria uma nova avaliação para um evento
// @route   POST /api/v1/eventos/:eventoId/avaliacoes
// @access  Privado
const createAvaliacao = asyncHandler(async (req, res, next) => {
    const { eventoId } = req.params;
    const { classificacao, comentario } = req.body;
    const auth0Id = req.auth.sub;

    const user = await Usuario.findOne({ auth0Id });
    if (!user) {
        return next(new ErrorResponse('Utilizador não encontrado', 404));
    }

    const evento = await Evento.findById(eventoId);
    if (!evento) {
        return next(new ErrorResponse(`Evento com ID ${eventoId} não encontrado`, 404));
    }

    // 1. Verificar se o evento já terminou
    if (evento.dataFim > new Date()) {
        return next(new ErrorResponse('Só pode avaliar eventos que já terminaram', 400));
    }

    // 2. Verificar se o utilizador comprou um bilhete para este evento
    const bilheteComprado = await Bilhete.findOne({ id_evento: eventoId, id_usuario: user._id });
    if (!bilheteComprado) {
        return next(new ErrorResponse('Não pode avaliar um evento para o qual não comprou bilhete', 403));
    }

    // 3. Verificar se o utilizador já avaliou este evento
    const avaliacaoExistente = await Avaliacao.findOne({ id_evento: eventoId, id_usuario: user._id });
    if (avaliacaoExistente) {
        return next(new ErrorResponse('Já avaliou este evento', 400));
    }

    // 4. Criar e salvar a avaliação
    const avaliacao = await Avaliacao.create({
        id_evento: eventoId,
        id_usuario: user._id,
        classificacao,
        comentario
    });

    res.success(avaliacao, 201);
});

// @desc    Retorna todas as avaliações de um evento
// @route   GET /api/v1/eventos/:eventoId/avaliacoes
// @access  Público
const getAvaliacoesByEvento = asyncHandler(async (req, res, next) => {
    const { eventoId } = req.params;

    const avaliacoes = await Avaliacao.find({ id_evento: eventoId }).populate({
        path: 'id_usuario',
        select: 'nome'
    });

    res.success({
        count: avaliacoes.length,
        data: avaliacoes
    });
});

// @desc    Atualiza uma avaliação
// @route   PUT /api/v1/avaliacoes/:id
// @access  Privado
const updateAvaliacao = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { classificacao, comentario } = req.body;
    const auth0Id = req.auth.sub;

    const user = await Usuario.findOne({ auth0Id });
    if (!user) {
        return next(new ErrorResponse('Utilizador não encontrado', 404));
    }

    let avaliacao = await Avaliacao.findById(id);

    if (!avaliacao) {
        return next(new ErrorResponse(`Avaliação com ID ${id} não encontrada`, 404));
    }

    // Verificar se o utilizador é o dono da avaliação
    if (avaliacao.id_usuario.toString() !== user._id.toString()) {
        return next(new ErrorResponse('Não autorizado a atualizar esta avaliação', 403));
    }

    avaliacao.classificacao = classificacao || avaliacao.classificacao;
    avaliacao.comentario = comentario || avaliacao.comentario;

    await avaliacao.save();
    
    // Recalcular a média
    await Avaliacao.calcularMediaClassificacoes(avaliacao.id_evento);

    res.success(avaliacao);
});

// @desc    Deleta uma avaliação
// @route   DELETE /api/v1/avaliacoes/:id
// @access  Privado
const deleteAvaliacao = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const auth0Id = req.auth.sub;

    const user = await Usuario.findOne({ auth0Id });
    if (!user) {
        return next(new ErrorResponse('Utilizador não encontrado', 404));
    }

    const avaliacao = await Avaliacao.findById(id);

    if (!avaliacao) {
        return next(new ErrorResponse(`Avaliação com ID ${id} não encontrada`, 404));
    }

    // Verificar se o utilizador é o dono da avaliação ou um admin
    if (avaliacao.id_usuario.toString() !== user._id.toString() && user.role !== 'admin') {
        return next(new ErrorResponse('Não autorizado a deletar esta avaliação', 403));
    }

    await avaliacao.deleteOne();
    
    // Recalcular a média
    await Avaliacao.calcularMediaClassificacoes(avaliacao.id_evento);

    res.success({});
});


export {
    createAvaliacao,
    getAvaliacoesByEvento,
    updateAvaliacao,
    deleteAvaliacao
};