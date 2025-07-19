import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

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
    senha: {
        type: String,
        required: [true, 'A senha é obrigatória.'],
        select: false // Não inclui a senha por defeito nas queries
    }
}, {
    timestamps: true
});

// Middleware (hook) para fazer o hash da senha ANTES de salvar
usuarioSchema.pre('save', async function(next) {
    // Só faz o hash se a senha foi modificada (ou é nova)
    if (!this.isModified('senha')) {
        return next();
    }
    // Gera o "salt" e faz o hash da senha
    const salt = await bcrypt.genSalt(10);
    this.senha = await bcrypt.hash(this.senha, salt);
    next();
});

// Método para comparar a senha fornecida com a senha na base de dados
usuarioSchema.methods.compararSenha = async function(senhaFornecida) {
    return await bcrypt.compare(senhaFornecida, this.senha);
};

export default mongoose.model('Usuario', usuarioSchema);