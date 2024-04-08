import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import { useCallback } from "react";
import { prepareAndSendTransaction } from "../utils/tx-utils";
import { Signer, Transaction } from "@solana/web3.js";



const useSendTxLogic = () => {
  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  const { publicKey: userWalletKey, sendTransaction } = useWallet();

  const sendTx = useCallback(
    async (tx: Transaction, signers: Signer[] = []) => {
      return prepareAndSendTransaction(
        wallet,
        userWalletKey,
        connection.rpcEndpoint,
        tx,
        signers,
        sendTransaction
      );
    },
    [userWalletKey, wallet, sendTransaction, connection]
  );

  return { sendTx };
};

export default useSendTxLogic;
