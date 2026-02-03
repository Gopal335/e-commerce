import express from 'express';
import authRoutes from './authRoutes.js';

const router = express.Router();

// Mounts authRoutes directly so they hit /api/signup and /api/signin
router.use('/', authRoutes);

export default router;