use anchor_lang::prelude::*;
use crate::state::SpreadVault;

#[derive(Accounts)]
pub struct SetVol<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,

    #[account(
        mut,
        has_one = admin
    )]
    pub spread_vault: AccountLoader<'info, SpreadVault>,
}

pub fn set_vol(ctx: Context<SetVol>, vol: u64, risk_free: u32) -> Result<()> {
    let mut spread_vault = ctx.accounts.spread_vault.load_mut()?;
    spread_vault.volatility = vol;
    spread_vault.risk_free_rate = risk_free;

    Ok(())
}
