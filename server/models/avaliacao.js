import mongoose from 'mongoose';
import Evento from './evento.js'; // Import Evento to use its methods

const avaliacaoSchema = new mongoose.Schema({
    id_evento: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Evento',
        required: [true, 'A avaliação deve estar associada a um evento.']
    },
    id_usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'A avaliação deve ser feita por um utilizador.']
    },
    classificacao: {
        type: Number,
        required: [true, 'A classificação é obrigatória.'],
        min: 1,
        max: 5
    },
    comentario: {
        type: String,
        trim: true
    }
}, {
    timestamps: true,
    // Garante que um utilizador só pode fazer uma avaliação por evento
    unique: true,
    index: {
        unique: true,
        fields: ['id_evento', 'id_usuario']
    }
});

// --- MÉTODOS ESTÁTICOS ---

// Método estático para calcular a classificação média de um evento
avaliacaoSchema.statics.calcularMediaClassificacoes = async function(eventoId) {
    const stats = await this.aggregate([
        {
            $match: { id_evento: eventoId }
        },
        {
            $group: {
                _id: '$id_evento',
                mediaClassificacao: { $avg: '$classificacao' }
            }
        }
    ]);

    try {
        if (stats.length > 0) {
            await Evento.findByIdAndUpdate(eventoId, {
                avaliacao: stats[0].mediaClassificacao.toFixed(1) // Arredonda para 1 casa decimal
            });
        } else {
            // Se não houver avaliações, a média volta a 0
            await Evento.findByIdAndUpdate(eventoId, {
                avaliacao: 0
            });
        }
    } catch (err) {
        console.error(err);
    }
};

// --- HOOKS ---

// Hook para chamar o método de cálculo da média depois de salvar uma avaliação
avaliacaoSchema.post('save', function() {
    this.constructor.calcularMediaClassificacoes(this.id_evento);
});

// Hook para chamar o método de cálculo da média antes de remover uma avaliação
avaliacaoSchema.post('remove', function() {
    this.constructor.calcularMediaClassificacoes(this.id_evento);
});


export default mongoose.model('Avaliacao', avaliacaoSchema);