const express = require('express');
const user = require('../controllers/user');

const app = express();

app.post('/user', user.create);
app.get('/user', user.getUserInfo);
app.put('/user', user.update);
app.delete('/user', user.delete);

module.exports = app;