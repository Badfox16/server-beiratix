import mongoose from 'mongoose';
import { randomBytes } from 'crypto';

const bilheteSchema = new mongoose.Schema({
    id_evento: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Evento',
        required: [true, 'O bilhete deve estar associado a um evento.']
    },
    id_pagamento: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pagamento',
        required: true
    },
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
    codigoUnico: {
        type: String,
        unique: true,
        required: true,
    },
    estado: {
        type: String,
        enum: ['válido', 'utilizado', 'cancelado'],
        default: 'válido'
    }
}, {
    timestamps: true
});

// Hook para gerar o código único antes de salvar
bilheteSchema.pre('validate', function(next) {
    if (this.isNew) {
        // Gera um código mais curto e legível
        this.codigoUnico = randomBytes(4).toString('hex').toUpperCase();
    }
    next();
});

export default mongoose.model('Bilhete', bilheteSchema);
