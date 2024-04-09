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
  }, [VAULTS_DEVNET]);

  return (
    <div className="w-full h-full m-auto">
      <div className="vaults-container h-full self-stretch w-full items-center justify-center flex-wrap">
        {VAULTS_DEVNET.map((vault, index) => (
          <div
            key={index}
            className="vault-card w-min-[300px]  sm:w-[400px] text-md bg-gradient-to-b from-indigo-400 to-slate-900 rounded-2xl self-stretch p-7 m-5 flex-col justify-start items-start gap-6 inline-flex"
          >
            <div className="Section-header text-white text-lg sm:text-xl">
              {"" + VAULT_TO_NAME.get(vault) + " Vault"}
            </div>
            {/* TODO placeholders */}
            <div className="text-base sm:text-lg">{"Yield: 99.999%"}</div>
            <div className="text-base sm:text-lg">
              {"Free funds: " + vaultsData[index]?.freeFunds || 0}
            </div>
            <div className="text-base sm:text-lg">
              {"Call premiums sold: " +
                vaultsData[index]?.saleData.netCallPremiums || 0}
            </div>
            <div className="text-base sm:text-lg">
              {"Put premiums sold: " +
                vaultsData[index]?.saleData.netPutPremiums || 0}
            </div>
            <div className="text-base sm:text-lg">
              {"Call volume: " +
                vaultsData[index]?.saleData.calls[0].exposure || 0}
            </div>
            <div className="text-base sm:text-lg">
              {"Put volume: " + vaultsData[index]?.saleData.puts[0].exposure ||
                0}
            </div>
            <div className="flex justify-center items-center gap-5 inline-flex">
              <Link
                to={`/lp/${vault}`}
                className="vault-button text-base sm:text-lg"
              >
                Go to LP Page
              </Link>

              <Link
                to={`/buyer/${vault}`}
                className="vault-button text-base sm:text-lg"
              >
                Go to Buyer Page
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VaultList;
