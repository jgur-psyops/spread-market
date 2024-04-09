import React from "react";
import { useLocation, useParams } from "react-router-dom";
import { VAULT_TO_NAME } from "../constants";

export const LpPage = () => {
  const { key } = useParams();

  return (
    <div>
      {"Deposit into the " + VAULT_TO_NAME.get(key!) + " Vault"}
      <h2>
        THIS IS A PAGE WHERE LPs WILL DEPOSIT, WITHDRAW, MANAGE POSITION, ETC
      </h2>
    </div>
  );
};

export default LpPage;
