import {
  AnchorWallet,
  useAnchorWallet,
  useConnection,
} from "@solana/wallet-adapter-react";
import { useMemo } from "react";
import { initializeSpreadProgram } from "../utils/programs";
import { PublicKey } from "@solana/web3.js";
import { NetworkOption } from "../utils/types";

const noop = () => {
  //
};

/**
 *
 * @returns Spread Market Anchor Program
 */
export const useSpreadProgram = () => {
  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  // TODO hook to check network for mainnet...
  const network: NetworkOption = NetworkOption.Devnet;

  return useMemo(() => {
    const _anchorWallet = wallet
      ? wallet
      : ({
          publicKey: PublicKey.default,
          signTransaction: noop as () => Promise<any>,
          signAllTransactions: noop as () => Promise<any>,
        } as AnchorWallet);
    return initializeSpreadProgram(
      connection,
      _anchorWallet,
      network === NetworkOption.Devnet
    );
  }, [connection, network, wallet]);
};
