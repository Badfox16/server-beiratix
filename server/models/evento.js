const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventoSchema = new Schema({
    titulo: {
        type: String,
        required: [true, 'O título do evento é obrigatório.'],
        trim: true
    },
    descricao: {
        type: String,
        required: [true, 'A descrição do evento é obrigatória.'],
        trim: true
    },
    id_local: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Local',
        required: [true, 'O local do evento é obrigatório.']
    },
    data: {
        type: Date,
        required: [true, 'A data do evento é obrigatória.']
    },
    horaInicio: {
        type: String,
        required: [true, 'A hora de início do evento é obrigatória.'],
        trim: true
    },
    horaFim: {
        type: String,
        trim: true
    },
    categoria: {
        type: mongoose.Schema.Types.ObjectId, // Agora referencia o ID de uma Categoria
        ref: 'Categoria',                   // Nome do modelo referenciado
        required: [true, 'A categoria é obrigatória.']
    },
    capacidadeReservada: {
        type: Number,
        default: 0,
        min: 0
    },
    imageUrl: {
        type: String,
        trim: true
    },
    criadoPor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Validação de hora de término
eventoSchema.pre('save', function (next) {
    if (this.horaInicio && this.horaFim) {
        const [hInicio, mInicio] = this.horaInicio.split(':').map(Number);
        const [hFim, mFim] = this.horaFim.split(':').map(Number);

        if (hFim < hInicio || (hFim === hInicio && mFim <= mInicio)) {
            next(new Error('A hora de término deve ser depois da hora de início.'));
        } else {
            next();
        }
    } else {
        next();
    }
});

// --- RELACIONAMENTO VIRTUAL COM BILHETES ---
// Este campo 'bilhetes' não será guardado na base de dados.
// É um campo virtual que cria a ligação entre um Evento e todos os Bilhetes disponíveis para ele.
eventoSchema.virtual('bilhetes', {
    ref: 'Bilhete',         // O modelo a ser populado (o modelo Bilhete)
    localField: '_id',      // Encontra documentos no modelo Bilhete onde o...
    foreignField: 'id_evento' // ...campo 'id_evento' corresponde ao '_id' deste evento.
});


module.exports = mongoose.model('Evento', eventoSchema);