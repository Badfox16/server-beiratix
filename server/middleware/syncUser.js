import Usuario from '@/models/usuario.js';
import asyncHandler from 'express-async-handler';

// Middleware para sincronizar usuário do Auth0 com MongoDB
const syncUser = asyncHandler(async (req, res, next) => {
    if (req.auth && req.auth.payload && req.auth.payload.sub) {
        const auth0Id = req.auth.payload.sub;
        
        console.log('=== SYNC USER ===');
        console.log('Auth0 payload completo:', req.auth.payload);
        
        try {
            // Verifica se o usuário já existe no banco
            let usuario = await Usuario.findOne({ auth0Id });
            
            if (!usuario) {
                // Se não existe, cria o usuário com dados básicos do Auth0
                const userData = {
                    auth0Id,
                    nome: req.auth.payload.name || 
                          req.auth.payload.nickname || 
                          req.auth.payload.given_name ||
                          req.auth.payload.family_name ||
                          (req.auth.payload.email && req.auth.payload.email.split('@')[0]) ||
                          'Usuário',
                    email: req.auth.payload.email || `${auth0Id}@temp.com`,
                    role: 'utilizador' // role padrão
                };
                
                console.log('Criando usuário com dados:', userData);
                
                // Adiciona telefone se disponível
                if (req.auth.payload.phone_number) {
                    userData.telefone = req.auth.payload.phone_number;
                }
                
                usuario = await Usuario.create(userData);
                console.log('Usuário criado:', usuario);
            } else {
                console.log('Usuário já existe:', usuario);
            }
            
            // Adiciona o usuário ao request para uso posterior
            req.user = usuario;
        } catch (error) {
            console.error('Erro ao sincronizar usuário:', error);
            // Não bloqueia a requisição se houver erro na sincronização
        }
    }
    
    next();
});

export default syncUser;
