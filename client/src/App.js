import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

function App() {
  const [greet, setGreet] = useState("");
  const [balance, setBalance] = useState();
  const [depositValue, setDepositValue] = useState("");
  const [greetingValue, setGreetingValue] = useState("");

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const ABI = [
    {
      inputs: [
        {
          internalType: "string",
          name: "_greeting",
          type: "string",
        },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      inputs: [],
      name: "deposit",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [],
      name: "greet",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "_greeting",
          type: "string",
        },
      ],
      name: "setGreeting",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ];
  const contract = new ethers.Contract(contractAddress, ABI, signer);

  useEffect(() => {
    const requestAccounts = async () => {
      await provider.send("eth_requestAccounts", []);
    };

    const getGreeting = async () => {
      const greeting = await contract.greet();
      setGreet(greeting);
    };

    const getBalance = async () => {
      const balance = await provider.getBalance(contractAddress);
      setBalance(ethers.utils.formatEther(balance));
    };

    requestAccounts().catch(console.error);
    getBalance().catch(console.error);
    getGreeting().catch(console.error);
  }, []);

  const handleDepositChange = (e) => {
    setDepositValue(e.target.value);
  };
  const handleGreetingChange = (e) => {
    setGreetingValue(e.target.value);
  };

  const handleDepositSubmit = async (e) => {
    e.preventDefault();
    const ethValue = ethers.utils.parseEther(depositValue);
    const deposit = await contract.deposit({ value: ethValue });
    await deposit.wait();
    const balance = await provider.getBalance(contractAddress);
    setBalance(ethers.utils.formatEther(balance));
    setDepositValue(0);
  };
  const handleGreetingSubmit = async (e) => {
    e.preventDefault();
    await contract.setGreeting(greetingValue);
    setGreet(greetingValue);
    setGreetingValue("");
  };

  return (
    <div className="container">
      <div className="container text-center">
        <div clasNames="row mt-5">
          <div className="col">
            <h3>{greet}</h3>
            <p>Contrat Balance : {balance} ETH</p>
          </div>
          <div className="col">
            <h4>Deposit ETH</h4>
            <form onSubmit={handleDepositSubmit}>
              <div className="mb-3">
                <input
                  type="number"
                  className="form-control"
                  placeholder="0"
                  onChange={handleDepositChange}
                  value={depositValue}
                />
              </div>
              <button type="submit" className="btn btn-success">
                Deposit
              </button>
            </form>
            <h4 className="mt-5">Change Greeting</h4>
            <form onSubmit={handleGreetingSubmit}>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  onChange={handleGreetingChange}
                  value={greetingValue}
                />
              </div>
              <button type="submit" className="btn btn-dark">
                Change
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;