import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { BN } from "@coral-xyz/anchor";
import { useCallback, useState } from "react";
import {
  MINT_TO_DECIMALS,
  USDC_MINT_DEVNET,
  USDC_MINT_DEVNET_KEYPAIR,
} from "../constants";
import {
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import {
  PublicKey,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { NumberInput } from "../utils/primitives";
import useSendTxLogic from "../hooks/useSendTx";

export const Faucet = () => {
  const [amount, setAmount] = useState<number>(100);
  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  const { sendTx } = useSendTxLogic();

  const FaucetMint = async () => {
    if (!wallet) {
      console.error("Wallet is not connected!");
      return;
    }

    const mintKey = new PublicKey(USDC_MINT_DEVNET);
    const ataKey = getAssociatedTokenAddressSync(mintKey, wallet.publicKey);
    const ata = await connection.getAccountInfo(ataKey);

    const ixes: TransactionInstruction[] = [];
    if (!ata) {
      ixes.push(
        createAssociatedTokenAccountInstruction(
          wallet.publicKey,
          ataKey,
          wallet.publicKey,
          mintKey
        )
      );
    }
    ixes.push(
      createMintToInstruction(
        mintKey,
        ataKey,
        mintKey,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        amount * 10 ** MINT_TO_DECIMALS.get(USDC_MINT_DEVNET)!
      )
    );

    const tx: Transaction = new Transaction();
    tx.add(...ixes);
    await sendTx(tx, [USDC_MINT_DEVNET_KEYPAIR]);
    console.log(
      "Minted from faucet, wallet should have gained: " + amount + " fake USDC"
    );
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      <div className="Standard-input-row">
        <NumberInput
          label="Amount to Mint"
          value={amount}
          setValue={setAmount}
          padTo={5}
          decimals={0}
          addWidth={10}
        />
        <div className="tiny-vertical-divider-one-char"></div>
        <button className="Button-small" onClick={FaucetMint}>
          Mint Mock USDC
        </button>
      </div>
    </div>
  );
};
