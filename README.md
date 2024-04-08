## HOW DOES THE VAULT WORK

A Spread vault essentially enters Iron Condors at different price levels, seeking a delta-neutral yield that profits from volatility, and has wide utility depending on how the administrator configures the size of the spreads' wings.

Options are European style and cash-settled at expiration.

If the price is X, the vault sells two kinds of Options: (1) call spreads at X+Y/X+Z, (2) put
spreads at X-Y/X-Z. For example, if the price of an asset is $100, the vault might sell call spreads
at 105/110 and put spreads at 90/95. In options parlance, the "spread" that the vault trades involves purchasing the 105 leg and selling the 110
leg (for the call), or purchasing the 95 leg and selling the 90 leg (for a put) -- the vault does
this atomically by selling the spread as a single product. Note that the max loss to the vault for
either spread is 5, meaning the vault can fully collateraize this position with just 5 tokens.

Vault LPs are roughly delta-nuetral, they typically earn a profit as long as both call and put sides have
healthy sales. When volatility is low, LPs typically collect both premiums. When volatility is high, LPs
might be assigned (an option expires in-the-money), but high volatility also leads to higher premiums, so they may still profit!

Option buyers typically profit when they guess the asset's price direction correctly.

### Example

The LP has 1000 in funding. It sells calls against the asset at 105/110 and puts at 90/95. The calls and puts both cost 1.

Buyers purchase 200 calls and 150 puts. The vault earns 350 in premiums. All the collateral on the call side has been consumed. The put side has 1000 - 150 \* 5 (the max loss) = 250 collateral remaining (it can sell 50 more puts), so the LP has some delta exposure in this scenario.

Let's look at what happens at different price points when the options expire:

- If the price ends at 100, the LP makes 350 and all buyers make nothing. The LP now has 1350.
- If the price ends above 105, the LP loses 1000, but keeps the premium. The LP now has 350. Call buyers gain 1000 (a profit of 800)
- If the price ends below 90, the LP loses (150 \* 5) = 750, but keeps the premium. The LP now has 600. Put buyers gain 750 (a profit of 600)
- At prices in between, e.g. 102, the LP loses some proportion. At 102, the LP loses 200 \* 2 = 400. After the premium, the LP still has 950 in this scenario, but call buyers also profit by 200.

## WHAT IS THE EXPECTED YIELD FOR LPs?

The funding pool is deposited into stablecoin lending while options have not expired, so at minimum the vault performs like a managed stablecoin lending platform. 

We do not depend on vaults to sell out of options for yield, particularly as pricing becomes more aggressive when one side is unbalanced. A vault that has fully sold is maximally exposed, and LPs should be compensated accordingly. 

Ultimately, LPs can expect yields to vary substantially depending on how well the vault's administrator predicts future volatility and how aggressively priced the options are. More conservative strikes are generally less attractive to buyers, but also less likely to be assigned at expiration!


## HOW DOES THE VAULT AVOID DELTA EXPOSURE

The vault tries to keep its call side and put side balanced to create a condor-like position. To achieve this, the vault adds an ever-increasing premium to the side with more buyers. For example, if the price is 100, and 100 calls have been sold a 105/110, but only 25 puts have been sold at 90/95, the vault will charge more for calls. The proportion of the extra charge will decrease if the number of puts sold gets closer to the number of calls. This ensures that LPs are not wiped out by a move in one direction when no buyers want to purchase the other direction.

## WHY BUY A SPREAD INSTEAD OF A PERP

Spreads are an all-or-nothing bet that an asset will move in a direction by a certain time. Leverage for these positions is far higher than can be typically obtained in perps. Consider the example above, where a call spread buyer controls an asset worth 100 for just 1 token in premium. If the price ends above 105, they earn 5 tokens, a profit of 400\%. A spread with that level of leverage could be wiped out by tiny movements in the other direction.

Buyers seeking high delta exposure may prefer spreads over perps. Volatility traders may also buy both sides, e.g. buy both the call and put side (essentially forming a strangle), a trade that is harder to manage with perps.

The key advantage vs perps is that perps require maintenance and have a chance to be liquidated. Spreads are purchased once and are safe until expiry. After expiration, they can be redeemed any time, making them more fire-and-forget for traders that don't want to actively manage positions every day. Spreads are also cash-settled for both LPs and buyers, so you only need to hold stablecoin, which avoids some common de-pegging and smart contract risks.

The downside, of course, is that spreads earn nothing unless the asset expires in-the-money.

## WHAT DOES THE ADMINISTRATOR CONTROL

First, the administrator sets the strike prices and the cadence in which options are sold. e.g. daily or weekly. A wider spread allows the position to move more without becoming unprofitable, while tighter spreads limit max loss. Options of different durations also have different risk profiles.

The administrator is responsible for accurately reporting the Implied Volatility (IV) and risk-free-rate, which are sourced externally, and used to price the option. If the administrator under-reports the IV, LPs will likely lose money, and if it over-reports the IV, buyers may not want to purchase the options.

## WHY DON'T I JUST BUY FROM DERIBIT

Other than a love of Defi, the Spread vault has some key advantages. 

The biggest advantage is that because the spread is sold atomically, you do not have to cross the bid-ask spread to purchase both legs. Another advantage is that the vault always has liquidity (as long as it hasn't maxed its exposure), and the price doesn't fluctate when the order book is thin. Savvy traders will likely try to arbitrage the vault if they feel the IV estimate is too low!

Spread vaults can be quickly initialized for any asset, so a broader selection of assets can be traded.

## HOW DOES REDEMPTION WORK AT EXPIRATION

There is a permisionless crank to set the current price of the market, any user can fire it to update the price based on the current oracle price. The vault administrator will also attempt to do so. The cranked price that ran closest to the expiration time is used as the final price (this may be several seconds before or after the true expiration if the network is congested). 

The vault then uses this price to determine its realized loss per contract. The vault will (permisionlessly) allocate realized losses before the next round of options are sold, which any use can fire if the vault adminstrator hasn't done so. At any time after that, even weeks or months later, option buyers can claim their earnings. To maximize yield, even realized losses stay in stablecoin lending until a withdraw is requested. In rare instances, if the stablecoin lending platform is fully utilized, buyers may need to wait to claim their funds.

## ARE MY OPTIONS AND LP TOKENS A LIQUID ASSET

Soon!

## DISCLAIMER

None of the above is financial advice. These are soley the opinions of Spread Market, and we have not been paid to write this message. Always do your due diligence.
