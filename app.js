const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//import express from 'express';

const app = express();
const productRoutes = require('./api/routes/tasks');
const productOrders = require('./api/routes/orders');

mongoose.Promise = global.Promise;
mongoose.connect("mongodb+srv://alkat0208:"
  + process.env.MONGO_ATLAS_PWD +
  "@node-rest-tracker-wb0og.mongodb.net/test",

  );
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if(req.method ==="OPTIONS"){
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
})

app.use('/tasks', productRoutes);
app.use('/orders', productOrders);

app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
})

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error:{
      message: error.message
    }
  });
});



module.exports = app;
//export default app;
