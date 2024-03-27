import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Spreadmarket } from "../target/types/spreadmarket";
import { initSpreadVault } from "../packages/instructions";
import { assert } from "chai";
import {
  Ecosystem,
  createMintsIfNeeded,
  echoEcosystemInfo,
  getGenericEcosystem,
} from "./utils/mock";
import { PublicKey, Transaction } from "@solana/web3.js";
import { deriveSpreadVault } from "../packages/pdas";
import { assertKeysEqual } from "./utils/genericTests";

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
  });

  it("Init new spread vault - happy path", async () => {
    [spreadVault] = deriveSpreadVault(
      program.programId,
      ecosystem.usdcMint.publicKey,
      ecosystem.tokenAMint.publicKey,
      nonce
    );

    let ix = await initSpreadVault(
      program,
      wallet.publicKey,
      wallet.publicKey,
      ecosystem.usdcMint.publicKey,
      ecosystem.tokenAMint.publicKey,
      nonce
    );
    await program.provider.sendAndConfirm(new Transaction().add(ix));

    let vault = await program.account.spreadVault.fetch(spreadVault);
    assertKeysEqual(vault.paymentMint, ecosystem.usdcMint.publicKey);
    assertKeysEqual(vault.assetMint, ecosystem.tokenAMint.publicKey);
    assertKeysEqual(vault.admin, wallet.publicKey);

    assert.equal(vault.nonce, nonce);
    assert.equal(vault.paymentMintDecimals, ecosystem.usdcDecimals);
    assert.equal(vault.assetMintDecimals, ecosystem.tokenADecimals);
  });
});
