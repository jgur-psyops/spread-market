// TODO permisionless ix to realize losses and transfer book values accordingly
// use crate::{
//     errors::ErrorCode,
//     state::{SpreadOption, PRICE_DECIMALS},
// };
use crate::errors::ErrorCode;
use anchor_lang::prelude::*;

use crate::state::{MarketEpoch, SpreadVault};

#[derive(Accounts)]
pub struct EndMarketEpoch<'info> {
    #[account(
        mut,
        has_one = asset_oracle,
    )]
    pub spread_vault: AccountLoader<'info, SpreadVault>,

    #[account(
        mut,
        has_one = spread_vault
    )]
    pub market_epoch: AccountLoader<'info, MarketEpoch>,

    /// CHECK: validated against spread_vault's known oracle
    pub asset_oracle: UncheckedAccount<'info>,

    pub rent: Sysvar<'info, Rent>,
    pub system_program: Program<'info, System>,
}

pub fn end_market_epoch(ctx: Context<EndMarketEpoch>) -> Result<()> {
    let mut spread_vault = ctx.accounts.spread_vault.load_mut()?;
    // let mut market_epoch = ctx.accounts.market_epoch.load_mut()?;

    // TODO if time expired, epoch += 1 and set `realized_loss` and `free_funds`
    // TODO close market_epoch

    spread_vault.epoch = spread_vault
        .epoch
        .checked_add(1)
        .ok_or(ErrorCode::MathErr)?;
    Ok(())
}
