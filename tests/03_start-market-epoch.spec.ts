import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Spreadmarket } from "../target/types/spreadmarket";
import {
  initSpreadVault,
  initSpreadVaultAccs,
  startMarket,
} from "../packages/instructions";
import { assert } from "chai";
import {
  Ecosystem,
  Oracles,
  SetupTestUserOptions,
  adminKeypairs,
  createMintsIfNeeded,
  echoEcosystemInfo,
  getGenericEcosystem,
  getGenericOracles,
  mockUser,
  setupTestUser,
  userState,
} from "./utils/mock";
import { PublicKey, Transaction } from "@solana/web3.js";
import {
  deriveFeePool,
  deriveFundingPool,
  deriveLpMint,
  derivePremiumsPool,
  deriveSpreadVault,
} from "../packages/pdas";
import { assertKeysEqual } from "./utils/genericTests";
import {
  DEFAULT_FEE_RATE,
  FIVE_SECONDS,
  SECONDS_PER_WEEK,
  u32MAX,
} from "./utils/common";
import { program } from "@coral-xyz/anchor/dist/cjs/native/system";
import { createMintToInstruction } from "@solana/spl-token";
import { BN } from "bn.js";

const verbose: boolean = true;

describe("Start Market", () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  const program: Program<Spreadmarket> = anchor.workspace.Spreadmarket;
  const provider = anchor.getProvider() as anchor.AnchorProvider;
  const wallet = provider.wallet as anchor.Wallet;

  let ecosystem: Ecosystem = getGenericEcosystem();
  let oracles: Oracles = getGenericOracles();

  let spreadVault: PublicKey;
  const nonce = 0;
  const callStrikes = [
    new BN(0),
    new BN(0),
    new BN(0),
    new BN(0),
    new BN(0),
    new BN(0),
    new BN(105),
    new BN(110),
  ];
  const putStrikes = [
    new BN(0),
    new BN(0),
    new BN(0),
    new BN(0),
    new BN(0),
    new BN(0),
    new BN(90),
    new BN(95),
  ];

  before(async () => {
    [spreadVault] = deriveSpreadVault(
      program.programId,
      ecosystem.usdcMint.publicKey,
      ecosystem.tokenAMint.publicKey,
      nonce
    );
  });

  it("Start an option market - happy path", async () => {
    let vaultAdmin = userState.vaultAdmin;

    let ix = await startMarket(
      program,
      callStrikes,
      putStrikes,
      new BN(oracles.tokenAPrice * 10 ** 6), // TODOO price decimals const
      new BN(oracles.tokenAPrice * 10 ** 6),
      0, // epoch starts at 0
      vaultAdmin.wallet.publicKey,
      spreadVault,
      oracles.tokenAOracle.publicKey
    );
    try {
      await vaultAdmin.userSpreadProgram.provider.sendAndConfirm(
        new Transaction().add(ix)
      );
    } catch (err) {
      console.log(err);
    }
  });
});
