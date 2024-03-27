use anchor_lang::prelude::*;

declare_id!("2MWAqfKiQ1BTtW6sdBaAWrS9GNjQm1ixdjvhYabuFZeH");

#[program]
pub mod spreadmarket {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
