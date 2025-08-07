import Usuario from '@/models/usuario.js';
import asyncHandler from 'express-async-handler';
import axios from 'axios';

// Middleware para sincronizar usuário do Auth0 com MongoDB
const syncUser = asyncHandler(async (req, res, next) => {
    // O sub está em req.auth.payload.sub (não req.auth.sub)
    if (req.auth && req.auth.payload && req.auth.payload.sub) {
        const auth0Id = req.auth.payload.sub;
          try {
            // Verifica se o usuário já existe no banco
            let usuario = await Usuario.findOne({ auth0Id });
            
            if (!usuario) {
                // Busca informações do usuário no Auth0
                let userInfo = {};
                try {
                    const response = await axios.get(`${process.env.AUTH0_ISSUER_BASE_URL}userinfo`, {
                        headers: {
                            'Authorization': `Bearer ${req.auth.token}`
                        }
                    });
                    userInfo = response.data;
                } catch (authError) {
                    // Silently continue without Auth0 userinfo if it fails
                }                  // Se não existe, cria o usuário com dados básicos do Auth0
                const userData = {
                    auth0Id,
                    nome: userInfo.name || userInfo.nickname || req.auth.payload.name || req.auth.payload.nickname || 'Usuário',
                    email: userInfo.email || req.auth.payload.email || `${auth0Id}@temp.com`,
                    role: 'utilizador' // role padrão
                };
                
                // Promove automaticamente alguns usuários específicos a admin (apenas para desenvolvimento)
                const adminEmails = ['murizomaita@gmail.com'];
                if (adminEmails.includes(userData.email)) {
                    userData.role = 'admin';
                }
                
                // Adiciona telefone se disponível
                if (userInfo.phone_number || req.auth.payload.phone_number) {
                    userData.telefone = userInfo.phone_number || req.auth.payload.phone_number;
                }
                
                usuario = await Usuario.create(userData);
            }
            
            // Adiciona o usuário ao request para uso posterior
            req.user = usuario;        } catch (error) {
            console.error('Erro ao sincronizar usuário:', error);
            // Não bloqueia a requisição se houver erro na sincronização
        }
    }
    
    next();
});

export default syncUser;
