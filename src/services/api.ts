// src/services/api.ts
import axios from 'axios';

// Defina a URL do back-end
const api = axios.create({
  baseURL: 'http://localhost:3000/api/auth',  // A URL da sua API do back-end
});

export default api;
