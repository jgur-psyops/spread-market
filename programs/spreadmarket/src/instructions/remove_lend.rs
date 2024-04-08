// TODO withdraw funds back into the funding pool from a third-party lending platform.

//use crate::errors::ErrorCode;
use crate::state::SpreadVault;
use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};

#[derive(Accounts)]
pub struct RemoveLend<'info> {
    pub user: Signer<'info>,

    #[account(
        has_one = payment_mint,
        has_one = funding_pool
    )]
    pub spread_vault: AccountLoader<'info, SpreadVault>,

    pub payment_mint: Account<'info, Mint>,

    /// Vault's storage for payment assets
    #[account(mut)]
    pub funding_pool: Account<'info, TokenAccount>,

    #[account(mut)]
    pub lending_acc: Account<'info, TokenAccount>,

    /// CHECK: placeholders for CPI args
    pub cpi_a: UncheckedAccount<'info>,
    /// CHECK: placeholders for CPI args
    pub cpi_b: UncheckedAccount<'info>,
    /// CHECK: placeholders for CPI args
    pub cpi_c: UncheckedAccount<'info>,

    pub token_program: Program<'info, Token>,
}

pub fn remove_lend(_ctx: Context<RemoveLend>, _amount: u64) -> Result<()> {
    Ok(())
}
