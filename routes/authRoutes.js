import express from 'express';
import { signup, signin } from '../src/auth/controller.js';
import validateSignup from '../middleware/validateAuth.js';

const router = express.Router();

router.post('/signup', validateSignup, signup);
router.post('/signin', signin);

export default router;
