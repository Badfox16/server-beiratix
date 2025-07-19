const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categoriaSchema = new Schema({
    nome: {
        type: String,
        required: [true, 'O nome da categoria é obrigatório.'],
        unique: true, // Garante nomes de categorias únicos
        trim: true
    },
    // Opcional: Para descrever o que a categoria representa
    descricao: {
        type: String,
        trim: true
    },
    // Opcional: Se as categorias podem ser para locais, eventos ou ambos
    tipo: {
        type: String,
        enum: ['local', 'evento', 'ambos'],
        default: 'ambos',
        trim: true
    }
}, {
    timestamps: true // Adiciona `createdAt` e `updatedAt`
});

module.exports = mongoose.model('Categoria', categoriaSchema);