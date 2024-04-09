import InitVault from "../components/InitVault";
import VaultMaintenance from "../components/VaultMaintenance";

export const AdminPage = () => {
  // const wallet = useAnchorWallet();
  // const program = useSpreadProgram();
  // const { sendTx } = useSendTxLogic();

  return (
    <div className="left-align-container">
      <div className="Section-header">
        {"Create and maintain existing spread vaults"}
      </div>
      <InitVault></InitVault>
      <VaultMaintenance></VaultMaintenance>
    </div>
  );
};

export default AdminPage;
