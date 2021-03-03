const express = require('express');
const category = require('./category');
const user = require('./user');
const income_expense = require('./income_expense');

const app = express();
app.use(category);
app.use(user);
app.use(income_expense);

module.exports = app;