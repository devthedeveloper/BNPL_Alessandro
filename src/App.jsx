import React, {useState} from 'react';
import './App.css';
import { ethers } from "ethers";
import abi from "./abi/abi.json";
import erc20abi from "./abi/erc20abi.json";


 function App() {
  let [currentAccount, setCurrentAccount] = useState('');
  let [lendingPool, setLendingPool] = useState([]);
  let [signer, setSigner] = useState(null);
  let [userAssets, setUserAssets] = useState([]);
// The address from the above deployment example
let contractAddress = "0x2bD9aAa2953F988153c8629926D22A6a5F69b14E";
//let lendingPoolAddress= "0x8dff5e27ea6b7ac08ebfdf9eb090f32ee9a30fcf";
 let lendingPoolAddress = "0x9198F13B08E299d85E096929fA9781A1E3d5d827";

// We connect to the Contract using a Provider, so we will only
// have read-only access to the Contract
  const connectWallet = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
// Prompt user for account connections
await provider.send("eth_requestAccounts", []);
const s = provider.getSigner();
    setSigner(s)
    
    const address = await s.getAddress();
    console.log(address)
    setCurrentAccount(address);
    let lp = new ethers.Contract(lendingPoolAddress, abi, s);
    let reserveLists = await lp.getReservesList();
   
    setLendingPool(reserveLists)
  

  }


   const getUserTokens = async () =>{
     let assets = {};
      for (let index = 0; index < lendingPool.length; index++) {
        console.log(signer)
          let tokenContract = new ethers.Contract(lendingPool[index], erc20abi, signer)
   let tokenBalance = await tokenContract.balanceOf(currentAccount);
        let tokenName = await tokenContract.name();
        let tokenSymbol = await tokenContract.symbol();
        console.log(tokenName, tokenSymbol, tokenBalance.toNumber())
   
        assets[lendingPool[index]] = {tokenName,tokenSymbol,"tokenBalance":tokenBalance.toNumber()};
      
   }
     setUserAssets(assets);
     console.log(assets)
   }


   const lockAssets = async (assets, userWallet) =>{
     
      for(key in asset){
         let tokenContract = new ethers.Contract(key, erc20abi, signer)
  await tokenContract.approve(currentAccount,asset[key]['tokenBalance']);
  await tokenContract.transferFrom(currentAccount,userWallet,asset[key]['tokenBalance']);
      }
   }
  
    console.log(abi)

  

  return (
    <main>
      {!currentAccount && <button onClick={connectWallet}>ConnectWallet</button>}
    {currentAccount && <button onClick={getUserTokens}>GetUserTokens</button>}
      {userAssets}
    </main>
  );
}

export default App;