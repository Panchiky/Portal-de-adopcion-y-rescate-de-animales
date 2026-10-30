const { Router } = require('express');
const { registro, login, perfil } = require('../controllers/auth.controller');
const { verificarToken } = require('../middlewares/auth.middleware');
const { limiteAuth } = require('../middlewares/limite.middleware');

const router = Router();

router.post('/registro', limiteAuth, registro);
router.post('/login', limiteAuth, login);
router.get('/perfil', verificarToken, perfil);

module.exports = router;
