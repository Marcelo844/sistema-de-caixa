import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate(); // Crie a função navigate

  const handleStartClick = () => {
    navigate('/login'); // Redireciona para a página de login
  };

  return (
    <header className="header">
        <section className="hero">
        <div className="hero-text">
            <h1>Simplifique suas vendas e<br />controle seu caixa com facilidade</h1>
            <button className="btn-start" onClick={handleStartClick}>Começar</button>
        </div>
        </section>
    </header>
  );
};

export default Header;