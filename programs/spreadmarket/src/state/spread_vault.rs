use anchor_lang::prelude::*;
use bytemuck::{Pod, Zeroable};
use psy_macros::assert_size;

pub const VAULT_PADDING: usize = 256;

// #[assert_size(1024)]
#[account(zero_copy)]
#[repr(C)]
pub struct SpreadVault {
    /// The Vault's own key. A PDA of TODO
    pub key: Pubkey,

    /// Administrator of this spread vault.
    pub admin: Pubkey,

    /// Purchases are settled in this currency
    pub payment_mint: Pubkey,

    /// The currency for which options are bought and sold
    pub asset_mint: Pubkey,

    pub placeholder: u64,

    pub nonce: u16,
    pub payment_mint_decimals: u8,
    pub asset_mint_decimals: u8,
    _padding: [u8; 4],

    _reserved0: [u8; 16],
    _reserved1: [u8; 256],
    _reserved2: [u8; VAULT_PADDING],
}

impl SpreadVault {
    pub const LEN: usize = std::mem::size_of::<SpreadVault>();
}