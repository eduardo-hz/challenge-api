const express = require('express');
const income_expense = require('../controllers/income_expense');

const app = express();

app.post('/income_expense', income_expense.create);
app.get('/income_expense', income_expense.list);
app.put('/income_expense', income_expense.update);
app.delete('/income_expense', income_expense.delete);

module.exports = app;