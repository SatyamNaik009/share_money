import React, { useContext, useState, useEffect } from "react";
import { AppState } from "../App";
import { ethers } from "ethers";
import share from "../share/share.json";

const RecentTx = () => {
  const App = useContext(AppState);
  const [data, setData] = useState([]);

  useEffect(() => {
    async function getData() {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const shareContract = new ethers.Contract(
        App.shareContractAddress,
        share.output.abi,
        signer
      );
      const tx = await shareContract.filters.transactions(App.address);
      const txData = await shareContract.queryFilter(tx);
      setData(txData);
    }

    getData();
  });
  return (
    <div className="flex flex-col items-center justify-center p-3 text-white">
      {data.map((e) => {
        return (
          <div
            className={`bg-black rounded-lg bg-opacity-60 border-2 border-blue-900 border-opacity-80 w-4/5 mt-2`}
          >
            <div className="flex w-full items-center justify-center rounded-t-lg">
              <div className="w-full py-2 px-2">
                <p className="text-xl font-mono">
                  Amount: {ethers.formatEther(e.args.amount)} {e.args.symbol}
                </p>
                <p className="text-xs font-mono">to: {e.args.to}</p>
              </div>
            </div>
            <a
              target={"_blank"}
              href={`${App.explorer}/tx/${e.transactionHash}`}
            >
              <div className="font-mono w-full rounded-b-lg bg-gray-900 text-center cursor-pointer text-opacity-30">
                View Transaction
              </div>
            </a>
          </div>
        );
      })}
    </div>
  );
};

export default RecentTx;
