import React from 'react';
import { useParams } from 'react-router-dom';

function LpPage() {
  const { publicKey } = useParams();
  
  return (
    <div>
      <h2>LP PAGE</h2>
      <p>Vault: {publicKey}</p>
      <h2>THIS IS A PAGE WHERE LPs WILL DEPOSIT, WITHDRAW, MANAGE POSITION, ETC</h2>
    </div>
  );
}

export default LpPage;
