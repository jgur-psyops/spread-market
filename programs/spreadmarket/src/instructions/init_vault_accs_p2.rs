use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};

use crate::state::SpreadVault;

#[derive(Accounts)]
pub struct InitVaultAccsP2<'info> {
    /// Pays the account initialization fees
    #[account(mut)]
    pub admin: Signer<'info>,

    #[account(
        has_one = admin,
        has_one = payment_mint
    )]
    pub spread_vault: AccountLoader<'info, SpreadVault>,

    pub payment_mint: Box<Account<'info, Mint>>,

    /// Mints tokens that represent stake in the vault
    #[account(
        init,
        seeds = [&spread_vault.key().to_bytes()[..], b"lpMint"],
        bump,
        payer = admin,
        mint::decimals = payment_mint.decimals,
        mint::authority = spread_vault
    )]
    pub lp_mint: Box<Account<'info, Mint>>,

    #[account(
        init,
        seeds = [spread_vault.key().as_ref(), b"fundingpool"],
        bump,
        payer = admin,
        token::mint = payment_mint,
        token::authority = spread_vault,
    )]
    pub funding_pool: Box<Account<'info, TokenAccount>>,

    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
    pub system_program: Program<'info, System>,
}

pub fn init_vault_accs_p2(ctx: Context<InitVaultAccsP2>) -> Result<()> {
    let mut spread_vault = ctx.accounts.spread_vault.load_mut()?;

    spread_vault.lp_mint = ctx.accounts.lp_mint.key();
    spread_vault.funding_pool = ctx.accounts.funding_pool.key();

    Ok(())
}
