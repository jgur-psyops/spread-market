import React from "react";
import { useParams } from "react-router-dom";
import { VAULT_TO_NAME } from "../constants";

export const BuyerPage = () => {
  const { key } = useParams();

  return (
    <div>
      {"Buy options from the " + VAULT_TO_NAME.get(key!) + " Vault"}
      <p>THIS IS A PAGE WHERE BUYERS WILL BUY, EXERCISE, AND MANAGE OPTIONS</p>
    </div>
  );
};

export default BuyerPage;
