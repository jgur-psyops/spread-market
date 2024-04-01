#[macro_export]
macro_rules! set_bump_from_ctx {
    ($ctx:expr, $key:expr, $account_field:expr) => {
        match $ctx.bumps.get($key) {
            Some(bump) => {
                $account_field = *bump;
            }
            None => {
                msg!("Wrong bump key. Available keys are {:?}", $ctx.bumps.keys());
                panic!("Wrong bump key")
            }
        }
    };
}

#[macro_export]
macro_rules! pool_auth_signer_seeds {
    ($pool_auth:expr) => {
        &[
            &$pool_auth.nonce.to_le_bytes(),
            b"pool_auth".as_ref(),
            &[$pool_auth.bump_seed],
        ]
    };
}

#[macro_export]
macro_rules! clp_vault_signer_seeds {
    ($clp_vault:expr) => {
        &[
            &$clp_vault.nonce.to_le_bytes(),
            $clp_vault.token_mint_a.as_ref(),
            $clp_vault.token_mint_b.as_ref(),
            $clp_vault.admin_key.as_ref(),
            b"clpVault",
            &[$clp_vault.bump_seed],
        ]
    };
}