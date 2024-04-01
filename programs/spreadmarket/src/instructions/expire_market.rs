use crate::state::PRICE_DECIMALS;
use anchor_lang::prelude::*;
use psyoracleutils::oracle_utils::get_oracle_price;

use crate::state::{MarketEpoch, SpreadVault};

#[derive(Accounts)]
pub struct ExpireMarket<'info> {
    pub admin: Signer<'info>,

    #[account(
        has_one = admin,
        has_one = asset_oracle,
    )]
    pub spread_vault: AccountLoader<'info, SpreadVault>,

    #[account(mut)]
    pub market_epoch: AccountLoader<'info, MarketEpoch>,

    /// CHECK: validated against spread_vault's known oracle
    pub asset_oracle: UncheckedAccount<'info>,

    pub rent: Sysvar<'info, Rent>,
    pub system_program: Program<'info, System>,
}

pub fn expire_market(ctx: Context<ExpireMarket>) -> Result<()> {
    let spread_vault = ctx.accounts.spread_vault.load()?;
    let mut market_epoch = ctx.accounts.market_epoch.load_mut()?;
    let current_time = Clock::get().unwrap().unix_timestamp;
    let price_locked_time = market_epoch.price_locked_time;
    let expiration_time = spread_vault.sale_data.expiration;
    let is_expired = current_time > expiration_time;

    let price = get_oracle_price(
        &ctx.accounts.asset_oracle,
        PRICE_DECIMALS,
        current_time,
        Some(u32::MAX / 50), // 2%
        Some(5_000_000.0),
        10, // 10 seconds
        true,
    )?;

    // If the price is not more recent, it is never updated.
    if current_time > price_locked_time {
        // After expiration, price can only be updated if it is closer to the expiration time than
        // the last locked price (Note that logically, this can only happen once)
        if current_time > expiration_time {
            let diff_now_vs_expiry = (current_time - expiration_time) as u64;
            let diff_locked_vs_expiry = expiration_time.abs_diff(price_locked_time);
            if diff_now_vs_expiry < diff_locked_vs_expiry {
                market_epoch.expiration_price = price;
                market_epoch.price_locked_time = current_time;
            }
        } else {
            market_epoch.expiration_price = price;
            market_epoch.price_locked_time = current_time;
        }
    }

    if is_expired {
        market_epoch.is_expired = 1;
    }

    Ok(())
}
