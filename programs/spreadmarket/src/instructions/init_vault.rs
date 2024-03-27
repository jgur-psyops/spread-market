use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};
use bytemuck::Zeroable;

use crate::errors::ErrorCode;
use crate::state::SpreadVault;

#[derive(Accounts)]
#[instruction(
    nonce: u16,
)]
pub struct InitSpreadVault<'info> {
    /// Pays the account initialization fees
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        init,
        seeds = [
            payment_mint.key().as_ref(),
            asset_mint.key().as_ref(),
            &nonce.to_le_bytes(),
            b"spreadvault",
        ],
        bump,
        payer = payer,
        space = 8 + SpreadVault::LEN,
    )]
    pub spread_vault: AccountLoader<'info, SpreadVault>,

    pub payment_mint: Account<'info, Mint>,
    pub asset_mint: Account<'info, Mint>,

    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<InitSpreadVault>, nonce: u16, admin: Pubkey) -> Result<()> {
    let mut spread_vault = ctx.accounts.spread_vault.load_init()?;
    spread_vault.payment_mint = ctx.accounts.payment_mint.key();
    spread_vault.asset_mint = ctx.accounts.asset_mint.key();
    spread_vault.admin = admin;

    spread_vault.nonce = nonce;
    spread_vault.payment_mint_decimals = ctx.accounts.payment_mint.decimals;
    spread_vault.asset_mint_decimals = ctx.accounts.asset_mint.decimals;

    Ok(())
}
