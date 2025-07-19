import { connectToDatabase } from './config/db';

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { faker } = require('@faker-js/faker');

// Carregar as variáveis de ambiente do ficheiro .env
dotenv.config();

// Importar os modelos Mongoose
const Categoria = require('./models/categoria');
const Usuario = require('./models/usuario');
const Organizador = require('./models/organizador');
const Local = require('./models/local');
const Evento = require('./models/evento');
const Bilhete = require('./models/bilhete');
const Pagamento = require('./models/pagamento');

// --- FUNÇÃO PARA DESTRUIR DADOS ---
const destroyData = async () => {
    try {
        // Apaga em ordem para evitar problemas de referência, embora não seja estritamente necessário para apagar
        await Pagamento.deleteMany();
        await Bilhete.deleteMany();
        await Evento.deleteMany();
        await Local.deleteMany();
        await Categoria.deleteMany();
        await Organizador.deleteMany();
        await Usuario.deleteMany();

        console.log('Dados destruídos com sucesso.');
    } catch (error) {
        console.error('Erro ao destruir dados:', error);
        process.exit(1);
    }
};

// --- FUNÇÃO PARA IMPORTAR DADOS ---
const importData = async () => {
    try {
        await destroyData(); // Limpa os dados antigos primeiro

        // 1. Criar Categorias
        const categorias = await Categoria.insertMany([
            { nome: 'Música', descricao: 'Eventos musicais, concertos e festivais.', tipo: 'evento' },
            { nome: 'Conferência', descricao: 'Palestras, workshops e conferências profissionais.', tipo: 'evento' },
            { nome: 'Desporto', descricao: 'Jogos, competições e eventos desportivos.', tipo: 'evento' },
            { nome: 'Sala de Concertos', descricao: 'Espaços para música ao vivo.', tipo: 'local' },
            { nome: 'Centro de Convenções', descricao: 'Grandes espaços para feiras e conferências.', tipo: 'local' },
        ]);
        console.log('Categorias criadas.');

        // 2. Criar Utilizadores
        const usuarios = [];
        for (let i = 0; i < 10; i++) {
            usuarios.push({
                nome: faker.person.fullName(),
                email: faker.internet.email().toLowerCase(),
                senha: 'senha123', // Lembre-se da recomendação de usar bcrypt! O seeder usa texto simples para simplicidade.
                telefone: faker.phone.number(),
            });
        }
        const usuariosCriados = await Usuario.insertMany(usuarios);
        console.log('Utilizadores criados.');

        // 3. Criar Organizadores
        const organizadores = [];
        for (let i = 0; i < 3; i++) {
            organizadores.push({
                nome: faker.company.name(),
                emailContato: faker.internet.email().toLowerCase(),
                telefoneContato: faker.phone.number(),
                site: faker.internet.url(),
                descricao: faker.company.catchPhrase(),
            });
        }
        const organizadoresCriados = await Organizador.insertMany(organizadores);
        console.log('Organizadores criados.');

        // 4. Criar Locais (usando IDs de categorias de 'local')
        const categoriaLocal = categorias.find(c => c.tipo === 'local' || c.tipo === 'ambos');
        const locais = [];
        for (let i = 0; i < 5; i++) {
            locais.push({
                nome: `${faker.company.name()} Hall`,
                descricao: faker.lorem.sentence(),
                endereco: faker.location.streetAddress({ useFullAddress: true }),
                categoria: categoriaLocal._id,
                capacidade: faker.number.int({ min: 100, max: 5000 }),
                imagemUrl: faker.image.urlLoremFlickr({ category: 'city' }),
            });
        }
        const locaisCriados = await Local.insertMany(locais);
        console.log('Locais criados.');

        // 5. Criar Eventos
        const categoriaEvento = categorias.find(c => c.tipo === 'evento' || c.tipo === 'ambos');
        const eventos = [];
        for (let i = 0; i < 10; i++) {
            const dataEvento = faker.date.future({ years: 1 });
            eventos.push({
                titulo: faker.music.songName(),
                descricao: faker.lorem.paragraph(),
                id_local: locaisCriados[i % locaisCriados.length]._id,
                data: dataEvento,
                horaInicio: '19:00',
                horaFim: '23:00',
                categoria: categoriaEvento._id,
                imageUrl: faker.image.urlLoremFlickr({ category: 'music' }),
                criadoPor: usuariosCriados[i % usuariosCriados.length]._id,
            });
        }
        const eventosCriados = await Evento.insertMany(eventos);
        console.log('Eventos criados.');

        // 6. Criar Bilhetes para cada Evento
        let bilhetes = [];
        for (const evento of eventosCriados) {
            bilhetes.push({
                id_evento: evento._id,
                tipo: 'Normal',
                preco: faker.number.int({ min: 250, max: 1000 }),
                quantidadeDisponivel: faker.number.int({ min: 50, max: 200 }),
                descricao: 'Acesso geral ao evento.',
            });
            bilhetes.push({
                id_evento: evento._id,
                tipo: 'VIP',
                preco: faker.number.int({ min: 1500, max: 5000 }),
                quantidadeDisponivel: faker.number.int({ min: 10, max: 50 }),
                descricao: 'Acesso à área VIP, com bebida de boas-vindas.',
            });
        }
        const bilhetesCriados = await Bilhete.insertMany(bilhetes);
        console.log('Bilhetes criados.');
        
        // 7. Simular alguns Pagamentos (opcional)
        const pagamentos = [];
        for(let i=0; i<5; i++){
            const bilheteAleatorio = bilhetesCriados[faker.number.int({min: 0, max: bilhetesCriados.length - 1})];
            const utilizadorAleatorio = usuariosCriados[faker.number.int({min: 0, max: usuariosCriados.length - 1})];
            const quantidade = faker.number.int({ min: 1, max: 4 });

            pagamentos.push({
                id_usuario: utilizadorAleatorio._id,
                id_bilhete: bilheteAleatorio._id,
                id_evento: bilheteAleatorio.id_evento,
                valorTotal: bilheteAleatorio.preco * quantidade,
                estado: 'concluído',
                metodoPagamento: 'M-Pesa',
                transacaoId: faker.string.alphanumeric(12).toUpperCase(),
                quantidadeBilhetes: quantidade,
            });
        }
        await Pagamento.insertMany(pagamentos);
        console.log('Pagamentos de simulação criados.');


        console.log('Importação de dados concluída com sucesso!');

    } catch (error) {
        console.error('Erro ao importar dados:', error);
        process.exit(1);
    }
};

// --- LÓGICA DE EXECUÇÃO ---
const run = async () => {
    await connectToDatabase();

    if (process.argv[2] === '-d') { // Se o argumento for '-d', destrói os dados
        await destroyData();
    } else { // Caso contrário, importa os dados
        await importData();
    }

    await mongoose.disconnect();
    console.log('MongoDB desconectado.');
    process.exit();
};

run();