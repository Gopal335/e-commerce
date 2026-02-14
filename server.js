import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

import connectDB from './config/db.js';
import rootRouter from './routes/index.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import cors from "cors";
import { otpCronJob } from './src/cron/otpCron.js';
import errorMiddleware from './src/middleware/errorMiddleware.js';

connectDB();

const app = express();

app.use(cors({
  origin: "http://localhost:5177", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
    
  
}))

app.use(express.json());

otpCronJob();

app.use('/api', rootRouter);

app.get('/', (req, res) => {
  res.send('Server Started');
});

app.use(notFound);
app.use(errorHandler);
app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on Port:${PORT}`);
});