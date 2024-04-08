use crate::errors::ErrorCode;
use crate::spread_vault_signer_seeds;
use crate::{
    state::{MarketEpoch, SpreadReceipt, SpreadVault, CALL, PRICE_DECIMALS},
    utils::ten_pow,
};
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

#[derive(Accounts)]
pub struct RedeemSpread<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,

    pub funding_pool: Account<'info, TokenAccount>,

    /// Users's payment account to recieve funds.
    /// * Note: Completely unchecked
    pub dest_acc: Account<'info, TokenAccount>,

    /// CHECK: Completely unchecked, send the rent to any account.
    pub dest_acc_close_fee: UncheckedAccount<'info>,

    #[account(
        has_one = funding_pool
    )]
    pub spread_vault: AccountLoader<'info, SpreadVault>,

    #[account(
        mut, 
        close = dest_acc_close_fee
    )]
    pub spread_receipt: AccountLoader<'info, SpreadReceipt>,

    pub market_epoch: AccountLoader<'info, MarketEpoch>,

    pub token_program: Program<'info, Token>,
}

pub fn redeem_spread(ctx: Context<RedeemSpread>) -> Result<()> {
    let spread_vault = ctx.accounts.spread_vault.load()?;
    let receipt = ctx.accounts.spread_receipt.load()?;
    let epoch = ctx.accounts.market_epoch.load()?;

    if Clock::get().unwrap().unix_timestamp < receipt.expiration {
        return err!(ErrorCode::SpreadNotExpired);
    }

    let price = epoch.expiration_price;
    let gain_per_contract = if receipt.is_call == CALL {
        if price < receipt.strike_upper {
            price - receipt.strike_lower
        } else {
            receipt.strike_upper - receipt.strike_lower
        }
    } else {
        if price > receipt.strike_lower {
            receipt.strike_upper - price
        } else {
            receipt.strike_upper - receipt.strike_lower
        }
    };
    let gain_in_native: u64 = (gain_per_contract as u128)
        .checked_mul(ten_pow(spread_vault.payment_mint_decimals))
        .ok_or(ErrorCode::MathErr)?
        .checked_div(ten_pow(PRICE_DECIMALS))
        .ok_or(ErrorCode::MathErr)?
        .try_into()
        .unwrap();
    let net_gain = gain_in_native
        .checked_mul(receipt.contracts)
        .ok_or(ErrorCode::MathErr)?;
    token::transfer(
        ctx.accounts
            .transfer_funds()
            .with_signer(&[spread_vault_signer_seeds!(spread_vault)]),
        net_gain,
    )?;

    Ok(())
}

impl<'info> RedeemSpread<'info> {
    fn transfer_funds(&self) -> CpiContext<'_, '_, '_, 'info, Transfer<'info>> {
        CpiContext::new(
            self.token_program.to_account_info(),
            Transfer {
                from: self.funding_pool.to_account_info(),
                to: self.dest_acc.to_account_info(),
                authority: self.spread_vault.to_account_info(),
            },
        )
    }
}
