const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { corsOrigin } = require('./config/env');
const routes = require('./routes');
const { sanitizarBody } = require('./middlewares/sanitizar.middleware');
const { rutaNoEncontrada, manejadorErrores } = require('./middlewares/error.middleware');

const app = express();

app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: corsOrigin }));
app.use(express.json({ limit: '1mb' }));
app.use(sanitizarBody);

app.use('/api', routes);

app.use(rutaNoEncontrada);
app.use(manejadorErrores);

module.exports = app;
