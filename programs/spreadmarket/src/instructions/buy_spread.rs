use crate::state::{spread_receipt, SpreadReceipt, PRICE_DECIMALS};
use crate::utils::{ten_pow, SECONDS_PER_YEAR};
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};
use psyoracleutils::oracle_utils::get_oracle_price;

use crate::errors::ErrorCode;
use crate::state::SpreadVault;

#[derive(Accounts)]
#[instruction(
    contracts: u64,
    strike_lower: u64,
    strike_upper: u64,
    price_lower_threshold: u64,
    price_upper_threshold: u64,
    is_call: u8
)]
pub struct BuySpread<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    /// CHECK: Completely unchecked, payers can buy Options on behalf of any wallet.
    pub owner: UncheckedAccount<'info>,

    #[account(
        mut,
        has_one = asset_oracle,
        has_one = premiums_pool,
    )]
    pub spread_vault: AccountLoader<'info, SpreadVault>,

    #[account(
        mut,
        seeds = [
            owner.key().as_ref(),
            spread_vault.key().as_ref(),
            &strike_lower.to_le_bytes(),
            &strike_upper.to_le_bytes(),
            &is_call.to_le_bytes(),
            b"receipt",
        ],
        bump
    )]
    pub spread_receipt: AccountLoader<'info, SpreadReceipt>,

    /// Note: must be owned or delegated to payer
    #[account(mut)]
    pub payment_acc: Account<'info, TokenAccount>,
    #[account(mut)]
    pub premiums_pool: Account<'info, TokenAccount>,

    /// CHECK: validated against spread_vault's known oracle
    pub asset_oracle: UncheckedAccount<'info>,

    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
    pub system_program: Program<'info, System>,
}

