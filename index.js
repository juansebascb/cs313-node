const express = require('express');
const app = express();

app.use('/prove', require('./prove/index').app);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`listening on ${PORT}`));