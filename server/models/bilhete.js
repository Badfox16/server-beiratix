const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bilheteSchema = new Schema({
    // --- Referência ao Evento ---
    id_evento: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Evento',
        required: [true, 'O bilhete deve estar associado a um evento.']
    },
    tipo: {
        type: String,
        required: [true, 'O tipo de bilhete é obrigatório (ex: Normal, VIP, Estudante).'],
        trim: true
    },
    preco: {
        type: Number,
        required: [true, 'O preço do bilhete é obrigatório.'],
        min: 0
    },
    quantidadeDisponivel: {
        type: Number,
        required: [true, 'A quantidade disponível de bilhetes é obrigatória.'],
        min: 0,
        default: 0
    },
    descricao: {
        type: String,
        trim: true // Detalhes adicionais sobre o tipo de bilhete
    }
}, {
    timestamps: true // Adiciona createdAt e updatedAt
});

module.exports = mongoose.model('Bilhete', bilheteSchema);