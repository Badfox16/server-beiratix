
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { faker } from '@faker-js/faker';
import { connectToDatabase } from './config/db.js';

// Carregar as variáveis de ambiente
dotenv.config({ path: './.env' });

// Importar os modelos
import Categoria from './models/categoria.js';
import Usuario from './models/usuario.js';
import Organizador from './models/organizador.js';
import Local from './models/local.js';
import Evento from './models/evento.js';
import TipoBilhete from './models/tipoBilhete.js';
import Pagamento from './models/pagamento.js';
import Bilhete from './models/bilhete.js';


// --- FUNÇÃO PARA DESTRUIR DADOS ---
const destroyData = async () => {
    try {
        // A ordem é importante para evitar erros de referência
        await Bilhete.deleteMany();
        await Pagamento.deleteMany();
        await TipoBilhete.deleteMany();
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
            { nome: 'Música', icon: 'music' },
            { nome: 'Conferência', icon: 'briefcase' },
            { nome: 'Desporto', icon: 'football' },
            { nome: 'Teatro & Cultura', icon: 'masks-theater' },
            { nome: 'Comida & Bebida', icon: 'utensils' },
        ]);
        console.log('Categorias criadas.');

        // 2. Criar Utilizadores
        const usuarios = [];
        for (let i = 0; i < 10; i++) {
            usuarios.push({
                nome: faker.person.fullName(),
                email: faker.internet.email().toLowerCase(),
                auth0Id: `auth0|${faker.string.uuid()}`,
                telefone: faker.phone.number(),
                role: i === 0 ? 'admin' : 'utilizador', // O primeiro user é admin
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

        // 4. Criar Locais
        const locais = [];
        for (let i = 0; i < 5; i++) {
            locais.push({
                nome: `${faker.company.name()} Arena`,
                descricao: faker.lorem.sentence({ min: 20, max: 40 }),
                endereco: faker.location.streetAddress({ useFullAddress: true }),
                tipo: faker.helpers.arrayElement(['Estádio', 'Sala de Concertos', 'Centro de Convenções', 'Teatro']),
                capacidade: faker.number.int({ min: 100, max: 5000 }),
                imagens: [faker.image.urlLoremFlickr({ category: 'city' })],
            });
        }
        const locaisCriados = await Local.insertMany(locais);
        console.log('Locais criados.');

        // 5. Criar Eventos e Tipos de Bilhete associados
        const eventos = [];
        for (let i = 0; i < 10; i++) {
            const dataInicio = faker.date.future({ years: 1 });
            const dataFim = new Date(dataInicio.getTime() + faker.number.int({ min: 2, max: 8 }) * 60 * 60 * 1000); // Adiciona entre 2 a 8 horas

            const evento = new Evento({
                titulo: faker.lorem.words({ min: 3, max: 6 }),
                descricao: faker.lorem.paragraph({ min: 3, max: 5 }),
                id_organizador: organizadoresCriados[i % organizadoresCriados.length]._id,
                id_local: locaisCriados[i % locaisCriados.length]._id,
                dataInicio,
                dataFim,
                categoria: categorias[i % categorias.length]._id,
                images: [faker.image.urlLoremFlickr({ category: 'party' })],
                featured: faker.datatype.boolean(0.3), // 30% de chance de ser featured
                criadoPor: usuariosCriados[0]._id, // Admin cria todos os eventos
                mapCoordinates: {
                    lat: faker.location.latitude(),
                    lng: faker.location.longitude(),
                }
            });

            // 6. Criar Tipos de Bilhete para este Evento
            const tiposBilheteParaEvento = await TipoBilhete.insertMany([
                {
                    id_evento: evento._id,
                    nome: 'Normal',
                    descricao: 'Acesso geral ao evento.',
                    preco: faker.number.int({ min: 250, max: 1000 }),
                    quantidadeTotal: faker.number.int({ min: 100, max: 300 }),
                },
                {
                    id_evento: evento._id,
                    nome: 'VIP',
                    descricao: 'Acesso à área VIP com benefícios exclusivos.',
                    preco: faker.number.int({ min: 1500, max: 5000 }),
                    quantidadeTotal: faker.number.int({ min: 20, max: 80 }),
                }
            ]);
            console.log(`Tipos de bilhete criados para o evento: ${evento.titulo}`);

            // Associar os IDs dos tipos de bilhete ao evento
            evento.tiposBilhete = tiposBilheteParaEvento.map(tb => tb._id);
            eventos.push(evento);
        }
        const eventosCriados = await Evento.bulkSave(eventos); // Usar bulkSave para salvar os eventos já com os IDs dos bilhetes
        console.log('Eventos criados e associados aos tipos de bilhete.');

        // 7. Simular Pagamentos e criar Bilhetes
        for(let i = 0; i < 15; i++) {
            const eventoAleatorio = faker.helpers.arrayElement(eventos);
            const tipoBilheteAleatorio = await TipoBilhete.findById(faker.helpers.arrayElement(eventoAleatorio.tiposBilhete));
            const utilizadorAleatorio = faker.helpers.arrayElement(usuariosCriados);
            const quantidade = faker.number.int({ min: 1, max: 4 });

            // Simular um pagamento
            const pagamento = await Pagamento.create({
                id_usuario: utilizadorAleatorio._id,
                id_tipoBilhete: tipoBilheteAleatorio._id,
                id_evento: eventoAleatorio._id,
                valorTotal: tipoBilheteAleatorio.preco * quantidade,
                estado: 'concluído',
                metodoPagamento: faker.helpers.arrayElement(['M-Pesa', 'Cartão de Crédito', 'Transferência']),
                transacaoId: faker.string.alphanumeric(12).toUpperCase(),
                quantidadeBilhetes: quantidade,
            });

            // Criar os bilhetes individuais para esse pagamento
            const bilhetesParaPagamento = [];
            for (let j = 0; j < quantidade; j++) {
                bilhetesParaPagamento.push({
                    id_evento: eventoAleatorio._id,
                    id_pagamento: pagamento._id,
                    id_usuario: utilizadorAleatorio._id,
                    tipo: tipoBilheteAleatorio.nome,
                    preco: tipoBilheteAleatorio.preco,
                });
            }
            await Bilhete.insertMany(bilhetesParaPagamento);

            // Atualizar a contagem de bilhetes vendidos
            await TipoBilhete.findByIdAndUpdate(tipoBilheteAleatorio._id, {
                $inc: { quantidadeVendida: quantidade }
            });
        }
        console.log('Pagamentos e Bilhetes de simulação criados.');

        console.log('Importação de dados concluída com sucesso!');

    } catch (error) {
        console.error('Erro ao importar dados:', error);
        process.exit(1);
    }
};

// --- LÓGICA DE EXECUÇÃO ---
const run = async () => {
    await connectToDatabase();

    if (process.argv[2] === '-d') {
        await destroyData();
    } else {
        await importData();
    }

    await mongoose.disconnect();
    console.log('MongoDB desconectado.');
    process.exit();
};

run();
