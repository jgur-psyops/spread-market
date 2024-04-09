import { Keypair } from "@solana/web3.js";
import * as buffer from "buffer";
window.Buffer = buffer.Buffer;

export const SPREAD_PROGRAM_DEVNET_KEY =
  "2MWAqfKiQ1BTtW6sdBaAWrS9GNjQm1ixdjvhYabuFZeH";
// TODO
export const SPREAD_PROGRAM_MAINNET_KEY =
  "2MWAqfKiQ1BTtW6sdBaAWrS9GNjQm1ixdjvhYabuFZeH";

/** 4_294_967_295 */
export const u32MAX: number = 4_294_967_295;
/**
 * Convert a percentage that has been expressed as some number out of u32 max into a human readable
 * percentage as float. E.g. `u32Max / 2` returns .5
 * @param u32
 */
export const u32toPercent = (u32: number) => {
  return u32 / u32MAX;
};
/** 65_535 */
export const u16MAX: number = 65_535;
/** 255 */
export const u8MAX: number = 255;
/** 604800 */
export const SECONDS_PER_WEEK: number = 604800;

/**
 * Maps a mint to the decimals it uses for native currency.
 */
export const MINT_TO_DECIMALS = new Map<string, number>([
  // SOL is the same on devnet and mainnet.
  ["So11111111111111111111111111111111111111112", 9],

  // devnet mints
  ["9dbktdo4aG25kDRz2p7nXPhoxLrsK6zEs4X8rrEM5VB8", 6], // usdc

  // Mainnet mints
  ["EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", 6], // usdc
]);

// Exposes the secret key completely, which would be a **Very Bad Idea** if this wasn't a disposable
// devnet mint
export const USDC_MINT_DEVNET_KEYPAIR = Keypair.fromSecretKey(
  new Uint8Array([
    2, 15, 5, 216, 188, 23, 131, 59, 219, 25, 238, 43, 180, 101, 197, 197, 208,
    168, 151, 204, 34, 140, 122, 34, 143, 149, 202, 213, 245, 86, 191, 235, 128,
    61, 180, 63, 156, 104, 147, 39, 26, 222, 159, 12, 3, 252, 41, 234, 207, 154,
    171, 149, 251, 98, 246, 160, 124, 217, 157, 179, 249, 0, 172, 251,
  ])
);
export const USDC_MINT_DEVNET = "9dbktdo4aG25kDRz2p7nXPhoxLrsK6zEs4X8rrEM5VB8";
export const USDC_MINT_MAINNET = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";


/**
 * ************* Initial settings *****************
 * * Fee rate: 0%
 * * Risk free: 5%
 * * Vol: 125%
 * * Nonce: 0
 * * Duration: 601200  (one hour less than one week)
 */
export const SOL_VAULT_DEVNET = "9U3oKxEn2i6uo6hBHWv2NFsco1ZNJQdRo96vK1CBPCvG";

export const MINT_TO_COINGECKO_API = new Map<string, number>([
  // SOL is the same on devnet and mainnet.
  ["So11111111111111111111111111111111111111112", 9],

  // devnet mints
  // TODO

  // Mainnet mints
  // TODO
]);