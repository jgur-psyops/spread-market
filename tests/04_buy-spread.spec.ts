import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Spreadmarket } from "../target/types/spreadmarket";
import {
  buySpread,
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
  deriveMarketEpoch,
  derivePremiumsPool,
  deriveSpreadReciept,
  deriveSpreadVault,
} from "../packages/pdas";
import { assertBNEqual, assertKeysEqual } from "./utils/genericTests";
import {
  CALL,
  DEFAULT_FEE_RATE,
  FIVE_SECONDS,
  PRICE_DECIMALS,
  SECONDS_PER_WEEK,
  getTokenBalance,
  u32MAX,
} from "./utils/common";
import { program } from "@coral-xyz/anchor/dist/cjs/native/system";
import { createMintToInstruction } from "@solana/spl-token";
import { BN } from "bn.js";

const verbose: boolean = true;

describe("Buy Spreads", () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  const program: Program<Spreadmarket> = anchor.workspace.Spreadmarket;
  const provider = anchor.getProvider() as anchor.AnchorProvider;
  const wallet = provider.wallet as anchor.Wallet;

  let ecosystem: Ecosystem = getGenericEcosystem();
  let oracles: Oracles = getGenericOracles();

  let spreadVault: PublicKey;
  let marketEpoch: PublicKey;
  const nonce: number = 0;
  const epoch: number = 0;
  const contracts = 10;
  const tokenPrice = new BN(oracles.tokenAPrice * 10 ** PRICE_DECIMALS);
  const strikeLower = 105 * 10 ** PRICE_DECIMALS;
  const strikeUpper = 110 * 10 ** PRICE_DECIMALS;

  before(async () => {
    [spreadVault] = deriveSpreadVault(
      program.programId,
      ecosystem.usdcMint.publicKey,
      ecosystem.tokenAMint.publicKey,
      nonce
    );

    [marketEpoch] = deriveMarketEpoch(program.programId, spreadVault, epoch);
  });

  it("Buy a spread - happy path", async () => {
    let user0 = userState.users[0];
    let vaultBefore = await program.account.spreadVault.fetch(spreadVault);
    let userUsdcBefore = await getTokenBalance(provider, user0.usdcAccount);

    const [premiumsPool] = derivePremiumsPool(program.programId, spreadVault);

    let now = new Date().getTime() / 1000;
    let ix = await buySpread(
      program,
      user0.wallet.publicKey,
      user0.wallet.publicKey,
      spreadVault,
      user0.usdcAccount,
      premiumsPool,
      oracles.tokenAOracle.publicKey,
      new BN(contracts),
      new BN(strikeLower),
      new BN(strikeUpper),
      tokenPrice,
      tokenPrice,
      CALL
    );
    try {
      await user0.userSpreadProgram.provider.sendAndConfirm(
        new Transaction().add(ix)
      );
    } catch (err) {
      console.log(err);
    }
    const [marketEpoch] = deriveMarketEpoch(
      program.programId,
      spreadVault,
      epoch
    );

    const [spreadReciept, bump] = deriveSpreadReciept(
      program.programId,
      user0.wallet.publicKey,
      spreadVault,
      new BN(strikeLower),
      new BN(strikeUpper),
      CALL
    );

    let vault = await program.account.spreadVault.fetch(spreadVault);
    let receipt = await program.account.spreadReceipt.fetch(spreadReciept);
    let userUsdcAfter = await getTokenBalance(provider, user0.usdcAccount);
    let usdcDiff = userUsdcBefore - userUsdcAfter;

    if (verbose) {
      console.log("Buy " + contracts + " from " + marketEpoch);
      console.log(
        " Purchased: " +
          contracts +
          " contracts for " +
          usdcDiff.toLocaleString() +
          " ($" +
          usdcDiff / 10 ** ecosystem.usdcDecimals +
          ")"
      );
    }
    assertBNEqual(
      vault.saleData.netCallPremiums,
      vaultBefore.saleData.netCallPremiums.toNumber() + usdcDiff
    );
    // No change
    assertBNEqual(
      vaultBefore.saleData.netPutPremiums,
      vault.saleData.netPutPremiums
    );
    let optionBefore = vaultBefore.saleData.calls[0];
    let optionAfter = vault.saleData.calls[0];
    let strikeDiff = strikeUpper - strikeLower;
    assertBNEqual(
      optionAfter.volumeSold,
      optionBefore.volumeSold.toNumber() + contracts
    );
    assertBNEqual(receipt.volume, contracts);
    assertBNEqual(
      optionAfter.exposure,
      optionBefore.exposure.toNumber() + contracts * strikeDiff
    );
    assertBNEqual(receipt.exposure, contracts * strikeDiff);

    assertKeysEqual(receipt.key, spreadReciept);
    assertKeysEqual(receipt.owner, user0.wallet.publicKey);
    assertBNEqual(receipt.strikeLower, strikeLower);
    assertBNEqual(receipt.strikeUpper, strikeUpper);
    assert.equal(receipt.isCall, CALL);
    assert.equal(receipt.bump, bump);

    // TODO assert cost approximately with off-chain BS....
  });
});
