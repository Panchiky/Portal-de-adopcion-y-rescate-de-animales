const { Router } = require('express');
const { ubicacion } = require('../controllers/refugios.controller');

const router = Router();

// Público: la ubicación del refugio se muestra en la ficha del animal
router.get('/:id/ubicacion', ubicacion);

module.exports = router;
