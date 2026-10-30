const { Router } = require('express');
const ctrl = require('../controllers/favoritos.controller');
const { verificarToken, permitirRoles } = require('../middlewares/auth.middleware');

const router = Router();

router.use(verificarToken, permitirRoles('USUARIO'));

router.get('/', ctrl.listar);
router.post('/:animalId', ctrl.agregar);
router.delete('/:animalId', ctrl.quitar);

module.exports = router;
