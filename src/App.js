import { useState, createContext, useEffect } from "react";
import Header from "./components/Header";
import Main from "./components/Main";
import Login from "./components/Login";
import { ethers } from "ethers";
import share from "./share/share.json";

const AppState = createContext();

function App() {
  const { ethereum } = window;
  const [login, setLogin] = useState(false);
  const [address, setAddress] = useState("");
  const [chain, setChain] = useState("");
  const [symbol, setSymbol] = useState("");
  const [balance, setBalance] = useState("");
  const [currency, setCurrency] = useState("");
  const [ercTokenAddress, setErcTokenAddress] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [shareContractAddress, setShareContractAddress] = useState("");
  const [explorer, setExplorer] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [tokenChanged, setTokenChanged] = useState(false);
  const [showErc, setShowErc] = useState(false);
  const [ercLoading, setErcLoading] = useState(false);
  const [txLoading, setTxLoading] = useState(false);
  const [showRecentTx, setShowRecentTx] = useState(false);
  const [recentTx, setRecentTx] = useState({
    txhash: "",
    from: "",
    to: "",
    amount: "",
    symbol: "",
  });
  const [saveTxLoad, setSaveTxLoad] = useState(false);

  useEffect(() => {
    const handleChainChanged = async (chainId) => {
      if (chainId === "0x3") {
        setChain("Ropsten");
      } else if (chainId === "0x1") {
        setChain("eth");
      } else if (chainId === "0xaa36a7") {
        setChain("Sepolia");
        setCurrency("SepoliaEther");
        setSymbol("SepEth");
        setShareContractAddress("0xc18f92fB6e01A70516B6B62869899E80d3c800aA");
        setExplorer("https://sepolia.etherscan.io/");
      } else if (chainId === "0x13882") {
        setChain("Amoy");
        setCurrency("AmoyEther");
        setSymbol("Matic");
        setShareContractAddress("0x05afE8E09CD728E702f0FDC86A3A78F5990a55C3");
        setExplorer("https://amoy.polygonscan.com/");
      } else {
        setLogin(false);
      }

      getBal();
    };

    ethereum.on("chainChanged", handleChainChanged);
    ethereum.on("accountsChanged", handleAccountsChanged);

    return () => {
      ethereum.removeListener("chainChanged", handleChainChanged);
      ethereum.removeListener("accountsChanged", handleAccountsChanged);
    };
  }, []);

  async function getBal() {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const add = await signer.getAddress();
    const balance = await provider.getBalance(add);
    setBalance(ethers.formatEther(balance));
  }

  const abi = [
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)",
    "function balanceOf(address a) view returns (uint)",
    "function transfer(address to, uint amount) returns (bool)",
  ];

  const selectToken = async () => {
    try {
      setErcLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(ercTokenAddress, abi, provider);
      const balance = await contract.balanceOf(address);
      const symbol = await contract.symbol();
      setBalance(ethers.formatEther(balance));
      setSymbol(symbol);
      setTokenChanged(true);
      setErcLoading(false);
    } catch (error) {
      setError(error.message);
      setErcLoading(false);
    }
  };

  const removeToken = async () => {
    try {
      if (chain === "Amoy") {
        setCurrency("AmoyEther");
        setSymbol("Matic");
      } else if (chain === "Sepolia") {
        setCurrency("SepoliaEther");
        setSymbol("SepEth");
      }

      setErcTokenAddress("");
      setShowErc(false);
      setTokenChanged(false);
      getBal();
    } catch (error) {
      setError(error.message);
    }
  };

  const resolveENSName = async (name) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const address = await provider.resolveName(name);
      if (!address) {
        throw new Error(`ENS name ${name} is not correctly configured`);
      }
      return address;
    } catch (error) {
      console.error("ENS resolution error:", error);
      throw error;
    }
  };

  const transferAmount = async () => {
    setTxLoading(true);
    setMessage("");
    setError("");
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      let resolvedRecipientAddress = recipientAddress;
      if (recipientAddress.endsWith(".eth")) {
        resolvedRecipientAddress = await resolveENSName(recipientAddress);
      }

      if (tokenChanged) {
        const contract = new ethers.Contract(ercTokenAddress, abi, signer);
        const tx = await contract.transfer(
          resolvedRecipientAddress,
          ethers.parseEther(amount)
        );
        await tx.wait();
        setMessage("Transaction successful");
        selectToken();
        setRecentTx({
          txhash: tx.hash,
          from: address,
          to: recipientAddress,
          amount: amount,
          symbol: symbol,
        });

        setShowRecentTx(true);
      } else {
        const shareContract = new ethers.Contract(
          shareContractAddress,
          share.output.abi,
          signer
        );
        const tx = await shareContract._transfer(
          resolvedRecipientAddress,
          symbol,
          {
            value: ethers.parseEther(amount),
          }
        );
        await tx.wait();
        setMessage("Transaction successful");
        getBal();
      }

      setAmount("");
    } catch (error) {
      //console.error("Transfer error:", error);
      setError(error.message);
    }
    setTxLoading(false);
  };

  const saveTx = async () => {
    setSaveTxLoad(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const shareContract = new ethers.Contract(
        shareContractAddress,
        share.output.abi,
        signer
      );
      const tx = await shareContract.saveTx(
        recentTx.from,
        recentTx.to,
        ethers.parseEther(recentTx.amount),
        recentTx.symbol
      );
      await tx.wait();

      setMessage("Transaction Saved Sucessfully!");
    } catch (error) {
      setError(error.message);
    }

    setShowRecentTx(false);
    setSaveTxLoad(false);
  };

  const handleAccountsChanged = async (accounts) => {
    setAddress(accounts[0]);
  };
  useEffect(() => {
    if (tokenChanged) {
      selectToken();
    } else {
      getBal();
    }
  }, [address]);

  useEffect(() => {
    removeToken();
  }, [chain]);
  return (
    <AppState.Provider
      value={{
        login,
        setLogin,
        address,
        setAddress,
        chain,
        setChain,
        symbol,
        setSymbol,
        balance,
        setBalance,
        currency,
        setCurrency,
        getBal,
        ercTokenAddress,
        setErcTokenAddress,
        recipientAddress,
        setRecipientAddress,
        amount,
        setAmount,
        shareContractAddress,
        setShareContractAddress,
        explorer,
        setExplorer,
        error,
        setError,
        message,
        setMessage,
        tokenChanged,
        setTokenChanged,
        showErc,
        setShowErc,
        ercLoading,
        setErcLoading,
        removeToken,
        selectToken,
        transferAmount,
        txLoading,
        setTxLoading,
        showRecentTx,
        setShowRecentTx,
        recentTx,
        setRecentTx,
        saveTxLoad,
        setSaveTxLoad,
        saveTx,
      }}
    >
      <div className="min-w-full h-screen">
        {login ? (
          <div className="min-w-full min-h-full">
            <Header />
            <Main />
          </div>
        ) : (
          <Login />
        )}
      </div>
    </AppState.Provider>
  );
}

export default App;
export { AppState };
