# 💰 Sistema de Caixa

Um sistema de caixa simples e funcional, desenvolvido em **Node.js + React + Supabase**, com autenticação de usuários e funcionalidades de gerenciamento de fluxo de caixa.  

---

## 🚀 Funcionalidades

- **Autenticação de Usuários**
  - Cadastro de novos usuários
  - Login com verificação de e-mail
  - Recuperação de senha (Reset Password)
  - Exclusão de conta  

- **Gerenciamento de Caixa**
  - Registro de entradas e saídas
  - Visualização do histórico de transações
  - Dashboard com informações financeiras  

- **Interface Amigável**
  - Layout limpo e responsivo
  - Botão de "ver senha" nos campos de login e cadastro
  - Mensagens de feedback claras para o usuário

---

## 🛠️ Tecnologias Utilizadas

### Backend
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Supabase](https://supabase.com/) (Banco de Dados + Autenticação)
- [Prisma](https://www.prisma.io/) (ORM)

### Frontend
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Bootstrap](https://getbootstrap.com/) (UI)
- [Axios](https://axios-http.com/)

---

## ⚙️ Como Rodar o Projeto

### 1. Clone o repositório
```bash
git clone https://github.com/Marcelo844/sistema-de-caixa.git
cd sistema-de-caixa

### 2. Instalar Dependências
npm install

### 3. Variáveis de Ambiente (.env)
.env
VITE_SUPABASE_URL=https://waeioolyrfvrkqjvzwhm.supabase.co
VITE_SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhZWlvb2x5cmZ2cmtxanZ6d2htIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzMjIxOTQsImV4cCI6MjA2Njg5ODE5NH0.BjJSFDSy7CxO3lZBIqzhHrBO0q3_VO_eEX6So4PTdaM
VITE_SITE_URL=http://localhost:5173

JWT_SECRET=lbthY6VyOWangh/w8nL8se7a6bsmvnCpafo1/KIhm+8gsIld+1CdQdUC/5XL6Tj4gFxv8rNWbJE83lTAc7mFyg==

SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhZWlvb2x5cmZ2cmtxanZ6d2htIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTMyMjE5NCwiZXhwIjoyMDY2ODk4MTk0fQ.HemBqCsgpdnl9xrdYTS8AgkGxOqOTS-lDR2i1c5kCFo
SUPABASE_URL=https://waeioolyrfvrkqjvzwhm.supabase.co

### Inicializar o Server
npm run dev

## Autores

**Arthur Leite**
**Bruno Matheus Fridrich**
**Isabela Emerichs Dreher**
**Marcelo Rangel Barros**  