import { NextFunction, Request, Response } from "express"
import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose';

var bodyParser = require('body-parser');
var router = express.Router();

dotenv.config({path: __dirname + "/../config.env"})

const app = express();
const port = 3000;
const path = require('path');

let isReady = false;

app.get('/api', (req: Request, res: Response) => {
  res.send('Hello World!');
})

// Health Check Path
app.get("/", (_, res) => {
  if (isReady){
    res.status(200).send("OK");
  } else {
    res.status(503).send("Starting");
  }
});

const uri = process.env.MONGO_URI;
if (!uri){throw new Error("ERROR MONGODB URI UNDEFINED");}

async function startServer() {
  try {
    await mongoose.connect(uri ? uri : "");
    isReady = true; // mark container ready
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.log("MongoDB connection error: ", err);
    process.exit(1);
  }
}


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

app.use(express.static(path.join(__dirname, '../clientbuild')));

require('./routes')(app, router);

// app.get('*', function(req: Request, res: Response) {
//   return res.sendFile(path.resolve(__dirname, '../clientbuild', 'index.html'));
// });

startServer();
app.listen(port, "0.0.0.0", () => {
  console.log(`Example app listening on port ${port}`)
})