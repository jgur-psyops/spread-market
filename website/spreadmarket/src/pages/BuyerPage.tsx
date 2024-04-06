import React from 'react';
import { useParams } from 'react-router-dom';

function BuyerPage() {
  const { publicKey } = useParams();
  
  return (
    <div>
      <h2>BUYER PAGE</h2>
      <p>Vault: {publicKey}</p>
      <p>THIS IS A PAGE WHERE BUYERS WILL BUY, EXERCISE, AND MANAGE OPTIONS</p>
    </div>
  );
}

export default BuyerPage;