use crate::state::{spread_receipt, SpreadReceipt};
use anchor_lang::prelude::*;
use spread_receipt::{CALL, PUT};

//use crate::errors::ErrorCode;
use crate::state::SpreadVault;

#[derive(Accounts)]
#[instruction(
    strike_lower: u64,
    strike_upper: u64,
    is_call: u8
)]
pub struct InitReceipt<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    /// CHECK: Completely unchecked, payers can buy Options on behalf of any wallet.
    pub owner: UncheckedAccount<'info>,

    pub spread_vault: AccountLoader<'info, SpreadVault>,

    #[account(
        init,
        seeds = [
            owner.key().as_ref(),
            spread_vault.key().as_ref(),
            &strike_lower.to_le_bytes(),
            &strike_upper.to_le_bytes(),
            &is_call.to_le_bytes(),
            b"receipt",
        ],
        bump,
        payer = payer,
        space = 8 + SpreadReceipt::LEN,
    )]
    pub spread_receipt: AccountLoader<'info, SpreadReceipt>,

    pub rent: Sysvar<'info, Rent>,
    pub system_program: Program<'info, System>,
}

pub fn init_receipt(
    ctx: Context<InitReceipt>,
    strike_lower: u64,
    strike_upper: u64,
    is_call: u8,
) -> Result<()> {
    let spread_vault = ctx.accounts.spread_vault.load()?;
    let is_call = match is_call {
        1 => true,
        2 => false,
        _ => panic!("bad is_call param"),
    };

    let mut spread_receipt = ctx.accounts.spread_receipt.load_init()?;
    spread_receipt.key = ctx.accounts.spread_receipt.key();
    spread_receipt.owner = ctx.accounts.owner.key();
    spread_receipt.strike_lower = strike_lower;
    spread_receipt.strike_upper = strike_upper;
    spread_receipt.premium_paid = 0;
    spread_receipt.expiration = spread_vault.sale_data.expiration;
    spread_receipt.contracts = 0;
    spread_receipt.exposure = 0;
    spread_receipt.epoch = spread_vault.epoch;
    spread_receipt.is_call = if is_call { CALL } else { PUT };
    spread_receipt.bump = *ctx.bumps.get("spread_receipt").unwrap();

    Ok(())
}
