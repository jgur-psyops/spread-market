use anchor_lang::prelude::*;
// use bytemuck::{Pod, Zeroable};
// use psy_macros::assert_size;

pub const EPOCH_PADDING: usize = 128;

// #[assert_size(1024)]
#[account(zero_copy)]
#[repr(C)]
pub struct MarketEpoch {
    /// The structs's own key. A PDA of `spread_vault`, `epoch`, and "epoch"
    pub key: Pubkey,
    pub spread_vault: Pubkey,

    /// The price logged at expiration. If the Market hasn't expired yet, this is the last recorded
    /// price. Uses `PRICE_DECIMALS`
    pub expiration_price: u64,
    /// Timestamp when the price was successfully locked on-chain. During periods of high
    /// congestion, this may fall after the expiration of the option by some time, or slightly
    /// before the expiration of the option by some time
    pub price_locked_time: i64,

    /// Matches the spread market's epoch.
    pub epoch: u32,
    _padding1: [u8; 4],

    pub bump: u8,
    /// 0 if time has not not expired, else expired.
    pub is_expired: u8,
    _padding2: [u8; 6],

    _reserved0: [u8; EPOCH_PADDING],
}

impl MarketEpoch {
    pub const LEN: usize = std::mem::size_of::<MarketEpoch>();
}
