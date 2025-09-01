# 💰 Sistema de Caixa

Um sistema de caixa moderno e funcional, desenvolvido em **Node.js + Express + React + Vite + Supabase**, com autenticação de usuários e funcionalidades completas de gerenciamento de fluxo de caixa.  

---

## 🚀 Funcionalidades

- **Autenticação de Usuários**
  - Cadastro de novos usuários  
  - Login com verificação de e-mail  
  - Recuperação de senha (Reset Password)  
  - Exclusão de conta  

- **Gerenciamento de Caixa**
  - Registro de entradas e saídas de valores  
  - Categorização de transações (vendas, despesas, investimentos, etc.)  
  - Visualização do histórico de movimentações  
  - Dashboard com saldo atual e projeções financeiras  

- **Interface Amigável**
  - Layout limpo e responsivo  
  - Botão de "ver senha" nos campos de login/cadastro  
  - Mensagens de feedback claras para o usuário  

---

## 🛠️ Tecnologias Utilizadas

### Backend
- [Node.js](https://nodejs.org/)  
- [Express](https://expressjs.com/) (API REST)  
- [Supabase](https://supabase.com/) (Banco de Dados + Autenticação)  
- [bcryptjs](https://www.npmjs.com/package/bcryptjs) (hash de senhas)  
- [dotenv](https://www.npmjs.com/package/dotenv) (variáveis de ambiente)  

### Frontend
- [React](https://react.dev/)  
- [Vite](https://vitejs.dev/) (build tool)  
- [Axios](https://axios-http.com/) (requisições HTTP)  
- [Bootstrap](https://getbootstrap.com/) + [Bootstrap Icons](https://icons.getbootstrap.com/) (UI)  

---

## ⚙️ Como Rodar o Projeto

### 1. Clone o repositório
```bash
git clone https://github.com/Marcelo844/sistema-de-caixa.git
cd sistema-de-caixa

npm install

.env com as seguintes variáveis:
VITE_SUPABASE_URL=https://waeioolyrfvrkqjvzwhm.supabase.co
VITE_SUPABASE_KEY=chave_publica_aqui
VITE_SITE_URL=http://localhost:5173

JWT_SECRET=sua_chave_jwt_aqui

SUPABASE_KEY=sua_chave_service_role_aqui
SUPABASE_URL=https://waeioolyrfvrkqjvzwhm.supabase.co

npm run dev

##Autores
Arthur Leite
Bruno Matheus Fridrich
Isabela Emerichs Dreher
Marcelo Rangel Barros