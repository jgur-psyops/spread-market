import React, { useState } from "react";
import {
  PubkeyInput,
  NumberInput,
  PercentageSlider,
} from "../utils/primitives";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import useSendTxLogic from "../hooks/useSendTx";
import { useSpreadProgram } from "../hooks/useSpreadProgram";
import { initSpreadVault } from "../package/instructions";
import { PublicKey, Transaction } from "@solana/web3.js";
import { USDC_MINT_DEVNET, u32MAX } from "../constants";
import { deriveSpreadVault } from "../package/pdas";

export const InitVault = () => {
  const wallet = useAnchorWallet();
  const program = useSpreadProgram();
  const { sendTx } = useSendTxLogic();

  const [initVaultExpanded, setInitVaultExpanded] = useState(true);

  const [admin, setAdmin] = useState(wallet?.publicKey || null);
  const [withdrawAuthority, setWithdrawAuthority] = useState(
    wallet?.publicKey || null
  );
  const [assetOracle, setAssetOracle] = useState(PublicKey.default);
  // TODO use MAINNET as applicable
  const [paymentMint, setPaymentMint] = useState(
    new PublicKey(USDC_MINT_DEVNET)
  );
  const [assetMint, setAssetMint] = useState<PublicKey | null>(null);
  const [feeRate, setFeeRate] = useState(0);
  const [optionDuration, setOptionDuration] = useState(0);
  const [nonce, setNonce] = useState(0);
  const [spreadVault, setSpreadVault] = useState<PublicKey | null>(null);

  const initVaultButton = async () => {
    if (
      wallet &&
      program &&
      admin &&
      withdrawAuthority &&
      assetOracle &&
      paymentMint &&
      assetMint
    ) {
      try {
        const ix = await initSpreadVault(
          // @ts-ignore
          program,
          wallet.publicKey,
          admin,
          withdrawAuthority,
          assetOracle,
          paymentMint,
          assetMint,
          feeRate * u32MAX,
          optionDuration,
          nonce
        );

        const [spreadVault] = deriveSpreadVault(
          program.programId,
          paymentMint,
          assetMint,
          nonce
        );
        setSpreadVault(spreadVault);

        let sig = await sendTx(new Transaction().add(ix));

        console.log("sig: " + sig);
        console.log("init vault: " + spreadVault);
      } catch (error) {
        console.error(error);
      }
    } else {
      alert("Missing some required input");
    }
  };

  const deriveVault = async () => {
    if (paymentMint && assetMint) {
      const [spreadVault] = deriveSpreadVault(
        program.programId,
        paymentMint,
        assetMint,
        nonce
      );
      setSpreadVault(spreadVault);
    }
  };

  return (
    <div className="left-align-container">
      <button
        className="Button-generic"
        onClick={() => setInitVaultExpanded(!initVaultExpanded)}
      >
        {initVaultExpanded ? "Collapse Vault Setup" : "Show Vault Setup"}
      </button>

      {initVaultExpanded && (
        <div
          style={{
            paddingLeft: "4vmin",
          }}
        >
          <span className="Section-header">{"Start a new Vault"}</span>
          <PubkeyInput
            setKey={setAdmin}
            labelText="Admin"
            value={admin?.toString()}
          />
          <PubkeyInput
            setKey={setWithdrawAuthority}
            labelText="Withdraw Authority"
            value={withdrawAuthority?.toString()}
          />
          <PubkeyInput
            setKey={setAssetOracle}
            labelText="Asset Oracle"
            value={assetOracle?.toString()}
          />
          <PubkeyInput
            setKey={setPaymentMint}
            labelText="Payment Mint"
            value={paymentMint?.toString()}
          />
          <PubkeyInput
            setKey={setAssetMint}
            labelText="Asset Mint"
            value={assetMint?.toString()}
          />
          <PercentageSlider
            label="Fee Rate (%)"
            value={feeRate}
            setValue={setFeeRate}
            step={0.0001}
            min={0}
            max={1}
          />
          <NumberInput
            label="Option Duration (seconds)"
            value={optionDuration}
            setValue={setOptionDuration}
            decimals={0}
            padTo={15}
            addWidth={6}
          />
          <NumberInput
            label="Nonce (Chosen arbitrarily)"
            value={nonce}
            setValue={setNonce}
            decimals={0}
            padTo={15}
            min={0}
          />
          <div className="Footnote">
            {
              "Tip: A week is 604800 seconds, a day is 86400 seconds, an hour is 3600 seconds"
            }
          </div>
          <div className="Footnote">
            {
              "Our mock USDC mint on devnet is 9dbktdo4aG25kDRz2p7nXPhoxLrsK6zEs4X8rrEM5VB8"
            }
          </div>
          <button className="Button-small" onClick={initVaultButton}>
            {"Initialize Spread Vault"}
          </button>
          <button className="Button-small" onClick={deriveVault}>
            {"Derive Existing Vault"}
          </button>
          {spreadVault && <div>{"Vault: " + spreadVault}</div>}
        </div>
      )}
      <hr className="hr-line-break"></hr>
    </div>
  );
};

export default InitVault;
