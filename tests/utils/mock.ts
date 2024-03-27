import { AnchorProvider, Program, Wallet } from "@coral-xyz/anchor";
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  Signer,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { Spreadmarket } from "../../target/types/spreadmarket";
import {
  MintLayout,
  TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  createInitializeMintInstruction,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";

export type UserState = {
  users: mockUser[];
  numUsers: number;
  /** Uses preset adminKeypairs[0] */
  vaultAdmin: mockUser;
  /** The program owner is also the provider wallet */
  globalProgramAdmin: mockUser;
};

export let userState: UserState = {
  users: [],
  numUsers: 2,
  vaultAdmin: undefined,
  globalProgramAdmin: undefined,
}

export type Ecosystem = {
  /** A generic wsol mint with 9 decimals (same as native) */
  wsolMint: Keypair;
  /** A generic spl token mint */
  tokenAMint: Keypair;
  /** A generic spl token mint */
  tokenBMint: Keypair;
  /** The mint for USDC */
  usdcMint: Keypair;
  /** 9 */
  wsolDecimals: number;
  /** Decimals for the token A */
  tokenADecimals: number;
  /** Decimals for the token B */
  tokenBDecimals: number;
  /** 6 */
  usdcDecimals: number;
};

/** Builds some random keypairs that are recycled between tests to use as mints */
export const mintKeypairs = [
  Keypair.generate(),
  Keypair.generate(),
  Keypair.generate(),
  Keypair.generate(),
];

/** Builds some random keypairs that are recycled between tests to use as vault admins */
export const adminKeypairs = [
  Keypair.generate(),
  Keypair.generate(),
  Keypair.generate(),
  Keypair.generate(),
];

/**
 * Random keypairs for all mints.
 *
 * 6 Decimals for usdc. 9 decimals for sol. 8 decimals to token A, 6 for token B
 * @returns
 */
export const getGenericEcosystem = () => {
  let ecosystem: Ecosystem = {
    wsolMint: mintKeypairs[0],
    tokenAMint: mintKeypairs[1],
    tokenBMint: mintKeypairs[2],
    usdcMint: mintKeypairs[3],
    wsolDecimals: 9,
    tokenADecimals: 8,
    tokenBDecimals: 6,
    usdcDecimals: 6,
  };
  return ecosystem;
};

/**
 * Print ecosystem info to console
 * @param ecosystem
 */
export const echoEcosystemInfo = (
  ecosystem: Ecosystem,
  { skipWsol = false, skipUsdc = false, skipA = false, skipB = false }
) => {
  if (!skipWsol) {
    console.log("wsol mint:........... " + ecosystem.wsolMint.publicKey);
    console.log("  wsol decimals...... " + ecosystem.wsolDecimals);
  }
  if (!skipUsdc) {
    console.log("usdc mint:........... " + ecosystem.usdcMint.publicKey);
    console.log("  usdc decimals:..... " + ecosystem.usdcDecimals);
  }
  if (!skipA) {
    console.log("token a mint:........ " + ecosystem.tokenAMint.publicKey);
    console.log("  token a decimals:.. " + ecosystem.tokenADecimals);
  }
  if (!skipB) {
    console.log("token b mint:........ " + ecosystem.tokenBMint.publicKey);
    console.log("  token b decimals:.. " + ecosystem.tokenBDecimals);
  }
};

export type mockUser = {
  wallet: Keypair;
  /** Users's ATA for wsol*/
  wsolAccount: PublicKey;
  /** Users's ATA for token A */
  tokenAAccount: PublicKey;
  /** Users's ATA for token B */
  tokenBAccount: PublicKey;
  /** Users's ATA for USDC */
  usdcAccount: PublicKey;
  /** A spread market program that uses the user's wallet */
  userSpreadProgram: Program<Spreadmarket> | undefined;
};

/**
 * Options to skip various parts of mock user setup
 */
export interface SetupTestUserOptions {
  spreadProgram: Program<Spreadmarket>;
  /** Force the mock user to use this keypair */
  forceWallet: Keypair;
  wsolMint: PublicKey;
  tokenAMint: PublicKey;
  tokenBMint: PublicKey;
  usdcMint: PublicKey;
  skipSetupTx: boolean;
}

/**
 * Creates and funds a user by transfering some SOL from a given wallet.
 *
 * Opens ATA for the user on all ecosystem mints
 *
 * Initializes a mock program to sign transactions as the user
 * @param provider
 * @param wallet - provider wallet, pays init and tx fees
 * @param options
 * @returns
 */
export const setupTestUser = async (
  provider: AnchorProvider,
  wallet: Keypair,
  options?: SetupTestUserOptions
) => {
  // Creates a user wallet with some SOL in it to pay tx fees
  const userWalletKeypair = options.forceWallet || Keypair.generate();
  const userWallet = userWalletKeypair.publicKey;
  let tx: Transaction = new Transaction();
  tx.add(
    SystemProgram.transfer({
      fromPubkey: wallet.publicKey,
      toPubkey: userWallet,
      lamports: 1000 * LAMPORTS_PER_SOL,
    })
  );

  let wsolAccount: PublicKey = PublicKey.default;
  if (options.wsolMint) {
    wsolAccount = getAssociatedTokenAddressSync(options.wsolMint, userWallet);
    tx.add(
      createAssociatedTokenAccountInstruction(
        wallet.publicKey,
        wsolAccount,
        userWallet,
        options.wsolMint
      )
    );
  }

  let usdcAccount: PublicKey = PublicKey.default;
  if (options.usdcMint) {
    usdcAccount = getAssociatedTokenAddressSync(options.usdcMint, userWallet);
    tx.add(
      createAssociatedTokenAccountInstruction(
        wallet.publicKey,
        usdcAccount,
        userWallet,
        options.usdcMint
      )
    );
  }

  let tokenAAccount: PublicKey = PublicKey.default;
  if (options.tokenAMint) {
    tokenAAccount = getAssociatedTokenAddressSync(
      options.tokenAMint,
      userWallet
    );
    tx.add(
      createAssociatedTokenAccountInstruction(
        wallet.publicKey,
        tokenAAccount,
        userWallet,
        options.tokenAMint
      )
    );
  }

  let tokenBAccount: PublicKey = PublicKey.default;
  if (options.tokenAMint) {
    tokenBAccount = getAssociatedTokenAddressSync(
      options.tokenBMint,
      userWallet
    );
    tx.add(
      createAssociatedTokenAccountInstruction(
        wallet.publicKey,
        tokenBAccount,
        userWallet,
        options.tokenBMint
      )
    );
  }

  if (!options.skipSetupTx) {
    await provider.sendAndConfirm(tx, [wallet]);
  }

  const user: mockUser = {
    wallet: userWalletKeypair,
    wsolAccount: wsolAccount,
    tokenAAccount: tokenAAccount,
    tokenBAccount: tokenBAccount,
    usdcAccount: usdcAccount,

    userSpreadProgram: options.spreadProgram
      ? getUserSpreadProgram(options.spreadProgram, userWalletKeypair)
      : undefined,
  };
  return user;
};

/**
 * Generates a mock program that can sign transactions as the user's wallet
 * @param program
 * @param userWallet
 * @returns
 */
export const getUserSpreadProgram = (
  program: Program<Spreadmarket>,
  userWallet: Keypair | Wallet
) => {
  const wallet =
    userWallet instanceof Keypair ? new Wallet(userWallet) : userWallet;
  const provider = new AnchorProvider(program.provider.connection, wallet, {});
  const userProgram = new Program(program.idl, program.programId, provider);
  return userProgram;
};

/**
 * Ixes to create a mint, the payer gains the Mint Tokens/Freeze authority
 * @param payer - pays account init fees, must sign, gains mint/freeze authority
 * @param provider
 * @param decimals
 * @param mintKeypair - (optional) generates random keypair if not provided, must sign
 * @param lamps - (optional) lamports to pay for created acc, fetches minimum for Mint exemption if
 * not provided
 * @returns ixes, and keypair of new mint
 */
export const createSimpleMint = async (
  payer: PublicKey,
  connection: Connection,
  decimals: number,
  mintKeypair?: Keypair,
  lamps?: number
) => {
  let mint = mintKeypair ? mintKeypair : Keypair.generate();
  let ixes: TransactionInstruction[] = [];
  const lamports = lamps
    ? lamps
    : await connection.getMinimumBalanceForRentExemption(MintLayout.span);
  ixes.push(
    SystemProgram.createAccount({
      fromPubkey: payer,
      newAccountPubkey: mint.publicKey,
      space: MintLayout.span,
      lamports: lamports,
      programId: TOKEN_PROGRAM_ID,
    })
  );
  ixes.push(
    createInitializeMintInstruction(
      mint.publicKey,
      decimals,
      payer,
      payer,
      TOKEN_PROGRAM_ID
    )
  );

  return { ixes, mint };
};

/**
 * Create Wsol, USDC, and Target Token mints if they have not already been init.
 */
export const createMintsIfNeeded = async (
  payer: PublicKey,
  provider: AnchorProvider,
  ecosystem: Ecosystem
) => {
  const lamps = await provider.connection.getMinimumBalanceForRentExemption(
    MintLayout.span
  );
  let tx: Transaction = new Transaction();
  const [solMintAcc, usdcMintAcc, tokenAMintAcc, tokenBMintAcc] =
    await Promise.all([
      provider.connection.getAccountInfo(ecosystem.wsolMint.publicKey),
      provider.connection.getAccountInfo(ecosystem.usdcMint.publicKey),
      provider.connection.getAccountInfo(ecosystem.tokenAMint.publicKey),
      provider.connection.getAccountInfo(ecosystem.tokenBMint.publicKey),
    ]);

  let signers: Signer[] = [];
  let { ixes: solIxes, mint: solMint } = await createSimpleMint(
    payer,
    provider.connection,
    ecosystem.wsolDecimals,
    ecosystem.wsolMint,
    lamps
  );
  if (!solMintAcc) {
    tx.add(...solIxes);
    signers.push(solMint);
  }

  let { ixes: usdcIxes, mint: usdcMint } = await createSimpleMint(
    payer,
    provider.connection,
    ecosystem.usdcDecimals,
    ecosystem.usdcMint,
    lamps
  );
  if (!usdcMintAcc) {
    tx.add(...usdcIxes);
    signers.push(usdcMint);
  }

  let { ixes: tokenAIxes, mint: tokenAMint } = await createSimpleMint(
    payer,
    provider.connection,
    ecosystem.tokenADecimals,
    ecosystem.tokenAMint,
    lamps
  );
  if (!tokenAMintAcc) {
    tx.add(...tokenAIxes);
    signers.push(tokenAMint);
  }

  let { ixes: tokenBIxes, mint: tokenBMint } = await createSimpleMint(
    payer,
    provider.connection,
    ecosystem.tokenBDecimals,
    ecosystem.tokenBMint,
    lamps
  );
  if (!tokenBMintAcc) {
    tx.add(...tokenBIxes);
    signers.push(tokenBMint);
  }

  if (tx.instructions.length > 0) {
    await provider.sendAndConfirm(tx, signers);
  }
};
