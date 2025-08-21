import asyncHandler from 'express-async-handler';
import Usuario from '@/models/usuario.js';

// Middleware para criar usuário automaticamente se não existir
const autoCreateUser = asyncHandler(async (req, res, next) => {
  // Só executar se houver dados de auth
  if (!req.auth || !req.auth.sub) {
    return next();
  }

  const auth0Id = req.auth.sub;
  console.log('=== AUTO CREATE USER ===');
  console.log('Verificando usuário com auth0Id:', auth0Id);

  try {
    // Verificar se usuário já existe
    let usuario = await Usuario.findOne({ auth0Id });
    
    if (!usuario) {
      console.log('✨ Usuário não existe, criando automaticamente...');
      
      // Dados básicos do Auth0 token
      const email = req.auth.payload?.email || `user-${auth0Id}@temp.com`;
      const name = req.auth.payload?.name || 'Usuário';
      
      // Criar novo usuário
      usuario = await Usuario.create({
        auth0Id: auth0Id,
        nome: name,
        email: email,
        telefone: null,
        role: 'utilizador' // Role padrão conforme o modelo
      });

      console.log('✅ Usuário criado com sucesso:', {
        id: usuario._id,
        auth0Id: usuario.auth0Id,
        nome: usuario.nome,
        email: usuario.email
      });
    } else {
      console.log('✅ Usuário já existe:', {
        id: usuario._id,
        auth0Id: usuario.auth0Id,
        nome: usuario.nome
      });
    }

    // Adicionar usuário ao request para uso posterior
    req.user = usuario;
    
  } catch (error) {
    console.error('❌ Erro ao criar/verificar usuário:', error);
    // Não falhar a requisição por causa disso, apenas logar
  }

  next();
});

export default autoCreateUser;
