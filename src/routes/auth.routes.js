const { Router } = require('express');
const {
  registro, login, perfil, actualizarPerfil, cambiarPassword,
} = require('../controllers/auth.controller');
const { verificarToken } = require('../middlewares/auth.middleware');
const { limiteAuth } = require('../middlewares/limite.middleware');

const router = Router();

router.post('/registro', limiteAuth, registro);
router.post('/login', limiteAuth, login);
router.get('/perfil', verificarToken, perfil);
router.patch('/perfil', verificarToken, actualizarPerfil);
// También usa el límite de intentos: evita adivinar la contraseña actual con una sesión robada
router.patch('/password', verificarToken, limiteAuth, cambiarPassword);

module.exports = router;
