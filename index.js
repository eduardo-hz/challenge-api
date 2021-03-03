// import express from 'express';
const express = require('express');
// import bodyParser from 'body-parser';
const routes = require('./routes/index');
// import routes from './routes';
const bodyParser = require('body-parser');

const cors = require('cors');
const morgan = require('morgan');

const app = express();

app.use(cors());

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json())

app.use(routes);

app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), ()=>{
    console.log("Ejecutando Servidor en el puerto " + app.get('port'));
});