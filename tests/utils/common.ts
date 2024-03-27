import { AnchorProvider } from "@coral-xyz/anchor";
import { RawAccount, AccountLayout } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";

/** 4_294_967_295 */
export const u32MAX: number = 4_294_967_295;
/** 65_535 */
export const u16MAX: number = 65_535;
/** 255 */
export const u8MAX: number = 255;
/** 604800 */
export const SECONDS_PER_WEEK: number = 604800;
/** 5 */
export const FIVE_SECONDS: number = 5;
/** 1%, as u32 */
export const DEFAULT_FEE_RATE = Math.floor(u32MAX * 0.01);

/**
 * Convert a percentage that has been expressed as some number out of u32 max into a human readable
 * percentage as float. E.g. `u32Max / 2` returns .5
 * @param u32
 */
export const u32toPercent = (u32: number) => {
  return u32 / u32MAX;
};

/**
 * Returns the balance of a token account, in whatever currency the account is in.
 * @param provider
 * @param account
 * @returns
 */
export const getTokenBalance = async (
  provider: AnchorProvider,
  account: PublicKey
) => {
  const accountInfo = await provider.connection.getAccountInfo(account);
  if (!accountInfo) {
    console.error("Tried to read balance of acc that doesn't exist");
    return 0;
  }
  const data: RawAccount = AccountLayout.decode(accountInfo.data);
  if (data == undefined || data.amount == undefined) {
    return 0;
  }
  const amount: BigInt = data.amount;
  return Number(amount);
};
