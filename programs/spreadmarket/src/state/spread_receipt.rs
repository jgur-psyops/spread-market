use anchor_lang::prelude::*;
//use bytemuck::{Pod, Zeroable};
//use psy_macros::assert_size;

pub const RECEIPT_PADDING: usize = 128;
pub const CALL: u8 = 1;
pub const PUT: u8 = 2;

// #[assert_size(1024)]
#[account(zero_copy)]
#[repr(C)]
pub struct SpreadReceipt {
    /// The struct's own key. A PDA of `owner`, `spread_vault`, `strike_lower`, `strike_upper`,
    /// `is_call`, and "receipt"
    pub key: Pubkey,
    /// Owns this receipt
    pub owner: Pubkey,

    /// The lower strike price in the option spread. Uses `PRICE_DECIMALS`
    pub strike_lower: u64,
    /// The upper strike price in the option spread. Uses `PRICE_DECIMALS`
    pub strike_upper: u64,
    /// Net premium paid for this option, in `payment_mint_decimals`
    pub premium_paid: u64,
    /// Unix timestamp when option expires
    pub expiration: i64,
    /// Number of contracts sold (1 contract controls 1 of the asset)
    pub contracts: u64,
    /// Max loss of this spread multiplied by the contracts, in `payment_mint_decimals`
    pub exposure: u64,

    /// Matchs the spread_vault's epoch when this was issued.
    pub epoch: u32,
    /// See `CALL` and `PUT`
    pub is_call: u8,
    pub bump: u8,
    _padding1: [u8; 2],

    _reserved2: [u8; RECEIPT_PADDING],
}

impl SpreadReceipt {
    pub const LEN: usize = std::mem::size_of::<SpreadReceipt>();
}
