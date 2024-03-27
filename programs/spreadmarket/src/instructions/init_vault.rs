use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token};
use bytemuck::Zeroable;

use crate::state::{OptionSaleData, SpreadVault};

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

pub fn init_spread_vault(
    ctx: Context<InitSpreadVault>,
    nonce: u16,
    admin: Pubkey,
    withdraw_authority: Pubkey,
    fee_rate: u32,
    option_duration: u32,
) -> Result<()> {
    let mut spread_vault = ctx.accounts.spread_vault.load_init()?;
    spread_vault.key = ctx.accounts.spread_vault.key();
    spread_vault.payment_mint = ctx.accounts.payment_mint.key();
    spread_vault.asset_mint = ctx.accounts.asset_mint.key();
    spread_vault.admin = admin;
    spread_vault.withdraw_authority = withdraw_authority;

    // Inited in another ix to handle stack constraints.
    spread_vault.lp_mint = Pubkey::default();
    spread_vault.funding_pool = Pubkey::default();
    spread_vault.premiums_pool = Pubkey::default();
    spread_vault.fee_pool = Pubkey::default();

    spread_vault.volatility = 0;
    spread_vault.risk_free_rate = 0;
    spread_vault.fee_rate = fee_rate;
    spread_vault.epoch = 0;
    spread_vault.option_duration = option_duration;

    spread_vault.nonce = nonce;
    spread_vault.payment_mint_decimals = ctx.accounts.payment_mint.decimals;
    spread_vault.asset_mint_decimals = ctx.accounts.asset_mint.decimals;
    spread_vault.bump = ctx.bumps.spread_vault;

    spread_vault.sale_data = OptionSaleData::zeroed();

    Ok(())
}
