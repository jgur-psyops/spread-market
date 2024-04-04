use crate::state::{MarketEpoch, SpreadReceipt, SpreadVault};
use anchor_lang::prelude::*;
use anchor_spl::token::{Token, TokenAccount};

#[derive(Accounts)]
pub struct RedeemSpread<'info> {
    #[account(
        mut,
    )]
    pub owner: Signer<'info>,

    pub funding_pool: Account<'info, TokenAccount>,

    /// Users's payment account to recieve funds.
    /// * Note: Completely unchecked
    pub dest_acc: Account<'info, TokenAccount>,

    #[account(
        mut,
        has_one = funding_pool
    )]
    pub spread_vault: AccountLoader<'info, SpreadVault>,

    #[account(mut)]
    pub spread_receipt: AccountLoader<'info, SpreadReceipt>,

    #[account(mut)]
    pub market_epoch: AccountLoader<'info, MarketEpoch>,

    pub token_program: Program<'info, Token>,
}

pub fn redeem_spread(_ctx: Context<RedeemSpread>) -> Result<()> {

    // TODO
    Ok(())
}
