import express from 'express';
import {login} from '../controllers/authController.js';
  

const router = express.Router();

// Rota de login
router.post('/login', login);

export default router;
