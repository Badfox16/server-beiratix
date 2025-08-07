import Usuario from '@/models/usuario.js';
import asyncHandler from 'express-async-handler';

// Middleware para sincronizar usuário do Auth0 com MongoDB
const syncUser = asyncHandler(async (req, res, next) => {
    console.log('🔍 [syncUser] Middleware iniciado');
    
    if (req.auth && req.auth.payload && req.auth.payload.sub) {
        const auth0Id = req.auth.payload.sub;
        console.log('🔑 [syncUser] Auth0 ID encontrado:', auth0Id);
        console.log('📧 [syncUser] Email do Auth0:', req.auth.payload.email);
        console.log('👤 [syncUser] Nome do Auth0:', req.auth.payload.name || req.auth.payload.nickname);
        
        try {
            // Verifica se o usuário já existe no banco
            let usuario = await Usuario.findOne({ auth0Id });
            
            if (!usuario) {
                console.log('➕ [syncUser] Usuário não existe, criando novo...');                // Se não existe, cria o usuário com dados básicos do Auth0
                const userData = {
                    auth0Id,
                    nome: req.auth.payload.name || req.auth.payload.nickname || 'Usuário',
                    email: req.auth.payload.email || `${auth0Id}@temp.com`,
                    role: 'utilizador' // role padrão
                };
                
                // Adiciona telefone se disponível
                if (req.auth.payload.phone_number) {
                    userData.telefone = req.auth.payload.phone_number;
                }
                
                usuario = await Usuario.create(userData);
                console.log('✅ [syncUser] Novo usuário criado:', {
                    id: usuario._id,
                    nome: usuario.nome,
                    email: usuario.email,
                    role: usuario.role
                });
            } else {
                console.log('✅ [syncUser] Usuário existente encontrado:', {
                    id: usuario._id,
                    nome: usuario.nome,
                    email: usuario.email,
                    role: usuario.role
                });
            }
            
            // Adiciona o usuário ao request para uso posterior
            req.user = usuario;
            console.log('📝 [syncUser] Usuário adicionado ao req.user');
        } catch (error) {
            console.error('❌ [syncUser] Erro ao sincronizar usuário:', error);
            // Não bloqueia a requisição se houver erro na sincronização
        }
    } else {
        console.log('⚠️ [syncUser] Nenhum auth ou sub encontrado no request');
        console.log('🔍 [syncUser] req.auth:', req.auth);
    }
    
    console.log('➡️ [syncUser] Middleware finalizado, passando para próximo');
    next();
});

export default syncUser;
