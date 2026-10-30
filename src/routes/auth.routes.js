const { Router } = require('express');
const { registro, login, perfil } = require('../controllers/auth.controller');
const { verificarToken } = require('../middlewares/auth.middleware');

const router = Router();

router.post('/registro', registro);
router.post('/login', login);
router.get('/perfil', verificarToken, perfil);

module.exports = router;
