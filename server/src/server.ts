import { NextFunction, Request, Response } from "express"
import express from 'express'
import dotenv from 'dotenv'

dotenv.config({path: __dirname + "/../config.env"})

const app = express()
const port = process.env.PORT

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!')
})

app.get('/api', (req: Request, res: Response) => {
  res.append('Access-Control-Allow-Origin', ['*']);
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.append('Access-Control-Allow-Headers', 'Content-Type');
  res.json({message: "Hello API!"})
})

// app.use((req: Request, res: Response, next: NextFunction) => {
//   res.append('Access-Control-Allow-Origin', ['*']);
//   res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//   res.append('Access-Control-Allow-Headers', 'Content-Type');
//   next();
// })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})