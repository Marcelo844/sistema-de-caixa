import React from 'react';

interface Props {
  extratoImage: string;
}

const StatementList: React.FC<Props> = ({ extratoImage }) => {
  return (
    <div className="statement-box">
      <img src={extratoImage} alt="Extrato do caixa" />
    </div>
  );
};

export default StatementList;