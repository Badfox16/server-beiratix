import asyncHandler from 'express-async-handler';
import Bilhete from '@/models/bilhete.js';
import Usuario from '@/models/usuario.js';
import ErrorResponse from '@/utils/errorResponse.js';

// @desc    Retorna todos os bilhetes do utilizador autenticado
// @route   GET /api/v1/bilhetes/meus-bilhetes
// @access  Privado
const getMeusBilhetes = asyncHandler(async (req, res, next) => {
    const auth0Id = req.auth.sub;
    const user = await Usuario.findOne({ auth0Id });

    if (!user) {
        return next(new ErrorResponse('Utilizador não encontrado', 404));
    }

    const bilhetes = await Bilhete.find({ id_usuario: user._id })
        .populate({
            path: 'id_evento',
            select: 'titulo dataInicio images'
        })
        .sort({ createdAt: -1 });

    res.success(bilhetes);
});


// @desc    Retorna um bilhete específico pelo seu ID
// @route   GET /api/v1/bilhetes/:id
// @access  Privado
const getBilheteById = asyncHandler(async (req, res, next) => {
    const auth0Id = req.auth.sub;
    const user = await Usuario.findOne({ auth0Id });

    if (!user) {
        return next(new ErrorResponse('Utilizador não encontrado', 404));
    }

    const bilhete = await Bilhete.findById(req.params.id).populate({
        path: 'id_evento',
        select: 'titulo dataInicio images id_local',
        populate: {
            path: 'id_local',
            select: 'nome endereco'
        }
    });

    if (!bilhete) {
        return next(new ErrorResponse(`Bilhete não encontrado com o id ${req.params.id}`, 404));
    }

    // Verifica se o utilizador é o dono do bilhete ou um admin
    if (bilhete.id_usuario.toString() !== user._id.toString() && user.role !== 'admin') {
        return next(new ErrorResponse('Não autorizado a aceder a este bilhete', 403));
    }

    res.success(bilhete);
});

// @desc    Valida um bilhete usando o seu código único
// @route   POST /api/v1/bilhetes/validar
// @access  Privado (Admin, Organizador)
const validarBilhete = asyncHandler(async (req, res, next) => {
    const { codigoUnico } = req.body;

    if (!codigoUnico) {
        return next(new ErrorResponse('O código único do bilhete é obrigatório', 400));
    }

    const bilhete = await Bilhete.findOne({ codigoUnico }).populate('id_evento', 'titulo');

    if (!bilhete) {
        return next(new ErrorResponse(`Bilhete com código ${codigoUnico} não encontrado`, 404));
    }

    if (bilhete.estado === 'utilizado') {
        return next(new ErrorResponse(`Este bilhete já foi utilizado em ${bilhete.updatedAt.toLocaleString()}`, 409)); // 409 Conflict
    }

    if (bilhete.estado === 'cancelado') {
        return next(new ErrorResponse('Este bilhete foi cancelado', 400));
    }

    // Atualiza o estado para 'utilizado'
    bilhete.estado = 'utilizado';
    await bilhete.save();

    res.success({
        mensagem: 'Bilhete validado com sucesso!',
        bilhete: {
            evento: bilhete.id_evento.titulo,
            tipo: bilhete.tipo,
            validadoEm: bilhete.updatedAt
        }
    });
});


export {
    getMeusBilhetes,
    getBilheteById,
    validarBilhete
};