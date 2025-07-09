// /src/services/authService.ts

import jwt from 'jsonwebtoken';

// Carregar o JWT Secret do arquivo .env
const jwtSecret = process.env.SUPABASE_JWT_SECRET as string;

// Função para gerar um token JWT
export const generateJwt = (userId: string) => {
  const token = jwt.sign({ userId }, jwtSecret, { expiresIn: '1h' });
  return token;
};

// Função para verificar o token JWT
export const verifyJwt = (token: string) => {
  try {
    const decoded = jwt.verify(token, jwtSecret);
    return decoded;
  } catch (error) {
    throw new Error('Token inválido');
  }
};
