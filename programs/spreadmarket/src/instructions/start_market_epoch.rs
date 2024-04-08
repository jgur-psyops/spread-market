use crate::{
    errors::ErrorCode,
    state::{SpreadOption, PRICE_DECIMALS},
};
use anchor_lang::prelude::*;
use psyoracleutils::oracle_utils::get_oracle_price;

use crate::state::{MarketEpoch, SpreadVault};

#[derive(Accounts)]
pub struct StartMarketEpoch<'info> {
    /// Pays the account initialization fees
    #[account(mut)]
    pub admin: Signer<'info>,

    #[account(
        mut,
        has_one = admin,
        has_one = asset_oracle,
    )]
    pub spread_vault: AccountLoader<'info, SpreadVault>,

    #[account(
        init,
        seeds = [
            spread_vault.key().as_ref(),
            &spread_vault.load()?.epoch.to_le_bytes(),
            b"epoch",
        ],
        bump,
        payer = admin,
        space = 8 + MarketEpoch::LEN,
    )]
    pub market_epoch: AccountLoader<'info, MarketEpoch>,

    /// CHECK: validated against spread_vault's known oracle
    pub asset_oracle: UncheckedAccount<'info>,

    pub rent: Sysvar<'info, Rent>,
    pub system_program: Program<'info, System>,
}

pub fn start_market_epoch(
    ctx: Context<StartMarketEpoch>,
    call_strikes: [u64; 8],
    put_strikes: [u64; 8], // TODO support up to 8 positions (16 pairs)
    price_lower_threshold: u64,
    price_upper_threshold: u64,
) -> Result<()> {
    if !is_ascending(&call_strikes) || !is_ascending(&put_strikes) {
        return err!(ErrorCode::StrikesOutofOrder);
    }

    let mut spread_vault = ctx.accounts.spread_vault.load_mut()?;
    let mut market_epoch = ctx.accounts.market_epoch.load_init()?;
    let current_time = Clock::get().unwrap().unix_timestamp;

    let mut calls_read = 0;
    let mut puts_read = 0;
    for i in (0..call_strikes.len()).step_by(2) {
        if call_strikes[i] > 0 && call_strikes[i + 1] > 0 {
            let lower = call_strikes[i];
            let upper = call_strikes[i + 1];
            spread_vault.sale_data.calls[calls_read] = SpreadOption::new(lower, upper);
            calls_read += 1;
        }

        if put_strikes[i] > 0 && put_strikes[i + 1] > 0 {
            let lower = put_strikes[i];
            let upper = put_strikes[i + 1];
            spread_vault.sale_data.puts[puts_read] = SpreadOption::new(lower, upper);
            puts_read += 1;
        }
    }

    // TODO make confidence/age parameters configurable on the spread_vault
    #[cfg(feature = "localnet")]
    let price = (price_lower_threshold + price_upper_threshold) / 2;
    #[cfg(not(feature = "localnet"))]
    let price = get_oracle_price(
        &ctx.accounts.asset_oracle,
        PRICE_DECIMALS,
        current_time,
        Some(u32::MAX / 50), // 2%
        Some(5_000_000.0),
        10, // 10 seconds
        true,
    )?;
    #[cfg(not(feature = "localnet"))]
    if price < price_lower_threshold || price > price_upper_threshold {
        return err!(ErrorCode::PriceExceedsThreshold);
    }

    spread_vault.sale_data.price_at_start = price;
    spread_vault.sale_data.expiration = current_time + spread_vault.option_duration as i64;

    market_epoch.key = ctx.accounts.market_epoch.key();
    market_epoch.spread_vault = ctx.accounts.spread_vault.key();
    market_epoch.expiration_price = price;
    market_epoch.price_locked_time = current_time;
    market_epoch.epoch = spread_vault.epoch;
    market_epoch.bump = *ctx.bumps.get("market_epoch").unwrap();
    market_epoch.is_expired = 0;

    Ok(())
}

/// True if ascending order (ties allowed)
pub fn is_ascending(arr: &[u64; 8]) -> bool {
    for i in 0..arr.len() - 1 {
        if arr[i] > arr[i + 1] {
            return false;
        }
    }
    true
}
