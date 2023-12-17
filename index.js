const express = require('express');
const app = express();
const connectToMongo = require('./config/db-connect');

connectToMongo();

global.JWT_SECRET = 'manishisgoodboy';

var cors = require('cors');
app.use(cors())

app.use(express.json({ limit: '10mb' }));

app.use('/uploads', express.static('uploads'));

const port = 3002;

var router = require('./router.js');
app.use('/', router);

app.listen(port, () => {
    console.log(`Backend Admin listening on port ${port}`);
});