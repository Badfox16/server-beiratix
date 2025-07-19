const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const organizadorSchema = new Schema({
    nome: {
        type: String,
        required: [true, 'O nome do organizador é obrigatório.'],
        unique: true, // Garante que cada organizador tenha um nome único
        trim: true
    },
    emailContato: {
        type: String,
        required: [true, 'O email de contacto do organizador é obrigatório.'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/.+\@.+\..+/, 'Por favor, insira um email válido.']
    },
    telefoneContato: {
        type: String,
        trim: true
    },
    site: {
        type: String,
        trim: true,
        // Opcional: Adicionar validação de URL se necessário
        match: [/^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|[a-zA-Z0-9]+\.[^\s]{2,})$/, 'Por favor, insira um URL de site válido.']
    },
    descricao: {
        type: String,
        trim: true
    },  
}, {
    timestamps: true, // Adiciona `createdAt` e `updatedAt`
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// --- RELACIONAMENTO VIRTUAL COM EVENTOS ---
// Este campo 'eventosOrganizados' não será guardado na base de dados.
// É um campo virtual que cria a ligação entre um Organizador e todos os Eventos que ele organiza.
organizadorSchema.virtual('eventosOrganizados', {
    ref: 'Evento',           // O modelo a ser populado (o modelo Evento)
    localField: '_id',       // Encontra documentos no modelo Evento onde o...
    foreignField: 'id_organizador' // ...campo 'id_organizador' corresponde ao '_id' deste organizador.
});

module.exports = mongoose.model('Organizador', organizadorSchema);