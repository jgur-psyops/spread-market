use anchor_lang::prelude::*;

pub mod errors;
pub mod instructions;
pub mod macros;
pub mod state;
// pub mod utils;

use crate::instructions::*;
// use crate::state::*;
// use errors::*;

declare_id!("679cLtYwqwZfx73ofzcoQycam1uoWzYrJQumeKcBiz1D");

#[program]
pub mod mocks {
    use super::*;
    use std::io::Write as IoWrite;

    /// Do nothing
    pub fn do_nothing(ctx: Context<DoNothing>) -> Result<()> {
        instructions::do_nothing::handler(ctx)
    }

    #[derive(Accounts)]
    pub struct Write<'info> {
        #[account(mut)]
        target: Signer<'info>,
    }

    /// Write arbitrary bytes to an arbitrary account. YOLO.
    pub fn write(ctx: Context<Write>, offset: u64, data: Vec<u8>) -> Result<()> {
        let account_data = ctx.accounts.target.to_account_info().data;
        let borrow_data = &mut *account_data.borrow_mut();
        let offset = offset as usize;

        Ok((&mut borrow_data[offset..]).write_all(&data[..])?)
    }
}
