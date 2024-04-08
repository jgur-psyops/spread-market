import {
  SendTransactionOptions,
  WalletNotConnectedError,
} from "@solana/wallet-adapter-base";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import {
  Connection,
  PublicKey,
  Signer,
  Transaction,
  TransactionError,
  VersionedTransaction,
} from "@solana/web3.js";
import { AnchorProvider, Provider } from "@coral-xyz/anchor";
import { splTokenProgram } from "@coral-xyz/spl-token";

/**
 * Minimum cost in lamports for a TX.
 */
export const BASE_NETWORK_FEES = 0.00001 * 10 ** 9;
export const TX_TIMEOUT_DEFAULT = 30000;
export const MAX_TX_RETRIES_DEFAULT = 10;

/**
 * Returns connection and context information for sending and confirming a tx with sendTransaction.
 *
 * Signs tx as needed.
 * @param wallet
 * @param userWalletKey
 * @param rpcEndpoint - typically connection.rpcEndpoint
 * @param tx - gets partial signed (as needed)
 * @param signers
 * @returns
 */
export const prepareSimpleTx = async (
  wallet: AnchorWallet | undefined,
  userWalletKey: PublicKey | null,
  rpcEndpoint: string,
  tx: Transaction | VersionedTransaction,
  signers: Signer[]
) => {
  if (!wallet || !userWalletKey) {
    console.error("Tried to refresh tx sender but no wallet was connected.");
    throw new WalletNotConnectedError();
  }

  const relaxedConnection = new Connection(rpcEndpoint, {
    commitment: "confirmed",
    confirmTransactionInitialTimeout: TX_TIMEOUT_DEFAULT,
  });

  const {
    context: { slot: minContextSlot },
    value: { blockhash, lastValidBlockHeight },
  } = await relaxedConnection.getLatestBlockhashAndContext();

  if ("version" in tx) {
    // tx is a VersionedTransaction
    if (signers.length > 0) tx.sign([...signers]);
  } else {
    // tx is a Transaction
    (tx as Transaction).recentBlockhash = blockhash;
    (tx as Transaction).feePayer = wallet.publicKey;
    if (signers.length > 0) (tx as Transaction).partialSign(...signers);
  }

  return { relaxedConnection, minContextSlot, blockhash, lastValidBlockHeight };
};

/**
 * Send a basic single tx and return the promise for the confirmation.
 */
export const prepareAndSendTransaction = async (
  wallet: AnchorWallet | undefined,
  userWalletKey: PublicKey | null,
  rpcEndpoint: string,
  tx: Transaction | VersionedTransaction,
  signers: Signer[],
  sendTransaction: (
    transaction: Transaction | VersionedTransaction,
    connection: Connection,
    options: SendTransactionOptions
  ) => Promise<string>
) => {
  const { relaxedConnection, minContextSlot, blockhash, lastValidBlockHeight } =
    await prepareSimpleTx(wallet, userWalletKey, rpcEndpoint, tx, signers);
  try {
    const signature = await sendTransaction(tx, relaxedConnection, {
      minContextSlot,
      maxRetries: MAX_TX_RETRIES_DEFAULT,
    });

    const resp = await relaxedConnection.confirmTransaction({
      blockhash,
      lastValidBlockHeight,
      signature,
    });

    if (resp.value.err) {
      throw new TxError(resp.value.err, [signature]);
    }

    return signature;
  } catch (error) {
    const signatures = tx.signatures;
    const sgx = signatures.map((s) => {
      if ("signature" in s) {
        // is signature
        return s.signature?.toString() ?? "";
      } else {
        // unintarray
        const buffer = Buffer.from(s);
        return buffer.toString();
      }
    });
    throw new TxError(error as TransactionError, sgx);
  }
};

export class TxError extends Error {
  error: TransactionError;
  signatures: string[];
  logs: string[] | undefined;
  constructor(
    error: TransactionError | Error,
    signatures: string[],
    message?: string
  ) {
    super(message);
    this.error = error;
    this.signatures = signatures;
  }
}
