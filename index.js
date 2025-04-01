
require('dotenv').config();
const express = require('express');
const http = require('http');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const router = require('./router');

const { SERVER_PORT, SECRET_PASSWORD } = process.env;

const server = http.createServer(app);

app.disable('etag');
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cors());
app.use((req, res, next) => {
  if(req.headers.authorization === `Bearer ${SECRET_PASSWORD}`) {
    next();
    return;
  }
  res.status(401).json({nope: 'no'});
});

app.use('/', router);

server.listen(SERVER_PORT, () => {
  console.log(`Server started on port: ${SERVER_PORT}`);
});

