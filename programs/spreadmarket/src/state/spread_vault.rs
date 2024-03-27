use anchor_lang::prelude::*;
use bytemuck::{Pod, Zeroable};
use psy_macros::assert_size;

pub const VAULT_PADDING: usize = 256;
pub const LP_MINT_DECIMALS: u8 = 6;

// #[assert_size(1024)]
#[account(zero_copy)]
#[repr(C)]
pub struct SpreadVault {
    /// The Vault's own key. A PDA of `payment_mint`, `asset_mint`, `nonce`, and "spreadvault"
    pub key: Pubkey,
    /// Administrator of this spread vault.
    pub admin: Pubkey,
    /// An account that is able to withdraw the vault's earned fees.
    pub withdraw_authority: Pubkey,
    /// Purchases are settled in this currency. This is typically a stablecoin.
    pub payment_mint: Pubkey,
    /// The currency for which options are bought and sold.
    /// * All options are cash-settled, the program never transacts with this currency directly.
    pub asset_mint: Pubkey,
    /// Mints the tokens that represent stake in the vault's assets.
    pub lp_mint: Pubkey,
    /// The vault's active funds are kept in this pool and can never be withdrawn (except by users).
    /// * Stores `payment_mint` currency.
    pub funding_pool: Pubkey,
    /// The vault's earnings are stored here until the end of the epoch
    /// * Stores `payment_mint` currency.
    pub premiums_pool: Pubkey,
    /// The pool where fees earned by the protocol are kept.
    /// * Only the `withdraw_authority` can reclaim these funds.
    /// * Stores `payment_mint` currency.
    pub fee_pool: Pubkey,
    /// Oracle for `asset_mint`. Pyth or Switch, admin sets this at their sole discretion and it is
    /// trusted implicitly to be the correct oracle for the asset.
    pub asset_oracle: Pubkey,

    /// Implied Volatility (IV) for `asset_mint`
    /// * A %, as u32, e.g. 50% = u32MAX / 2.
    /// * Supports values above 100% (e.g. u32MAX * 2 is 200%)
    pub volatility: u64,
    /// Risk-free interest rate
    /// * A %, as u32, e.g. 50% = u32MAX / 2
    pub risk_free_rate: u32,
    /// A % of purchase the vault takes as a fee on every purchase. For example, if the vault sells
    /// an spread for $10, and this is 1%, will take $0.10, charging the buyer a total of $10.10
    /// * A %, as u32, e.g. 50% = u32MAX / 2
    pub fee_rate: u32,
    /// Starts at 0 and counts monotonically by 1s for each round of options sold.
    pub epoch: u32,
    /// Expiration time of options sold. In seconds.
    pub option_duration: u32,
    // _padding0: [u8; 4],

    pub nonce: u16,
    pub payment_mint_decimals: u8,
    pub asset_mint_decimals: u8,
    _padding1: [u8; 4],

    _reserved0: [u8; 16],
    _reserved1: [u8; 256],
    _reserved2: [u8; VAULT_PADDING],
}

impl SpreadVault {
    pub const LEN: usize = std::mem::size_of::<SpreadVault>();
}
