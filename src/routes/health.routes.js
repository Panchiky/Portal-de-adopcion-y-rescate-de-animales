const { Router } = require('express');
const { obtenerEstado } = require('../controllers/health.controller');

const router = Router();

router.get('/', obtenerEstado);

module.exports = router;
