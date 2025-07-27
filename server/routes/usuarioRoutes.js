import express from 'express';
import {
    createUsuario,
    getAllUsuarios,
    getUsuarioById,
    updateUsuario,
    deleteUsuario
} from '@/controllers/usuarioController.js';
import checkJwt from '@/middleware/authMiddleware.js';
import { validateCreateUsuario, validateUpdateUsuario } from '@/validators/usuarioValidators.js';
import handleValidationErrors from '@/middleware/handleValidationErrors.js';

const router = express.Router();

// @desc    Cria ou obtém todos os utilizadores
// @route   POST, GET /api/v1/usuarios
router.route('/')
    .post(checkJwt, validateCreateUsuario, handleValidationErrors, createUsuario)
    .get(checkJwt, getAllUsuarios);

// @desc    Obtém, atualiza ou apaga um utilizador por ID
// @route   GET, PUT, DELETE /api/v1/usuarios/:id
router.route('/:id')
    .get(checkJwt, getUsuarioById)
    .put(checkJwt, validateUpdateUsuario, handleValidationErrors, updateUsuario)
    .delete(checkJwt, deleteUsuario);

export default router;