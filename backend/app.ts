import dotenv from 'dotenv'
import express, { Request, Response } from 'express';
import * as mongoose from 'mongoose';
import cors from 'cors'
import userRouter from './routes/userRoutes'
import machineHealthRouter from './routes/machineHealthRoutes'

dotenv.config();

mongoose.connect("mongodb://localhost:27017/factory-health")

const app = express();
const port = process.env.APPLICATION_PORT;

app.use(cors({
  origin: "*",
  methods: ['GET', 'POST']
}))

// Middleware to parse JSON request bodies
app.use(express.json());

app.use('/user', userRouter)
app.use('/machine-health', machineHealthRouter)

app.listen(port, () => {
  console.log(`API is listening at http://localhost:${port}`);
});
