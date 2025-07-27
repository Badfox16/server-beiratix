import express from 'express';
import {
    getAllUsuarios,
    getUsuarioById,
    updateUsuario,
    deleteUsuario
} from '@/controllers/usuarioController.js';

const router = express.Router();

// @desc    Obtém todos os utilizadores
// @route   GET /api/v1/usuarios
router.route('/')
    .get(getAllUsuarios);

// @desc    Obtém, atualiza ou apaga um utilizador por ID
// @route   GET, PUT, DELETE /api/v1/usuarios/:id
router.route('/:id')
    .get(getUsuarioById)
    .put(updateUsuario)
    .delete(deleteUsuario);

export default router;