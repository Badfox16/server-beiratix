const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pagamentoSchema = new Schema({
    // Referência ao utilizador que fez o pagamento
    id_usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'O pagamento deve estar associado a um utilizador.']
    },
    // --- CAMPO ALTERADO ---
    // Referência ao tipo de bilhete que foi comprado
    id_tipoBilhete: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TipoBilhete', // Referência correta
        required: [true, 'O pagamento deve estar associado a um tipo de bilhete.']
    },
    // Referência ao evento (continua útil para consultas diretas)
    id_evento: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Evento',
        required: [true, 'O pagamento deve estar associado a um evento.']
    },
    // Valor total pago
    valorTotal: {
        type: Number,
        required: [true, 'O valor total do pagamento é obrigatório.'],
        min: 0
    },
    // Estado do pagamento
    estado: {
        type: String,
        enum: ['pendente', 'concluído', 'falhado', 'reembolsado'],
        default: 'pendente',
        required: [true, 'O estado do pagamento é obrigatório.'],
        trim: true
    },
    // Método de pagamento
    metodoPagamento: {
        type: String,
        required: [true, 'O método de pagamento é obrigatório.'],
        trim: true
    },
    // ID da transação do provedor de pagamento
    transacaoId: {
        type: String,
        unique: true,
        sparse: true,
        trim: true
    },
    // Quantidade de bilhetes comprados nesta transação
    quantidadeBilhetes: {
        type: Number,
        required: [true, 'A quantidade de bilhetes comprados é obrigatória.'],
        min: 1
    }
}, {
    timestamps: true 
});

module.exports = mongoose.model('Pagamento', pagamentoSchema);