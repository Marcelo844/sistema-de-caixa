import React from 'react';

interface FeatureBoxProps {
  icon: string;
  text: string;
}

const FeatureBox: React.FC<FeatureBoxProps> = ({ icon, text }) => {
  return (
    <div className="feature-box">
      <i className={`bi bi-${icon}`}></i>
      <p>{text}</p>
    </div>
  );
};

export default FeatureBox;
