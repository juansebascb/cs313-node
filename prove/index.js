const express = require('express');
const app = express();

module.exports = { app: app}

app.use('/week09', require('./week09/index').app);