import mongoose from 'mongoose';

const eventoSchema = new mongoose.Schema({
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
    id_organizador: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organizador',
        required: [true, 'O evento deve ter um organizador.']
    },
    id_local: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Local',
        required: [true, 'O local do evento é obrigatório.']
    },
    dataInicio: {
        type: Date,
        required: [true, 'A data e hora de início do evento são obrigatórias.']
    },
    dataFim: {
        type: Date,
        required: [true, 'A data e hora de fim do evento são obrigatórias.']
    },
    categoria: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categoria',
        required: [true, 'A categoria é obrigatória.']
    },
    images: {
        type: [String],
        default: []
    },
    featured: {
        type: Boolean,
        default: false
    },
    estado: {
        type: String,
        enum: ['disponível', 'quase-esgotado', 'esgotado', 'cancelado', 'adiado'],
        default: 'disponível'
    },
    avaliacao: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    destaques: {
        type: [String],
        default: []
    },
    faq: [{
        question: { type: String, required: true },
        answer: { type: String, required: true }
    }],
    mapCoordinates: {
        lat: { type: Number },
        lng: { type: Number }
    },
    tiposBilhete: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TipoBilhete'
    }],
    criadoPor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Validação de data de término
eventoSchema.pre('save', function (next) {
    if (this.dataInicio && this.dataFim && this.dataFim <= this.dataInicio) {
        next(new Error('A data de término deve ser posterior à data de início.'));
    } else {
        next();
    }
});

// Relação virtual com Bilhetes
eventoSchema.virtual('bilhetes', {
    ref: 'Bilhete',
    localField: '_id',
    foreignField: 'id_evento'
});

export default mongoose.model('Evento', eventoSchema);