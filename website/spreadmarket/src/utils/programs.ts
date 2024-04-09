import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { Connection, Commitment, ConfirmOptions } from "@solana/web3.js";
import {
  SPREAD_PROGRAM_DEVNET_KEY,
  SPREAD_PROGRAM_MAINNET_KEY,
} from "../constants";
import { Spreadmarket, IDL as SpreadmarketIDL } from "../package/idl";

export const initializeSpreadProgram = (
  connection: Connection,
  wallet: AnchorWallet,
  isDevnet: boolean
) => {
  const programKey: string = isDevnet
    ? SPREAD_PROGRAM_DEVNET_KEY
    : SPREAD_PROGRAM_MAINNET_KEY;
  const commitment: Commitment = "confirmed";
  const confirmOptions: ConfirmOptions = {
    commitment: commitment,
    preflightCommitment: commitment,
    skipPreflight: false,
  };
  const provider = new AnchorProvider(connection, wallet, confirmOptions);
  const program: Program<Spreadmarket> = new Program(
    SpreadmarketIDL,
    programKey,
    provider
  );
  return program;
};
