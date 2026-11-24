const { Router } = require('express');
const healthRoutes = require('./health.routes');
const authRoutes = require('./auth.routes');
const animalesRoutes = require('./animales.routes');
const postulacionesRoutes = require('./postulaciones.routes');
const favoritosRoutes = require('./favoritos.routes');
const notificacionesRoutes = require('./notificaciones.routes');
const refugiosRoutes = require('./refugios.routes');

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/animales', animalesRoutes);
router.use('/postulaciones', postulacionesRoutes);
router.use('/favoritos', favoritosRoutes);
router.use('/notificaciones', notificacionesRoutes);
router.use('/refugios', refugiosRoutes);

module.exports = router;
