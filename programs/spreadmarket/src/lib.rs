use anchor_lang::prelude::*;

pub mod errors;
pub mod instructions;
pub mod macros;
pub mod state;
pub mod utils;

declare_id!("2MWAqfKiQ1BTtW6sdBaAWrS9GNjQm1ixdjvhYabuFZeH");

use crate::instructions::*;

#[program]
pub mod spreadmarket {
    use super::*;

    pub fn init_vault(
        ctx: Context<InitSpreadVault>,
        nonce: u16,
        admin: Pubkey,
        withdraw_authority: Pubkey,
        asset_oracle: Pubkey,
        fee_rate: u32,
        option_duration: u32,
    ) -> Result<()> {
        instructions::init_vault::init_spread_vault(
            ctx,
            nonce,
            admin,
            withdraw_authority,
            asset_oracle,
            fee_rate,
            option_duration,
        )
    }

    pub fn init_vault_accs_p1(ctx: Context<InitVaultAccsP1>) -> Result<()> {
        instructions::init_vault_accs_p1::init_vault_accs_p1(ctx)
    }
    pub fn init_vault_accs_p2(ctx: Context<InitVaultAccsP2>) -> Result<()> {
        instructions::init_vault_accs_p2::init_vault_accs_p2(ctx)
    }

    pub fn set_vol(ctx: Context<SetVol>, vol: u64, risk_free: u32) -> Result<()> {
        instructions::set_vol::set_vol(ctx, vol, risk_free)
    }

    pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
        instructions::deposit::deposit(ctx, amount)
    }

    pub fn start_market_epoch(
        ctx: Context<StartMarketEpoch>,
        call_strikes: [u64; 8],
        put_strikes: [u64; 8],
    ) -> Result<()> {
        instructions::start_market_epoch::start_market_epoch(ctx, call_strikes, put_strikes)
    }

    pub fn expire_market(ctx: Context<ExpireMarket>) -> Result<()> {
        instructions::expire_market::expire_market(ctx)
    }
}
