import { useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import AdminPage from "./pages/AdminPage";
import VaultListPage from "./pages/VaultList";
import "@solana/wallet-adapter-react-ui/styles.css";
import LpPage from "./pages/LpPage";
import BuyerPage from "./pages/BuyerPage";
import { Faucet } from "./pages/Faucet";

function App() {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // Define wallets supported by your application
  const wallets = useMemo(() => [], [network]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <BrowserRouter>
            <div>
              {/* Navbar here.. */}
              <nav>
                <ul>
                  <li>
                    <Link to="/">Home</Link>
                  </li>
                  <li>
                    <Link to="/faucet">Faucet</Link>
                  </li>
                  <li>
                    <Link to="/adminPage">Admin Page</Link>
                  </li>
                  <li>
                    <Link to="/vaultList">Vault List</Link>
                  </li>
                </ul>
                <div className="wallet-button-container">
                  <WalletMultiButton />
                </div>
              </nav>
            </div>

            {/* Routes here... */}
            <main>
              <Routes>
                <Route path="/" element={<h1>LANDING PAGE PLACEHOLDER</h1>} />
                <Route path="/faucet" element={<Faucet />} />
                <Route path="/adminPage" element={<AdminPage />} />
                <Route path="/vaultList" element={<VaultListPage />} />
                <Route path="/lp/:publicKey" element={<LpPage />} />
                <Route path="/buyer/:publicKey" element={<BuyerPage />} />
              </Routes>
            </main>
          </BrowserRouter>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
