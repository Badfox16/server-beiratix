import { Schema as _Schema, model } from 'mongoose';
const Schema = _Schema;

const categoriaSchema = new Schema({
    nome: {
        type: String,
        required: [true, 'O nome da categoria é obrigatório.'],
        unique: true,
        trim: true
    },
    icon: {
        type: String,
        required: [true, 'O ícone da categoria é obrigatório.'],
        trim: true
    }
}, {
    timestamps: true
});

export default model('Categoria', categoriaSchema);