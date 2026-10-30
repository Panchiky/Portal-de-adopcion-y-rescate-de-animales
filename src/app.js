const express = require('express');
const cors = require('cors');
const { corsOrigin } = require('./config/env');
const routes = require('./routes');
const { rutaNoEncontrada, manejadorErrores } = require('./middlewares/error.middleware');

const app = express();

app.use(cors({ origin: corsOrigin }));
app.use(express.json({ limit: '1mb' }));

app.use('/api', routes);

app.use(rutaNoEncontrada);
app.use(manejadorErrores);

module.exports = app;
