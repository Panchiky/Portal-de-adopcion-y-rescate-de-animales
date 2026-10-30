const { Router } = require('express');
const ctrl = require('../controllers/postulaciones.controller');
const { verificarToken, permitirRoles } = require('../middlewares/auth.middleware');

const router = Router();

router.use(verificarToken);

router.post('/', permitirRoles('USUARIO'), ctrl.crear);
router.get('/mias', permitirRoles('USUARIO'), ctrl.listarMias);
router.get('/', permitirRoles('ADMIN'), ctrl.listarRefugio);
router.get('/:id', ctrl.obtener);
router.patch('/:id/estado', permitirRoles('ADMIN'), ctrl.cambiarEstado);
router.delete('/:id', permitirRoles('USUARIO'), ctrl.retirar);

module.exports = router;
