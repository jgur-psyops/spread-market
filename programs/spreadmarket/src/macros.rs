#[macro_export]
macro_rules! spread_vault_signer_seeds {
    ($spreadvault:expr) => {
        &[
            $spreadvault.payment_mint.as_ref(),
            $spreadvault.asset_mint.as_ref(),
            &$spreadvault.nonce.to_le_bytes(),
            b"spreadvault",
            &[$spreadvault.bump_seed],
        ]
    };
}