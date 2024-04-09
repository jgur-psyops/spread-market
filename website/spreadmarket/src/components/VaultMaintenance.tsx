import React, { useState } from "react";
import {
  PubkeyInput,
  NumberInput,
  PercentageSlider,
} from "../utils/primitives";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import useSendTxLogic from "../hooks/useSendTx";
import { useSpreadProgram } from "../hooks/useSpreadProgram";
import { initSpreadVault, setVol } from "../package/instructions";
import { PublicKey, Transaction } from "@solana/web3.js";
import { USDC_MINT_DEVNET, u32MAX, u32toPercent } from "../constants";
import {getSolPrice} from "../utils/gecko";
import { BN } from "bn.js";

export const VaultMaintenance = () => {
  const wallet = useAnchorWallet();
  const program = useSpreadProgram();
  const { sendTx } = useSendTxLogic();

  const [vaultMaintExpanded, setVaultMaintExpanded] = useState(true);

  const [spreadVault, setSpreadVault] = useState<PublicKey | null>(null);
  const [riskFree, setRiskFree] = useState(0.05);
  const [volatility, setVolatility] = useState(0.75);

  const setVolatilityButton = async () => {
    if (wallet && program && spreadVault) {
      try {
        const ix = await setVol(
          // @ts-ignore
          program,
          wallet.publicKey,
          spreadVault,
          new BN(volatility * u32MAX),
          riskFree * u32MAX
        );

        let sig = await sendTx(new Transaction().add(ix));
        console.log("sig: " + sig);
        console.log("updated volatility for vault " + spreadVault);
      } catch (error) {
        console.error(error);
      }
    } else {
      alert("Missing some required input");
    }
  };

  const loadCurrentVol = async () => {
    if (spreadVault) {
      let vault = await program.account.spreadVault.fetch(spreadVault);
      setRiskFree(u32toPercent(vault.riskFreeRate));
      setVolatility(u32toPercent(vault.volatility.toNumber()));
    } else {
      alert("Enter a spread vault");
    }
  };

  const getPrice = async () => {
      const price = await getSolPrice();
      console.log(`The price of Solana is: ${price} USD`);
      // TODO do something with price....
  };

  // const startMarketEpoch = async () => {
  //   if (wallet && program && spreadVault) {
  //     try {
  //       const ix = await setVol(
  //         program,
  //         wallet.publicKey,
  //         spreadVault,
  //         new BN(volatility * u32MAX),
  //         riskFree * u32MAX
  //       );

  //       let sig = await sendTx(new Transaction().add(ix));
  //       console.log("sig: " + sig);
  //       console.log("updated volatility for vault " + spreadVault);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   } else {
  //     alert("Missing some required input");
  //   }
  // };

  return (
    <div className="left-align-container">
      <button
        className="Button-generic"
        onClick={() => setVaultMaintExpanded(!vaultMaintExpanded)}
      >
        {vaultMaintExpanded
          ? "Collapse Vault Maintenance"
          : "Show Vault Maintenance"}
      </button>

      {vaultMaintExpanded && (
        <div
          style={{
            paddingLeft: "4vmin",
          }}
        >
          <span className="Section-header">{"Update Volatility"}</span>
          <PubkeyInput
            setKey={setSpreadVault}
            labelText="Spread Vault"
            value={spreadVault?.toString()}
          />
          <PercentageSlider
            label="Fee Rate (%)"
            value={riskFree}
            setValue={setRiskFree}
            step={0.0001}
            min={0}
            max={1}
          />
          <PercentageSlider
            label="Implied Volatility (%)"
            value={volatility}
            setValue={setVolatility}
            step={0.0001}
            min={0}
            max={3}
          />
          <button className="Button-small" onClick={loadCurrentVol}>
            {"Load Current Settings"}
          </button>
          <button className="Button-small" onClick={setVolatilityButton}>
            {"Update Volatility"}
          </button>
          <div></div>
          <button className="Button-small" onClick={getPrice}>
            {"Get Sol Price"}
          </button>
        </div>
      )}
      <hr className="hr-line-break"></hr>
    </div>
  );
};

export default VaultMaintenance;
