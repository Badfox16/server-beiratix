import mongoose from 'mongoose';

const tipoBilheteSchema = new mongoose.Schema({
    id_evento: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Evento',
        required: true
    },
    nome: {
        type: String,
        required: [true, 'O nome do tipo de bilhete é obrigatório (ex: Normal, VIP).'],
        trim: true
    },
    descricao: {
        type: String,
        trim: true
    },
    preco: {
        type: Number,
        required: true,
        min: 0
    },
    moeda: {
        type: String,
        required: true,
        default: 'MZN'
    },
    quantidadeTotal: {
        type: Number,
        required: true,
        min: 0
    },
    quantidadeVendida: {
        type: Number,
        default: 0
    },
    maxPorCompra: {
        type: Number,
        min: 1,
        default: 10
    }
}, { timestamps: true });

export default mongoose.model('TipoBilhete', tipoBilheteSchema);