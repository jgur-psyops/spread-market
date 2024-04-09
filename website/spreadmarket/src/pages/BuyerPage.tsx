import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  CALL,
  MINT_TO_COINGECKO_API,
  MINT_TO_DECIMALS,
  PRICE_DECIMALS,
  PUT,
  VAULT_TO_NAME,
} from "../constants";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import useSendTxLogic from "../hooks/useSendTx";
import { useSpreadProgram } from "../hooks/useSpreadProgram";
import { buySpread, deposit, initReceipt } from "../package/instructions";
import {
  createAssociatedTokenAccount,
  createAssociatedTokenAccountInstruction,
  getAccount,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import BN from "bn.js";
import { PublicKey, Transaction } from "@solana/web3.js";
import { NumberInput } from "../utils/primitives";
import { SpreadVault } from "../package/idl";
import { derivePremiumsPool } from "../package/pdas";

export const BuyerPage = () => {
  const { key } = useParams();
  const wallet = useAnchorWallet();
  const program = useSpreadProgram();
  const { sendTx } = useSendTxLogic();

  const [vaultData, setVaultData] = useState<SpreadVault | undefined>();

  const [assetPrice, setAssetPrice] = useState(0);
  const [contracts, setContracts] = useState(0);

  useEffect(() => {
    const getVaultInfo = async () => {
      if (key) {
        const vault = await program.account.spreadVault.fetch(
          new PublicKey(key!)
        );
        setVaultData(vault);
      }
    };

    getVaultInfo();
  }, [key]);

  const buyOptionButton = async (
    strikeLower: number,
    strikeUpper: number,
    isCall: boolean
  ) => {
    if (wallet && program && key) {
      try {
        let vaultKey = new PublicKey(key);
        let vault = await program.account.spreadVault.fetch(vaultKey);
        let userUsdcAta = getAssociatedTokenAddressSync(
          vault.paymentMint,
          wallet.publicKey
        );
        let priceFunction = MINT_TO_COINGECKO_API.get(
          vault.assetMint.toString()
        );
        if (priceFunction) {
          const price = await priceFunction();
          setAssetPrice(price);
        }

        let tx = new Transaction();

        tx.add(
          await buySpread(
            program,
            wallet.publicKey,
            wallet.publicKey,
            vaultKey,
            userUsdcAta,
            vault.premiumsPool,
            vault.assetOracle,
            new BN(contracts),
            new BN(strikeLower),
            new BN(strikeUpper),
            new BN(assetPrice),
            new BN(assetPrice),
            isCall ? CALL : PUT
          )
        );

        let sig = await sendTx(tx);

        console.log("sig: " + sig);
        console.log("buy strikes from: " + strikeLower + " " + strikeUpper);
      } catch (error) {
        console.error(error);
      }
    } else {
      alert("Missing some required input");
    }
  };

  const initRecieptButton = async (
    strikeLower: number,
    strikeUpper: number,
    isCall: boolean
  ) => {
    if (wallet && program && key) {
      let vaultKey = new PublicKey(key);
      let tx = new Transaction();
      tx.add(
        await initReceipt(
          program,
          wallet.publicKey,
          wallet.publicKey,
          vaultKey,
          new BN(strikeLower),
          new BN(strikeUpper),
          isCall ? CALL : PUT
        )
      );
      let sig = await sendTx(tx);
      console.log("sig: " + sig);
      console.log(
        "init account for strikes: " + strikeLower + " " + strikeUpper
      );
    }
  };

  const getPrice = async () => {
    if (key) {
      let vault = await program.account.spreadVault.fetch(new PublicKey(key));
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

  return (
    <div>
      <div>{"Buy options from the " + VAULT_TO_NAME.get(key!) + " Vault"}</div>
      <div className="Standard-input-row">
        <button className="Button-small" onClick={getPrice}>
          {"Check Asset Price"}
        </button>
        <span>{"Last read price: " + assetPrice}</span>
      </div>
      <div>{"Call Spreads"}</div>
      {vaultData?.saleData?.calls
        .filter(
          (call) =>
            call.strikeLower.toNumber() !== 0 &&
            call.strikeUpper.toNumber() !== 0
        )
        .map((call, index) => (
          <>
            <StrikeCard
              key={index}
              isCall={true}
              soldSoFar={vaultData.saleData.calls[index].volumeSold.toNumber()}
              valueSold={vaultData.saleData.calls[index].exposure.toNumber()}
              strikeLower={call.strikeLower.toNumber()}
              strikeUpper={call.strikeUpper.toNumber()}
              onBuyOption={buyOptionButton}
              contracts={contracts}
              setContracts={setContracts}
              initReceipt={initRecieptButton}
            />
          </>
        ))}
      <div>{"Put Spreads"}</div>
      {vaultData?.saleData?.puts
        .filter(
          (put) =>
            put.strikeLower.toNumber() !== 0 && put.strikeUpper.toNumber() !== 0
        )
        .map((put, index) => (
          <StrikeCard
            key={index}
            isCall={false}
            soldSoFar={vaultData.saleData.puts[index].volumeSold.toNumber()}
            valueSold={vaultData.saleData.puts[index].exposure.toNumber()}
            strikeLower={put.strikeLower.toNumber()}
            strikeUpper={put.strikeUpper.toNumber()}
            onBuyOption={buyOptionButton}
            contracts={contracts}
            setContracts={setContracts}
            initReceipt={initRecieptButton}
          />
        ))}
      <div className="Section-header">{"Redeem Expired Options"}</div>
      {"Coming soon..."}
    </div>
  );
};

interface StrikeCardProps {
  isCall: boolean;
  soldSoFar: number;
  valueSold: number;
  strikeLower: number;
  strikeUpper: number;
  contracts: number;
  setContracts: (value: number) => void;
  onBuyOption: (
    strikeLower: number,
    strikeUpper: number,
    isCall: boolean
  ) => void;
  initReceipt: (
    strikeLower: number,
    strikeUpper: number,
    isCall: boolean
  ) => void;
}
const StrikeCard: React.FC<StrikeCardProps> = ({
  isCall,
  strikeLower,
  strikeUpper,
  soldSoFar,
  valueSold,
  onBuyOption,
  contracts,
  setContracts,
  initReceipt,
}) => {
  return (
    <div
      className="strike-card"
      style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0" }}
    >
      <div>Strike Lower: {strikeLower / 10 ** PRICE_DECIMALS}</div>
      <div>Strike Upper: {strikeUpper / 10 ** PRICE_DECIMALS}</div>
      <div>
        {"Sold so far: " +
          soldSoFar +
          " exposure in $: " +
          valueSold / 10 ** PRICE_DECIMALS}
      </div>
      <div>{"Estimated price per contract: " + " COMING SOON"}</div>
      {/* TODO parse out the selected index once we have support for multiple strikes*/}

      <NumberInput
        label={"Contracts to Buy"}
        value={contracts}
        setValue={setContracts}
        decimals={0}
        padTo={10}
        addWidth={4}
      />
      <button
        className="Button-small"
        onClick={() => onBuyOption(strikeLower, strikeUpper, isCall)}
      >
        {"Buy Option"}
      </button>

      <button
        className="Button-small"
        onClick={() => initReceipt(strikeLower, strikeUpper, isCall)}
      >
        {"Init Receipt"}
      </button>
    </div>
  );
};

export default BuyerPage;
