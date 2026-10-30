const rateLimit = require('express-rate-limit');

const limiteAuth = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      ok: false,
      error: { mensaje: 'Demasiados intentos, espera 15 minutos antes de volver a intentar' },
    });
  },
});

module.exports = { limiteAuth };
