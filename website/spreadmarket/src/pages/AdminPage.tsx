import React, { useState } from "react";
import {
  PubkeyInput,
  NumberInput,
  PercentageSlider,
} from "../utils/primitives";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import useSendTxLogic from "../hooks/useSendTx";
import { useSpreadProgram } from "../hooks/useSpreadProgram";
import { initSpreadVault } from "../../../../packages/instructions";
import { PublicKey, Transaction } from "@solana/web3.js";
import { u32MAX } from "../constants";

export const AdminPage = () => {
  const wallet = useAnchorWallet();
  const program = useSpreadProgram();
  const { sendTx } = useSendTxLogic();

  const [initVaultExpanded, setInitVaultExpanded] = useState(true);

  const [admin, setAdmin] = useState(wallet?.publicKey || null);
  const [withdrawAuthority, setWithdrawAuthority] = useState(
    wallet?.publicKey || null
  );
  const [assetOracle, setAssetOracle] = useState<PublicKey | null>(null);
  const [paymentMint, setPaymentMint] = useState<PublicKey | null>(null);
  const [assetMint, setAssetMint] = useState<PublicKey | null>(null);
  const [feeRate, setFeeRate] = useState(0);
  const [optionDuration, setOptionDuration] = useState(0);
  const [nonce, setNonce] = useState(0);

  const handleSubmit = async () => {
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

        await sendTx(new Transaction().add(ix));
        console.log("tx sent!");
      } catch (error) {
        console.error(error);
      }
    } else {
      alert("Missing some required input");
    }
  };

  return (
    <div className="left-align-container">
      <button onClick={() => setInitVaultExpanded(!initVaultExpanded)}>
        {initVaultExpanded ? "Show Vault Setup" : "Collapse Vault Setup"} Form
      </button>

      {initVaultExpanded && (
        <div>
          <span className="Section-header">Start a new Vault</span>
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
            min={0}
            max={100}
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
          <button onClick={handleSubmit}>Initialize Spread Vault</button>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
