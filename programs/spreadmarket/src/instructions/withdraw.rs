// TODO proportional ownership of funding_pool minus realized loss right now.
// Also cannot reduce funding_pool below the largest exposure

//use crate::errors::ErrorCode;
use crate::state::SpreadVault;
use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};

#[derive(Accounts)]
pub struct Withdraw<'info> {
    pub user: Signer<'info>,

    #[account(
        has_one = payment_mint,
        has_one = lp_mint,
        has_one = funding_pool
    )]
    pub spread_vault: AccountLoader<'info, SpreadVault>,

    pub payment_mint: Account<'info, Mint>,
    #[account(mut)]
    pub lp_mint: Account<'info, Mint>,

    /// Vault's storage for payment assets
    #[account(mut)]
    pub funding_pool: Account<'info, TokenAccount>,
    /// Gains withdrawn assets
    /// NOTE: Completely unchecked.
    #[account(mut)]
    pub receiving_acc: Account<'info, TokenAccount>,
    /// Users's LP account.
    #[account(mut)]
    pub lp_acc: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

pub fn withdraw(_ctx: Context<Withdraw>, _amount: u64) -> Result<()> {
    Ok(())
}
