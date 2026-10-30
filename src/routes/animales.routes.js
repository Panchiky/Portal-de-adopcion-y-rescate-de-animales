const { Router } = require('express');
const ctrl = require('../controllers/animales.controller');
const { verificarToken, tokenOpcional, permitirRoles } = require('../middlewares/auth.middleware');

const router = Router();
const soloAdmin = [verificarToken, permitirRoles('ADMIN')];

router.get('/', ctrl.listar);
router.get('/gestion', soloAdmin, ctrl.listarGestion);
router.get('/:id', tokenOpcional, ctrl.obtener);
router.post('/', soloAdmin, ctrl.crear);
router.put('/:id', soloAdmin, ctrl.actualizar);
router.patch('/:id/estado', soloAdmin, ctrl.cambiarEstado);
router.delete('/:id', soloAdmin, ctrl.eliminar);

module.exports = router;
