import bcrypt from 'bcrypt';

export const hashPasswordMiddleware = async function () {

  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
};



// import express from 'express';
// import dotenv from 'dotenv';
// import connectDB from './config/db.js';
// import rootRouter from './routes/index.js';ev
// import { notFound, errorHandler } from './middleware/errorMiddleware.js';
// import cors from "cors";

// dotenv.config();
// connectDB();

// const app = express();

// app.use(cors({
//   origin: "http://localhost:5175", 
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   credentials: true
    
  
// }))

// app.use(express.json());



// app.use('/api', rootRouter);

// app.get('/', (req, res) => {
//   res.send('Server Started');
// });

// app.use(notFound);
// app.use(errorHandler);

// const PORT = process.env.PORT || 3000;

// app.listen(PORT, () => {
//   console.log(`Server is running on Port:${PORT}`);
// });