import React, { useContext, useState } from "react";
import { AppState } from "../App";

const Header = () => {
  const { ethereum } = window;
  const App = useContext(AppState);
  const [showChains, setShowChains] = useState(false);

  const changeToAmoy = async () => {
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x13882" }],
    });
    setShowChains(false);
  };

  const changeToSepolia = async () => {
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0xaa36a7" }],
    });
    setShowChains(false);
  };

  return (
    <div className="w-full h-1/4 pt-4 flex justify-between items-start">
      <img className="h-12 ml-2" src="share.png" />
      <div className="flex justify-between items-start">
        {/*wallet*/}
        <div className="text-xl mr-4 font-sans border-opacity-60 border-2 border-blue-900 font-medium cursor-pointer bg-black px-4 py-2 text-white rounded-lg flex justify-between items-center">
          {App.address.slice(0, 4)}...{App.address.slice(38)}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            fill="currentColor"
            class="ml-2 bi bi-wallet2"
            viewBox="0 0 16 16"
          >
            <path d="M12.136.326A1.5 1.5 0 0 1 14 1.78V3h.5A1.5 1.5 0 0 1 16 4.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 13.5v-9a1.5 1.5 0 0 1 1.432-1.499L12.136.326zM5.562 3H13V1.78a.5.5 0 0 0-.621-.484L5.562 3zM1.5 4a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-13z" />
          </svg>
        </div>

        {/*chain*/}
        <div
          onClick={() => setShowChains(true)}
          className="text-xl py-2 px-4 mr-2 font-sans border-opacity-60 border-2 border-blue-900 font-medium cursor-pointer bg-black text-white rounded-lg flex justify-between items-center"
        >
          {App.chain == "Amoy" || App.chain == "Sepolia" ? (
            <img className="h-6 mr-2" src="ethereum-eth.svg" />
          ) : (
            <img className="h-6 mr-2" src="polygon.png" />
          )}

          {App.chain}
        </div>

        {/*all chain*/}
        <div
          onClick={changeToAmoy}
          className={`${showChains ? "" : "hidden"} absolute right-0 z-50`}
        >
          <div className="text-xl py-2 px-4 mr-2 font-sans border-opacity-60 border-2 border-blue-900 font-medium cursor-pointer hover:bg-gray-900 bg-black text-white rounded-lg flex justify-between items-center">
            <img className="h-6 mr-2" src="ethereum-eth.svg" />
            Amoy
          </div>
          <div
            onClick={changeToSepolia}
            className="text-xl py-2 px-4 mr-2 font-sans border-opacity-60 border-2 border-blue-900 font-medium cursor-pointer hover:bg-gray-900 bg-black text-white rounded-lg flex justify-between items-center"
          >
            <img className="h-6 mr-2" src="polygon.png" />
            Sepolia
          </div>

          <div
            onClick={() => setShowChains(false)}
            className="text-xl py-1 px-4 mr-2 font-sans border-opacity-60 border-2 border-blue-900 font-medium cursor-pointer bg-red-600 text-white rounded-lg flex justify-center items-center"
          >
            Close
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              fill="currentColor"
              class="ml-2 bi bi-x-circle"
              viewBox="0 0 16 16"
            >
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
