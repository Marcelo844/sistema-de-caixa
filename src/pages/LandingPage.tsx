import React from 'react';
import Header from '../components/Header';
import FeatureBox from '../components/FeatureBox';
import mockup1 from '../assets/mockup1.png';
import extrato from '../assets/extrato.png';
import '../styles/landingPage.css'; 

const LandingPage: React.FC = () => {
  return (
    <div className="landing-container">
      <Header />

      <main className="content">
        <section className="feature-section">
          <div className="left">
            <p>O sistema ideal para <br />pequenos e médios comércios</p>
          </div>
          <div className="right">
            <img src={mockup1} alt="Sistema em uso" />
          </div>
        </section>

        <section className="extrato-benefits">
          <div className="extrato-left">
            <img src={extrato} alt="Extrato do caixa" />
          </div>
          <div className="benefits-right">
            <FeatureBox icon="check-circle" text="Controle de entrada e saída" />
            <FeatureBox icon="shield-lock" text="Privacidade e exclusividade de cada usuário" />
            <FeatureBox icon="bar-chart-line" text="Visualização clara da movimentação bancária" />
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;
