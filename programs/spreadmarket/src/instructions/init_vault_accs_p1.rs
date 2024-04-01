use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};

use crate::state::SpreadVault;

#[derive(Accounts)]
pub struct InitVaultAccsP1<'info> {
    /// Pays the account initialization fees
    #[account(mut)]
    pub admin: Signer<'info>,

    #[account(
        has_one = admin,
        has_one = payment_mint
    )]
    pub spread_vault: AccountLoader<'info, SpreadVault>,

    pub payment_mint: Box<Account<'info, Mint>>,

    #[account(
        init,
        seeds = [spread_vault.key().as_ref(), b"premiumspool"],
        bump,
        payer = admin,
        token::mint = payment_mint,
        token::authority = spread_vault,
    )]
    pub premiums_pool: Box<Account<'info, TokenAccount>>,

    #[account(
        init,
        seeds = [spread_vault.key().as_ref(), b"feepool"],
        bump,
        payer = admin,
        token::mint = payment_mint,
        token::authority = spread_vault,
    )]
    pub fee_pool: Box<Account<'info, TokenAccount>>,

    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
    pub system_program: Program<'info, System>,
}

pub fn init_vault_accs_p1(ctx: Context<InitVaultAccsP1>) -> Result<()> {
    let mut spread_vault = ctx.accounts.spread_vault.load_mut()?;

    spread_vault.premiums_pool = ctx.accounts.premiums_pool.key();
    spread_vault.fee_pool = ctx.accounts.fee_pool.key();

    Ok(())
}
