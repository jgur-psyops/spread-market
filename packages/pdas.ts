import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";

export const deriveSpreadVault = (
    programId: PublicKey,
    paymentMint: PublicKey,
    assetMint: PublicKey,
    nonce: number = 0
  ) => {
    return PublicKey.findProgramAddressSync(
      [
        paymentMint.toBuffer(),
        assetMint.toBuffer(),
        new BN(nonce).toArrayLike(Buffer, "le", 2),
        Buffer.from("spreadvault", "utf-8"),
      ],
      programId
    );
  };