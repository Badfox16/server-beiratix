import mongoose from 'mongoose';
import { randomBytes } from 'crypto'; // Módulo nativo do Node.js

const bilheteSchema = new mongoose.Schema({
    id_evento: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Evento',
        required: [true, 'O bilhete deve estar associado a um evento.']
    },
    // --- Campo Adicionado para identificar o bilhete individual ---
    id_pagamento: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pagamento',
        required: true
    },
    // --- Campo Adicionado para o comprador ---
    id_usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    tipo: {
        type: String,
        required: true,
        trim: true
    },
    preco: {
        type: Number,
        required: true,
        min: 0
    },
    // --- Campo para o código único do bilhete ---
    codigoUnico: {
        type: String,
        unique: true,
        required: true,
    },
    // --- Estado do bilhete ---
    estado: {
        type: String,
        enum: ['válido', 'utilizado', 'cancelado'],
        default: 'válido'
    }
}, {
    timestamps: true
});

export default mongoose.model('Bilhete', bilheteSchema);