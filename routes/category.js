const express = require('express');
const category = require('../controllers/category');

const app = express();

app.post('/category', category.create);
app.get('/category', category.list);
app.put('/category', category.update);
app.delete('/category', category.delete);

module.exports = app;