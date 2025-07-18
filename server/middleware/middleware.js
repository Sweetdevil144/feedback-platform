const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

function configureMiddleware(app) {
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan('dev'));
}

module.exports = configureMiddleware;
