import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PublicKey, Transaction } from "@solana/web3.js";
import { Spreadmarket } from "../target/types/spreadmarket";
import {
  Ecosystem,
  getGenericEcosystem,
  createMintsIfNeeded,
  echoEcosystemInfo,
  userState,
} from "./utils/mock";
import { deposit } from "../packages/instructions";
import { deriveSpreadVault } from "../packages/pdas";
import { BN } from "bn.js";
import {
  getAssociatedTokenAddressSync,
  createAssociatedTokenAccountInstruction,
  getMint,
} from "@solana/spl-token";
import { getTokenBalance } from "./utils/common";
import { assert } from "chai";

const verbose: boolean = true;

describe("Deposit", () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  const program: Program<Spreadmarket> = anchor.workspace.Spreadmarket;
  const provider = anchor.getProvider() as anchor.AnchorProvider;
  const wallet = provider.wallet as anchor.Wallet;

  let ecosystem: Ecosystem = getGenericEcosystem();

  let spreadVault: PublicKey;
  const nonce = 0;
  let initialDeposit = 10 * 10 ** ecosystem.usdcDecimals;
  let secondDeposit = 5 * 10 ** ecosystem.usdcDecimals;

  before(async () => {
    await createMintsIfNeeded(wallet.publicKey, provider, ecosystem);

    [spreadVault] = deriveSpreadVault(
      program.programId,
      ecosystem.usdcMint.publicKey,
      ecosystem.tokenAMint.publicKey,
      nonce
    );
  });

  it("(user 0) deposit into vault", async () => {
    let users = userState.users;
    let spreadVaultAcc = await program.account.spreadVault.fetch(spreadVault);

    let tx = new Transaction();
    let lpAta = getAssociatedTokenAddressSync(
      spreadVaultAcc.lpMint,
      users[0].wallet.publicKey
    );
    let lpExists = await provider.connection.getAccountInfo(lpAta);
    if (!lpExists) {
      tx.add(
        createAssociatedTokenAccountInstruction(
          users[0].wallet.publicKey,
          lpAta,
          users[0].wallet.publicKey,
          spreadVaultAcc.lpMint
        )
      );
    }
    tx.add(
      await deposit(
        program,
        users[0].wallet.publicKey,
        spreadVault,
        ecosystem.usdcMint.publicKey,
        spreadVaultAcc.lpMint,
        users[0].usdcAccount,
        lpAta,
        new BN(initialDeposit)
      )
    );

    const amtLpBefore = 0; // account doesn't exist
    const [userUsdcBefore, vaultUsdcBefore] = await Promise.all([
      getTokenBalance(provider, users[0].usdcAccount),
      getTokenBalance(provider, spreadVaultAcc.fundingPool),
    ]);

    await users[0].userSpreadProgram.provider.sendAndConfirm(
      new Transaction().add(tx)
    );

    const [userUsdcAfter, vaultUsdcAfter, amtLpAfter] = await Promise.all([
      getTokenBalance(provider, users[0].usdcAccount),
      getTokenBalance(provider, spreadVaultAcc.fundingPool),
      getTokenBalance(provider, lpAta),
    ]);

    if (verbose) {
      console.log("user 0 deposit");
      console.log(
        " usdc deposited: " + (userUsdcBefore - userUsdcAfter).toLocaleString()
      );
      console.log(" lp gained: " + (amtLpAfter - amtLpBefore).toLocaleString());
    }

    assert.equal(userUsdcBefore - userUsdcAfter, initialDeposit);
    assert.equal(vaultUsdcAfter - vaultUsdcBefore, initialDeposit);
    assert.equal(amtLpAfter - amtLpBefore, initialDeposit);
  });

  it("(user 1) deposit into vault with existing assets", async () => {
    let users = userState.users;
    let spreadVaultAcc = await program.account.spreadVault.fetch(spreadVault);

    let tx = new Transaction();
    let lpAta = getAssociatedTokenAddressSync(
      spreadVaultAcc.lpMint,
      users[1].wallet.publicKey
    );
    let lpExists = await provider.connection.getAccountInfo(lpAta);
    if (!lpExists) {
      tx.add(
        createAssociatedTokenAccountInstruction(
          users[1].wallet.publicKey,
          lpAta,
          users[1].wallet.publicKey,
          spreadVaultAcc.lpMint
        )
      );
    }
    tx.add(
      await deposit(
        program,
        users[1].wallet.publicKey,
        spreadVault,
        ecosystem.usdcMint.publicKey,
        spreadVaultAcc.lpMint,
        users[1].usdcAccount,
        lpAta,
        new BN(secondDeposit)
      )
    );

    const amtLpBefore = 0; // account doesn't exist
    const [userUsdcBefore, vaultUsdcBefore, lpMintBefore] = await Promise.all([
      getTokenBalance(provider, users[1].usdcAccount),
      getTokenBalance(provider, spreadVaultAcc.fundingPool),
      getMint(provider.connection, spreadVaultAcc.lpMint),
    ]);

    await users[1].userSpreadProgram.provider.sendAndConfirm(
      new Transaction().add(tx)
    );

    const [userUsdcAfter, vaultUsdcAfter, amtLpAfter, lpMintAfter] =
      await Promise.all([
        getTokenBalance(provider, users[1].usdcAccount),
        getTokenBalance(provider, spreadVaultAcc.fundingPool),
        getTokenBalance(provider, lpAta),
        getMint(provider.connection, spreadVaultAcc.lpMint),
      ]);

    if (verbose) {
      console.log("user 1 deposit");
      console.log(
        " usdc deposited: " + (userUsdcBefore - userUsdcAfter).toLocaleString()
      );
      console.log(" lp gained: " + (amtLpAfter - amtLpBefore).toLocaleString());
    }

    assert.equal(userUsdcBefore - userUsdcAfter, secondDeposit);
    assert.equal(vaultUsdcAfter - vaultUsdcBefore, secondDeposit);

    let lpMintSupplyBefore = Number(lpMintBefore.supply);
    let lpMintSupplyAfter = Number(lpMintAfter.supply);
    let expectedLpMinted = Math.floor(
      (secondDeposit / (vaultUsdcBefore + secondDeposit)) * lpMintSupplyBefore
    );
    assert.equal(amtLpAfter - amtLpBefore, expectedLpMinted);
    assert.equal(lpMintSupplyAfter, lpMintSupplyBefore + expectedLpMinted);
  });
});
