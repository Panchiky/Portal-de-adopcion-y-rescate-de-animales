const { Router } = require('express');
const ctrl = require('../controllers/notificaciones.controller');
const { verificarToken } = require('../middlewares/auth.middleware');

const router = Router();

router.use(verificarToken);

router.get('/', ctrl.listar);
router.patch('/:id/leida', ctrl.marcarLeida);

module.exports = router;
