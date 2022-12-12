import "./App.css";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import Staking_contract from "./artifacts/contracts/staking _contract.sol/stakingContract.json";
import Navbar from "./components/Navbar.jsx";
import Functions from "./components/contract_interaction";
function App() {
  const [provider, setProvider] = useState(undefined);
  const [signer, setSigner] = useState(undefined);
  const [signerAddress, setSignerAddress] = useState(undefined);
  const [stakingContract, setStakingContract] = useState(undefined);

  useEffect(() => {
    const initialize = async () => {
      setProvider(await new ethers.providers.Web3Provider(window.ethereum));
      setStakingContract(
        await new ethers.Contract(
          // paste the staking contract address here
          "0x0EE34d8558486FC726082766651630107Ca5581F",
          Staking_contract.abi
        )
      );
      console.log("reload");
    };
    initialize();
  }, []);

  const isConnected = () => signer !== undefined;

  const getSigner = async (provider) => {
    provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();

    signer.getAddress().then((address) => {
      setSignerAddress(address);
    });

    return signer;
  };

  const connect = () => {
    getSigner(provider).then((signer) => {
      setSigner(signer);
    });
  };
  return (
    <div className="App container-fluid">
      <header className="body">
        <Navbar isConnected={isConnected} connect={connect} />
        {isConnected() ? (
          <div>
            <Functions signer={signer} stakingContract={stakingContract} />
          </div>
        ) : (
          <div className="pad">
            <p>
              You are not connected. Please connect your crypto-wallet first.
            </p>
          </div>
        )}
      </header>
    </div>
  );
}
export default App;
