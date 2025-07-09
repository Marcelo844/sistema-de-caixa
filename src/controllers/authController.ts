import type { Request, Response } from 'express';
import supabase from '../utils/supabaseClient.js'; 
import jwt from 'jsonwebtoken';

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Usando o Supabase para fazer o login
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(400).json({ message: error.message });  // Aqui o `error.message` é válido
    }

    // Gerar o token JWT com o JWT Secret do Supabase
    const jwtSecret = process.env.SUPABASE_JWT_SECRET as string;
    const token = jwt.sign({ userId: data.user.id }, jwtSecret, { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (error: any) {  // Aqui tipamos o erro como 'any'
    res.status(500).json({ message: error.message });
  }
};
