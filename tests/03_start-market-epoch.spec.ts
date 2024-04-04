import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Spreadmarket } from "../target/types/spreadmarket";
import {
  initSpreadVault,
  initSpreadVaultAccs,
  setVol,
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
  deriveMarketEpoch,
  derivePremiumsPool,
  deriveSpreadVault,
} from "../packages/pdas";
import { assertBNEqual, assertKeysEqual } from "./utils/genericTests";
import {
  DEFAULT_FEE_RATE,
  FIVE_SECONDS,
  PRICE_DECIMALS,
  RISK_FREE_DEFAULT,
  SECONDS_PER_WEEK,
  VOLATILITY_DEFAULT,
  u32MAX,
  u32toPercent,
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
  const nonce: number = 0;
  const epoch: number = 0;
  const tokenPrice = new BN(oracles.tokenAPrice * 10 ** PRICE_DECIMALS);
  const callStrikes = [
    new BN(0),
    new BN(0),
    new BN(0),
    new BN(0),
    new BN(0),
    new BN(0),
    new BN(105 * 10 ** PRICE_DECIMALS),
    new BN(110 * 10 ** PRICE_DECIMALS),
  ];
  const putStrikes = [
    new BN(0),
    new BN(0),
    new BN(0),
    new BN(0),
    new BN(0),
    new BN(0),
    new BN(90 * 10 ** PRICE_DECIMALS),
    new BN(95 * 10 ** PRICE_DECIMALS),
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
    let vaultBefore = await program.account.spreadVault.fetch(spreadVault);
    assert.equal(vaultBefore.epoch, epoch);

    let now = new Date().getTime() / 1000;
    let ix = await startMarket(
      program,
      callStrikes,
      putStrikes,
      tokenPrice,
      tokenPrice,
      epoch,
      vaultAdmin.wallet.publicKey,
      spreadVault,
      oracles.tokenAOracle.publicKey
    );
    await vaultAdmin.userSpreadProgram.provider.sendAndConfirm(
      new Transaction().add(ix)
    );
    const [marketEpoch, bump] = deriveMarketEpoch(
      program.programId,
      spreadVault,
      epoch
    );
    if (verbose) {
      console.log("Init market " + marketEpoch);
      console.log(" Call strikes: " + callStrikes[6] + " " + callStrikes[7]);
      console.log(" Put strikes:  " + putStrikes[6] + " " + putStrikes[7]);
    }

    let vault = await program.account.spreadVault.fetch(spreadVault);
    let market = await program.account.marketEpoch.fetch(marketEpoch);

    assert.equal(vault.epoch, epoch + 1);
    assert.approximately(
      vault.saleData.expiration.toNumber(),
      now + vault.optionDuration,
      2
    );
    assertBNEqual(vault.saleData.priceAtStart, tokenPrice);
    assertKeysEqual(market.key, marketEpoch);
    assertKeysEqual(market.spreadVault, spreadVault);
    assertBNEqual(market.expirationPrice, tokenPrice);
    assert.approximately(market.priceLockedTime.toNumber(), now, 2);
    assert.equal(market.epoch, epoch);
    assert.equal(market.bump, bump);
    assert.equal(market.isExpired, 0);
  });

  it("Set asset volatility/risk-free rate for the vault - happy path", async () => {
    let vaultAdmin = userState.vaultAdmin;
    let vaultBefore = await program.account.spreadVault.fetch(spreadVault);
    //uninitialized rates...
    assertBNEqual(vaultBefore.volatility, 0);
    assert.equal(vaultBefore.riskFreeRate, 0);

    let ix = await setVol(
      program,
      vaultAdmin.wallet.publicKey,
      spreadVault,
      new BN(VOLATILITY_DEFAULT),
      RISK_FREE_DEFAULT
    );
    await vaultAdmin.userSpreadProgram.provider.sendAndConfirm(
      new Transaction().add(ix)
    );
    if (verbose) {
      console.log(
        "Set vol " +
          u32toPercent(VOLATILITY_DEFAULT) * 100 +
          "% risk free " +
          u32toPercent(RISK_FREE_DEFAULT) * 100 +
          "%"
      );
    }

    let vault = await program.account.spreadVault.fetch(spreadVault);
    assertBNEqual(vault.volatility, Math.floor(VOLATILITY_DEFAULT));
    assert.equal(vault.riskFreeRate, Math.floor(RISK_FREE_DEFAULT));
  });
});
