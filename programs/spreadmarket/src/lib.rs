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
        fee_rate: u32,
        option_duration: u32,
    ) -> Result<()> {
        instructions::init_vault::init_spread_vault(
            ctx,
            nonce,
            admin,
            withdraw_authority,
            fee_rate,
            option_duration,
        )
    }

    pub fn init_vault_accs(ctx: Context<InitVaultAccs>) -> Result<()> {
        instructions::init_vault_accs::init_vault_accs(ctx)
    }

    pub fn set_vol(ctx: Context<SetVol>, vol: u64, risk_free: u32) -> Result<()> {
        instructions::set_vol::set_vol(ctx, vol, risk_free)
    }

    pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
        instructions::deposit::deposit(ctx, amount)
    }
}
