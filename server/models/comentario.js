import mongoose from 'mongoose';

const comentarioSchema = new mongoose.Schema({
    id_evento: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Evento',
        required: [true, 'O comentário deve estar associado a um evento.']
    },
    id_usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'O comentário deve ser feito por um utilizador.']
    },
    texto: {
        type: String,
        required: [true, 'O texto do comentário é obrigatório.'],
        trim: true
    },
    // Para suportar respostas a comentários (comentários aninhados)
    id_pai: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comentario',
        default: null // Um comentário de nível superior não tem pai
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual para popular as respostas a um comentário
comentarioSchema.virtual('respostas', {
    ref: 'Comentario',
    localField: '_id',
    foreignField: 'id_pai'
});


export default mongoose.model('Comentario', comentarioSchema);