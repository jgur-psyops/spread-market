use anchor_lang::prelude::*;
use bytemuck::{Pod, Zeroable};
//use psy_macros::assert_size;

pub const VAULT_PADDING: usize = 256;
pub const PRICE_DECIMALS: u8 = 6;

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
    /// * All options are cash-settled, the program never transacts with this token directly.
    pub asset_mint: Pubkey,
    /// Mints the tokens that represent stake in the vault's assets.
    /// * Always has the same decimals as the payment mint.
    pub lp_mint: Pubkey,
    /// The vault's active funds are kept in this pool and can never be withdrawn (except by users).
    /// * Stores `payment_mint` currency.
    pub funding_pool: Pubkey,
    /// The vault's earnings are stored here until the end of the epoch
    /// * Stores `payment_mint` currency.
    pub premiums_pool: Pubkey,
    /// The pool where fees earned by the vault are kept.
    /// * Only the `withdraw_authority` can reclaim these funds.
    /// * Stores `payment_mint` currency.
    pub fee_pool: Pubkey,
    /// Oracle for `asset_mint`. Pyth or Switch, admin sets this at their sole discretion and it is
    /// trusted implicitly to be the correct oracle for the asset.
    pub asset_oracle: Pubkey,

    /// Amount lost in previous rounds of options, but not yet claimed by buyers.
    /// * In `payment_mint_decimals`
    pub realized_loss: u64,
    /// Amount deposited in lending. Still available as collateral, but cannot be withdraw until
    /// lending ends (typically the end of an epoch)
    /// * In `payment_mint_decimals`
    pub lent_funds: u64,
    /// Funds not collateralized by any option, aka the remaining max exposure of the vault.
    /// * In `payment_mint_decimals`
    pub free_funds: u64,
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
    pub bump: u8,
    _padding1: [u8; 3],

    /// Information about this epoch's available Options for sale and current performance. Only one
    /// set of Options is sold at a time. When a set expires, this part of the vault is over-written
    /// to accomodate the next market epoch.
    pub sale_data: OptionSaleData,

    _reserved0: [u8; 16],
    _reserved1: [u8; 256],
    _reserved2: [u8; VAULT_PADDING],
}

impl SpreadVault {
    pub const LEN: usize = std::mem::size_of::<SpreadVault>();
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, Zeroable, Pod)]
#[repr(C)]
pub struct OptionSaleData {
    /// Call option strikes this vault has for sale
    /// * The lower price is always first, followed by the higher price.
    /// * Price ranges never overlap and are always in order. E.g. 100-105, 105-110, etc.
    /// * In option parlance, the vault "sells" the lower leg and "buys" the upper leg. I.e. the
    ///   vault is selling a call spread between lower/upper
    /// * Max loss (for the vault) is the difference between strikes.
    /// * The vault gains the premium (sell price of lower - buy price of upper)
    /// * zeroed if unused.
    pub calls: [SpreadOption; 8],

    /// Put option strikes this vault has for sale
    /// * The lower price is always first, followed by the higher price.
    /// * Price ranges never overlap and are always in order. E.g. 100-105, 105-110, etc.
    /// * In option parlance, the vault "sells" the upper leg and "buys" the lower leg. I.e. the
    ///   vault is selling a put spread between upper/lower
    /// * Max loss (for the vault) is the difference between strikes.
    /// * The vault gains the premium (sell price of upper - buy price of lower)
    /// * zeroed if unused.
    pub puts: [SpreadOption; 8],

    /// Asset price when the epoch began. Uses `PRICE_DECIMALS`
    pub price_at_start: u64,
    /// Unix timestamp when options expire and next epoch begins.
    pub expiration: i64,
    /// Net earned in calls this epoch, uses `payment_mint_decimals`
    pub net_call_premiums: u64,
    /// Net earned in puts this epoch, uses `payment_mint_decimals`
    pub net_put_premiums: u64,

    _reserved1: [u8; 64],
}

impl OptionSaleData {
    pub const LEN: usize = std::mem::size_of::<OptionSaleData>();

    /// Returns the index of the spread option if ix exists, else None
    pub fn get_spread_option_index(
        &self,
        is_call: bool,
        strike_lower: u64,
        strike_upper: u64,
    ) -> Option<usize> {
        let options = if is_call { self.calls } else { self.puts };
        for i in 0..options.len() {
            let opt = &options[i];

            if opt.active != 0
                && opt.strike_lower == strike_lower
                && opt.strike_upper == strike_upper
            {
                return Some(i);
            }
        }
        None
    }
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, Zeroable, Pod)]
#[repr(C)]
pub struct SpreadOption {
    /// The lower strike price in the option spread. Uses `PRICE_DECIMALS`
    pub strike_lower: u64,
    /// The upper strike price in the option spread. Uses `PRICE_DECIMALS`
    pub strike_upper: u64,
    /// Number of options sold in this epoch with that price range. Note that 1 volume = 1 contract
    /// for 1 asset, e.g. if the asset is SOL, 1 contract controls 1 SOL
    pub volume_sold: u64,
    /// Max loss of this spread multiplied by the volume, e.g. max realized loss of the vault
    pub exposure: u64,
    /// 0 if this slot is not in use, else in use
    pub active: u8,
    _padding1: [u8; 7],
}

impl SpreadOption {
    pub const LEN: usize = std::mem::size_of::<SpreadOption>();

    pub fn new(lower: u64, upper: u64) -> Self {
        SpreadOption {
            strike_lower: lower,
            strike_upper: upper,
            volume_sold: 0,
            exposure: 0,
            active: 1,
            _padding1: [0; 7],
        }
    }
}
