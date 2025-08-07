import express from 'express';
import {
    getCurrentUser,
    updateCurrentUser,
    createUsuario,
    getAllUsuarios,
    getUserStats,
    getUsuarioById,
    updateUsuario,
    deleteUsuario
} from '@/controllers/usuarioController.js';
import checkJwt from '@/middleware/authMiddleware.js';
import syncUser from '@/middleware/syncUser.js';
import { validateCreateUsuario, validateUpdateUsuario } from '@/validators/usuarioValidators.js';
import handleValidationErrors from '@/middleware/handleValidationErrors.js';
import advancedResults from '@/middleware/advancedResults.js';
import Usuario from '@/models/usuario.js';

const router = express.Router();

// @desc    Perfil do usuário atual
// @route   GET, PUT /api/v1/usuarios/me
router.route('/me')
    .get(checkJwt, syncUser, getCurrentUser)
    .put(checkJwt, syncUser, updateCurrentUser);

// @desc    Estatísticas dos usuários
// @route   GET /api/v1/usuarios/stats
router.route('/stats')
    .get(checkJwt, syncUser, getUserStats);

// @desc    Cria ou obtém todos os utilizadores
// @route   POST, GET /api/v1/usuarios
router.route('/')
    .post(checkJwt, validateCreateUsuario, handleValidationErrors, createUsuario)
    .get(checkJwt, syncUser, advancedResults(Usuario), getAllUsuarios);

// @desc    Obtém, atualiza ou apaga um utilizador por ID
// @route   GET, PUT, DELETE /api/v1/usuarios/:id
router.route('/:id')
    .get(checkJwt, syncUser, getUsuarioById)
    .put(checkJwt, syncUser, validateUpdateUsuario, handleValidationErrors, updateUsuario)
    .delete(checkJwt, syncUser, deleteUsuario);

export default router;