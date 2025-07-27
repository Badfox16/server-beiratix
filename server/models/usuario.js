import mongoose from 'mongoose';

const usuarioSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: [true, 'O nome é obrigatório.'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'O email é obrigatório.'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/.+\@.+\..+/, 'Por favor, insira um email válido.']
    },
    telefone: {
        type: String,
        unique: true,
        sparse: true,
        trim: true
    },
    auth0Id: {
        type: String,
        required: [true, 'O ID do Auth0 é obrigatório.'],
        unique: true
    }
}, {
    timestamps: true
});

export default mongoose.model('Usuario', usuarioSchema);