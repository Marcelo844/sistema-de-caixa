import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import authRoutes from './routes/authRoutes.js';  // Importando as rotas de autenticação

dotenv.config();  // Carregar variáveis de ambiente do arquivo .env

const app = express();
const port = 3000;

// Middleware para permitir o uso de CORS e JSON
app.use(cors());
app.use(bodyParser.json()); // Usando express.json() para fazer o parsing de JSON diretamente

// Definindo as rotas de autenticação
app.use('/api/auth', authRoutes);  // Rota de autenticação

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
