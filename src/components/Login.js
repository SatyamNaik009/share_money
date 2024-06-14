import React, { useState, useContext } from "react";
import { AppState } from "../App";

const Login = () => {
  const App = useContext(AppState);

  const { ethereum } = window;
  const [error, setError] = useState("");

  const LoginWallet = async () => {
    try {
      await ethereum.request({
        method: "wallet_requestPermissions",
        params: [{ eth_accounts: {} }],
      });
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      App.setAddress(accounts[0]);
      const chainId = await ethereum.request({ method: "eth_chainId" });

      App.getBal();

      if (chainId == "0x3") {
        App.setChain("Ropsten");
        App.setLogin(true);
      } else if (chainId == "0x1") {
        App.setChain("eth");
        App.setLogin(true);
        App.setCurrency("Ethereum");
        App.setSymbol("Eth");
      } else if (chainId == "0xaa36a7") {
        App.setChain("Sepolia");
        App.setLogin(true);
        App.setCurrency("SepoliaEther");
        App.setSymbol("SepEth");
        App.setShareContractAddress(
          "0xc18f92fB6e01A70516B6B62869899E80d3c800aA"
        );
        App.setExplorer("https://sepolia.etherscan.io/");
      } else if (chainId == "0x13882") {
        App.setChain("Amoy");
        App.setLogin(true);
        App.setCurrency("AmoyEther");
        App.setSymbol("Matic");
        App.setShareContractAddress(
          "x05afE8E09CD728E702f0FDC86A3A78F5990a55C3"
        );
        App.setExplorer("https://amoy.polygonscan.com/");
      } else {
        setError("choose AMOY");
        App.setLogin(false);
      }
    } catch (error) {
      setError(`"${error.message}"`);
    }
  };

  return (
    <div className="min-w-full h-4/5 flex justify-center flex-col items-center">
      <img className="h-20" src="share.png" />
      <div className="w-1/3 h-40 mt-4 bg-black bg-opacity-70 p-2 rounded-lg shadow-lg border-opacity-40 border-4 border-black flex flex-col justify-center items-center">
        <h1 className="text-white text-2xl font-medium text-center">Login</h1>
        {ethereum != undefined ? (
          <div
            onClick={LoginWallet}
            className="flex border-opacity-60 bg-opacity-90 text-lg font-medium border-2 border-blue-800 cursor-pointer bg-green-800 text-white mt-4 rounded-lg justify-center items-center py-1 px-2"
          >
            Connect With Metamask
            <img className="h-10" src="metamask.png" />
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center">
            {/* install Metamask */}
            <a
              target={"_blank"}
              href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn"
            >
              <div className="flex border-opacity-60 bg-opacity-90 text-lg font-medium border-2 border-blue-800 cursor-pointer bg-green-800 text-white mt-4 rounded-lg justify-center items-center py-1 px-2">
                Install Metamask
                <img className="h-10" src="metamask.png" />
              </div>
            </a>
            <p className="text-red-600 text-lg mt-2">
              Login Required Metamask Extension
            </p>
          </div>
        )}
        <p className="text-red-600 text-lg mt-2">{error}</p>
      </div>
    </div>
  );
};

export default Login;
