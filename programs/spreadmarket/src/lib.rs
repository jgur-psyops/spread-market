use anchor_lang::prelude::*;

pub mod instructions;
pub mod state;
pub mod utils;
pub mod errors;
pub mod macros;

declare_id!("2MWAqfKiQ1BTtW6sdBaAWrS9GNjQm1ixdjvhYabuFZeH");

use crate::instructions::*;

#[program]
pub mod spreadmarket {
    use super::*;

    pub fn init_vault(ctx: Context<InitSpreadVault>, nonce: u16, admin: Pubkey) -> Result<()> {
        instructions::init_vault::handler(ctx, nonce, admin)
    }
}
