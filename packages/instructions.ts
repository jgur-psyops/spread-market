import { Program } from "@coral-xyz/anchor";
import { TOKEN_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/utils/token";
import { PublicKey, SYSVAR_RENT_PUBKEY, SystemProgram } from "@solana/web3.js";
import BN from "bn.js";
import { Spreadmarket } from "../target/types/spreadmarket";
import {
  deriveFeePool,
  deriveFundingPool,
  deriveLpMint,
  derivePremiumsPool,
  deriveSpreadVault,
} from "./pdas";

export const initSpreadVault = (
  program: Program<Spreadmarket>,
  payer: PublicKey,
  admin: PublicKey,
  withdrawAuthority: PublicKey,
  paymentMint: PublicKey,
  assetMint: PublicKey,
  feeRate: number,
  option_duration: number,
  nonce: number = 0
) => {
  const [spreadVault] = deriveSpreadVault(
    program.programId,
    paymentMint,
    assetMint,
    nonce
  );

  const ix = program.methods
    .initVault(nonce, admin, withdrawAuthority, feeRate, option_duration)
    .accounts({
      payer: payer,

      spreadVault: spreadVault,
      paymentMint: paymentMint,
      assetMint: assetMint,

      tokenProgram: TOKEN_PROGRAM_ID,
      rent: SYSVAR_RENT_PUBKEY,
      systemProgram: SystemProgram.programId,
    })
    .instruction();

  return ix;
};

export const initSpreadVaultAccs = (
  program: Program<Spreadmarket>,
  admin: PublicKey,
  spreadVault: PublicKey,
  paymentMint: PublicKey
) => {
  const [lpMint] = deriveLpMint(program.programId, spreadVault);
  const [fundingPool] = deriveFundingPool(program.programId, spreadVault);
  const [premiumsPool] = derivePremiumsPool(program.programId, spreadVault);
  const [feepool] = deriveFeePool(program.programId, spreadVault);

  const ix = program.methods
    .initVaultAccs()
    .accounts({
      admin: admin,
      spreadVault: spreadVault,
      paymentMint: paymentMint,

      lpMint: lpMint,
      fundingPool: fundingPool,
      premiumsPool: premiumsPool,
      feePool: feepool,

      tokenProgram: TOKEN_PROGRAM_ID,
      rent: SYSVAR_RENT_PUBKEY,
      systemProgram: SystemProgram.programId,
    })
    .instruction();

  return ix;
};

export const setVol = (
  program: Program<Spreadmarket>,
  admin: PublicKey,
  spreadVault: PublicKey,
  volatility: BN,
  riskFreeRate: number
) => {
  const ix = program.methods
    .setVol(volatility, riskFreeRate)
    .accounts({
      admin: admin,
      spreadVault: spreadVault,
    })
    .instruction();

  return ix;
};
