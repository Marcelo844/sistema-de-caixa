import express from 'express';
import { register, autoConfirm, login } from '../controllers/authController';

const router = express.Router();

router.post('/register', register);
router.post('/auto-confirm', autoConfirm);
router.post('/login', login);

export default router;
