import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { VAULTS_DEVNET, VAULT_TO_NAME } from "../constants";
import { PublicKey } from "@solana/web3.js";
import { useSpreadProgram } from "../hooks/useSpreadProgram";
import { SpreadVault } from "../package/idl";

export const VaultList = () => {
  const program = useSpreadProgram();
  const [vaultsData, setVaultsData] = useState<SpreadVault[]>([]);

  useEffect(() => {
    const getVaultInfo = async () => {
      const vaults = await Promise.all(
        VAULTS_DEVNET.map(async (vault) => {
          const vaultAcc = await program.account.spreadVault.fetch(
            new PublicKey(vault)
          );
          return vaultAcc;
        })
      );

      setVaultsData(vaults);
    };

    getVaultInfo();
  }, []);

  return (
    <div>
      <div className="vaults-container">
        {VAULTS_DEVNET.map((vault, index) => (
          <div key={index} className="vault-card">
            <div className="Section-header">
              {"" + VAULT_TO_NAME.get(vault) + " Vault"}
            </div>
            {/* TODO placeholders */}
            <div>{"Yield: 99.999%"}</div>
            <div>{"Free funds: " + vaultsData[index]?.freeFunds || 0}</div>
            <div>
              {"Call premiums sold: " +
                vaultsData[index]?.saleData.netCallPremiums || 0}
            </div>
            <div>
              {"Put premiums sold: " +
                vaultsData[index]?.saleData.netPutPremiums || 0}
            </div>
            <div>
              {"Call volume: " +
                vaultsData[index]?.saleData.calls[0].exposure || 0}
            </div>
            <div>
              {"Put volume: " + vaultsData[index]?.saleData.puts[0].exposure ||
                0}
            </div>
            <Link to={`/lp/${vault}`} className="vault-button">
              Go to LP Page
            </Link>

            <Link to={`/buyer/${vault}`} className="vault-button">
              Go to Buyer Page
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VaultList;
