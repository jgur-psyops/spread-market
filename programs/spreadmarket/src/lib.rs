use anchor_lang::prelude::*;

pub mod errors;
pub mod instructions;
pub mod macros;
pub mod state;
pub mod utils;

declare_id!("2MWAqfKiQ1BTtW6sdBaAWrS9GNjQm1ixdjvhYabuFZeH");

use crate::instructions::*;

#[program]
pub mod spreadmarket {
    use super::*;

    pub fn buy_spread(
        ctx: Context<BuySpread>,
        contracts: u64,
        strike_lower: u64,
        strike_upper: u64,
        price_lower_threshold: u64,
        price_upper_threshold: u64,
        is_call: u8,
    ) -> Result<()> {
        instructions::buy_spread::buy_spread(
            ctx,
            contracts,
            strike_lower,
            strike_upper,
            price_lower_threshold,
            price_upper_threshold,
            is_call,
        )
    }

    /// Must run before a spread with the given strikes can be purchased. The strike pairs must
    /// match an offering on the spread_vault.
    pub fn init_receipt(
        ctx: Context<InitReceipt>,
        strike_lower: u64,
        strike_upper: u64,
        is_call: u8,
    ) -> Result<()> {
        instructions::init_receipt::init_receipt(ctx, strike_lower, strike_upper, is_call)
    }

    /// (Admin only) Initialize a new vault for some asset.
    pub fn init_vault(
        ctx: Context<InitSpreadVault>,
        nonce: u16,
        admin: Pubkey,
        withdraw_authority: Pubkey,
        asset_oracle: Pubkey,
        fee_rate: u32,
        option_duration: u32,
    ) -> Result<()> {
        instructions::init_vault::init_spread_vault(
            ctx,
            nonce,
            admin,
            withdraw_authority,
            asset_oracle,
            fee_rate,
            option_duration,
        )
    }

    /// (Admin only) Initial bootstrapping, run after `init_vault`
    pub fn init_vault_accs_p1(ctx: Context<InitVaultAccsP1>) -> Result<()> {
        instructions::init_vault_accs_p1::init_vault_accs_p1(ctx)
    }
    /// (Admin only) Initial bootstrapping, run after `init_vault`
    pub fn init_vault_accs_p2(ctx: Context<InitVaultAccsP2>) -> Result<()> {
        instructions::init_vault_accs_p2::init_vault_accs_p2(ctx)
    }

    /// (Admin only) Set risk free rate and volatility estimates
    pub fn set_vol(ctx: Context<SetVol>, vol: u64, risk_free: u32) -> Result<()> {
        instructions::set_vol::set_vol(ctx, vol, risk_free)
    }

    /// Deposit as an LP
    pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
        instructions::deposit::deposit(ctx, amount)
    }

    /// (Admin only) Start the sale of options. The sale begins when this ix fires, and options
    /// expire at now + spread_vault.option_duration
    /// * call/put_strikes - pass strikes in pairs, in ascending order, padded with zeros. For
    /// example to open a 100/105 spread and a 105/110 spread, pass [0, 0, 0, 0, 100, 105, 105, 110]
    /// * price_lower/upper_threshold - If on devnet/localnet, the price is always set to
    ///   (price_lower_threshold + price_upper_threshold) / 2 and the oracle is ignored. On mainnet,
    /// if the oracle's price is below/above these thresholds respectively, the ix fails. In
    /// `PRICE_DECIMALS`. Pass 0/u64::MAX to ignore these checks.
    pub fn start_market_epoch(
        ctx: Context<StartMarketEpoch>,
        call_strikes: [u64; 8],
        put_strikes: [u64; 8],
        price_lower_threshold: u64,
        price_upper_threshold: u64,
    ) -> Result<()> {
        instructions::start_market_epoch::start_market_epoch(
            ctx,
            call_strikes,
            put_strikes,
            price_lower_threshold,
            price_upper_threshold,
        )
    }

    /// Redeem an option after expiration, claiming earned funds
    pub fn redeem_spread(ctx: Context<RedeemSpread>) -> Result<()> {
        instructions::redeem_spread::redeem_spread(ctx)
    }

    /// (Permisionless) Crank oracle price to market. The crank closest to the expiration time will
    /// be the final price used to calculated the option's PnL
    pub fn expire_market(ctx: Context<ExpireMarket>) -> Result<()> {
        instructions::expire_market::expire_market(ctx)
    }

    // TODO *************** WIP instructions***********************
    /// (Permisionless) Realizes losses, settings aside those funds to be redeemed.
    pub fn end_market_epoch(ctx: Context<EndMarketEpoch>) -> Result<()> {
        instructions::end_market_epoch::end_market_epoch(ctx)
    }

    pub fn withdraw(ctx: Context<Withdraw>, amt: u64) -> Result<()> {
        instructions::withdraw::withdraw(ctx, amt)
    }

    pub fn lend_funds(ctx: Context<LendFunds>, amount: u64) -> Result<()> {
        instructions::lend_funds::lend_funds(ctx, amount)
    }

    pub fn remove_lend(ctx: Context<RemoveLend>, amount: u64) -> Result<()> {
        instructions::remove_lend::remove_lend(ctx, amount)
    }
}
