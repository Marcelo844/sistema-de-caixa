import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';  // Importando as rotas de autenticação

const app = express();

// Middleware para permitir o uso de CORS e JSON
app.use(express.json());
app.use(cors()); 

// Definindo as rotas de autenticação
app.use('/api/auth', authRoutes);  // Rota de autenticação

app.listen(3000, () => console.log('🚀 server on http://localhost:3000'));