pub fn buy_spread(
    ctx: Context<BuySpread>,
    contracts: u64, // TODO could express in decimals so people can buy fractions of 1 contract
    strike_lower: u64,
    strike_upper: u64,
    price_lower_threshold: u64,
    price_upper_threshold: u64,
    is_call: u8,
) -> Result<()> {
    let mut spread_vault = ctx.accounts.spread_vault.load_mut()?;
    let current_time = Clock::get().unwrap().unix_timestamp;
    let is_call = match is_call {
        1 => true,
        2 => false,
        _ => panic!("bad is_call param"),
    };

    // TODO allow risk-free and volatility settings to expire, and fail this ix if they are expired.
    if spread_vault.risk_free_rate == 0 || spread_vault.volatility == 0 {
        return err!(ErrorCode::RiskFreeOrVolNotSet);
    }

    let option_index =
        match spread_vault
            .sale_data
            .get_spread_option_index(is_call, strike_lower, strike_upper)
        {
            Some(n) => n,
            None => return err!(ErrorCode::BadStrikesPassed),
        };

    if current_time > spread_vault.sale_data.expiration {
        return err!(ErrorCode::MarketExpired);
    }

    #[cfg(feature = "localnet")]
    let price = (price_lower_threshold + price_upper_threshold) / 2;
    #[cfg(not(feature = "localnet"))]
    let price = get_oracle_price(
        &ctx.accounts.asset_oracle,
        PRICE_DECIMALS,
        current_time,
        Some(u32::MAX / 50), // 2%
        Some(5_000_000.0),
        10, // 10 seconds
        true,
    )?;
    #[cfg(not(feature = "localnet"))]
    if price < price_lower_threshold || price > price_upper_threshold {
        return err!(ErrorCode::PriceExceedsThreshold);
    }

    // Black-scholes price inputs.....
    // Note: values above 2^52 exceed the mantissa of f64 and will lose some precision.
    let s: f64 = price as f64;
    let k1: f64 = strike_lower as f64;
    let k2: f64 = strike_upper as f64;
    let rate = spread_vault.risk_free_rate as f64 / u32::MAX as f64;
    let sigma = spread_vault.volatility as f64 / u32::MAX as f64;
    let maturity =
        (spread_vault.sale_data.expiration - current_time) as f64 / SECONDS_PER_YEAR as f64;
    // Note: prices are calculated in `PRICE_DECIMALS` as a float
    let lower: f64;
    let upper: f64;
    let price_one_contract: u64;
    if is_call {
        lower = black_scholes::call(s, k1, rate, sigma, maturity);
        upper = black_scholes::call(s, k2, rate, sigma, maturity);
        // User "buys" the more expensive lower leg and "sells" the cheaper upper leg.
        price_one_contract = (lower as u64)
            .checked_sub(upper as u64)
            .ok_or(ErrorCode::MathErr)?;
    } else {
        lower = black_scholes::put(s, k1, rate, sigma, maturity);
        upper = black_scholes::put(s, k2, rate, sigma, maturity);
        // User "buys" the more expensive upper leg and "sells" the cheaper lower leg.
        price_one_contract = (upper as u64)
            .checked_sub(lower as u64)
            .ok_or(ErrorCode::MathErr)?;
    }

    let net_cost_in_price_decimals = price_one_contract
        .checked_mul(contracts)
        .ok_or(ErrorCode::MathErr)?;
    // Reconcile into the payment asset
    let net_cost: u64 = (net_cost_in_price_decimals as u128)
        .checked_mul(ten_pow(spread_vault.payment_mint_decimals))
        .ok_or(ErrorCode::MathErr)?
        .checked_div(ten_pow(PRICE_DECIMALS))
        .ok_or(ErrorCode::MathErr)?
        .try_into()
        .unwrap();

    // Transfer the payment from the user's account to the funding pool
    let cpi_accounts = Transfer {
        from: ctx.accounts.payment_acc.to_account_info(),
        to: ctx.accounts.premiums_pool.to_account_info(),
        authority: ctx.accounts.payer.to_account_info(),
    };
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
    token::transfer(cpi_ctx, net_cost)?;

    // Record the sale on the vault.
    {
        let net_premiums = if is_call {
            &mut spread_vault.sale_data.net_call_premiums
        } else {
            &mut spread_vault.sale_data.net_put_premiums
        };
        *net_premiums = net_premiums.saturating_add(net_cost);
    } // release mutable borrow of spread_vault.

    let free_funds = spread_vault.free_funds;
    let strike_diff = strike_upper - strike_lower;
    let net_exposure: u64;
    {
        let options = if is_call {
            &mut spread_vault.sale_data.calls
        } else {
            &mut spread_vault.sale_data.puts
        };

        let net_vol = options[option_index]
            .volume_sold
            .checked_add(contracts)
            .ok_or(ErrorCode::MathErr)?;
        options[option_index].volume_sold = net_vol;
        net_exposure = net_vol.checked_mul(strike_diff).ok_or(ErrorCode::MathErr)?;
        options[option_index].exposure = net_exposure;
    } // release mutable borrow of spread_vault

    if net_exposure > free_funds {
        msg!(
            "tried to purchase: {:?} max exposure is: {:?}",
            net_exposure,
            free_funds
        );
        return err!(ErrorCode::ExceededMaxExposure);
    } else {
        spread_vault.free_funds = free_funds - net_exposure;
    }

    let mut spread_receipt = ctx.accounts.spread_receipt.load_mut()?;
    spread_receipt.premium_paid = spread_receipt
        .premium_paid
        .checked_add(net_cost)
        .ok_or(ErrorCode::MathErr)?;
    spread_receipt.volume = spread_receipt
        .volume
        .checked_add(contracts)
        .ok_or(ErrorCode::MathErr)?;
    spread_receipt.exposure = spread_receipt
        .exposure
        .checked_add(
            contracts
                .checked_mul(strike_diff)
                .ok_or(ErrorCode::MathErr)?,
        )
        .ok_or(ErrorCode::MathErr)?;

    Ok(())
}
