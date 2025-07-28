import mongoose from 'mongoose';

const pagamentoSchema = new mongoose.Schema({
    id_usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'O pagamento deve estar associado a um utilizador.']
    },
    id_tipoBilhete: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TipoBilhete',
        required: [true, 'O pagamento deve estar associado a um tipo de bilhete.']
    },
    id_evento: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Evento',
        required: [true, 'O pagamento deve estar associado a um evento.']
    },
    valorTotal: {
        type: Number,
        required: [true, 'O valor total do pagamento é obrigatório.'],
        min: 0
    },
    estado: {
        type: String,
        enum: ['pendente', 'concluído', 'falhado', 'reembolsado'],
        default: 'pendente',
        required: [true, 'O estado do pagamento é obrigatório.'],
        trim: true
    },
    metodoPagamento: {
        type: String,
        required: [true, 'O método de pagamento é obrigatório.'],
        trim: true
    },
    transacaoId: {
        type: String,
        unique: true,
        sparse: true,
        trim: true
    },
    quantidadeBilhetes: {
        type: Number,
        required: [true, 'A quantidade de bilhetes comprados é obrigatória.'],
        min: 1
    }
}, {
    timestamps: true 
});

export default mongoose.model('Pagamento', pagamentoSchema);
