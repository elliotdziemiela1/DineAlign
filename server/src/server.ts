import { NextFunction, Request, Response } from "express"
import express from 'express'
import dotenv from 'dotenv'

var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var router = express.Router();

dotenv.config({path: __dirname + "/../config.env"})

const app = express();
const port = process.env.PORT;
const path = require('path');

app.get('/api', (req: Request, res: Response) => {
  res.send('Hello World!');
})

// app.get('/api', (req: Request, res: Response) => {
//   res.append('Access-Control-Allow-Origin', ['*']);
//   res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//   res.append('Access-Control-Allow-Headers', 'Content-Type');
//   res.json({message: "Hello API!"})
// })

var allowCrossDomain = function (req:Request, res:Response, next:NextFunction) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
  next();
};
app.use(allowCrossDomain);

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '../clientbuild')));
app.get('*', function(req: Request, res: Response) {
  return res.sendFile(path.resolve(__dirname, '../clientbuild', 'index.html'));
});

require('./routes')(app, router);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})