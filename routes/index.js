import express from 'express';
import authRoutes from './authRoutes.js';
import adminRoutes from './adminRoutes.js';
import userRoutes from './userRoutes.js';
import productRoutes from './productRoutes.js';
import cartRoutes from './cartRoutes.js';
const router = express.Router();

// Mounts authRoutes directly so they hit /api/signup and /api/signin
router.use('/', authRoutes);
router.use('/admin', adminRoutes);
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/cart', cartRoutes);

export default router;