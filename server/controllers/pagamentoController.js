import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import qrcode from 'qrcode';
import { randomBytes } from 'crypto';
import ErrorResponse from '@/utils/errorResponse.js';
import Pagamento from '@/models/pagamento.js';
import TipoBilhete from '@/models/tipoBilhete.js';
import Bilhete from '@/models/bilhete.js';
import Usuario from '@/models/usuario.js';

// @desc    Processa a compra de um ou mais bilhetes
// @route   POST /api/v1/pagamentos/comprar
// @access  Privado
const processarCompraBilhete = asyncHandler(async (req, res, next) => {
    const { id_tipoBilhete, quantidade, metodoPagamento } = req.body;
    const id_usuario_jwt = req.auth.sub; // Padrão do express-oauth2-jwt-bearer

    console.log('=== INICIAR PROCESSAR COMPRA BILHETE ===');
    
    // Verificar se o usuário foi sincronizado pelo middleware
    if (!req.user) {
        console.log('❌ Usuário não encontrado após syncUser middleware');
        return next(new ErrorResponse('Utilizador não encontrado.', 401));
    }
    
    console.log('✅ Usuário autenticado:', {
        id: req.user._id,
        nome: req.user.nome,
        email: req.user.email
    });
    
    const id_usuario = req.user._id;

    const tipoBilhete = await TipoBilhete.findById(id_tipoBilhete);

    if (!tipoBilhete) {
        return next(new ErrorResponse(`Tipo de bilhete com ID ${id_tipoBilhete} não encontrado.`, 404));
    }

    // 1. Verificar stock
    const stockDisponivel = tipoBilhete.quantidadeTotal - tipoBilhete.quantidadeVendida;
    if (stockDisponivel < quantidade) {
        return next(new ErrorResponse(`Stock insuficiente. Apenas ${stockDisponivel} bilhetes disponíveis.`, 400));
    }

    // 2. Verificar limite por compra
    if (quantidade > tipoBilhete.maxPorCompra) {
        return next(new ErrorResponse(`A quantidade máxima por compra é ${tipoBilhete.maxPorCompra}.`, 400));
    }

    const valorTotal = tipoBilhete.preco * quantidade;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // 3. Criar o registo de pagamento
        const pagamento = (await Pagamento.create([{
            id_usuario,
            id_tipoBilhete,
            id_evento: tipoBilhete.id_evento,
            valorTotal,
            metodoPagamento,
            quantidadeBilhetes: quantidade,
            estado: 'concluído'
        }], { session }))[0];

        // 4. Atualizar o stock do tipo de bilhete
        await TipoBilhete.findByIdAndUpdate(id_tipoBilhete, {
            $inc: { quantidadeVendida: quantidade }
        }, { new: true, session });

        // 5. Criar os bilhetes individuais com QR Code
        const bilhetesParaCriar = [];
        for (let i = 0; i < quantidade; i++) {
            const codigoUnico = randomBytes(4).toString('hex').toUpperCase();
            const qrCodeDataURL = await qrcode.toDataURL(codigoUnico);

            bilhetesParaCriar.push({
                id_evento: tipoBilhete.id_evento,
                id_pagamento: pagamento._id,
                id_usuario,
                tipo: tipoBilhete.nome,
                preco: tipoBilhete.preco,
                codigoUnico,
                qrCode: qrCodeDataURL
            });
        }
        const bilhetesCriados = await Bilhete.insertMany(bilhetesParaCriar, { session });

        await session.commitTransaction();
        session.endSession();

        res.success({
            pagamento,
            bilhetes: bilhetesCriados
        }, 201);

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error('Erro na transação de compra:', error);
        next(new ErrorResponse('A transação falhou. Tente novamente.', 500));
    }
});


// --- Funções existentes ---

// @desc    Cria um novo pagamento (inicia o processo)
// @route   POST /api/v1/pagamentos
// @access  Privado
const createPagamento = asyncHandler(async (req, res, next) => {
    // Lógica para criar e processar o pagamento
    // Isso pode envolver a comunicação com um gateway de pagamento externo
    const pagamento = await Pagamento.create(req.body);
    res.success(pagamento, 201);
});

// @desc    Retorna o histórico de pagamentos do utilizador autenticado
// @route   GET /api/v1/pagamentos/historico
// @access  Privado
const getHistoricoPagamentos = asyncHandler(async (req, res, next) => {
    const id_usuario_jwt = req.auth.sub;

    // Verificar se o usuário foi sincronizado pelo middleware
    if (!req.user) {
        return next(new ErrorResponse('Utilizador não encontrado.', 401));
    }

    const id_usuario = req.user._id;

    const pagamentos = await Pagamento.find({ id_usuario })
        .populate({
            path: 'id_evento',
            select: 'titulo dataInicio images descricao'
        })
        .populate({
            path: 'id_tipoBilhete',
            select: 'nome preco'
        })
        .sort({ createdAt: -1 });

    res.success(pagamentos);
});

// @desc    Retorna um pagamento específico
// @route   GET /api/v1/pagamentos/:id
// @access  Privado
const getPagamentoById = asyncHandler(async (req, res, next) => {
    const pagamento = await Pagamento.findById(req.params.id);
    if (!pagamento) {
        return next(new ErrorResponse(`Pagamento não encontrado com o id ${req.params.id}`, 404));
    }
    res.success(pagamento);
});

// @desc    Manipula webhooks de pagamento
// @route   POST /api/v1/pagamentos/webhook
// @access  Público (geralmente, mas com verificação de assinatura)
const handlePagamentoWebhook = asyncHandler(async (req, res, next) => {
    // Lógica para processar o webhook do provedor de pagamento
    console.log('Webhook recebido:', req.body);
    res.success({ status: 'recebido' });
});


export {
    processarCompraBilhete,
    createPagamento,
    getPagamentoById,
    getHistoricoPagamentos,
    handlePagamentoWebhook
};
