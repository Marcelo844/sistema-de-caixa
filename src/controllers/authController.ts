// src/controllers/authController.ts
import type { Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';
import { supabase } from '../utils/supabaseClient.js';
import jwt from 'jsonwebtoken';

// Admin client com a service_role key (não exponha no front-end)
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,            // ex: https://xyz.supabase.co
  process.env.SUPABASE_SERVICE_ROLE_KEY! // encontrei em Project Settings → API
);

/**
 * Registra um novo usuário no Supabase Auth
 */
export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    // Retorna o userId para confirmação posterior
    return res.status(201).json({ userId: data.user?.id });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

/**
 * Auto-confirma o usuário usando a Admin API do Supabase
 */
export const autoConfirm = async (req: Request, res: Response) => {
  const { userId } = req.body;
  try {
    const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      email_confirm: true
    });
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

/**
 * Realiza login e retorna JWT customizado
 */
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    // Gera um token JWT próprio (opcional)
    const jwtSecret = process.env.SUPABASE_JWT_SECRET as string;
    const token = jwt.sign(
      { userId: data.user?.id },
      jwtSecret,
      { expiresIn: '1h' }
    );

    return res.status(200).json({ token });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};