import express, { Application } from "express";
import dotenv from "dotenv";
import "./config/database";
import createServer from "./utils/server";
import multer from 'multer';
import path from 'path'; 
import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from './swagger.json';
import cors from 'cors'
const app =createServer();

var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
}
app.use(cors(corsOptions));

// This example allows requests from any origin, you might want to restrict it to your frontend domain
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

dotenv.config();

// export const app: Application = express();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


const PORT: number = parseInt(process.env.PORT as string, 10) || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
  
});
