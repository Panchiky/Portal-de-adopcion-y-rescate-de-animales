const rateLimit = require('express-rate-limit');

function responderLimite(mensaje) {
  return (req, res) => {
    res.status(429).json({ ok: false, error: { mensaje } });
  };
}

// Login y registro: 10 intentos fallidos cada 15 minutos por IP (frena la fuerza bruta de contraseñas)
const limiteAuth = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: responderLimite('Demasiados intentos, espera 15 minutos antes de volver a intentar'),
});

// Toda la API: 500 peticiones cada 15 minutos por IP (frena abusos y scraping del catálogo)
const limiteGeneral = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 500,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: responderLimite('Demasiadas peticiones, espera unos minutos antes de volver a intentar'),
});

module.exports = { limiteAuth, limiteGeneral };
