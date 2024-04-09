import React, { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { VAULT_TO_NAME } from "../constants";
import {
  getAssociatedTokenAddressSync,
  getAccount,
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction } from "@solana/web3.js";
import BN from "bn.js";
import useSendTxLogic from "../hooks/useSendTx";
import { useSpreadProgram } from "../hooks/useSpreadProgram";
import { deposit } from "../package/instructions";
import { NumberInput } from "../utils/primitives";

export const LpPage = () => {
  const { key } = useParams();
  const wallet = useAnchorWallet();
  const program = useSpreadProgram();
  const { sendTx } = useSendTxLogic();

  const [depositAmount, setDepositAmount] = useState(0);

  const depositButton = async () => {
    if (wallet && program && key && depositAmount != 0) {
      try {
        let vaultKey = new PublicKey(key);
        let vault = await program.account.spreadVault.fetch(vaultKey);
        let userUsdcAta = getAssociatedTokenAddressSync(
          vault.paymentMint,
          wallet.publicKey
        );
        let userLpAta = getAssociatedTokenAddressSync(
          vault.lpMint,
          wallet.publicKey
        );

        let tx = new Transaction();
        try {
          await getAccount(program.provider.connection, userLpAta);
        } catch (err) {
          tx.add(
            createAssociatedTokenAccountInstruction(
              wallet.publicKey,
              userLpAta,
              wallet.publicKey,
              vault.lpMint
            )
          );
        }

        tx.add(
          await deposit(
            program,
            wallet.publicKey,
            vaultKey,
            vault.paymentMint,
            vault.lpMint,
            userUsdcAta,
            userLpAta,
            new BN(depositAmount * 10 ** vault.paymentMintDecimals)
          )
        );

        let sig = await sendTx(tx);

        console.log("sig: " + sig);
        console.log("deposit to: " + vaultKey);
      } catch (error) {
        console.error(error);
      }
    } else {
      alert("Missing some required input");
    }
  };
  return (
    <div>
      {"Deposit into the " + VAULT_TO_NAME.get(key!) + " Vault"}
      <div>{"Expected Yield: 99.999%"}</div>
      <NumberInput
        label={"Amount to deposit"}
        value={depositAmount}
        setValue={setDepositAmount}
        decimals={6}
        padTo={10}
      />
      <button className="Button-small" onClick={depositButton}>
        {"Deposit"}
      </button>
    </div>
  );
};

export default LpPage;
