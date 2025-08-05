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
    qrCode: {
        type: String, // Armazenará o QR code como uma string Base64 (Data URL)
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

export default mongoose.model('Bilhete', bilheteSchema);
