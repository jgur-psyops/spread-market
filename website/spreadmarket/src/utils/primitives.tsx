import { PublicKey } from "@solana/web3.js";
import { FC, useEffect, useState } from "react";
import { checkAndGetPubkey } from "./derives";

/**
 * Generic percentage input (0 to 1 as float)
 * @param param0
 * @returns
 */
export const PercentageSlider: FC<{
  label: string;
  value: number;
  setValue: (value: number) => void;
  step?: number;
  min?: number;
  max?: number;
}> = ({ label, value, setValue, step = 0.01, min = 0, max = 1 }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(parseFloat(e.target.value));
  };

  return (
    <div className = "Standard-input-row">
      <label>
        {label}
        <input
          type="range"
          min={min.toString()}
          max={max.toString()}
          value={value.toString()}
          onChange={handleChange}
          step={step}
          style={{ marginRight: "10px", verticalAlign: "middle" }}
        />
      </label>
      <span>{(value * 100).toFixed(2)}%</span>
    </div>
  );
};

/**
 * Generic monotype number input with label. Pads label to desired length (in chars)
 * @param param0
 * @returns
 */
export const NumberInput: FC<{
  label: string;
  value: number;
  setValue: (value: number) => void;
  decimals: number;
  padTo: number;
  addWidth?: number;
  min?: number;
  monospace?: boolean;
}> = ({
  label,
  value,
  setValue,
  decimals,
  padTo,
  addWidth,
  min,
  monospace,
}) => {
  const [displayValue, setDisplayValue] = useState(value.toLocaleString());

  useEffect(() => {
    setDisplayValue(value.toLocaleString());
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (Number.isFinite(val) && val >= 0) {
      setValue(val);
    }
  };

  const handleBlur = () => {
    setDisplayValue(value.toLocaleString());
  };

  const rPadding = padTo - label.length;
  let inputWidth = decimals + 4;
  if (addWidth) {
    inputWidth += addWidth;
  }
  const step = decimals == 0 ? 1 : "0." + "0".repeat(decimals - 1) + "1";
  const inputMin = min ? min : 1;

  return (
    <div className={monospace ? "Monospace-row" : "Standard-input-row"}>
      <span style={{ paddingRight: `${rPadding}ch` }}>{`${label}: `}</span>
      <div className="tiny-vertical-divider-one-char"></div>
      <input
        className="Input-box-small"
        style={{ width: `${inputWidth}ch` }}
        type="number"
        min={inputMin}
        step={`${step}`}
        value={value}
        onChange={handleInputChange}
        onBlur={handleBlur}
      />
      <div className="tiny-vertical-divider-one-char"></div>
      <div>{displayValue}</div>
      <div className="tiny-vertical-divider-one-char"></div>
    </div>
  );
};

/**
 * Generic input that validates if the contents are a valid pubkey and uses the callback function if
 * it is. Does nothing if the input is not a valid Pubkey.
 * @param param0
 * @returns
 */
export const PubkeyInput: FC<{
  setKey: (key: PublicKey) => void;
  labelText: string;
  value?: string;
}> = ({ setKey, labelText, value }) => {
  // const [inputValue, setInputValue] = useState(value);
  const [hasEntry, setHasEntry] = useState(false);
  const [keyOk, setKeyOk] = useState(false);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (
      e.target.value == "" 
   //   || e.target.value == PublicKey.default.toString()
    ) {
      setHasEntry(false);
      return;
    } else {
      setHasEntry(true);
    }

    const key = checkAndGetPubkey(e.target.value, true);
    if (key) {
      setKey(key);
      setKeyOk(true);
    } else {
      setKeyOk(false);
    }
  };

  let okIndicator = <></>;
  if (hasEntry) {
    if (keyOk) {
      okIndicator = <span style={{ fontSize: "1.5vmin" }}>✅</span>;
    } else {
      okIndicator = <span style={{ fontSize: "1.5vmin" }}>❌</span>;
    }
  }

  return (
    <div className="Standard-input-row">
      {labelText}
      <div className="tiny-vertical-divider-one-char"></div>
      <input
        className="Input-box-pubkey"
        type="text"
        spellCheck="false"
        placeholder="*Paste a Pubkey*"
        value={value /* && value != PublicKey.default.toString() */ ? value : ""}
        onChange={handleInputChange}
      />
      <div className="tiny-vertical-divider"></div>
      {okIndicator}
    </div>
  );
};
