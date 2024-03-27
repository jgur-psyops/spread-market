import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Spreadmarket } from "../target/types/spreadmarket";
import { initSpreadVault, initSpreadVaultAccs } from "../packages/instructions";
import { assert } from "chai";
import {
  Ecosystem,
  SetupTestUserOptions,
  adminKeypairs,
  createMintsIfNeeded,
  echoEcosystemInfo,
  getGenericEcosystem,
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
import { SECONDS_PER_WEEK, u32MAX } from "./utils/common";
import { program } from "@coral-xyz/anchor/dist/cjs/native/system";
import { createMintToInstruction } from "@solana/spl-token";

const verbose: boolean = true;

describe("spreadmarket", () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  const program: Program<Spreadmarket> = anchor.workspace.Spreadmarket;
  const provider = anchor.getProvider() as anchor.AnchorProvider;
  const wallet = provider.wallet as anchor.Wallet;

  let ecosystem: Ecosystem = getGenericEcosystem();

  let spreadVault: PublicKey;
  const nonce = 0;

  before(async () => {
    await createMintsIfNeeded(wallet.publicKey, provider, ecosystem);

    if (verbose) {
      echoEcosystemInfo(ecosystem, {
        skipWsol: true,
        skipUsdc: false,
        skipA: false,
        skipB: true,
      });
      console.log("");
    }

    await createMockUsers();
  });

  it("Init new spread vault - happy path", async () => {
    let vaultAdmin = userState.vaultAdmin;
    [spreadVault] = deriveSpreadVault(
      program.programId,
      ecosystem.usdcMint.publicKey,
      ecosystem.tokenAMint.publicKey,
      nonce
    );

    let initIx = await initSpreadVault(
      program,
      vaultAdmin.wallet.publicKey,
      vaultAdmin.wallet.publicKey,
      vaultAdmin.wallet.publicKey,
      ecosystem.usdcMint.publicKey,
      ecosystem.tokenAMint.publicKey,
      u32MAX * 0.01, // 1%
      SECONDS_PER_WEEK,
      nonce
    );

    let initAccsIx = await initSpreadVaultAccs(
      program,
      vaultAdmin.wallet.publicKey,
      spreadVault,
      ecosystem.usdcMint.publicKey
    );
    await vaultAdmin.userSpreadProgram.provider.sendAndConfirm(
      new Transaction().add(initIx, initAccsIx)
    );

    const [lpMint] = deriveLpMint(program.programId, spreadVault);
    const [fundingPool] = deriveFundingPool(program.programId, spreadVault);
    const [premiumsPool] = derivePremiumsPool(program.programId, spreadVault);
    const [feePool] = deriveFeePool(program.programId, spreadVault);

    let vault = await program.account.spreadVault.fetch(spreadVault);
    assertKeysEqual(vault.key, spreadVault);
    assertKeysEqual(vault.paymentMint, ecosystem.usdcMint.publicKey);
    assertKeysEqual(vault.assetMint, ecosystem.tokenAMint.publicKey);
    assertKeysEqual(vault.admin, vaultAdmin.wallet.publicKey);
    assertKeysEqual(vault.withdrawAuthority, vaultAdmin.wallet.publicKey);
    assertKeysEqual(vault.lpMint, lpMint);
    assertKeysEqual(vault.fundingPool, fundingPool);
    assertKeysEqual(vault.premiumsPool, premiumsPool);
    assertKeysEqual(vault.feePool, feePool);

    assert.equal(vault.nonce, nonce);
    assert.equal(vault.paymentMintDecimals, ecosystem.usdcDecimals);
    assert.equal(vault.assetMintDecimals, ecosystem.tokenADecimals);
  });

  /**
   * Create users, fund their SOL accounts, generate all ATAs and fund them, and init the user
   * program to simulate sending txes as that user.
   *
   * Creates the admin and global admin, generates all ATAs for them, but only funds them with SOL
   */
  const createMockUsers = async () => {
    const options: SetupTestUserOptions = {
      spreadProgram: program,
      forceWallet: undefined,
      wsolMint: ecosystem.wsolMint.publicKey,
      tokenAMint: ecosystem.tokenAMint.publicKey,
      tokenBMint: ecosystem.tokenBMint.publicKey,
      usdcMint: ecosystem.usdcMint.publicKey,
      skipSetupTx: false,
    };

    for (let i = 0; i < userState.numUsers; i++) {
      userState.users.push(
        await setupTestUser(provider, wallet.payer, options)
      );
    }

    // fund wsol/usdc/A/B accounts
    let tx: Transaction = new Transaction();
    for (let i = 0; i < userState.numUsers; i++) {
      tx.add(
        createMintToInstruction(
          ecosystem.wsolMint.publicKey,
          userState.users[i].wsolAccount,
          wallet.publicKey,
          BigInt(1_000) * BigInt(10 ** ecosystem.wsolDecimals)
        )
      );
      tx.add(
        createMintToInstruction(
          ecosystem.usdcMint.publicKey,
          userState.users[i].usdcAccount,
          wallet.publicKey,
          BigInt(1_000) * BigInt(10 ** ecosystem.usdcDecimals)
        )
      );
      tx.add(
        createMintToInstruction(
          ecosystem.tokenAMint.publicKey,
          userState.users[i].tokenAAccount,
          wallet.publicKey,
          BigInt(1_000) * BigInt(10 ** ecosystem.tokenADecimals)
        )
      );
      tx.add(
        createMintToInstruction(
          ecosystem.tokenBMint.publicKey,
          userState.users[i].tokenBAccount,
          wallet.publicKey,
          BigInt(1_000) * BigInt(10 ** ecosystem.tokenBDecimals)
        )
      );
    }

    /// Create and fund the admins
    options.forceWallet = adminKeypairs[0];
    userState.vaultAdmin = await setupTestUser(provider, wallet.payer, options);

    // The global admin should be the provider, and was already created in the initial test.
    options.forceWallet = wallet.payer;
    userState.globalProgramAdmin = await setupTestUser(
      provider,
      wallet.payer,
      options
    );

    await program.provider.sendAndConfirm(tx);
  };
});
