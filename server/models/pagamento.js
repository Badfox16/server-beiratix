import { Schema as _Schema, model } from 'mongoose';
const Schema = _Schema;

const pagamentoSchema = new Schema({
    // Referência ao utilizador que fez o pagamento
    id_usuario: {
        type: _Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'O pagamento deve estar associado a um utilizador.']
    },
    // Referência ao bilhete específico que foi comprado
    id_bilhete: {
        type: _Schema.Types.ObjectId,
        ref: 'Bilhete',
        required: [true, 'O pagamento deve estar associado a um bilhete.']
    },
    // Referência ao evento (opcional, pois já temos via bilhete, mas pode ser útil para consultas diretas)
    id_evento: {
        type: _Schema.Types.ObjectId,
        ref: 'Evento',
        required: [true, 'O pagamento deve estar associado a um evento.']
    },
    // Valor total pago (pode ser diferente do preço do bilhete se houver descontos, taxas, etc.)
    valorTotal: {
        type: Number,
        required: [true, 'O valor total do pagamento é obrigatório.'],
        min: 0
    },
    // Estado do pagamento (pendente, concluído, falhado, reembolsado)
    estado: {
        type: String,
        enum: ['pendente', 'concluído', 'falhado', 'reembolsado'],
        default: 'pendente',
        required: [true, 'O estado do pagamento é obrigatório.'],
        trim: true
    },
    // Método de pagamento (cartão de crédito, M-Pesa, e-Mola, etc.)
    metodoPagamento: {
        type: String,
        required: [true, 'O método de pagamento é obrigatório.'],
        trim: true
    },
    // Data/hora da transação (timestamps do schema já cobrem isso, mas pode ser útil para um campo específico de transação)
    dataPagamento: {
        type: Date,
        default: Date.now // Define a data de pagamento para o momento da criação, pode ser atualizada
    },
    // ID da transação do provedor de pagamento (ex: Stripe, PayPal, M-Pesa transaction ID)
    transacaoId: {
        type: String,
        unique: true,
        sparse: true, // Permite nulos se a transação falhar ou não tiver ID externo
        trim: true
    },
    // Quantidade de bilhetes comprados nesta transação (se um pagamento puder comprar múltiplos do mesmo tipo de bilhete)
    quantidadeBilhetes: {
        type: Number,
        required: [true, 'A quantidade de bilhetes comprados é obrigatória.'],
        min: 1
    }
}, {
    timestamps: true // Adiciona `createdAt` e `updatedAt`
});

export default model('Pagamento', pagamentoSchema);