const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usuarioSchema = new Schema({
    nome: {
        type: String,
        required: [true, 'O nome é obrigatório.'],
        trim: true // Remove espaços em branco no início e no fim
    },
    email: {
        type: String,
        required: [true, 'O email é obrigatório.'],
        unique: true, // Garante que cada email seja único na base de dados
        trim: true,
        lowercase: true, // Converte o email para letras minúsculas antes de salvar
        match: [/.+\@.+\..+/, 'Por favor, insira um email válido.']
    },
    // --- CAMPO ADICIONADO ---
    telefone: {
        type: String,
        unique: true, // Garante que o número de telefone também seja único
        sparse: true, // Permite que o campo seja nulo para vários utilizadores, sem violar a regra "unique"
        trim: true
    },
    senha: {
        type: String,
        required: [true, 'A senha é obrigatória.']
    }
}, {
    // Adiciona os campos `createdAt` e `updatedAt` automaticamente
    timestamps: true
});

module.exports = mongoose.model('Usuario', usuarioSchema);