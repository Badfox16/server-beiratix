import mongoose from 'mongoose';

const tipoBilheteSchema = new mongoose.Schema({
    id_evento: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Evento',
        required: true
    },
    tipo: {
        type: String,
        required: [true, 'O tipo de bilhete é obrigatório (ex: Normal, VIP).'],
        trim: true
    },
    preco: {
        type: Number,
        required: true,
        min: 0
    },
    quantidadeTotal: {
        type: Number,
        required: true,
        min: 0
    },
    quantidadeVendida: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

export default mongoose.model('TipoBilhete', tipoBilheteSchema);