import { NextFunction, Request, Response } from "express"
import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose';

var bodyParser = require('body-parser');
var router = express.Router();

dotenv.config({path: __dirname + "/../config.env"})

const app = express();
const port = process.env.PORT;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
})
const uri = process.env.CONNECTION_URI;
if (!uri){throw new Error("ERROR CONNNECTION UNDEFINED");}
mongoose.connect(uri);

// app.get('/api', (req: Request, res: Response) => {
//   res.append('Access-Control-Allow-Origin', ['*']);
//   res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//   res.append('Access-Control-Allow-Headers', 'Content-Type');
//   res.json({message: "Hello API!"})
// })

var allowCrossDomain = function (req:Request, res:Response, next:any) {
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

require('./routes')(app, router);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})