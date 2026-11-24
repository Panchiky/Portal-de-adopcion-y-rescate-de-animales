const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { corsOrigin, trustProxy } = require('./config/env');
const routes = require('./routes');
const { sanitizarBody } = require('./middlewares/sanitizar.middleware');
const { limiteGeneral } = require('./middlewares/limite.middleware');
const { rutaNoEncontrada, manejadorErrores } = require('./middlewares/error.middleware');

const app = express();

app.disable('x-powered-by');
// Detrás de un proxy (Render, Nginx, etc.) se usa la IP real del cliente y no la del proxy
app.set('trust proxy', trustProxy);
app.use(helmet());
app.use(cors({ origin: corsOrigin }));
app.use(express.json({ limit: '1mb' }));
app.use(sanitizarBody);

app.use('/api', limiteGeneral, routes);

app.use(rutaNoEncontrada);
app.use(manejadorErrores);

module.exports = app;
