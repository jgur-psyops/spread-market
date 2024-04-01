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

export const deriveMarketEpoch = (
  programId: PublicKey,
  spreadVault: PublicKey,
  epoch: number,
) => {
  return PublicKey.findProgramAddressSync(
    [
      spreadVault.toBuffer(),
      new BN(epoch).toArrayLike(Buffer, "le", 4),
      Buffer.from("epoch", "utf-8"),
    ],
    programId
  );
};

export const deriveLpMint = (programId: PublicKey, spreadVault: PublicKey) => {
  return PublicKey.findProgramAddressSync(
    [spreadVault.toBuffer(), Buffer.from("lpMint", "utf-8")],
    programId
  );
};

export const deriveFundingPool = (
  programId: PublicKey,
  spreadVault: PublicKey
) => {
  return PublicKey.findProgramAddressSync(
    [spreadVault.toBuffer(), Buffer.from("fundingpool", "utf-8")],
    programId
  );
};

export const derivePremiumsPool = (
  programId: PublicKey,
  spreadVault: PublicKey
) => {
  return PublicKey.findProgramAddressSync(
    [spreadVault.toBuffer(), Buffer.from("premiumspool", "utf-8")],
    programId
  );
};

export const deriveFeePool = (programId: PublicKey, spreadVault: PublicKey) => {
  return PublicKey.findProgramAddressSync(
    [spreadVault.toBuffer(), Buffer.from("feepool", "utf-8")],
    programId
  );
};
