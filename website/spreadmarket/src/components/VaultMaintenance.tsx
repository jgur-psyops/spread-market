import React, { useState } from "react";
import {
  PubkeyInput,
  NumberInput,
  PercentageSlider,
} from "../utils/primitives";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import useSendTxLogic from "../hooks/useSendTx";
import { useSpreadProgram } from "../hooks/useSpreadProgram";
import {
  expireMarket,
  initSpreadVault,
  setVol,
  startMarket,
} from "../package/instructions";
import { PublicKey, Transaction } from "@solana/web3.js";
import {
  MINT_TO_COINGECKO_API,
  PRICE_DECIMALS,
  USDC_MINT_DEVNET,
  u32MAX,
  u32toPercent,
} from "../constants";
import { BN } from "bn.js";

export const VaultMaintenance = () => {
  const wallet = useAnchorWallet();
  const program = useSpreadProgram();
  const { sendTx } = useSendTxLogic();

  const [vaultMaintExpanded, setVaultMaintExpanded] = useState(true);

  const [spreadVault, setSpreadVault] = useState<PublicKey | null>(null);
  const [riskFree, setRiskFree] = useState(0.05);
  const [volatility, setVolatility] = useState(0.75);
  const [assetPrice, setAssetPrice] = useState(0);
  const [callStrikes, setCallStrikes] = useState(Array(8).fill(0));
  const [putStrikes, setPutStrikes] = useState(Array(8).fill(0));

  const handleStrikeChange = (
    index: number,
    value: number,
    isCall: boolean
  ) => {
    const updatedStrikes = isCall ? [...callStrikes] : [...putStrikes];
    updatedStrikes[index] = value;

    if (isCall) {
      setCallStrikes(updatedStrikes);
    } else {
      setPutStrikes(updatedStrikes);
    }
  };

  const setVolatilityButton = async () => {
    if (wallet && program && spreadVault) {
      try {
        const ix = await setVol(
          // @ts-ignore
          program,
          wallet.publicKey,
          spreadVault,
          new BN(volatility * u32MAX),
          riskFree * u32MAX
        );

        let sig = await sendTx(new Transaction().add(ix));
        console.log("sig: " + sig);
        console.log("updated volatility for vault " + spreadVault);
      } catch (error) {
        console.error(error);
      }
    } else {
      alert("Missing some required input");
    }
  };

  const loadCurrentVol = async () => {
    if (spreadVault) {
      let vault = await program.account.spreadVault.fetch(spreadVault);
      setRiskFree(u32toPercent(vault.riskFreeRate));
      setVolatility(u32toPercent(vault.volatility.toNumber()));
    } else {
      alert("Enter a spread vault");
    }
  };

  const getPrice = async () => {
    if (spreadVault) {
      let vault = await program.account.spreadVault.fetch(spreadVault);
      let priceFunction = MINT_TO_COINGECKO_API.get(vault.assetMint.toString());
      if (priceFunction) {
        const price = await priceFunction();
        console.log(
          "price: " + price + " for mint " + vault.assetMint.toString()
        );
        setAssetPrice(price);
      }
    }
  };

  const checkMarket = async () => {
    if (spreadVault) {
      let vault = await program.account.spreadVault.fetch(spreadVault);
      let calls = vault.saleData.calls.flatMap((call) => [
        call.strikeLower.toNumber() / 10 ** PRICE_DECIMALS,
        call.strikeUpper.toNumber() / 10 ** PRICE_DECIMALS,
      ]);
      let puts = vault.saleData.puts.flatMap((put) => [
        put.strikeLower.toNumber() / 10 ** PRICE_DECIMALS,
        put.strikeUpper.toNumber() / 10 ** PRICE_DECIMALS,
      ]);
      setCallStrikes(calls);
      setPutStrikes(puts);
    }
  };

  const dumpInfo = async () => {
    if (spreadVault) {
      let vault = await program.account.spreadVault.fetch(spreadVault);
      console.log("vault lp mint: " + vault.lpMint);
      console.log("vault funding pool: " + vault.fundingPool);
      console.log("vault premiums pool: " + vault.premiumsPool);
      console.log("vault fee pool: " + vault.feePool);
    }
  };

  const startMarketEpochButton = async () => {
    if (wallet && program && spreadVault) {
      let vault = await program.account.spreadVault.fetch(spreadVault);
      const epoch = vault.epoch;
      const assetOracle = vault.assetOracle;
      let price = 0;

      // TODO should validate users's input here a bit.
      // TODO this should execute in pairs
      const sortedCallStrikes = callStrikes.sort((a, b) => a - b);
      const sortedPutStrikes = putStrikes.sort((a, b) => a - b);
      setCallStrikes(sortedCallStrikes);
      setPutStrikes(sortedPutStrikes);
      let calls = sortedCallStrikes.map(
        (strike) => new BN(strike * 10 ** PRICE_DECIMALS)
      );
      let puts = sortedPutStrikes.map(
        (strike) => new BN(strike * 10 ** PRICE_DECIMALS)
      );
      for (let i = 0; i < calls.length; i++) {
        console.log("shipping call: " + calls[i].toNumber());
      }
      for (let i = 0; i < puts.length; i++) {
        console.log("shipping put: " + puts[i].toNumber());
      }

      let priceFunction = MINT_TO_COINGECKO_API.get(vault.assetMint.toString());
      if (priceFunction) {
        price = await priceFunction();
        setAssetPrice(price);
      } else {
        console.error("failed to read price from gecko api, assuming 0");
      }

      try {
        const ix = await startMarket(
          program,
          calls,
          puts,
          new BN(price * 10 ** PRICE_DECIMALS),
          new BN(price * 10 ** PRICE_DECIMALS),
          epoch,
          wallet.publicKey,
          spreadVault,
          assetOracle
        );

        let sig = await sendTx(new Transaction().add(ix));
        console.log("sig: " + sig);
        console.log("started market for vault " + spreadVault);
      } catch (error) {
        console.error(error);
      }
    } else {
      alert("Missing some required input");
    }
  };

  const expireMarketButton = async () => {
    if (wallet && program && spreadVault) {
      let vault = await program.account.spreadVault.fetch(spreadVault);
      const assetOracle = vault.assetOracle;
      const epoch = vault.epoch;
      let price = 0;

      let priceFunction = MINT_TO_COINGECKO_API.get(vault.assetMint.toString());
      if (priceFunction) {
        price = await priceFunction();
        setAssetPrice(price);
      } else {
        console.error("failed to read price from gecko api, assuming 0");
      }

      try {
        const ix = await expireMarket(program, spreadVault, assetOracle, epoch);

        let sig = await sendTx(new Transaction().add(ix));
        console.log("sig: " + sig);
        console.log("updated price for " + spreadVault);
      } catch (error) {
        console.error(error);
      }
    } else {
      alert("Missing some required input");
    }
  };

  return (
    <div className="left-align-container">
      <button
        className="Button-generic"
        onClick={() => setVaultMaintExpanded(!vaultMaintExpanded)}
      >
        {vaultMaintExpanded
          ? "Collapse Vault Maintenance"
          : "Show Vault Maintenance"}
      </button>

      {vaultMaintExpanded && (
        <div
          style={{
            paddingLeft: "4vmin",
          }}
        >
          <PubkeyInput
            setKey={setSpreadVault}
            labelText="Spread Vault"
            value={spreadVault?.toString()}
          />
          <button className="Button-small" onClick={dumpInfo}>
            {"Dump vault Info"}
          </button>
          <hr className="hr-line-break"></hr>
          <span className="Section-header">{"Start a new Market"}</span>

          <div className="Standard-input-row">
            <button className="Button-small" onClick={getPrice}>
              {"Check Asset Price"}
            </button>
            <span>{"Last read price: " + assetPrice}</span>
          </div>
          <div>
            <span>{"Chose strike prices"}</span>
            {Array.from({ length: 4 }, (_, i) => i).map((pairIndex) => (
              <div className="Monospace-row" key={pairIndex}>
                <NumberInput
                  label={`Call strike lower`}
                  value={callStrikes[pairIndex * 2]}
                  setValue={(value) =>
                    handleStrikeChange(pairIndex * 2, value, true)
                  }
                  decimals={6}
                  padTo={17}
                />
                <NumberInput
                  label={` upper`}
                  value={callStrikes[pairIndex * 2 + 1]}
                  setValue={(value) =>
                    handleStrikeChange(pairIndex * 2 + 1, value, true)
                  }
                  decimals={6}
                  padTo={6}
                />
              </div>
            ))}
            {Array.from({ length: 4 }, (_, i) => i).map((pairIndex) => (
              <div className="Monospace-row" key={pairIndex}>
                <NumberInput
                  label={`Put strike lower`}
                  value={putStrikes[pairIndex * 2]}
                  setValue={(value) =>
                    handleStrikeChange(pairIndex * 2, value, false)
                  }
                  decimals={6}
                  padTo={17}
                />
                <NumberInput
                  label={` upper`}
                  value={putStrikes[pairIndex * 2 + 1]}
                  setValue={(value) =>
                    handleStrikeChange(pairIndex * 2 + 1, value, false)
                  }
                  decimals={6}
                  padTo={6}
                />
              </div>
            ))}
          </div>
          <button className="Button-small" onClick={checkMarket}>
            {"Check market"}
          </button>
          <button className="Button-small" onClick={startMarketEpochButton}>
            {"Start new market"}
          </button>
          <hr className="hr-line-break"></hr>
          <span className="Section-header">{"Update Volatility"}</span>
          <PercentageSlider
            label="Fee Rate (%)"
            value={riskFree}
            setValue={setRiskFree}
            step={0.0001}
            min={0}
            max={1}
          />
          <PercentageSlider
            label="Implied Volatility (%)"
            value={volatility}
            setValue={setVolatility}
            step={0.0001}
            min={0}
            max={3}
          />
          <button className="Button-small" onClick={loadCurrentVol}>
            {"Load Current Settings"}
          </button>
          <button className="Button-small" onClick={setVolatilityButton}>
            {"Update Volatility"}
          </button>
          <hr className="hr-line-break"></hr>
          <span className="Section-header">{"Update Market Price"}</span>
          <div></div>
          <button className="Button-small" onClick={getPrice}>
            {"Check Asset Price"}
          </button>
          <button className="Button-small" onClick={expireMarketButton}>
            {"Send current price to market"}
          </button>
          <span>{"Last read price: " + assetPrice}</span>
        </div>
      )}
      <hr className="hr-line-break"></hr>
    </div>
  );
};

export default VaultMaintenance;
