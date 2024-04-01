use anchor_lang::prelude::*;

#[account()]
pub struct SomeAcc {
    /// The account's own key
    pub key: Pubkey,
    pub nonce: u16,
}

impl SomeAcc {
    pub const LEN: usize = std::mem::size_of::<SomeAcc>();
}