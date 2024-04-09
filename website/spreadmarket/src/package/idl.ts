import { IdlAccounts } from "@coral-xyz/anchor";

export type SpreadVault = IdlAccounts<typeof IDL>["spreadVault"];

export type Spreadmarket = {
  version: "0.1.0";
  name: "spreadmarket";
  instructions: [
    {
      name: "buySpread";
      accounts: [
        {
          name: "payer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "owner";
          isMut: false;
          isSigner: false;
        },
        {
          name: "spreadVault";
          isMut: true;
          isSigner: false;
        },
        {
          name: "spreadReceipt";
          isMut: true;
          isSigner: false;
        },
        {
          name: "paymentAcc";
          isMut: true;
          isSigner: false;
          docs: ["Note: must be owned or delegated to payer"];
        },
        {
          name: "premiumsPool";
          isMut: true;
          isSigner: false;
        },
        {
          name: "assetOracle";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "contracts";
          type: "u64";
        },
        {
          name: "strikeLower";
          type: "u64";
        },
        {
          name: "strikeUpper";
          type: "u64";
        },
        {
          name: "priceLowerThreshold";
          type: "u64";
        },
        {
          name: "priceUpperThreshold";
          type: "u64";
        },
        {
          name: "isCall";
          type: "u8";
        }
      ];
    },
    {
      name: "initReceipt";
      docs: [
        "Must run before a spread with the given strikes can be purchased. The strike pairs must",
        "match an offering on the spread_vault."
      ];
      accounts: [
        {
          name: "payer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "owner";
          isMut: false;
          isSigner: false;
        },
        {
          name: "spreadVault";
          isMut: false;
          isSigner: false;
        },
        {
          name: "spreadReceipt";
          isMut: true;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "strikeLower";
          type: "u64";
        },
        {
          name: "strikeUpper";
          type: "u64";
        },
        {
          name: "isCall";
          type: "u8";
        }
      ];
    },
    {
      name: "initVault";
      docs: ["(Admin only) Initialize a new vault for some asset."];
      accounts: [
        {
          name: "payer";
          isMut: true;
          isSigner: true;
          docs: ["Pays the account initialization fees"];
        },
        {
          name: "spreadVault";
          isMut: true;
          isSigner: false;
        },
        {
          name: "paymentMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "assetMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "nonce";
          type: "u16";
        },
        {
          name: "admin";
          type: "publicKey";
        },
        {
          name: "withdrawAuthority";
          type: "publicKey";
        },
        {
          name: "assetOracle";
          type: "publicKey";
        },
        {
          name: "feeRate";
          type: "u32";
        },
        {
          name: "optionDuration";
          type: "u32";
        }
      ];
    },
    {
      name: "initVaultAccsP1";
      docs: ["(Admin only) Initial bootstrapping, run after `init_vault`"];
      accounts: [
        {
          name: "admin";
          isMut: true;
          isSigner: true;
          docs: ["Pays the account initialization fees"];
        },
        {
          name: "spreadVault";
          isMut: false;
          isSigner: false;
        },
        {
          name: "paymentMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "premiumsPool";
          isMut: true;
          isSigner: false;
        },
        {
          name: "feePool";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "initVaultAccsP2";
      docs: ["(Admin only) Initial bootstrapping, run after `init_vault`"];
      accounts: [
        {
          name: "admin";
          isMut: true;
          isSigner: true;
          docs: ["Pays the account initialization fees"];
        },
        {
          name: "spreadVault";
          isMut: false;
          isSigner: false;
        },
        {
          name: "paymentMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "lpMint";
          isMut: true;
          isSigner: false;
          docs: ["Mints tokens that represent stake in the vault"];
        },
        {
          name: "fundingPool";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "setVol";
      docs: ["(Admin only) Set risk free rate and volatility estimates"];
      accounts: [
        {
          name: "admin";
          isMut: true;
          isSigner: true;
        },
        {
          name: "spreadVault";
          isMut: true;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "vol";
          type: "u64";
        },
        {
          name: "riskFree";
          type: "u32";
        }
      ];
    },
    {
      name: "deposit";
      docs: ["Deposit as an LP"];
      accounts: [
        {
          name: "user";
          isMut: false;
          isSigner: true;
        },
        {
          name: "spreadVault";
          isMut: true;
          isSigner: false;
        },
        {
          name: "paymentMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "lpMint";
          isMut: true;
          isSigner: false;
        },
        {
          name: "fundingPool";
          isMut: true;
          isSigner: false;
          docs: ["Vault's storage for payment assets"];
        },
        {
          name: "paymentAcc";
          isMut: true;
          isSigner: false;
          docs: [
            "Must be owned/delegate of the user. Funds will be transferred to `funding_pool`."
          ];
        },
        {
          name: "lpAcc";
          isMut: true;
          isSigner: false;
          docs: ["Users's LP account.", "* Note: Completely unchecked"];
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "amount";
          type: "u64";
        }
      ];
    },
    {
      name: "startMarketEpoch";
      docs: [
        "(Admin only) Start the sale of options. The sale begins when this ix fires, and options",
        "expire at now + spread_vault.option_duration",
        "* call/put_strikes - pass strikes in pairs, in ascending order, padded with zeros. For",
        "example to open a 100/105 spread and a 105/110 spread, pass [0, 0, 0, 0, 100, 105, 105, 110]",
        "* price_lower/upper_threshold - If on devnet/localnet, the price is always set to",
        "(price_lower_threshold + price_upper_threshold) / 2 and the oracle is ignored. On mainnet,",
        "if the oracle's price is below/above these thresholds respectively, the ix fails. In",
        "`PRICE_DECIMALS`. Pass 0/u64::MAX to ignore these checks."
      ];
      accounts: [
        {
          name: "admin";
          isMut: true;
          isSigner: true;
          docs: ["Pays the account initialization fees"];
        },
        {
          name: "spreadVault";
          isMut: true;
          isSigner: false;
        },
        {
          name: "marketEpoch";
          isMut: true;
          isSigner: false;
        },
        {
          name: "assetOracle";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "callStrikes";
          type: {
            array: ["u64", 8];
          };
        },
        {
          name: "putStrikes";
          type: {
            array: ["u64", 8];
          };
        },
        {
          name: "priceLowerThreshold";
          type: "u64";
        },
        {
          name: "priceUpperThreshold";
          type: "u64";
        }
      ];
    },
    {
      name: "redeemSpread";
      docs: ["Redeem an option after expiration, claiming earned funds"];
      accounts: [
        {
          name: "owner";
          isMut: true;
          isSigner: true;
        },
        {
          name: "fundingPool";
          isMut: false;
          isSigner: false;
        },
        {
          name: "destAcc";
          isMut: false;
          isSigner: false;
          docs: [
            "Users's payment account to recieve funds.",
            "* Note: Completely unchecked"
          ];
        },
        {
          name: "destAccCloseFee";
          isMut: false;
          isSigner: false;
        },
        {
          name: "spreadVault";
          isMut: false;
          isSigner: false;
        },
        {
          name: "spreadReceipt";
          isMut: true;
          isSigner: false;
        },
        {
          name: "marketEpoch";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "expireMarket";
      docs: [
        "(Permisionless) Crank oracle price to market. The crank closest to the expiration time will",
        "be the final price used to calculated the option's PnL"
      ];
      accounts: [
        {
          name: "admin";
          isMut: false;
          isSigner: true;
        },
        {
          name: "spreadVault";
          isMut: false;
          isSigner: false;
        },
        {
          name: "marketEpoch";
          isMut: true;
          isSigner: false;
        },
        {
          name: "assetOracle";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "endMarketEpoch";
      docs: [
        "(Permisionless) Realizes losses, settings aside those funds to be redeemed."
      ];
      accounts: [
        {
          name: "spreadVault";
          isMut: true;
          isSigner: false;
        },
        {
          name: "marketEpoch";
          isMut: true;
          isSigner: false;
        },
        {
          name: "assetOracle";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "withdraw";
      accounts: [
        {
          name: "user";
          isMut: false;
          isSigner: true;
        },
        {
          name: "spreadVault";
          isMut: false;
          isSigner: false;
        },
        {
          name: "paymentMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "lpMint";
          isMut: true;
          isSigner: false;
        },
        {
          name: "fundingPool";
          isMut: true;
          isSigner: false;
          docs: ["Vault's storage for payment assets"];
        },
        {
          name: "receivingAcc";
          isMut: true;
          isSigner: false;
          docs: ["Gains withdrawn assets", "NOTE: Completely unchecked."];
        },
        {
          name: "lpAcc";
          isMut: true;
          isSigner: false;
          docs: ["Users's LP account."];
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "amt";
          type: "u64";
        }
      ];
    },
    {
      name: "lendFunds";
      accounts: [
        {
          name: "user";
          isMut: false;
          isSigner: true;
        },
        {
          name: "spreadVault";
          isMut: false;
          isSigner: false;
        },
        {
          name: "paymentMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "fundingPool";
          isMut: true;
          isSigner: false;
          docs: ["Vault's storage for payment assets"];
        },
        {
          name: "lendingAcc";
          isMut: true;
          isSigner: false;
        },
        {
          name: "cpiA";
          isMut: false;
          isSigner: false;
        },
        {
          name: "cpiB";
          isMut: false;
          isSigner: false;
        },
        {
          name: "cpiC";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "amount";
          type: "u64";
        }
      ];
    },
    {
      name: "removeLend";
      accounts: [
        {
          name: "user";
          isMut: false;
          isSigner: true;
        },
        {
          name: "spreadVault";
          isMut: false;
          isSigner: false;
        },
        {
          name: "paymentMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "fundingPool";
          isMut: true;
          isSigner: false;
          docs: ["Vault's storage for payment assets"];
        },
        {
          name: "lendingAcc";
          isMut: true;
          isSigner: false;
        },
        {
          name: "cpiA";
          isMut: false;
          isSigner: false;
        },
        {
          name: "cpiB";
          isMut: false;
          isSigner: false;
        },
        {
          name: "cpiC";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "amount";
          type: "u64";
        }
      ];
    }
  ];
  accounts: [
    {
      name: "marketEpoch";
      type: {
        kind: "struct";
        fields: [
          {
            name: "key";
            docs: [
              'The structs\'s own key. A PDA of `spread_vault`, `epoch`, and "epoch"'
            ];
            type: "publicKey";
          },
          {
            name: "spreadVault";
            type: "publicKey";
          },
          {
            name: "expirationPrice";
            docs: [
              "The price logged at expiration. If the Market hasn't expired yet, this is the last recorded",
              "price. Uses `PRICE_DECIMALS`"
            ];
            type: "u64";
          },
          {
            name: "priceLockedTime";
            docs: [
              "Timestamp when the price was successfully locked on-chain. During periods of high",
              "congestion, this may fall after the expiration of the option by some time, or slightly",
              "before the expiration of the option by some time"
            ];
            type: "i64";
          },
          {
            name: "epoch";
            docs: ["Matches the spread market's epoch."];
            type: "u32";
          },
          {
            name: "padding1";
            type: {
              array: ["u8", 4];
            };
          },
          {
            name: "bump";
            type: "u8";
          },
          {
            name: "isExpired";
            docs: ["0 if time has not not expired, else expired."];
            type: "u8";
          },
          {
            name: "padding2";
            type: {
              array: ["u8", 6];
            };
          },
          {
            name: "reserved0";
            type: {
              array: ["u8", 128];
            };
          }
        ];
      };
    },
    {
      name: "spreadReceipt";
      type: {
        kind: "struct";
        fields: [
          {
            name: "key";
            docs: [
              "The struct's own key. A PDA of `owner`, `spread_vault`, `strike_lower`, `strike_upper`,",
              '`is_call`, and "receipt"'
            ];
            type: "publicKey";
          },
          {
            name: "owner";
            docs: ["Owns this receipt"];
            type: "publicKey";
          },
          {
            name: "strikeLower";
            docs: [
              "The lower strike price in the option spread. Uses `PRICE_DECIMALS`"
            ];
            type: "u64";
          },
          {
            name: "strikeUpper";
            docs: [
              "The upper strike price in the option spread. Uses `PRICE_DECIMALS`"
            ];
            type: "u64";
          },
          {
            name: "premiumPaid";
            docs: [
              "Net premium paid for this option, in `payment_mint_decimals`"
            ];
            type: "u64";
          },
          {
            name: "expiration";
            docs: ["Unix timestamp when option expires"];
            type: "i64";
          },
          {
            name: "contracts";
            docs: [
              "Number of contracts sold (1 contract controls 1 of the asset)"
            ];
            type: "u64";
          },
          {
            name: "exposure";
            docs: [
              "Max loss of this spread multiplied by the contracts, in `payment_mint_decimals`"
            ];
            type: "u64";
          },
          {
            name: "epoch";
            docs: ["Matchs the spread_vault's epoch when this was issued."];
            type: "u32";
          },
          {
            name: "isCall";
            docs: ["See `CALL` and `PUT`"];
            type: "u8";
          },
          {
            name: "bump";
            type: "u8";
          },
          {
            name: "padding1";
            type: {
              array: ["u8", 2];
            };
          },
          {
            name: "reserved2";
            type: {
              array: ["u8", 128];
            };
          }
        ];
      };
    },
    {
      name: "spreadVault";
      type: {
        kind: "struct";
        fields: [
          {
            name: "key";
            docs: [
              'The Vault\'s own key. A PDA of `payment_mint`, `asset_mint`, `nonce`, and "spreadvault"'
            ];
            type: "publicKey";
          },
          {
            name: "admin";
            docs: ["Administrator of this spread vault."];
            type: "publicKey";
          },
          {
            name: "withdrawAuthority";
            docs: [
              "An account that is able to withdraw the vault's earned fees."
            ];
            type: "publicKey";
          },
          {
            name: "paymentMint";
            docs: [
              "Purchases are settled in this currency. This is typically a stablecoin."
            ];
            type: "publicKey";
          },
          {
            name: "assetMint";
            docs: [
              "The currency for which options are bought and sold.",
              "* All options are cash-settled, the program never transacts with this token directly."
            ];
            type: "publicKey";
          },
          {
            name: "lpMint";
            docs: [
              "Mints the tokens that represent stake in the vault's assets.",
              "* Always has the same decimals as the payment mint."
            ];
            type: "publicKey";
          },
          {
            name: "fundingPool";
            docs: [
              "The vault's active funds are kept in this pool and can never be withdrawn (except by users).",
              "* Stores `payment_mint` currency."
            ];
            type: "publicKey";
          },
          {
            name: "premiumsPool";
            docs: [
              "The vault's earnings are stored here until the end of the epoch",
              "* Stores `payment_mint` currency."
            ];
            type: "publicKey";
          },
          {
            name: "feePool";
            docs: [
              "The pool where fees earned by the vault are kept.",
              "* Only the `withdraw_authority` can reclaim these funds.",
              "* Stores `payment_mint` currency."
            ];
            type: "publicKey";
          },
          {
            name: "assetOracle";
            docs: [
              "Oracle for `asset_mint`. Pyth or Switch, admin sets this at their sole discretion and it is",
              "trusted implicitly to be the correct oracle for the asset."
            ];
            type: "publicKey";
          },
          {
            name: "realizedLoss";
            docs: [
              "Amount lost in previous rounds of options, but not yet claimed by buyers.",
              "* In `payment_mint_decimals`"
            ];
            type: "u64";
          },
          {
            name: "lentFunds";
            docs: [
              "Amount deposited in lending. Still available as collateral, but cannot be withdraw until",
              "lending ends (typically the end of an epoch)",
              "* In `payment_mint_decimals`"
            ];
            type: "u64";
          },
          {
            name: "freeFunds";
            docs: [
              "Funds not collateralized by any option, aka the remaining max exposure of the vault.",
              "* In `payment_mint_decimals`"
            ];
            type: "u64";
          },
          {
            name: "volatility";
            docs: [
              "Implied Volatility (IV) for `asset_mint`",
              "* A %, as u32, e.g. 50% = u32MAX / 2.",
              "* Supports values above 100% (e.g. u32MAX * 2 is 200%)"
            ];
            type: "u64";
          },
          {
            name: "riskFreeRate";
            docs: [
              "Risk-free interest rate",
              "* A %, as u32, e.g. 50% = u32MAX / 2"
            ];
            type: "u32";
          },
          {
            name: "feeRate";
            docs: [
              "A % of purchase the vault takes as a fee on every purchase. For example, if the vault sells",
              "an spread for $10, and this is 1%, will take $0.10, charging the buyer a total of $10.10",
              "* A %, as u32, e.g. 50% = u32MAX / 2"
            ];
            type: "u32";
          },
          {
            name: "epoch";
            docs: [
              "Starts at 0 and counts monotonically by 1s for each round of options sold."
            ];
            type: "u32";
          },
          {
            name: "optionDuration";
            docs: ["Expiration time of options sold. In seconds."];
            type: "u32";
          },
          {
            name: "nonce";
            type: "u16";
          },
          {
            name: "paymentMintDecimals";
            type: "u8";
          },
          {
            name: "assetMintDecimals";
            type: "u8";
          },
          {
            name: "bump";
            type: "u8";
          },
          {
            name: "padding1";
            type: {
              array: ["u8", 3];
            };
          },
          {
            name: "saleData";
            docs: [
              "Information about this epoch's available Options for sale and current performance. Only one",
              "set of Options is sold at a time. When a set expires, this part of the vault is over-written",
              "to accomodate the next market epoch."
            ];
            type: {
              defined: "OptionSaleData";
            };
          },
          {
            name: "reserved0";
            type: {
              array: ["u8", 16];
            };
          },
          {
            name: "reserved1";
            type: {
              array: ["u8", 256];
            };
          },
          {
            name: "reserved2";
            type: {
              array: ["u8", 256];
            };
          }
        ];
      };
    }
  ];
  types: [
    {
      name: "OptionSaleData";
      type: {
        kind: "struct";
        fields: [
          {
            name: "calls";
            docs: [
              "Call option strikes this vault has for sale",
              "* The lower price is always first, followed by the higher price.",
              "* Price ranges never overlap and are always in order. E.g. 100-105, 105-110, etc.",
              '* In option parlance, the vault "sells" the lower leg and "buys" the upper leg. I.e. the',
              "vault is selling a call spread between lower/upper",
              "* Max loss (for the vault) is the difference between strikes.",
              "* The vault gains the premium (sell price of lower - buy price of upper)",
              "* zeroed if unused."
            ];
            type: {
              array: [
                {
                  defined: "SpreadOption";
                },
                8
              ];
            };
          },
          {
            name: "puts";
            docs: [
              "Put option strikes this vault has for sale",
              "* The lower price is always first, followed by the higher price.",
              "* Price ranges never overlap and are always in order. E.g. 100-105, 105-110, etc.",
              '* In option parlance, the vault "sells" the upper leg and "buys" the lower leg. I.e. the',
              "vault is selling a put spread between upper/lower",
              "* Max loss (for the vault) is the difference between strikes.",
              "* The vault gains the premium (sell price of upper - buy price of lower)",
              "* zeroed if unused."
            ];
            type: {
              array: [
                {
                  defined: "SpreadOption";
                },
                8
              ];
            };
          },
          {
            name: "priceAtStart";
            docs: ["Asset price when the epoch began. Uses `PRICE_DECIMALS`"];
            type: "u64";
          },
          {
            name: "expiration";
            docs: ["Unix timestamp when options expire and next epoch begins."];
            type: "i64";
          },
          {
            name: "netCallPremiums";
            docs: [
              "Net earned in calls this epoch, uses `payment_mint_decimals`"
            ];
            type: "u64";
          },
          {
            name: "netPutPremiums";
            docs: [
              "Net earned in puts this epoch, uses `payment_mint_decimals`"
            ];
            type: "u64";
          },
          {
            name: "reserved1";
            type: {
              array: ["u8", 64];
            };
          }
        ];
      };
    },
    {
      name: "SpreadOption";
      type: {
        kind: "struct";
        fields: [
          {
            name: "strikeLower";
            docs: [
              "The lower strike price in the option spread. Uses `PRICE_DECIMALS`"
            ];
            type: "u64";
          },
          {
            name: "strikeUpper";
            docs: [
              "The upper strike price in the option spread. Uses `PRICE_DECIMALS`"
            ];
            type: "u64";
          },
          {
            name: "volumeSold";
            docs: [
              "Number of options sold in this epoch with that price range. Note that 1 volume = 1 contract",
              "for 1 asset, e.g. if the asset is SOL, 1 contract controls 1 SOL"
            ];
            type: "u64";
          },
          {
            name: "exposure";
            docs: [
              "Max loss of this spread multiplied by the volume, e.g. max realized loss of the vault"
            ];
            type: "u64";
          },
          {
            name: "active";
            docs: ["0 if this slot is not in use, else in use"];
            type: "u8";
          },
          {
            name: "padding1";
            type: {
              array: ["u8", 7];
            };
          }
        ];
      };
    }
  ];
  errors: [
    {
      code: 6000;
      name: "MathErr";
      msg: "Math overflow or other generic math error";
    },
    {
      code: 6001;
      name: "StrikesOutofOrder";
      msg: "Strikes must be in ascending order";
    },
    {
      code: 6002;
      name: "PriceExceedsThreshold";
      msg: "Price exceeds threshold";
    },
    {
      code: 6003;
      name: "RiskFreeOrVolNotSet";
      msg: "Risk free or Volatility not set";
    },
    {
      code: 6004;
      name: "BadStrikesPassed";
      msg: "Bad strikes passed";
    },
    {
      code: 6005;
      name: "MarketExpired";
      msg: "This market has expired";
    },
    {
      code: 6006;
      name: "ExceededMaxExposure";
      msg: "Exceeded max exposure";
    },
    {
      code: 6007;
      name: "SpreadNotExpired";
      msg: "Not yet expired!";
    }
  ];
};

export const IDL: Spreadmarket = {
  version: "0.1.0",
  name: "spreadmarket",
  instructions: [
    {
      name: "buySpread",
      accounts: [
        {
          name: "payer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "owner",
          isMut: false,
          isSigner: false,
        },
        {
          name: "spreadVault",
          isMut: true,
          isSigner: false,
        },
        {
          name: "spreadReceipt",
          isMut: true,
          isSigner: false,
        },
        {
          name: "paymentAcc",
          isMut: true,
          isSigner: false,
          docs: ["Note: must be owned or delegated to payer"],
        },
        {
          name: "premiumsPool",
          isMut: true,
          isSigner: false,
        },
        {
          name: "assetOracle",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "contracts",
          type: "u64",
        },
        {
          name: "strikeLower",
          type: "u64",
        },
        {
          name: "strikeUpper",
          type: "u64",
        },
        {
          name: "priceLowerThreshold",
          type: "u64",
        },
        {
          name: "priceUpperThreshold",
          type: "u64",
        },
        {
          name: "isCall",
          type: "u8",
        },
      ],
    },
    {
      name: "initReceipt",
      docs: [
        "Must run before a spread with the given strikes can be purchased. The strike pairs must",
        "match an offering on the spread_vault.",
      ],
      accounts: [
        {
          name: "payer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "owner",
          isMut: false,
          isSigner: false,
        },
        {
          name: "spreadVault",
          isMut: false,
          isSigner: false,
        },
        {
          name: "spreadReceipt",
          isMut: true,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "strikeLower",
          type: "u64",
        },
        {
          name: "strikeUpper",
          type: "u64",
        },
        {
          name: "isCall",
          type: "u8",
        },
      ],
    },
    {
      name: "initVault",
      docs: ["(Admin only) Initialize a new vault for some asset."],
      accounts: [
        {
          name: "payer",
          isMut: true,
          isSigner: true,
          docs: ["Pays the account initialization fees"],
        },
        {
          name: "spreadVault",
          isMut: true,
          isSigner: false,
        },
        {
          name: "paymentMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "assetMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "nonce",
          type: "u16",
        },
        {
          name: "admin",
          type: "publicKey",
        },
        {
          name: "withdrawAuthority",
          type: "publicKey",
        },
        {
          name: "assetOracle",
          type: "publicKey",
        },
        {
          name: "feeRate",
          type: "u32",
        },
        {
          name: "optionDuration",
          type: "u32",
        },
      ],
    },
    {
      name: "initVaultAccsP1",
      docs: ["(Admin only) Initial bootstrapping, run after `init_vault`"],
      accounts: [
        {
          name: "admin",
          isMut: true,
          isSigner: true,
          docs: ["Pays the account initialization fees"],
        },
        {
          name: "spreadVault",
          isMut: false,
          isSigner: false,
        },
        {
          name: "paymentMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "premiumsPool",
          isMut: true,
          isSigner: false,
        },
        {
          name: "feePool",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "initVaultAccsP2",
      docs: ["(Admin only) Initial bootstrapping, run after `init_vault`"],
      accounts: [
        {
          name: "admin",
          isMut: true,
          isSigner: true,
          docs: ["Pays the account initialization fees"],
        },
        {
          name: "spreadVault",
          isMut: false,
          isSigner: false,
        },
        {
          name: "paymentMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "lpMint",
          isMut: true,
          isSigner: false,
          docs: ["Mints tokens that represent stake in the vault"],
        },
        {
          name: "fundingPool",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "setVol",
      docs: ["(Admin only) Set risk free rate and volatility estimates"],
      accounts: [
        {
          name: "admin",
          isMut: true,
          isSigner: true,
        },
        {
          name: "spreadVault",
          isMut: true,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "vol",
          type: "u64",
        },
        {
          name: "riskFree",
          type: "u32",
        },
      ],
    },
    {
      name: "deposit",
      docs: ["Deposit as an LP"],
      accounts: [
        {
          name: "user",
          isMut: false,
          isSigner: true,
        },
        {
          name: "spreadVault",
          isMut: true,
          isSigner: false,
        },
        {
          name: "paymentMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "lpMint",
          isMut: true,
          isSigner: false,
        },
        {
          name: "fundingPool",
          isMut: true,
          isSigner: false,
          docs: ["Vault's storage for payment assets"],
        },
        {
          name: "paymentAcc",
          isMut: true,
          isSigner: false,
          docs: [
            "Must be owned/delegate of the user. Funds will be transferred to `funding_pool`.",
          ],
        },
        {
          name: "lpAcc",
          isMut: true,
          isSigner: false,
          docs: ["Users's LP account.", "* Note: Completely unchecked"],
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "amount",
          type: "u64",
        },
      ],
    },
    {
      name: "startMarketEpoch",
      docs: [
        "(Admin only) Start the sale of options. The sale begins when this ix fires, and options",
        "expire at now + spread_vault.option_duration",
        "* call/put_strikes - pass strikes in pairs, in ascending order, padded with zeros. For",
        "example to open a 100/105 spread and a 105/110 spread, pass [0, 0, 0, 0, 100, 105, 105, 110]",
        "* price_lower/upper_threshold - If on devnet/localnet, the price is always set to",
        "(price_lower_threshold + price_upper_threshold) / 2 and the oracle is ignored. On mainnet,",
        "if the oracle's price is below/above these thresholds respectively, the ix fails. In",
        "`PRICE_DECIMALS`. Pass 0/u64::MAX to ignore these checks.",
      ],
      accounts: [
        {
          name: "admin",
          isMut: true,
          isSigner: true,
          docs: ["Pays the account initialization fees"],
        },
        {
          name: "spreadVault",
          isMut: true,
          isSigner: false,
        },
        {
          name: "marketEpoch",
          isMut: true,
          isSigner: false,
        },
        {
          name: "assetOracle",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "callStrikes",
          type: {
            array: ["u64", 8],
          },
        },
        {
          name: "putStrikes",
          type: {
            array: ["u64", 8],
          },
        },
        {
          name: "priceLowerThreshold",
          type: "u64",
        },
        {
          name: "priceUpperThreshold",
          type: "u64",
        },
      ],
    },
    {
      name: "redeemSpread",
      docs: ["Redeem an option after expiration, claiming earned funds"],
      accounts: [
        {
          name: "owner",
          isMut: true,
          isSigner: true,
        },
        {
          name: "fundingPool",
          isMut: false,
          isSigner: false,
        },
        {
          name: "destAcc",
          isMut: false,
          isSigner: false,
          docs: [
            "Users's payment account to recieve funds.",
            "* Note: Completely unchecked",
          ],
        },
        {
          name: "destAccCloseFee",
          isMut: false,
          isSigner: false,
        },
        {
          name: "spreadVault",
          isMut: false,
          isSigner: false,
        },
        {
          name: "spreadReceipt",
          isMut: true,
          isSigner: false,
        },
        {
          name: "marketEpoch",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "expireMarket",
      docs: [
        "(Permisionless) Crank oracle price to market. The crank closest to the expiration time will",
        "be the final price used to calculated the option's PnL",
      ],
      accounts: [
        {
          name: "admin",
          isMut: false,
          isSigner: true,
        },
        {
          name: "spreadVault",
          isMut: false,
          isSigner: false,
        },
        {
          name: "marketEpoch",
          isMut: true,
          isSigner: false,
        },
        {
          name: "assetOracle",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "endMarketEpoch",
      docs: [
        "(Permisionless) Realizes losses, settings aside those funds to be redeemed.",
      ],
      accounts: [
        {
          name: "spreadVault",
          isMut: true,
          isSigner: false,
        },
        {
          name: "marketEpoch",
          isMut: true,
          isSigner: false,
        },
        {
          name: "assetOracle",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "withdraw",
      accounts: [
        {
          name: "user",
          isMut: false,
          isSigner: true,
        },
        {
          name: "spreadVault",
          isMut: false,
          isSigner: false,
        },
        {
          name: "paymentMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "lpMint",
          isMut: true,
          isSigner: false,
        },
        {
          name: "fundingPool",
          isMut: true,
          isSigner: false,
          docs: ["Vault's storage for payment assets"],
        },
        {
          name: "receivingAcc",
          isMut: true,
          isSigner: false,
          docs: ["Gains withdrawn assets", "NOTE: Completely unchecked."],
        },
        {
          name: "lpAcc",
          isMut: true,
          isSigner: false,
          docs: ["Users's LP account."],
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "amt",
          type: "u64",
        },
      ],
    },
    {
      name: "lendFunds",
      accounts: [
        {
          name: "user",
          isMut: false,
          isSigner: true,
        },
        {
          name: "spreadVault",
          isMut: false,
          isSigner: false,
        },
        {
          name: "paymentMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "fundingPool",
          isMut: true,
          isSigner: false,
          docs: ["Vault's storage for payment assets"],
        },
        {
          name: "lendingAcc",
          isMut: true,
          isSigner: false,
        },
        {
          name: "cpiA",
          isMut: false,
          isSigner: false,
        },
        {
          name: "cpiB",
          isMut: false,
          isSigner: false,
        },
        {
          name: "cpiC",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "amount",
          type: "u64",
        },
      ],
    },
    {
      name: "removeLend",
      accounts: [
        {
          name: "user",
          isMut: false,
          isSigner: true,
        },
        {
          name: "spreadVault",
          isMut: false,
          isSigner: false,
        },
        {
          name: "paymentMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "fundingPool",
          isMut: true,
          isSigner: false,
          docs: ["Vault's storage for payment assets"],
        },
        {
          name: "lendingAcc",
          isMut: true,
          isSigner: false,
        },
        {
          name: "cpiA",
          isMut: false,
          isSigner: false,
        },
        {
          name: "cpiB",
          isMut: false,
          isSigner: false,
        },
        {
          name: "cpiC",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "amount",
          type: "u64",
        },
      ],
    },
  ],
  accounts: [
    {
      name: "marketEpoch",
      type: {
        kind: "struct",
        fields: [
          {
            name: "key",
            docs: [
              'The structs\'s own key. A PDA of `spread_vault`, `epoch`, and "epoch"',
            ],
            type: "publicKey",
          },
          {
            name: "spreadVault",
            type: "publicKey",
          },
          {
            name: "expirationPrice",
            docs: [
              "The price logged at expiration. If the Market hasn't expired yet, this is the last recorded",
              "price. Uses `PRICE_DECIMALS`",
            ],
            type: "u64",
          },
          {
            name: "priceLockedTime",
            docs: [
              "Timestamp when the price was successfully locked on-chain. During periods of high",
              "congestion, this may fall after the expiration of the option by some time, or slightly",
              "before the expiration of the option by some time",
            ],
            type: "i64",
          },
          {
            name: "epoch",
            docs: ["Matches the spread market's epoch."],
            type: "u32",
          },
          {
            name: "padding1",
            type: {
              array: ["u8", 4],
            },
          },
          {
            name: "bump",
            type: "u8",
          },
          {
            name: "isExpired",
            docs: ["0 if time has not not expired, else expired."],
            type: "u8",
          },
          {
            name: "padding2",
            type: {
              array: ["u8", 6],
            },
          },
          {
            name: "reserved0",
            type: {
              array: ["u8", 128],
            },
          },
        ],
      },
    },
    {
      name: "spreadReceipt",
      type: {
        kind: "struct",
        fields: [
          {
            name: "key",
            docs: [
              "The struct's own key. A PDA of `owner`, `spread_vault`, `strike_lower`, `strike_upper`,",
              '`is_call`, and "receipt"',
            ],
            type: "publicKey",
          },
          {
            name: "owner",
            docs: ["Owns this receipt"],
            type: "publicKey",
          },
          {
            name: "strikeLower",
            docs: [
              "The lower strike price in the option spread. Uses `PRICE_DECIMALS`",
            ],
            type: "u64",
          },
          {
            name: "strikeUpper",
            docs: [
              "The upper strike price in the option spread. Uses `PRICE_DECIMALS`",
            ],
            type: "u64",
          },
          {
            name: "premiumPaid",
            docs: [
              "Net premium paid for this option, in `payment_mint_decimals`",
            ],
            type: "u64",
          },
          {
            name: "expiration",
            docs: ["Unix timestamp when option expires"],
            type: "i64",
          },
          {
            name: "contracts",
            docs: [
              "Number of contracts sold (1 contract controls 1 of the asset)",
            ],
            type: "u64",
          },
          {
            name: "exposure",
            docs: [
              "Max loss of this spread multiplied by the contracts, in `payment_mint_decimals`",
            ],
            type: "u64",
          },
          {
            name: "epoch",
            docs: ["Matchs the spread_vault's epoch when this was issued."],
            type: "u32",
          },
          {
            name: "isCall",
            docs: ["See `CALL` and `PUT`"],
            type: "u8",
          },
          {
            name: "bump",
            type: "u8",
          },
          {
            name: "padding1",
            type: {
              array: ["u8", 2],
            },
          },
          {
            name: "reserved2",
            type: {
              array: ["u8", 128],
            },
          },
        ],
      },
    },
    {
      name: "spreadVault",
      type: {
        kind: "struct",
        fields: [
          {
            name: "key",
            docs: [
              'The Vault\'s own key. A PDA of `payment_mint`, `asset_mint`, `nonce`, and "spreadvault"',
            ],
            type: "publicKey",
          },
          {
            name: "admin",
            docs: ["Administrator of this spread vault."],
            type: "publicKey",
          },
          {
            name: "withdrawAuthority",
            docs: [
              "An account that is able to withdraw the vault's earned fees.",
            ],
            type: "publicKey",
          },
          {
            name: "paymentMint",
            docs: [
              "Purchases are settled in this currency. This is typically a stablecoin.",
            ],
            type: "publicKey",
          },
          {
            name: "assetMint",
            docs: [
              "The currency for which options are bought and sold.",
              "* All options are cash-settled, the program never transacts with this token directly.",
            ],
            type: "publicKey",
          },
          {
            name: "lpMint",
            docs: [
              "Mints the tokens that represent stake in the vault's assets.",
              "* Always has the same decimals as the payment mint.",
            ],
            type: "publicKey",
          },
          {
            name: "fundingPool",
            docs: [
              "The vault's active funds are kept in this pool and can never be withdrawn (except by users).",
              "* Stores `payment_mint` currency.",
            ],
            type: "publicKey",
          },
          {
            name: "premiumsPool",
            docs: [
              "The vault's earnings are stored here until the end of the epoch",
              "* Stores `payment_mint` currency.",
            ],
            type: "publicKey",
          },
          {
            name: "feePool",
            docs: [
              "The pool where fees earned by the vault are kept.",
              "* Only the `withdraw_authority` can reclaim these funds.",
              "* Stores `payment_mint` currency.",
            ],
            type: "publicKey",
          },
          {
            name: "assetOracle",
            docs: [
              "Oracle for `asset_mint`. Pyth or Switch, admin sets this at their sole discretion and it is",
              "trusted implicitly to be the correct oracle for the asset.",
            ],
            type: "publicKey",
          },
          {
            name: "realizedLoss",
            docs: [
              "Amount lost in previous rounds of options, but not yet claimed by buyers.",
              "* In `payment_mint_decimals`",
            ],
            type: "u64",
          },
          {
            name: "lentFunds",
            docs: [
              "Amount deposited in lending. Still available as collateral, but cannot be withdraw until",
              "lending ends (typically the end of an epoch)",
              "* In `payment_mint_decimals`",
            ],
            type: "u64",
          },
          {
            name: "freeFunds",
            docs: [
              "Funds not collateralized by any option, aka the remaining max exposure of the vault.",
              "* In `payment_mint_decimals`",
            ],
            type: "u64",
          },
          {
            name: "volatility",
            docs: [
              "Implied Volatility (IV) for `asset_mint`",
              "* A %, as u32, e.g. 50% = u32MAX / 2.",
              "* Supports values above 100% (e.g. u32MAX * 2 is 200%)",
            ],
            type: "u64",
          },
          {
            name: "riskFreeRate",
            docs: [
              "Risk-free interest rate",
              "* A %, as u32, e.g. 50% = u32MAX / 2",
            ],
            type: "u32",
          },
          {
            name: "feeRate",
            docs: [
              "A % of purchase the vault takes as a fee on every purchase. For example, if the vault sells",
              "an spread for $10, and this is 1%, will take $0.10, charging the buyer a total of $10.10",
              "* A %, as u32, e.g. 50% = u32MAX / 2",
            ],
            type: "u32",
          },
          {
            name: "epoch",
            docs: [
              "Starts at 0 and counts monotonically by 1s for each round of options sold.",
            ],
            type: "u32",
          },
          {
            name: "optionDuration",
            docs: ["Expiration time of options sold. In seconds."],
            type: "u32",
          },
          {
            name: "nonce",
            type: "u16",
          },
          {
            name: "paymentMintDecimals",
            type: "u8",
          },
          {
            name: "assetMintDecimals",
            type: "u8",
          },
          {
            name: "bump",
            type: "u8",
          },
          {
            name: "padding1",
            type: {
              array: ["u8", 3],
            },
          },
          {
            name: "saleData",
            docs: [
              "Information about this epoch's available Options for sale and current performance. Only one",
              "set of Options is sold at a time. When a set expires, this part of the vault is over-written",
              "to accomodate the next market epoch.",
            ],
            type: {
              defined: "OptionSaleData",
            },
          },
          {
            name: "reserved0",
            type: {
              array: ["u8", 16],
            },
          },
          {
            name: "reserved1",
            type: {
              array: ["u8", 256],
            },
          },
          {
            name: "reserved2",
            type: {
              array: ["u8", 256],
            },
          },
        ],
      },
    },
  ],
  types: [
    {
      name: "OptionSaleData",
      type: {
        kind: "struct",
        fields: [
          {
            name: "calls",
            docs: [
              "Call option strikes this vault has for sale",
              "* The lower price is always first, followed by the higher price.",
              "* Price ranges never overlap and are always in order. E.g. 100-105, 105-110, etc.",
              '* In option parlance, the vault "sells" the lower leg and "buys" the upper leg. I.e. the',
              "vault is selling a call spread between lower/upper",
              "* Max loss (for the vault) is the difference between strikes.",
              "* The vault gains the premium (sell price of lower - buy price of upper)",
              "* zeroed if unused.",
            ],
            type: {
              array: [
                {
                  defined: "SpreadOption",
                },
                8,
              ],
            },
          },
          {
            name: "puts",
            docs: [
              "Put option strikes this vault has for sale",
              "* The lower price is always first, followed by the higher price.",
              "* Price ranges never overlap and are always in order. E.g. 100-105, 105-110, etc.",
              '* In option parlance, the vault "sells" the upper leg and "buys" the lower leg. I.e. the',
              "vault is selling a put spread between upper/lower",
              "* Max loss (for the vault) is the difference between strikes.",
              "* The vault gains the premium (sell price of upper - buy price of lower)",
              "* zeroed if unused.",
            ],
            type: {
              array: [
                {
                  defined: "SpreadOption",
                },
                8,
              ],
            },
          },
          {
            name: "priceAtStart",
            docs: ["Asset price when the epoch began. Uses `PRICE_DECIMALS`"],
            type: "u64",
          },
          {
            name: "expiration",
            docs: ["Unix timestamp when options expire and next epoch begins."],
            type: "i64",
          },
          {
            name: "netCallPremiums",
            docs: [
              "Net earned in calls this epoch, uses `payment_mint_decimals`",
            ],
            type: "u64",
          },
          {
            name: "netPutPremiums",
            docs: [
              "Net earned in puts this epoch, uses `payment_mint_decimals`",
            ],
            type: "u64",
          },
          {
            name: "reserved1",
            type: {
              array: ["u8", 64],
            },
          },
        ],
      },
    },
    {
      name: "SpreadOption",
      type: {
        kind: "struct",
        fields: [
          {
            name: "strikeLower",
            docs: [
              "The lower strike price in the option spread. Uses `PRICE_DECIMALS`",
            ],
            type: "u64",
          },
          {
            name: "strikeUpper",
            docs: [
              "The upper strike price in the option spread. Uses `PRICE_DECIMALS`",
            ],
            type: "u64",
          },
          {
            name: "volumeSold",
            docs: [
              "Number of options sold in this epoch with that price range. Note that 1 volume = 1 contract",
              "for 1 asset, e.g. if the asset is SOL, 1 contract controls 1 SOL",
            ],
            type: "u64",
          },
          {
            name: "exposure",
            docs: [
              "Max loss of this spread multiplied by the volume, e.g. max realized loss of the vault",
            ],
            type: "u64",
          },
          {
            name: "active",
            docs: ["0 if this slot is not in use, else in use"],
            type: "u8",
          },
          {
            name: "padding1",
            type: {
              array: ["u8", 7],
            },
          },
        ],
      },
    },
  ],
  errors: [
    {
      code: 6000,
      name: "MathErr",
      msg: "Math overflow or other generic math error",
    },
    {
      code: 6001,
      name: "StrikesOutofOrder",
      msg: "Strikes must be in ascending order",
    },
    {
      code: 6002,
      name: "PriceExceedsThreshold",
      msg: "Price exceeds threshold",
    },
    {
      code: 6003,
      name: "RiskFreeOrVolNotSet",
      msg: "Risk free or Volatility not set",
    },
    {
      code: 6004,
      name: "BadStrikesPassed",
      msg: "Bad strikes passed",
    },
    {
      code: 6005,
      name: "MarketExpired",
      msg: "This market has expired",
    },
    {
      code: 6006,
      name: "ExceededMaxExposure",
      msg: "Exceeded max exposure",
    },
    {
      code: 6007,
      name: "SpreadNotExpired",
      msg: "Not yet expired!",
    },
  ],
};
