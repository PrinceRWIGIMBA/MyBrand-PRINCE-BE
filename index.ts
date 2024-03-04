import express, { Application } from "express";
import dotenv from "dotenv";
import "./config/database";
import createServer from "./utils/server";
import multer from 'multer';
import path from 'path'; 
import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from './swagger.json';
import cors from 'cors';

const app = createServer();
dotenv.config();

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

// Use Cors middleware
app.use(cors({
  origin: '*',
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

const PORT: number = parseInt(process.env.PORT as string, 10) || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
