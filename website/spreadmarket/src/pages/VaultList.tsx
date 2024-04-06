import React from 'react';
import { Link } from 'react-router-dom';

function VaultListPage() {
  const vaults = [
    { publicKey: 'asdfghjkl;' },
    { publicKey: '123456789' },
  ];

  return (
    <div>
      <h2>LIST OF VAULTS PAGE PLACEHOLDER</h2>
      {vaults.map((vault, index) => (
        <div key={index}>
          <h3>Vault: {vault.publicKey}</h3>
          <Link to={`/lp/${vault.publicKey}`}>
            <button>Go to LP Page</button>
          </Link>
          <Link to={`/buyer/${vault.publicKey}`}>
            <button>Go to Buyer Page</button>
          </Link>
        </div>
      ))}
    </div>
  );
}

export default VaultListPage;
