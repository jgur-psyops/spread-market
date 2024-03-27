import { Program } from "@coral-xyz/anchor";
import { TOKEN_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/utils/token";
import { PublicKey, SYSVAR_RENT_PUBKEY, SystemProgram } from "@solana/web3.js";
import BN from "bn.js";
import { Spreadmarket } from "../target/types/spreadmarket";
import { deriveSpreadVault } from "./pdas";

export const initSpreadVault = (
    program: Program<Spreadmarket>,
    payer: PublicKey,
    admin: PublicKey,
    paymentMint: PublicKey,
    assetMint: PublicKey,
    nonce: number = 0
  ) => {
    const [spreadVault] = deriveSpreadVault(
        program.programId,
        paymentMint,
        assetMint,
        nonce
      );

    const ix = program.methods
      .initVault(nonce, admin)
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