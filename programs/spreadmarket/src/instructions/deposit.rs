use crate::errors::ErrorCode;
use crate::{spread_vault_signer_seeds, state::SpreadVault};
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, MintTo, Token, TokenAccount, Transfer};

#[derive(Accounts)]
pub struct Deposit<'info> {
    pub user: Signer<'info>,

    #[account(
        mut,
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
    /// Must be owned/delegate of the user. Funds will be transferred to `funding_pool`.
    #[account(mut)]
    pub payment_acc: Account<'info, TokenAccount>,
    /// Users's LP account.
    /// * Note: Completely unchecked
    #[account(mut)]
    pub lp_acc: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
    {
        let mut spread_vault = ctx.accounts.spread_vault.load_mut()?;
        spread_vault.free_funds = spread_vault
            .free_funds
            .checked_add(amount)
            .ok_or(ErrorCode::MathErr)?;
    } // release mutable spread vault
    let spread_vault = ctx.accounts.spread_vault.load()?;

    // Transfer the payment from the user's account to the funding pool
    let cpi_accounts = Transfer {
        from: ctx.accounts.payment_acc.to_account_info(),
        to: ctx.accounts.funding_pool.to_account_info(),
        authority: ctx.accounts.user.to_account_info(),
    };
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
    token::transfer(cpi_ctx, amount)?;

    // Calculate LP tokens to mint
    let lp_tokens = ctx.accounts.lp_mint.supply;
    let lp_tokens_to_mint = if lp_tokens == 0 {
        // For first depositor, 1:1
        amount
    } else {
        // Calculated based on the ratio of deposit to total funding pool after deposit
        // Updated pool size after deposit
        let total_pool = ctx.accounts.funding_pool.amount - spread_vault.realized_loss + amount;
        // Ratio of user's deposit amount to updated pool size, scaled by total LP tokens
        amount
            .checked_mul(lp_tokens)
            .ok_or(ErrorCode::MathErr)?
            .checked_div(total_pool)
            .ok_or(ErrorCode::MathErr)?
    };

    // Mint LP tokens
    let seeds = spread_vault_signer_seeds!(spread_vault);
    let signer_seeds = &[&seeds[..]];

    let cpi_accounts = MintTo {
        mint: ctx.accounts.lp_mint.to_account_info(),
        to: ctx.accounts.lp_acc.to_account_info(),
        authority: ctx.accounts.spread_vault.to_account_info(),
    };
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);
    token::mint_to(cpi_ctx, lp_tokens_to_mint)?;

    Ok(())
}
