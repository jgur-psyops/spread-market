use crate::state::{spread_receipt, SpreadReceipt, PRICE_DECIMALS};
use anchor_lang::prelude::*;
use psyoracleutils::oracle_utils::get_oracle_price;

use crate::state::{MarketEpoch, SpreadVault};

#[derive(Accounts)]
#[instruction(
    strike_lower: u64,
    strike_upper: u64,
    is_call: u8
)]
pub struct BuySpread<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    /// CHECK: Completely unchecked, payers can buy Options on behalf of any wallet.
    pub owner: UncheckedAccount<'info>,

    #[account(
        mut,
        has_one = asset_oracle,
    )]
    pub spread_vault: AccountLoader<'info, SpreadVault>,

    // TODO support adding to an existing position
    #[account(
        init,
        seeds = [
            owner.key().as_ref(),
            spread_vault.key().as_ref(),
            &strike_lower.to_le_bytes(),
            &strike_upper.to_le_bytes(),
            &is_call.to_le_bytes(),
            b"receipt",
        ],
        bump,
        payer = payer,
        space = 8 + SpreadReceipt::LEN,
    )]
    pub spread_receipt: AccountLoader<'info, SpreadReceipt>,

    /// CHECK: validated against spread_vault's known oracle
    pub asset_oracle: UncheckedAccount<'info>,

    pub rent: Sysvar<'info, Rent>,
    pub system_program: Program<'info, System>,
}

pub fn buy_spread(
    ctx: Context<BuySpread>,
    strike_lower: u64,
    strike_upper: u64,
    is_call: u8,
) -> Result<()> {
    let mut spread_vault = ctx.accounts.spread_vault.load_mut()?;
    let mut spread_receipt = ctx.accounts.spread_receipt.load_mut()?;
    let current_time = Clock::get().unwrap().unix_timestamp;

    let price = get_oracle_price(
        &ctx.accounts.asset_oracle,
        PRICE_DECIMALS,
        current_time,
        Some(u32::MAX / 50), // 2%
        Some(5_000_000.0),
        10, // 10 seconds
        true,
    )?;

    // TODO black scholes the price...



    Ok(())
}