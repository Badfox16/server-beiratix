import { Schema as _Schema, model } from 'mongoose';
const Schema = _Schema;

const localSchema = new Schema({
    nome: {
        type: String,
        required: [true, 'O nome do local é obrigatório.'],
        trim: true
    },
    // --- CAMPO ADICIONADO (substituindo 'outros_detalhes') ---
    descricao: {
        type: String,
        required: [true, 'A descrição é obrigatória.'],
        trim: true
    },
    endereco: {
        type: String,
        required: [true, 'O endereço é obrigatório.'],
        trim: true
    },
    categoria: {
        type: _Schema.Types.ObjectId, // Agora referencia o ID de uma Categoria
        ref: 'Categoria',                   // Nome do modelo referenciado
        required: [true, 'A categoria é obrigatória.']
    },
    capacidade: {
        type: Number,
        min: 0
    },
    imagemUrl: {
        type: String,
        trim: true
    }
}, {
    // Opções do Schema
    timestamps: true,
    // Configuração para incluir os campos virtuais quando o documento for convertido para JSON ou Object
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// --- RELACIONAMENTO VIRTUAL COM EVENTOS ---
// Este campo 'eventos' não será guardado na base de dados.
// É um campo virtual que cria a ligação entre um Local e todos os Eventos que acontecem nele.
localSchema.virtual('eventos', {
    ref: 'Evento',           // O modelo a ser populado (o modelo Evento)
    localField: '_id',         // Encontra documentos no modelo Evento onde o...
    foreignField: 'id_local' // ...campo 'id_local' corresponde ao '_id' deste local.
});


export default model('Local', localSchema);